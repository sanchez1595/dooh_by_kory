"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { duenoNombre, kpisBase, misVallas, perfilHorario, sugerenciaIA, visionStats } from "@/data";
import { useSolicitudes } from "@/hooks/use-solicitudes";
import { useRol } from "@/hooks/use-vallas";

export default function PanelPage() {
  useRol("dueno");
  const router = useRouter();
  const app = useApp();
  const { lista, resueltas, pendientes } = useSolicitudes();

  const kpis = [
    ...kpisBase,
    {
      label: "Solicitudes pendientes",
      valor: String(pendientes),
      delta: resueltas ? `${resueltas} resuelta${resueltas > 1 ? "s" : ""}` : "2 nuevas",
      vs: "hoy",
      dbg: "#F0EDFF",
      dfg: "#724CF5",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 pt-8 pb-20">
      {/* Encabezado */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[26px] font-extrabold tracking-[-0.02em]">
            Hola, {duenoNombre} 👋
          </h1>
          <p className="m-0 text-[13.5px] text-slate-500">Tus 4 pantallas · agosto 2026</p>
        </div>
        <button
          onClick={() => router.push("/publicar")}
          className="inline-flex h-10 cursor-pointer items-center gap-[7px] rounded-[10px] bg-kory px-[18px] text-[13px] font-bold text-white hover:bg-kory-hover"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-[15px] w-[15px]" strokeWidth={2.4}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Publicar nueva valla
        </button>
      </div>

      {/* KPIs */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-200 bg-white p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
          >
            <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
              {k.label}
            </div>
            <div className="font-mono text-2xl font-semibold tracking-[-0.02em]">{k.valor}</div>
            <div className="mt-2">
              <span
                style={{ background: k.dbg, color: k.dfg }}
                className="inline-flex items-center gap-[3px] rounded-md px-[7px] py-0.5 font-mono text-[11px] font-semibold"
              >
                {k.delta}
              </span>{" "}
              <span className="text-[11px] text-slate-400">{k.vs}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kory Vision */}
      <div className="mb-6 rounded-[14px] border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-[22px] py-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-lavender-border bg-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-[18px] w-[18px]" strokeWidth={2}>
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="m-0 text-[15.5px] font-bold">Medición de audiencia en vivo</h3>
              <span className="inline-flex items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[10.5px] font-bold text-kory">
                ✨ Kory Vision · cámara IA
              </span>
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              La cámara analiza tráfico y transeúntes de forma anónima — nunca guarda rostros ni
              placas.
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11.5px] font-semibold text-[#16A34A]">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />3 en línea · 1 en mantenimiento
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {visionStats.map((vs) => (
            <div key={vs.k} className="rounded-xl border border-lavender-tint bg-white px-4 py-3.5">
              <div className="mb-[7px] font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                {vs.k}
              </div>
              <div className="font-mono text-[21px] font-semibold tracking-[-0.02em] text-ink">
                {vs.v}
              </div>
              <div style={{ color: vs.dc }} className="mt-[5px] text-[11px] font-semibold">
                {vs.d}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3.5 flex h-14 items-end gap-1 rounded-xl border border-lavender-tint bg-white px-3.5 py-3">
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
            audiencia · hoy por hora
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Mis pantallas */}
        <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-[18px]">
            <h3 className="m-0 text-[15.5px] font-bold">Mis pantallas</h3>
            <span className="font-mono text-[11px] text-slate-400">4 de 4</span>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-slate-100 px-5 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
            <span>Pantalla</span>
            <span>Estado</span>
            <span>Ocupación</span>
            <span className="text-right">Ingresos mes</span>
          </div>
          {misVallas.map((m) => {
            const pausada = !!app.pantallaOverrides[m.id]?.pausada;
            return (
            <div
              key={m.nombre}
              onClick={() => router.push(`/panel/pantalla/${m.id}`)}
              className="grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-slate-100 px-5 py-3.5 hover:bg-kory-pale"
            >
              <div className="flex items-center gap-[11px]">
                <div style={{ background: m.grad }} className="h-8 w-11 shrink-0 rounded-[7px]" />
                <div>
                  <div className="text-[13px] font-semibold">{m.nombre}</div>
                  <div className="text-[11px] text-slate-500">{m.ciudad} · gestionar →</div>
                </div>
              </div>
              <span
                style={pausada ? { background: "#F1F5F9", color: "#64748B" } : { background: m.ebg, color: m.efg }}
                className="inline-flex w-fit items-center gap-[5px] rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {pausada ? "Pausada" : m.estado}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-[5px] max-w-[70px] flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div style={{ width: m.occ }} className="h-full rounded-full bg-kory" />
                </div>
                <span className="font-mono text-[11.5px] text-slate-600">{m.occ}</span>
              </div>
              <span className="text-right font-mono text-[13px] font-semibold">{m.ingresos}</span>
            </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {/* Solicitudes */}
          <div className="rounded-[14px] border border-slate-200 bg-white px-5 py-[18px]">
            <h3 className="mb-3.5 text-[15.5px] font-bold">
              Solicitudes pendientes{" "}
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-kory px-1 font-mono text-[11px] font-bold text-white">
                {pendientes}
              </span>
            </h3>
            <div className="flex flex-col gap-3">
              {lista.map((s) => (
                <div
                  key={s.key}
                  style={{
                    borderColor: s.aprobada ? "#BBF7D0" : "#E2E8F0",
                    background: s.aprobada ? "#ECFDF5" : s.rechazada ? "#FAFAFA" : "#fff",
                  }}
                  className="flex flex-col gap-[9px] rounded-xl border p-3.5 transition-colors"
                >
                  <div className="flex items-center gap-[9px]">
                    <div
                      style={{ background: s.av }}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[11px] font-bold text-white"
                    >
                      {s.ini}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12.5px] font-bold">{s.marca}</div>
                      <div className="text-[11px] text-slate-500">{s.detalle}</div>
                    </div>
                    <span className="text-right"><span className="block font-mono text-[12.5px] font-semibold">{s.neto}</span><span className="block text-[9.5px] text-slate-400">para ti</span></span>
                  </div>
                  {s.pendiente && (
                    <div className="flex gap-2">
                      <button
                        onClick={s.aprobar}
                        className="h-8 flex-1 cursor-pointer rounded-lg bg-kory text-xs font-semibold text-white hover:bg-kory-hover"
                      >
                        Aprobar creativo
                      </button>
                      <button
                        onClick={s.ver}
                        className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Ver
                      </button>
                    </div>
                  )}
                  {s.aprobada && (
                    <div className="flex items-center gap-[7px] text-xs font-semibold text-[#16A34A]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-3.5 w-3.5"
                        strokeWidth={2.4}
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Aprobada · notificamos a la marca por correo
                    </div>
                  )}
                  {s.rechazada && (
                    <div className="flex items-center gap-[7px] text-xs font-semibold text-slate-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-3.5 w-3.5"
                        strokeWidth={2.4}
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      Rechazada · la marca recibió su reembolso completo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sugerencia IA */}
          <div className="rounded-[14px] border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-5 py-[18px]">
            <span className="inline-flex items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[10.5px] font-bold text-kory">
              ✨ Sugerencia · Kory IA
            </span>
            <p className="mt-2.5 mb-0 text-[12.5px] leading-[1.6] text-slate-700">
              Tu pantalla de la <b>Av. NQS</b> tiene 40% de espacio libre entre 10 pm y 6 am. Baja
              la tarifa nocturna a <b className="font-mono">$980.000</b> y podrías sumar{" "}
              <b className="font-mono">+$8,2M</b>/mes.
            </p>
            <button
              onClick={() => app.showToast(sugerenciaIA.toast, () => undefined)}
              className="mt-3 h-8 cursor-pointer rounded-lg bg-kory-tint px-3.5 text-xs font-semibold text-kory hover:bg-lavender-tint"
            >
              Aplicar tarifa nocturna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
