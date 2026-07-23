"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { categorias } from "@/data";
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
          </div>

          {/* Sugerencia Kory IA */}
          <div className="mb-7 flex flex-wrap items-center gap-3 rounded-xl border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-[18px] py-3.5">
            <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[11px] font-bold text-kory">
              ✨ Kory IA
            </span>
            <span className="text-[13.5px] leading-normal text-slate-700">
              Con un presupuesto de <b className="font-mono">$50M</b>, combina{" "}
              <b>Autopista Norte</b> + <b>Zona T</b> para ≈ 6,1M de impresiones en 14 días.
            </span>
            <button
              onClick={() => {
                app.set({ vallaId: 1 });
                router.push("/valla/1");
              }}
              className="ml-auto shrink-0 cursor-pointer rounded-lg bg-kory px-3.5 py-[7px] text-xs font-semibold text-white hover:bg-kory-hover"
            >
              Ver Autopista Norte
            </button>
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
