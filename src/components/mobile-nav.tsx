"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

const iconos = {
  explorar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  guardados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  campanas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  perfil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  panel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  publicar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2.4}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  ),
  cambiar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={2}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
};

function Tab({
  activo,
  label,
  icon,
  onClick,
  href,
}: {
  activo?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls = `flex min-w-16 cursor-pointer flex-col items-center gap-0.5 py-1 text-[9px] font-bold ${
    activo ? "text-kory" : "text-slate-400"
  }`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {icon}
      {label}
    </button>
  );
}

// Navegación inferior para móvil (el diseño original la define para iOS).
export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const app = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[90] flex justify-around border-t border-slate-200 bg-white/95 pt-1.5 pb-2 backdrop-blur-md md:hidden">
      {app.rol === "anunciante" ? (
        <>
          <Tab href="/" label="Explorar" icon={iconos.explorar} activo={pathname === "/" || pathname === "/mapa"} />
          <Tab href="/guardados" label="Guardados" icon={iconos.guardados} activo={pathname === "/guardados"} />
          <Tab
            href="/mis-campanas"
            label="Campañas"
            icon={iconos.campanas}
            activo={pathname.startsWith("/mis-campana") || pathname === "/mi-campana"}
          />
          <Tab
            label="Perfil"
            icon={iconos.perfil}
            onClick={() => app.showToast("Perfil llega con el inicio de sesión — próximamente ✨")}
          />
        </>
      ) : (
        <>
          <Tab href="/panel" label="Panel" icon={iconos.panel} activo={pathname === "/panel"} />
          <Tab href="/publicar" label="Publicar" icon={iconos.publicar} activo={pathname === "/publicar"} />
          <Tab
            label="Anunciante"
            icon={iconos.cambiar}
            onClick={() => {
              app.set({ rol: "anunciante" });
              router.push("/");
            }}
          />
        </>
      )}
    </nav>
  );
}
