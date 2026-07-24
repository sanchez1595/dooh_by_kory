"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/context/app-context";
import { combos, getCombo, getValla } from "@/data";
import { fmt } from "@/lib/format";
import { getQuote } from "@/lib/pricing";
import { MedicionBadge } from "@/components/medicion-badge";
import { Footer } from "@/components/footer";

// W13 · Combo por objetivo: mapa + lista A·B·C, un creativo adaptado por
// Kory IA, ahorro anclado contra el precio por separado y política clara
// de rechazo parcial ANTES del CTA.

const letras = ["A", "B", "C", "D"];

export default function ComboPage() {
  const params = useParams<{ id: string }>();
  const app = useApp();
  const combo = getCombo(params.id) ?? combos[0];

  const [quitadas, setQuitadas] = useState<Set<number>>(new Set());
  const [enviado, setEnviado] = useState(false);

  const pantallas = combo.vallaIds
    .map((id) => getValla(id))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .filter((v) => !quitadas.has(v.id));

  const quotes = pantallas.map((v) => getQuote(v, app.dias, app.spots, app.inicioDia));
  const sumaSeparado = quotes.reduce((a, q) => a + q.total, 0);
  const ahorroActivo = pantallas.length >= 2 ? combo.ahorro : 0;
  const totalCombo = Math.round(sumaSeparado * (1 - ahorroActivo));
  const impTotales = quotes.reduce((a, q) => a + q.impTotales, 0);

  if (enviado) {
    return (
      <>
        <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 pt-16 pb-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-3xl">
            ✓
          </span>
          <h1 className="mt-5 mb-2 text-[26px] font-extrabold tracking-[-0.02em]">
            {pantallas.length} solicitudes enviadas
          </h1>
          <p className="m-0 max-w-[460px] text-[14px] leading-[1.7] text-slate-600">
            Cada dueño aprueba tu creativo en máximo 24 h. Tu pago queda protegido por Kory; si un
            dueño rechaza, eliges entre un reemplazo sugerido o el reembolso de esa pantalla.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/mis-campanas"
              className="flex h-11 items-center rounded-[11px] bg-kory px-[22px] text-[13.5px] font-bold text-white hover:bg-kory-hover hover:text-white"
            >
              Ver mis campañas
            </Link>
            <Link
              href="/"
              className="flex h-11 items-center rounded-[11px] border border-slate-200 bg-white px-[22px] text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Seguir explorando
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-9 pb-24">
        <Link href="/" className="text-[13px] font-semibold text-kory">
          ← Volver a explorar
        </Link>
        <div className="mt-3 mb-1 flex flex-wrap items-center gap-2.5">
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">{combo.nombre}</h1>
          <span className="rounded-full bg-kory-tint px-2.5 py-1 text-[11px] font-bold text-kory">
            Combo · {pantallas.length} pantallas
          </span>
        </div>
        <p className="mt-0 mb-7 max-w-[640px] text-[13.5px] text-slate-500">{combo.descripcion}</p>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Mapa ilustrativo con pins A·B·C */}
          <div className="relative h-[380px] overflow-hidden rounded-[14px] border border-slate-200 bg-[linear-gradient(160deg,#EDEBF4,#E2DEEF)]">
            {[
              "M0 120 C 160 90, 300 150, 460 110 S 700 140, 860 100",
              "M0 250 C 180 230, 340 290, 520 250 S 760 270, 900 240",
            ].map((d, i) => (
              <svg key={i} className="absolute inset-0 h-full w-full" aria-hidden>
                <path d={d} fill="none" stroke="#fff" strokeWidth={i === 0 ? 14 : 8} />
              </svg>
            ))}
            {pantallas.map((v, i) => (
              <div
                key={v.id}
                style={{ left: v.x, top: v.y }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-kory text-[13px] font-extrabold text-white shadow-[0_4px_12px_rgba(114,76,245,0.4)]">
                  {letras[i]}
                </span>
                <span className="rounded-full bg-white px-2 py-[2px] text-[10px] font-bold text-ink shadow-card">
                  {v.nombre.length > 22 ? v.nombre.slice(0, 22) + "…" : v.nombre}
                </span>
              </div>
            ))}
            <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[10.5px] font-semibold text-slate-500">
              Mapa ilustrativo — ubicaciones aproximadas
            </span>
          </div>

          {/* Lista + resumen */}
          <div className="flex flex-col gap-3">
            {pantallas.map((v, i) => {
              const q = quotes[i];
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kory-tint text-xs font-extrabold text-kory">
                    {letras[i]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-bold">{v.nombre}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-slate-500">
                      ≈ {q.impTotalesF} imp · {app.dias} días
                      <MedicionBadge valla={v} compact />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[13.5px] font-bold">{q.totalF}</div>
                    {pantallas.length > 1 && (
                      <button
                        onClick={() => setQuitadas(new Set([...quitadas, v.id]))}
                        className="cursor-pointer text-[11px] font-semibold text-slate-400 hover:text-[#C32674]"
                      >
                        quitar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="rounded-xl border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-4 py-3 text-[12.5px] leading-[1.55] text-slate-700">
              <span className="mr-1.5 inline-flex items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[11px] font-bold text-kory">
                ✨ Kory IA
              </span>
              <b>Un solo creativo.</b> Lo adaptamos a las {pantallas.length} resoluciones y te
              mostramos el preview en cada pantalla antes de enviar.
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex justify-between text-[13px] text-slate-600">
                <span>Impresiones del combo</span>
                <span className="font-mono font-semibold">
                  ≈ {(impTotales / 1e6).toFixed(1).replace(".", ",")}M
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
                <span className="text-[13.5px] font-bold text-ink">
                  Total · {app.dias} días
                  {ahorroActivo > 0 && (
                    <span className="ml-2 rounded-full bg-kory-tint px-2 py-[2px] text-[10.5px] font-bold text-kory">
                      Ahorra {Math.round(ahorroActivo * 100)}%
                    </span>
                  )}
                </span>
                <span className="text-right">
                  {ahorroActivo > 0 && (
                    <span className="mr-2 font-mono text-[12px] text-slate-400 line-through">
                      {fmt(sumaSeparado)}
                    </span>
                  )}
                  <b className="font-mono text-[17px]">{fmt(totalCombo)}</b>
                </span>
              </div>
              <button
                onClick={() => setEnviado(true)}
                className="mt-1 h-12 cursor-pointer rounded-[11px] bg-kory text-[14.5px] font-bold text-white hover:bg-kory-hover"
              >
                Reservar combo
              </button>
              <p className="m-0 text-center text-[11px] leading-[1.5] text-slate-400">
                No se cobra hasta que los dueños aprueben. Si uno rechaza, decides: reemplazo
                sugerido o reembolso de esa pantalla.
              </p>
            </div>

            {quitadas.size > 0 && (
              <button
                onClick={() => setQuitadas(new Set())}
                className="cursor-pointer text-center text-[12px] font-semibold text-kory"
              >
                Restaurar pantallas quitadas ({quitadas.size})
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
