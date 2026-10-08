# Soporte y check-in semanal

## Qué se reutilizó y por qué no se usó el chat

- **Chat**: `chat_conversations` está atado 1:1 a `trainer_clients`
  (conversación entrenador-cliente). Usarlo para soporte habría mezclado dos
  cosas distintas (y le daría al entrenador acceso a reclamos sobre él), así
  que Soporte tiene sus propias tablas, pero copia el patrón (mensajes con
  autor, Policy, notificación por mensaje).
- **Reportes** (`reports`): son moderación de contenido, no se tocaron.
- **Notificaciones**: se reutiliza todo — tabla `notifications` (feed
  "Novedades"), broadcast (Reverb) y push (Expo / Web Push) mediante el trait
  `App\Notifications\Concerns\SendsInAppAndPush` (mismo `via()` que
  `NewChatMessageNotification`). Las notificaciones nuevas traen
  `title/body/link`; el feed (web y mobile), el service worker y el toque de
  push en mobile abren `link`.
- **Correo**: SMTP + cola existentes (patrón de `NewOrderNotification`).
- **Roles**: no hay rol de soporte — atiende `super_admin`.
- **Scheduler**: comando programado en `bootstrap/app.php`.

## Tablas

| Tabla | Para qué |
|---|---|
| `support_tickets` | Solicitud: tipo, asunto, estado, prioridad, origen (`app`/`weekly_checkin`), responsable, contexto del check-in, marcas de tiempo (primera respuesta, resolución, cierre) para métricas. |
| `support_ticket_messages` | Conversación (usuario / equipo). Sin edición ni borrado. |
| `weekly_checkins` | Un check-in por usuario y semana ISO (índice único `user_id + week`): estado, cómo se sintió, tema, "Ahora no", avisado/mostrado/respondido, contexto (rutina activa, sesiones completadas). |

Todo se borra con la cuenta (FK cascade).

## Solicitudes

Estados: `open → in_review → answered → resolved / closed`.
- Respuesta del equipo → `answered` (+ `first_response_at`), aviso in-app/push
  y correo al usuario.
- Mensaje del usuario sobre una `answered`/`resolved` → vuelve a `open`.
- Pasar a `resolved`/`closed` avisa al usuario; `in_review`, prioridad y
  responsable no (son internos).
- Reclamos entran con prioridad `high`. Avisos al equipo marcan reclamos y
  prioridad alta/urgente; nunca incluyen el texto del mensaje.
- El usuario ve "Equipo SanKen", no el nombre de quien responde.

Endpoints: `GET/POST /support/tickets`, `GET /support/tickets/{id}`,
`POST /support/tickets/{id}/messages`, `POST /support/tickets/{id}/close`;
admin: `GET /admin/support/tickets` (filtros `status` — incluye `awaiting`
= pendientes de respuesta —, `type`, `priority`, `q`, `user`, `from`, `to`),
`GET|PATCH /admin/support/tickets/{id}`, `POST .../messages`,
`GET /admin/support/stats`, `GET /admin/support/staff`.

## Check-in semanal

Reglas en `config/support.php` y `WeeklyCheckinService`:
- Semana ISO en `America/Bogota` (la app no guarda zona por usuario).
- Se ofrece **viernes a domingo** a cuentas con onboarding completo, no
  suspendidas, con ≥ 3 días de antigüedad y que no sean `super_admin`.
- **Al abrir la app** (web: `AppShell`; mobile: layout de pestañas) se consulta
  `GET /support/check-ins/current`, que crea el registro de la semana la
  primera vez y dice si mostrarlo (`should_prompt`).
- **Aviso**: `php artisan support:weekly-checkin-reminders`, programado viernes
  17:00 (Colombia). Idempotente (`notified_at`): nunca avisa dos veces la
  misma semana, ni a quien ya respondió. En este entorno no hay cron: el
  aviso push no sale solo, pero el check-in igual aparece al abrir la app.
- **"Ahora no"**: se vuelve a ofrecer a las 24 h, máximo 2 veces por semana;
  después queda `dismissed`. Se puede responder igual desde Soporte.
- Si el usuario quiere contar algo (duda, reclamo, observación, problema,
  sugerencia), su comentario crea una solicitud (`source=weekly_checkin`) con
  el contexto de la semana.
- **Preparado para rutinas**: `weekly_checkins.mood` + `context` y
  `WeeklyCheckin::scopeAnswered()`. Hoy NO se modifica ninguna rutina.

## Métricas (`SupportStatsCalculator`, datos reales)

Solicitudes por estado, pendientes de respuesta, de esta semana, por tipo,
tiempo promedio de primera respuesta y de resolución (90 días); check-ins de
las últimas 4 semanas (ofrecidos, respondidos, pospuestos, ignorados, tasa de
respuesta), estados de ánimo y temas.

## Textos

`packages/core/src/support/strings.ts` (ES/EN), mismo patrón que los textos
legales (SanKen no tiene i18n global).
