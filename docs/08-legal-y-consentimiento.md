# Documentos legales y consentimiento

Estado: implementación técnica completa. Contenido legal (ES y EN) revisado y
aprobado por el responsable de SanKen: Términos v1.0, Privacidad v1.2 (v1.2: edad
15–70), Cookies v1.1 (v1.1: preferencia "tarjeta de marca" de la app móvil).

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Versión vigente (fuente de verdad del servidor) | `apps/api/config/legal.php` |
| Texto de los documentos (ES referencia, EN revisado) | `packages/core/src/legal/documents/*.ts` |
| Versión mostrada en web/mobile | `packages/core/src/legal/versions.ts` (debe coincidir con `config/legal.php`) |
| Datos del responsable (`null` = "[Pendiente: …]"; hoy todos completos) | `packages/core/src/legal/owner-info.ts` |
| Textos de interfaz (casillas, banner, re-aceptación) ES/EN | `packages/core/src/legal/strings.ts` |
| Modelo de consentimiento de cookies (web) | `packages/core/src/legal/cookies.ts` |
| Registro de consentimientos (append-only) | tabla `user_consents`, modelo `App\Models\UserConsent` |

## Consentimientos por cuenta

Tres casillas separadas, todas obligatorias para crear una cuenta (email o Google):

| Tipo | Documento | Motivo de separarlo |
|---|---|---|
| `terms` | Términos y Condiciones | Contrato de uso. |
| `privacy` | Política de Privacidad | Tratamiento de datos personales. |
| `health_data` | Política de Privacidad | Datos de salud/condición física (peso, medidas, sueño, energía, alimentación) — categoría sensible, autorización específica. |

El backend guarda **la versión vigente según el servidor**, nunca una enviada
por el cliente. `user_consents` no tiene endpoints de edición/borrado y el
modelo lanza excepción en `updating`/`deleting`.

## Bloqueo en el servidor

`App\Http\Middleware\EnsureLegalConsentsAccepted` corre en todo `routes/api.php`:
con consentimientos pendientes, cualquier ruta autenticada responde
`403 consent_required` (exentas: ver `EXEMPT_ROUTES` — leer/aceptar documentos,
`/auth/me`, cerrar sesión y eliminar la cuenta). Web (`LegalConsentGate`) y
mobile (`LegalConsentGuard` en el layout raíz, cubre todas las secciones y
enlaces directos) muestran la re-aceptación; si el 403 llega en mitad de la
sesión, `ApiClient.onConsentRequired` marca `user.pending_consents`.

En tests, `UserFactory` acepta los documentos vigentes por defecto; para
probar cuentas sin consentimientos: `UserFactory::$acceptLegalConsents = false`.

## Eliminación de la propia cuenta

`DELETE /v1/auth/me` (`DeleteOwnAccountAction`): confirmación "ELIMINAR" +
contraseña en cuentas de correo. Borra la fila (todas las FKs a `users` son
cascade/null), los archivos subidos (foto, videos de récords, fotos de
progreso) y el usuario de Firebase si inició sesión con Google (best-effort,
queda en el log si falla). Disponible en Configuración y en la pantalla de
re-aceptación (web y mobile). Un `super_admin` no puede autoeliminarse.

## Publicar una versión nueva de un documento

1. Editar el texto en `packages/core/src/legal/documents/` (ES y EN).
2. Subir `version` y `updatedAt` en `packages/core/src/legal/versions.ts`.
3. Subir la misma `version`/`updated_at` en `apps/api/config/legal.php`.
4. Desplegar backend y clientes juntos. Todo usuario cuya última aceptación
   sea de otra versión queda con `pending_consents` y web/mobile le muestran la
   pantalla de re-aceptación antes de dejarlo usar la app.

Si solo cambia la Política de Cookies, el banner vuelve a aparecer (la elección
guardada es de otra versión) — no afecta a los consentimientos por cuenta.

## Cookies (solo web)

Categorías reales: **Necesarias** (sesión, CSRF, token, carrito, la propia
elección, Firebase temporal, push) y **Preferencias** (tema, tutoriales vistos,
idioma de los documentos). No hay analítica ni marketing: no agregar categorías
sin una tecnología real detrás. La elección se guarda por navegador en
`sanken-cookie-consent` (12 meses o hasta cambiar la política). Sin consentimiento
de preferencias, `preferenceStorage` guarda esas claves solo en memoria.

La app móvil no usa cookies ni tracking: no tiene banner; los documentos son
accesibles desde registro, login y Configuración.

## Pendiente antes de producción

- Completar `LEGAL_OWNER_INFO` (responsable, contacto de privacidad, jurisdicción,
  hosting, proveedor de correo, autoridad de control, plazos, edad mínima).
- Revisión jurídica de los tres documentos y de la traducción al inglés; después
  cambiar `status` a `approved` (core + config).
