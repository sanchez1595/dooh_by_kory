"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { campanas } from "@/data";

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-kory px-1 font-mono text-[9.5px] font-bold text-white">
      {n}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const app = useApp();
  const esDueno = app.rol === "dueno";

  const activas = campanas.filter((c) => {
    const estado = app.campanaEstados[c.id] ?? c.estado;
    return estado === "al-aire" || estado === "en-revision";
  }).length;

  const links = esDueno
    ? [
        { href: "/panel", label: "Panel", badge: 0 },
        { href: "/publicar", label: "Publicar valla", badge: 0 },
        { href: "/panel/ingresos", label: "Ingresos", badge: 0 },
      ]
    : [
        { href: "/", label: "Explorar", badge: 0 },
        { href: "/mapa", label: "Mapa", badge: 0 },
        { href: "/guardados", label: "Guardados", badge: app.favCount },
        { href: "/mis-campanas", label: "Mis campañas", badge: activas },
      ];

  const cambiarRol = () => {
    if (esDueno) {
      app.set({ rol: "anunciante" });
      router.push("/");
    } else {
      app.set({ rol: "dueno" });
      router.push("/panel");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 backdrop-blur-md ${
        esDueno ? "bg-kory-pale/95" : "bg-white/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-6">
        <Link
          href={esDueno ? "/panel" : "/"}
          className="flex cursor-pointer items-center gap-2.5"
          aria-label="DOOH by Kory — inicio"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/kory-mark.svg" alt="" className="h-[27px] w-[26px]" />
          <span className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-[-0.02em] text-ink">DOOH</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-kory">
              by Kory
            </span>
          </span>
        </Link>
        <nav className="hidden flex-1 gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-[13.5px] font-semibold hover:bg-slate-100 ${
                pathname === l.href ? "text-kory" : "text-slate-700"
              }`}
            >
              {l.label}
              <Badge n={l.badge} />
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <button
            onClick={cambiarRol}
            className="cursor-pointer rounded-full border border-kory px-3.5 py-1.5 text-xs font-bold text-kory transition-colors hover:bg-kory-tint"
          >
            ⇄ {esDueno ? "Modo anunciante" : "Modo dueño"}
          </button>
          <Link
            href="/entrar"
            aria-label="Cambiar de rol o entrar"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[linear-gradient(140deg,#9B7BF7,#724CF5)] text-xs font-bold text-white hover:text-white"
          >
            AR
          </Link>
        </div>
      </div>
    </header>
  );
}
