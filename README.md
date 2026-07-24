# DOOH by Kory

Marketplace para rentar vallas digitales (pantallas LED) por campaña, 100%
online y sin intermediarios. Demo **solo frontend** con Next.js (App Router),
TypeScript y Tailwind CSS 4, a partir del diseño `Vallas by Kory.dc.html`
(Claude Design).

## Correr la demo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. La barra flotante inferior permite saltar entre
todas las pantallas de la demo.

## Pantallas

La app tiene **dos modos** (switch "⇄ Modo dueño" en el navbar)
y es responsive: en móvil navega una bottom-nav.

| Ruta | Pantalla | Modo |
|---|---|---|
| `/` | Inicio · explorar, buscar, combos por objetivo | Anunciante |
| `/mapa` | Mapa con pins y lista (toggle Lista/Mapa en móvil) | Anunciante |
| `/valla/[id]` | Detalle + tarjeta de reserva + medición honesta + similares | Anunciante |
| `/combo/[id]` | Combo multi-pantalla: mapa A·B·C, ahorro, un checkout | Anunciante |
| `/guardados` | Favoritos (corazones) | Anunciante |
| `/checkout` | Confirmación de campaña (creativo, facturación, pago) | Anunciante |
| `/confirmacion` | Solicitud enviada | Anunciante |
| `/mis-campanas` | Historial con estados (al aire / en revisión / rechazada / finalizada) | Anunciante |
| `/mi-campana` | Campaña al aire en vivo + certificado de emisión | Anunciante |
| `/cuanto-cuesta` | Calculadora pública de precios (SEO, sin registro) | — |
| `/para-redes` | B2B: tiers Marketplace / PRO / White-label + preview de marca | — |
| `/panel` | Dashboard del dueño de pantallas | Dueño |
| `/panel/pantalla/[id]` | Gestión de pantalla (tarifas, disponibilidad, fotos, dispositivos) | Dueño |
| `/panel/ingresos` | Payouts: próximo pago, historial, cuenta | Dueño |
| `/panel/widget` | Kory Embed: widget de reserva para el sitio del dueño | Dueño |
| `/publicar` | Wizard de publicación (4 pasos, preview viva) | Dueño |
| `/entrar` | Selector de rol (login de demo) | — |
| `/correos` | Kit: previews de correos transaccionales | — |

Documentación de producto: `docs/superpowers/specs/` (auditoría UX, gaps,
wireframes aprobados y plan de fases).

## Arquitectura

- **`src/data/`** — ⚠️ TODA la data mock vive aquí (ver su `README.md`).
  El backend está pendiente (previsiblemente Firebase); para conectarlo solo
  hay que reemplazar esta carpeta por servicios reales.
- `src/lib/` — formato de moneda/fechas y cálculo de cotizaciones (precio
  efectivo por frecuencia, servicio 8%, impresiones, CPM).
- `src/context/app-context.tsx` — estado de UI de la demo (filtros, reserva,
  favoritos, toasts, modales).
- `src/components/` — navbar, footer, buscador, tarjetas, modales, toast y el
  navegador de pantallas de la demo (`demo-switcher.tsx`, quitar en producción).
- `src/app/` — páginas (App Router).

## Pendiente (fase backend)

- Firebase: Auth, Firestore (vallas, campañas, solicitudes), Storage
  (creativos) y Functions (correos, pagos).
- Mapa real (Google Maps / Mapbox) en `/mapa`.
- Pasarela de pagos (tarjeta / PSE).
