"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { useRol, useTodasLasVallas } from "@/hooks/use-vallas";
import { VallaCard } from "@/components/valla-card";
import { Footer } from "@/components/footer";

export default function GuardadosPage() {
  useRol("anunciante");
  const app = useApp();
  const todas = useTodasLasVallas();
  const guardadas = todas.filter((v) => app.fav[v.id]);

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] flex-1 px-6 pt-8 pb-20">
        <div className="mb-6 flex items-baseline gap-3">
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">Guardados</h1>
          {guardadas.length > 0 && (
            <span className="text-[13.5px] text-slate-500">
              {guardadas.length} pantalla{guardadas.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {guardadas.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-lavender-border bg-[#FBFAFD] p-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender-border bg-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-5 w-5" strokeWidth={2}>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <div className="text-[15px] font-bold">Aún no guardas pantallas</div>
            <p className="m-0 max-w-[32ch] text-[13px] text-slate-500">
              Toca el corazón en cualquier pantalla y aparecerá aquí para que compares con calma.
            </p>
            <Link
              href="/"
              className="mt-1 flex h-10 items-center rounded-[10px] bg-kory px-[18px] text-[13px] font-bold text-white hover:bg-kory-hover hover:text-white"
            >
              Explorar pantallas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-6">
            {guardadas.map((v) => (
              <VallaCard key={v.id} valla={v} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
