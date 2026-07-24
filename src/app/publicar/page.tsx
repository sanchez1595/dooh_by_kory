"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { TipoValla, Valla } from "@/data/types";
import { useRol } from "@/hooks/use-vallas";
import { fmt } from "@/lib/format";

const pasos = [
  { n: 1, titulo: "Datos básicos", sub: "nombre · tipo · tamaño" },
  { n: 2, titulo: "Ubicación", sub: "ciudad · dirección" },
  { n: 3, titulo: "Fotos", sub: "mín. 4 · día y noche" },
  { n: 4, titulo: "Tarifa y revisión", sub: "precio/día · publicar" },
];

const tipos: TipoValla[] = [
  "Valla LED",
  "Torre digital",
  "Paradero digital",
  "Centro comercial",
  "Aeropuerto",
  "Estación",
];

const fotoLabels = ["Frontal · día", "Entorno", "Vista nocturna", "Tráfico", "Lateral", "Peatonal"];

const inputCls =
  "w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 text-[13.5px] text-ink shadow-xs outline-none focus:border-kory";

export default function PublicarPage() {
  useRol("dueno");
  const router = useRouter();
  const app = useApp();

  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    nombre: "Pantalla LED Calle 26",
    tipo: "Valla LED" as TipoValla,
    dim: "10×4 m",
    res: "1920×768",
    ciudad: "Bogotá" as "Bogotá" | "Medellín",
    direccion: "Calle 26 con Cra 68, frente a Salitre",
    fotos: 0,
    precio: 1800000,
  });

  const up = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const publicar = () => {
    const nueva: Valla = {
      id: 100 + app.vallasExtra.length,
      nombre: form.nombre,
      ciudad: form.ciudad,
      ubicacion: `${form.ciudad} · ${form.direccion.split(",")[0]}`,
      tipo: form.tipo,
      dim: form.dim,
      res: form.res,
      imp: "120K",
      impN: 120000,
      precio: form.precio,
      rating: "5.0",
      reviews: 0,
      grad: "linear-gradient(135deg,#1A0A3E,#9B7BF7)",
      x: "46%",
      y: "58%",
    };
    app.set({ vallasExtra: [...app.vallasExtra, nueva], rol: "anunciante" });
    app.showToast("¡Tu pantalla ya está en el marketplace! Búscala en Explorar");
    router.push("/");
  };

  const puedeContinuar =
    paso === 1
      ? form.nombre.trim().length > 2
      : paso === 2
        ? form.direccion.trim().length > 3
        : paso === 3
          ? form.fotos >= 4
          : form.precio > 0;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 pt-8 pb-24">
      <h1 className="mb-1 text-[26px] font-extrabold tracking-[-0.02em]">Publica tu valla</h1>
      <p className="mt-1 mb-7 text-[13.5px] text-slate-500">
        La revisamos y queda visible en menos de 24 h. Sin costos fijos — solo 8% por campaña
        vendida.
      </p>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[190px_1fr_230px]">
        {/* Stepper */}
        <div className="flex flex-row gap-4 overflow-x-auto md:flex-col md:gap-0">
          {pasos.map((p, i) => {
            const done = paso > p.n;
            const now = paso === p.n;
            return (
              <div key={p.n} className="flex shrink-0 gap-2.5">
                <div className="flex flex-col items-center">
                  <span
                    className={`box-border flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                      done
                        ? "bg-kory text-white"
                        : now
                          ? "border-[1.5px] border-kory bg-kory-tint text-kory"
                          : "border-[1.5px] border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {done ? "✓" : p.n}
                  </span>
                  {i < pasos.length - 1 && (
                    <span className="hidden min-h-[18px] w-[1.5px] flex-1 bg-slate-200 md:block" />
                  )}
                </div>
                <div className="pb-4">
                  <div className={`text-[13px] font-bold ${now ? "text-ink" : "text-slate-500"}`}>
                    {p.titulo}
                  </div>
                  <div className="text-[10.5px] text-slate-400">{p.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulario del paso */}
        <div className="rounded-[14px] border border-slate-200 bg-white p-6">
          {paso === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-[5px] text-xs font-semibold text-slate-700">
                  Nombre de la pantalla
                </div>
                <input
                  className={inputCls}
                  value={form.nombre}
                  onChange={(e) => up({ nombre: e.target.value })}
                />
              </div>
              <div>
                <div className="mb-[5px] text-xs font-semibold text-slate-700">Tipo</div>
                <div className="flex flex-wrap gap-2">
                  {tipos.map((t) => (
                    <button
                      key={t}
                      onClick={() => up({ tipo: t })}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:border-kory ${
                        form.tipo === t
                          ? "border-kory bg-kory-pale text-kory"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-[5px] text-xs font-semibold text-slate-700">Tamaño</div>
                  <input
                    className={`${inputCls} font-mono`}
                    value={form.dim}
                    onChange={(e) => up({ dim: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mb-[5px] text-xs font-semibold text-slate-700">
                    Resolución · px
                  </div>
                  <input
                    className={`${inputCls} font-mono`}
                    value={form.res}
                    onChange={(e) => up({ res: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-[5px] text-xs font-semibold text-slate-700">Ciudad</div>
                <div className="flex gap-2">
                  {(["Bogotá", "Medellín"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => up({ ciudad: c })}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:border-kory ${
                        form.ciudad === c
                          ? "border-kory bg-kory-pale text-kory"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-[5px] text-xs font-semibold text-slate-700">
                  Dirección / punto de referencia
                </div>
                <input
                  className={inputCls}
                  value={form.direccion}
                  onChange={(e) => up({ direccion: e.target.value })}
                />
              </div>
              <div className="flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400">
                Pin en mapa · llega con la integración de mapas
              </div>
            </div>
          )}

          {paso === 3 && (
            <div>
              <p className="mt-0 mb-3 text-[13px] text-slate-600">
                Sube mínimo 4 fotos de la pantalla y su entorno.{" "}
                <b className="text-kory">Las vallas con fotos reales reciben 3× más solicitudes.</b>
              </p>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                {fotoLabels.map((label, i) => {
                  const cargada = i < form.fotos;
                  return (
                    <button
                      key={label}
                      onClick={() => up({ fotos: Math.max(form.fotos, i + 1) })}
                      className={`flex h-[86px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors ${
                        cargada
                          ? "bg-[linear-gradient(135deg,#2D1B69,#9B7BF7)] text-white/80"
                          : "border-[1.5px] border-dashed border-lavender-dash bg-kory-pale text-slate-500 hover:border-kory"
                      }`}
                    >
                      {cargada ? "✓" : "+"} {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 font-mono text-[11.5px] text-slate-500">
                {form.fotos} de 4 mínimas
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-[5px] text-xs font-semibold text-slate-700">
                  Tarifa por día · COP
                </div>
                <input
                  className={`${inputCls} font-mono`}
                  inputMode="numeric"
                  value={form.precio}
                  onChange={(e) => up({ precio: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                />
                <div className="mt-1.5 text-[11.5px] text-slate-500">
                  Pantallas similares en {form.ciudad} cobran entre{" "}
                  <b className="font-mono">$1.500.000</b> y <b className="font-mono">$2.400.000</b>
                </div>
              </div>
              <div className="rounded-[10px] border border-lavender-tint bg-kory-pale px-3.5 py-3 text-[12.5px] leading-normal text-slate-700">
                Con {form.fotos} fotos y ocupación promedio del 70%, ganarías{" "}
                <b className="font-mono">≈ {fmt(form.precio * 21 * 0.92)}</b>/mes netos (tras 8% de
                servicio Kory).
              </div>
              <div className="flex flex-col gap-1.5 text-[13px] text-slate-700">
                <div className="flex justify-between">
                  <span>Pantalla</span>
                  <span className="font-semibold">{form.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ubicación</span>
                  <span className="font-semibold">
                    {form.ciudad} · {form.direccion.split(",")[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Specs</span>
                  <span className="font-mono font-semibold">
                    {form.dim} · {form.res} px
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-2.5 border-t border-slate-100 pt-4">
            <button
              onClick={() => setPaso((p) => Math.max(1, p - 1))}
              disabled={paso === 1}
              className="h-10 cursor-pointer rounded-[10px] px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 disabled:invisible"
            >
              Atrás
            </button>
            {paso < 4 ? (
              <button
                onClick={() => puedeContinuar && setPaso((p) => p + 1)}
                style={{ opacity: puedeContinuar ? 1 : 0.5 }}
                className="h-10 cursor-pointer rounded-[10px] bg-kory px-5 text-[13px] font-bold text-white hover:bg-kory-hover"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={publicar}
                className="h-10 cursor-pointer rounded-[10px] bg-kory px-5 text-[13px] font-bold text-white hover:bg-kory-hover"
              >
                Publicar pantalla
              </button>
            )}
          </div>
          {paso === 3 && form.fotos < 4 && (
            <div className="mt-2 text-right text-[11.5px] font-semibold text-[#EA580C]">
              Carga al menos 4 fotos para continuar
            </div>
          )}
        </div>

        {/* Preview viva */}
        <div>
          <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase">
            Así se verá tu pantalla
          </div>
          <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-card">
            <div className="relative flex h-[110px] items-center justify-center bg-[linear-gradient(135deg,#1A0A3E,#9B7BF7)]">
              <span className="absolute top-2 left-2 rounded-full bg-[rgba(13,13,13,0.55)] px-2 py-0.5 text-[9.5px] font-semibold text-white">
                {form.tipo}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                Tu anuncio aquí
              </span>
              <span className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[9.5px] font-bold text-ink">
                {form.dim}
              </span>
            </div>
            <div className="flex flex-col gap-1 px-3.5 py-3">
              <span className="text-[13px] font-bold text-ink">{form.nombre || "—"}</span>
              <span className="text-[11.5px] text-slate-500">
                {form.ciudad} · {form.direccion.split(",")[0] || "—"}
              </span>
              <span className="mt-0.5 text-[13px]">
                <b className="font-mono font-bold">{fmt(form.precio)}</b>{" "}
                <span className="text-[10.5px] text-slate-500">COP /día</span>
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[11.5px] leading-normal text-slate-500">
            Al publicar, tu pantalla aparece de inmediato en Explorar y el Mapa de la demo.
          </div>
        </div>
      </div>
    </div>
  );
}
