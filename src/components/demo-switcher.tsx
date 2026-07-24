"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/app-context";

// Navegador de pantallas para la demo. Colapsado por defecto para no tapar
// contenido; oculto en móvil (ahí navega la bottom-nav). Quitar en producción.
export function DemoSwitcher() {
  const pathname = usePathname();
  const { vallaId } = useApp();
  const [abierto, setAbierto] = useState(false);

  const items = [
    { href: "/", label: "Inicio" },
    { href: "/mapa", label: "Mapa" },
    { href: `/valla/${vallaId}`, label: "Detalle", match: "/valla" },
    { href: "/combo/norte-bogota", label: "Combo", match: "/combo" },
    { href: "/checkout", label: "Checkout" },
    { href: "/confirmacion", label: "Confirmación" },
    { href: "/mis-campanas", label: "Mis campañas" },
    { href: "/mi-campana", label: "En vivo" },
    { href: "/guardados", label: "Guardados" },
    { href: "/cuanto-cuesta", label: "Precios" },
    { href: "/para-redes", label: "Para redes" },
    { href: "/panel", label: "Panel dueño" },
    { href: "/publicar", label: "Publicar" },
    { href: "/panel/widget", label: "Widget" },
  ];

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        aria-label="Abrir navegador de demo"
        className="fixed bottom-[18px] left-1/2 z-[100] hidden -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-[rgba(13,13,13,0.9)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#A6FF4D]" />
        Demo
      </button>
    );
  }

  return (
    <div className="fixed bottom-[18px] left-1/2 z-[100] hidden max-w-[92vw] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-full bg-[rgba(13,13,13,0.9)] p-[5px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:flex">
      {items.map((n) => {
        const active = n.match ? pathname.startsWith(n.match) : pathname === n.href;
        return (
          <Link
            key={n.label}
            href={n.href}
            className={`rounded-full px-[11px] py-[7px] text-xs font-semibold whitespace-nowrap ${
              active ? "bg-kory text-white" : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
      <span className="mx-1 h-4 w-px bg-white/20" />
      <span className="pl-1 font-mono text-[9px] font-bold tracking-[0.1em] text-[#6B7280] uppercase">
        Kit
      </span>
      <Link
        href="/correos"
        className={`rounded-full px-[11px] py-[7px] text-xs font-semibold whitespace-nowrap ${
          pathname === "/correos" ? "bg-kory text-white" : "text-[#9CA3AF] hover:text-white"
        }`}
      >
        Correos
      </Link>
      <button
        onClick={() => setAbierto(false)}
        aria-label="Colapsar navegador de demo"
        className="ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-xs text-[#9CA3AF] hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
