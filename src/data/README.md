# Data mock — DOOH by Kory

**Toda la data de demostración del frontend vive aquí.** El resto de la app
solo importa desde `@/data` (o `@/data/<módulo>`), nunca define contenido
propio. Así, cuando llegue el backend (previsiblemente Firebase), solo hay
que tocar esta carpeta.

| Archivo | Contenido | Futuro con Firebase |
|---|---|---|
| `types.ts` | Tipos del dominio (Valla, Solicitud, Correo…) | Se conservan |
| `vallas.ts` | Catálogo de pantallas | Colección `vallas` en Firestore |
| `catalogo.ts` | Opciones de búsqueda, specs, disponibilidad, perfil horario | Config + subcolecciones |
| `resenas.ts` | Reseñas de anunciantes | Subcolección `resenas` |
| `dueno.ts` | KPIs, pantallas y solicitudes del dueño | Queries por `ownerId` |
| `campana.ts` | Campaña activa, emisiones, pagos, facturación | Colección `campanas` + Kory Vision |
| `correos.ts` | Plantillas de correos transaccionales | Servicio de email (Functions) |

## Cómo migrar

1. Crear `src/services/` con funciones asíncronas equivalentes
   (`getVallas()`, `getSolicitudes(ownerId)`, …) que lean de Firebase.
2. Sustituir los imports de `@/data` por esas funciones.
3. Borrar esta carpeta (dejando `types.ts`, que puede moverse a `src/types/`).
