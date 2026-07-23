import { vallas } from "./vallas";
import type { Kpi, MiValla, Payout, Solicitud, VisionStat } from "./types";

// Datos del panel del dueño de pantallas (mock).

export const duenoNombre = "Andrés";

export const kpisBase: Kpi[] = [
  { label: "Ingresos · agosto", valor: "$48,6M", delta: "↑ 18%", vs: "vs julio", dbg: "#E2F7F2", dfg: "#0E9F8A" },
  { label: "Ocupación", valor: "82%", delta: "↑ 6 pts", vs: "vs julio", dbg: "#E2F7F2", dfg: "#0E9F8A" },
  { label: "Impresiones servidas", valor: "8,4M", delta: "↑ 12%", vs: "vs julio", dbg: "#E2F7F2", dfg: "#0E9F8A" },
];

export const visionStats: VisionStat[] = [
  { k: "Personas hoy", v: "182.430", d: "↑ 9% vs ayer", dc: "#0E9F8A" },
  { k: "Vehículos hoy", v: "96.210", d: "↑ 4% vs ayer", dc: "#0E9F8A" },
  { k: "Impresiones certificadas", v: "214K", d: "hoy · en vivo", dc: "#724CF5" },
  { k: "Precisión del modelo", v: "96,4%", d: "auditada · jun 2026", dc: "#64748B" },
];

export const misVallas: MiValla[] = [
  {
    id: "autopista-norte",
    nombre: "Pantalla LED Autopista Norte",
    ciudad: "Bogotá",
    grad: vallas[0].grad,
    estado: "Al aire",
    ebg: "#ECFDF5",
    efg: "#16A34A",
    occ: "94%",
    ingresos: "$21,4M",
    tarifaBase: 2850000,
    tarifaNocturna: null,
    imp: "285K",
  },
  {
    id: "av-nqs",
    nombre: "Mega Pantalla Av. NQS",
    ciudad: "Bogotá",
    grad: vallas[5].grad,
    estado: "Al aire",
    ebg: "#ECFDF5",
    efg: "#16A34A",
    occ: "71%",
    ingresos: "$14,2M",
    tarifaBase: 2400000,
    tarifaNocturna: null,
    imp: "210K",
  },
  {
    id: "zona-t",
    nombre: "Pantalla Zona T",
    ciudad: "Bogotá",
    grad: vallas[3].grad,
    estado: "Solicitud",
    ebg: "#F0EDFF",
    efg: "#724CF5",
    occ: "68%",
    ingresos: "$9,8M",
    tarifaBase: 1900000,
    tarifaNocturna: null,
    imp: "145K",
  },
  {
    id: "centro-mayor",
    nombre: "Pantalla Centro Mayor",
    ciudad: "Bogotá",
    grad: vallas[7].grad,
    estado: "Mantenimiento",
    ebg: "#FFF7ED",
    efg: "#EA580C",
    occ: "40%",
    ingresos: "$3,2M",
    tarifaBase: 1500000,
    tarifaNocturna: null,
    imp: "120K",
  },
];

// Pagos al dueño (mock). Con backend: ledger de payouts + pasarela.
export const proximoPago = { fecha: "1 sep 2026", monto: "$36,7M" };

export const cuentaBancaria = "Bancolombia ahorros ····4421";

export const payouts: Payout[] = [
  {
    id: "VK-2043",
    marca: "Café Andino S.A.S.",
    detalle: "Autopista Norte · 12–25 ago · neto tras 8% Kory",
    estado: "pagado",
    neto: "$36,7M",
    fecha: "26 ago 2026",
  },
  {
    id: "VK-2044",
    marca: "Nequi × Bancolombia",
    detalle: "Av. NQS · 1–30 sep · retenido hasta emisión",
    estado: "custodia",
    neto: "$63,4M",
    fecha: "al finalizar",
  },
  {
    id: "VK-2032",
    marca: "Frutto Snacks",
    detalle: "Autopista Norte · jun 2026",
    estado: "pagado",
    neto: "$28,1M",
    fecha: "2 jul 2026",
  },
  {
    id: "VK-2028",
    marca: "Agencia Piloto Media",
    detalle: "Zona T · may 2026",
    estado: "pagado",
    neto: "$17,6M",
    fecha: "3 jun 2026",
  },
];

export const solicitudes: Solicitud[] = [
  {
    key: "s1",
    ini: "CA",
    av: "linear-gradient(140deg,#9B7BF7,#724CF5)",
    marca: "Café Andino S.A.S.",
    detalle: "Autopista Norte · 12–25 ago",
    monto: "$43,1M",
    freq: "6 spots/hora · 10 s",
    neto: "$36,7M",
    archivo: "spot-cafe-andino.mp4 · 10 s",
  },
  {
    key: "s2",
    ini: "NB",
    av: "linear-gradient(140deg,#38BDF8,#3B82F6)",
    marca: "Nequi × Bancolombia",
    detalle: "Av. NQS · 1–30 sep",
    monto: "$74,4M",
    freq: "8 spots/hora · 10 s",
    neto: "$63,4M",
    archivo: "nequi-sep-1920x960.mp4 · 10 s",
  },
];

export const sugerenciaIA = {
  texto:
    "Tu pantalla de la Av. NQS tiene 40% de espacio libre entre 10 pm y 6 am. Baja la tarifa nocturna a $980.000 y podrías sumar +$8,2M/mes.",
  toast: "Tarifa nocturna aplicada a Av. NQS — $980.000 entre 10 pm y 6 am",
};
