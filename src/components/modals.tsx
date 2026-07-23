"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { getFotosTiles, resenas, resenasExtra } from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { useSolicitudes } from "@/hooks/use-solicitudes";

function ModalShell({
  children,
  maxWidth,
  onClose,
}: {
  children: React.ReactNode;
  maxWidth: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
        className="max-h-[85vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-modal"
      >
        {children}
      </div>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm text-slate-600 hover:bg-slate-100"
    >
      ✕
    </button>
  );
}

export function Modals() {
  const app = useApp();
  const router = useRouter();
  const { lista } = useSolicitudes();

  const sel = useValla(app.vallaId);

  if (app.modal === "fotos") {
    return (
      <ModalShell maxWidth="840px" onClose={app.closeModal}>
        <div className="mb-[18px] flex items-center justify-between">
          <h3 className="m-0 text-lg font-extrabold">Fotos · {sel.nombre}</h3>
          <CloseButton onClose={app.closeModal} />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {getFotosTiles(sel).map((ft) => (
            <div
              key={ft.label}
              style={{ background: ft.bg }}
              className="flex h-[150px] items-end rounded-xl p-2.5"
            >
              <span className="rounded-full bg-[rgba(13,13,13,0.55)] px-[9px] py-[3px] text-[10px] font-semibold text-white">
                {ft.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3.5 mb-0 text-xs text-slate-400">
          Fotos de referencia del dueño · verificadas por el equipo Kory
        </p>
      </ModalShell>
    );
  }

  if (app.modal === "resenas") {
    const todas = [...resenas, ...resenasExtra];
    return (
      <ModalShell maxWidth="720px" onClose={app.closeModal}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-lg font-extrabold">
            ★ {sel.rating} · {sel.reviews} reseñas de anunciantes
          </h3>
          <CloseButton onClose={app.closeModal} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {todas.map((r) => (
            <div
              key={r.nombre}
              className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-[18px]"
            >
              <div className="flex items-center gap-2.5">
                <div
                  style={{ background: r.av }}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-xs font-bold text-white"
                >
                  {r.ini}
                </div>
                <div>
                  <div className="text-[13px] font-bold">{r.nombre}</div>
                  <div className="text-[11px] text-slate-500">{r.rol}</div>
                </div>
                <span className="ml-auto text-xs font-semibold">★ {r.stars}</span>
              </div>
              <p className="m-0 text-[13px] leading-[1.6] text-slate-700">{r.texto}</p>
            </div>
          ))}
        </div>
        <p className="mt-3.5 mb-0 text-center text-xs text-slate-400">
          Mostrando 6 de {sel.reviews} · reseñas verificadas de campañas reales
        </p>
      </ModalShell>
    );
  }

  if (app.modal === "solicitud") {
    const solView = lista.find((s) => s.key === app.solKey) ?? lista[0];
    return (
      <ModalShell maxWidth="520px" onClose={app.closeModal}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-lg font-extrabold">Solicitud · {solView.marca}</h3>
          <CloseButton onClose={app.closeModal} />
        </div>
        <div className="mb-4 flex h-[150px] flex-col items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#1A0A3E,#2D1B69)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <svg viewBox="0 0 24 24" fill="#fff" stroke="none" className="ml-0.5 h-4 w-4">
              <path d="m6 3 14 9-14 9V3z" />
            </svg>
          </span>
          <span className="font-mono text-[11px] text-lavender-200">{solView.archivo}</span>
        </div>
        <div className="mb-[18px] flex flex-col gap-[7px] rounded-[10px] border border-slate-200 bg-[#FAFAFA] px-[15px] py-[13px] text-[12.5px] text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Campaña</span>
            <span className="font-semibold">{solView.detalle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Frecuencia</span>
            <span className="font-semibold">{solView.freq}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-[7px]">
            <span className="text-slate-500">Ingresos para ti</span>
            <span className="font-mono font-bold">{solView.neto}</span>
          </div>
        </div>
        <div className="flex justify-between gap-2.5">
          <button
            onClick={solView.rechazar}
            className="h-[42px] cursor-pointer rounded-[10px] border border-[#F5BAD3] bg-white px-4 text-[13px] font-semibold text-[#C32674] hover:bg-[#FCE6F0]"
          >
            Rechazar
          </button>
          <button
            onClick={solView.aprobar}
            className="h-[42px] flex-1 cursor-pointer rounded-[10px] bg-kory text-[13.5px] font-bold text-white hover:bg-kory-hover"
          >
            Aprobar creativo
          </button>
        </div>
        <p className="mt-3 mb-0 text-center text-[11px] text-slate-400">
          Si rechazas, la marca recibe su reembolso completo y el motivo.
        </p>
      </ModalShell>
    );
  }

  if (app.modal === "como") {
    const pasos = [
      {
        n: "1",
        t: "Busca y compara",
        d: "Filtra por ciudad, presupuesto y fechas. Compara impresiones, CPM y reseñas reales.",
      },
      {
        n: "2",
        t: "Reserva por campaña",
        d: "Sube tu creativo y paga protegido: solo se cobra cuando el dueño aprueba. Cancela gratis hasta 72 h antes.",
      },
      {
        n: "3",
        t: "Al aire en 24 h",
        d: "Tu spot sale en pantalla y sigues las impresiones en vivo desde tu panel.",
      },
    ];
    return (
      <ModalShell maxWidth="480px" onClose={app.closeModal}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="m-0 text-[19px] font-extrabold">Cómo funciona</h3>
          <CloseButton onClose={app.closeModal} />
        </div>
        <div className="mb-5 flex flex-col gap-[18px]">
          {pasos.map((p) => (
            <div key={p.n} className="flex items-start gap-3.5">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-kory-tint text-sm font-extrabold text-kory">
                {p.n}
              </span>
              <div>
                <div className="text-sm font-bold">{p.t}</div>
                <div className="mt-0.5 text-[12.5px] leading-[1.55] text-slate-500">{p.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-[18px] rounded-[10px] border border-lavender-tint bg-kory-pale px-3.5 py-3 text-[12.5px] leading-normal text-slate-700">
          Sin costos fijos ni permanencias: solo un <b>8% de servicio</b> por campaña, ya incluido en
          el precio final.
        </div>
        <button
          onClick={() => {
            app.closeModal();
            router.push("/");
          }}
          className="h-11 w-full cursor-pointer rounded-[11px] bg-kory text-[13.5px] font-bold text-white hover:bg-kory-hover"
        >
          Explorar pantallas
        </button>
      </ModalShell>
    );
  }

  return null;
}
