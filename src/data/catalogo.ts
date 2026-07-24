import type { Ciudad, Entorno, FotoTile, TipoValla, Valla } from "./types";

// Opciones de búsqueda y configuración de campaña (mock/estático).

export const ciudades: Ciudad[] = ["Todas", "Bogotá", "Medellín"];

export const categorias: Array<TipoValla | "Todas"> = [
  "Todas",
  "Valla LED",
  "Torre digital",
  "Paradero digital",
  "Centro comercial",
  "Aeropuerto",
  "Estación",
];

/** Entorno derivado del tipo de pantalla (indoor vs outdoor). */
export function entornoDe(tipo: TipoValla): Entorno {
  return tipo === "Centro comercial" || tipo === "Aeropuerto" || tipo === "Estación"
    ? "interior"
    : "exterior";
}

// Un solo control de "tipo de sitio", agrupado por entorno. Tipo y entorno no
// son dimensiones ortogonales (el entorno se deriva del tipo), así que ofrecer
// ambas como filtros producía 6 de 12 cruces vacíos por construcción.
export const gruposTipo: Array<{ entorno: Entorno; label: string; tipos: TipoValla[] }> = [
  {
    entorno: "exterior",
    label: "Al aire libre",
    tipos: ["Valla LED", "Torre digital", "Paradero digital"],
  },
  {
    entorno: "interior",
    label: "Bajo techo",
    tipos: ["Centro comercial", "Aeropuerto", "Estación"],
  },
];

/** Qué gana el anunciante con cada tipo — traduce taxonomía a decisión. */
export const beneficioTipo: Record<TipoValla, string> = {
  "Valla LED": "tráfico vehicular a gran escala",
  "Torre digital": "visible desde varias cuadras",
  "Paradero digital": "gente esperando el bus, la ven ~40 segundos",
  "Centro comercial": "público de compras, alta permanencia",
  "Aeropuerto": "viajeros y ejecutivos, alto poder adquisitivo",
  "Estación": "flujo masivo diario de pasajeros",
};

/** Sin límite se representa con Infinity. */
export const SIN_LIMITE = Infinity;

/** Presets del buscador del inicio (presupuesto total de campaña, COP). */
export const presupuestos: Array<{ valor: number; label: string }> = [
  { valor: 20e6, label: "Hasta $20M" },
  { valor: 50e6, label: "Hasta $50M" },
  { valor: 100e6, label: "Hasta $100M" },
  { valor: SIN_LIMITE, label: "Sin límite" },
];

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
