# DOOH by Kory — Auditoría competitiva

Fecha: 2026-07-23 · Estado: análisis, sin cambios aplicados
Competidores auditados: taptap, Displayce, The Trade Desk, LatinAD, Google DV360, Vistar Media, Beeyond, AdQuick

---

## TL;DR

**Ninguno hace "lo mismo" que nosotros.** De los 8, ninguno ofrece hoy en Colombia
un e-commerce donde una pyme vea precios públicos por pantalla, pague con
tarjeta/PSE y lance sola una campaña garantizada en una valla concreta. Seis son
plataformas enterprise para agencias y traders; el único con modelo parecido
(AdQuick) opera desde EE.UU., exige US$25.000 de mínimo en su marketplace y
pivoteó de self-serve a servicio gestionado. **Pero** dos son amenazas reales por
otro flanco (LatinAD por el supply, AdQuick por validación del modelo), y hay
huecos serios en nuestro modelo — sobre todo en medición y en el lado del dueño
de pantalla.

---

## 1. Quién es quién

| Plataforma | Qué es realmente | ¿Self-serve pyme? | ¿Colombia? |
|---|---|---|---|
| The Trade Desk | DSP omnicanal enterprise | No — ~US$100K+/mes o reseller | Solo inventario vía SSPs (~200 pantallas premium) |
| Google DV360 | DSP omnicanal; DOOH solo por deals negociados | No — contratos de 6 cifras o partner (10–25% fee) | JCDecaux/VIOOH en Bogotá (140+ pantallas), iCo Medios (72 en Bogotá/Medellín/Cali) |
| Vistar Media | Full-stack DOOH (DSP+SSP+ad server+Cortex), de T-Mobile (~US$600M) | No — "self-serve" para traders con contrato | Vía partner PRODOOH (México); Colombia solo "en planes" |
| Displayce | DSP DOOH de JCDecaux (2M+ pantallas, 80 países) | No — book a demo | Sin operación local (LatAm: solo São Paulo) |
| taptap (Sonata) | DSP omnicanal con location intelligence | No — managed para marcas grandes (Dior, Adidas) | **Oficina en Bogotá**, pero solo compra inventario ya conectado a Hivestack/Broadsign/VIOOH |
| Beeyond | DSP + servicio consultivo (Chanel, AmEx); US$12.5M levantados | No — formulario → comercial | **Oficina en Bogotá**, demanda pura, sin herramientas de supply |
| LatinAD | **Full-stack LatAm: CMS+SSP+DSP+ad server** (Mendoza, AR) | Parcial — planner abierto pero sin checkout con tarjeta, orientado a agencias | **Oficina en Bogotá**, campañas en Bogotá/Medellín/Cali (Bancolombia, Mastercard) |
| AdQuick | Marketplace OOH de EE.UU. → hoy managed service + SaaS; US$30M + US$20M de OUTFRONT | Parcial — "AdQuick Go" con checkout real, pero EE.UU.-céntrico | En su lista de cobertura, sin operación local ni español |

La comparación mezcla capas del stack: TTD/DV360/taptap/Displayce/Beeyond son
**demanda** (compran impresiones por CPM en subasta para marcas grandes);
LatinAD es **infraestructura**; solo AdQuick es un **marketplace** como el
nuestro.

---

## 2. Hallazgos clave por competidor

### The Trade Desk / DV360 (DSPs omnicanal)
- Compran DOOH vía SSPs: Vistar, Hivestack/Perion, Place Exchange, Broadsign
  Reach, VIOOH, Magnite, Ströer.
- Sin self-serve real: TTD exige ~US$100K+/mes o reseller; DV360 contrato GMP
  de 6 cifras o partner certificado (10–25% del spend).
- DV360: solo deals con Deal ID (sin subasta abierta), creativos solo imagen
  estática/video estándar (sin HTML5 ni dinámicos), medición por
  multiplicadores del publisher.
- En Colombia el inventario programático es poco profundo: ~200 pantallas
  premium documentadas (JCDecaux Bogotá + iCo Medios), concentrado en 3 ciudades.
- **No resuelven para la pyme**: compra garantizada de una pantalla concreta,
  creativo, permisos locales, medición local, soporte en español.

### Vistar Media
- El stack más completo del mercado (DSP+SSP+ad server+Cortex CMS+Adstruc).
  Adquirida por T-Mobile (~US$600M, feb 2025).
- CPM pay-as-you-go, mínimos negociados, sin precios públicos, onboarding por
  contrato comercial.
- LatAm vía PRODOOH (CDMX): México y Brasil activos; Colombia "en planes".

### Displayce
- DSP DOOH pura + DMP; JCDecaux tiene participación mayoritaria (2022).
- Medición con datos móviles (Adsquare): índice por pantalla recalculado cada hora.
- Sin oficina ni operación en Colombia; sesgo a inventario JCDecaux/premium.

### taptap Digital (Sonata)
- DSP+DMP omnicanal (DOOH, CTV, audio, mobile). No posee inventario.
- **Única de las DSP con oficina propia en Bogotá.**
- Atribución de visitas a tienda (footfall) para DOOH desde 2023 — referente.
- No sirve al dueño de pantalla ni al anunciante pequeño.

### LatinAD — la amenaza del supply
- Full-stack: CMS + ad server + SSP + DSP + certificación + medición.
- **CMS gratis hasta 10 pantallas** (corre en Android, Raspberry Pi, Tizen,
  WebOS, Windows, Linux); cobra comisión solo por ventas que ellos generan.
  Así están comprando el supply latinoamericano.
- SSP conectado a 150+ fuentes de demanda (Magnite, Place Exchange, Beeyond,
  Vistar, Hivestack…).
- Medición con KIDO Dynamics (datos telco anonimizados de Claro y otros):
  alcance real, frecuencia, GRP, demografía. **Certificación automática de
  campañas** — el estándar a igualar.
- Debilidades: precios opacos, sin checkout con tarjeta, planner orientado a
  agencias/traders, solo ~US$5M transaccionados acumulados.

### Beeyond
- DSP DOOH + capa managed/curada, HQ Miami, nacida en LatAm. US$12.5M levantados.
- Cifras de inventario infladas por agregación de SSPs de terceros (600K → 1M →
  1.5M → 2.1M pantallas en 18 meses); medición modelada (población sintética).
- Sin herramientas para media owners (solo nicho BrightSign). Sin precios, sin
  onboarding autónomo.

### AdQuick — la validación y la advertencia
- Marketplace OOH de EE.UU. (2016, ~44 empleados, ~US$30M + inversión
  estratégica de hasta US$20M de OUTFRONT en feb 2026).
- **Pivoteó de self-serve puro a managed**: "You get a team, not a tool".
  Monetiza con margen embebido en el precio de medios + SaaS para operadores
  (sales cloud licenciado a OUTFRONT).
- Mínimo US$25.000 en el marketplace; "AdQuick Go" (checkout instantáneo con
  Lamar/OUTFRONT/Clear Channel) lo mitiga pero es producto aparte.
- Medición de referencia: lift causal (mercados control), atribución
  device-level, retargeting omnicanal de audiencias expuestas. Casos: Milo's
  Tea +4.7% ventas, Fabletics 18.9% conversion atribuible.
- Lead-gen brillante: Billboard Cost Calculator y Location Explorer públicos.
- Nuevo: API OOH + **servidor MCP** para que agentes de IA compren campañas
  end-to-end.
- Debilidades: precios opacos (todo gated tras email), cero reviews públicos,
  cifras inconsistentes entre páginas, riesgo de neutralidad por la
  exclusividad con OUTFRONT, sin operación LatAm ni español.

---

## 3. Nuestros diferenciadores (confirmados)

1. **Compra garantizada por pantalla y tiempo.** Todo el mundo programático
   vende impresiones por CPM en subasta. "Esta valla, estas fechas, este
   precio" es inviable en cualquier DSP para una pyme — y es nuestro modelo
   mental ganador.
2. **Precios públicos + checkout real.** Los 8 esconden precios tras "book a
   demo". Nadie en Colombia tiene checkout con tarjeta/PSE. Transparencia =
   diferenciador + arma de marketing/SEO.
3. **Mecánica de confianza tipo Airbnb.** Custodia del pago hasta aprobación en
   24h + reembolso 100% + captura EN VIVO. Nadie aplica mecánicas de e-commerce
   moderno al OOH.
4. **Kory IA para el creativo.** Ningún DSP produce la pieza (DV360 ni siquiera
   acepta HTML5); AdQuick apenas tiene mockups IA tempranos. Para la pyme sin
   diseñador, el creativo es EL bloqueador. Quizás nuestro diferenciador más
   defendible.
5. **Supply invisible para todos.** Las vallas digitales
   independientes/regionales colombianas no conectadas a SSPs no existen para
   ninguna de estas plataformas.
6. **Operación local.** COP, PSE/Nequi, factura DIAN, permisos de publicidad
   exterior visual, soporte en español — explícitamente fuera del alcance de
   los DSPs.

---

## 4. Qué nos falta (por severidad)

1. **Herramientas para el dueño de pantalla — el gap más peligroso.** LatinAD
   regala el CMS y cobra comisión solo por ventas propias. Nosotros solo
   ofrecemos el listing: sin CMS/player (o integración con los existentes), el
   "al aire en 24h" es un proceso manual y no controlamos la promesa central.
2. **Medición creíble y certificable.** Todos usan datos de movilidad/telco.
   Kory Vision (cámara + IA) es diferenciador — censal real vs modelado — pero
   requiere hardware por pantalla, cobertura desigual y cuidado con Habeas
   Data/Ley 1581. Falta la capa complementaria de movilidad y la
   **certificación de emisión como producto formal** (hoy es un toast).
3. **Atribución más allá de impresiones.** AdQuick: lift causal + attribution
   device-level + retargeting. taptap: footfall. Nosotros solo contamos
   vehículos/transeúntes. "¿Cuánta gente vino a mi tienda?" define el LTV.
4. **Compra multi-pantalla real.** Gap A5 ya identificado: los combos de Kory
   IA abren una sola valla. Agencias compran paquetes; el carrito multi-valla
   sube el AOV.
5. **Camino programático futuro.** Nuestro inventario tampoco está conectado a
   demanda global. A mediano plazo, conectar el supply a SSPs daría ocupación
   extra al dueño.
6. **Vallas estáticas.** El nombre "DOOH" nos casa con digital; la mayoría del
   inventario colombiano es estático. Decisión consciente de enfoque, mercado
   que queda sobre la mesa.

---

## 5. Las dos amenazas reales

- **LatinAD** — por el **supply**: si firma a los dueños colombianos con su CMS
  gratis antes que nosotros, nuestro marketplace nace sin pantallas o
  dependiendo de su infraestructura. La carrera es por el dueño de 3–10
  pantallas y se gana con herramientas, no con promesas de demanda.
- **AdQuick** — validación (el modelo marketplace OOH funciona: 10 años,
  OUTFRONT invirtió) y advertencia (el self-serve puro no bastó; pivotearon a
  managed + SaaS de supply). Colombia ya figura en su cobertura, pero sin
  operación local ni español.

---

## 6. Recomendaciones — qué ajustar/iterar del modelo

1. **Ganar la guerra del supply primero.** Adelantar todo lo que enamore al
   dueño: gestión de pantalla, calendario de ocupación, payouts impecables — y
   evaluar un "player/CMS lite" gratis o integración con players existentes.
   Es el foso que LatinAD nos puede cerrar.
2. **Hacer de la certificación un producto, no un toast.** Certificado de
   emisión verificable (con evidencia de Kory Vision) + reporte semanal
   certificado. Es lo que el anunciante usa para justificar la inversión.
3. **Añadir un carril "managed light" sin abandonar el self-serve.** Self-serve
   para el ticket pequeño; "cuéntanos tu meta y te lo armamos" para tickets
   grandes y agencias. Un CTA de cotización no contamina el e-commerce.
4. **Medición híbrida y honesta.** Kory Vision donde haya cámara + datos de
   movilidad (partner tipo KIDO) donde no, con etiqueta clara de "medida" vs
   "estimada". La honestidad metodológica es diferenciador frente a las cifras
   infladas de la competencia.
5. **Combos multi-valla como estrategia, no como fix de UX.** Paquetes por
   objetivo ("domina la Zona T", "ruta Norte") — el formato con que compran
   las agencias.
6. **Precios públicos como arma de adquisición.** Explorador público de
   precios/calculadora de costos (el Billboard Cost Calculator es el mejor
   imán de leads de AdQuick) — nosotros sí podemos mostrar precios reales.
7. **A futuro (no ahora):** conectar supply a SSPs para demanda extra,
   atribución de visitas a tienda, y compra agéntica vía MCP (tendencia que
   AdQuick ya inauguró).

**Nota de naming:** "DOOH" es jerga de industria perfecta para agencias e
inversionistas, pero la pyme busca "valla digital" en Google. Mantener "vallas
digitales" en el lenguaje de la interfaz y el SEO, aunque la marca sea DOOH by
Kory.

---

## Fuentes principales

- TTD/DV360: thetradedesk.com (DOOH), support.google.com/displayvideo
  (answer/12488167), blog.viooh.com (JCDecaux Bogotá), ppc.land (iCo Medios,
  JCDecaux LatAm), performoo.com y dv360.co (mínimos de acceso).
- Vistar: vistarmedia.com (PRODOOH, Brasil), adexchanger.com (adquisición
  T-Mobile), help.vistarmedia.com (onboarding).
- Displayce: displayce.com, jcdecaux.com (alianza), dpaaglobal.com (Adsquare).
- taptap: taptapdigital.com, exchangewire.com (Hivestack, atribución DOOH),
  broadsign.com.
- LatinAD: latinad.com (/ssp, /cms, /dsp, /media-owners, caso Bancolombia,
  alianza KIDO y Vistar), comparasoftware.co.
- Beeyond: beeyondmedia.com, prnewswire.com (seed US$10M), oohtoday.com
  (TrueReach), placeexchange.com, brightsign.beeyondmedia.com.
- AdQuick: adquick.com (/marketplace, /programmatic, /analytics, /media-owners,
  /go, /pro, /api, /ooh-mcp, /billboard-cost), prnewswire.com (Series A y
  OUTFRONT feb 2026), billboardinsider.com (vendor profile), techcrunch.com
  (seed), pitchbook.com.
