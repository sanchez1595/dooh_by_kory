# Vallas by Kory — Diseño: de demo a plataforma completa

Fecha: 2026-07-22 · Estado: **pendiente de aprobación del usuario**
Wireframes interactivos: https://claude.ai/code/artifact/7fbf646c-099e-4701-97aa-cdd081c5ed16
Análisis heurístico completo: `2026-07-22-ux-gap-report.md` (mismo directorio)

## Contexto

La demo frontend (Next.js 16 + Tailwind 4, data mock en `src/data/`) quedó
pixel-perfect contra el prototipo original de Claude Design (verificado
renderizando el `.dc.html` con su runtime y comparando métricas computadas)
y con sus 34 interacciones auditadas. Correcciones aplicadas en la auditoría:

- Fuentes Inter/Geist Mono no cargaban → `@theme inline` para vars de next/font.
- Line-height 1.5 del preflight vs `normal` del diseño → overrides `--text-*--line-height`.
- Buscador a 876×69px (box model del diseño) y margen del botón solo horizontal.
- Footer eliminado de Detalle (el diseño solo lo tiene en Inicio).
- Bug: abrir un segundo dropdown del buscador cerraba ambos (closure stale) → cierre por click-fuera con `data-searchbar`.

## Diseño propuesto (resumen)

Ocho wireframes (W1–W8 en el artifact):

1. **W1 Navegación por rol** — navbar anunciante (Explorar · Mapa · Guardados·n · Mis campañas·n) y navbar dueño (Panel · Mis pantallas · Solicitudes·n · Ingresos) con switch de modo por rol.
2. **W2 Guardados** — grid de favoritas + comparar (máx. 3) + empty state que enseña el gesto.
3. **W3 Mis campañas** — lista con estados: Al aire / En revisión / Rechazada (reembolso visible + re-subir creativo) / Finalizada (CTA Renovar).
4. **W4 Wizard Publicar valla** — 4 pasos (datos → ubicación → fotos → tarifa) con preview viva de la card resultante; al publicar aparece en el grid.
5. **W5 Gestión de pantalla + Ingresos** — tabs Resumen/Tarifas/Disponibilidad/Fotos, pausar reversible; payouts con neto primero y estados en custodia → pagado.
6. **W6 Móvil** — bottom-nav (Explorar · Guardados · Campañas · Perfil, como el diseño original) + toggle Lista/Mapa; targets ≥44px.
7. **W7 Login demo** — selector de rol de 2 opciones, "Quiero anunciar" por defecto, cero campos.
8. **W8 Quick wins** — reseñas "ver todas", pantallas similares + CPM anclado, stepper de checkout honesto, inputs de facturación reales, neto en cards de solicitud, switcher demo colapsable, combo IA honesto, correo #4 (rechazo).

## Decisiones abiertas (bloquean implementación)

1. Navegación de roles: A) switch de modo por rol (recomendado) vs B) navbar mixto ampliado.
2. Fechas del buscador: A) renombrar a "Duración" ahora + date-range en P1 (recomendado) vs B) date-range ya.
3. Alcance: A) Fases 1+2 (recomendado) vs B) solo Fase 1.

## Roadmap

- **Fase 1 (P0):** fixes de credibilidad + Guardados + Mis campañas (con flujo de rechazo y correo #4).
- **Fase 2 (P0):** wizard Publicar valla + responsive móvil/bottom-nav.
- **Fase 3 (P1):** rol switch + login demo, gestión de pantalla + payouts, Renovar, date-range.
- **Fase 4 (P2/backend):** Firebase (Auth/Firestore/Storage/Functions), combos IA, cancelación, facturas, mensajería.

## Restricciones

- Frontend only: toda data nueva se agrega en `src/data/` (tipos en `types.ts`) para la futura migración a Firebase.
- Mantener fidelidad al design system Kory (tokens en `globals.css`).
- No romper las fortalezas señaladas en el reporte (desglose antes del CTA, Deshacer, timeline de confirmación, captura EN VIVO).
