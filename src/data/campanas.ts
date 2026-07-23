import type { Campana } from "./types";

// Historial de campañas del anunciante (mock). Con Firebase: colección
// `campanas` filtrada por usuario. El estado puede ser sobreescrito en la
// sesión (p. ej. re-subir creativo pasa "rechazada" → "en-revision").
export const campanas: Campana[] = [
  {
    id: "VK-2043",
    vallaId: 1,
    nombre: "Pantalla LED Autopista Norte",
    fechas: "12 – 25 ago 2026",
    detalle: "6 spots/hora · 52% emitido",
    estado: "al-aire",
    monto: "$43,1M",
  },
  {
    id: "VK-2044",
    vallaId: 4,
    nombre: "Pantalla Zona T",
    fechas: "1 – 7 sep 2026",
    detalle: "Esperando aprobación del dueño · máx. 24 h",
    estado: "en-revision",
    monto: "$14,4M",
  },
  {
    id: "VK-2041",
    vallaId: 7,
    nombre: "Valla Digital Milla de Oro",
    fechas: "20 jul – 2 ago 2026",
    detalle: "Resolución del creativo por debajo de 1440×800 px",
    estado: "rechazada",
    monto: "$30,2M",
    reembolso: "$30,2M",
    motivoRechazo: "Resolución del creativo por debajo de 1440×800 px",
  },
  {
    id: "VK-2032",
    vallaId: 3,
    nombre: "Valla Aeropuerto El Dorado",
    fechas: "1 – 30 jun 2026",
    detalle: "9,6M impresiones certificadas · CPM $15.190",
    estado: "finalizada",
    monto: "$145,8M",
  },
];
