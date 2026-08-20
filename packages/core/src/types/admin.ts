import type { PersonalRecordSummary } from './stats';
import type { UserRole } from './user';

export type CurrentRoutineSource = 'engine' | 'trainer' | 'admin';

export interface CurrentRoutineSummary {
  id: number;
  source: CurrentRoutineSource;
  frequency_days: number;
  label: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_banned: boolean;
  is_deactivated: boolean;
  country: string | null;
  state: string | null;
  city: string | null;
  trainer_verified_at: string | null;
  last_active_at: string | null;
  created_at: string;
  /** Rutina activa hoy del usuario, sea general (motor), de entrenador o personalizada por Super Admin — o null si no tiene ninguna activa. */
  current_routine: CurrentRoutineSummary | null;
}

/** GET /admin/users/{user} — AdminUser más perfil resumido, entrenamientos y PRs. "No mostrar información privada innecesaria": nada de password/tokens/2FA (ya excluidos server-side). */
export interface AdminUserDetail extends AdminUser {
  age: number | null;
  sex: string | null;
  trainings_completed: number;
  personal_records: PersonalRecordSummary[];
}

/** PATCH /admin/users/{id}/role — solo acepta user/trainer, el backend rechaza 'super_admin' explícitamente. */
export type AssignableRole = 'user' | 'trainer';

export type ReportReason = 'abuse' | 'spam' | 'inappropriate_content' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  id: number;
  reporter: { id: number; name: string };
  reportable_type: string;
  reportable_id: number;
  reportable_preview?: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  resolved_by?: { id: number; name: string };
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

export interface StoreReportPayload {
  reportable_type: 'chat_message';
  reportable_id: number;
  reason: ReportReason;
  details?: string;
}

export interface NewsPromotion {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  new_users_7d: number;
  trainers_count: number;
  banned_users_count: number;
  pending_reports_count: number;
  dau: number;
  wau: number;
  mau: number;
  retention_pct: number;
}

export interface AuditLogEntry {
  id: number;
  log_name: string | null;
  description: string;
  event: string | null;
  subject_type: string | null;
  subject_id: number | null;
  causer?: { id: number; name: string };
  changes: unknown;
  created_at: string;
}

export interface MuscleGroupOption {
  id: number;
  name: string;
}

export interface AdminExercise {
  id: number;
  name: string;
  primary_muscle_id: number;
  primary_muscle: MuscleGroupOption;
  equipment: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'compound' | 'isolation' | 'cardio' | 'mobility';
  instructions: string | null;
  common_mistakes: string | null;
  tips: string | null;
  video_url: string | null;
  image_url: string | null;
  is_active: boolean;
  alternatives: MuscleGroupOption[];
}

export interface AdminRoutineTemplateExercise {
  id: number;
  order: number;
  exercise_id: number;
  exercise: { id: number; name: string; primary_muscle: string; equipment: string };
  default_sets: number;
  default_reps: string;
  rest_seconds: number;
  default_rpe: number | null;
}

export interface AdminRoutineTemplateDay {
  id: number;
  day_order: number;
  label: string;
  exercises: AdminRoutineTemplateExercise[];
}

export type RoutineSplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split' | 'ppl_upper_lower';

/** GET/POST/PATCH /admin/routine-templates — "rutina general" que el motor asigna automáticamente por sexo+frecuencia (ver TemplateRoutineGenerator). */
export interface AdminRoutineTemplate {
  id: number;
  name: string | null;
  sex: 'male' | 'female';
  frequency_days: number;
  split_type: RoutineSplitType;
  is_active: boolean;
  days: AdminRoutineTemplateDay[];
}

export interface RoutineTemplateDayPayload {
  day_order: number;
  label: string;
  exercises: {
    exercise_id: number;
    order: number;
    default_sets: number;
    default_reps: string;
    rest_seconds: number;
    default_rpe?: number | null;
  }[];
}

/** Payload de POST/PATCH /admin/routine-templates — `days` es opcional en PATCH (si no viene, no se tocan los días existentes). */
export interface RoutineTemplatePayload {
  name?: string | null;
  sex?: 'male' | 'female';
  frequency_days?: number;
  split_type?: RoutineSplitType;
  days?: RoutineTemplateDayPayload[];
}
