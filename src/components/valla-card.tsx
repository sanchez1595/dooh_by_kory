"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { Valla } from "@/data/types";
import { fmt } from "@/lib/format";

export function VallaCard({ valla }: { valla: Valla }) {
  const router = useRouter();
  const { fav, toggleFav, set } = useApp();
  const esFav = !!fav[valla.id];

  return (
    <div
      onClick={() => {
        set({ vallaId: valla.id });
        router.push(`/valla/${valla.id}`);
      }}
      className="cursor-pointer overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        style={{ background: valla.grad }}
        className="relative flex h-[164px] items-center justify-center"
      >
        <span className="absolute top-2.5 left-2.5 rounded-full bg-[rgba(13,13,13,0.55)] px-[9px] py-[3px] text-[10.5px] font-semibold tracking-[0.04em] text-white backdrop-blur-xs">
          {valla.tipo}
        </span>
        <button
          title="Guardar"
          aria-label={esFav ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(valla.id, valla.nombre);
          }}
          className="absolute top-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white/90"
        >
          <svg
            viewBox="0 0 24 24"
            fill={esFav ? "#724CF5" : "none"}
            stroke={esFav ? "#724CF5" : "#334155"}
            className="h-[15px] w-[15px]"
            strokeWidth={2}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        <span className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
          Tu anuncio aquí
        </span>
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-white/90 px-[9px] py-[3px] font-mono text-[10.5px] font-bold text-ink">
          {valla.dim}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[14.5px] font-bold text-ink">{valla.nombre}</span>
          <span className="inline-flex shrink-0 items-center gap-[3px] text-[12.5px] font-semibold text-ink">
            ★ {valla.rating}
          </span>
        </div>
        <span className="text-[12.5px] text-slate-500">{valla.ubicacion}</span>
        <span className="inline-flex items-center gap-[5px] text-xs text-slate-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-[13px] w-[13px]" strokeWidth={2}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <b className="font-mono font-semibold">{valla.imp}</b>&nbsp;impresiones/día
        </span>
        <div className="mt-1 text-[15px] text-ink">
          <b className="font-mono font-bold">{fmt(valla.precio)}</b>{" "}
          <span className="text-xs text-slate-500">COP /día</span>
        </div>
      </div>
    </div>
  );
}
