"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { Rol } from "@/context/app-context";

// Login de demo: un paso, dos caminos, cero campos.
// Con Firebase Auth este selector alimenta el claim de rol del usuario.
export default function EntrarPage() {
  const router = useRouter();
  const app = useApp();
  const [rol, setRol] = useState<Rol>("anunciante");

  const entrar = () => {
    app.set({ rol });
    router.push(rol === "dueno" ? "/panel" : "/");
  };

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-6 py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/kory-mark.svg" alt="" className="mx-auto mb-3 h-8 w-8" />
        <h1 className="m-0 text-xl font-extrabold tracking-[-0.015em]">
          ¿Qué quieres hacer hoy?
        </h1>
        <p className="mt-1 mb-5 text-[13px] text-slate-500">
          Puedes cambiar de modo cuando quieras desde el navbar
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            onClick={() => setRol("anunciante")}
            className={`cursor-pointer rounded-xl border-[1.5px] p-4 text-left transition-colors ${
              rol === "anunciante"
                ? "border-kory bg-kory-pale"
                : "border-slate-200 bg-white hover:border-lavender-strong"
            }`}
          >
            <div className={`text-sm font-bold ${rol === "anunciante" ? "text-kory" : "text-ink"}`}>
              Quiero anunciar
            </div>
            <div className="mt-0.5 text-[11.5px] text-slate-500">
              Busca y reserva pantallas por campaña
            </div>
          </button>
          <button
            onClick={() => setRol("dueno")}
            className={`cursor-pointer rounded-xl border-[1.5px] p-4 text-left transition-colors ${
              rol === "dueno"
                ? "border-kory bg-kory-pale"
                : "border-slate-200 bg-white hover:border-lavender-strong"
            }`}
          >
            <div className={`text-sm font-bold ${rol === "dueno" ? "text-kory" : "text-ink"}`}>
              Tengo pantallas
            </div>
            <div className="mt-0.5 text-[11.5px] text-slate-500">
              Publica y gana con tus vallas
            </div>
          </button>
        </div>
        <button
          onClick={entrar}
          className="mt-5 h-11 w-full cursor-pointer rounded-[11px] bg-kory text-[13.5px] font-bold text-white transition-colors hover:bg-kory-hover"
        >
          Entrar a la demo
        </button>
        <p className="mt-3 mb-0 text-[11px] text-slate-400">
          Demo sin registro · el inicio de sesión real llega con Firebase
        </p>
      </div>
    </div>
  );
}
