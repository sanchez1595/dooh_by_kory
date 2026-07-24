# Investigación: cómo se conectan las plataformas DOOH a las pantallas + widgets/white-label

Fecha: 2026-07-23

## A. Conexión física a pantallas

### Players/CMS del mercado

| Plataforma | Hardware | ¿Gratis? |
|---|---|---|
| Broadsign Control | Windows, Linux, Android | No (enterprise, ~USD 10–20/pantalla/mes) |
| Signagelive | Tizen, webOS, BrightSign, Windows, Android, ChromeOS | No (~USD 6–12/mes) |
| Yodeck | Raspberry Pi (insignia), Windows, Android, Tizen, webOS | 1 pantalla gratis; ~USD 8/mes |
| **Xibo** | CMS **open source AGPLv3** + players Windows/Linux/Android/webOS/Tizen | Sí (self-hosted ilimitado) |
| **Anthias** (ex Screenly OSE) | Raspberry Pi | Sí, open source |
| **LatinAD** | Windows 7+, Linux, macOS, Android/TV, Raspberry Pi, Tizen, webOS | **Free ≤10 pantallas para siempre**; monetiza por comisión SSP |

Dato clave: los players SMB (Yodeck, Screenly, OptiSigns) son vendor-locked; los
enterprise (Broadsign, Signagelive) y los open source (Xibo, Anthias) sí se integran.

### Flujo técnico programático

DSP → **OpenRTB 2.6** (objeto `dooh`: venue type OpenOOH, orientación, `qty` con
multiplicador de impresiones) → SSP → **VAST adaptado**: el player hace *prefetch*,
cachea el MP4, lo inserta en el content loop y dispara el beacon de impresión
**solo cuando el primer frame se pinta en la pantalla física** (encola offline).

- **Vistar Cortex:** 4 vías — full-stack Cortex, "agent" junto al CMS existente,
  integraciones Broadsign/Ayuda, o **Ad Serving API** (REST: pedir ads, recibir
  respuesta, reportar proof-of-play — 2-3 endpoints).
- **Broadsign Reach:** el player consulta la API en el slot agendado y recibe VAST.
- **VIOOH:** SSP de JCDecaux, integración técnica dedicada (no self-serve).

### Proof-of-play

Logs de playout (pantalla, creativo, timestamp, duración) + beacon VAST. **No hay
estándar único**; mayormente auto-verificado. Verificación independiente emergente:
**Veridooh** (watermarking SmartCreative, partner de AdQuick — antes <5% de campañas
se verificaban), PxlMeter (sensores). Práctica LatAm: screenshots periódicos.

### Cómo lo resuelven los marketplaces sin CMS propio

- **AdQuick:** sin player. El operador trafica el creativo en su CMS → por eso su
  promesa es 48 h. Marketplace = workflow (RFPs, contratos, POP).
- **Blindspot:** "no somos CMS" — **Pull API**: el CMS del operador consulta
  campañas pendientes y las jala al loop. Self-serve por horas, 25.000+ anunciantes.
- **Blip Billboards (el espejo de nuestro modelo):** autoservicio pymes (desde
  ~USD 20/día, pago **por play emitido**), y **regala player + scheduler** al
  operador a cambio de abrir inventario no vendido. Integra Ayuda, Apparatix,
  Watchfire Ignite, Daktronics. El operador conserva 100% de sus clientes directos.
  Datos: 94% de sus 42.000 anunciantes nunca había hecho OOH; vallas maduras ganan
  ~USD 1.100/mes incrementales.

## B. Widgets embebibles y white-label

### Widget embebible

**No existe en DOOH** — ni Blip, ni Blindspot, ni Fliphound, ni DOmedia venden
desde el sitio del operador (todos en su propio dominio). El patrón está probado
en industrias vecinas (Calendly, OwnerRez rentas vacacionales, TripWorks tours).
**Kory Embed (W15) sería pionero en la categoría.**

### White-label

- Broadsign Publish: white-label solo para contenido (no marketplace).
- **AdQuick "sales cloud" → OUTFRONT (feb 2026):** licencia exclusiva 3 años +
  hasta USD 20M de inversión — precedente de que el software de venta para
  operadores es línea de negocio real.
- Taggify (LatAm), DISPL, DOmedia: stack/SaaS al operador, sin producto
  "tu marketplace con tu marca + dominio + checkout" empaquetado.
- **Doohly (Australia) adquirida por Canva por USD 30M** — la capa de
  infraestructura DOOH para operadores es donde se está creando valor.
- Cobro estándar del mercado: **licencia mensual + % por transacción** (lo que
  replica W16).

## Conclusión: roadmap de conectividad Kory (refleja W9)

1. **Fase 1 — Pull API + integración LatinAD + trafficking manual:** vender ya,
   sin tocar hardware ajeno (patrón Blindspot/AdQuick). Riesgo: LatinAD es
   también competidor.
2. **Fase 2 — Kory Player gratis (jugada Blip):** para el operador colombiano sin
   software; base open source posible (Xibo AGPL / Anthias) o player web/Android
   mínimo: loop + caché + proof-of-play + screenshot. Estandariza nuestra evidencia.
3. **Fase 3 — Demanda programática:** implementar patrón Vistar Ad Serving API /
   OpenRTB 2.6 + VAST prefetch (el toggle "Demanda extra" de W9).

Fuentes: docs.broadsign.com, help.vistarmedia.com (Ad Serving API), trillboards.com
(OpenRTB 2.6 deep dive), DMI OpenRTB for pDOOH, seeblindspot.com (network API),
blipbillboards.com (self-serve / sign operators), billboardinsider.com (perfil Blip),
xibosignage GitHub, anthias.screenly.io, latinad.com, viooh.com, veridooh/OOH Today,
investor.outfront.com (AdQuick), contentgrip.com (Canva–Doohly).
