import type { Valla } from "@/data/types";
import { fmt, fmtDia, fmtMillones } from "./format";

export const TARIFA_SERVICIO = 0.08;

/** Multiplicador de precio según spots por hora. */
const multSpots: Record<number, number> = { 4: 0.8, 6: 1, 8: 1.25 };

export interface Quote {
  precioEf: number;
  subtotal: number;
  servicio: number;
  total: number;
  impTotales: number;
  cpm: number;
  precioEfF: string;
  subtotalF: string;
  servicioF: string;
  totalF: string;
  impTotalesF: string;
  cpmF: string;
  inicioCorto: string;
  finCorto: string;
  inicioLargo: string;
  finLargo: string;
}

export function getQuote(valla: Valla, dias: number, spots: number, inicioDia: number): Quote {
  const mult = multSpots[spots] ?? 1;
  const precioEf = Math.round((valla.precio * mult) / 1000) * 1000;
  const subtotal = precioEf * dias;
  const servicio = Math.round(subtotal * TARIFA_SERVICIO);
  const total = subtotal + servicio;
  const impTotales = valla.impN * (spots / 6) * dias;
  const cpm = total / (impTotales / 1000);
  const finDia = inicioDia + dias - 1;
  const inicioCorto = fmtDia(inicioDia);
  const finCorto = fmtDia(finDia);
  return {
    precioEf,
    subtotal,
    servicio,
    total,
    impTotales,
    cpm,
    precioEfF: fmt(precioEf),
    subtotalF: fmt(subtotal),
    servicioF: fmt(servicio),
    totalF: fmt(total),
    impTotalesF: fmtMillones(impTotales),
    cpmF: fmt(cpm),
    inicioCorto,
    finCorto,
    inicioLargo: `${inicioCorto} 2026`,
    finLargo: `${finCorto} 2026`,
  };
}
