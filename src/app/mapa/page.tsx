"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useConteos, useVallasFiltradas } from "@/hooks/use-vallas-filtradas";
import { useTodasLasVallas } from "@/hooks/use-vallas";
import { beneficioTipo, ciudades, gruposTipo, SIN_LIMITE } from "@/data";
import type { TipoValla, Valla } from "@/data/types";
import { fmt, fmtDia, fmtM, fmtMillones } from "@/lib/format";
import { fmtCorto, getAjuste, rangoTipico } from "@/lib/ajuste";
import { parseBusqueda, sinAcentos } from "@/lib/busqueda";
import { getQuote } from "@/lib/pricing";
import { VallaCard } from "@/components/valla-card";
import { RealMap } from "@/components/real-map";

// W17 · Constructor de campaña. El presupuesto deja de ser un filtro que borra
// y se vuelve el eje que reencuadra el catálogo: cada pantalla responde en días
// alcanzables. Así el estado vacío por presupuesto deja de existir.

type CiudadMapa = "Bogotá" | "Medellín";

/** CPM de referencia del OOH tradicional en Colombia, para situar el nuestro. */
const CPM_OOH_TRADICIONAL = 25000;

const CARDINALES = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];
const cardinal = (b: number) => CARDINALES[Math.round((((b % 360) + 360) % 360) / 45) % 8];

function vistaLabel(v: Valla): string {
  const b = v.vista ?? 0;
  return v.dobleCara
    ? `Vista al ${cardinal(b)} y ${cardinal(b + 180)} · doble cara`
    : `Vista al ${cardinal(b)}`;
}

/** Chip de filtro aplicado: rotulado con su tipo y removible en un clic. */
function ChipFiltro({ label, onQuitar }: { label: string; onQuitar: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-kory-tint py-1 pr-1.5 pl-3 text-[11.5px] font-semibold text-kory">
      {label}
      <button
        onClick={onQuitar}
        aria-label={`Quitar filtro ${label}`}
        className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[10px] hover:bg-kory hover:text-white"
      >
        ✕
      </button>
    </span>
  );
}

/** Fila de opción con su conteo; las de cero quedan deshabilitadas. */
function Opcion({
  label,
  sub,
  n,
  activa,
  onPick,
}: {
  label: string;
  sub?: string;
  n: number;
  activa: boolean;
  onPick: () => void;
}) {
  const vacia = n === 0 && !activa;
  return (
    <button
      onClick={onPick}
      disabled={vacia}
      title={vacia ? "No hay pantallas con esta combinación" : undefined}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition-colors ${
        activa
          ? "bg-kory-tint font-bold text-kory"
          : vacia
            ? "cursor-not-allowed text-slate-300"
            : "cursor-pointer font-semibold text-slate-700 hover:bg-kory-pale"
      }`}
    >
      <span className="min-w-0">
        <span className="block truncate">{label}</span>
        {sub && <span className="block truncate text-[10.5px] font-normal text-slate-400">{sub}</span>}
      </span>
      <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{n}</span>
    </button>
  );
}

export default function MapaPage() {
  const router = useRouter();
  const app = useApp();
  const todas = useTodasLasVallas();
  const base = useVallasFiltradas();
  const conteos = useConteos();

  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [ciudadMapa, setCiudadMapa] = useState<CiudadMapa>(
    app.ciudad === "Medellín" ? "Medellín" : "Bogotá",
  );
  const [conAlcance, setConAlcance] = useState(true);
  const [mapSel, setMapSel] = useState<number | null>(null);
  const [mapHover, setMapHover] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const cambiarCiudad = (c: CiudadMapa) => {
    setCiudadMapa(c);
    setMapSel(null);
  };

  // Rango del slider derivado del inventario real, no de presets inventados.
  // El mínimo es un día de la pantalla más barata, para que declarar un
  // presupuesto pequeño sea posible (y muestre el reencuadre completo).
  const rango = useMemo(() => {
    const precios = todas.map((v) => v.precio);
    const min = Math.max(1e6, Math.round((Math.min(...precios) * 1.08) / 1e6) * 1e6);
    const max = Math.ceil((Math.max(...precios) * app.dias * 1.08) / 1e6) * 1e6;
    return { min, max };
  }, [todas, app.dias]);

  const presuActivo = Number.isFinite(app.presupuesto);
  const presuValor = presuActivo ? app.presupuesto : rango.max;

  // Búsqueda inteligente: lo que la IA infiere se escribe en los MISMOS
  // filtros que los controles (una sola verdad) y aparece como chip.
  const busq = parseBusqueda(q);
  const vallas = base.filter(
    (v) =>
      (!busq.ciudad || v.ciudad === busq.ciudad) &&
      (!busq.tipo || v.tipo === busq.tipo) &&
      (!busq.vision || v.medicion === "vision") &&
      (!busq.maxPrecio || v.precio <= busq.maxPrecio) &&
      busq.terminos.every((t) =>
        sinAcentos(`${v.nombre} ${v.ubicacion}`.toLowerCase()).includes(t),
      ),
  );

  // Reencuadre presupuestal: nada se borra, se agrupa por ajuste.
  const conAjuste = vallas.map((v) => ({ v, a: getAjuste(v, app.dias, presuValor) }));
  const alcanzan = conAjuste.filter((x) => x.a.estado !== "excede");
  const sePasan = conAjuste.filter((x) => x.a.estado === "excede");

  const abrir = (id: number) => {
    app.set({ vallaId: id });
    router.push(`/valla/${id}`);
  };

  const finDia = app.inicioDia + app.dias - 1;
  const popupV = mapSel !== null ? vallas.find((v) => v.id === mapSel) : undefined;
  const alcanceTotal = vallas.reduce((a, v) => a + v.impN, 0);
  const rangoP = rangoTipico(base.length ? base : todas);

  // Chips de lo aplicado, incluyendo lo inferido por la IA (marcado con ✨).
  const chips: Array<{ label: string; quitar: () => void }> = [];
  if (app.ciudad !== "Todas")
    chips.push({ label: `Ciudad: ${app.ciudad}`, quitar: () => app.set({ ciudad: "Todas" }) });
  if (app.cat !== "Todas")
    chips.push({ label: `Tipo: ${app.cat}`, quitar: () => app.set({ cat: "Todas" }) });
  if (app.entorno !== "Todos")
    chips.push({
      label: app.entorno === "exterior" ? "Al aire libre" : "Bajo techo",
      quitar: () => app.set({ entorno: "Todos" }),
    });
  if (app.soloVision)
    chips.push({ label: "Medida con cámara", quitar: () => app.set({ soloVision: false }) });
  if (presuActivo)
    chips.push({
      label: `Hasta ${fmtCorto(app.presupuesto)}`,
      quitar: () => app.set({ presupuesto: SIN_LIMITE }),
    });
  for (const e of busq.etiquetas) chips.push({ label: `✨ ${e}`, quitar: () => setQ("") });

  // Estado vacío con culpable: qué filtro concreto está costando más resultados.
  const culpable = (() => {
    if (vallas.length > 0) return null;
    const pruebas: Array<{ label: string; n: number; quitar: () => void }> = [];
    if (app.soloVision)
      pruebas.push({
        label: "Quitar «Medida con cámara»",
        n: base.length ? 0 : todas.filter((v) => v.ciudad === app.ciudad || app.ciudad === "Todas").length,
        quitar: () => app.set({ soloVision: false }),
      });
    if (app.cat !== "Todas")
      pruebas.push({
        label: `Quitar «${app.cat}»`,
        n: conteos.porTipo("Todas"),
        quitar: () => app.set({ cat: "Todas" }),
      });
    if (app.ciudad !== "Todas")
      pruebas.push({
        label: `Ver todas las ciudades`,
        n: conteos.porCiudad("Todas"),
        quitar: () => app.set({ ciudad: "Todas" }),
      });
    if (q) pruebas.push({ label: "Limpiar la búsqueda", n: base.length, quitar: () => setQ("") });
    return pruebas.sort((a, b) => b.n - a.n);
  })();

  const hayFiltros = chips.length > 0;

  // Si el cruce quedó vacío, lo más cercano: relaja la búsqueda libre primero
  // y, si aún no hay nada, el catálogo mejor valorado.
  const aproximados =
    vallas.length > 0 ? [] : (base.length > 0 ? base : todas).slice(0, 4);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Búsqueda IA + chips + toggle Lista/Mapa */}
      <div className="border-b border-slate-200 bg-white px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-full border border-slate-200 px-4 transition-colors focus-within:border-kory">
            <span className="shrink-0 text-[13px]">✨</span>
            <input
              value={q}
              onChange={(e) => {
                const texto = e.target.value;
                setQ(texto);
                const nb = parseBusqueda(texto);
                if (nb.ciudad && nb.ciudad !== ciudadMapa) cambiarCiudad(nb.ciudad);
              }}
              placeholder='Busca con Kory IA: "paraderos en Medellín bajo $500 mil"'
              aria-label="Búsqueda inteligente"
              className="h-10 w-full min-w-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-slate-400"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Limpiar búsqueda"
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            )}
          </div>
          {chips.map((c) => (
            <ChipFiltro key={c.label} label={c.label} onQuitar={c.quitar} />
          ))}
          {hayFiltros && (
            <button
              onClick={() => {
                app.resetFiltros();
                setQ("");
              }}
              className="cursor-pointer text-xs font-semibold text-kory hover:underline"
            >
              Limpiar todo
            </button>
          )}
          {/* Toggle Lista/Mapa — una sola vista grande a la derecha */}
          <div className="ml-auto flex shrink-0 overflow-hidden rounded-full border border-slate-200">
            {(
              [
                ["lista", "☰ Lista"],
                ["mapa", "◗ Mapa"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                aria-pressed={vista === v}
                className={`cursor-pointer px-4 py-1.5 text-xs font-bold transition-colors ${
                  vista === v ? "bg-ink text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[236px_minmax(0,1fr)]">
        {/* ── Panel: Tu campaña (siempre visible en desktop) ── */}
        <aside
          className={`${vista === "lista" ? "block" : "hidden"} overflow-y-auto border-r border-slate-200 bg-white px-4 pt-4 pb-24 md:block`}
        >
          <div className="mb-1 text-[13px] font-extrabold text-ink">Tu campaña</div>
          <p className="mt-0 mb-4 text-[11px] leading-[1.45] text-slate-500">
            Dinos cuánto y cuándo; nosotros calculamos qué te alcanza.
          </p>

          <div className="mb-1 font-mono text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Presupuesto total
          </div>
          <div className="text-[17px] font-extrabold text-ink">
            {presuActivo ? fmt(app.presupuesto) : "Sin límite"}
          </div>
          <input
            type="range"
            min={rango.min}
            max={rango.max}
            step={500000}
            value={presuValor}
            onChange={(e) => {
              const v = Number(e.target.value);
              app.set({ presupuesto: v >= rango.max ? SIN_LIMITE : v });
            }}
            aria-label="Presupuesto total de campaña"
            className="mt-2 w-full accent-kory"
          />
          <div className="flex justify-between font-mono text-[9.5px] text-slate-400">
            <span>{fmtCorto(rango.min)}</span>
            <span>sin límite</span>
          </div>
          {rangoP && (
            <p className="mt-2 mb-4 text-[11px] leading-[1.45] text-slate-500">
              La mayoría de las pantallas están entre{" "}
              <b className="text-slate-700">{fmtCorto(rangoP.min)}</b> y{" "}
              <b className="text-slate-700">{fmtCorto(rangoP.max)}</b> por día. El precio ya incluye
              el servicio del 8%.
            </p>
          )}

          <div className="mt-4 mb-1 font-mono text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Fechas
          </div>
          <div className="rounded-[9px] border border-slate-200 px-3 py-2 text-[12.5px] font-semibold text-ink">
            {fmtDia(app.inicioDia)} – {fmtDia(finDia)}
            <span className="block text-[10.5px] font-normal text-slate-400">{app.dias} días</span>
          </div>

          <div className="mt-4 mb-1 font-mono text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Dónde
          </div>
          {ciudades.map((c) => (
            <Opcion
              key={c}
              label={c === "Todas" ? "Todas las ciudades" : c}
              n={conteos.porCiudad(c)}
              activa={app.ciudad === c}
              onPick={() => {
                app.set({ ciudad: c });
                if (c !== "Todas") cambiarCiudad(c as CiudadMapa);
              }}
            />
          ))}

          <div className="mt-4 mb-1 font-mono text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Tipo de sitio
          </div>
          <Opcion
            label="Todos los sitios"
            n={conteos.porTipo("Todas")}
            activa={app.cat === "Todas" && app.entorno === "Todos"}
            onPick={() => app.set({ cat: "Todas", entorno: "Todos" })}
          />
          {gruposTipo.map((g) => (
            <div key={g.entorno} className="mt-1.5">
              <button
                onClick={() =>
                  app.set({
                    entorno: app.entorno === g.entorno ? "Todos" : g.entorno,
                    cat: "Todas",
                  })
                }
                className={`w-full rounded-lg px-2.5 py-1.5 text-left font-mono text-[9.5px] font-bold tracking-[0.08em] uppercase transition-colors ${
                  app.entorno === g.entorno
                    ? "bg-ink text-white"
                    : "cursor-pointer text-slate-400 hover:bg-slate-100"
                }`}
              >
                {g.label}
              </button>
              {g.tipos.map((t) => (
                <Opcion
                  key={t}
                  label={t}
                  sub={beneficioTipo[t as TipoValla]}
                  n={conteos.porTipo(t)}
                  activa={app.cat === t}
                  onPick={() => app.set({ cat: app.cat === t ? "Todas" : t, entorno: "Todos" })}
                />
              ))}
            </div>
          ))}

          <div className="mt-4 mb-1 font-mono text-[9.5px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Medición
          </div>
          <Opcion
            label="Medida con cámara ●"
            sub="cuenta personas reales, no estimadas"
            n={conteos.conVision()}
            activa={app.soloVision}
            onPick={() => app.set({ soloVision: !app.soloVision })}
          />
        </aside>

        {/* ── Área grande: Lista (multi-columna) O Mapa, según el toggle ── */}
        <div className={`${vista === "lista" ? "block" : "hidden"} overflow-y-auto bg-white px-5 pt-4 pb-24`}>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="m-0 text-[15px] font-extrabold text-ink">
              {vallas.length} de {conteos.total} pantallas
              {presuActivo && vallas.length > 0 && (
                <span className="ml-1.5 font-normal text-slate-500">
                  · {alcanzan.length} te alcanzan
                </span>
              )}
            </h1>
            <span className="text-[11.5px] text-slate-500">
              {fmtDia(app.inicioDia)} – {fmtDia(finDia)}
            </span>
          </div>

          {vallas.length === 0 ? (
            <div className="rounded-[14px] border-[1.5px] border-dashed border-lavender-border bg-[#FBFAFD] p-6">
              <div className="text-[14px] font-extrabold text-ink">
                Ninguna pantalla cumple todas las condiciones
              </div>
              <p className="mt-1 mb-3 text-[12.5px] text-slate-500">
                Estas salidas te devuelven resultados de inmediato:
              </p>
              <div className="flex flex-col gap-2">
                {culpable?.slice(0, 3).map((p) => (
                  <button
                    key={p.label}
                    onClick={p.quitar}
                    className="flex cursor-pointer items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-slate-700 hover:border-kory hover:bg-kory-pale"
                  >
                    {p.label}
                    <span className="font-mono text-[11px] font-bold text-kory">
                      → {p.n} pantallas
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 mb-2 text-[11.5px] font-semibold text-slate-500">
                ¿Buscabas algo que no tenemos todavía?
              </p>
              <button
                onClick={() =>
                  app.showToast("Te avisamos apenas entre inventario que coincida con tu búsqueda")
                }
                className="cursor-pointer rounded-[9px] border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Avísame si llega inventario así
              </button>

              {/* Nunca una pantalla sin inventario: el impulso de compra no se apaga */}
              {aproximados.length > 0 && (
                <>
                  <div className="my-4 flex items-center gap-2.5 text-[11.5px] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    Mientras tanto, lo más parecido
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
                    {aproximados.map((v) => (
                      <VallaCard
                        key={v.id}
                        valla={v}
                        compact
                        universo={todas}
                        vistaInfo={`${vistaLabel(v)} · ≈ ${v.alcance ?? 300} m`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
                {alcanzan.map(({ v, a }) => (
                  <div
                    key={v.id}
                    onMouseEnter={() => {
                      setMapHover(v.id);
                      if (v.ciudad !== ciudadMapa) cambiarCiudad(v.ciudad as CiudadMapa);
                    }}
                    onMouseLeave={() => setMapHover(null)}
                  >
                    <VallaCard
                      valla={v}
                      compact
                      universo={todas}
                      ajuste={presuActivo ? a : undefined}
                      vistaInfo={`${vistaLabel(v)} · ≈ ${v.alcance ?? 300} m`}
                    />
                  </div>
                ))}
              </div>

              {sePasan.length > 0 && (
                <>
                  <div className="my-4 flex items-center gap-2.5 text-[11.5px] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    {sePasan.length} se pasan de tu presupuesto
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 opacity-70">
                    {sePasan.map(({ v, a }) => (
                      <div
                        key={v.id}
                        onMouseEnter={() => {
                          setMapHover(v.id);
                          if (v.ciudad !== ciudadMapa) cambiarCiudad(v.ciudad as CiudadMapa);
                        }}
                        onMouseLeave={() => setMapHover(null)}
                      >
                        <VallaCard
                          valla={v}
                          compact
                          universo={todas}
                          ajuste={a}
                          vistaInfo={`${vistaLabel(v)} · ≈ ${v.alcance ?? 300} m`}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Frase educativa: el CPM se define en la misma línea en que aparece */}
              {alcanzan.length > 0 &&
                (() => {
                  // El ejemplo usa la que más días cubre: es el caso que mejor
                  // enseña la relación entre presupuesto, duración y CPM.
                  const mejor = [...alcanzan].sort((a, b) => b.a.dias - a.a.dias)[0];
                  const qt = getQuote(mejor.v, mejor.a.dias, app.spots, app.inicioDia);
                  const ahorro = Math.round((1 - qt.cpm / CPM_OOH_TRADICIONAL) * 100);
                  return (
                    <div className="mt-5 rounded-xl border border-lavender-border bg-[linear-gradient(135deg,#F8F6FF,#fff)] px-4 py-3 text-[12px] leading-[1.6] text-slate-700">
                      <b>Por ejemplo:</b> {mejor.v.nombre} por {mejor.a.dias}{" "}
                      {mejor.a.dias === 1 ? "día" : "días"} costaría{" "}
                      <b className="font-mono">{fmt(qt.total)}</b> y la verían{" "}
                      <b className="font-mono">≈ {qt.impTotalesF}</b> de veces —{" "}
                      <b className="font-mono">{fmt(qt.cpm)}</b> por cada mil vistas (eso es el CPM)
                      {ahorro >= 10 && (
                        <span className="font-semibold text-[#16A34A]">
                          , {ahorro}% menos que el OOH tradicional
                        </span>
                      )}
                      .
                    </div>
                  );
                })()}
            </>
          )}
        </div>

        {/* ── Mapa (ocupa toda el área grande cuando está activo) ── */}
        <div className={`relative ${vista === "mapa" ? "block" : "hidden"}`}>
          <RealMap
            vallas={vallas}
            ciudad={ciudadMapa}
            conAlcance={conAlcance}
            hoverId={mapHover}
            selId={mapSel}
            onSelect={setMapSel}
            onHover={setMapHover}
            activo={vista === "mapa"}
          />

          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              {ciudadMapa} · {vallas.filter((v) => v.ciudad === ciudadMapa).length}
            </div>
            <button
              onClick={() => setConAlcance((a) => !a)}
              aria-pressed={conAlcance}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-bold shadow-[0_1px_3px_rgba(15,23,42,0.12)] ${
                conAlcance
                  ? "border-kory bg-kory-tint text-kory"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              ◎ Alcance visible
            </button>
          </div>

          {popupV && (
            <div className="absolute bottom-10 left-4 z-20 w-[262px] overflow-hidden rounded-[14px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)]">
              <div
                style={{ background: popupV.grad }}
                className="relative flex h-20 items-center justify-center"
              >
                <span className="text-[9px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                  Tu anuncio aquí
                </span>
                <button
                  onClick={() => setMapSel(null)}
                  aria-label="Cerrar tarjeta"
                  className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[11px] text-ink"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-1 px-3.5 py-3">
                <span className="text-[13px] font-bold">{popupV.nombre}</span>
                <span className="text-[11px] text-slate-500">
                  {popupV.ubicacion} · {popupV.imp} imp/día
                </span>
                <span className="text-[11px] text-slate-600">
                  {vistaLabel(popupV)} · radio ≈ {popupV.alcance ?? 300} m
                </span>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-mono text-[13.5px] font-bold">
                    {fmt(popupV.precio)}{" "}
                    <span className="text-[10px] font-medium text-slate-500">/día</span>
                  </span>
                  <button
                    onClick={() => abrir(popupV.id)}
                    className="h-[30px] cursor-pointer rounded-lg bg-kory px-3 text-[11.5px] font-bold text-white hover:bg-kory-hover"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="absolute right-4 bottom-4 z-20 flex items-center gap-3.5 rounded-[10px] bg-white/92 px-3.5 py-2.5 text-[11px] text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.12)] backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M8 8 L3.5 2.5 A 7 7 0 0 1 12.5 2.5 Z" fill="#724CF5" fillOpacity="0.4" />
                <circle cx="8" cy="8" r="2" fill="#724CF5" />
              </svg>
              Dirección de vista
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="6" fill="#724CF5" fillOpacity="0.12" stroke="#724CF5" strokeOpacity="0.5" strokeDasharray="3 2.5" />
              </svg>
              Radio de visibilidad
            </span>
          </div>
        </div>
      </div>

      {/* Resumen fijo: alcance del conjunto visible */}
      <div className="hidden items-center gap-5 border-t border-slate-200 bg-white px-5 py-2 text-[11.5px] text-slate-500 md:flex">
        <span>
          Alcance diario del listado:{" "}
          <b className="font-mono text-ink">{fmtMillones(alcanceTotal)}</b> impresiones
        </span>
        {vallas.length > 0 && (
          <span>
            Desde{" "}
            <b className="font-mono text-ink">
              {fmtM(Math.min(...vallas.map((v) => v.precio)))}/día
            </b>
          </span>
        )}
      </div>
    </div>
  );
}
