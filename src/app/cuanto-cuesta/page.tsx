"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { categorias, ciudades, fechasOpts, vallas } from "@/data";
import type { Ciudad, TipoValla } from "@/data/types";
import { fmt } from "@/lib/format";
import { getQuote } from "@/lib/pricing";
import { Footer } from "@/components/footer";

// W14 · Calculadora pública de precios: responde la búsqueda con mayor
// intención ("cuánto cuesta una valla en Bogotá") con el catálogo real,
// sin registro. Rango + histograma = ancla honesta, no un "desde" engañoso.

export default function CuantoCuestaPage() {
  const router = useRouter();
  const app = useApp();
  const [ciudad, setCiudad] = useState<Ciudad>("Bogotá");
  const [tipo, setTipo] = useState<TipoValla | "Todas">("Todas");
  const [dias, setDias] = useState(14);

  const candidatas = vallas.filter(
    (v) => (ciudad === "Todas" || v.ciudad === ciudad) && (tipo === "Todas" || v.tipo === tipo),
  );
  const totales = candidatas
    .map((v) => getQuote(v, dias, 6, app.inicioDia).total)
    .sort((a, b) => a - b);
  const min = totales[0] ?? 0;
  const max = totales[totales.length - 1] ?? 0;
  const cpmProm =
    candidatas.length > 0
      ? candidatas.reduce((a, v) => a + getQuote(v, dias, 6, app.inicioDia).cpm, 0) /
        candidatas.length
      : 0;

  // Histograma de 6 franjas sobre el rango real.
  const franjas = Array.from({ length: 6 }, (_, i) => {
    const lo = min + ((max - min) / 6) * i;
    const hi = min + ((max - min) / 6) * (i + 1);
    return totales.filter((t) => t >= lo && (i === 5 ? t <= hi : t < hi)).length;
  });
  const maxFranja = Math.max(...franjas, 1);
  const modaIdx = franjas.indexOf(Math.max(...franjas));

  const verPantallas = () => {
    app.set({ ciudad, cat: tipo, dias, soloVision: false });
    router.push("/");
  };

  const select =
    "h-11 cursor-pointer rounded-[10px] border border-slate-200 bg-white px-3.5 text-[13.5px] font-semibold text-ink outline-none focus:border-kory";

  return (
    <>
      <div className="mx-auto w-full max-w-[860px] px-6 pt-12 pb-24">
        <span className="mb-3 inline-block rounded-full bg-kory-tint px-3 py-1 text-[11px] font-bold tracking-[0.06em] text-kory uppercase">
          Precios reales · sin registro
        </span>
        <h1 className="m-0 mb-2 text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[36px]">
          ¿Cuánto cuesta una valla digital
          {ciudad !== "Todas" ? ` en ${ciudad}` : " en Colombia"}?
        </h1>
        <p className="mt-0 mb-7 max-w-[560px] text-[14.5px] leading-[1.7] text-slate-600">
          Calculado sobre pantallas publicadas en la plataforma, con el precio final que pagarías
          hoy — servicio del 8% incluido, sin cotizaciones por correo.
        </p>

        {/* Selectores */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          <select value={ciudad} onChange={(e) => setCiudad(e.target.value as Ciudad)} className={select} aria-label="Ciudad">
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c === "Todas" ? "Toda Colombia" : c}
              </option>
            ))}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoValla | "Todas")} className={select} aria-label="Tipo de pantalla">
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c === "Todas" ? "Todos los tipos" : c}
              </option>
            ))}
          </select>
          <select value={dias} onChange={(e) => setDias(Number(e.target.value))} className={select} aria-label="Duración">
            {fechasOpts.map((f) => (
              <option key={f.dias} value={f.dias}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {candidatas.length === 0 ? (
          <div className="rounded-[14px] border-[1.5px] border-dashed border-lavender-border bg-[#FBFAFD] p-10 text-center text-[13.5px] text-slate-500">
            No hay pantallas de ese tipo en {ciudad}. Prueba con otro tipo o toda Colombia.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[12.5px] font-semibold text-slate-500">
                Rango real · {candidatas.length} pantalla{candidatas.length !== 1 && "s"} publicada
                {candidatas.length !== 1 && "s"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-[3px] text-[10.5px] font-bold text-[#16A34A]">
                ● Precios en vivo
              </span>
            </div>
            <div className="text-[30px] font-extrabold tracking-[-0.02em] md:text-[34px]">
              <span className="font-mono">{fmt(min)}</span>
              <span className="mx-1 text-slate-300">–</span>
              <span className="font-mono">{fmt(max)}</span>{" "}
              <span className="text-[14px] font-semibold text-slate-400">
                COP · {dias} días
              </span>
            </div>

            {/* Histograma */}
            <div className="mt-5 flex h-[72px] items-end gap-1.5">
              {franjas.map((f, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(8, (f / maxFranja) * 100)}%` }}
                  className={`flex-1 rounded-t-[4px] ${i === modaIdx ? "bg-kory" : "bg-lavender-100"}`}
                  title={`${f} pantalla${f !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
            <p className="mt-2 mb-0 text-[12px] text-slate-500">
              La mayoría de campañas de {dias} días{ciudad !== "Todas" && ` en ${ciudad}`} cuesta
              entre{" "}
              <b className="font-mono">
                {fmt(min + ((max - min) / 6) * modaIdx)}
              </b>{" "}
              y{" "}
              <b className="font-mono">
                {fmt(min + ((max - min) / 6) * (modaIdx + 1))}
              </b>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className="text-[13px] text-slate-600">
                CPM típico: <b className="font-mono">{fmt(cpmProm)}</b>{" "}
                <span className="font-semibold text-[#16A34A]">
                  — 62% menos que OOH tradicional
                </span>
              </span>
              <button
                onClick={verPantallas}
                className="h-11 cursor-pointer rounded-[11px] bg-kory px-5 text-[13.5px] font-bold text-white hover:bg-kory-hover"
              >
                Ver las {candidatas.length} pantallas desde {fmt(min)} →
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-[12px] text-slate-400">
          Precios reales de pantallas publicadas en DOOH by Kory. El total incluye el servicio del
          8%; no hay costos ocultos ni permanencias.
        </p>
      </div>
      <Footer />
    </>
  );
}
