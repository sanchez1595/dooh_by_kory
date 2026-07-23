"use client";

import { useApp } from "@/context/app-context";
import { presupuestoMax } from "@/data";
import { TARIFA_SERVICIO } from "@/lib/pricing";
import { useTodasLasVallas } from "./use-vallas";

export function useVallasFiltradas() {
  const { ciudad, cat, presupuesto, dias } = useApp();
  const todas = useTodasLasVallas();
  const budget = presupuestoMax[presupuesto];

  return todas.filter(
    (v) =>
      (ciudad === "Todas" || v.ciudad === ciudad) &&
      (cat === "Todas" || v.tipo === cat) &&
      v.precio * dias * (1 + TARIFA_SERVICIO) <= budget,
  );
}
