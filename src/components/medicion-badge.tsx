import type { Valla } from "@/data/types";

// Badge de origen del dato de impresiones (W12 — medición honesta).
// Verde ● = medida con cámara Kory Vision; ámbar ◌ = estimada con movilidad.
// El color semántico queda reservado al origen del dato en todo el sistema.

export function MedicionBadge({ valla, compact = false }: { valla: Valla; compact?: boolean }) {
  const medida = valla.medicion === "vision";
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-bold ${
          medida ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FFF7ED] text-[#D97706]"
        }`}
      >
        {medida ? "● Kory Vision" : "◌ Estimada"}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10.5px] font-bold ${
        medida ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FFF7ED] text-[#D97706]"
      }`}
    >
      {medida ? "● Medida · Kory Vision" : "◌ Estimada · movilidad"}
    </span>
  );
}

/** Explicación de metodología en una frase (tooltip/nota bajo la métrica). */
export function medicionNota(valla: Valla): string {
  return valla.medicion === "vision"
    ? "Cámara con IA en la pantalla cuenta vehículos y peatones reales, cada hora. No es una proyección."
    : "Estimación con datos anónimos de movilidad de la zona y aforo vial. Se marca como estimación.";
}
