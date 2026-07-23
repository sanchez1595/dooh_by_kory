"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { cuentaBancaria, payouts, proximoPago } from "@/data";
import { useRol } from "@/hooks/use-vallas";

export default function IngresosPage() {
  useRol("dueno");
  const app = useApp();

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pt-8 pb-24">
      <div className="mb-1 text-[13px] text-slate-500">
        <Link href="/panel" className="font-semibold text-kory">
          ← Panel
        </Link>
      </div>
      <h1 className="m-0 mb-1 text-[26px] font-extrabold tracking-[-0.02em]">Ingresos</h1>
      <p className="mt-1 mb-6 text-[13.5px] text-slate-500">
        Lo que has ganado con tus pantallas, siempre en neto — la comisión ya está descontada.
      </p>

      {/* Próximo pago */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-6 py-5">
        <div>
          <div className="font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Próximo pago · {proximoPago.fecha}
          </div>
          <div className="mt-1 font-mono text-[28px] font-semibold tracking-[-0.02em] text-kory">
            {proximoPago.monto}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            Se transfiere automáticamente al finalizar cada campaña emitida.
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Cuenta de destino
          </div>
          <div className="mt-1 text-[13px] font-semibold">{cuentaBancaria}</div>
          <button
            onClick={() =>
              app.showToast("El cambio de cuenta llega con el backend — por ahora es demo")
            }
            className="mt-1.5 cursor-pointer text-xs font-semibold text-kory"
          >
            Cambiar cuenta
          </button>
        </div>
      </div>

      {/* Historial */}
      <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="m-0 text-[15.5px] font-bold">Historial de pagos</h3>
          <span className="font-mono text-[11px] text-slate-400">{payouts.length} campañas</span>
        </div>
        {payouts.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto] md:gap-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-bold">{p.marca}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                  {p.id}
                </span>
              </div>
              <div className="mt-0.5 text-[11.5px] text-slate-500">{p.detalle}</div>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                p.estado === "pagado"
                  ? "bg-[#ECFDF5] text-[#16A34A]"
                  : "bg-kory-tint text-kory"
              }`}
            >
              <span className="h-[5px] w-[5px] rounded-full bg-current" />
              {p.estado === "pagado" ? "Pagado" : "En custodia"}
            </span>
            <span className="hidden font-mono text-[11.5px] text-slate-400 md:block">{p.fecha}</span>
            <span className="text-right font-mono text-[13.5px] font-bold">{p.neto}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[10px] border border-[#BBF7D0] bg-[#ECFDF5] px-4 py-3 text-[12.5px] leading-normal text-[#166534]">
        El dinero de campañas activas queda <b>en custodia de Kory</b> y se libera al confirmar la
        emisión con Kory Vision. Si algún spot no sale, la diferencia vuelve a la marca — tú solo
        cobras lo emitido.
      </div>
    </div>
  );
}
