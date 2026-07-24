"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import {
  audienciaHoy,
  avanceCampana,
  emisiones,
  facturacion,
  ordenId,
  perfilHorario,
  soporteToast,
} from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { fmt, fmtMillones } from "@/lib/format";
import { getQuote } from "@/lib/pricing";

export default function MiCampanaPage() {
  const router = useRouter();
  const app = useApp();
  const sel = useValla(app.vallaId);
  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);

  const avancePct = `${Math.round(avanceCampana * 100)}%`;
  const impAcum = fmtMillones(quote.impTotales * avanceCampana);

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 pt-8 pb-[90px]">
      <div className="mb-3 text-[13px] text-slate-500">
        <Link href="/mis-campanas" className="font-semibold text-kory">
          ← Mis campañas
        </Link>
      </div>
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">Mi campaña</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#16A34A]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Al aire ahora
            </span>
            <span className="rounded-full bg-kory-tint px-2.5 py-1 font-mono text-[11px] font-bold text-kory">
              {ordenId}
            </span>
          </div>
          <p className="m-0 text-[13.5px] text-slate-500">
            {sel.nombre} · {quote.inicioCorto} – {quote.finCorto} · {app.spots} spots/hora
          </p>
        </div>
        <button
          onClick={() => app.openModal("certificado")}
          className="inline-flex h-10 cursor-pointer items-center gap-[7px] rounded-[10px] border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:border-lavender-strong hover:bg-kory-pale"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-[15px] w-[15px]" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          Ver certificado de emisión
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* En vivo */}
          <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 px-5 py-4">
              <h3 className="m-0 text-[15.5px] font-bold">Tu anuncio, al aire — en este momento</h3>
              <span className="inline-flex items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[10.5px] font-bold text-kory">
                ✨ Verificado por Kory Vision
              </span>
            </div>
            <div
              style={{ background: sel.grad }}
              className="relative flex h-[250px] items-center justify-center"
            >
              <div className="rounded-[10px] bg-white/95 px-[34px] py-[22px] text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="text-xl font-extrabold tracking-[-0.01em] text-ink">CAFÉ ANDINO</div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-kory uppercase">
                  Cosecha de origen · desde $12.900
                </div>
              </div>
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(13,13,13,0.65)] px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A6FF4D]" />
                EN VIVO
              </span>
              <span className="absolute bottom-3 left-3 rounded-lg bg-[rgba(13,13,13,0.65)] px-2.5 py-1 font-mono text-[10.5px] text-white backdrop-blur-xs">
                Captura de hoy · 3:42 pm
              </span>
              <span className="absolute right-3 bottom-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-ink">
                Cámara Kory Vision · a 12 m
              </span>
            </div>
            <div className="px-5 pt-1.5 pb-3.5">
              <div className="grid grid-cols-[90px_1fr_auto] border-b border-slate-100 py-[9px] font-mono text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                <span>Hora</span>
                <span>Emisión</span>
                <span>Verificación</span>
              </div>
              {emisiones.map((em) => (
                <div
                  key={em.hora}
                  className="grid grid-cols-[90px_1fr_auto] items-center border-b border-slate-100 py-2.5 text-[12.5px]"
                >
                  <span className="font-mono text-slate-600">{em.hora}</span>
                  <span className="text-slate-700">{em.evento}</span>
                  <span className="inline-flex items-center gap-[5px] text-[11.5px] font-semibold text-[#16A34A]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-[13px] w-[13px]"
                      strokeWidth={2.4}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {em.ver}
                  </span>
                </div>
              ))}
              <div className="pt-2.5 text-[11.5px] text-slate-400">
                Cada emisión queda registrada con foto y hora exacta — disponibles en tu
                certificado.
              </div>
            </div>
          </div>

          {/* Audiencia */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
              <h3 className="m-0 text-[15.5px] font-bold">Audiencia real de tu campaña</h3>
              <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ECFDF5] px-2.5 py-[3px] text-[10.5px] font-semibold text-[#16A34A]">
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                Actualizado hace 2 min
              </span>
            </div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold tracking-[-0.02em]">{impAcum}</span>
              <span className="text-[13px] text-slate-500">
                de ≈ {quote.impTotalesF} impresiones estimadas · {avancePct}
              </span>
            </div>
            <div className="mb-[18px] h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                style={{ width: avancePct }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#9B7BF7,#724CF5)]"
              />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 px-[15px] py-[13px]">
                <div className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                  Personas hoy
                </div>
                <div className="font-mono text-[19px] font-semibold">{audienciaHoy.personas}</div>
              </div>
              <div className="rounded-xl border border-slate-200 px-[15px] py-[13px]">
                <div className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                  Vehículos hoy
                </div>
                <div className="font-mono text-[19px] font-semibold">{audienciaHoy.vehiculos}</div>
              </div>
            </div>
            <div className="flex h-16 items-end gap-1 rounded-xl border border-slate-200 px-3.5 py-3">
              {perfilHorario.map((h, i) => (
                <div
                  key={i}
                  title={`${6 + i}:00`}
                  style={{
                    height: `${Math.round(h * 0.32)}px`,
                    background: i === 12 || i === 13 ? "#724CF5" : "#E0D4FF",
                  }}
                  className="flex-1 rounded-t-sm"
                />
              ))}
              <span className="ml-2.5 font-mono text-[10px] whitespace-nowrap text-slate-400">
                hoy por hora
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Inversión */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            <h3 className="mb-3.5 text-[15.5px] font-bold">Tu inversión</h3>
            <div className="flex flex-col gap-[9px] text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span>Total pagado</span>
                <span className="font-mono font-bold">{quote.totalF}</span>
              </div>
              <div className="flex justify-between">
                <span>Consumido hasta hoy</span>
                <span className="font-mono">{fmt(quote.total * avanceCampana)}</span>
              </div>
              <div className="flex justify-between">
                <span>Por emitir</span>
                <span className="font-mono">{fmt(quote.total * (1 - avanceCampana))}</span>
              </div>
            </div>
            <div className="mt-3 mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div style={{ width: avancePct }} className="h-full rounded-full bg-kory" />
            </div>
            <div className="mb-3 font-mono text-[11px] text-slate-400">
              {avancePct} de la campaña emitido
            </div>
            <div className="rounded-[10px] border border-[#BBF7D0] bg-[#ECFDF5] px-[13px] py-[11px] text-xs leading-normal text-[#166534]">
              Si algún spot no se emite, te devolvemos la diferencia — automático, sin reclamos.
            </div>
          </div>

          {/* Confianza */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            <h3 className="mb-3.5 text-[15.5px] font-bold">Por qué puedes confiar</h3>
            <div className="flex flex-col gap-3 text-[12.5px] leading-normal text-slate-700">
              <div className="flex gap-[9px]">
                <span className="font-bold text-[#16A34A]">✓</span>
                <span>
                  <b>Cada emisión, con foto y hora.</b> La cámara Kory Vision captura tu spot en
                  pantalla.
                </span>
              </div>
              <div className="flex gap-[9px]">
                <span className="font-bold text-[#16A34A]">✓</span>
                <span>
                  <b>Audiencia contada, no estimada.</b> Personas y vehículos reales frente a tu
                  valla.
                </span>
              </div>
              <div className="flex gap-[9px]">
                <span className="font-bold text-[#16A34A]">✓</span>
                <span>
                  <b>Certificado descargable.</b> Un PDF con todo el registro, listo para tu equipo
                  o tu cliente.
                </span>
              </div>
            </div>
            <button
              onClick={() => app.showToast(soporteToast)}
              className="mt-4 h-[38px] w-full cursor-pointer rounded-[10px] bg-kory-tint text-[12.5px] font-bold text-kory hover:bg-lavender-tint"
            >
              Hablar con una persona real
            </button>
          </div>

          {/* Próximo reporte */}
          <div className="flex items-center gap-3 rounded-[14px] border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-[18px] py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-5 w-5 shrink-0" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
            <div className="text-[12.5px] leading-normal text-slate-700">
              Tu próximo reporte semanal llega el <b>lunes 17 ago</b> a {facturacion.correo} —{" "}
              <Link href="/correos" className="font-semibold text-kory">
                ver ejemplo
              </Link>
            </div>
          </div>

          {/* Renovar — se ofrece en el pico de satisfacción */}
          <div className="rounded-[14px] bg-[linear-gradient(135deg,#1A0A3E,#2D1B69)] p-5 text-white">
            <div className="text-[10.5px] font-bold tracking-[0.1em] text-lavender-200 uppercase">
              Va funcionando
            </div>
            <div className="mt-1.5 text-[15px] leading-snug font-bold">
              Con este ritmo cierras con ≈ {quote.impTotalesF} impresiones. Asegura tus fechas de
              septiembre antes de que otra marca las tome.
            </div>
            <button
              onClick={() => {
                app.set({ vallaId: sel.id, inicioDia: 32 });
                router.push(`/valla/${sel.id}`);
              }}
              className="mt-3.5 h-10 w-full cursor-pointer rounded-[10px] bg-white text-[13px] font-bold text-[#1A0A3E] transition-colors hover:bg-lavender-100"
            >
              Renovar campaña · 1 – 14 sep
            </button>
            <div className="mt-2 text-center text-[10.5px] text-white/50">
              Mismo creativo, cero trámites · cancela gratis hasta 72 h antes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
