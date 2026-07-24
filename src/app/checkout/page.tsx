"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { creativoDemo, facturacion, metodosPago } from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { getQuote } from "@/lib/pricing";

const pasos = [
  { n: "1", label: "Campaña", estado: "done" },
  { n: "2", label: "Creativos y pago", estado: "actual" },
  { n: "3", label: "Al aire", estado: "pendiente" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const app = useApp();
  const sel = useValla(app.vallaId);
  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);

  const pagar = () => {
    if (app.creativo) router.push("/confirmacion");
    else app.showToast("Sube tu creativo para poder enviar la solicitud");
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 pt-8 pb-20">
      <div className="mb-2 text-[13px] text-slate-500">
        <Link href={`/valla/${sel.id}`} className="font-semibold text-kory">
          ← Volver a la valla
        </Link>
      </div>
      <h1 className="mb-6 text-[28px] font-extrabold tracking-[-0.02em]">Confirma tu campaña</h1>

      {/* Pasos */}
      <div className="mb-9 flex items-center">
        {pasos.map((p, i) => (
          <div key={p.n} className="flex items-center gap-2.5">
            <span
              className={`box-border inline-flex h-7 w-7 items-center justify-center rounded-full border text-[12.5px] font-bold ${
                p.estado === "done"
                  ? "border-kory bg-kory text-white"
                  : p.estado === "actual"
                    ? "border-[1.5px] border-kory bg-kory-tint text-kory"
                    : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {p.estado === "done" ? "✓" : p.n}
            </span>
            <span
              className={`text-[13px] font-semibold ${
                p.estado === "actual"
                  ? "text-kory"
                  : p.estado === "done"
                    ? "text-ink"
                    : "text-slate-400"
              }`}
            >
              {p.label}
            </span>
            {i < pasos.length - 1 && <div className="mx-3.5 h-px w-14 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          {/* 1 · Creativo */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-6">
            <h3 className="mb-1 text-[16.5px] font-bold">1 · Sube tu creativo</h3>
            <p className="mb-4 text-[13px] text-slate-500">
              Formato {sel.res} px · JPG, PNG o MP4 · spot de 10 s máx. 30 MB
            </p>
            {!app.creativo ? (
              <div
                onClick={() => {
                  app.set({ creativo: true });
                  app.showToast("Creativo cargado — cumple las specs de la pantalla");
                }}
                className="cursor-pointer rounded-xl border-[1.5px] border-dashed border-lavender-dash bg-kory-pale p-[34px] text-center transition-colors hover:border-kory"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#724CF5"
                  className="mx-auto mb-2 h-[26px] w-[26px]"
                  strokeWidth={2}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m17 8-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                <div className="text-[13.5px] font-semibold text-ink">
                  Arrastra tu pieza o haz clic para subir
                </div>
                <div className="mt-1.5 text-xs font-semibold text-kory">
                  ✨ O pide a Kory IA que genere el spot por ti
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-[#BBF7D0] bg-[#ECFDF5] px-4 py-3.5">
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-[#BBF7D0] bg-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16A34A"
                    className="h-4 w-4"
                    strokeWidth={2.4}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-ink">{creativoDemo.archivo}</div>
                  <div className="mt-px text-[11.5px] font-semibold text-[#16A34A]">
                    {creativoDemo.detalle}
                  </div>
                </div>
                <button
                  onClick={() => app.set({ creativo: false })}
                  className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* 2 · Facturación */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-[16.5px] font-bold">2 · Datos de facturación</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-[5px] block text-xs font-semibold text-slate-700">
                  Razón social
                  <input
                    defaultValue={facturacion.razonSocial}
                    className="mt-[5px] w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 text-[13.5px] font-normal text-ink shadow-xs outline-none focus:border-kory"
                  />
                </label>
              </div>
              <div>
                <label className="mb-[5px] block text-xs font-semibold text-slate-700">
                  NIT
                  <input
                    defaultValue={facturacion.nit}
                    className="mt-[5px] w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 font-mono text-[13.5px] font-normal text-ink shadow-xs outline-none focus:border-kory"
                  />
                </label>
              </div>
              <div>
                <label className="mb-[5px] block text-xs font-semibold text-slate-700">
                  Correo
                  <input
                    type="email"
                    defaultValue={facturacion.correo}
                    className="mt-[5px] w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 text-[13.5px] font-normal text-ink shadow-xs outline-none focus:border-kory"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3 · Pago */}
          <div className="rounded-[14px] border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-[16.5px] font-bold">3 · Método de pago</h3>
            <div className="flex flex-col gap-2.5">
              {metodosPago.map((pg) => {
                const act = app.pago === pg.id;
                return (
                  <div
                    key={pg.id}
                    onClick={() => app.set({ pago: pg.id })}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3.5 transition-colors hover:border-kory ${
                      act ? "border-kory bg-kory-pale" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span
                      style={{
                        border: act ? "5px solid #724CF5" : "1.5px solid #CBD5E1",
                      }}
                      className="box-border h-4 w-4 shrink-0 rounded-full bg-white"
                    />
                    <div className="flex-1">
                      <div className="text-[13.5px] font-bold text-ink">{pg.titulo}</div>
                      <div className="font-mono text-xs text-slate-500">{pg.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="sticky top-[88px] flex flex-col gap-4">
          <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex gap-3">
              <div
                style={{ background: sel.grad }}
                className="h-14 w-[76px] shrink-0 rounded-[10px]"
              />
              <div>
                <div className="text-[13.5px] font-bold">{sel.nombre}</div>
                <div className="mt-0.5 text-[11.5px] text-slate-500">{sel.ubicacion}</div>
                <div className="mt-0.5 text-[11.5px] font-semibold">★ {sel.rating}</div>
              </div>
            </div>
            <div className="flex flex-col gap-[7px] border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span>Campaña</span>
                <span className="font-semibold">
                  {quote.inicioCorto} – {quote.finCorto} ({app.dias} días)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frecuencia</span>
                <span className="font-semibold">{app.spots} spots/hora · 10 s</span>
              </div>
              <div className="flex justify-between">
                <span>Impresiones est.</span>
                <span className="font-mono font-semibold">≈ {quote.impTotalesF}</span>
              </div>
            </div>
            <div className="flex flex-col gap-[7px] border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{quote.subtotalF}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio Kory (8%)</span>
                <span className="font-mono">{quote.servicioF}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 text-[15px] font-bold text-ink">
                <span>Total COP</span>
                <span className="font-mono">{quote.totalF}</span>
              </div>
            </div>
            <button
              onClick={pagar}
              style={{ opacity: app.creativo ? 1 : 0.5 }}
              className="h-12 cursor-pointer rounded-[11px] bg-kory text-[14.5px] font-bold text-white transition-[background,opacity] hover:bg-kory-hover"
            >
              Pagar y enviar solicitud
            </button>
            {!app.creativo && (
              <div className="text-center text-[11.5px] font-semibold text-[#EA580C]">
                Sube tu creativo para continuar
              </div>
            )}
            <div className="text-center text-[11px] leading-normal text-slate-400">
              Pago retenido por Kory hasta que tu spot esté al aire.
              <br />
              Cancela gratis hasta 72 h antes del inicio.
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[11.5px] font-semibold text-[#16A34A]">
            <span>✓ Pago protegido</span>
            <span>✓ Al aire en 24 h</span>
            <span>✓ Reporte en vivo</span>
          </div>
          {quote.total > 20e6 && (
            <div className="rounded-xl border border-lavender-border bg-kory-pale px-4 py-3.5">
              <div className="text-[12.5px] leading-[1.55] text-slate-700">
                <b>Tu pedido supera $20M.</b> Un asesor puede optimizarte el mix de pantallas sin
                costo — o continúa tú mismo, como vas.
              </div>
              <button
                onClick={() => app.openModal("brief")}
                className="mt-2.5 h-9 cursor-pointer rounded-[9px] border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hablar con un asesor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
