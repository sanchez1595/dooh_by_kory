import type { Ciudad, Entorno, TipoValla } from "@/data/types";

// Búsqueda inteligente (Kory IA): parsea lenguaje natural a filtros
// estructurados + términos libres. Sin backend: reglas de intención sobre
// el vocabulario del dominio. Con backend, este parser se reemplaza por
// el endpoint de IA manteniendo la interfaz `Busqueda`.

export interface Busqueda {
  ciudad?: Exclude<Ciudad, "Todas">;
  tipo?: TipoValla;
  entorno?: Entorno;
  vision?: boolean;
  /** Tope de precio por día (COP) */
  maxPrecio?: number;
  /** Palabras libres que se buscan en nombre + ubicación */
  terminos: string[];
  /** Etiquetas humanas de lo entendido (feedback) */
  etiquetas: string[];
}

export const sinAcentos = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const STOPWORDS = new Set([
  "las", "los", "que", "con", "por", "para", "una", "uno", "unos", "unas",
  "cerca", "pantalla", "pantallas", "digital", "digitales", "dia", "precio",
  "cop", "desde", "mas", "del", "por", "led",
]);

const TIPOS: Array<[RegExp, TipoValla]> = [
  [/\bparaderos?\b|\bmupis?\b/, "Paradero digital"],
  [/\btorres?\b/, "Torre digital"],
  [/centros? comerciales?|\bmall\b|\bcc\b/, "Centro comercial"],
  [/\baeropuertos?\b/, "Aeropuerto"],
  [/\bestaciones?\b|\bmetro\b|\btransmilenio\b/, "Estación"],
  [/\bvallas?\b/, "Valla LED"],
];

export function parseBusqueda(q: string): Busqueda {
  const b: Busqueda = { terminos: [], etiquetas: [] };
  let t = sinAcentos(q.toLowerCase());

  // Precio: "bajo $2M", "hasta 1,5 millones", "$800k", "menos de 2"
  const precio = t.match(
    /(?:bajo|menos de|hasta|max(?:imo)?|<)?\s*\$\s*?(\d+(?:[.,]\d+)?)\s*(m\b|millones?|k\b|mil\b)?|(?:bajo|menos de|hasta|max(?:imo)?)\s+(\d+(?:[.,]\d+)?)\s*(m\b|millones?|k\b|mil\b)?/,
  );
  if (precio) {
    const bruto = parseFloat((precio[1] ?? precio[3]).replace(",", "."));
    const unidad = precio[2] ?? precio[4];
    const valor = unidad?.startsWith("k") || unidad?.startsWith("mil")
      ? bruto * 1e3
      : unidad
        ? bruto * 1e6
        : bruto < 100
          ? bruto * 1e6
          : bruto;
    if (Number.isFinite(valor) && valor > 0) {
      b.maxPrecio = valor;
      b.etiquetas.push(`hasta $${(valor / 1e6).toFixed(1).replace(".", ",").replace(",0", "")}M/día`);
      t = t.replace(precio[0], " ");
    }
  }

  if (/\bbogota\b/.test(t)) {
    b.ciudad = "Bogotá";
    b.etiquetas.push("Bogotá");
    t = t.replace(/\bbogota\b/g, " ");
  } else if (/\bmedellin\b/.test(t)) {
    b.ciudad = "Medellín";
    b.etiquetas.push("Medellín");
    t = t.replace(/\bmedellin\b/g, " ");
  }

  if (/\binterior(?:es)?\b|\bindoor\b|\badentro\b/.test(t)) {
    b.entorno = "interior";
    b.etiquetas.push("Interior");
    t = t.replace(/\binterior(?:es)?\b|\bindoor\b|\badentro\b/g, " ");
  } else if (/\bexterior(?:es)?\b|\boutdoor\b|\baire libre\b/.test(t)) {
    b.entorno = "exterior";
    b.etiquetas.push("Exterior");
    t = t.replace(/\bexterior(?:es)?\b|\boutdoor\b|\baire libre\b/g, " ");
  }

  for (const [re, tipo] of TIPOS) {
    if (re.test(t)) {
      b.tipo = tipo;
      b.etiquetas.push(tipo);
      t = t.replace(re, " ");
      break;
    }
  }

  if (/kory vision|\bvision\b|\bmedidas?\b|\bcamaras?\b/.test(t)) {
    b.vision = true;
    b.etiquetas.push("● Kory Vision");
    t = t.replace(/kory vision|\bvision\b|\bmedidas?\b|\bcamaras?\b/g, " ");
  }

  b.terminos = t
    .split(/[^a-z0-9ñ]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  b.etiquetas.push(...b.terminos.map((w) => `«${w}»`));

  return b;
}
