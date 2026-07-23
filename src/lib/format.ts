/** $1.234.567 — formato COP con puntos de miles. */
export function fmt(n: number): string {
  return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** $2,9M — millones abreviados con coma decimal. */
export function fmtM(n: number): string {
  return "$" + (n / 1e6).toFixed(1).replace(".", ",") + "M";
}

/** 4,1M — millones sin signo pesos. */
export function fmtMillones(n: number): string {
  return (n / 1e6).toFixed(1).replace(".", ",") + "M";
}

/** Día del prototipo → etiqueta corta ("12 ago", "2 sep"). */
export function fmtDia(d: number): string {
  return d <= 31 ? `${d} ago` : `${d - 31} sep`;
}
