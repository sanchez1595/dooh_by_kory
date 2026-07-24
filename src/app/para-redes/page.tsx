"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { misVallas, soporteToast } from "@/data";
import { fmt } from "@/lib/format";
import { Footer } from "@/components/footer";

// W16 · Kory para redes de pantallas: escalera gratis → PRO → white-label
// (la jugada "sales cloud" de AdQuick, empaquetada). Tres cards idénticas en
// estructura; solo la recomendada rompe con borde violeta (Von Restorff).

const coloresMarca = [
  { id: "#0E7C66", nombre: "Verde" },
  { id: "#B4530A", nombre: "Naranja" },
  { id: "#1D4ED8", nombre: "Azul" },
  { id: "#0D0D0D", nombre: "Negro" },
];

export default function ParaRedesPage() {
  const app = useApp();
  const [marca, setMarca] = useState("Medios Norte");
  const [color, setColor] = useState(coloresMarca[0].id);

  const dominio = `vallas.${marca.toLowerCase().replace(/[^a-z0-9]+/g, "") || "tured"}.co`;

  return (
    <>
      <div className="mx-auto w-full max-w-[1080px] px-6 pt-12 pb-24">
        <span className="mb-3 inline-block rounded-full bg-kory-tint px-3 py-1 text-[11px] font-bold tracking-[0.06em] text-kory uppercase">
          Para redes y dueños de pantallas
        </span>
        <h1 className="m-0 mb-2 max-w-[640px] text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[36px]">
          Tu red de pantallas, con la tecnología de Kory
        </h1>
        <p className="mt-0 mb-9 max-w-[560px] text-[14.5px] leading-[1.7] text-slate-600">
          Empieza gratis en el marketplace, profesionaliza tu venta con PRO, o lanza tu propia
          plataforma con tu marca y tu dominio. Cada nivel usa lo mismo que ya funciona: Kory
          Player, pagos protegidos y certificados de emisión.
        </p>

        {/* Tiers */}
        <div className="mb-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Marketplace */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-[14px] font-bold">Marketplace</div>
            <div className="mt-1 text-[24px] font-extrabold">Gratis</div>
            <ul className="mt-3 flex flex-col gap-2 pl-0 text-[13px] leading-[1.5] text-slate-600 [&>li]:list-none">
              <li>✓ Publica tus pantallas y recibe demanda Kory</li>
              <li>✓ Kory Player + proof-of-play</li>
              <li>✓ Payouts automáticos</li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-400">
              Comisión 8% por venta
            </div>
            <Link
              href="/entrar"
              className="mt-4 flex h-11 items-center justify-center rounded-[11px] border border-slate-200 bg-white text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Empezar gratis
            </Link>
          </div>

          {/* PRO — recomendado */}
          <div className="relative flex flex-col rounded-2xl border-2 border-kory bg-white p-6 shadow-booking">
            <span className="absolute -top-3 left-6 rounded-full bg-kory px-2.5 py-[3px] text-[10.5px] font-bold text-white">
              Recomendado
            </span>
            <div className="text-[14px] font-bold">PRO</div>
            <div className="mt-1 text-[24px] font-extrabold">
              $390.000 <span className="text-[13px] font-semibold text-slate-400">/mes</span>
            </div>
            <ul className="mt-3 flex flex-col gap-2 pl-0 text-[13px] leading-[1.5] text-slate-600 [&>li]:list-none">
              <li>✓ Todo lo del Marketplace</li>
              <li>✓ Widget en tu sitio sin marca Kory</li>
              <li>✓ Reportes certificados ilimitados</li>
              <li>✓ Prioridad en resultados de búsqueda</li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-400">
              Comisión reducida 5%
            </div>
            <button
              onClick={() => app.showToast("Prueba PRO activada 30 días — sin tarjeta, se apaga sola")}
              className="mt-4 h-11 cursor-pointer rounded-[11px] bg-kory text-[13.5px] font-bold text-white hover:bg-kory-hover"
            >
              Probar 30 días
            </button>
          </div>

          {/* White-label */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-[14px] font-bold">White-label</div>
            <div className="mt-1 text-[24px] font-extrabold">Hablemos</div>
            <ul className="mt-3 flex flex-col gap-2 pl-0 text-[13px] leading-[1.5] text-slate-600 [&>li]:list-none">
              <li>✓ Tu marca, tu dominio, tu checkout</li>
              <li>✓ Catálogo privado y tarifas propias</li>
              <li>✓ Soporte dedicado</li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[12px] text-slate-400">
              Licencia + % por transacción
            </div>
            <button
              onClick={() => app.showToast(soporteToast)}
              className="mt-4 h-11 cursor-pointer rounded-[11px] border border-slate-200 bg-white text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hablar con ventas
            </button>
          </div>
        </div>

        {/* Configurador white-label: verse dueño vende más que las features */}
        <h2 className="m-0 mb-1.5 text-xl font-extrabold tracking-[-0.015em]">
          Así se vería tu plataforma
        </h2>
        <p className="mt-0 mb-6 max-w-[560px] text-[13.5px] text-slate-500">
          Escribe el nombre de tu red y elige tu color — la vista previa es en vivo.
        </p>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-[14px] border border-slate-200 bg-white p-5">
              <label className="block text-xs font-semibold text-slate-700">
                Nombre de tu red
                <input
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  maxLength={24}
                  className="mt-1.5 w-full rounded-[10px] border border-slate-200 bg-white px-[13px] py-2.5 text-[13.5px] text-ink outline-none focus:border-kory"
                />
              </label>
              <div className="mt-4 mb-2 text-xs font-semibold text-slate-700">Color primario</div>
              <div className="flex gap-2.5">
                {coloresMarca.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    aria-label={c.nombre}
                    title={c.nombre}
                    style={{ background: c.id }}
                    className={`h-8 w-8 cursor-pointer rounded-full ${
                      color === c.id ? "ring-2 ring-ink ring-offset-2" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="mt-4 text-xs font-semibold text-slate-700">Dominio</div>
              <div className="mt-1.5 flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-[13px] py-2.5">
                <span className="truncate font-mono text-[12.5px] text-slate-700">{dominio}</span>
                <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2 py-[2px] text-[10px] font-bold text-[#16A34A]">
                  ● Conectado
                </span>
              </div>
            </div>
            <div className="rounded-[10px] border border-lavender-tint bg-kory-pale px-4 py-3 text-[12.5px] leading-[1.6] text-slate-700">
              Detrás de tu marca corre todo el stack Kory: player, custodia de pagos, certificados
              y soporte. Tú pones la relación con tus clientes.
            </div>
          </div>

          {/* Preview de la plataforma del operador */}
          <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FCA5A5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FCD34D]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#86EFAC]" />
              </span>
              <span className="ml-2 rounded-md bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
                {dominio}
              </span>
            </div>
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5">
                <span className="text-[15px] font-extrabold tracking-tight uppercase" style={{ color }}>
                  {marca || "Tu red"}
                </span>
                <span className="flex gap-4 text-[11.5px] text-slate-400">
                  <b className="text-slate-700">Explorar</b>
                  <span>Mapa</span>
                  <span>Mis campañas</span>
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {misVallas.slice(0, 2).map((m) => (
                  <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200">
                    <div style={{ background: m.grad }} className="h-[88px]" />
                    <div className="p-3">
                      <div className="truncate text-[13px] font-bold">{m.nombre}</div>
                      <div className="mt-0.5 text-[11.5px] text-slate-500">{m.ciudad}</div>
                      <div className="mt-1.5 text-[13px]">
                        <b className="font-mono">{fmt(m.tarifaBase)}</b>{" "}
                        <span className="text-[11px] text-slate-400">COP /día</span>
                      </div>
                      <button
                        style={{ background: color }}
                        className="mt-2.5 h-9 w-full cursor-default rounded-[9px] text-[12px] font-bold text-white"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 mb-0 text-center text-[10.5px] text-slate-400">
                Checkout, custodia y certificados con la infraestructura de Kory
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
