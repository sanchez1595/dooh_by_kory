"use client";

import { useState } from "react";
import { diasSemana } from "@/data";
import { fmtDia } from "@/lib/format";

/**
 * Selector de rango de fechas de la demo: agosto y septiembre 2026.
 * Un día es global 1–31 (ago) o 32–61 (sep), como en todo el prototipo.
 * `ocupados` (opcional) marca días vendidos, no seleccionables.
 */
export function RangePicker({
  inicioDia,
  finDia,
  pendiente,
  onPick,
  ocupados,
}: {
  inicioDia: number;
  finDia: number;
  pendiente: number | null;
  onPick: (diaGlobal: number) => void;
  ocupados?: Set<number>;
}) {
  const [mes, setMes] = useState(inicioDia > 31 ? 1 : 0);
  const meses = [
    { nombre: "Agosto 2026", dias: 31, offset: 5, base: 0 },
    { nombre: "Septiembre 2026", dias: 30, offset: 1, base: 31 },
  ];
  const m = meses[mes];

  return (
    <div className="px-1.5 pt-1 pb-1.5">
      <div className="mb-1.5 flex items-center justify-between">
        <button
          onClick={() => setMes(0)}
          disabled={mes === 0}
          aria-label="Mes anterior"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-[12.5px] font-bold text-ink">{m.nombre}</span>
        <button
          onClick={() => setMes(1)}
          disabled={mes === 1}
          aria-label="Mes siguiente"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:opacity-30"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-[2px]">
        {diasSemana.map((dw) => (
          <div key={dw} className="pb-1 text-center text-[9.5px] font-bold text-slate-400 uppercase">
            {dw}
          </div>
        ))}
        {Array.from({ length: m.offset }).map((_, i) => (
          <div key={`o-${i}`} />
        ))}
        {Array.from({ length: m.dias }, (_, i) => i + 1).map((d) => {
          const g = m.base + d;
          const ocupado = ocupados?.has(g) ?? false;
          const esInicio = pendiente !== null ? g === pendiente : g === inicioDia;
          const esFin = pendiente === null && g === finDia;
          const enMedio = pendiente === null && g > inicioDia && g < finDia;
          return (
            <button
              key={g}
              onClick={() => !ocupado && onPick(g)}
              disabled={ocupado}
              aria-label={`${fmtDia(g)}${ocupado ? " (ocupado)" : ""}`}
              className={`flex h-[34px] w-[34px] items-center justify-center font-mono text-[11.5px] font-semibold transition-colors ${
                ocupado
                  ? "cursor-not-allowed text-slate-300 line-through"
                  : esInicio || esFin
                    ? "cursor-pointer rounded-[8px] bg-kory text-white"
                    : enMedio
                      ? "cursor-pointer rounded-none bg-kory-tint text-kory"
                      : "cursor-pointer rounded-[8px] text-ink hover:bg-kory-pale"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 border-t border-slate-100 pt-1.5 text-center text-[10.5px] text-slate-500">
        {pendiente !== null ? (
          <>
            Inicio: <b className="text-kory">{fmtDia(pendiente)}</b> · ahora toca el día final
          </>
        ) : (
          <>
            {fmtDia(inicioDia)} — {fmtDia(finDia)} · {finDia - inicioDia + 1} días
          </>
        )}
      </div>
    </div>
  );
}
