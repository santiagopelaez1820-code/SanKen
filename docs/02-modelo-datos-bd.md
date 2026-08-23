# SanKen — Modelo de Datos y Base de Datos

Motor: **MySQL 8**, InnoDB, `utf8mb4`. Todas las tablas con `id BIGINT UNSIGNED AUTO_INCREMENT`, `created_at`, `updated_at`, y `deleted_at` (soft deletes) donde aplique borrado lógico. Claves foráneas con `ON DELETE RESTRICT` salvo que se indique lo contrario.

## 1. ERD — núcleo (Identidad, Onboarding, Entrenador-Cliente)

```mermaid
erDiagram
    USERS ||--o| USER_PROFILES : has
    USERS ||--o| ONBOARDING_RESPONSES : has
    USERS ||--o{ TRAINER_CLIENTS : "trainer_id"
    USERS ||--o{ TRAINER_CLIENTS : "client_id"
    USERS ||--o{ GYM_MEMBERSHIPS : has
    GYMS ||--o{ GYM_MEMBERSHIPS : has
    COUNTRIES ||--o{ CITIES : has
    USERS }o--|| CITIES : "lives_in"
    USERS ||--o{ SUBSCRIPTIONS : has

    USERS {
        bigint id PK
        string name
        string email UK
        string phone
        string password_hash
        enum role "user|trainer|admin"
        boolean two_factor_enabled
        boolean is_public_profile
        boolean is_banned
        timestamp last_active_at "Sprint 16 — alimenta DAU/WAU/MAU, sin tabla de eventos"
        timestamp trainer_verified_at "Sprint 16 — toggle manual de admin, solo relevante si role=trainer"
        timestamp email_verified_at
        timestamp created_at
    }
    USER_PROFILES {
        bigint id PK
        bigint user_id FK
        int age
        enum sex "male|female"
        decimal height_cm
        decimal weight_kg
        bigint city_id FK
        bigint gym_id FK
        string avatar_url
        text bio
    }
    ONBOARDING_RESPONSES {
        bigint id PK
        bigint user_id FK
        enum level "beginner|intermediate|advanced"
        json goals
        int frequency_days
        int session_minutes
        enum place "home|gym"
        json equipment_available
        json injuries
        text experience_notes
        boolean completed
        timestamp completed_at
    }
    TRAINER_CLIENTS {
        bigint id PK
        bigint trainer_id FK
        bigint client_id FK
        enum status "pending|active|paused|ended"
        timestamp started_at
        timestamp ended_at
    }
    GYMS {
        bigint id PK
        string name
        bigint city_id FK
        string address
        boolean verified
    }
```

## 2. ERD — Motor de rutinas y ejecución de entrenamientos

```mermaid
erDiagram
    USERS ||--o{ ROUTINES : owns
    ROUTINES ||--o{ ROUTINE_DAYS : has
    ROUTINE_DAYS ||--o{ ROUTINE_EXERCISES : has
    EXERCISES ||--o{ ROUTINE_EXERCISES : "used in"
    MUSCLE_GROUPS ||--o{ EXERCISES : "primary_muscle"
    MUSCLE_GROUPS ||--o{ EXERCISE_SECONDARY_MUSCLES : has
    EXERCISES ||--o{ EXERCISE_SECONDARY_MUSCLES : has
    EXERCISES ||--o{ EXERCISE_ALTERNATIVES : "alternative_for"

    USERS ||--o{ WORKOUT_SESSIONS : logs
    ROUTINE_DAYS ||--o{ WORKOUT_SESSIONS : "based_on"
    WORKOUT_SESSIONS ||--o{ WORKOUT_EXERCISES : has
    WORKOUT_EXERCISES ||--o{ WORKOUT_SETS : has
    EXERCISES ||--o{ WORKOUT_EXERCISES : "performed"

    USERS ||--o{ PERSONAL_RECORDS : achieves
    EXERCISES ||--o{ PERSONAL_RECORDS : "for exercise"

    ROUTINES {
        bigint id PK
        bigint user_id FK
        bigint created_by_trainer_id FK "nullable"
        enum source "engine|trainer"
        enum goal
        enum split_type "PPL|upper_lower|full_body|bro_split"
        int frequency_days
        int duration_weeks
        boolean is_active
        timestamp starts_at
        timestamp ends_at
    }
    ROUTINE_DAYS {
        bigint id PK
        bigint routine_id FK
        int day_order
        string label "Push|Pull|Legs|..."
        json target_muscle_groups
    }
    ROUTINE_EXERCISES {
        bigint id PK
        bigint routine_day_id FK
        bigint exercise_id FK
        int order
        int target_sets
        string target_reps "ej 8-10"
        int rest_seconds
        decimal target_rpe
        decimal suggested_weight_kg
    }
    EXERCISES {
        bigint id PK
        string name
        bigint primary_muscle_id FK
        enum equipment
        enum level "beginner|intermediate|advanced"
        enum type "compound|isolation|cardio|mobility"
        text instructions
        text common_mistakes
        text tips
        string video_url
        string image_url
        boolean is_active
    }
    WORKOUT_SESSIONS {
        bigint id PK
        bigint user_id FK
        bigint routine_day_id FK "nullable"
        date performed_at
        int duration_minutes
        boolean completed
        int sleep_quality "1-5, fatiga precheck"
        int energy_level "1-5"
        int muscle_soreness "1-5"
        text notes
    }
    WORKOUT_EXERCISES {
        bigint id PK
        bigint workout_session_id FK
        bigint exercise_id FK
        int order
        boolean all_sets_completed
    }
    WORKOUT_SETS {
        bigint id PK
        bigint workout_exercise_id FK
        int set_number
        decimal weight_kg
        int reps
        decimal rpe
        boolean is_warmup
        boolean completed
    }
    PERSONAL_RECORDS {
        bigint id PK
        bigint user_id FK
        bigint exercise_id FK
        enum record_type "1rm|max_reps|max_volume"
        decimal value
        date achieved_at
        bigint workout_set_id FK
    }
```

## 3. ERD — Progreso, Estadísticas, Social, Gamificación

```mermaid
erDiagram
    USERS ||--o{ BODY_MEASUREMENTS : logs
    USERS ||--o{ USER_STATS_DAILY : has
    USERS ||--o{ USER_XP : has
    USERS ||--o{ USER_ACHIEVEMENTS : earns
    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : "unlocked by"
    USERS ||--o{ RANKING_SNAPSHOTS : "appears in"
    USERS ||--o{ CHALLENGE_PARTICIPANTS : joins
    CHALLENGES ||--o{ CHALLENGE_PARTICIPANTS : has
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ CALENDAR_REMINDERS : has
    TRAINER_CLIENTS ||--o| CHAT_CONVERSATIONS : has
    CHAT_CONVERSATIONS ||--o{ CHAT_MESSAGES : contains
    USERS ||--o{ CHAT_MESSAGES : sends
    USERS ||--o{ PUSH_DEVICE_TOKENS : registers
    USERS ||--o{ PUSH_SUBSCRIPTIONS : registers
    USERS ||--o{ MEAL_LOGS : logs
    FOOD_ITEMS ||--o{ MEAL_LOGS : "logged as"
    USERS ||--o{ REPORTS : "reporter_id"
    USERS ||--o{ REPORTS : "resolved_by"
    USERS ||--o{ NEWS_PROMOTIONS : "admin_id"

    BODY_MEASUREMENTS {
        bigint id PK
        bigint user_id FK
        date measured_at
        decimal weight_kg
        decimal body_fat_pct
        decimal chest_cm
        decimal waist_cm
        decimal hip_cm
        decimal arm_cm
        decimal thigh_cm
        string progress_photo_url
    }
    USER_STATS_DAILY {
        bigint id PK
        bigint user_id FK
        date stat_date
        int workouts_count
        int total_sets
        decimal total_volume_kg
        int training_minutes
        int current_streak_days
    }
    USER_XP {
        bigint id PK
        bigint user_id FK
        int total_xp
        int current_level
        timestamp last_xp_at
    }
    ACHIEVEMENTS {
        bigint id PK
        string code UK
        string name
        text description
        string icon_url
        enum tier "bronze|silver|gold|diamond"
        json unlock_criteria
    }
    USER_ACHIEVEMENTS {
        bigint id PK
        bigint user_id FK
        bigint achievement_id FK
        timestamp unlocked_at
    }
    RANKING_SNAPSHOTS {
        bigint id PK
        bigint user_id FK
        enum category "bench_press|squat|deadlift|pullups|consistency|volume|..."
        enum scope "global|country|city|gym|age_group|sex"
        decimal value
        int rank_position
        date snapshot_date
    }
    CHALLENGES {
        bigint id PK
        string code "identifica la plantilla de origen (ChallengeCatalog), para generación idempotente — no está en el diseño original"
        string title
        text description
        enum type "weekly|monthly"
        json criteria
        date starts_at
        date ends_at
    }
    CHALLENGE_PARTICIPANTS {
        bigint id PK
        bigint challenge_id FK
        bigint user_id FK
        decimal progress_value
        boolean completed
    }
    NOTIFICATIONS {
        char id PK "uuid"
        string notifiable_type "siempre App.Models.User por ahora"
        bigint notifiable_id
        string type "clase de Notification, ej. NewChatMessageNotification"
        json data
        timestamp read_at
    }
    CALENDAR_REMINDERS {
        bigint id PK
        bigint user_id FK
        date event_date
        string title
        text notes "nullable"
    }
    CHAT_CONVERSATIONS {
        bigint id PK
        bigint trainer_client_id FK UK "una conversación por relación entrenador-cliente"
    }
    CHAT_MESSAGES {
        bigint id PK
        bigint conversation_id FK
        bigint sender_id FK "users"
        text body
        timestamp read_at "nullable; se marca al pedir GET /conversations/{id}/messages"
    }
    PUSH_DEVICE_TOKENS {
        bigint id PK
        bigint user_id FK
        string token UK "token de push de Expo"
        string platform "expo"
    }
    PUSH_SUBSCRIPTIONS {
        bigint id PK
        bigint user_id FK
        string endpoint UK "endpoint de push del navegador"
        string public_key "keys.p256dh de PushSubscription.toJSON()"
        string auth_token "keys.auth de PushSubscription.toJSON()"
    }
    FOOD_ITEMS {
        bigint id PK
        string barcode UK "nullable — único solo cuando no es null"
        string name
        string brand "nullable"
        decimal calories_per_100g
        decimal protein_per_100g
        decimal carbs_per_100g
        decimal fat_per_100g
        string source "open_food_facts|manual"
        string source_id "nullable"
    }
    MEAL_LOGS {
        bigint id PK
        bigint user_id FK
        bigint food_item_id FK
        enum meal_type "breakfast|lunch|dinner|snack"
        decimal quantity_grams
        date logged_at
    }
    REPORTS {
        bigint id PK
        bigint reporter_id FK
        string reportable_type "morph — solo chat_message por ahora"
        bigint reportable_id
        string reason "abuse|spam|inappropriate_content|other"
        text details "nullable"
        string status "pending|resolved|dismissed"
        bigint resolved_by FK "nullable"
        timestamp resolved_at "nullable"
        text resolution_notes "nullable"
    }
    NEWS_PROMOTIONS {
        bigint id PK
        bigint admin_id FK
        string title
        text body
        string image_url "nullable"
        timestamp published_at "nullable — null = borrador"
    }
```

Nota (Sprint 10): `CALENDAR_REMINDERS` reemplaza el `CALENDAR_EVENTS` genérico
del diseño original — solo los recordatorios creados a mano necesitan
persistencia. "Completados" y "planeados" se arman al leer directo de
`WORKOUT_SESSIONS`/`ROUTINE_DAYS`, sin duplicar datos: las rutinas no tienen
un día de la semana fijo (rotan por sesiones completadas, ver
`DetermineNextRoutineDayAction`), así que "planeado" es solo el entrenamiento
sugerido de hoy — no hay proyección de una semana completa hacia adelante.

Nota (Sprint 11): `NOTIFICATIONS` ya no es el boceto original
(`user_id`/`type`/`data`/`read_at`) — se implementó con la tabla estándar de
Laravel (`notifiable_type`/`notifiable_id` polimórfico, `id` uuid), reusando
el sistema de Notifications ya presente en `User` (usado hasta ahora solo
para verificación de email). `chat_conversations`/`chat_messages`/
`push_device_tokens`/`push_subscriptions` no tenían diseño de columnas en el
boceto original (solo una fila de una línea en la tabla de soporte más
abajo) — este sprint es el que efectivamente los diseñó.

Nota (Sprint 12): `food_items` hace también de `barcode_cache` que el boceto
original mencionaba como tabla separada — un lookup (por barcode o texto)
revisa primero `food_items` y solo llama a Open Food Facts en un miss,
cacheando el resultado. `meal_type` es un campo nuevo, no estaba en el
boceto original, pero un diario de comidas sin agrupar por desayuno/almuerzo/
cena/snack es un vacío de UX poco común — se agregó deliberadamente.

Nota (Sprint 16): **no existe una tabla `audit_logs` propia** pese a que el
boceto original de la fila de soporte de abajo la menciona — el panel admin
lee directo de `activity_log` (Spatie, instalado desde Sprint 7), que ya
registra cambios de `User`/`Routine`/`TrainerClient`. `reports.reportable`
es la primera relación polimórfica propia de la app (`REPORTS` arriba) — el
único tipo aceptado hoy es `chat_message`, vía un `morphMap` no estricto
(`Relation::morphMap()`, no `enforceMorphMap()` — ver nota de implementación
en `AppServiceProvider`, este último rompe `activity_log`/notifications que
ya usan morphs con el FQCN crudo). `users.last_active_at` no tiene su propia
tabla de eventos: es un único timestamp actualizado por un middleware global
con throttle de 5 minutos, así que DAU/WAU/MAU/retención son aproximaciones,
no un cohort analysis completo.

## 4. Tablas de soporte (catálogo / sistema)

| Tabla | Propósito |
|---|---|
| `countries`, `cities` | Catálogo geográfico normalizado para rankings por ubicación |
| `muscle_groups` | Catálogo (Pecho, Espalda, Hombro, Bíceps, Tríceps, Cuádriceps, Isquios, Glúteo, Core, Pantorrilla...) |
| `exercise_secondary_muscles` | Pivote N:M `exercise_id` ↔ `muscle_id` |
| `exercise_alternatives` | Pivote N:M `exercise_id` ↔ `alternative_exercise_id` (para "modo gimnasio ocupado") |
| `gym_memberships` | Pivote `user_id` ↔ `gym_id` (para ranking por gimnasio) |
| `subscriptions` | `user_id`, `plan (free/premium)`, `provider`, `status`, `renews_at` — **diferido indefinidamente**, la app queda gratuita por ahora (decisión del usuario, no técnica) |
| `training_plans_marketplace` (F2) | Planes que un entrenador vende, `trainer_id`, `price`, `routine_template_id` — **diferido indefinidamente junto con `subscriptions`**, la compra de planes depende de pagos reales |
| `routine_templates` | Plantillas reutilizables de un entrenador (`is_template = true` sobre `routines`) |
| `trainer_notes` | Notas privadas del entrenador sobre un cliente — **todavía no implementado**, no estaba en el alcance del Sprint 11 pese a estar en esta misma sección de "Módulo Entrenador" en docs/03 |
| `chat_conversations`, `chat_messages` | Chat entrenador-cliente vía Reverb — **implementado en Sprint 11**, ver ERD arriba |
| `push_device_tokens`, `push_subscriptions` | Tokens de push Expo (mobile) y suscripciones web push — **implementado en Sprint 11**, ver ERD arriba |
| `domain_config` | Tablas de configuración del motor: rangos MEV/MAV/MRV por nivel, plantillas de split, tabla de RIR por objetivo — sigue siendo `config/*.php` estático (no editable sin deploy pese a lo que sugiere el boceto original); **no se abordó en Sprint 16**, no estaba en el alcance de ese sprint |
| `audit_logs` | **No implementado como tabla propia** — el panel admin (Sprint 16) lee `activity_log` (Spatie), ver nota arriba |
| `reports` | Reportes de contenido (hoy solo mensajes de chat) para moderación — **implementado en Sprint 16**, ver ERD arriba |
| `news_promotions` | Noticias/promociones publicadas por admin — **implementado en Sprint 16**, ver ERD arriba |
| `food_items`, `meal_logs` | **Implementado en Sprint 12**, ver ERD arriba — `food_items` hace de caché local de Open Food Facts (reemplaza el `barcode_cache` separado del boceto original) |
| `wearable_connections` | Fase 2 — tokens OAuth Apple Health/Google Fit/Garmin/Fitbit — **diferido indefinidamente**, requiere cuentas de desarrollador externas (Garmin/Fitbit/Google) y hardware/OS que este entorno no puede emular |

## 5. Índices críticos (rendimiento a escala)

```sql
-- Búsquedas de rutina activa por usuario (lectura muy frecuente)
CREATE INDEX idx_routines_user_active ON routines (user_id, is_active);

-- Historial de entrenamientos ordenado por fecha (paginación de historial)
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions (user_id, performed_at DESC);

-- Cálculo de sobrecarga progresiva: última sesión de un ejercicio para un usuario
CREATE INDEX idx_workout_exercises_lookup ON workout_exercises (exercise_id, workout_session_id);

-- Rankings: lectura por categoría + scope + fecha (tabla de agregados, recalculada por job)
CREATE INDEX idx_ranking_lookup ON ranking_snapshots (category, scope, snapshot_date, rank_position);

-- Stats diarios por usuario (dashboard, gráficas)
CREATE UNIQUE INDEX idx_user_stats_unique ON user_stats_daily (user_id, stat_date);

-- PRs por usuario y ejercicio (deduplicación / consulta rápida)
CREATE INDEX idx_pr_user_exercise ON personal_records (user_id, exercise_id, record_type);

-- Búsqueda de ejercicios por filtros del motor (equipo, nivel, músculo)
CREATE INDEX idx_exercises_filter ON exercises (primary_muscle_id, equipment, level, is_active);
```

## 6. Convenciones de migraciones Laravel

- Una migración por tabla, nombradas `YYYY_MM_DD_HHMMSS_create_<table>_table.php`.
- Enums de negocio como `ENUM` de MySQL solo cuando el set de valores es estable (`role`, `sex`); para valores que puedan crecer (categorías de ranking, tipos de logro) se usa `VARCHAR` + tabla de referencia o `json`.
- Todos los `foreignId()->constrained()->cascadeOnDelete()` en tablas hijas fuertemente dependientes (`workout_sets` depende de `workout_exercises`); `restrictOnDelete()` en catálogos (`exercises`, `muscle_groups`).
- Seeders obligatorios para: `muscle_groups`, `exercises` (biblioteca inicial ~150-300 ejercicios), `achievements`, `countries/cities` (dataset base), `domain_config`.
