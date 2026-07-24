"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import { categorias, ciudades, entornoDe, presupuestos } from "@/data";
import type { Valla } from "@/data/types";
import { fmt, fmtDia, fmtM, fmtMillones } from "@/lib/format";
import { parseBusqueda, sinAcentos } from "@/lib/busqueda";
import { MedicionBadge } from "@/components/medicion-badge";
import { VallaCard } from "@/components/valla-card";
import { RealMap } from "@/components/real-map";

// Mapa real (MapLibre + OpenFreeMap) con dirección de vista y radio de
// visibilidad por pantalla. Tabs por ciudad, hover sincronizado lista↔mapa
// y tarjeta de selección anclada al mapa.

type CiudadMapa = "Bogotá" | "Medellín";
type Menu = "ciudad" | "tipo" | "entorno" | "presu" | null;

function Chevron({ abierto }: { abierto: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${abierto ? "rotate-180" : ""}`}
      strokeWidth={2.4}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Pill de filtro con etiqueta + valor visible (Norman: el estado del sistema
// siempre a la vista) y panel de opciones (Hick: las opciones viven en el
// menú, no en la barra). Mismo lenguaje visual que el buscador del inicio.
function FiltroPill({
  id,
  etiqueta,
  valor,
  activo,
  abierto,
  onToggle,
  opciones,
}: {
  id: Menu;
  etiqueta: string;
  valor: string;
  activo: boolean;
  abierto: boolean;
  onToggle: (m: Menu) => void;
  opciones: Array<{ label: string; activa: boolean; onPick: () => void }>;
}) {
  return (
    <div className="relative" data-filtros>
      <button
        onClick={() => onToggle(abierto ? null : id)}
        aria-expanded={abierto}
        className={`flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-3 pl-4 transition-colors ${
          activo
            ? "border-kory bg-kory-pale"
            : "border-slate-200 bg-white hover:border-lavender-strong"
        }`}
      >
        <span className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-bold tracking-[0.08em] text-slate-400 uppercase">
            {etiqueta}
          </span>
          <span className={`mt-[3px] text-[12.5px] font-bold ${activo ? "text-kory" : "text-ink"}`}>
            {valor}
          </span>
        </span>
        <Chevron abierto={abierto} />
      </button>
      {abierto && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[calc(100%+8px)] left-0 z-30 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown"
        >
          {opciones.map((o) => (
            <button
              key={o.label}
              onClick={() => o.onPick()}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold hover:bg-kory-pale ${
                o.activa ? "bg-kory-tint text-kory" : "text-slate-700"
              }`}
            >
              {o.label}
              <span className="text-xs text-kory">{o.activa ? "✓" : ""}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const base = useVallasFiltradas();
  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [ciudadMapa, setCiudadMapa] = useState<CiudadMapa>(
    app.ciudad === "Medellín" ? "Medellín" : "Bogotá",
  );
  const [conAlcance, setConAlcance] = useState(true);
  const [mapSel, setMapSel] = useState<number | null>(null);
  const [mapHover, setMapHover] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState<Menu>(null);

  const filtrosActivos =
    app.ciudad !== "Todas" ||
    app.cat !== "Todas" ||
    app.entorno !== "Todos" ||
    app.presupuesto !== "Sin límite" ||
    app.soloVision;

  // Búsqueda inteligente: intención parseada + términos libres sobre
  // los filtros ya activos. Los pins del mapa reflejan el resultado.
  const busq = parseBusqueda(q);
  const vallas = base.filter(
    (v) =>
      (!busq.ciudad || v.ciudad === busq.ciudad) &&
      (!busq.tipo || v.tipo === busq.tipo) &&
      (!busq.entorno || entornoDe(v.tipo) === busq.entorno) &&
      (!busq.vision || v.medicion === "vision") &&
      (!busq.maxPrecio || v.precio <= busq.maxPrecio) &&
      busq.terminos.every((term) =>
        sinAcentos(`${v.nombre} ${v.ubicacion}`.toLowerCase()).includes(term),
      ),
  );

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
    <div
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-filtros]")) setMenu(null);
      }}
      className="flex h-[calc(100vh-64px)] flex-col overflow-hidden"
    >
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
      {/* Barra de búsqueda + filtros. La búsqueda Kory IA es el elemento
          primario (patrón F, happy path); los filtros son pills con estado
          visible y opciones en menú (Hick + Norman: visibilidad). */}
      <div className="border-b border-slate-200 bg-white px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 transition-colors focus-within:border-kory">
            <span className="shrink-0 text-[13px]">✨</span>
            <input
              value={q}
              onChange={(e) => {
                const texto = e.target.value;
                setQ(texto);
                const nb = parseBusqueda(texto);
                if (nb.ciudad && nb.ciudad !== ciudadMapa) cambiarCiudad(nb.ciudad);
              }}
              placeholder='Busca con Kory IA: "interiores en Medellín bajo $1,5M"'
              aria-label="Búsqueda inteligente"
              className="h-10 w-full min-w-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-slate-400"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Limpiar búsqueda"
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            )}
          </div>

          <FiltroPill
            id="ciudad"
            etiqueta="Ciudad"
            valor={app.ciudad === "Todas" ? "Todas" : app.ciudad}
            activo={app.ciudad !== "Todas"}
            abierto={menu === "ciudad"}
            onToggle={setMenu}
            opciones={ciudades.map((c) => ({
              label: c === "Todas" ? "Todas las ciudades" : c,
              activa: app.ciudad === c,
              onPick: () => {
                app.set({ ciudad: c });
                if (c !== "Todas") cambiarCiudad(c as CiudadMapa);
                setMenu(null);
              },
            }))}
          />
          <FiltroPill
            id="tipo"
            etiqueta="Tipo"
            valor={app.cat === "Todas" ? "Todos" : app.cat}
            activo={app.cat !== "Todas"}
            abierto={menu === "tipo"}
            onToggle={setMenu}
            opciones={categorias.map((c) => ({
              label: c === "Todas" ? "Todos los tipos" : c,
              activa: app.cat === c,
              onPick: () => {
                app.set({ cat: c });
                setMenu(null);
              },
            }))}
          />
          <FiltroPill
            id="entorno"
            etiqueta="Entorno"
            valor={
              app.entorno === "Todos" ? "Todos" : app.entorno === "exterior" ? "Exterior" : "Interior"
            }
            activo={app.entorno !== "Todos"}
            abierto={menu === "entorno"}
            onToggle={setMenu}
            opciones={(["Todos", "exterior", "interior"] as const).map((e) => ({
              label: e === "Todos" ? "Interior y exterior" : e === "exterior" ? "Exterior" : "Interior",
              activa: app.entorno === e,
              onPick: () => {
                app.set({ entorno: e });
                setMenu(null);
              },
            }))}
          />
          <FiltroPill
            id="presu"
            etiqueta="Presupuesto"
            valor={app.presupuesto === "Sin límite" ? "Sin límite" : `Hasta ${app.presupuesto}`}
            activo={app.presupuesto !== "Sin límite"}
            abierto={menu === "presu"}
            onToggle={setMenu}
            opciones={presupuestos.map((p) => ({
              label: p === "Sin límite" ? "Sin límite" : `Hasta ${p}`,
              activa: app.presupuesto === p,
              onPick: () => {
                app.set({ presupuesto: p });
                setMenu(null);
              },
            }))}
          />
          <button
            onClick={() => app.set({ soloVision: !app.soloVision })}
            aria-pressed={app.soloVision}
            className={`cursor-pointer rounded-full border px-3.5 py-2.5 text-xs font-bold transition-colors ${
              app.soloVision
                ? "border-[#16A34A] bg-[#ECFDF5] text-[#16A34A]"
                : "border-slate-200 bg-white text-slate-600 hover:border-lavender-strong"
            }`}
          >
            ● Kory Vision
          </button>
          {filtrosActivos && (
            <button
              onClick={app.resetFiltros}
              className="cursor-pointer text-xs font-semibold text-kory hover:underline"
            >
              Restablecer
            </button>
          )}
        </div>
        {q && busq.etiquetas.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px]">
            <span className="font-bold text-kory">Entendí:</span>
            {busq.etiquetas.map((e) => (
              <span key={e} className="rounded-full bg-kory-tint px-2.5 py-[3px] font-semibold text-kory">
                {e}
              </span>
            ))}
          </div>
        )}
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
          <div className="grid grid-cols-2 gap-3.5 2xl:grid-cols-3">
            {vallas.map((v) => (
              <div
                key={v.id}
                onMouseEnter={() => {
                  setMapHover(v.id);
                  if (v.ciudad !== ciudadMapa) cambiarCiudad(v.ciudad as CiudadMapa);
                }}
                onMouseLeave={() => setMapHover(null)}
              >
                <VallaCard
                  valla={v}
                  compact
                  vistaInfo={`${vistaLabel(v)} · ≈ ${v.alcance ?? 300} m`}
                />
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
