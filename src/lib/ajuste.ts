import type { Valla } from "@/data/types";
import { TARIFA_SERVICIO } from "./pricing";

// Ajuste presupuestal (W17): el presupuesto no recorta el catálogo, lo
// reencuadra. Cada pantalla responde en la unidad que el usuario entiende
// —días alcanzables— en vez de desaparecer de la lista.

export type EstadoAjuste = "cabe" | "parcial" | "excede";

export interface Ajuste {
  estado: EstadoAjuste;
  /** Días que el presupuesto cubre en esta pantalla (tope: los días pedidos). */
  dias: number;
  /** Costo de la campaña completa pedida, servicio incluido. */
  costoTotal: number;
  /** Solo si excede: cuánto falta para poder emitir al menos un día. */
  faltante: number;
  /** Copy listo para la tarjeta. */
  label: string;
}

export function costoDia(valla: Valla): number {
  return valla.precio * (1 + TARIFA_SERVICIO);
}

export function getAjuste(valla: Valla, diasPedidos: number, presupuesto: number): Ajuste {
  const porDia = costoDia(valla);
  const costoTotal = porDia * diasPedidos;

  if (!Number.isFinite(presupuesto)) {
    return { estado: "cabe", dias: diasPedidos, costoTotal, faltante: 0, label: "Disponible" };
  }
  if (costoTotal <= presupuesto) {
    return {
      estado: "cabe",
      dias: diasPedidos,
      costoTotal,
      faltante: 0,
      label: `Te alcanza los ${diasPedidos} días`,
    };
  }
  const dias = Math.floor(presupuesto / porDia);
  if (dias >= 1) {
    return {
      estado: "parcial",
      dias,
      costoTotal,
      faltante: 0,
      label: `Te alcanza para ${dias} día${dias === 1 ? "" : "s"}`,
    };
  }
  const faltante = porDia - presupuesto;
  return {
    estado: "excede",
    dias: 0,
    costoTotal,
    faltante,
    label: `Te faltarían ${fmtCorto(faltante)}`,
  };
}

/** $1,2M · $350K — abreviatura corta para etiquetas dentro de tarjetas. */
export function fmtCorto(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1).replace(".", ",").replace(",0", "") + "M";
  return "$" + Math.round(n / 1e3) + "K";
}

// Contexto de precio: le enseña al novato a juzgar si un precio es razonable,
// comparándolo contra la mediana de su propio tipo de pantalla (patrón Google
// Flights: bajo / típico / alto respecto del histórico de esa ruta).

export type NivelPrecio = "bajo" | "tipico" | "premium";

export function getNivelPrecio(valla: Valla, universo: Valla[]): NivelPrecio {
  const mismos = universo.filter((v) => v.tipo === valla.tipo).map((v) => v.precio);
  if (mismos.length < 2) return "tipico";
  const ordenados = [...mismos].sort((a, b) => a - b);
  const mediana = ordenados[Math.floor(ordenados.length / 2)];
  if (valla.precio <= mediana * 0.85) return "bajo";
  if (valla.precio >= mediana * 1.25) return "premium";
  return "tipico";
}

export const labelNivel: Record<NivelPrecio, string> = {
  bajo: "Bajo el promedio",
  tipico: "Precio típico",
  premium: "Premium",
};

/** Rango de precio/día donde está el grueso del inventario (frase, no histograma). */
export function rangoTipico(vallas: Valla[]): { min: number; max: number } | null {
  if (vallas.length < 3) return null;
  const p = [...vallas.map((v) => v.precio)].sort((a, b) => a - b);
  const q = (f: number) => p[Math.min(p.length - 1, Math.floor(p.length * f))];
  return { min: q(0.25), max: q(0.75) };
}
