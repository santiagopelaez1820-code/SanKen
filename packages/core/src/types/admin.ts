// Esta línea sirve para importar los tipos que usa este archivo.
import type { PersonalRecordSummary } from './stats';
// Esta línea sirve para importar los tipos que usa este archivo.
import type { Order, OrderStatus, ProductCategory } from './store';
// Esta línea sirve para importar los tipos que usa este archivo.
import type { UserRole } from './user';

// Esta línea sirve para declarar el tipo «CurrentRoutineSource» como «'engine' | 'trainer' | 'admin'».
export type CurrentRoutineSource = 'engine' | 'trainer' | 'admin';

// Esta línea sirve para declarar la interfaz «CurrentRoutineSummary».
export interface CurrentRoutineSummary {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «source» de tipo «CurrentRoutineSource».
  source: CurrentRoutineSource;
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «number».
  frequency_days: number;
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
}

// Esta línea sirve para declarar la interfaz «AdminUser».
export interface AdminUser {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «email» de tipo «string».
  email: string;
  // Esta línea sirve para declarar el campo «role» de tipo «UserRole».
  role: UserRole;
  // Esta línea sirve para declarar el campo «is_banned» de tipo «boolean».
  is_banned: boolean;
  // Esta línea sirve para declarar el campo «is_deactivated» de tipo «boolean».
  is_deactivated: boolean;
  // Esta línea sirve para declarar el campo «country» de tipo «string | null».
  country: string | null;
  // Esta línea sirve para declarar el campo «state» de tipo «string | null».
  state: string | null;
  // Esta línea sirve para declarar el campo «city» de tipo «string | null».
  city: string | null;
  // Esta línea sirve para declarar el campo «trainer_verified_at» de tipo «string | null».
  trainer_verified_at: string | null;
  // Esta línea sirve para declarar el campo «last_active_at» de tipo «string | null».
  last_active_at: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
  /** Rutina activa hoy del usuario, sea general (motor), de entrenador o personalizada por Super Admin — o null si no tiene ninguna activa. */
  // Esta línea sirve para declarar el campo «current_routine» de tipo «CurrentRoutineSummary | null».
  current_routine: CurrentRoutineSummary | null;
}

/** GET /admin/users/{user} — AdminUser más perfil resumido, entrenamientos y PRs. "No mostrar información privada innecesaria": nada de password/tokens/2FA (ya excluidos server-side). */
// Esta línea sirve para declarar la interfaz «AdminUserDetail».
export interface AdminUserDetail extends AdminUser {
  // Esta línea sirve para declarar el campo «age» de tipo «number | null».
  age: number | null;
  // Esta línea sirve para declarar el campo «sex» de tipo «string | null».
  sex: string | null;
  // Esta línea sirve para declarar el campo «trainings_completed» de tipo «number».
  trainings_completed: number;
  // Esta línea sirve para declarar el campo «personal_records» de tipo «PersonalRecordSummary[]».
  personal_records: PersonalRecordSummary[];
}

/** PATCH /admin/users/{id}/role — solo acepta user/trainer, el backend rechaza 'super_admin' explícitamente. */
// Esta línea sirve para declarar el tipo «AssignableRole» como «'user' | 'trainer'».
export type AssignableRole = 'user' | 'trainer';

// Esta línea sirve para declarar el tipo «ReportReason» como «'abuse' | 'spam' | 'inappropriate_content' | 'other'».
export type ReportReason = 'abuse' | 'spam' | 'inappropriate_content' | 'other';
// Esta línea sirve para declarar el tipo «ReportStatus» como «'pending' | 'resolved' | 'dismissed'».
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

// Esta línea sirve para declarar la interfaz «Report».
export interface Report {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «reporter» de tipo «{ id: number; name: string }».
  reporter: { id: number; name: string };
  // Esta línea sirve para declarar el campo «reportable_type» de tipo «string».
  reportable_type: string;
  // Esta línea sirve para declarar el campo «reportable_id» de tipo «number».
  reportable_id: number;
  // Esta línea sirve para declarar el campo opcional «reportable_preview» de tipo «string».
  reportable_preview?: string;
  // Esta línea sirve para declarar el campo «reason» de tipo «ReportReason».
  reason: ReportReason;
  // Esta línea sirve para declarar el campo «details» de tipo «string | null».
  details: string | null;
  // Esta línea sirve para declarar el campo «status» de tipo «ReportStatus».
  status: ReportStatus;
  // Esta línea sirve para declarar el campo opcional «resolved_by» de tipo «{ id: number; name: string }».
  resolved_by?: { id: number; name: string };
  // Esta línea sirve para declarar el campo «resolved_at» de tipo «string | null».
  resolved_at: string | null;
  // Esta línea sirve para declarar el campo «resolution_notes» de tipo «string | null».
  resolution_notes: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «StoreReportPayload».
export interface StoreReportPayload {
  // Esta línea sirve para declarar el campo «reportable_type» de tipo «'chat_message'».
  reportable_type: 'chat_message';
  // Esta línea sirve para declarar el campo «reportable_id» de tipo «number».
  reportable_id: number;
  // Esta línea sirve para declarar el campo «reason» de tipo «ReportReason».
  reason: ReportReason;
  // Esta línea sirve para declarar el campo opcional «details» de tipo «string».
  details?: string;
}

// Esta línea sirve para declarar la interfaz «NewsPromotion».
export interface NewsPromotion {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «body» de tipo «string».
  body: string;
  // Esta línea sirve para declarar el campo «image_url» de tipo «string | null».
  image_url: string | null;
  // Esta línea sirve para declarar el campo «published» de tipo «boolean».
  published: boolean;
  // Esta línea sirve para declarar el campo «published_at» de tipo «string | null».
  published_at: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «AdminStats».
export interface AdminStats {
  // Esta línea sirve para declarar el campo «total_users» de tipo «number».
  total_users: number;
  // Esta línea sirve para declarar el campo «new_users_7d» de tipo «number».
  new_users_7d: number;
  // Esta línea sirve para declarar el campo «trainers_count» de tipo «number».
  trainers_count: number;
  // Esta línea sirve para declarar el campo «banned_users_count» de tipo «number».
  banned_users_count: number;
  // Esta línea sirve para declarar el campo «pending_reports_count» de tipo «number».
  pending_reports_count: number;
  // Esta línea sirve para declarar el campo «dau» de tipo «number».
  dau: number;
  // Esta línea sirve para declarar el campo «wau» de tipo «number».
  wau: number;
  // Esta línea sirve para declarar el campo «mau» de tipo «number».
  mau: number;
  // Esta línea sirve para declarar el campo «retention_pct» de tipo «number».
  retention_pct: number;
}

// Esta línea sirve para declarar el tipo «UsageAnalyticsPeriod» como «'today' | 'week' | 'month'».
export type UsageAnalyticsPeriod = 'today' | 'week' | 'month';

/**
 * GET /admin/analytics/overview?period=. Los `active_*` (hoy/semana/mes)
 * siempre vienen los tres juntos, sin importar `period` — el filtro solo
 * escopea `new_users`/`sessions` (y sus `_change_pct`) al período elegido.
 * Cualquier `_change_pct` es `null`, nunca 0 ni un valor inventado, cuando
 * el período anterior no tiene base para comparar (0 en el denominador).
 */
// Esta línea sirve para declarar la interfaz «UsageAnalyticsOverview».
export interface UsageAnalyticsOverview {
  // Esta línea sirve para declarar el campo «period» de tipo «UsageAnalyticsPeriod».
  period: UsageAnalyticsPeriod;
  // Esta línea sirve para declarar el campo «active_today» de tipo «number».
  active_today: number;
  // Esta línea sirve para declarar el campo «active_today_change_pct» de tipo «number | null».
  active_today_change_pct: number | null;
  // Esta línea sirve para declarar el campo «active_week» de tipo «number».
  active_week: number;
  // Esta línea sirve para declarar el campo «active_week_change_pct» de tipo «number | null».
  active_week_change_pct: number | null;
  // Esta línea sirve para declarar el campo «active_month» de tipo «number».
  active_month: number;
  // Esta línea sirve para declarar el campo «active_month_change_pct» de tipo «number | null».
  active_month_change_pct: number | null;
  // Esta línea sirve para declarar el campo «registered_users_total» de tipo «number».
  registered_users_total: number;
  // Esta línea sirve para declarar el campo «new_users» de tipo «number».
  new_users: number;
  // Esta línea sirve para declarar el campo «new_users_change_pct» de tipo «number | null».
  new_users_change_pct: number | null;
  // Esta línea sirve para declarar el campo «sessions» de tipo «number».
  sessions: number;
  // Esta línea sirve para declarar el campo «sessions_change_pct» de tipo «number | null».
  sessions_change_pct: number | null;
}

/** GET /admin/analytics/activity?period= — granularidad por hora si period=today, por día si week/month. */
// Esta línea sirve para declarar la interfaz «UsageActivityPoint».
export interface UsageActivityPoint {
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
  // Esta línea sirve para declarar el campo opcional «date» de tipo «string».
  date?: string;
  // Esta línea sirve para declarar el campo «value» de tipo «number».
  value: number;
}

// Esta línea sirve para declarar la interfaz «UsageActivitySeries».
export interface UsageActivitySeries {
  // Esta línea sirve para declarar el campo «period» de tipo «UsageAnalyticsPeriod».
  period: UsageAnalyticsPeriod;
  // Esta línea sirve para declarar el campo «granularity» de tipo «'hour' | 'day'».
  granularity: 'hour' | 'day';
  // Esta línea sirve para declarar el campo «points» de tipo «UsageActivityPoint[]».
  points: UsageActivityPoint[];
}

// Esta línea sirve para declarar la interfaz «AuditLogEntry».
export interface AuditLogEntry {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «log_name» de tipo «string | null».
  log_name: string | null;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «event» de tipo «string | null».
  event: string | null;
  // Esta línea sirve para declarar el campo «subject_type» de tipo «string | null».
  subject_type: string | null;
  // Esta línea sirve para declarar el campo «subject_id» de tipo «number | null».
  subject_id: number | null;
  // Esta línea sirve para declarar el campo opcional «causer» de tipo «{ id: number; name: string }».
  causer?: { id: number; name: string };
  // Esta línea sirve para declarar el campo «changes» de tipo «unknown».
  changes: unknown;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «MuscleGroupOption».
export interface MuscleGroupOption {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
}

// Esta línea sirve para declarar la interfaz «AdminExercise».
export interface AdminExercise {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «primary_muscle_id» de tipo «number».
  primary_muscle_id: number;
  // Esta línea sirve para declarar el campo «primary_muscle» de tipo «MuscleGroupOption».
  primary_muscle: MuscleGroupOption;
  // Esta línea sirve para declarar el campo «equipment» de tipo «string».
  equipment: string;
  // Esta línea sirve para declarar el campo «level» de tipo «'beginner' | 'intermediate' | 'advanced'».
  level: 'beginner' | 'intermediate' | 'advanced';
  // Esta línea sirve para declarar el campo «type» con los tipos de ejercicio permitidos.
  type: 'compound' | 'isolation' | 'cardio' | 'mobility';
  // Esta línea sirve para declarar el campo «instructions» de tipo «string | null».
  instructions: string | null;
  // Esta línea sirve para declarar el campo «common_mistakes» de tipo «string | null».
  common_mistakes: string | null;
  // Esta línea sirve para declarar el campo «tips» de tipo «string | null».
  tips: string | null;
  // Esta línea sirve para declarar el campo «video_url» de tipo «string | null».
  video_url: string | null;
  // Esta línea sirve para declarar el campo «image_url» de tipo «string | null».
  image_url: string | null;
  // Esta línea sirve para declarar el campo «is_active» de tipo «boolean».
  is_active: boolean;
  // Esta línea sirve para declarar el campo «alternatives» de tipo «MuscleGroupOption[]».
  alternatives: MuscleGroupOption[];
}

// Esta línea sirve para declarar la interfaz «AdminRoutineTemplateExercise».
export interface AdminRoutineTemplateExercise {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «order» de tipo «number».
  order: number;
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «exercise» con los datos básicos del ejercicio.
  exercise: { id: number; name: string; primary_muscle: string; equipment: string };
  // Esta línea sirve para declarar el campo «default_sets» de tipo «number».
  default_sets: number;
  // Esta línea sirve para declarar el campo «default_reps» de tipo «string».
  default_reps: string;
  // Esta línea sirve para declarar el campo «rest_seconds» de tipo «number».
  rest_seconds: number;
  // Esta línea sirve para declarar el campo «default_rpe» de tipo «number | null».
  default_rpe: number | null;
}

// Esta línea sirve para declarar la interfaz «AdminRoutineTemplateDay».
export interface AdminRoutineTemplateDay {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «day_order» de tipo «number».
  day_order: number;
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
  // Esta línea sirve para declarar el campo «exercises» de tipo «AdminRoutineTemplateExercise[]».
  exercises: AdminRoutineTemplateExercise[];
}

// Esta línea sirve para declarar el tipo «RoutineSplitType».
export type RoutineSplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split' | 'ppl_upper_lower';

// Esta línea sirve para declarar el tipo «RoutineTemplateLevel» como «'beginner' | 'intermediate' | 'advanced'».
export type RoutineTemplateLevel = 'beginner' | 'intermediate' | 'advanced';

/** GET/POST/PATCH /admin/routine-templates — "rutina general" que el motor asigna automáticamente por sexo+frecuencia+nivel (ver TemplateRoutineGenerator). */
// Esta línea sirve para declarar la interfaz «AdminRoutineTemplate».
export interface AdminRoutineTemplate {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string | null».
  name: string | null;
  // Esta línea sirve para declarar el campo «sex» de tipo «'male' | 'female'».
  sex: 'male' | 'female';
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «number».
  frequency_days: number;
  // Esta línea sirve para declarar el campo «level» de tipo «RoutineTemplateLevel».
  level: RoutineTemplateLevel;
  // Esta línea sirve para declarar el campo «split_type» de tipo «RoutineSplitType».
  split_type: RoutineSplitType;
  // Esta línea sirve para declarar el campo «is_active» de tipo «boolean».
  is_active: boolean;
  // Esta línea sirve para declarar el campo «days» de tipo «AdminRoutineTemplateDay[]».
  days: AdminRoutineTemplateDay[];
}

// Esta línea sirve para declarar la interfaz «RoutineTemplateDayPayload».
export interface RoutineTemplateDayPayload {
  // Esta línea sirve para declarar el campo «day_order» de tipo «number».
  day_order: number;
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
  // Esta línea sirve para declarar el campo «exercises» de tipo «{».
  exercises: {
    // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
    exercise_id: number;
    // Esta línea sirve para declarar el campo «order» de tipo «number».
    order: number;
    // Esta línea sirve para declarar el campo «default_sets» de tipo «number».
    default_sets: number;
    // Esta línea sirve para declarar el campo «default_reps» de tipo «string».
    default_reps: string;
    // Esta línea sirve para declarar el campo «rest_seconds» de tipo «number».
    rest_seconds: number;
    // Esta línea sirve para declarar el campo opcional «default_rpe» de tipo «number | null».
    default_rpe?: number | null;
  }[];
}

/** Payload de POST/PATCH /admin/routine-templates — `days` es opcional en PATCH (si no viene, no se tocan los días existentes). */
// Esta línea sirve para declarar la interfaz «RoutineTemplatePayload».
export interface RoutineTemplatePayload {
  // Esta línea sirve para declarar el campo opcional «name» de tipo «string | null».
  name?: string | null;
  // Esta línea sirve para declarar el campo opcional «sex» de tipo «'male' | 'female'».
  sex?: 'male' | 'female';
  // Esta línea sirve para declarar el campo opcional «frequency_days» de tipo «number».
  frequency_days?: number;
  // Esta línea sirve para declarar el campo opcional «level» de tipo «RoutineTemplateLevel».
  level?: RoutineTemplateLevel;
  // Esta línea sirve para declarar el campo opcional «split_type» de tipo «RoutineSplitType».
  split_type?: RoutineSplitType;
  // Esta línea sirve para declarar el campo opcional «days» de tipo «RoutineTemplateDayPayload[]».
  days?: RoutineTemplateDayPayload[];
}

/** GET/POST/PATCH /admin/products — igual que Product pero con los campos de uso interno del superadmin. */
// Esta línea sirve para declarar la interfaz «AdminProduct».
export interface AdminProduct {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «slug» de tipo «string».
  slug: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «short_description» de tipo «string».
  short_description: string;
  // Esta línea sirve para declarar el campo «image» de tipo «string | null».
  image: string | null;
  // Esta línea sirve para declarar el campo «category» de tipo «ProductCategory».
  category: ProductCategory;
  // Esta línea sirve para declarar el campo «price» de tipo «string».
  price: string;
  // Esta línea sirve para declarar el campo «active» de tipo «boolean».
  active: boolean;
  // Esta línea sirve para declarar el campo «dropi_reference» de tipo «string | null».
  dropi_reference: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

/** Payload de POST/PATCH /admin/products. */
// Esta línea sirve para declarar la interfaz «ProductPayload».
export interface ProductPayload {
  // Esta línea sirve para declarar el campo opcional «name» de tipo «string».
  name?: string;
  // Esta línea sirve para declarar el campo opcional «description» de tipo «string».
  description?: string;
  // Esta línea sirve para declarar el campo opcional «short_description» de tipo «string».
  short_description?: string;
  // Esta línea sirve para declarar el campo opcional «category» de tipo «ProductCategory».
  category?: ProductCategory;
  // Esta línea sirve para declarar el campo opcional «price» de tipo «number».
  price?: number;
  // Esta línea sirve para declarar el campo opcional «active» de tipo «boolean».
  active?: boolean;
  // Esta línea sirve para declarar el campo opcional «dropi_reference» de tipo «string | null».
  dropi_reference?: string | null;
}

/**
 * GET/PATCH /admin/orders/{id} — igual que Order pero con lo que solo el
 * superadmin puede ver: notas internas, el link de WhatsApp hacia el
 * cliente, y el historial de cambios (reutiliza AuditLogEntry, mismo
 * formato que /admin/audit-logs).
 */
// Esta línea sirve para declarar la interfaz «AdminOrder».
export interface AdminOrder extends Omit<Order, 'support_whatsapp_url'> {
  // Esta línea sirve para declarar el campo «admin_notes» de tipo «string | null».
  admin_notes: string | null;
  /** Link wa.me hacia el cliente, con el mensaje según el estado actual ya armado — null si el pedido no tiene WhatsApp válido. */
  // Esta línea sirve para declarar el campo «whatsapp_url» de tipo «string | null».
  whatsapp_url: string | null;
  // Esta línea sirve para declarar el campo «history» de tipo «AuditLogEntry[]».
  history: AuditLogEntry[];
}

/** Payload de PATCH /admin/orders/{id} — todos los campos son opcionales (edición parcial). */
// Esta línea sirve para declarar la interfaz «OrderTrackingPayload».
export interface OrderTrackingPayload {
  // Esta línea sirve para declarar el campo opcional «status» de tipo «OrderStatus».
  status?: OrderStatus;
  // Esta línea sirve para declarar el campo opcional «tracking_number» de tipo «string | null».
  tracking_number?: string | null;
  // Esta línea sirve para declarar el campo opcional «carrier» de tipo «string | null».
  carrier?: string | null;
  // Esta línea sirve para declarar el campo opcional «customer_message» de tipo «string | null».
  customer_message?: string | null;
  // Esta línea sirve para declarar el campo opcional «admin_notes» de tipo «string | null».
  admin_notes?: string | null;
}
