import type { Emision } from "./types";

// Estado de la campaña activa del anunciante (mock).

export const ordenId = "DK-2043";

/** Avance de emisión de la campaña (0–1). */
export const avanceCampana = 0.52;

export const audienciaHoy = {
  personas: "148.960",
  vehiculos: "82.340",
};

export const emisiones: Emision[] = [
  { hora: "3:42 pm", evento: "Spot emitido · 10 s · rotación 6/hora", ver: "Foto + hora" },
  { hora: "3:32 pm", evento: "Spot emitido · 10 s · rotación 6/hora", ver: "Foto + hora" },
  { hora: "3:22 pm", evento: "Spot emitido · 10 s · rotación 6/hora", ver: "Foto + hora" },
  { hora: "3:12 pm", evento: "Spot emitido · 10 s · rotación 6/hora", ver: "Foto + hora" },
];

export const facturacion = {
  razonSocial: "Café Andino S.A.S.",
  nit: "901.482.335-7",
  correo: "pagos@cafeandino.co",
};

export const creativoDemo = {
  archivo: "spot-cafe-andino.mp4",
  detalle: "1920×640 px · 10 s · 8,2 MB · listo para revisión",
};

export const metodosPago = [
  { id: "tarjeta", titulo: "Tarjeta empresarial", sub: "•••• 4421 · Visa" },
  { id: "pse", titulo: "PSE · transferencia bancaria", sub: "Débito desde tu banco" },
] as const;

export const soporteToast =
  "Escríbenos por WhatsApp: +57 300 912 4477 · respondemos en minutos";
