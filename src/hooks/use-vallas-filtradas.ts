"use client";

import { useApp } from "@/context/app-context";
import { entornoDe, presupuestoMax } from "@/data";
import { TARIFA_SERVICIO } from "@/lib/pricing";
import { useTodasLasVallas } from "./use-vallas";

export function useVallasFiltradas() {
  const { ciudad, cat, presupuesto, dias, soloVision, entorno } = useApp();
  const todas = useTodasLasVallas();
  const budget = presupuestoMax[presupuesto];

  return todas.filter(
    (v) =>
      (ciudad === "Todas" || v.ciudad === ciudad) &&
      (cat === "Todas" || v.tipo === cat) &&
      (entorno === "Todos" || entornoDe(v.tipo) === entorno) &&
      (!soloVision || v.medicion === "vision") &&
      v.precio * dias * (1 + TARIFA_SERVICIO) <= budget,
  );
}
