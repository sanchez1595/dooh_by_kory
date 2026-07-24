# Investigación: cómo mide la competencia DOOH (y la receta para Kory)

Fecha: 2026-07-23 · Fuente maestra: IAB DOOH Measurement Guide (jul 2025) + MRC OOH Standards

## El marco que usa toda la industria (IAB/MRC)

Embudo de impresiones: Location Traffic → Gross Impressions → **OTS (Opportunity to
See, la métrica requerida)** → LTS (Likelihood to See) → Audience Impressions.
Fórmula operativa: **impresiones = ad plays × impression multiplier por hora**,
ajustado por share-of-loop y visibilidad. El MRC exige metodologías auditables,
transparentes y privacy-compliant.

## Por competidor

- **Geopath (EE.UU., la "moneda" OOH):** movilidad móvil anonimizada + conteos DOT
  + censo + eye-tracking (Visibility Adjustment Index). Cuesta USD 2.000–450.000/año
  a media owners (tier pequeño: USD 229/mes) + ~USD 12/cara de onboarding. Solo EE.UU.
- **Vistar:** exige que el multiplicador venga de un **tercero aprobado** (Geopath,
  Quividi, AdMobilize); sin data aprobada, la pantalla opera **1:1**. El owner puede
  subir data propia si Vistar aprueba la metodología.
- **Hivestack (Perion) — el modelo copiable:** multiplicador propio (circulación +
  telco determinístico) **verificado por Nielsen cada 2 meses** (proyectado vs
  observado). Patrón: metodología propia + verificador externo periódico.
- **Place Exchange PerView:** datos determinísticos de móviles en tiempo real,
  alineado a OAAA Guidelines; multiplicadores horarios + reach/frequency.
- **LatinAD + KIDO Dynamics (activo en Colombia):** eventos de red telco (Claro)
  + censo + modelos → audiencia por pantalla/día/hora, alcance, frecuencia, GRP,
  demografía y NSE. Resolución de antena (cientos de metros): sirve para calibrar
  y demografía, NO para conteo fino frente a la pantalla.
- **Cámaras (lo que valida Kory Vision):** Quividi (~90% precisión, edge, no
  almacena video, exporta multiplicadores horarios a Vistar; **Sampling &
  Extrapolation**: cámara solo en muestra representativa + extrapolación
  documentada). AdMobilize (Miami, adquirida por Rokk3r 2021, NO por Vistar):
  conteo vehicular/peatonal, 100% on-device.
- **Atribución:** AdQuick = lift causal (mercados control) + attribution
  device-level + retargeting omnicanal. taptap = footfall attribution (2023,
  geoespacial + determinístico) — el candidato natural en LatAm.

## Privacidad en Colombia (crítico para Kory Vision)

Ley 1581/2012 + doctrina SIC: imagen identificable = dato personal; biometría
facial = **dato sensible con consentimiento expreso → inviable en vía pública**.
Multas hasta 2.000 SMLMV. Arquitectura obligatoria (la de Quividi/AdMobilize):
procesamiento edge, jamás almacenar video/rostros/placas, solo conteos agregados
anónimos, aviso de privacidad publicado, retención cruda ≤30 días, registro de
bases de datos ante la SIC. También es argumento comercial, no solo legal.

## ¿Estándar en Colombia?

**No existe JIC ni certificación DOOH local.** EGM/ACIM mide el medio, no la
pantalla. Referencias a adoptar: **WOO Global Guidelines 2.0 (2026)** + IAB DOOH
Measurement Guide + MRC OOH. iCo Medios + VIOOH (2025) ya transan 72 pantallas
premium con estándares internacionales.

## La receta Kory (implementada en W12 como badges medida/estimada)

1. **Capa 1 — Proof-of-play inviolable (costo ~0, prioridad máxima):** logs por
   play firmados/tamper-evident, API + trazabilidad "del player a la factura".
2. **Capa 2 — Kory Vision como fuente de multiplicadores horarios:** reportar
   **OTS como métrica principal**; sampling & extrapolation por tipología;
   publicar precisión vs conteos manuales; privacidad edge.
3. **Capa 3 — Telco (KIDO, directo o vía partner) para calibrar:** validación
   cruzada cámara↔telco publicada, demografía/NSE, reach & frequency de red.
4. **Regla 1:1 honesta:** pantallas sin medición se declaran "estimadas" (lo que
   hace Vistar; en producto = badge ámbar ◌).
5. **Verificación externa periódica:** replicar Hivestack-Nielsen a escala local
   (auditor/academia cada 3–6 meses) + ISO 27001/SOC 2 a mediano plazo.

**Jugada estratégica:** estructurar multiplicadores en formato bidstream
(export estilo Quividi→Vistar) + taxonomía de venues estándar → el día que
queramos conectar a Vistar/VIOOH, ya cumplimos activación con multiplicador
aprobado.

Fuentes principales: IAB DOOH Measurement Guide 2025, geopath.org,
help.vistarmedia.com (Requirements for Activation), Hivestack+Nielsen
(ExchangeWire 2023), placeexchange.com/perview-sellers, latinad.com (KIDO),
quividi.com, admobilize.com, oaaa.org (proof-of-play), worldooh.org
(Guidelines 2.0), SIC videovigilancia, Ley 1581/2012.
