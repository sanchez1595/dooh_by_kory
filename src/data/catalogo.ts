import type { Ciudad, FotoTile, TipoValla, Valla } from "./types";

// Opciones de búsqueda y configuración de campaña (mock/estático).

export const ciudades: Ciudad[] = ["Todas", "Bogotá", "Medellín"];

export const categorias: Array<TipoValla | "Todas"> = [
  "Todas",
  "LED exterior",
  "Torre digital",
  "LED interior",
];

export const presupuestos = ["$20M", "$50M", "$100M", "Sin límite"] as const;
export type Presupuesto = (typeof presupuestos)[number];

export const presupuestoMax: Record<Presupuesto, number> = {
  "$20M": 20e6,
  "$50M": 50e6,
  "$100M": 100e6,
  "Sin límite": Infinity,
};

export const duraciones = [7, 14, 30] as const;

export const fechasOpts: Array<{ dias: number; label: string }> = [
  { dias: 7, label: "1 semana · 7 días" },
  { dias: 14, label: "2 semanas · 14 días" },
  { dias: 30, label: "1 mes · 30 días" },
];

export const frecuencias: Array<{ spots: number; sub: string }> = [
  { spots: 4, sub: "Ligera" },
  { spots: 6, sub: "Estándar" },
  { spots: 8, sub: "Alta" },
];

export const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

/** Días ocupados del calendario de agosto (mock de disponibilidad). */
export const diasOcupados = new Set([3, 4, 5, 6, 7]);

/** Offset de la cuadrícula: agosto 2026 arranca en sábado (5 celdas vacías). */
export const calendarioOffset = 5;

/** Perfil de audiencia por hora, de 6 am a 11 pm (alturas relativas 0–100). */
export const perfilHorario = [
  18, 26, 42, 66, 88, 72, 54, 48, 52, 58, 64, 70, 92, 100, 86, 60, 38, 22,
];

export function getSpecs(v: Valla): Array<{ k: string; v: string }> {
  return [
    { k: "Tamaño", v: v.dim },
    { k: "Resolución", v: `${v.res} px · P8` },
    { k: "Impresiones", v: `${v.imp} /día` },
    { k: "Brillo", v: "7.500 nits" },
    { k: "Orientación", v: "Doble cara N–S" },
    { k: "Horario", v: "24 / 7" },
  ];
}

export function getFotosTiles(v: Valla): FotoTile[] {
  return [
    { bg: v.grad, label: "Pantalla · frontal" },
    { bg: "linear-gradient(160deg,#E9E6F5,#D9D3EC)", label: "Entorno · día" },
    { bg: "linear-gradient(160deg,#241E3F,#3A3160)", label: "Vista nocturna" },
    { bg: "linear-gradient(160deg,#DDE6EE,#C8D6E4)", label: "Tráfico · hora pico" },
    { bg: "linear-gradient(160deg,#2D1B69,#724CF5)", label: "Ángulo peatonal" },
    { bg: "linear-gradient(160deg,#EFEDE6,#E0DCCE)", label: "Vista aérea · dron" },
    { bg: "linear-gradient(160deg,#1A0A3E,#4C1D95)", label: "Pantalla · detalle" },
    { bg: "linear-gradient(160deg,#D9E2D6,#C4D2C0)", label: "Acceso peatonal" },
    { bg: "linear-gradient(160deg,#11131D,#2D1B69)", label: "Tráfico nocturno" },
    { bg: "linear-gradient(160deg,#E4E0EE,#CFC8E2)", label: "Vista lateral" },
    { bg: "linear-gradient(160deg,#DDE3EA,#CBD4DF)", label: "Contexto vial" },
    { bg: "linear-gradient(160deg,#241E3F,#724CF5)", label: "Entorno · noche" },
  ];
}
