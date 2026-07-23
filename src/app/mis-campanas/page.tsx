"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { campanas, getValla } from "@/data";
import type { EstadoCampana } from "@/data/types";
import { useRol } from "@/hooks/use-vallas";

const pillEstado: Record<EstadoCampana, { label: string; cls: string }> = {
  "al-aire": { label: "Al aire", cls: "bg-[#ECFDF5] text-[#16A34A]" },
  "en-revision": { label: "En revisión", cls: "bg-kory-tint text-kory" },
  rechazada: { label: "Rechazada", cls: "bg-[#FEF2F2] text-[#B91C1C]" },
  finalizada: { label: "Finalizada", cls: "bg-slate-100 text-slate-500" },
};

export default function MisCampanasPage() {
  useRol("anunciante");
  const router = useRouter();
  const app = useApp();

  const lista = campanas.map((c) => ({
    ...c,
    estado: app.campanaEstados[c.id] ?? c.estado,
  }));

  const resubir = (id: string) => {
    app.set({ campanaEstados: { ...app.campanaEstados, [id]: "en-revision" } });
    app.showToast("Creativo re-enviado — el dueño lo revisará en menos de 24 h");
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pt-8 pb-24">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">Mis campañas</h1>
        <Link href="/correos" className="text-[12.5px] font-semibold text-kory">
          Ver correos de ejemplo →
        </Link>
      </div>
      <p className="mt-1 mb-6 text-[13.5px] text-slate-500">
        Todo lo que has pautado con Vallas by Kory, del pago al certificado.
      </p>

      <div className="flex flex-col gap-3">
        {lista.map((c) => {
          const valla = getValla(c.vallaId);
          const pill = pillEstado[c.estado];
          const rechazada = c.estado === "rechazada";
          return (
            <div
              key={c.id}
              className={`grid grid-cols-[52px_1fr] items-center gap-3 rounded-xl border bg-white p-4 md:grid-cols-[64px_1fr_auto_auto] md:gap-4 ${
                rechazada ? "border-dashed border-[#F5BAD3]" : "border-slate-200"
              }`}
            >
              <div
                style={{ background: valla?.grad }}
                className="h-10 w-[52px] rounded-lg md:h-11 md:w-16"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-bold">{c.nombre}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                    {c.id}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {c.fechas} ·{" "}
                  {rechazada ? (
                    <span>
                      <b className="font-mono font-semibold text-[#B91C1C]">
                        Reembolsado {c.reembolso}
                      </b>{" "}
                      · {c.motivoRechazo}
                    </span>
                  ) : (
                    c.detalle
                  )}
                </div>
              </div>
              <span
                className={`col-start-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold md:col-start-auto ${pill.cls}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {pill.label}
              </span>
              <div className="col-start-2 md:col-start-auto">
                {c.estado === "al-aire" && (
                  <Link
                    href="/mi-campana"
                    className="inline-flex h-8 items-center rounded-lg bg-kory px-3.5 text-xs font-bold text-white hover:bg-kory-hover hover:text-white"
                  >
                    Ver en vivo
                  </Link>
                )}
                {c.estado === "en-revision" && (
                  <button
                    onClick={() =>
                      app.showToast("El dueño tiene hasta 24 h — te avisamos por correo y WhatsApp")
                    }
                    className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Detalles
                  </button>
                )}
                {c.estado === "rechazada" && (
                  <button
                    onClick={() => resubir(c.id)}
                    className="h-8 cursor-pointer rounded-lg bg-[#B91C1C] px-3.5 text-xs font-bold text-white hover:bg-[#991B1B]"
                  >
                    Re-subir creativo
                  </button>
                )}
                {c.estado === "finalizada" && (
                  <button
                    onClick={() => {
                      app.set({ vallaId: c.vallaId });
                      router.push(`/valla/${c.vallaId}`);
                    }}
                    className="h-8 cursor-pointer rounded-lg border border-kory bg-white px-3.5 text-xs font-bold text-kory hover:bg-kory-tint"
                  >
                    Renovar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[10px] border border-lavender-tint bg-kory-pale px-4 py-3 text-[12.5px] leading-normal text-slate-700">
        Si un creativo es rechazado, el reembolso es automático e inmediato — revisa el correo
        "Te devolvimos el 100%" en{" "}
        <Link href="/correos" className="font-semibold text-kory">
          correos de ejemplo
        </Link>
        .
      </div>
    </div>
  );
}
