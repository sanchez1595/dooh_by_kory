"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import {
  calendarioOffset,
  diasSemana,
  duraciones,
  frecuencias,
  getSpecs,
  perfilHorario,
  resenas,
} from "@/data";
import { useTodasLasVallas, useValla } from "@/hooks/use-vallas";
import { VallaCard } from "@/components/valla-card";
import { MedicionBadge, medicionNota } from "@/components/medicion-badge";
import { fmt, fmtDia } from "@/lib/format";
import { getQuote } from "@/lib/pricing";
import { analizar, fmtTramo, sugerirRelevo } from "@/lib/disponibilidad";

export default function DetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const app = useApp();

  const id = Number(params.id);
  const sel = useValla(id);
  const todas = useTodasLasVallas();
  const similares = todas
    .filter((v) => v.id !== sel.id && (v.ciudad === sel.ciudad || v.tipo === sel.tipo))
    .slice(0, 3);

  useEffect(() => {
    if (app.vallaId !== sel.id) app.set({ vallaId: sel.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel.id]);

  const quote = getQuote(sel, app.dias, app.spots, app.inicioDia);
  const esFav = !!app.fav[sel.id];
  const finDia = app.inicioDia + app.dias - 1;
  const finVisible = Math.min(finDia, 31);

  // Disponibilidad real de ESTA pantalla en la ventana pedida.
  const ocup = new Set(sel.ocupados ?? []);
  const disp = analizar(sel, app.inicioDia, app.dias);
  const relevo = sugerirRelevo(sel, app.inicioDia, app.dias, todas);

  const pickDia = (d: number) => {
    if (ocup.has(d)) {
      app.showToast("Ese día está ocupado — elige otro día de inicio");
      return;
    }
    app.set({ inicioDia: d });
    app.showToast(`Campaña movida: inicia el ${fmtDia(d)}`);
  };

  const chip = (act: boolean) =>
    act
      ? "border-kory bg-kory-pale text-kory"
      : "border-slate-200 bg-white text-slate-700";

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-7 pb-20">
        {/* Breadcrumb */}
        <div className="mb-4 text-[13px] text-slate-500">
          <Link href="/" className="font-semibold text-kory">
            Explorar
          </Link>{" "}
          / {sel.ciudad} / <span className="text-ink">{sel.nombre}</span>
        </div>

        {/* Encabezado */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-1.5 text-3xl font-extrabold tracking-[-0.02em]">{sel.nombre}</h1>
            <div className="flex flex-wrap items-center gap-3.5 text-[13.5px] text-slate-600">
              <span className="font-semibold text-ink">
                ★ {sel.rating}{" "}
                <span className="font-normal text-slate-500">({sel.reviews} reseñas)</span>
              </span>
              <span>{sel.ubicacion}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-[9px] py-0.5 text-[11px] font-semibold text-[#16A34A]">
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                Verificada por Kory
              </span>
            </div>
          </div>
          <button
            onClick={() => app.toggleFav(sel.id, sel.nombre)}
            style={{ color: esFav ? "#724CF5" : "#334155" }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-slate-200 px-3.5 py-2 text-[13px] font-semibold hover:border-lavender-strong hover:bg-kory-pale"
          >
            <svg
              viewBox="0 0 24 24"
              fill={esFav ? "#724CF5" : "none"}
              stroke="currentColor"
              className="h-[15px] w-[15px]"
              strokeWidth={2}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {esFav ? "Guardada" : "Guardar"}
          </button>
        </div>

        {/* Galería */}
        <div className="mb-9 grid grid-cols-1 gap-2.5 md:grid-cols-[2fr_1fr]">
          <div
            style={{ background: sel.grad }}
            className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-2xl md:rounded-r-none"
          >
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0%,transparent_40%)]" />
            <div className="text-center">
              <div className="text-[13px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                Tu anuncio aquí
              </div>
              <div className="mt-1.5 font-mono text-[11px] text-white/35">
                {sel.res} px · {sel.dim}
              </div>
            </div>
            <span className="absolute bottom-3 left-3 rounded-full bg-[rgba(13,13,13,0.55)] px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
              {sel.tipo}
            </span>
          </div>
          <div className="grid grid-rows-2 gap-2.5">
            <div
              onClick={() => app.openModal("fotos")}
              className="flex cursor-pointer items-center justify-center rounded-tr-2xl border border-dashed border-lavender-dash bg-[#E9E6F5]"
            >
              <span className="text-[11px] font-semibold tracking-[0.06em] text-[#7B6FB8] uppercase">
                Foto entorno · día
              </span>
            </div>
            <div
              onClick={() => app.openModal("fotos")}
              className="relative flex cursor-pointer items-center justify-center rounded-br-2xl bg-[#241E3F]"
            >
              <span className="text-[11px] font-semibold tracking-[0.06em] text-[#8B82B8] uppercase">
                Vista nocturna
              </span>
              <button
                onClick={() => app.openModal("fotos")}
                className="absolute right-2.5 bottom-2.5 cursor-pointer rounded-lg bg-white/90 px-3 py-1 text-[11.5px] font-bold text-ink hover:bg-white"
              >
                Ver 12 fotos
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_396px]">
          <div className="flex flex-col gap-9">
            {/* Especificaciones */}
            <div>
              <h3 className="mb-4 text-[19px] font-bold">Especificaciones de la pantalla</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {getSpecs(sel).map((s) => (
                  <div key={s.k} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                    <div className="mb-[5px] text-[10.5px] font-bold tracking-[0.08em] text-kory uppercase">
                      {s.k}
                    </div>
                    <div className="font-mono text-[14.5px] font-semibold text-ink">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audiencia */}
            <div>
              <h3 className="mb-2 text-[19px] font-bold">Audiencia</h3>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <MedicionBadge valla={sel} />
                {sel.medicion === "vision" && (
                  <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ECFDF5] px-2.5 py-[3px] text-[10.5px] font-semibold text-[#16A34A]">
                    <span className="h-[5px] w-[5px] rounded-full bg-current" />
                    Cámara en línea
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm leading-[1.7] text-slate-600">
                <b className="text-ink">¿Cómo {sel.medicion === "vision" ? "medimos" : "estimamos"}?</b>{" "}
                {medicionNota(sel)} La pantalla sirve <b className="text-ink">{sel.imp}</b>{" "}
                impresiones diarias, con picos entre 7–9 am y 5–8 pm.
              </p>
              <div className="flex h-[88px] items-end gap-[5px] rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                {perfilHorario.map((h, i) => (
                  <div
                    key={i}
                    title={`${6 + i}:00`}
                    style={{
                      height: `${Math.round(h * 0.6)}px`,
                      background: i === 12 || i === 13 ? "#724CF5" : "#E0D4FF",
                    }}
                    className="flex-1 rounded-t-[3px]"
                  />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-slate-400">
                <span>6 am</span>
                <span>12 m</span>
                <span>6 pm</span>
                <span>11 pm</span>
              </div>
            </div>

            {/* Disponibilidad */}
            <div>
              <h3 className="mb-1 text-[19px] font-bold">Disponibilidad</h3>
              <p className="mb-4 text-[13px] text-slate-500">
                Agosto 2026 · tu campaña:{" "}
                <b className="text-kory">
                  {quote.inicioCorto} – {quote.finCorto} ({app.dias} días)
                </b>{" "}
                · toca un día libre para mover el inicio
              </p>
              <div className="grid w-fit grid-cols-[repeat(7,40px)] gap-1.5">
                {diasSemana.map((dw) => (
                  <div
                    key={dw}
                    className="text-center text-[10.5px] font-bold text-slate-400 uppercase"
                  >
                    {dw}
                  </div>
                ))}
                {Array.from({ length: calendarioOffset }).map((_, i) => (
                  <div key={`off-${i}`} className="h-10 w-10" />
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const enVentana = d >= app.inicioDia && d <= finVisible;
                  const occ = ocup.has(d);
                  // Día de tu ventana pero vendido: se resalta como conflicto.
                  const conflicto = enVentana && occ;
                  const activo = enVentana && !occ;
                  return (
                    <button
                      key={d}
                      onClick={() => pickDia(d)}
                      style={{
                        background: activo ? "#724CF5" : conflicto ? "#FEF2F2" : occ ? "#F1F5F9" : "#fff",
                        color: activo ? "#fff" : conflicto ? "#DC2626" : occ ? "#CBD5E1" : "#0F172A",
                        borderColor: activo ? "#724CF5" : conflicto ? "#FCA5A5" : occ ? "#F1F5F9" : "#E2E8F0",
                        textDecoration: occ ? "line-through" : "none",
                        cursor: occ ? "not-allowed" : "pointer",
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-[9px] border font-mono text-[12.5px] font-semibold transition-colors hover:border-kory"
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3.5 flex flex-wrap gap-[18px] text-[11.5px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-kory" />
                  Tus días
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-[#FCA5A5] bg-[#FEF2F2]" />
                  Vendido en tus fechas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-slate-100" />
                  Ocupado
                </span>
              </div>

              {/* Compra inteligente: solo cuando la ventana tiene huecos */}
              {disp.cobertura === "parcial" && (
                <div className="mt-5 overflow-hidden rounded-[14px] border border-lavender-border">
                  <div className="flex items-center gap-2 bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-4 py-3">
                    <span className="inline-flex items-center gap-[5px] rounded-full bg-kory-tint px-2.5 py-[3px] text-[11px] font-bold text-kory">
                      ✨ Kory IA
                    </span>
                    <span className="text-[13px] font-semibold text-slate-700">
                      Esta pantalla está vendida{" "}
                      {disp.huecos.map((h, i) => (
                        <span key={i}>
                          {i > 0 && ", "}
                          <b className="text-ink">{fmtTramo(h)}</b>
                        </span>
                      ))}
                      . Tienes dos formas de no perder tus fechas:
                    </span>
                  </div>

                  <div className="flex flex-col gap-px bg-slate-100">
                    {/* Opción 1: intercalada (misma pantalla, días libres) */}
                    {(() => {
                      const q = getQuote(sel, disp.libres.length, app.spots, app.inicioDia);
                      return (
                        <div className="flex flex-col gap-2.5 bg-white px-4 py-3.5 sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <div className="text-[13.5px] font-bold text-ink">
                              Reserva solo los {disp.libres.length} días libres
                            </div>
                            <p className="mt-0.5 mb-0 text-[12px] leading-[1.5] text-slate-500">
                              Tu anuncio sale al aire los días disponibles y se pausa solo{" "}
                              {disp.huecos.map((h) => fmtTramo(h)).join(" y ")}. Pagas únicamente lo
                              que emites.
                            </p>
                          </div>
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                            <span className="font-mono text-[15px] font-bold text-ink">
                              {fmt(q.total)}
                            </span>
                            <button
                              onClick={() =>
                                app.showToast(
                                  `Campaña intercalada: ${disp.libres.length} días en ${sel.nombre}`,
                                )
                              }
                              className="h-9 shrink-0 cursor-pointer rounded-[10px] bg-kory px-4 text-[12.5px] font-bold text-white hover:bg-kory-hover"
                            >
                              Reservar {disp.libres.length} días
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Opción 2: relevo continuo (otra pantalla cubre los huecos) */}
                    {relevo && (() => {
                      const qBase = getQuote(sel, disp.libres.length, app.spots, app.inicioDia);
                      const qRel = getQuote(relevo.valla, relevo.cubre.length, app.spots, app.inicioDia);
                      const total = qBase.total + qRel.total;
                      return (
                        <div className="bg-white px-4 py-3.5">
                          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
                                Cobertura continua con relevo
                                <span className="rounded-full bg-kory-tint px-2 py-[1px] text-[9.5px] font-bold text-kory">
                                  recomendado
                                </span>
                              </div>
                              <p className="mt-0.5 mb-0 text-[12px] leading-[1.5] text-slate-500">
                                Sin huecos: <b className="text-ink">{sel.nombre}</b> los días libres y{" "}
                                <b className="text-ink">{relevo.valla.nombre}</b> cubre{" "}
                                {relevo.cubre.length === 1
                                  ? fmtDia(relevo.cubre[0])
                                  : `${relevo.cubre.length} días`}
                                . Un solo pago, tus 14 días completos.
                              </p>
                            </div>
                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                              <span className="font-mono text-[15px] font-bold text-ink">
                                {fmt(total)}
                              </span>
                              <button
                                onClick={() =>
                                  app.showToast(
                                    `Relevo armado: ${sel.nombre} + ${relevo.valla.nombre} — cobertura continua`,
                                  )
                                }
                                className="h-9 shrink-0 cursor-pointer rounded-[10px] bg-kory px-4 text-[12.5px] font-bold text-white hover:bg-kory-hover"
                              >
                                Armar relevo
                              </button>
                            </div>
                          </div>

                          {/* Línea de tiempo: quién emite cada día */}
                          <div className="mt-3 flex overflow-hidden rounded-lg">
                            {disp.ventana.map((d) => {
                              const esHueco = disp.ocupados.includes(d);
                              const loCubre = esHueco && relevo.cubre.includes(d);
                              return (
                                <div
                                  key={d}
                                  title={`${fmtDia(d)} · ${loCubre ? relevo.valla.nombre : esHueco ? "sin cubrir" : sel.nombre}`}
                                  style={{
                                    background: loCubre
                                      ? "#9B7BF7"
                                      : esHueco
                                        ? "#E2E8F0"
                                        : "#724CF5",
                                  }}
                                  className="h-6 flex-1 border-r border-white/40 last:border-r-0"
                                />
                              );
                            })}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-sm bg-kory" />
                              {sel.nombre}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-sm bg-kory-light" />
                              {relevo.valla.nombre}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {disp.cobertura === "nula" && (
                <div className="mt-5 rounded-[14px] border border-lavender-border bg-kory-pale px-4 py-3.5 text-[13px] leading-[1.55] text-slate-700">
                  Esta pantalla está vendida en todas tus fechas. Prueba con otro rango, o mira las{" "}
                  <b>pantallas similares</b> más abajo — varias están libres esos días.
                </div>
              )}
            </div>

            {/* Reseñas */}
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="m-0 text-[19px] font-bold">
                  ★ {sel.rating} · {sel.reviews} reseñas de anunciantes
                </h3>
                <button
                  onClick={() => app.openModal("resenas")}
                  className="cursor-pointer rounded-[10px] border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:border-lavender-strong hover:bg-kory-pale"
                >
                  Ver las {sel.reviews} reseñas
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resenas.map((r) => (
                  <div
                    key={r.ini}
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
            </div>
          </div>

          {/* Tarjeta de reserva */}
          <div className="sticky top-[88px] flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-booking">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono text-[22px] font-bold">{quote.precioEfF}</span>{" "}
                <span className="text-[12.5px] text-slate-500">COP /día</span>
              </div>
              <span className="text-xs font-semibold">★ {sel.rating}</span>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-bold tracking-[0.06em] text-slate-500 uppercase">
                Duración de campaña
              </div>
              <div className="flex gap-2">
                {duraciones.map((d) => (
                  <button
                    key={d}
                    onClick={() => app.set({ dias: d })}
                    className={`flex-1 cursor-pointer rounded-[10px] border-[1.5px] py-2.5 text-center text-[13px] font-bold transition-colors hover:border-kory ${chip(d === app.dias)}`}
                  >
                    {d} días
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-bold tracking-[0.06em] text-slate-500 uppercase">
                Frecuencia · spots de 10 s
              </div>
              <div className="flex gap-2">
                {frecuencias.map((f) => (
                  <button
                    key={f.spots}
                    onClick={() => app.set({ spots: f.spots })}
                    className={`flex-1 cursor-pointer rounded-[10px] border-[1.5px] py-2 text-center text-xs leading-[1.3] font-bold transition-colors hover:border-kory ${chip(f.spots === app.spots)}`}
                  >
                    {f.spots}/hora
                    <br />
                    <span className="text-[10px] font-semibold opacity-70">{f.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 rounded-xl border border-slate-200">
              <div className="border-r border-slate-200 px-3.5 py-2.5">
                <div className="text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                  Inicio
                </div>
                <div className="mt-0.5 text-[13px] font-semibold">{quote.inicioLargo}</div>
              </div>
              <div className="px-3.5 py-2.5">
                <div className="text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                  Fin
                </div>
                <div className="mt-0.5 text-[13px] font-semibold">{quote.finLargo}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-[10px] border border-lavender-tint bg-kory-pale px-3.5 py-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#724CF5"
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <div className="text-[12.5px] leading-[1.45] text-slate-700">
                <b className="font-mono">≈ {quote.impTotalesF}</b> impresiones{" "}
                {sel.medicion === "vision" ? "medidas" : "estimadas"} · CPM{" "}
                <b className="font-mono">{quote.cpmF}</b>{" "}
                <span className="font-semibold text-[#16A34A]">· 62% bajo el promedio OOH</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] text-slate-700">
              <div className="flex justify-between">
                <span>
                  {quote.precioEfF} × {app.dias} días
                </span>
                <span className="font-mono">{quote.subtotalF}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio Kory (8%)</span>
                <span className="font-mono">{quote.servicioF}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2.5 font-bold text-ink">
                <span>Total</span>
                <span className="font-mono">{quote.totalF}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="h-12 cursor-pointer rounded-[11px] bg-kory text-[14.5px] font-bold text-white transition-colors hover:bg-kory-hover"
            >
              Solicitar campaña
            </button>
            <div className="text-center text-[11.5px] text-slate-400">
              No se cobra hasta que el dueño apruebe tu creativo
            </div>
          </div>
        </div>

        {/* Pantallas similares */}
        {similares.length > 0 && (
          <div className="mt-14">
            <div className="mb-5 flex items-baseline justify-between">
              <h3 className="m-0 text-[19px] font-bold">Pantallas similares</h3>
              <Link href="/" className="text-[13px] font-semibold text-kory">
                Ver todas →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {similares.map((v) => (
                <VallaCard key={v.id} valla={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
