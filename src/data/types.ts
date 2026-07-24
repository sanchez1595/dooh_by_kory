// Tipos del dominio. Cuando llegue el backend (Firebase), estos tipos
// se conservan y solo cambia la fuente de los datos.

export type Ciudad = "Todas" | "Bogotá" | "Medellín";

export type TipoValla = "LED exterior" | "Torre digital" | "LED interior";

export interface Valla {
  id: number;
  nombre: string;
  ciudad: Exclude<Ciudad, "Todas">;
  ubicacion: string;
  tipo: TipoValla;
  dim: string;
  res: string;
  imp: string;
  impN: number;
  precio: number;
  rating: string;
  reviews: number;
  grad: string;
  /** Posición del pin en el mapa ilustrativo de SU ciudad (porcentajes) */
  x: string;
  y: string;
  /** "vision" = cámara Kory Vision instalada; ausente = impresiones estimadas con datos de movilidad */
  medicion?: "vision";
  /** Dirección de vista en grados (0 = norte, sentido horario) */
  vista?: number;
  /** Doble cara: la pantalla también se ve hacia la dirección opuesta */
  dobleCara?: boolean;
  /** Radio de visibilidad aproximado en metros */
  alcance?: number;
}

export interface Resena {
  ini: string;
  av: string;
  nombre: string;
  rol: string;
  stars: string;
  texto: string;
}

export interface Kpi {
  label: string;
  valor: string;
  delta: string;
  vs: string;
  dbg: string;
  dfg: string;
}

export interface VisionStat {
  k: string;
  v: string;
  d: string;
  dc: string;
}

export interface MiValla {
  id: string;
  nombre: string;
  ciudad: string;
  grad: string;
  estado: "Al aire" | "Solicitud" | "Mantenimiento" | "Pausada";
  ebg: string;
  efg: string;
  occ: string;
  ingresos: string;
  tarifaBase: number;
  tarifaNocturna: number | null;
  imp: string;
}

export interface Payout {
  id: string;
  marca: string;
  detalle: string;
  estado: "pagado" | "custodia";
  neto: string;
  fecha: string;
}

export interface Solicitud {
  key: string;
  ini: string;
  av: string;
  marca: string;
  detalle: string;
  monto: string;
  freq: string;
  neto: string;
  archivo: string;
}

export interface Emision {
  hora: string;
  evento: string;
  ver: string;
}

export interface FotoTile {
  bg: string;
  label: string;
}

export type EstadoCampana = "al-aire" | "en-revision" | "rechazada" | "finalizada";

export interface Campana {
  id: string;
  vallaId: number;
  nombre: string;
  fechas: string;
  detalle: string;
  estado: EstadoCampana;
  monto: string;
  /** Solo campañas rechazadas */
  reembolso?: string;
  motivoRechazo?: string;
}

export interface Dispositivo {
  /** Coincide con MiValla.id */
  pantallaId: string;
  estado: "en-linea" | "sin-conexion";
  /** "latido hace 12 s" · "sin conexión hace 2 h" */
  detalle: string;
  spotsHoy: string;
  version: string;
}

export interface Combo {
  id: string;
  nombre: string;
  descripcion: string;
  vallaIds: number[];
  /** Descuento del paquete vs comprar por separado (0–1). */
  ahorro: number;
}

export interface Correo {
  para: string;
  asunto: string;
  pill: string;
  pillBg: string;
  pillFg: string;
  saludo: string;
  titulo: string;
  cuerpo: string;
  valla: string;
  fechas: string;
  montoLabel: string;
  monto: string;
  cta: string;
  pie: string;
}
