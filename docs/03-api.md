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
| GET | `/challenges/{id}/leaderboard` | Tabla del reto |

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
| POST | `/trainer/clients/{id}/notes` | Nota privada sobre el cliente |
| POST | `/trainer/notifications` | Envía notificación push/in-app a uno o varios clientes |
| GET/POST | `/trainer/conversations/{clientId}/messages` | Chat con cliente (persistencia; envío en vivo por Reverb) |
| POST | `/trainer/media` | Sube video/imagen (S3) para adjuntar a ejercicio o mensaje |

## 12. Nutrición (Fase 2)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/nutrition/targets` | Calorías/macros/agua objetivo (calculados por perfil) |
| POST | `/nutrition/meals` | Registra comida |
| GET | `/nutrition/meals?date=` | Comidas del día |
| GET | `/nutrition/foods?barcode=` | Búsqueda por código de barras |
| GET | `/nutrition/foods?q=` | Búsqueda de alimento por texto |

## 13. IA (Fase 3)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/ai/chat` | Mensaje al asistente (streaming vía SSE/Reverb) |
| POST | `/ai/analyze-technique` | Sube video de una serie para análisis de ejecución |
| GET | `/ai/insights` | Insights proactivos (estancamientos detectados, sugerencias) |

## 14. Panel administrativo

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/users` | Gestión de usuarios (filtros, búsqueda) |
| PATCH | `/admin/users/{id}/ban` | Banear/desbanear |
| GET | `/admin/trainers` | Gestión de entrenadores (verificación) |
| GET | `/admin/exercises` / POST / PATCH / DELETE | CRUD biblioteca de ejercicios |
| GET | `/admin/reports` | Reportes pendientes de moderación |
| PATCH | `/admin/reports/{id}/resolve` | Resuelve un reporte |
| POST | `/admin/news` | Publica noticia/promoción |
| GET | `/admin/stats` | Métricas globales de plataforma (DAU, MAU, retención) |
| GET | `/admin/audit-logs` | Log de auditoría |

## 15. Tiempo real (Laravel Reverb)

| Canal | Evento | Uso |
|---|---|---|
| `private-user.{id}.notifications` | `NotificationSent` | Notificaciones push in-app |
| `private-conversation.{id}` | `MessageSent` | Chat entrenador-cliente |
| `private-user.{id}.workout` | `RoutineRecalculated` | Aviso cuando el motor recalcula tras un fallo |
| `presence-ranking.{category}.{scope}` | `RankingUpdated` | Actualización en vivo de leaderboard (retos) |

## 16. Documentación

- OpenAPI 3.1 generado a partir de anotaciones (`dedoc/scramble` o `l5-swagger`) → publicado en `/docs` (protegido en producción).
- Contract testing con Pest entre backend y clientes vía snapshots de OpenAPI en CI.
- Postman/Insomnia collection exportada automáticamente en cada release del contrato.
