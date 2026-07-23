# Vallas by Kory — Análisis de gaps y evaluación heurística UX

Fecha: 2026-07-22 · Base: demo Next.js (8 pantallas) + diseño original `Vallas by Kory.dc.html`

---

## A. Gaps de producto — flujos y pantallas faltantes

### Lado anunciante (comprador)

| # | Gap | Por qué importa | Prioridad |
|---|-----|-----------------|-----------|
| A1 | **Página "Guardados" (favoritos)** | Los corazones funcionan y muestran toast, pero no existe destino donde verlos. Loop abierto (Zeigarnik sin cierre): el usuario invierte intención de compra y la plataforma la pierde. El diseño móvil ya definía el tab "Guardados". | **P0** |
| A2 | **"Mis campañas" (lista + estados)** | Solo existe UNA campaña hardcodeada (VK-2043) y la página está huérfana: no hay entrada en el navbar. El anunciante que ya compró no tiene "hogar". Estados necesarios: en revisión → al aire → finalizada → rechazada. Es la base de la retención y renovación (el LTV vive aquí). | **P0** |
| A3 | **Flujo de rechazo del creativo** | El dueño puede rechazar, pero el anunciante nunca ve las consecuencias: falta correo de rechazo, estado "Rechazada · reembolsada" en Mi campaña, y CTA de re-subir creativo. Sin esto, la promesa "te devolvemos el 100%" no es verificable — es el momento de mayor ansiedad del funnel. | **P1** |
| A4 | **Fechas reales (date-range picker)** | El buscador dice "Fechas de campaña" pero abre 3 duraciones fijas (7/14/30). Mapping roto (Norman): la etiqueta promete fechas, el control entrega duraciones. Además el inicio solo se puede mover desde el calendario del detalle. | **P1** |
| A5 | **Combos multi-valla (carrito ligero)** | Kory IA sugiere "Autopista Norte + Zona T" pero "Ver combinación" abre UNA valla. Promesa rota = erosión de confianza justo donde la IA debía lucirse. Un flujo combo sube el ticket promedio (AOV). | **P1** |
| A6 | **Auth / registro / selección de rol** | El avatar "AR" es un dead end. Para la demo basta un login fake con selector "Anuncio / Tengo pantallas" — además resuelve la confusión de roles (ver D0). | **P1** |
| A7 | **Cancelación** | Se promete "cancela gratis hasta 72 h antes" en checkout, pero no existe ningún botón de cancelar. Promesa sin affordance. | **P2** |
| A8 | **Facturas / documentos** | B2B en Colombia = factura electrónica DIAN. "Descargar certificado" hoy es solo un toast. | P2 (P1 si demo B2B) |
| A9 | Notificaciones (campana), mensajería con dueño, perfil/configuración, búsqueda por texto, comparador | Esperables de marketplace maduro; no bloquean la historia de la demo. | **P2** |

### Lado dueño (vendedor)

| # | Gap | Por qué importa | Prioridad |
|---|-----|-----------------|-----------|
| D0 | **Separación de roles anunciante/dueño** | Hoy el mismo navbar mezcla "Publica tu valla", "Mis vallas" y el avatar de un anunciante. Dos modelos mentales en una sola navegación (Norman: modelo conceptual). Un switch de contexto explícito entre modos limpia todo. | **P1** |
| D1 | **Wizard "Publicar valla" completo** | Es EL flujo del lado supply y hoy es un modal estático con campos no editables. Sin supply creíble no hay marketplace. Wizard de 4 pasos: datos → ubicación → fotos → tarifas/revisión, con preview de la card resultante (reciprocidad: "así se verá tu pantalla"). | **P0** |
| D2 | **Detalle/gestión de MI pantalla** | Las filas de "Mis pantallas" no son clickeables — dead end sobre el activo principal del dueño. Necesita: editar tarifa, bloquear fechas, fotos, pausar. | **P1** |
| D3 | **Ingresos / payouts** | "¿Cómo y cuándo cobro?" es la pregunta #1 de cualquier supply. Falta tabla de payouts + cuenta bancaria. | **P1** |
| D4 | **Calendario de ocupación por pantalla** | El dueño no puede ver qué días están vendidos/libres por pantalla. | **P2** |
| D5 | Tarifa nocturna real, analytics por pantalla, cola de creativos | El botón "Aplicar tarifa nocturna" solo lanza toast sin efecto visible (feedback incompleto). | **P2** |

### Transversal

| # | Gap | Por qué importa | Prioridad |
|---|-----|-----------------|-----------|
| T1 | **Responsive móvil** | El mapa está `hidden` en móvil sin alternativa, las tablas del panel se rompen, y el switcher demo tapa contenido. El diseño original YA define la versión móvil (bottom-nav Explorar/Guardados/Campañas/Perfil). Una demo se enseña desde el teléfono. | **P0** |
| T2 | **Switcher demo tapa contenido** | En Confirmación tapa el botón "Seguir explorando"; en Mapa tapa el hint. Debe ser colapsable/ocultable. | **P0** (fix trivial) |
| T3 | **Estados vacíos / loading / error / 404** | Solo Inicio tiene empty state. Guardados vacío, campañas vacías, 404 con marca — cada uno es una oportunidad de dirigir al happy path. | **P1** |
| T4 | **Accesibilidad** | Botones de ícono sin aria-label (corazón, zoom, cerrar), focus visible inexistente, textos slate-400 con contraste límite. | **P1** |
| T5 | **"Cómo funciona" como página** | Hoy es modal; como página pública gana SEO y sirve de landing para dueños. "Precios" y "Cómo funciona" del footer abren el mismo modal (significantes engañosos). | **P2** |

---

## B. Evaluación heurística por pantalla

### 1 · Inicio
**Bien logrado (no romper):** patrón Z del hero (badge → H1 → subhead → buscador → trust markers); anclaje social "340+ pantallas"; Von Restorff del CTA violeta único; grid de cards con similitud Gestalt perfecta; anclaje de precios (la card de $4.5M hace ver razonable la de $2.85M); empty state con recuperación ("Restablecer filtros").

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| Dropdown "Fechas de campaña" | Etiqueta promete fechas; control entrega duraciones | Norman: mapping | Renombrar a "Duración" o implementar date-range (A4) |
| Botón "Buscar" | Siempre navega a /mapa; la ciudad elegida no cambia el encuadre del mapa | Jakob: expectativa de resultados | Aceptable para demo; anotar que el mapa debería enfocar la ciudad |
| "Ver combinación" (Kory IA) | Abre 1 valla, promete 2 | Confianza / promesa rota | Flujo combo (A5) o copy honesto "Ver Autopista Norte" |
| Corazón en cards | Guarda sin destino visible | Zeigarnik / cierre | Página Guardados + contador en navbar (A1) |
| Chip categoría activa (negro) | El resto del sistema marca selección en violeta | Consistencia | Decisión del diseño original; mantener pero documentar |
| Footer "Precios" | Abre el mismo modal que "Cómo funciona" | Significantes | Sección de precios propia dentro del modal o página (T5) |

### 2 · Mapa
**Bien:** patrón lista+mapa (Jakob: convención de los marketplaces de reserva); pins con precio = información clave a costo cero; hover lista→pin sincronizado (mapping); popup con jerarquía correcta y CTA único.

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| Sin filtros en /mapa | Para cambiar ciudad/presupuesto hay que volver a Inicio | Tesler: la complejidad la paga el usuario | Barra de filtros compacta sobre la lista |
| Resumen "8 pantallas · 12–25 ago · Sin límite" | Parece editable pero no lo es | Affordance falsa | Convertir en chips-filtro clickeables |
| Botones zoom 34px | Por debajo del tap target 44px | Fitts | Subir a 40-44px |
| Mapa en móvil | `hidden md:block` sin alternativa | — | Toggle Lista/Mapa (T1) |
| Geografía ficticia unificada | Bogotá y Medellín en el mismo lienzo | Modelo mental | Aceptable en demo; separar al integrar mapa real |

### 3 · Detalle
**Bien:** booking card sticky con desglose transparente ANTES del CTA (reduce fricción de checkout); "No se cobra hasta que el dueño apruebe" exactamente bajo el botón (mitiga aversión a la pérdida en el momento de decisión); specs en chunks de 6 (Miller); calendario con leyenda y constraints reales (días ocupados tachados + toasts explicativos = excelente Norman).

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| "Ver 12 fotos" → modal de 6 | Números no cuadran | Credibilidad | Igualar (12 tiles o copy "Ver fotos") |
| Tiles de galería secundarios | Área grande no clickeable; solo el botón pequeño abre el modal | Fitts | Toda la tile abre el modal |
| Reseñas | Muestra 2 de 32 sin "Ver todas" | Cierre Gestalt / prueba social | Botón "Ver las 32 reseñas" (modal o página) |
| CPM sin referencia | El móvil del diseño decía "62% bajo el promedio OOH" | Anclaje | Añadir la comparativa al box de impresiones |
| Fin de página | Dead end si no convence | Recuperación | Fila "Pantallas similares" |
| Calendario | Solo mueve inicio; fin depende de duración | Constraints comunicadas | Ya explicado en copy ✓; date-range en A4 lo resuelve de raíz |

### 4 · Checkout
**Bien:** CTA bloqueado CON explicación visible ("Sube tu creativo para continuar") — feedback Norman ejemplar, mejor que un disabled mudo; resumen sticky con desglose; trust markers al pie; simulación de upload con validación de specs (verde) = micro-momento de confianza.

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| Stepper (1 y 2 activos a la vez) | No refleja progreso real; todo vive en una página | Mapping / Zeigarnik | Marcar 1 como ✓ completado, 2 como actual |
| Campos de facturación | Parecen inputs pero son divs inertes | Affordance falsa | Inputs reales editables (aunque no persistan) |
| Fechas/frecuencia no editables aquí | Para cambiar hay que volver al detalle | Fricción | Links "Editar" en el resumen |
| PSE | Seleccionarlo no cambia nada | Feedback | P2: paso simulado de banco |

### 5 · Confirmación
**Bien:** peak-end positivo (check verde + timeline "Qué sigue" que instala el modelo conceptual del proceso y reduce ansiedad post-compra); orden VK-2043 como referencia concreta; jerarquía de 3 CTAs correcta (primario violeta → secundario → terciario).

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| "Seguir explorando" | Tapado por el switcher demo | — | **Bug P0** — switcher colapsable |
| "Hoy, 10:42 am" | Hardcodeado | Credibilidad | Hora actual del sistema |

### 6 · Mi campaña
**Bien:** la captura EN VIVO con el creativo del cliente dentro = la promesa cumplida hecha píxeles (peak emocional del producto); reembolso automático explicado (aversión a la pérdida); certificado = job-to-be-done real ("justificar la inversión ante mi jefe/cliente").

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| Página huérfana | No hay entrada en navbar | Arquitectura de información | Navbar anunciante: "Mis campañas" (A2) |
| "Descargar certificado" | Solo toast, sin PDF/preview | Feedback / expectativa | Vista previa del certificado (modal) |
| Sin CTA de renovar/duplicar | El momento de mayor satisfacción no vende la siguiente campaña | Peak-End | Card "Renueva y asegura tus fechas de sept" cerca del final |
| Métricas vs Panel | 148.960 personas aquí vs 182.430 en panel | Coherencia narrativa | Documentar que son ámbitos distintos o unificar |

### 7 · Panel dueño
**Bien:** aprobar en 1 click + toast con "Deshacer" (recuperación de slips, Norman de libro); KPIs con deltas (feedback); sugerencia IA con beneficio anclado (+$8,2M/mes); neto "para ti" en el modal de solicitud.

| Elemento | Problema | Principio | Recomendación |
|---|---|---|---|
| Roles mezclados en navbar | Anunciante y dueño comparten navegación | Modelo conceptual | Switch de rol (D0) |
| Modal "Publicar valla" | Estático, campos inertes | Core flow no creíble | Wizard completo (D1) |
| Filas "Mis pantallas" | No clickeables | Dead end | Detalle de pantalla (D2) |
| Card solicitud muestra bruto ($43,1M) | El modal muestra neto ($36,7M); al dueño le importa el neto | Claridad / anclaje | Mostrar neto en la card, bruto en tooltip |
| "Aplicar tarifa nocturna" | Toast sin efecto en datos | Feedback incompleto | Actualizar el estado visible (P2) |
| "4 dispositivos en línea" | Una pantalla está en Mantenimiento | Coherencia | "3 en línea · 1 en mantenimiento" |

### 8 · Correos
**Bien:** tono de marca consistente y humano; pills semánticas de estado; estructura idéntica entre correos (similitud).
**Problema:** es un artefacto de diseño, no una pantalla de producto — el switcher la presenta al mismo nivel que las páginas reales (jerarquía de navegación confusa para un stakeholder). Mover a una sección "Demo/Kit" del switcher. Falta el correo #4: "Tu creativo fue rechazado — te devolvimos el 100%" (A3).

---

## C. Roadmap priorizado del happy path

Historia completa a contar: *anunciante descubre → reserva → campaña al aire → renueva* y *dueño publica → aprueba → cobra*.

1. **Fixes inmediatos de credibilidad (P0, horas):** switcher colapsable que no tape contenido; "Ver combinación" honesto; "12 fotos" consistente; stepper de checkout con estado real; neto en cards de solicitud; aria-labels básicos. *Razón: son promesas rotas visibles en los primeros 60 segundos de una demo.*
2. **Guardados + navbar de anunciante con contador (P0):** cierra el loop de favoritos (Zeigarnik) y da a la navegación el modelo Explorar/Guardados/Mis campañas del diseño móvil.
3. **Mis campañas — lista con estados (P0):** en revisión / al aire / rechazada / finalizada. Conecta Confirmación → Mi campaña y le da hogar al anunciante recurrente. Incluye el estado de rechazo con re-subida (A3) y el correo #4.
4. **Wizard "Publicar valla" (P0):** 4 pasos con preview de la card final. Sin esto el lado supply es humo; con esto la demo cierra el círculo del marketplace.
5. **Responsive móvil + bottom-nav (P0/P1):** el diseño ya lo define; toggle Lista/Mapa en /mapa. La demo se muestra en teléfonos.
6. **Detalle/gestión de pantalla del dueño + payouts simple (P1):** las filas del panel dejan de ser dead ends y se responde "¿cómo cobro?".
7. **Rol switch anunciante/dueño + login fake (P1):** limpia el modelo mental de navegación; el login con selector de rol sirve de onboarding.
8. **Renovar campaña (P1, pequeño):** CTA en Mi campaña al 52% de avance — vender la siguiente campaña en el pico de satisfacción (Peak-End).

**Después (P2):** date-range real, combos IA reservables, cancelación, facturas, mensajería, notificaciones, comparador, página pública "Cómo funciona"/Precios.
