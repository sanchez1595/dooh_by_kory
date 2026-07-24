import type { Valla } from "@/data/types";
import { fmtDia } from "./format";

// Disponibilidad y "compra inteligente" (días globales: 1–31 ago, 32–61 sep).
// Con backend, `ocupados` vendrá del calendario real de cada pantalla; la
// interfaz de este módulo se mantiene.

export type Cobertura = "total" | "parcial" | "nula";

export interface Analisis {
  /** Días de la ventana pedida (globales). */
  ventana: number[];
  /** Días libres dentro de la ventana. */
  libres: number[];
  /** Días ya vendidos dentro de la ventana. */
  ocupados: number[];
  cobertura: Cobertura;
  /** Tramos continuos de días libres, para armar relevos. */
  tramosLibres: Array<{ ini: number; fin: number }>;
  /** Tramos continuos de días ocupados (los huecos a cubrir). */
  huecos: Array<{ ini: number; fin: number }>;
}

export function ventanaDias(inicioDia: number, dias: number): number[] {
  return Array.from({ length: dias }, (_, i) => inicioDia + i);
}

function tramos(dias: number[]): Array<{ ini: number; fin: number }> {
  if (dias.length === 0) return [];
  const orden = [...dias].sort((a, b) => a - b);
  const out: Array<{ ini: number; fin: number }> = [{ ini: orden[0], fin: orden[0] }];
  for (let i = 1; i < orden.length; i++) {
    const t = out[out.length - 1];
    if (orden[i] === t.fin + 1) t.fin = orden[i];
    else out.push({ ini: orden[i], fin: orden[i] });
  }
  return out;
}

export function analizar(valla: Valla, inicioDia: number, dias: number): Analisis {
  const ventana = ventanaDias(inicioDia, dias);
  const ocup = new Set(valla.ocupados ?? []);
  const libres = ventana.filter((d) => !ocup.has(d));
  const ocupados = ventana.filter((d) => ocup.has(d));
  const cobertura: Cobertura =
    ocupados.length === 0 ? "total" : libres.length === 0 ? "nula" : "parcial";
  return {
    ventana,
    libres,
    ocupados,
    cobertura,
    tramosLibres: tramos(libres),
    huecos: tramos(ocupados),
  };
}

/** Etiqueta corta para tarjetas: "Libre tus 14 días" / "11 de 14 días". */
export function etiquetaDisponibilidad(a: Analisis): string {
  if (a.cobertura === "total") return `Libre tus ${a.ventana.length} días`;
  if (a.cobertura === "nula") return "Sin días libres en tus fechas";
  return `${a.libres.length} de ${a.ventana.length} días libres`;
}

/** Rango legible de un tramo: "15 ago" o "15–17 ago". */
export function fmtTramo(t: { ini: number; fin: number }): string {
  return t.ini === t.fin ? fmtDia(t.ini) : `${fmtDia(t.ini)} – ${fmtDia(t.fin)}`;
}

export interface Relevo {
  /** Pantalla que cubre los huecos. */
  valla: Valla;
  /** Días que efectivamente cubre (los huecos que tenía libres). */
  cubre: number[];
}

/**
 * Busca una pantalla de la misma ciudad que esté libre en los días que la
 * principal tiene ocupados — para ofrecer cobertura continua por relevo.
 * Elige la que más huecos cubra y, a igualdad, la más barata.
 */
export function sugerirRelevo(
  principal: Valla,
  inicioDia: number,
  dias: number,
  todas: Valla[],
): Relevo | null {
  const a = analizar(principal, inicioDia, dias);
  if (a.cobertura !== "parcial" || a.ocupados.length === 0) return null;
  const huecos = new Set(a.ocupados);

  const candidatas = todas
    .filter((v) => v.id !== principal.id && v.ciudad === principal.ciudad)
    .map((v) => {
      const ocup = new Set(v.ocupados ?? []);
      const cubre = [...huecos].filter((d) => !ocup.has(d));
      return { valla: v, cubre };
    })
    .filter((r) => r.cubre.length > 0)
    .sort((x, y) => y.cubre.length - x.cubre.length || x.valla.precio - y.valla.precio);

  return candidatas[0] ?? null;
}
