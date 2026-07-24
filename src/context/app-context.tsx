"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { Ciudad, EstadoCampana, TipoValla, Valla } from "@/data/types";
import type { Presupuesto } from "@/data/catalogo";

// Estado global de la demo (filtros, reserva, favoritos, toasts, modales).
// Es estado de UI puro: sobrevive a la navegación entre páginas pero no se
// persiste. Con backend, parte de esto pasará a Firestore/auth.

export type ModalId = "fotos" | "solicitud" | "como" | "resenas" | "brief" | "certificado" | null;

export type Rol = "anunciante" | "dueno";

interface Toast {
  msg: string;
  undo?: () => void;
}

interface AppState {
  rol: Rol;
  ciudad: Ciudad;
  cat: TipoValla | "Todas";
  presupuesto: Presupuesto;
  /** Filtro: solo pantallas con medición Kory Vision */
  soloVision: boolean;
  dias: number;
  spots: number;
  inicioDia: number;
  vallaId: number;
  fav: Record<number, boolean>;
  creativo: boolean;
  pago: string;
  aprobadas: Record<string, boolean>;
  rechazadas: Record<string, boolean>;
  /** Vallas publicadas desde el wizard en esta sesión */
  vallasExtra: Valla[];
  /** Overrides de estado de campañas (p. ej. re-subir creativo) */
  campanaEstados: Record<string, EstadoCampana>;
  /** Ediciones del dueño sobre sus pantallas en la sesión */
  pantallaOverrides: Record<
    string,
    { tarifaBase?: number; tarifaNocturna?: number | null; pausada?: boolean }
  >;
  modal: ModalId;
  solKey: string | null;
  toast: Toast | null;
}

interface AppContextValue extends AppState {
  set: (patch: Partial<AppState>) => void;
  toggleFav: (id: number, nombre: string) => void;
  showToast: (msg: string, undo?: () => void) => void;
  hideToast: () => void;
  openModal: (modal: ModalId, solKey?: string) => void;
  closeModal: () => void;
  resetFiltros: () => void;
  favCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  rol: "anunciante",
  vallasExtra: [],
  campanaEstados: {},
  pantallaOverrides: {},
  ciudad: "Todas",
  cat: "Todas",
  presupuesto: "Sin límite",
  soloVision: false,
  dias: 14,
  spots: 6,
  inicioDia: 12,
  vallaId: 1,
  fav: {},
  creativo: false,
  pago: "tarjeta",
  aprobadas: {},
  rechazadas: {},
  modal: null,
  solKey: null,
  toast: null,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const showToast = useCallback((msg: string, undo?: () => void) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setState((s) => ({ ...s, toast: { msg, undo } }));
    toastTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, toast: null }));
    }, 5000);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setState((s) => ({ ...s, toast: null }));
  }, []);

  const toggleFav = useCallback((id: number, nombre: string) => {
    setState((s) => {
      const nowFav = !s.fav[id];
      return {
        ...s,
        fav: { ...s.fav, [id]: nowFav },
        toast: { msg: nowFav ? `${nombre} guardada en favoritos` : "Quitada de favoritos" },
      };
    });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, toast: null }));
    }, 5000);
  }, []);

  const openModal = useCallback((modal: ModalId, solKey?: string) => {
    setState((s) => ({ ...s, modal, solKey: solKey ?? s.solKey }));
  }, []);

  const closeModal = useCallback(() => {
    setState((s) => ({ ...s, modal: null }));
  }, []);

  const resetFiltros = useCallback(() => {
    setState((s) => ({
      ...s,
      ciudad: "Todas",
      cat: "Todas",
      presupuesto: "Sin límite",
      soloVision: false,
      dias: 14,
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      set,
      toggleFav,
      showToast,
      hideToast,
      openModal,
      closeModal,
      resetFiltros,
      favCount: Object.values(state.fav).filter(Boolean).length,
    }),
    [state, set, toggleFav, showToast, hideToast, openModal, closeModal, resetFiltros],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
