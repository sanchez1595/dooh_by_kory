"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import { categorias, ciudades, presupuestos } from "@/data";
import type { Valla } from "@/data/types";
import { fmt, fmtDia, fmtM, fmtMillones } from "@/lib/format";
import { MedicionBadge } from "@/components/medicion-badge";
import { VallaCard } from "@/components/valla-card";
import { RealMap } from "@/components/real-map";

// Mapa real (MapLibre + OpenFreeMap) con dirección de vista y radio de
// visibilidad por pantalla. Tabs por ciudad, hover sincronizado lista↔mapa
// y tarjeta de selección anclada al mapa.

type CiudadMapa = "Bogotá" | "Medellín";

const CARDINALES = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];

function cardinal(b: number): string {
  return CARDINALES[Math.round((((b % 360) + 360) % 360) / 45) % 8];
}

function vistaLabel(v: Valla): string {
  const b = v.vista ?? 0;
  return v.dobleCara
    ? `Vista al ${cardinal(b)} y ${cardinal(b + 180)} · doble cara`
    : `Vista al ${cardinal(b)}`;
}

export default function MapaPage() {
  const router = useRouter();
  const app = useApp();
  const vallas = useVallasFiltradas();
  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [ciudadMapa, setCiudadMapa] = useState<CiudadMapa>(
    app.ciudad === "Medellín" ? "Medellín" : "Bogotá",
  );
  const [conAlcance, setConAlcance] = useState(true);
  const [mapSel, setMapSel] = useState<number | null>(null);
  const [mapHover, setMapHover] = useState<number | null>(null);

  const abrir = (id: number) => {
    app.set({ vallaId: id });
    router.push(`/valla/${id}`);
  };

  const cambiarCiudad = (c: CiudadMapa) => {
    setCiudadMapa(c);
    setMapSel(null);
  };

  const popupV = mapSel !== null ? vallas.find((v) => v.id === mapSel) : undefined;
  const finDia = app.inicioDia + app.dias - 1;

  const alcanceTotal = vallas.reduce((a, v) => a + v.impN, 0);
  const desde = vallas.length ? Math.min(...vallas.map((v) => v.precio)) : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Toggle Lista/Mapa — solo móvil */}
      <div className="flex justify-center border-b border-slate-200 bg-white py-2 md:hidden">
        <div className="flex overflow-hidden rounded-full border border-slate-200">
          {(["lista", "mapa"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`cursor-pointer px-5 py-1.5 text-xs font-bold capitalize ${
                vista === v ? "bg-ink text-white" : "bg-white text-slate-600"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {/* Barra de filtros (Tesler: la complejidad no vuelve a Inicio) */}
      <div className="hidden items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-5 py-3 md:flex">
        {ciudades.map((c) => (
          <button
            key={c}
            onClick={() => {
              app.set({ ciudad: c });
              if (c !== "Todas") cambiarCiudad(c as CiudadMapa);
            }}
            className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              app.ciudad === c
                ? "border-ink bg-ink text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
            }`}
          >
            {c === "Todas" ? "Todas las ciudades" : c}
          </button>
        ))}
        <span className="h-5 w-px shrink-0 bg-slate-200" />
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => app.set({ cat: c })}
            className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              app.cat === c
                ? "border-ink bg-ink text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
            }`}
          >
            {c === "Todas" ? "Todos los tipos" : c}
          </button>
        ))}
        <span className="h-5 w-px shrink-0 bg-slate-200" />
        <button
          onClick={() => app.set({ soloVision: !app.soloVision })}
          aria-pressed={app.soloVision}
          className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            app.soloVision
              ? "border-[#16A34A] bg-[#ECFDF5] text-[#16A34A]"
              : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
          }`}
        >
          ● Solo Kory Vision
        </button>
        <span className="h-5 w-px shrink-0 bg-slate-200" />
        {presupuestos.map((p) => (
          <button
            key={p}
            onClick={() => app.set({ presupuesto: p })}
            className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              app.presupuesto === p
                ? "border-ink bg-ink text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
            }`}
          >
            {p === "Sin límite" ? "Sin límite" : `Hasta ${p}`}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Lista */}
        <div
          className={`${vista === "lista" ? "block" : "hidden"} overflow-y-auto border-r border-slate-200 bg-white px-6 pt-5 pb-[90px] md:block`}
        >
          {/* Resumen del inventario filtrado */}
          <div className="mb-4 grid grid-cols-3 gap-2.5">
            {[
              { k: "Alcance diario", v: `${fmtMillones(alcanceTotal)}` },
              { k: "Pantallas", v: String(vallas.length) },
              { k: "Desde", v: `${fmtM(desde)}/día` },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <div className="mb-1 font-mono text-[9px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                  {s.k}
                </div>
                <div className="font-mono text-[16px] font-bold text-ink">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[15px] font-bold text-ink">
              {vallas.length} pantalla{vallas.length !== 1 && "s"}
              {app.ciudad !== "Todas" && ` en ${app.ciudad}`}
            </span>
            <span className="text-[12.5px] text-slate-500">
              {fmtDia(app.inicioDia)} – {fmtDia(finDia)} · los precios incluyen el servicio del 8%
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {vallas.map((v) => (
              <div
                key={v.id}
                onMouseEnter={() => {
                  setMapHover(v.id);
                  if (v.ciudad !== ciudadMapa) cambiarCiudad(v.ciudad as CiudadMapa);
                }}
                onMouseLeave={() => setMapHover(null)}
              >
                <VallaCard valla={v} vistaInfo={`${vistaLabel(v)} · ≈ ${v.alcance ?? 300} m`} />
              </div>
            ))}
          </div>
          {vallas.length === 0 && (
            <div className="rounded-[14px] border-[1.5px] border-dashed border-lavender-border bg-[#FBFAFD] p-10 text-center text-[13.5px] text-slate-500">
              Ninguna pantalla coincide con esos filtros.{" "}
              <button onClick={app.resetFiltros} className="cursor-pointer font-semibold text-kory">
                Restablecer filtros
              </button>
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className={`relative ${vista === "mapa" ? "block" : "hidden"} md:block`}>
          <RealMap
            vallas={vallas}
            ciudad={ciudadMapa}
            conAlcance={conAlcance}
            hoverId={mapHover}
            selId={mapSel}
            onSelect={setMapSel}
            onHover={setMapHover}
          />

          {/* Controles: ciudad + capa de alcance */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              {(["Bogotá", "Medellín"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => cambiarCiudad(c)}
                  className={`cursor-pointer px-4 py-2 text-xs font-bold ${
                    ciudadMapa === c
                      ? "bg-ink text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() => setConAlcance((a) => !a)}
              aria-pressed={conAlcance}
              className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold shadow-[0_1px_3px_rgba(15,23,42,0.12)] ${
                conAlcance
                  ? "border-kory bg-kory-tint text-kory"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              ◎ Alcance visible
            </button>
          </div>

          {/* Tarjeta de la pantalla seleccionada */}
          {popupV && (
            <div className="absolute bottom-10 left-4 z-20 w-[272px] overflow-hidden rounded-[14px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)]">
              <div
                style={{ background: popupV.grad }}
                className="relative flex h-24 items-center justify-center"
              >
                <span className="text-[9px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                  Tu anuncio aquí
                </span>
                <button
                  onClick={() => setMapSel(null)}
                  aria-label="Cerrar tarjeta"
                  className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[11px] text-ink"
                >
                  ✕
                </button>
                <span className="absolute bottom-2 left-2 rounded-full bg-[rgba(13,13,13,0.55)] px-2 py-0.5 text-[9.5px] font-semibold text-white">
                  {popupV.tipo}
                </span>
              </div>
              <div className="flex flex-col gap-1 px-3.5 py-3">
                <div className="flex justify-between gap-2">
                  <span className="text-[13px] font-bold">{popupV.nombre}</span>
                  <span className="shrink-0 text-[11.5px] font-semibold">★ {popupV.rating}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {popupV.ubicacion} · {popupV.imp} imp/día
                </span>
                <span className="text-[11px] text-slate-600">
                  {vistaLabel(popupV)} · radio ≈ {popupV.alcance ?? 300} m
                </span>
                <span>
                  <MedicionBadge valla={popupV} compact />
                </span>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-mono text-[13.5px] font-bold">
                    {fmt(popupV.precio)}{" "}
                    <span className="text-[10px] font-medium text-slate-500">/día</span>
                  </span>
                  <button
                    onClick={() => abrir(popupV.id)}
                    className="h-[30px] cursor-pointer rounded-lg bg-kory px-3 text-[11.5px] font-bold text-white hover:bg-kory-hover"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leyenda */}
          <div className="absolute right-4 bottom-4 z-20 flex items-center gap-3.5 rounded-[10px] bg-white/92 px-3.5 py-2.5 text-[11px] text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.12)] backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M8 8 L3.5 2.5 A 7 7 0 0 1 12.5 2.5 Z" fill="#724CF5" fillOpacity="0.4" />
                <circle cx="8" cy="8" r="2" fill="#724CF5" />
              </svg>
              Dirección de vista
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="#724CF5"
                  fillOpacity="0.12"
                  stroke="#724CF5"
                  strokeOpacity="0.5"
                  strokeDasharray="3 2.5"
                />
              </svg>
              Radio de visibilidad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
