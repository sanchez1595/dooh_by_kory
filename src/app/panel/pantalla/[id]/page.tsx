"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/context/app-context";
import { diasSemana, getDispositivo, misVallas, playerPlataformas } from "@/data";
import { useRol } from "@/hooks/use-vallas";
import { fmt } from "@/lib/format";

const tabs = ["Resumen", "Tarifas", "Disponibilidad", "Fotos", "Dispositivos"] as const;
type Tab = (typeof tabs)[number];

/** Ocupación mock de agosto por pantalla: día → vendido */
const vendidos = new Set([1, 2, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 29, 30]);

const fotoLabels = ["Frontal · día", "Entorno", "Vista nocturna", "Tráfico", "Lateral", "Peatonal"];

export default function GestionPantallaPage() {
  useRol("dueno");
  const params = useParams<{ id: string }>();
  const app = useApp();
  const [tab, setTab] = useState<Tab>("Resumen");
  const [bloqueados, setBloqueados] = useState<Set<number>>(new Set([27, 28]));
  const [codigo, setCodigo] = useState("");
  const [demandaExtra, setDemandaExtra] = useState(false);

  const base = misVallas.find((m) => m.id === params.id) ?? misVallas[0];
  const ov = app.pantallaOverrides[base.id] ?? {};
  const tarifaBase = ov.tarifaBase ?? base.tarifaBase;
  const tarifaNocturna = ov.tarifaNocturna !== undefined ? ov.tarifaNocturna : base.tarifaNocturna;
  const pausada = ov.pausada ?? false;

  const setOverride = (patch: Partial<(typeof app.pantallaOverrides)[string]>) => {
    app.set({
      pantallaOverrides: {
        ...app.pantallaOverrides,
        [base.id]: { ...ov, ...patch },
      },
    });
  };

  const togglePausa = () => {
    const ahora = !pausada;
    setOverride({ pausada: ahora });
    app.showToast(
      ahora
        ? `${base.nombre} pausada — no recibirá nuevas solicitudes`
        : `${base.nombre} activa de nuevo`,
      () => setOverride({ pausada: !ahora }),
    );
  };

  const inputCls =
    "w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 font-mono text-[13.5px] text-ink shadow-xs outline-none focus:border-kory";

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pt-8 pb-24">
      <div className="mb-3 text-[13px] text-slate-500">
        <Link href="/panel" className="font-semibold text-kory">
          ← Panel
        </Link>
      </div>

      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div style={{ background: base.grad }} className="h-12 w-[68px] rounded-[10px]" />
          <div>
            <h1 className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">{base.nombre}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12.5px] text-slate-500">
              {base.ciudad} · {base.imp} imp/día
              {pausada ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                  <span className="h-[5px] w-[5px] rounded-full bg-current" />
                  Pausada
                </span>
              ) : (
                <span
                  style={{ background: base.ebg, color: base.efg }}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-current" />
                  {base.estado}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={togglePausa}
          className={`h-9 cursor-pointer rounded-[10px] border px-4 text-[12.5px] font-semibold ${
            pausada
              ? "border-kory bg-kory-tint text-kory hover:bg-lavender-tint"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {pausada ? "▶ Reactivar" : "⏸ Pausar"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px cursor-pointer border-b-2 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap ${
              tab === t
                ? "border-kory text-kory"
                : "border-transparent text-slate-500 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumen" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { k: "Ocupación agosto", v: base.occ },
            { k: "Ingresos del mes", v: base.ingresos },
            { k: "Tarifa por día", v: fmt(tarifaBase) },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <div className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                {s.k}
              </div>
              <div className="font-mono text-xl font-semibold">{s.v}</div>
            </div>
          ))}
          <div className="rounded-[10px] border border-lavender-tint bg-kory-pale px-4 py-3 text-[12.5px] leading-normal text-slate-700 md:col-span-3">
            ✨ <b>Kory IA:</b> tus noches (10 pm – 6 am) tienen 40% de espacio libre. Configura una
            tarifa nocturna en la pestaña <b>Tarifas</b> y podrías sumar{" "}
            <b className="font-mono">+$8,2M</b>/mes.
          </div>
        </div>
      )}

      {tab === "Tarifas" && (
        <div className="max-w-[440px] rounded-[14px] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4">
            <label className="block text-xs font-semibold text-slate-700">
              Tarifa base por día · COP
              <input
                key={`base-${base.id}`}
                defaultValue={tarifaBase}
                inputMode="numeric"
                onBlur={(e) => {
                  const v = Number(e.target.value.replace(/\D/g, "")) || tarifaBase;
                  if (v !== tarifaBase) {
                    setOverride({ tarifaBase: v });
                    app.showToast(`Tarifa base actualizada a ${fmt(v)}/día`);
                  }
                }}
                className={`mt-1.5 ${inputCls}`}
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Tarifa nocturna · 10 pm – 6 am · COP
              <input
                key={`noc-${base.id}`}
                placeholder="Sin tarifa nocturna"
                defaultValue={tarifaNocturna ?? ""}
                inputMode="numeric"
                onBlur={(e) => {
                  const v = Number(e.target.value.replace(/\D/g, "")) || null;
                  if (v !== tarifaNocturna) {
                    setOverride({ tarifaNocturna: v });
                    app.showToast(
                      v
                        ? `Tarifa nocturna activada: ${fmt(v)} — proyección +$8,2M/mes`
                        : "Tarifa nocturna desactivada",
                    );
                  }
                }}
                className={`mt-1.5 ${inputCls}`}
              />
            </label>
            <div className="text-[11.5px] leading-normal text-slate-500">
              Sugerencia Kory IA: <b className="font-mono">$980.000</b> nocturna. Pantallas
              similares en {base.ciudad} cobran entre <b className="font-mono">$1.500.000</b> y{" "}
              <b className="font-mono">$2.850.000</b> de día.
            </div>
          </div>
        </div>
      )}

      {tab === "Disponibilidad" && (
        <div>
          <p className="mt-0 mb-4 text-[13px] text-slate-500">
            Agosto 2026 · toca un día libre para bloquearlo (mantenimiento, uso propio) o
            desbloquearlo. Los días vendidos no se pueden tocar.
          </p>
          <div className="grid w-fit grid-cols-[repeat(7,40px)] gap-1.5">
            {diasSemana.map((dw) => (
              <div key={dw} className="text-center text-[10.5px] font-bold text-slate-400 uppercase">
                {dw}
              </div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`off-${i}`} className="h-10 w-10" />
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
              const vendido = vendidos.has(d);
              const bloqueado = bloqueados.has(d);
              return (
                <button
                  key={d}
                  onClick={() => {
                    if (vendido) {
                      app.showToast("Ese día ya está vendido — no se puede bloquear");
                      return;
                    }
                    setBloqueados((prev) => {
                      const next = new Set(prev);
                      if (next.has(d)) next.delete(d);
                      else next.add(d);
                      return next;
                    });
                  }}
                  style={{
                    background: vendido ? "#724CF5" : bloqueado ? "#F1F5F9" : "#fff",
                    color: vendido ? "#fff" : bloqueado ? "#94A3B8" : "#0F172A",
                    borderColor: vendido ? "#724CF5" : "#E2E8F0",
                    textDecoration: bloqueado ? "line-through" : "none",
                    cursor: vendido ? "not-allowed" : "pointer",
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-[9px] border font-mono text-[12.5px] font-semibold transition-colors hover:border-kory"
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="mt-3.5 flex gap-[18px] text-[11.5px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-kory" />
              Vendido
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-slate-200 bg-white" />
              Libre
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-slate-100" />
              Bloqueado por ti
            </span>
          </div>
        </div>
      )}

      {tab === "Dispositivos" && (() => {
        const disp = getDispositivo(base.id);
        const enLinea = disp?.estado === "en-linea";
        return (
          <div className="flex max-w-[640px] flex-col gap-4">
            {disp && (
              <div className="rounded-[14px] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[14.5px] font-bold">{base.nombre}</div>
                  {enLinea ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-[3px] text-[11px] font-bold text-[#16A34A]">
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                      En línea · {disp.detalle}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-2.5 py-[3px] text-[11px] font-bold text-[#DC2626]">
                      ○ {disp.detalle}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-slate-600">
                  <span>
                    Hoy: <b className="font-mono">{disp.spotsHoy}</b> spots emitidos
                  </span>
                  <span>Kory Player {disp.version}</span>
                  <span className="rounded-full bg-kory-tint px-2.5 py-[3px] text-[10.5px] font-bold text-kory">
                    Proof-of-play activo
                  </span>
                </div>
                {!enLinea && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[#FFF7ED] px-3.5 py-2.5 text-[12px] text-slate-700">
                    <span>
                      Tus campañas activas siguen programadas; se reanudan al reconectar.
                    </span>
                    <button
                      onClick={() =>
                        app.showToast("Guía enviada a tu correo — lo más común: revisar el router de la pantalla")
                      }
                      className="cursor-pointer font-semibold text-kory"
                    >
                      Ver guía de reconexión →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Vinculación en 3 pasos (patrón código en pantalla, tipo Netflix) */}
            <div className="rounded-[14px] border border-slate-200 bg-kory-pale p-5">
              <div className="mb-3 text-[13.5px] font-bold">
                {disp ? "Vincula otro dispositivo" : "Vincula tu pantalla en 3 pasos"}
              </div>
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                  <div className="text-[12.5px] font-bold">1 · Descarga Kory Player</div>
                  <div className="mt-1 text-[11.5px] leading-[1.5] text-slate-500">
                    {playerPlataformas}. Corre sobre el hardware que ya tienes, gratis.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                  <div className="text-[12.5px] font-bold">2 · Ábrelo en tu pantalla</div>
                  <div className="mt-1 text-[11.5px] leading-[1.5] text-slate-500">
                    Verás un código de 6 caracteres en grande.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                  <div className="text-[12.5px] font-bold">3 · Escríbelo aquí</div>
                  <div className="mt-1.5 flex gap-1.5">
                    <input
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      placeholder="K7-4F2C"
                      maxLength={7}
                      className="h-9 w-full min-w-0 rounded-[9px] border border-slate-200 px-2.5 font-mono text-[12.5px] uppercase outline-none focus:border-kory"
                      aria-label="Código de vinculación"
                    />
                    <button
                      onClick={() => {
                        if (codigo.trim().length < 6) {
                          app.showToast("Escribe el código de 6 caracteres que ves en tu pantalla");
                          return;
                        }
                        setCodigo("");
                        app.showToast(`Dispositivo ${codigo} vinculado a ${base.nombre} ✓`);
                      }}
                      className="h-9 shrink-0 cursor-pointer rounded-[9px] bg-kory px-3 text-[12px] font-bold text-white hover:bg-kory-hover"
                    >
                      Vincular
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Demanda programática extra — el dueño conserva el control */}
            <div className="rounded-[14px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-bold">
                    Demanda extra{" "}
                    <span className="rounded-full bg-kory-tint px-2 py-[2px] text-[10px] font-bold text-kory">
                      beta
                    </span>
                  </div>
                  <p className="mt-1 mb-0 max-w-[420px] text-[12px] leading-[1.55] text-slate-500">
                    Conecta esta pantalla a demanda programática global. Tú apruebas cada anuncio y
                    defines tu precio piso; se puede apagar cuando quieras.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={demandaExtra}
                  aria-label="Activar demanda extra"
                  onClick={() => {
                    const on = !demandaExtra;
                    setDemandaExtra(on);
                    app.showToast(
                      on
                        ? "Demanda extra activada — nada sale al aire sin tu aprobación"
                        : "Demanda extra desactivada",
                      () => setDemandaExtra(!on),
                    );
                  }}
                  className={`relative h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full transition-colors ${
                    demandaExtra ? "bg-kory" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-[left] ${
                      demandaExtra ? "left-[23px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {tab === "Fotos" && (
        <div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {fotoLabels.map((label, i) => (
              <div
                key={label}
                style={{ background: i === 0 ? base.grad : undefined }}
                className={`flex h-[110px] items-end rounded-xl p-2.5 ${
                  i === 0 ? "" : "bg-[linear-gradient(160deg,#E9E6F5,#D9D3EC)]"
                }`}
              >
                <span className="rounded-full bg-[rgba(13,13,13,0.55)] px-2 py-0.5 text-[10px] font-semibold text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => app.showToast("La gestión de fotos llega con el backend (Storage)")}
            className="mt-4 h-9 cursor-pointer rounded-[10px] border border-slate-200 bg-white px-4 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            + Agregar fotos
          </button>
        </div>
      )}
    </div>
  );
}
