"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { facturacion, ordenId } from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { getQuote } from "@/lib/pricing";

export default function ConfirmacionPage() {
  const app = useApp();
  const sel = useValla(app.vallaId);
  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);

  return (
    <div className="mx-auto w-full max-w-[560px] px-6 pt-14 pb-[100px] text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#BBF7D0] bg-[#ECFDF5]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" className="h-7 w-7" strokeWidth={2.4}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mb-2.5 text-[28px] font-extrabold tracking-[-0.02em]">¡Solicitud enviada!</h1>
      <p className="mb-2 text-[14.5px] leading-[1.7] text-slate-600">
        Retuvimos <b className="font-mono text-ink">{quote.totalF}</b> COP de forma segura. Solo se
        cobra cuando el dueño apruebe tu creativo — máximo 24 h.
      </p>
      <span className="mb-7 inline-block rounded-full bg-kory-tint px-3 py-1 font-mono text-xs font-bold text-kory">
        Orden {ordenId}
      </span>

      <div className="mb-6 flex gap-3 rounded-[14px] border border-slate-200 bg-white p-[18px] text-left">
        <div style={{ background: sel.grad }} className="h-[52px] w-[72px] shrink-0 rounded-[10px]" />
        <div className="flex-1">
          <div className="text-[13.5px] font-bold">{sel.nombre}</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {quote.inicioCorto} – {quote.finCorto} · {app.spots} spots/h · ≈ {quote.impTotalesF}{" "}
            impresiones
          </div>
        </div>
        <div className="self-center font-mono text-[13.5px] font-bold">{quote.totalF}</div>
      </div>

      <div className="mb-7 rounded-[14px] border border-slate-200 bg-white p-[22px] text-left">
        <div className="mb-4 text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">
          Qué sigue
        </div>
        <div className="flex flex-col">
          <div className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-kory text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-[13px] w-[13px]"
                  strokeWidth={3}
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="min-h-[18px] w-[1.5px] flex-1 bg-lavender-tint" />
            </div>
            <div className="pb-[18px]">
              <div className="text-[13.5px] font-bold">Pago retenido</div>
              <div className="mt-px text-xs text-slate-500">Hoy, 10:42 am · protegido por Kory</div>
            </div>
          </div>
          <div className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className="box-border flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-kory bg-kory-tint text-[11.5px] font-bold text-kory">
                2
              </span>
              <span className="min-h-[18px] w-[1.5px] flex-1 bg-slate-200" />
            </div>
            <div className="pb-[18px]">
              <div className="text-[13.5px] font-bold text-kory">El dueño revisa tu creativo</div>
              <div className="mt-px text-xs text-slate-500">
                Máximo 24 h · te avisamos por correo y WhatsApp
              </div>
            </div>
          </div>
          <div className="flex gap-3.5">
            <span className="box-border flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-slate-200 bg-white text-[11.5px] font-bold text-slate-400">
              3
            </span>
            <div>
              <div className="text-[13.5px] font-bold text-slate-400">Tu spot sale al aire</div>
              <div className="mt-px text-xs text-slate-400">
                {quote.inicioCorto}, 6:00 am · reporte de impresiones en vivo
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-[13px] text-slate-600">
        Enviamos la confirmación a <b>{facturacion.correo}</b>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/mi-campana"
          className="flex h-11 items-center rounded-[11px] bg-kory px-[22px] text-[13.5px] font-bold text-white hover:bg-kory-hover hover:text-white"
        >
          Ver mi campaña en vivo
        </Link>
        <Link
          href="/correos"
          className="flex h-11 items-center rounded-[11px] border border-slate-200 bg-white px-[22px] text-[13.5px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-700"
        >
          Ver correo de confirmación
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center rounded-[11px] px-4 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-700"
        >
          Seguir explorando
        </Link>
      </div>
    </div>
  );
}
