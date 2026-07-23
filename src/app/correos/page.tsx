"use client";

import { useApp } from "@/context/app-context";
import { getCorreos } from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { getQuote } from "@/lib/pricing";

export default function CorreosPage() {
  const app = useApp();
  const sel = useValla(app.vallaId);
  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);

  const correos = getCorreos({
    vallaNombre: sel.nombre,
    inicioCorto: quote.inicioCorto,
    finCorto: quote.finCorto,
    dias: app.dias,
    spots: app.spots,
    total: quote.total,
    subtotal: quote.subtotal,
    impTotales: quote.impTotales,
  });

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 pt-9 pb-[110px]">
      <h1 className="mb-1.5 text-[26px] font-extrabold tracking-[-0.02em]">
        Correos transaccionales
      </h1>
      <p className="mb-8 text-[13.5px] text-slate-500">
        Los cuatro momentos clave: solicitud enviada, solicitud recibida (dueño), campaña al aire y
        creativo rechazado con reembolso.
      </p>
      <div className="flex flex-wrap items-start gap-7">
        {correos.map((e) => (
          <div key={e.asunto} className="flex w-full max-w-[372px] flex-col gap-2.5">
            <div className="flex flex-col gap-1 rounded-[10px] border border-slate-200 bg-white px-3.5 py-3 text-[11.5px] text-slate-600">
              <div>
                <b className="font-semibold text-slate-400">De:</b> Vallas by Kory
                &lt;hola@vallas.kory.co&gt;
              </div>
              <div>
                <b className="font-semibold text-slate-400">Para:</b> {e.para}
              </div>
              <div>
                <b className="font-semibold text-slate-400">Asunto:</b>{" "}
                <b className="text-ink">{e.asunto}</b>
              </div>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 bg-[linear-gradient(135deg,#1A0A3E,#2D1B69)] px-[22px] py-[18px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/blanco.svg" alt="Kory" className="h-4" />
                <span className="text-[10px] font-bold tracking-[0.1em] text-lavender-200 uppercase">
                  Vallas
                </span>
              </div>
              <div className="flex flex-col gap-3.5 px-[22px] py-6">
                <span
                  style={{ background: e.pillBg, color: e.pillFg }}
                  className="inline-flex w-fit items-center gap-[5px] rounded-full px-2.5 py-[3px] text-[10.5px] font-bold"
                >
                  {e.pill}
                </span>
                <span className="text-[13.5px] font-semibold text-slate-700">{e.saludo}</span>
                <h2 className="m-0 text-[19px] leading-[1.25] font-extrabold tracking-[-0.015em]">
                  {e.titulo}
                </h2>
                <p className="m-0 text-[13px] leading-[1.65] text-slate-600">{e.cuerpo}</p>
                <div className="flex flex-col gap-1.5 rounded-[10px] border border-slate-200 bg-[#FAFAFA] px-[15px] py-[13px] text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pantalla</span>
                    <span className="font-semibold">{e.valla}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Campaña</span>
                    <span className="font-semibold">{e.fechas}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500">{e.montoLabel}</span>
                    <span className="font-mono font-bold">{e.monto}</span>
                  </div>
                </div>
                <div className="flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] bg-kory text-[13px] font-bold text-white hover:bg-kory-hover">
                  {e.cta}
                </div>
                <p className="m-0 text-[11.5px] leading-[1.55] text-slate-500">{e.pie}</p>
                <p className="m-0 text-xs text-slate-700">
                  Un abrazo,
                  <br />
                  <b>El equipo de Vallas by Kory ✨</b>
                </p>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-[22px] py-3.5 text-[10px] leading-[1.6] text-slate-400">
                Vallas by Kory · Bogotá, Colombia
                <br />
                Recibes este correo por tu cuenta en vallas.kory.co ·{" "}
                <span className="text-kory">Preferencias</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
