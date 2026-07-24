"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import type { Valla } from "@/data/types";
import { fmt, fmtDia, fmtM, fmtMillones } from "@/lib/format";
import { MedicionBadge } from "@/components/medicion-badge";

// Mapa por ciudad con dirección de vista (cono) y radio de visibilidad
// (círculo, proporcional a metros reales). Cada ciudad tiene su propio
// lienzo: retícula de manzanas + avenidas reconocibles, sin mezclar
// geografías. El color violeta queda para selección/acción; el alcance
// usa el mismo violeta a baja opacidad como capa de datos.

type CiudadMapa = "Bogotá" | "Medellín";

const CARDINALES = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];

function cardinal(b: number): string {
  return CARDINALES[Math.round(((b % 360) + 360) % 360 / 45) % 8];
}

function vistaLabel(v: Valla): string {
  const b = v.vista ?? 0;
  return v.dobleCara
    ? `Vista al ${cardinal(b)} y ${cardinal(b + 180)} · doble cara`
    : `Vista al ${cardinal(b)}`;
}

/** Punto sobre el círculo de radio r con rumbo `ang` (0 = norte, horario). */
function pt(r: number, ang: number): [number, number] {
  const a = ((ang - 90) * Math.PI) / 180;
  return [r + r * Math.cos(a), r + r * Math.sin(a)];
}

function cono(r: number, rumbo: number, apertura = 62): string {
  const [x1, y1] = pt(r, rumbo - apertura / 2);
  const [x2, y2] = pt(r, rumbo + apertura / 2);
  return `M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

/** Círculo de visibilidad + cono(s) de dirección de vista de una pantalla. */
function AlcanceOverlay({ v, activo }: { v: Valla; activo: boolean }) {
  const r = (v.alcance ?? 300) / 5;
  const rumbo = v.vista ?? 0;
  return (
    <svg
      width={r * 2}
      height={r * 2}
      style={{ left: v.x, top: v.y }}
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        activo ? "opacity-100" : "opacity-55"
      }`}
      aria-hidden
    >
      <circle
        cx={r}
        cy={r}
        r={r - 1.5}
        fill="#724CF5"
        fillOpacity={activo ? 0.16 : 0.09}
        stroke="#724CF5"
        strokeOpacity={activo ? 0.6 : 0.32}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <path
        d={cono(r, rumbo)}
        fill="#724CF5"
        fillOpacity={activo ? 0.45 : 0.28}
        stroke="#724CF5"
        strokeOpacity={activo ? 0.5 : 0.3}
        strokeWidth={1}
      />
      {v.dobleCara && (
        <path
          d={cono(r, rumbo + 180)}
          fill="#724CF5"
          fillOpacity={activo ? 0.45 : 0.28}
          stroke="#724CF5"
          strokeOpacity={activo ? 0.5 : 0.3}
          strokeWidth={1}
        />
      )}
    </svg>
  );
}

/** Retícula de manzanas compartida por ambos lienzos. */
const gridStyle = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.85) 0 2px, transparent 2px 38px)," +
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.85) 0 2px, transparent 2px 38px)",
};

const avenida = "absolute bg-white shadow-[0_0_0_1.5px_rgba(15,23,42,0.05)]";
const barrio =
  "absolute text-[10px] font-bold tracking-[0.14em] text-[#A9A5B8] uppercase select-none";

function BogotaBase() {
  return (
    <>
      <div className="absolute inset-0" style={gridStyle} />
      {/* Cerros orientales */}
      <div className="absolute top-0 -right-4 h-full w-[9%] rounded-l-[45%_30%] bg-[#D9E6CF]" />
      {/* Aeropuerto El Dorado */}
      <div className="absolute top-[41%] left-[7%] h-[9px] w-[13%] -rotate-6 rounded-full bg-[#DEDCD2]" />
      <div className="absolute top-[47%] left-[6%] h-[9px] w-[14%] -rotate-6 rounded-full bg-[#DEDCD2]" />
      {/* Parques */}
      <div className="absolute top-[26%] left-[57%] h-[52px] w-[64px] rounded-[50%_45%_55%_50%] bg-[#D9E6CF]" />
      <div className="absolute top-[48%] left-[30%] h-[80px] w-[110px] rounded-[45%_55%_50%_55%] bg-[#D9E6CF]" />
      {/* Autopista Norte */}
      <div className={`${avenida} -top-6 left-[55%] h-[120%] w-[22px] rotate-2`} />
      {/* Cra 7 */}
      <div className={`${avenida} -top-6 left-[76%] h-[120%] w-3 rotate-1`} />
      {/* NQS (diagonal) */}
      <div className={`${avenida} -top-10 left-[38%] h-[135%] w-[18px] rotate-[18deg]`} />
      {/* Cll 26 al aeropuerto */}
      <div className={`${avenida} top-[45%] -left-4 h-[15px] w-[58%] -rotate-3`} />
      {/* Cll 100 */}
      <div className={`${avenida} top-[19%] left-[30%] h-[13px] w-[74%] -rotate-1`} />
      {/* Av. Boyacá sur */}
      <div className={`${avenida} top-[76%] -left-4 h-[13px] w-[110%] rotate-2`} />

      <span className={`${barrio} top-[11%] left-[60%]`}>Usaquén</span>
      <span className={`${barrio} top-[31%] left-[70%]`}>Zona T</span>
      <span className={`${barrio} top-[52%] left-[58%]`}>Chapinero</span>
      <span className={`${barrio} top-[38%] left-[9%]`}>El Dorado</span>
      <span className={`${barrio} top-[70%] left-[24%]`}>Kennedy</span>
      <span className="absolute bottom-[7%] left-[6%] text-[15px] font-extrabold tracking-[0.3em] text-[#BEBACB] uppercase select-none">
        Bogotá
      </span>
    </>
  );
}

function MedellinBase() {
  return (
    <>
      <div className="absolute inset-0" style={gridStyle} />
      {/* Laderas del valle */}
      <div className="absolute top-0 -left-4 h-full w-[10%] rounded-r-[35%_50%] bg-[#D9E6CF]" />
      <div className="absolute top-0 -right-4 h-full w-[10%] rounded-l-[45%_35%] bg-[#D9E6CF]" />
      {/* Río Medellín */}
      <div className="absolute -top-6 left-[46%] h-[120%] w-[20px] rotate-1 rounded-full bg-[#C7DCEA] shadow-[0_0_0_2px_rgba(255,255,255,0.8)]" />
      <span className="absolute top-[14%] left-[47.5%] rotate-90 text-[9.5px] whitespace-nowrap text-[#7FA8C4] italic select-none">
        Río Medellín
      </span>
      {/* Av. Regional */}
      <div className={`${avenida} -top-6 left-[42%] h-[120%] w-2.5 rotate-1`} />
      {/* Av. El Poblado */}
      <div className={`${avenida} -top-6 left-[62%] h-[120%] w-[14px] rotate-2`} />
      {/* Cll 33 */}
      <div className={`${avenida} top-[44%] -left-4 h-[13px] w-[110%] -rotate-2`} />
      {/* Cll 10 · Poblado */}
      <div className={`${avenida} top-[62%] left-[40%] h-[12px] w-[64%] rotate-3`} />
      {/* Estadio */}
      <div className="absolute top-[33%] left-[27%] h-[54px] w-[76px] rounded-[50%] bg-[#D9E6CF] shadow-[inset_0_0_0_3px_#fff]" />

      <span className={`${barrio} top-[29%] left-[24%]`}>Estadio</span>
      <span className={`${barrio} top-[50%] left-[22%]`}>Laureles</span>
      <span className={`${barrio} top-[51%] left-[67%]`}>El Poblado</span>
      <span className={`${barrio} top-[76%] left-[66%]`}>Milla de Oro</span>
      <span className="absolute bottom-[7%] left-[6%] text-[15px] font-extrabold tracking-[0.3em] text-[#BEBACB] uppercase select-none">
        Medellín
      </span>
    </>
  );
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
  const [zoom, setZoom] = useState(1);

  const enMapa = vallas.filter((v) => v.ciudad === ciudadMapa);
  const abrir = (id: number) => {
    app.set({ vallaId: id });
    router.push(`/valla/${id}`);
  };

  const cambiarCiudad = (c: CiudadMapa) => {
    setCiudadMapa(c);
    setMapSel(null);
  };

  const popupV = mapSel !== null ? enMapa.find((v) => v.id === mapSel) : undefined;
  const clampX = (x: string) => `${Math.min(78, Math.max(18, parseFloat(x)))}%`;
  const popupFlip = popupV ? parseFloat(popupV.y) < 40 : false;
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
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[440px_1fr]">
        {/* Lista */}
        <div
          className={`${vista === "lista" ? "block" : "hidden"} overflow-y-auto border-r border-slate-200 bg-white px-5 pt-5 pb-[90px] md:block`}
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
          <div className="mb-3.5 text-[13px] text-slate-500">
            {fmtDia(app.inicioDia)} – {fmtDia(finDia)} ·{" "}
            {app.presupuesto === "Sin límite" ? "Sin límite" : `Hasta ${app.presupuesto}`}
          </div>
          <div className="flex flex-col gap-3.5">
            {vallas.map((v) => (
              <div
                key={v.id}
                onClick={() => abrir(v.id)}
                onMouseEnter={() => {
                  setMapHover(v.id);
                  if (v.ciudad !== ciudadMapa) cambiarCiudad(v.ciudad as CiudadMapa);
                }}
                onMouseLeave={() => setMapHover(null)}
                className="grid cursor-pointer grid-cols-[132px_1fr] gap-3.5 overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-lavender-strong hover:shadow-md"
              >
                <div
                  style={{ background: v.grad }}
                  className="relative flex min-h-[100px] items-center justify-center"
                >
                  <span className="text-[8.5px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                    LED
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] py-3 pr-3">
                  <div className="flex justify-between gap-1.5">
                    <span className="text-[13px] font-bold">{v.nombre}</span>
                    <span className="shrink-0 text-[11.5px] font-semibold">★ {v.rating}</span>
                  </div>
                  <span className="text-[11.5px] text-slate-500">{v.ubicacion}</span>
                  <span className="font-mono text-[11px] text-slate-600">{v.imp} imp/día</span>
                  <span className="text-[11px] text-slate-500">
                    {vistaLabel(v)} · ≈ {v.alcance ?? 300} m
                  </span>
                  <span className="mt-0.5 text-[13px]">
                    <b className="font-mono">{fmt(v.precio)}</b>{" "}
                    <span className="text-[10.5px] text-slate-500">/día</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div
          onClick={() => setMapSel(null)}
          className={`relative ${vista === "mapa" ? "block" : "hidden"} overflow-hidden bg-[#EFEEE9] md:block`}
        >
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}
            className="absolute inset-0 transition-transform duration-[250ms] ease-out"
          >
            {ciudadMapa === "Bogotá" ? <BogotaBase /> : <MedellinBase />}

            {/* Radios de visibilidad + conos de vista (capa de datos) */}
            {conAlcance &&
              enMapa.map((v) => (
                <AlcanceOverlay
                  key={v.id}
                  v={v}
                  activo={mapSel === v.id || mapHover === v.id}
                />
              ))}

            {/* Pins */}
            {enMapa.map((v) => {
              const isSel = mapSel === v.id;
              const isHov = mapHover === v.id;
              return (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMapSel(v.id);
                  }}
                  onMouseEnter={() => setMapHover(v.id)}
                  onMouseLeave={() => setMapHover(null)}
                  style={{
                    left: v.x,
                    top: v.y,
                    transform: `translate(-50%,-50%) scale(${isSel || isHov ? 1.12 : 1})`,
                    zIndex: isSel ? 25 : isHov ? 24 : 10,
                    background: isSel ? "#724CF5" : isHov ? "#0F172A" : "#fff",
                    color: isSel || isHov ? "#fff" : "#0F172A",
                    borderColor: isSel ? "#724CF5" : isHov ? "#0F172A" : "#E2E8F0",
                  }}
                  className="absolute cursor-pointer rounded-full border px-3 py-1.5 font-mono text-xs font-bold whitespace-nowrap shadow-[0_4px_12px_rgba(15,23,42,0.22)] transition-[transform,background-color] duration-150"
                >
                  {fmtM(v.precio)}
                </button>
              );
            })}

            {/* Popup */}
            {popupV && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  left: clampX(popupV.x),
                  top: popupV.y,
                  transform: popupFlip
                    ? "translate(-50%, 24px)"
                    : "translate(-50%, calc(-100% - 24px))",
                }}
                className="absolute z-40 w-[262px] overflow-hidden rounded-[14px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)]"
              >
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
                  <span className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
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
          </div>

          {/* Controles: ciudad + capa de alcance */}
          <div className="absolute top-4 left-4 z-50 flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              {(["Bogotá", "Medellín"] as const).map((c) => (
                <button
                  key={c}
                  onClick={(e) => {
                    e.stopPropagation();
                    cambiarCiudad(c);
                  }}
                  className={`cursor-pointer px-4 py-2 text-xs font-bold ${
                    ciudadMapa === c ? "bg-ink text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConAlcance((a) => !a);
              }}
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

          {/* Controles de zoom */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.min(1.6, z * 1.25));
              }}
              aria-label="Acercar mapa"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[17px] font-bold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.12)] hover:bg-kory-pale"
            >
              +
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.max(0.7, z / 1.25));
              }}
              aria-label="Alejar mapa"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[17px] font-bold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.12)] hover:bg-kory-pale"
            >
              −
            </button>
          </div>

          {/* Leyenda */}
          <div className="absolute right-4 bottom-4 z-50 flex items-center gap-3.5 rounded-[10px] bg-white/92 px-3.5 py-2.5 text-[11px] text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.12)] backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M8 8 L3.5 2.5 A 7 7 0 0 1 12.5 2.5 Z" fill="#724CF5" fillOpacity="0.4" />
                <circle cx="8" cy="8" r="2" fill="#724CF5" />
              </svg>
              Dirección de vista
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="6" fill="#724CF5" fillOpacity="0.12" stroke="#724CF5" strokeOpacity="0.5" strokeDasharray="3 2.5" />
              </svg>
              Radio de visibilidad
            </span>
            <span className="text-slate-400">· mapa ilustrativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
