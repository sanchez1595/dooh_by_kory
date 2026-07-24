import type { Dispositivo } from "./types";

// Dispositivos Kory Player vinculados a las pantallas del dueño (mock).
// Con backend: heartbeats reales del player + logs de proof-of-play.

export const dispositivos: Dispositivo[] = [
  {
    pantallaId: "autopista-norte",
    estado: "en-linea",
    detalle: "latido hace 12 s",
    spotsHoy: "4.320",
    version: "v2.1",
  },
  {
    pantallaId: "av-nqs",
    estado: "en-linea",
    detalle: "latido hace 8 s",
    spotsHoy: "3.980",
    version: "v2.1",
  },
  {
    pantallaId: "zona-t",
    estado: "en-linea",
    detalle: "latido hace 31 s",
    spotsHoy: "4.105",
    version: "v2.0",
  },
  {
    pantallaId: "centro-mayor",
    estado: "sin-conexion",
    detalle: "sin conexión hace 2 h",
    spotsHoy: "1.240",
    version: "v2.1",
  },
];

export function getDispositivo(pantallaId: string): Dispositivo | undefined {
  return dispositivos.find((d) => d.pantallaId === pantallaId);
}

/** Plataformas soportadas por Kory Player (se muestran en la vinculación). */
export const playerPlataformas = "Android · Raspberry Pi · Windows";
