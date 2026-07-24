"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { categorias, combos, getValla } from "@/data";
import { fmt } from "@/lib/format";
import { getQuote } from "@/lib/pricing";
import { useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import { SearchBar } from "@/components/search-bar";
import { VallaCard } from "@/components/valla-card";
import { Footer } from "@/components/footer";

export default function InicioPage() {
  const router = useRouter();
  const app = useApp();
  const vallas = useVallasFiltradas();
  const [dropdown, setDropdown] = useState<"ciudad" | "fechas" | "presu" | null>(null);

  const tituloGrid =
    (app.ciudad === "Todas" ? "Pantallas en Colombia" : `Pantallas en ${app.ciudad}`) +
    (app.cat !== "Todas" ? ` · ${app.cat}` : "");

  return (
    <>
      <div
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("[data-searchbar]")) setDropdown(null);
        }}
      >
        {/* Hero */}
        <section className="bg-[linear-gradient(180deg,#1A0A3E_0%,#2D1B69_55%,#724CF5_100%)] px-6 pt-16 pb-24 text-center">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-[0.08em] text-lavender-200 uppercase">
              ✨ 340+ pantallas digitales en Colombia
            </span>
            <h1 className="m-0 text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] text-white md:text-[52px]">
              Renta vallas digitales
              <br />
              en minutos, no en semanas
            </h1>
            <p className="m-0 max-w-[540px] text-[17px] leading-[1.7] text-lavender-100">
              Busca, compara y reserva pantallas LED por campaña. Tu anuncio al aire en 24 horas,
              sin intermediarios.
            </p>
          </div>
          <SearchBar dropdown={dropdown} setDropdown={setDropdown} />
          <div className="mt-[18px] flex flex-wrap justify-center gap-5 text-[12.5px] text-lavender-200">
            <span>✓ Sin permanencias</span>
            <span>✓ Reporte de impresiones en vivo</span>
            <span>✓ Pago protegido</span>
          </div>
          <p className="mt-5 mb-0 text-[13px] text-lavender-200">
            ¿Campaña grande o sin tiempo?{" "}
            <button
              onClick={() => app.openModal("brief")}
              className="cursor-pointer font-bold text-white underline decoration-lavender-200/60 underline-offset-2 hover:decoration-white"
            >
              Te la armamos gratis →
            </button>
          </p>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-6 pt-10 pb-20">
          {/* Categorías */}
          <div className="mb-7 flex flex-wrap gap-2">
            {categorias.map((c) => {
              const activa = c === app.cat;
              return (
                <button
                  key={c}
                  onClick={() => app.set({ cat: c })}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:border-lavender-strong ${
                    activa
                      ? "border-ink bg-ink text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {c}
                </button>
              );
            })}
            <button
              onClick={() => app.set({ soloVision: !app.soloVision })}
              aria-pressed={app.soloVision}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                app.soloVision
                  ? "border-[#16A34A] bg-[#ECFDF5] text-[#16A34A]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
              }`}
            >
              ● Solo medición Kory Vision
            </button>
          </div>

          {/* Sugerencia Kory IA — ahora lleva a un combo reservable (W13) */}
          <div className="mb-7 flex flex-wrap items-center gap-3 rounded-xl border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-[18px] py-3.5">
            <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[11px] font-bold text-kory">
              ✨ Kory IA
            </span>
            <span className="text-[13.5px] leading-normal text-slate-700">
              Con un presupuesto de <b className="font-mono">$50M</b>, el combo{" "}
              <b>Domina el norte de Bogotá</b> te da 3 pantallas y ≈ 6,1M de impresiones en 14
              días.
            </span>
            <button
              onClick={() => router.push("/combo/norte-bogota")}
              className="ml-auto shrink-0 cursor-pointer rounded-lg bg-kory px-3.5 py-[7px] text-xs font-semibold text-white hover:bg-kory-hover"
            >
              Ver el combo
            </button>
          </div>

          {/* Paquetes por objetivo (W13) */}
          <div className="mb-8">
            <div className="mb-3.5 flex items-baseline justify-between">
              <h2 className="m-0 text-xl font-extrabold tracking-[-0.015em]">
                Paquetes por objetivo
              </h2>
              <span className="text-[12px] text-slate-400">
                Un creativo · un checkout · varias pantallas
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {combos.map((c) => {
                const pantallasCombo = c.vallaIds
                  .map(getValla)
                  .filter((v): v is NonNullable<typeof v> => !!v);
                const suma = pantallasCombo.reduce(
                  (a, v) => a + getQuote(v, app.dias, app.spots, app.inicioDia).total,
                  0,
                );
                const total = Math.round(suma * (1 - c.ahorro));
                const imp = pantallasCombo.reduce(
                  (a, v) => a + getQuote(v, app.dias, app.spots, app.inicioDia).impTotales,
                  0,
                );
                return (
                  <Link
                    key={c.id}
                    href={`/combo/${c.id}`}
                    className="flex flex-col gap-1.5 rounded-[14px] border border-slate-200 bg-white p-[18px] shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <div className="text-[14.5px] font-bold text-ink">{c.nombre}</div>
                    <div className="text-[12px] text-slate-500">
                      {pantallasCombo.length} pantallas · ≈{" "}
                      {(imp / 1e6).toFixed(1).replace(".", ",")}M imp · {app.dias} días
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-mono text-[12px] text-slate-400 line-through">
                        {fmt(suma)}
                      </span>
                      <b className="font-mono text-[15.5px] text-ink">{fmt(total)}</b>
                    </div>
                    <span className="mt-1 w-fit rounded-full bg-kory-tint px-2.5 py-[3px] text-[10.5px] font-bold text-kory">
                      Ahorra {Math.round(c.ahorro * 100)}% vs por separado
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="m-0 text-2xl font-extrabold tracking-[-0.015em]">{tituloGrid}</h2>
            <Link href="/mapa" className="text-[13px] font-semibold text-kory">
              Ver en mapa →
            </Link>
          </div>

          {vallas.length === 0 && (
            <div className="flex flex-col items-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-lavender-border bg-[#FBFAFD] p-11 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lavender-border bg-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-[18px] w-[18px]" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <div className="text-[15px] font-bold">Ninguna pantalla cabe en ese presupuesto</div>
              <p className="m-0 text-[13px] text-slate-500">
                Prueba con más presupuesto, menos días de campaña o todas las ciudades.
              </p>
              <button
                onClick={app.resetFiltros}
                className="mt-1 h-9 cursor-pointer rounded-[10px] bg-kory-tint px-4 text-[13px] font-semibold text-kory hover:bg-lavender-tint"
              >
                Restablecer filtros
              </button>
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-6">
            {vallas.map((v) => (
              <VallaCard key={v.id} valla={v} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
