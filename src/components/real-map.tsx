"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Valla } from "@/data/types";
import { fmtM } from "@/lib/format";

// Mapa real: MapLibre GL JS (BSD) + vector tiles de OpenFreeMap (sin API key,
// uso comercial permitido). Nuestras capas encima: pins HTML con precio,
// círculo de radio de visibilidad en metros reales y conos de dirección de
// vista, todo como GeoJSON que escala con el zoom.

const ESTILO = "https://tiles.openfreemap.org/styles/positron";
const KORY = "#724CF5";

const CENTROS: Record<string, { center: [number, number]; zoom: number }> = {
  "Bogotá": { center: [-74.09, 4.652], zoom: 11.4 },
  "Medellín": { center: [-75.578, 6.228], zoom: 12.2 },
};

interface Props {
  vallas: Valla[];
  ciudad: "Bogotá" | "Medellín";
  conAlcance: boolean;
  hoverId: number | null;
  selId: number | null;
  onSelect: (id: number | null) => void;
  onHover: (id: number | null) => void;
}

/** Punto a `radioM` metros del origen con rumbo `rumbo` (0 = norte, horario). */
function destino(lng: number, lat: number, radioM: number, rumbo: number): [number, number] {
  const rad = (rumbo * Math.PI) / 180;
  return [
    lng + (radioM * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180)),
    lat + (radioM * Math.cos(rad)) / 111320,
  ];
}

function circulo(lng: number, lat: number, radioM: number): [number, number][] {
  return Array.from({ length: 65 }, (_, i) => destino(lng, lat, radioM, (i * 360) / 64));
}

function sector(
  lng: number,
  lat: number,
  radioM: number,
  rumbo: number,
  apertura = 62,
): [number, number][] {
  const arco = Array.from({ length: 17 }, (_, i) =>
    destino(lng, lat, radioM, rumbo - apertura / 2 + (apertura * i) / 16),
  );
  return [[lng, lat], ...arco, [lng, lat]];
}

function aGeoJSON(vallas: Valla[]) {
  const features: object[] = [];
  for (const v of vallas) {
    if (v.lng === undefined || v.lat === undefined) continue;
    const radio = v.alcance ?? 300;
    const rumbo = v.vista ?? 0;
    features.push({
      type: "Feature",
      id: v.id,
      properties: { tipo: "circulo" },
      geometry: { type: "Polygon", coordinates: [circulo(v.lng, v.lat, radio)] },
    });
    const conos = v.dobleCara ? [rumbo, rumbo + 180] : [rumbo];
    for (const r of conos) {
      features.push({
        type: "Feature",
        id: v.id,
        properties: { tipo: "cono" },
        geometry: { type: "Polygon", coordinates: [sector(v.lng, v.lat, radio, r)] },
      });
    }
  }
  return { type: "FeatureCollection", features } as GeoJSON.FeatureCollection;
}

const activoExpr = (hi: number, lo: number): maplibregl.ExpressionSpecification => [
  "case",
  ["boolean", ["feature-state", "activo"], false],
  hi,
  lo,
];

export function RealMap({ vallas, ciudad, conAlcance, hoverId, selId, onSelect, onHover }: Props) {
  const contRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<number, { marker: maplibregl.Marker; el: HTMLButtonElement }>>(
    new Map(),
  );
  const [listo, setListo] = useState(false);

  // Callbacks vivos para los listeners de los markers (se crean una vez).
  const cbRef = useRef({ onSelect, onHover });
  cbRef.current = { onSelect, onHover };

  useEffect(() => {
    if (!contRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: contRef.current,
      style: ESTILO,
      center: CENTROS[ciudad].center,
      zoom: CENTROS[ciudad].zoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.on("click", () => cbRef.current.onSelect(null));
    map.on("load", () => {
      const primerSimbolo = map.getStyle().layers?.find((l) => l.type === "symbol")?.id;
      map.addSource("alcance", { type: "geojson", data: aGeoJSON([]) });
      map.addLayer(
        {
          id: "alcance-circulo",
          type: "fill",
          source: "alcance",
          filter: ["==", ["get", "tipo"], "circulo"],
          paint: { "fill-color": KORY, "fill-opacity": activoExpr(0.16, 0.07) },
        },
        primerSimbolo,
      );
      map.addLayer(
        {
          id: "alcance-circulo-borde",
          type: "line",
          source: "alcance",
          filter: ["==", ["get", "tipo"], "circulo"],
          paint: {
            "line-color": KORY,
            "line-opacity": activoExpr(0.65, 0.35),
            "line-width": 1.5,
            "line-dasharray": [2, 2],
          },
        },
        primerSimbolo,
      );
      map.addLayer(
        {
          id: "alcance-cono",
          type: "fill",
          source: "alcance",
          filter: ["==", ["get", "tipo"], "cono"],
          paint: { "fill-color": KORY, "fill-opacity": activoExpr(0.42, 0.25) },
        },
        primerSimbolo,
      );
      setListo(true);
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // El centro inicial usa la ciudad del primer render; los cambios los maneja el efecto de vuelo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Datos: capa de alcance + markers de precio.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !listo) return;
    (map.getSource("alcance") as maplibregl.GeoJSONSource).setData(aGeoJSON(vallas));

    for (const { marker } of markersRef.current.values()) marker.remove();
    markersRef.current.clear();
    for (const v of vallas) {
      if (v.lng === undefined || v.lat === undefined) continue;
      // MapLibre posiciona el elemento raíz con transform; el estilo del pin
      // (scale/colores) vive en un botón interno para no pisarlo.
      const raiz = document.createElement("div");
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = fmtM(v.precio);
      el.setAttribute("aria-label", `${v.nombre} · ${fmtM(v.precio)} por día`);
      el.className =
        "cursor-pointer rounded-full border px-3 py-1.5 font-mono text-xs font-bold whitespace-nowrap shadow-[0_4px_12px_rgba(15,23,42,0.28)] transition-transform duration-150";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        cbRef.current.onSelect(v.id);
      });
      el.addEventListener("mouseenter", () => cbRef.current.onHover(v.id));
      el.addEventListener("mouseleave", () => cbRef.current.onHover(null));
      raiz.appendChild(el);
      const marker = new maplibregl.Marker({ element: raiz }).setLngLat([v.lng, v.lat]).addTo(map);
      markersRef.current.set(v.id, { marker, el });
    }
  }, [vallas, listo]);

  // Reencuadre: sigue a los RESULTADOS, no solo al cambio de ciudad. Así
  // filtrar nunca deja la vista sobre un área sin pines (que se leería como
  // "no hay inventario"). La clave evita volar de nuevo si el conjunto no cambió.
  const claveResultados = vallas
    .filter((v) => v.ciudad === ciudad)
    .map((v) => v.id)
    .join(",");

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !listo) return;
    const enCiudad = vallas.filter(
      (v) => v.ciudad === ciudad && v.lng !== undefined && v.lat !== undefined,
    );
    if (enCiudad.length >= 2) {
      const b = new maplibregl.LngLatBounds();
      for (const v of enCiudad) b.extend([v.lng!, v.lat!]);
      map.fitBounds(b, { padding: 90, maxZoom: 14, duration: 900 });
    } else if (enCiudad.length === 1) {
      map.flyTo({ center: [enCiudad[0].lng!, enCiudad[0].lat!], zoom: 13.5, duration: 900 });
    } else {
      map.flyTo({ ...CENTROS[ciudad], duration: 900 });
    }
    // Depende del conjunto de resultados de la ciudad, no del array completo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ciudad, listo, claveResultados]);

  // Estado hover/selección: intensifica alcance y pin.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !listo) return;
    for (const [id, { el }] of markersRef.current) {
      const activo = id === selId || id === hoverId;
      map.setFeatureState({ source: "alcance", id }, { activo });
      el.style.background = id === selId ? KORY : activo ? "#0F172A" : "#fff";
      el.style.color = activo ? "#fff" : "#0F172A";
      el.style.borderColor = id === selId ? KORY : activo ? "#0F172A" : "#E2E8F0";
      el.style.transform = activo ? "scale(1.12)" : "scale(1)";
      const raiz = el.parentElement;
      if (raiz) raiz.style.zIndex = activo ? "5" : "1";
    }
  }, [hoverId, selId, listo, vallas]);

  // Toggle de la capa de alcance.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !listo) return;
    for (const capa of ["alcance-circulo", "alcance-circulo-borde", "alcance-cono"]) {
      map.setLayoutProperty(capa, "visibility", conAlcance ? "visible" : "none");
    }
  }, [conAlcance, listo]);

  return (
    <div className="relative h-full w-full">
      <div ref={contRef} className="h-full w-full" />
      {/* Zoom propio, coherente con el design system */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Acercar mapa"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[17px] font-bold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.12)] hover:bg-kory-pale"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Alejar mapa"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[17px] font-bold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.12)] hover:bg-kory-pale"
        >
          −
        </button>
      </div>
    </div>
  );
}
