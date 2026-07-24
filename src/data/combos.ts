import type { Combo } from "./types";

// Paquetes multi-pantalla por objetivo (mock). El precio se calcula en
// runtime con getQuote() sobre las vallas del combo, menos el ahorro.

export const combos: Combo[] = [
  {
    id: "norte-bogota",
    nombre: "Domina el norte de Bogotá",
    descripcion: "Autopista Norte + Zona T + NQS: el corredor completo de entrada y salida.",
    vallaIds: [1, 4, 6],
    ahorro: 0.12,
  },
  {
    id: "medellin-completa",
    nombre: "Medellín completa",
    descripcion: "El Poblado, Milla de Oro y el Estadio: las tres audiencias de la ciudad.",
    vallaIds: [2, 7, 5],
    ahorro: 0.1,
  },
  {
    id: "llegadas-bogota",
    nombre: "Bogotá: llegadas + compras",
    descripcion: "El Dorado (llegadas) + Centro Mayor: del aeropuerto al centro comercial.",
    vallaIds: [3, 8],
    ahorro: 0.08,
  },
];

export function getCombo(id: string): Combo | undefined {
  return combos.find((c) => c.id === id);
}
