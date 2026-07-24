# DOOH by Kory — Wireframes W9–W16: iteración post-auditoría (implementados)

Fecha: 2026-07-23 · Estado: **implementados en la demo** (frontend, data mock)
Wireframes anotados: https://claude.ai/code/artifact/ed4d77c7-aa43-4912-bd71-00cffd868b17
Base: `2026-07-23-auditoria-competitiva.md` + investigaciones de medición y
conectividad (mismo directorio). Continúan la numeración W1–W8 del diseño aprobado.

| W | Propuesta | Gap que cierra | Implementación |
|---|---|---|---|
| W9 | Pestaña **Dispositivos** + Kory Player (vinculación por código, latido, proof-of-play, toggle "Demanda extra" beta) | LatinAD compra supply regalando CMS; sin player el "24 h" es manual. Playbook Blip. | `/panel/pantalla/[id]` pestaña nueva · `src/data/dispositivos.ts` |
| W10 | **Certificado de emisión verificable** (folio, QR, spots emitidos, evidencia con hora) | El certificado era un toast; LatinAD certifica automático. Es el job-to-be-done B2B. | Modal `certificado` en `modals.tsx`, abre desde `/mi-campana` |
| W11 | Carril **"Te la armamos"** (managed light): link terciario en hero + brief 3 pasos + banner en checkout >$20M | Lección AdQuick: el ticket grande necesita humano — sin contaminar el self-serve. | Modal `brief` en `modals.tsx` · hero de `/` · aside en `/checkout` |
| W12 | **Medición honesta**: badge ● Medida·Kory Vision / ◌ Estimada·movilidad + filtro | El detalle decía "Kory Vision" para TODO. Regla 1:1 de Vistar como producto. | `medicion-badge.tsx` · campo `medicion` en `Valla` · detalle, cards y filtro en explorar |
| W13 | **Combos por objetivo** (multi-valla, ahorro anclado, un creativo por Kory IA, política de rechazo parcial) | A5 elevado a estrategia; formato de compra de agencias; AOV 3×. | `/combo/[id]` + sección "Paquetes por objetivo" en `/` · `src/data/combos.ts` |
| W14 | **Calculadora pública de precios** (rango real + histograma, sin registro) | Los 8 competidores esconden precios. SEO: "cuánto cuesta una valla en Bogotá". | `/cuanto-cuesta` · footer "Precios" ya no abre el modal engañoso (T5) |
| W15 | **Kory Embed**: widget de reserva para el sitio del dueño (config + preview vivo + snippet) | **Pionero en la categoría** (validado: no existe en DOOH; patrón Calendly/OwnerRez). | `/panel/widget` + entrada "Widget" en navbar dueño |
| W16 | **White-label** `/para-redes`: tiers Gratis / PRO $390K (recomendado) / White-label + configurador de marca con preview | Jugada "sales cloud" AdQuick→OUTFRONT (US$20M); Canva compró Doohly (US$30M). Cobro estándar: licencia + % transacción. | `/para-redes` · footer "Para redes" |

## Decisiones de diseño transversales

- Un solo CTA violeta por pantalla (Von Restorff); "Te la armamos" es link, el
  asesor en checkout es ghost — el happy path self-serve nunca se secuestra.
- Color semántico reservado al origen del dato: verde=medido, ámbar=estimado
  (consistencia W12 ↔ certificado W10 ↔ combos W13).
- Los flujos nuevos terminan en estados reales, no en toasts sin consecuencia
  (combo → success con política de rechazo parcial; certificado → documento).
- La escalera de supply es un solo sistema: player gratis (W9) → widget (W15) →
  PRO/white-label (W16), cada peldaño reutiliza el anterior.

## Pendiente (fase backend)

Generación real de PDF del certificado, embed.js real servido por CDN, pull API
para CMSs de terceros, datos de movilidad (KIDO) para las pantallas "estimadas",
y multiplicadores horarios en formato bidstream (ver investigación de medición).
