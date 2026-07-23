import type { Correo } from "./types";
import { fmt } from "@/lib/format";

// Correos transaccionales de ejemplo. Con backend, estos se generan
// desde plantillas del servicio de email.

export interface CorreoContext {
  vallaNombre: string;
  inicioCorto: string;
  finCorto: string;
  dias: number;
  spots: number;
  total: number;
  subtotal: number;
  impTotales: number;
}

export function getCorreos(ctx: CorreoContext): Correo[] {
  const netoDueno = Math.round(ctx.subtotal * 0.92);
  const fechas = `${ctx.inicioCorto} – ${ctx.finCorto}`;
  return [
    {
      para: "pagos@cafeandino.co",
      asunto: "¡Recibimos tu solicitud! Ya está en revisión · DK-2043",
      pill: "Solicitud en revisión",
      pillBg: "#F0EDFF",
      pillFg: "#724CF5",
      saludo: "¡Hola, equipo de Café Andino! 👋",
      titulo: "Tu campaña ya está en buenas manos",
      cuerpo:
        "Gracias por confiar en nosotros ✨. Guardamos tu pago de forma segura y el dueño de la pantalla ya está revisando tu creativo. Te escribimos apenas lo apruebe — máximo 24 horas, lo prometemos. Y si algo no sale, te devolvemos el 100%, sin letra pequeña.",
      valla: ctx.vallaNombre,
      fechas: `${fechas} · ${ctx.dias} días`,
      montoLabel: "Total retenido",
      monto: fmt(ctx.total),
      cta: "Ver estado de mi campaña",
      pie: "¿Dudas? Responde este correo o escríbenos por WhatsApp — somos personas reales y contestamos rapidito.",
    },
    {
      para: "andres@mediosnorte.co",
      asunto: `Café Andino quiere tu pantalla ✨ · ${fmt(netoDueno)} para ti`,
      pill: "Acción requerida · 24 h",
      pillBg: "#FFF7ED",
      pillFg: "#EA580C",
      saludo: "¡Hola, Andrés! 👋",
      titulo: "Tienes una nueva solicitud esperándote",
      cuerpo:
        "Café Andino quiere anunciar en tu Pantalla LED Autopista Norte. Dale un vistazo al creativo y apruébalo cuando puedas — responder antes de 24 h mantiene tu pantalla arriba en los resultados de búsqueda.",
      valla: ctx.vallaNombre,
      fechas: `${fechas} · ${ctx.spots} spots/hora`,
      montoLabel: "Ingresos para ti",
      monto: fmt(netoDueno),
      cta: "Revisar creativo",
      pie: "Si algo no encaja, puedes rechazarla sin problema: nosotros nos encargamos de explicárselo a la marca con cariño.",
    },
    {
      para: "pagos@cafeandino.co",
      asunto: "¡Tu anuncio ya está al aire! 🎉 · DK-2043",
      pill: "✓ Campaña activa",
      pillBg: "#ECFDF5",
      pillFg: "#16A34A",
      saludo: "¡Buenas noticias, Café Andino! 🎉",
      titulo: "Tu anuncio ya está brillando en pantalla",
      cuerpo:
        "El dueño aprobó tu creativo y tu spot salió al aire hoy a las 6:00 am. Ya puedes ver las impresiones acumularse en tiempo real, medidas con Kory Vision — nuestra cámara con IA que cuenta vehículos y transeúntes frente a tu pantalla.",
      valla: ctx.vallaNombre,
      fechas: `${fechas} · al aire`,
      montoLabel: "Impresiones estimadas",
      monto: `≈ ${(ctx.impTotales / 1e6).toFixed(1).replace(".", ",")}M`,
      cta: "Ver reporte en vivo",
      pie: "Cada lunes te llega un resumen amigable con tus impresiones y alcance. ¡Que sea una gran campaña!",
    },
    {
      para: "pagos@cafeandino.co",
      asunto: "Tu creativo no fue aprobado — te devolvimos el 100% · DK-2041",
      pill: "Reembolso completado",
      pillBg: "#FEF2F2",
      pillFg: "#B91C1C",
      saludo: "Hola, equipo de Café Andino 💜",
      titulo: "Esta vez no fue, pero tu dinero ya está de vuelta",
      cuerpo:
        "El dueño no aprobó el creativo para esta pantalla: la resolución quedó por debajo de los 1440×800 px que exige el formato. Ya devolvimos el 100% de tu pago a la tarjeta original — sin trámites ni letra pequeña. Ajusta la pieza (o pídele a Kory IA que la genere en la resolución correcta) y vuelve a intentarlo en un click.",
      valla: "Valla Digital Milla de Oro",
      fechas: "20 jul – 2 ago · no emitida",
      montoLabel: "Reembolsado",
      monto: "$30.240.000",
      cta: "Subir nuevo creativo",
      pie: "El reembolso puede tardar 1–3 días hábiles en reflejarse según tu banco. Si necesitas ayuda con la pieza, respóndenos — la revisamos contigo.",
    },
  ];
}
