"use client";

import { useApp } from "@/context/app-context";
import { solicitudes } from "@/data";
import type { Solicitud } from "@/data/types";

export interface SolicitudVM extends Solicitud {
  aprobada: boolean;
  rechazada: boolean;
  pendiente: boolean;
  aprobar: () => void;
  rechazar: () => void;
  ver: () => void;
}

export function useSolicitudes() {
  const { aprobadas, rechazadas, set, showToast, openModal } = useApp();

  const lista: SolicitudVM[] = solicitudes.map((s) => {
    const ap = !!aprobadas[s.key];
    const rech = !!rechazadas[s.key];
    return {
      ...s,
      aprobada: ap,
      rechazada: rech,
      pendiente: !ap && !rech,
      ver: () => openModal("solicitud", s.key),
      aprobar: () => {
        set({ aprobadas: { ...aprobadas, [s.key]: true }, modal: null });
        showToast(`Aprobaste la solicitud de ${s.marca} — la marca ya fue notificada`, () => {
          set({ aprobadas: { ...aprobadas, [s.key]: false } });
        });
      },
      rechazar: () => {
        set({ rechazadas: { ...rechazadas, [s.key]: true }, modal: null });
        showToast(`Rechazaste la solicitud de ${s.marca} — recibirá su reembolso completo`, () => {
          set({ rechazadas: { ...rechazadas, [s.key]: false } });
        });
      },
    };
  });

  const resueltas = lista.filter((s) => !s.pendiente).length;
  const pendientes = lista.length - resueltas;

  return { lista, resueltas, pendientes };
}
