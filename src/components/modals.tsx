"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { facturacion, getFotosTiles, ordenId, resenas, resenasExtra } from "@/data";
import { useValla } from "@/hooks/use-vallas";
import { useSolicitudes } from "@/hooks/use-solicitudes";
import { MedicionBadge } from "@/components/medicion-badge";
import { getQuote } from "@/lib/pricing";

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

// W11 · Brief "Te la armamos": 3 pasos, respuestas cerradas (Hick), stepper
// con progreso real. Se desmonta al cerrar, así el estado siempre arranca limpio.
function BriefModal() {
  const app = useApp();
  const [paso, setPaso] = useState(1);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [zona, setZona] = useState("Bogotá");
  const [presu, setPresu] = useState("$20–50M");
  const [correo, setCorreo] = useState("");

  const pasos = ["Objetivo", "Zona y presupuesto", "Tu contacto"];
  const puedeSeguir = paso === 1 ? objetivo !== null : paso === 2 ? true : correo.includes("@");

  const chip = (activo: boolean) =>
    `cursor-pointer rounded-[10px] border px-4 py-3 text-[13px] font-semibold transition-colors ${
      activo
        ? "border-kory bg-kory-pale text-kory"
        : "border-slate-200 bg-white text-slate-700 hover:border-lavender-strong"
    }`;

  return (
    <ModalShell maxWidth="480px" onClose={app.closeModal}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="m-0 text-[19px] font-extrabold">Cuéntanos tu meta</h3>
        <CloseButton onClose={app.closeModal} />
      </div>
      <div className="mb-5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        {pasos.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && <span className="w-5 border-t border-dashed border-slate-300" />}
            <span className={i + 1 === paso ? "text-kory" : i + 1 < paso ? "text-[#16A34A]" : ""}>
              {i + 1 < paso ? "✓" : i + 1 === paso ? "●" : "○"} {p}
            </span>
          </span>
        ))}
      </div>

      {paso === 1 && (
        <div className="grid grid-cols-2 gap-2.5">
          {["Lanzamiento", "Ventas", "Marca", "Evento"].map((o) => (
            <button key={o} onClick={() => setObjetivo(o)} className={chip(objetivo === o)}>
              {o}
            </button>
          ))}
        </div>
      )}

      {paso === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.06em] text-slate-500 uppercase">
              ¿Dónde?
            </div>
            <div className="flex flex-wrap gap-2">
              {["Bogotá", "Medellín", "Ambas"].map((z) => (
                <button key={z} onClick={() => setZona(z)} className={chip(zona === z)}>
                  {z}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.06em] text-slate-500 uppercase">
              Presupuesto aproximado
            </div>
            <div className="flex flex-wrap gap-2">
              {["Menos de $20M", "$20–50M", "$50M o más"].map((p) => (
                <button key={p} onClick={() => setPresu(p)} className={chip(presu === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="flex flex-col gap-2.5">
          <div className="rounded-[10px] border border-lavender-tint bg-kory-pale px-3.5 py-3 text-[12.5px] text-slate-700">
            {objetivo} · {zona} · {presu}
          </div>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tu@empresa.co"
            className="h-11 rounded-[10px] border border-slate-200 px-3.5 text-[13.5px] outline-none focus:border-kory"
          />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-2.5">
        <button
          onClick={() => setPaso((p) => Math.max(1, p - 1))}
          disabled={paso === 1}
          className="h-[42px] cursor-pointer rounded-[10px] border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 disabled:cursor-default disabled:opacity-40"
        >
          Atrás
        </button>
        <button
          onClick={() => {
            if (!puedeSeguir) return;
            if (paso < 3) setPaso(paso + 1);
            else {
              app.closeModal();
              app.showToast(`¡Listo! Tu propuesta llega a ${correo} en máximo 24 h ✨`);
            }
          }}
          disabled={!puedeSeguir}
          className="h-[42px] flex-1 cursor-pointer rounded-[10px] bg-kory text-[13.5px] font-bold text-white hover:bg-kory-hover disabled:cursor-default disabled:opacity-50"
        >
          {paso < 3 ? "Siguiente" : "Recibir propuesta"}
        </button>
      </div>
      <p className="mt-3 mb-0 text-center text-[11px] text-slate-400">
        Propuesta en 24 h · sin compromiso · la arma una persona real
      </p>
    </ModalShell>
  );
}

// W10 · Certificado de emisión verificable: folio + QR + proof-of-play +
// evidencia con hora. El documento vive en un borde doble (región Gestalt).
function CertificadoModal() {
  const app = useApp();
  const sel = useValla(app.vallaId);
  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);
  const spotsTotales = (app.spots * 24 * app.dias).toLocaleString("es-CO");
  const evidencia = [
    { bg: sel.grad, hora: `${quote.inicioCorto} · 6:02 am` },
    { bg: "linear-gradient(160deg,#241E3F,#3A3160)", hora: "18 ago · 1:15 pm" },
    { bg: "linear-gradient(160deg,#11131D,#2D1B69)", hora: `${quote.finCorto} · 9:47 pm` },
  ];

  return (
    <ModalShell maxWidth="560px" onClose={app.closeModal}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="m-0 text-lg font-extrabold">Certificado de emisión · {ordenId}</h3>
        <CloseButton onClose={app.closeModal} />
      </div>

      <div className="rounded-xl border-2 border-slate-300 p-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[15px] font-extrabold">Certificado de emisión</div>
          <div className="font-mono text-[11px] text-slate-400">Folio KC-2026-00812</div>
        </div>
        <div className="my-3 border-t border-slate-200" />
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-[7px] text-[12.5px]">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Anunciante</span>
              <span className="font-semibold">{facturacion.razonSocial}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Pantalla</span>
              <span className="font-semibold">{sel.nombre}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Periodo</span>
              <span className="font-semibold">
                {quote.inicioLargo} – {quote.finLargo}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Spots contratados / emitidos</span>
              <span className="font-semibold">
                {spotsTotales} / {spotsTotales}{" "}
                <span className="rounded-full bg-[#ECFDF5] px-2 py-[2px] text-[10px] font-bold text-[#16A34A]">
                  100% cumplido
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500">Impresiones</span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                ≈ {quote.impTotalesF} <MedicionBadge valla={sel} compact />
              </span>
            </div>
          </div>
          <div className="flex w-[92px] shrink-0 flex-col items-center gap-1.5">
            <svg viewBox="0 0 21 21" className="h-[76px] w-[76px] rounded border border-slate-200 bg-white p-1.5">
              {[0, 1, 2, 4, 6, 8, 9, 11, 13, 14, 16, 18, 20, 22, 25, 27, 29, 31, 33, 36, 38, 40].map(
                (n) => (
                  <rect key={n} x={(n * 5) % 19} y={Math.floor((n * 5) / 19) * 3} width="2" height="2" fill="#0F172A" />
                ),
              )}
              <rect x="0" y="0" width="5" height="5" fill="none" stroke="#0F172A" />
              <rect x="14" y="0" width="5" height="5" fill="none" stroke="#0F172A" />
              <rect x="0" y="14" width="5" height="5" fill="none" stroke="#0F172A" />
            </svg>
            <span className="text-center font-mono text-[9px] leading-snug text-slate-400">
              dooh.kory.co/verificar
            </span>
          </div>
        </div>
        <div className="my-3 border-t border-slate-200" />
        <div className="mb-2 text-[12px] font-bold">Evidencia de emisión</div>
        <div className="grid grid-cols-3 gap-2">
          {evidencia.map((e) => (
            <div
              key={e.hora}
              style={{ background: e.bg }}
              className="flex h-[64px] items-end rounded-lg p-1.5"
            >
              <span className="rounded-full bg-[rgba(13,13,13,0.6)] px-2 py-[2px] font-mono text-[9px] font-semibold text-white">
                {e.hora}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 mb-0 text-[11px] leading-[1.5] text-slate-400">
          Capturas con marca de tiempo del creativo al aire. Registro de proof-of-play firmado por
          Kory Player.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <button
          onClick={() => app.showToast("Certificado KC-2026-00812 descargado en PDF")}
          className="h-[42px] cursor-pointer rounded-[10px] bg-kory px-5 text-[13.5px] font-bold text-white hover:bg-kory-hover"
        >
          Descargar PDF
        </button>
        <button
          onClick={() => app.showToast(`Certificado enviado a ${facturacion.correo}`)}
          className="h-[42px] cursor-pointer rounded-[10px] border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          Enviar a mi correo
        </button>
        <span className="ml-auto hidden text-[11px] text-slate-400 md:block">
          Cada lunes: reporte semanal certificado
        </span>
      </div>
    </ModalShell>
  );
}

export function Modals() {
  const app = useApp();
  const router = useRouter();
  const { lista } = useSolicitudes();

  const sel = useValla(app.vallaId);

  if (app.modal === "brief") return <BriefModal />;
  if (app.modal === "certificado") return <CertificadoModal />;

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
