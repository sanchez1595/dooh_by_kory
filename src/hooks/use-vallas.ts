"use client";

import { useEffect } from "react";
import { useApp } from "@/context/app-context";
import type { Rol } from "@/context/app-context";
import { getValla, vallas } from "@/data";
import type { Valla } from "@/data/types";

/** Catálogo completo: mock + vallas publicadas en la sesión. */
export function useTodasLasVallas(): Valla[] {
  const { vallasExtra } = useApp();
  return vallasExtra.length ? [...vallas, ...vallasExtra] : vallas;
}

/** Busca una valla por id incluyendo las publicadas en la sesión. */
export function useValla(id: number): Valla {
  const { vallasExtra } = useApp();
  return getValla(id) ?? vallasExtra.find((v) => v.id === id) ?? vallas[0];
}

/** Fuerza el modo (anunciante/dueño) al montar una página de ese contexto. */
export function useRol(rol: Rol) {
  const app = useApp();
  useEffect(() => {
    if (app.rol !== rol) app.set({ rol });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol]);
}
