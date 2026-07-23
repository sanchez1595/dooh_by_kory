"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import { fmt, fmtDia, fmtM } from "@/lib/format";

export default function MapaPage() {
  const router = useRouter();
  const app = useApp();
  const vallas = useVallasFiltradas();
  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [mapSel, setMapSel] = useState<number | null>(null);
  const [mapHover, setMapHover] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const abrir = (id: number) => {
    app.set({ vallaId: id });
    router.push(`/valla/${id}`);
  };

  const popupV = mapSel !== null ? vallas.find((v) => v.id === mapSel) : undefined;
  const clampX = (x: string) => `${Math.min(82, Math.max(16, parseFloat(x)))}%`;
  const popupFlip = popupV ? parseFloat(popupV.y) < 38 : false;
  const finDia = app.inicioDia + app.dias - 1;

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
      <div className={`${vista === "lista" ? "block" : "hidden"} overflow-y-auto border-r border-slate-200 bg-white px-5 pt-5 pb-[90px] md:block`}>
        <div className="mb-3.5 text-[13px] text-slate-500">
          <b className="font-mono text-ink">{vallas.length}</b> pantallas · {fmtDia(app.inicioDia)} –{" "}
          {fmtDia(finDia)} ·{" "}
          {app.presupuesto === "Sin límite" ? "Sin límite" : `Hasta ${app.presupuesto}`}
        </div>
        <div className="flex flex-col gap-3.5">
          {vallas.map((v) => (
            <div
              key={v.id}
              onClick={() => abrir(v.id)}
              onMouseEnter={() => setMapHover(v.id)}
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
                <span className="mt-0.5 text-[13px]">
                  <b className="font-mono">{fmt(v.precio)}</b>{" "}
                  <span className="text-[10.5px] text-slate-500">/día</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa ilustrativo */}
      <div
        onClick={() => setMapSel(null)}
        className={`relative ${vista === "mapa" ? "block" : "hidden"} overflow-hidden bg-[#EFEDE6] md:block`}
      >
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}
          className="absolute inset-0 transition-transform duration-[250ms] ease-out"
        >
          {/* Vías y zonas */}
          <div className="absolute -top-10 left-[30%] h-[130%] w-[90px] rotate-[12deg] bg-[#E7E4DA]" />
          <div className="absolute -top-10 left-[33.4%] h-[130%] w-[5px] rotate-[12deg] bg-white opacity-75" />
          <div className="absolute top-[20%] -left-[5%] h-16 w-[115%] -rotate-4 bg-[#E7E4DA]" />
          <div className="absolute top-[22%] -left-[5%] h-[5px] w-[115%] -rotate-4 bg-white opacity-75" />
          <div className="absolute top-[58%] -left-[5%] h-11 w-[115%] rotate-3 bg-[#EAE7DE]" />
          <div className="absolute top-[59.4%] -left-[5%] h-1 w-[115%] rotate-3 bg-white opacity-70" />
          <div className="absolute top-[34%] left-[44%] h-[110%] w-[70px] rotate-[24deg] bg-[#CFE0EC] opacity-85" />
          <div className="absolute top-[8%] right-[8%] h-[150px] w-[190px] rounded-[40%_60%_55%_45%] bg-[#DBEAD3]" />
          <div className="absolute bottom-[10%] left-[6%] h-[120px] w-[150px] rounded-[55%_45%_60%_40%] bg-[#DBEAD3]" />
          <span className="absolute top-[82%] left-[14%] text-[15px] font-extrabold tracking-[0.3em] text-[#C6C0AE] uppercase">
            Bogotá
          </span>
          <span className="absolute top-[6%] right-[5%] text-[15px] font-extrabold tracking-[0.3em] text-[#C6C0AE] uppercase">
            Medellín
          </span>
          <span className="absolute top-[33%] left-[39%] text-[10px] font-bold tracking-[0.08em] text-[#A9A390] uppercase">
            Zona T
          </span>
          <span className="absolute top-[46%] left-[24%] text-[10px] font-bold tracking-[0.08em] text-[#A9A390] uppercase">
            Chapinero
          </span>
          <span className="absolute top-[27%] left-[69%] text-[10px] font-bold tracking-[0.08em] text-[#A9A390] uppercase">
            El Poblado
          </span>
          <span className="absolute top-[53%] left-[81%] text-[10px] font-bold tracking-[0.08em] text-[#A9A390] uppercase">
            Laureles
          </span>
          <span className="absolute top-[16%] left-[47%] rotate-[24deg] text-[9.5px] text-[#7FA8C4] italic">
            Río Medellín
          </span>

          {/* Pins */}
          {vallas.map((v) => {
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
              className="absolute z-40 w-[252px] overflow-hidden rounded-[14px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)]"
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
        <div className="absolute bottom-4 left-4 z-50 rounded-[10px] bg-white/90 px-3.5 py-2.5 text-[11.5px] text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.12)] backdrop-blur-xs">
          Toca un pin para ver la pantalla · mapa ilustrativo
        </div>
      </div>
      </div>
    </div>
  );
}
