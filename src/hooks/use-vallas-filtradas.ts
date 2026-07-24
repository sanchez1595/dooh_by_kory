"use client";

import { useApp } from "@/context/app-context";
import { entornoDe } from "@/data";
import type { TipoValla, Valla } from "@/data/types";
import { useTodasLasVallas } from "./use-vallas";

// El presupuesto ya NO recorta la lista (W17): reencuadra el catálogo en
// "te alcanza / se pasa" desde `lib/ajuste`. Aquí solo viven los filtros
// que sí excluyen: ciudad, tipo y medición.

export interface FiltrosVallas {
  ciudad?: string;
  tipo?: TipoValla | "Todas";
  entorno?: "Todos" | "exterior" | "interior";
  soloVision?: boolean;
}

export function aplicarFiltros(vallas: Valla[], f: FiltrosVallas): Valla[] {
  return vallas.filter(
    (v) =>
      (!f.ciudad || f.ciudad === "Todas" || v.ciudad === f.ciudad) &&
      (!f.tipo || f.tipo === "Todas" || v.tipo === f.tipo) &&
      (!f.entorno || f.entorno === "Todos" || entornoDe(v.tipo) === f.entorno) &&
      (!f.soloVision || v.medicion === "vision"),
  );
}

export function useVallasFiltradas() {
  const { ciudad, cat, soloVision } = useApp();
  const todas = useTodasLasVallas();
  return aplicarFiltros(todas, { ciudad, tipo: cat, soloVision });
}

/**
 * Cuántos resultados dejaría cada opción, calculado sobre los OTROS filtros
 * activos. Hace predecible cada clic y permite deshabilitar las de cero.
 */
export function useConteos() {
  const { ciudad, cat, soloVision } = useApp();
  const todas = useTodasLasVallas();

  const cuenta = (patch: FiltrosVallas) =>
    aplicarFiltros(todas, { ciudad, tipo: cat, soloVision, ...patch }).length;

  return {
    porCiudad: (c: string) => cuenta({ ciudad: c }),
    porTipo: (t: TipoValla | "Todas") => cuenta({ tipo: t }),
    conVision: () => cuenta({ soloVision: true }),
    total: todas.length,
  };
}
