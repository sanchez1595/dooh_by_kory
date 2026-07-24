"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { misVallas } from "@/data";
import { useRol } from "@/hooks/use-vallas";
import { fmt } from "@/lib/format";

// W15 · Kory Embed: el dueño vende sus pantallas desde SU sitio web con el
// checkout y la protección de Kory. Preview en vivo (misma mecánica que el
// wizard Publicar) + snippet copiable. Pionero en la categoría.

const colores = [
  { id: "#724CF5", nombre: "Violeta Kory" },
  { id: "#0E7C66", nombre: "Verde" },
  { id: "#B4530A", nombre: "Naranja" },
  { id: "#0D0D0D", nombre: "Negro" },
];

const diasMini = [
  { d: 12, estado: "busy" },
  { d: 13, estado: "busy" },
  { d: 14, estado: "sel" },
  { d: 15, estado: "sel" },
  { d: 16, estado: "sel" },
  { d: 17, estado: "libre" },
  { d: 18, estado: "libre" },
];

export default function WidgetPage() {
  useRol("dueno");
  const app = useApp();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set([misVallas[0].id]));
  const [color, setColor] = useState(colores[0].id);
  const [redondeado, setRedondeado] = useState(true);

  const elegidas = misVallas.filter((m) => seleccion.has(m.id));
  const principal = elegidas[0] ?? misVallas[0];
  const radio = redondeado ? 14 : 4;

  const snippet = `<script src="https://dooh.kory.co/embed.js"
  data-pantallas="${[...seleccion].join(",")}"
  data-color="${color}"
  data-radio="${redondeado ? "redondeado" : "recto"}"></script>`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      app.showToast("Código copiado — pégalo antes de </body> en tu sitio");
    } catch {
      app.showToast("No se pudo copiar automáticamente — selecciona el código y cópialo");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 pt-8 pb-24">
      <div className="mb-3 text-[13px] text-slate-500">
        <Link href="/panel" className="font-semibold text-kory">
          ← Panel
        </Link>
      </div>
      <div className="mb-1 flex flex-wrap items-center gap-2.5">
        <h1 className="m-0 text-[24px] font-extrabold tracking-[-0.02em]">Widget para tu sitio</h1>
        <span className="rounded-full bg-kory-tint px-2.5 py-1 text-[11px] font-bold text-kory">
          Kory Embed
        </span>
      </div>
      <p className="mt-0 mb-7 max-w-[620px] text-[13.5px] leading-[1.65] text-slate-500">
        Pega un script en tu página y tus clientes reservan tus pantallas sin salir de tu sitio.
        <b className="text-slate-700"> Tu cliente, tu venta:</b> el pago protegido, la aprobación de
        creativos y el proof-of-play los pone Kory. Misma comisión del 8%.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        {/* Configuración */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            <div className="mb-2.5 text-[13px] font-bold">Pantallas incluidas</div>
            <div className="flex flex-col gap-2">
              {misVallas.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={seleccion.has(m.id)}
                    onChange={(e) => {
                      const next = new Set(seleccion);
                      if (e.target.checked) next.add(m.id);
                      else if (next.size > 1) next.delete(m.id);
                      setSeleccion(next);
                    }}
                    className="h-4 w-4 accent-kory"
                  />
                  {m.nombre}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            <div className="mb-2.5 text-[13px] font-bold">Color de acento</div>
            <div className="flex gap-2.5">
              {colores.map((c) => (
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
            <div className="mt-4 mb-2.5 text-[13px] font-bold">Esquinas</div>
            <div className="flex gap-2">
              {[
                { v: true, label: "Redondeadas" },
                { v: false, label: "Rectas" },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => setRedondeado(o.v)}
                  className={`cursor-pointer rounded-[9px] border px-3.5 py-2 text-[12.5px] font-semibold ${
                    redondeado === o.v
                      ? "border-kory bg-kory-pale text-kory"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-slate-200 bg-[#0D0D0D] p-4">
            <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-[1.6] whitespace-pre text-[#C8F5D9]">
              {snippet}
            </pre>
          </div>
          <button
            onClick={copiar}
            className="h-11 cursor-pointer rounded-[11px] bg-kory text-[13.5px] font-bold text-white hover:bg-kory-hover"
          >
            Copiar código
          </button>
        </div>

        {/* Vista previa en vivo: el sitio del dueño con el widget adentro */}
        <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FCA5A5]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FCD34D]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#86EFAC]" />
            </span>
            <span className="ml-2 rounded-md bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
              mediosnorte.co/pantallas
            </span>
            <span className="ml-auto text-[10.5px] font-semibold text-slate-400">
              Vista previa en vivo
            </span>
          </div>

          <div className="p-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5">
              <span className="text-[15px] font-extrabold tracking-tight text-slate-800">
                MEDIOS NORTE
              </span>
              <span className="flex gap-4 text-[11.5px] text-slate-400">
                <span>Nosotros</span>
                <b className="text-slate-700">Pantallas</b>
                <span>Contacto</span>
              </span>
            </div>

            {/* El widget */}
            <div
              style={{ borderRadius: radio + 2 }}
              className="mx-auto max-w-[400px] border-2 border-slate-200 p-[18px]"
            >
              <div className="flex gap-3">
                <div
                  style={{ background: principal.grad, borderRadius: radio - 4 }}
                  className="h-[52px] w-[76px] shrink-0"
                />
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-bold">{principal.nombre}</div>
                  <div className="text-[12px] text-slate-500">
                    Desde <b className="font-mono text-ink">{fmt(principal.tarifaBase)}</b> /día
                  </div>
                  {elegidas.length > 1 && (
                    <div className="text-[10.5px] font-semibold" style={{ color }}>
                      +{elegidas.length - 1} pantalla{elegidas.length > 2 ? "s" : ""} más
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {diasMini.map((d) => (
                  <span
                    key={d.d}
                    style={{
                      background: d.estado === "sel" ? color : d.estado === "busy" ? "#F1F5F9" : "#FAFAFA",
                      color: d.estado === "sel" ? "#fff" : d.estado === "busy" ? "#CBD5E1" : "#64748B",
                      textDecoration: d.estado === "busy" ? "line-through" : "none",
                      borderRadius: Math.max(3, radio - 8),
                    }}
                    className="py-1 text-center font-mono text-[10.5px] font-semibold"
                  >
                    {d.d}
                  </span>
                ))}
              </div>
              <button
                onClick={() =>
                  app.showToast("Así se abre el checkout protegido de Kory sobre el sitio del dueño")
                }
                style={{ background: color, borderRadius: radio - 4 }}
                className="mt-3 h-11 w-full cursor-pointer text-[13.5px] font-bold text-white"
              >
                Ver fechas y reservar
              </button>
              <p className="mt-2.5 mb-0 text-center text-[10.5px] leading-[1.5] text-slate-400">
                Reserva protegida — pago en custodia y reembolso 100%
                <br />
                <b style={{ color }}>⚡ Powered by Kory</b>
              </p>
            </div>

            <p className="mt-5 mb-0 text-center text-[11px] text-slate-400">
              El resto de la página es de tu sitio; el widget vive donde tú lo pegues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
