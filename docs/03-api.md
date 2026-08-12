# SanKen — API REST

## 1. Convenciones generales

- Base URL: `https://api.sanken.app/api/v1`
- Versionado por prefijo de ruta (`/v1`, `/v2`...); nunca breaking changes dentro de una versión.
- Formato: JSON (`Content-Type: application/json`), respuestas envueltas vía **Laravel API Resources**.
- Auth: header `Authorization: Bearer {sanctum_token}` (móvil) o cookies de sesión (SPA web con Sanctum stateful).
- Paginación: cursor-based en listados grandes (historial, feed de rankings), `?cursor=` + `meta.next_cursor`. Paginación clásica (`page`, `per_page`) en listados administrativos pequeños.
- Errores: formato uniforme

```json
{
  "message": "The given data was invalid.",
  "errors": { "email": ["The email field is required."] }
}
```

- Envelope de éxito estándar:

```json
{
  "data": { },
  "meta": { }
}
```

- Rate limiting: `60 req/min` autenticado general, `5 req/min` en `/auth/login` y `/auth/register`, `10 req/min` en endpoints de escritura pesada (generación de rutina).
- Todos los endpoints que devuelven datos de otro usuario respetan `is_public_profile` y las Policies de relación entrenador-cliente.

## 2. Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro (crea `user` con `role=user`) |
| POST | `/auth/login` | Login, devuelve token Sanctum |
| POST | `/auth/logout` | Revoca token actual |
| POST | `/auth/forgot-password` | Envía email de recuperación |
| POST | `/auth/reset-password` | Restablece contraseña |
| POST | `/auth/2fa/enable` | Activa 2FA (devuelve QR/secret) |
| POST | `/auth/2fa/verify` | Verifica código TOTP |
| GET | `/auth/me` | Usuario autenticado + perfil + rol |

## 3. Onboarding

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/onboarding/questions` | Estructura del cuestionario (para render dinámico) |
| POST | `/onboarding` | Envía respuestas completas del onboarding |
| PATCH | `/onboarding` | Actualiza respuestas (antes de completar) |
| POST | `/onboarding/complete` | Marca como completo → dispara `GenerateRoutineAction` (encolado) |

## 4. Motor de rutinas / Rutinas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/routines/active` | Rutina activa del usuario autenticado |
| GET | `/routines/{id}` | Detalle de una rutina (días + ejercicios) |
| POST | `/routines/generate` | Fuerza regeneración del plan (según nuevo onboarding/objetivo) |
| GET | `/routines/{id}/days/{dayId}/next-session` | Próxima sesión sugerida con pesos recalculados (sobrecarga progresiva) |
| POST | `/routines/{id}/days/{dayId}/exercises/{exId}/swap` | Sustituye ejercicio por alternativa equivalente ("gimnasio ocupado") |
| GET | `/routines/{id}/history` | Historial de versiones de la rutina |

## 5. Registro de entrenamiento

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/workout-sessions` | Crea sesión (incluye precheck: sueño, energía, dolor muscular) |
| PATCH | `/workout-sessions/{id}` | Actualiza sesión (duración, notas, `completed`) |
| POST | `/workout-sessions/{id}/exercises` | Agrega ejercicio ejecutado a la sesión |
| POST | `/workout-sessions/{id}/exercises/{weId}/sets` | Registra una serie (peso, reps, RPE) |
| PATCH | `/workout-sets/{id}` | Corrige una serie ya registrada |
| POST | `/workout-sessions/{id}/complete` | Cierra sesión → dispara recálculo de stats, XP, PRs, sobrecarga progresiva |
| POST | `/workout-sessions/{id}/feedback` | Responde "¿Pudiste completar el entrenamiento?" (Sí/No) → recalcula siguiente sesión si es No |
| GET | `/workout-sessions` | Historial paginado |
| GET | `/workout-sessions/{id}` | Detalle completo de una sesión |

## 6. Progreso y estadísticas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/body-measurements` | Registra peso corporal / medidas / foto de progreso |
| GET | `/body-measurements` | Historial de medidas (para gráficas) |
| GET | `/stats/dashboard` | Dashboard agregado: horas, series, toneladas, racha, PRs recientes |
| GET | `/stats/volume?range=weekly\|monthly` | Volumen por grupo muscular en el rango |
| GET | `/stats/personal-records` | Lista de PRs por ejercicio |
| GET | `/stats/progress?metric=weight\|volume\|1rm&exercise_id=` | Serie temporal para gráficas |

## 7. Social / Rankings

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/rankings?category=bench_press&scope=city&city_id=` | Ranking filtrado |
| GET | `/rankings/me` | Posición del usuario autenticado en cada categoría a la que pertenece |
| POST | `/rankings/opt-in` | Acepta participar en rankings públicos |
| POST | `/rankings/opt-out` | Sale de rankings públicos |
| GET | `/challenges` | Retos activos (semanales/mensuales) |
| POST | `/challenges/{id}/join` | Unirse a un reto |
| GET | `/challenges/{id}/leaderboard` | Tabla del reto (foto inicial; ver abajo para las actualizaciones en vivo) |

**Tiempo real (Sprint 10):** el leaderboard de un reto se actualiza en vivo por Reverb — el cliente se suscribe al canal privado `challenges.{id}` (autorizado vía `POST /broadcasting/auth`, mismo Bearer token que el resto de la API) y escucha el evento `progress.updated`, cuyo payload (`{ leaderboard: [...] }`) reemplaza directamente el estado local. Requiere `php artisan reverb:start` corriendo.

## 8. Gamificación

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/gamification/xp` | XP y nivel actual del usuario |
| GET | `/gamification/achievements` | Catálogo de logros + estado (bloqueado/desbloqueado) |
| GET | `/gamification/achievements/mine` | Logros desbloqueados por el usuario |

## 9. Calendario

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/calendar?month=2026-08` | Eventos del mes (planeados, completados, recordatorios) |
| POST | `/calendar/reminders` | Crea recordatorio custom |
| DELETE | `/calendar/reminders/{id}` | Elimina recordatorio |

## 10. Biblioteca de ejercicios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/exercises?muscle=&equipment=&level=&q=` | Búsqueda/filtro de ejercicios |
| GET | `/exercises/{id}` | Detalle: instrucciones, errores comunes, consejos, alternativas, video |
| GET | `/exercises/{id}/alternatives` | Alternativas equivalentes |
| GET | `/muscle-groups` | Catálogo de grupos musculares |

## 11. Módulo Entrenador

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/trainer/clients` | Lista de clientes del entrenador autenticado |
| POST | `/trainer/clients` | Invita/crea un cliente |
| GET | `/trainer/clients/{id}` | Perfil completo del cliente (progreso, rutinas, historial) |
| POST | `/trainer/clients/{id}/routines` | Crea rutina manual para el cliente |
| PATCH | `/trainer/routines/{id}` | Edita rutina (días, ejercicios, series/reps) |
| PATCH | `/trainer/routines/{id}/exercises/{reId}` | Cambia un ejercicio puntual |
| POST | `/trainer/routine-templates` | Crea plantilla reutilizable |
| POST | `/trainer/routine-templates/{id}/duplicate` | Duplica plantilla hacia un cliente |
| GET | `/trainer/clients/{id}/stats` | Estadísticas del cliente |
| POST | `/trainer/clients/{id}/notes` | Nota privada sobre el cliente — **todavía no implementado**, no estaba en el alcance del Sprint 11 |
| POST | `/trainer/media` | Sube video/imagen (S3) para adjuntar a ejercicio o mensaje — **todavía no implementado** |

Chat y notificaciones (antes sketcheados acá como `/trainer/notifications` y
`/trainer/conversations/{clientId}/messages`) se implementaron en el Sprint
11 con nombres distintos, ver §11.1 — no hay un endpoint manual para que el
entrenador dispare una notificación push suelta; toda notificación sale
automáticamente al enviar un mensaje de chat.

## 11.1 Chat y centro de notificaciones (Sprint 11)

Simétrico: mismos endpoints para entrenador y cliente, no viven bajo
`/trainer`. `GET /me/trainers` es la única vía nueva del lado cliente para
ver con quién puede chatear (antes no existía ninguna vista de "mi
entrenador").

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/me/trainers` | Cliente: sus relaciones `trainer_clients` activas, con datos del entrenador |
| GET | `/trainer-clients/{id}/conversation` | Resuelve (o crea) la conversación de esa relación + últimos mensajes |
| GET | `/conversations` | Inbox: todas mis conversaciones, último mensaje + no leídos |
| GET | `/conversations/{id}/messages?before=` | Historial paginado — pedir esto marca como leídos los mensajes ajenos |
| POST | `/conversations/{id}/messages` | Envía un mensaje |
| GET | `/notifications` | Notificaciones paginadas (`meta.unread_count`) |
| POST | `/notifications/{id}/read` | Marca una leída |
| POST | `/notifications/read-all` | Marca todas leídas |
| POST | `/push/expo-token` / DELETE | Registra/desregistra el token de push Expo del device |
| POST | `/push/web-subscription` / DELETE | Registra/desregistra una suscripción de web push |

## 12. Nutrición (Sprint 12)

`/nutrition/targets` da 404 si falta algún dato de perfil/onboarding
necesario (edad, sexo, peso, altura, `frequency_days`, `goals`). `DELETE
/nutrition/meals/{id}` no estaba en el boceto original — deshacer una
comida registrada es UX básica, se agregó igual que las bajas de Sprint 10.
`/nutrition/foods` resuelve contra un caché local (`food_items`) antes de
pegarle a Open Food Facts (ver docs/02 §3, nota Sprint 12).

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/nutrition/targets` | Calorías/proteína/carbos/grasas/agua objetivo (calculados por perfil); 404 si el perfil está incompleto |
| GET | `/nutrition/meals?date=` | Comidas del día (default hoy), con `meta.summary` = totales del día |
| POST | `/nutrition/meals` | Registra una comida (`food_item_id`, `meal_type`, `quantity_grams`, `logged_at?`) |
| DELETE | `/nutrition/meals/{id}` | Elimina una comida registrada (solo el dueño) |
| GET | `/nutrition/foods?barcode=` | Busca un alimento por código de barras (caché local → Open Food Facts) |
| GET | `/nutrition/foods?q=` | Busca alimentos por texto (caché local → Open Food Facts) |

## 13. IA (Fase 3)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/ai/chat` | Mensaje al asistente (streaming vía SSE/Reverb) |
| POST | `/ai/analyze-technique` | Sube video de una serie para análisis de ejecución |
| GET | `/ai/insights` | Insights proactivos (estancamientos detectados, sugerencias) |

## 14. Panel administrativo (Sprint 16)

Todo bajo `/admin/*` exige `role:admin` (mismo mecanismo de middleware que
`role:trainer`, ver §11). Diferencias vs. el boceto original: no hay un
`GET /admin/trainers` separado — la "verificación" de entrenador es un
toggle sobre la misma lista de usuarios (`PATCH
/admin/users/{id}/verify-trainer`); `/admin/exercises` tiene CRUD completo
(el boceto solo mencionaba GET); `/admin/audit-logs` no tiene tabla propia,
lee `activity_log` (Spatie) directo — ver docs/02 §3, nota Sprint 16.
`POST /reports` (fuera de `/admin`, cualquier usuario autenticado) y
`GET /news` (público, lista solo publicadas) tampoco estaban en el boceto
original — son el lado no-admin de reportes/noticias, sin el cual
`/admin/reports` y `/admin/news` no tendrían nada que gestionar.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/users` | Lista de usuarios (`?role=`, `?is_banned=`, `?q=` nombre/correo), paginado |
| PATCH | `/admin/users/{id}/ban` | Banea/desbanea; banear revoca todos los tokens Sanctum activos del usuario |
| PATCH | `/admin/users/{id}/verify-trainer` | Toggle de verificación (solo si `role=trainer`) |
| GET | `/admin/exercises` | Todos los ejercicios (activos e inactivos), + `meta.muscle_groups` para el formulario |
| POST | `/admin/exercises` | Crea un ejercicio |
| PATCH | `/admin/exercises/{id}` | Edita un ejercicio |
| DELETE | `/admin/exercises/{id}` | Desactiva (`is_active=false`), no borra la fila — hay historial real referenciándola |
| GET | `/admin/reports` | Reportes (`?status=pending\|resolved\|dismissed\|all`, default `pending`) |
| PATCH | `/admin/reports/{id}/resolve` | Resuelve/descarta (`status`, `resolution_notes?`) |
| GET | `/admin/news` | Noticias, incluye borradores |
| POST | `/admin/news` | Crea noticia (`published?` — `true` publica de inmediato) |
| PATCH | `/admin/news/{id}` | Edita / publica / despublica |
| DELETE | `/admin/news/{id}` | Borra |
| GET | `/admin/stats` | Métricas globales: `total_users`, `new_users_7d`, `trainers_count`, `banned_users_count`, `pending_reports_count`, `dau`, `wau`, `mau`, `retention_pct` |
| GET | `/admin/audit-logs` | Log de auditoría (paginado, lee `activity_log` de Spatie) |
| POST | `/reports` | Cualquier usuario reporta contenido (`reportable_type` — solo `chat_message` por ahora — `reportable_id`, `reason`, `details?`) |
| GET | `/news` | Noticias publicadas, para cualquier usuario autenticado |

## 15. Tiempo real (Laravel Reverb)

Los nombres de canal/evento reales terminaron distintos a este boceto
original — documentados acá tal como se implementaron (Sprints 10-11), no
como se habían planeado:

| Canal (registrado en `routes/channels.php`, sin prefijo `private-`) | Evento | Uso |
|---|---|---|
| `App.Models.User.{id}` | `BroadcastNotificationCreated` (evento nativo de Laravel, sin `broadcastAs()` propio — suscribirse con `channel.notification(cb)` de Echo, no `.listen()`) | Notificaciones in-app (Sprint 11): nuevo mensaje de chat por ahora, cualquier `Notification` futura que use el canal `broadcast` la reusa gratis |
| `conversations.{id}` | `message.sent` | Chat entrenador-cliente (Sprint 11) |
| `challenges.{id}` | `progress.updated` | Leaderboard en vivo de un reto (Sprint 10) |

`RoutineRecalculated`/`presence-ranking.{category}.{scope}` del boceto
original no se implementaron — el "próximo día" de rutina se resuelve
síncrono en `GET /routines/active` (sin necesidad de push), y el ranking usa
snapshots recalculados por comando (`rankings:recalculate`), no un canal de
presence en vivo.

Todos los canales privados requieren `POST /broadcasting/auth` (autenticado
con el mismo Bearer token que el resto de la API, guard `sanctum` — ver nota
en `config/auth.php` sobre por qué el guard por defecto de la app tuvo que
cambiar de `web` a `sanctum` para que esto funcionara desde el navegador).

## 16. Documentación

- OpenAPI 3.1 generado a partir de anotaciones (`dedoc/scramble` o `l5-swagger`) → publicado en `/docs` (protegido en producción).
- Contract testing con Pest entre backend y clientes vía snapshots de OpenAPI en CI.
- Postman/Insomnia collection exportada automáticamente en cada release del contrato.
