// Esta línea sirve para declarar la interfaz «PersonalRecordSummary».
export interface PersonalRecordSummary {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «exercise_name» de tipo «string».
  exercise_name: string;
  // Esta línea sirve para declarar el campo «record_type» de tipo «'1rm' | 'max_reps' | 'max_volume'».
  record_type: '1rm' | 'max_reps' | 'max_volume';
  /** Peso real levantado (kg), no un 1RM estimado. */
  // Esta línea sirve para declarar el campo «value» de tipo «number».
  value: number;
  /** Reps de esa serie — null en récords manuales anteriores a 2026-09-23. */
  // Esta línea sirve para declarar el campo «reps» de tipo «number | null».
  reps: number | null;
  // Esta línea sirve para declarar el campo «achieved_at» de tipo «string».
  achieved_at: string;
}

/** Registro voluntario de PR — independiente del flujo de entrenamiento, ver sección "PR" del pedido. */
// Esta línea sirve para declarar la interfaz «RegisterPersonalRecordPayload».
export interface RegisterPersonalRecordPayload {
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number».
  weight_kg: number;
  // Esta línea sirve para declarar el campo «reps» de tipo «number».
  reps: number;
}

/** meta.is_new_best es false cuando el valor enviado no superó el récord existente — el PR mostrado sigue siendo el anterior. */
// Esta línea sirve para declarar la interfaz «RegisterPersonalRecordMeta».
export interface RegisterPersonalRecordMeta {
  // Esta línea sirve para declarar el campo «is_new_best» de tipo «boolean».
  is_new_best: boolean;
}

// Esta línea sirve para declarar la interfaz «DashboardStats».
export interface DashboardStats {
  // Esta línea sirve para declarar el campo «total_hours» de tipo «number».
  total_hours: number;
  // Esta línea sirve para declarar el campo «total_sets» de tipo «number».
  total_sets: number;
  // Esta línea sirve para declarar el campo «total_volume_kg» de tipo «number».
  total_volume_kg: number;
  // Esta línea sirve para declarar el campo «current_streak_days» de tipo «number».
  current_streak_days: number;
  /** Sesiones completadas de por vida (no fechas únicas — dos entrenamientos el mismo día cuentan 2). */
  // Esta línea sirve para declarar el campo «total_workouts» de tipo «number».
  total_workouts: number;
  /** Retos completados de por vida — a diferencia de GET /challenges (solo período activo), esto es historia completa. */
  // Esta línea sirve para declarar el campo «completed_challenges» de tipo «number».
  completed_challenges: number;
  // Esta línea sirve para declarar el campo «recent_personal_records» de tipo «PersonalRecordSummary[]».
  recent_personal_records: PersonalRecordSummary[];
}

// Esta línea sirve para declarar el tipo «VolumeRange» como «'weekly' | 'monthly'».
export type VolumeRange = 'weekly' | 'monthly';

// Esta línea sirve para declarar la interfaz «MuscleVolume».
export interface MuscleVolume {
  // Esta línea sirve para declarar el campo «muscle_group» de tipo «string».
  muscle_group: string;
  // Esta línea sirve para declarar el campo «volume_kg» de tipo «number».
  volume_kg: number;
}

// Esta línea sirve para declarar el tipo «ProgressMetric» como «'weight' | 'volume' | '1rm'».
export type ProgressMetric = 'weight' | 'volume' | '1rm';

// Esta línea sirve para declarar la interfaz «ProgressPoint».
export interface ProgressPoint {
  // Esta línea sirve para declarar el campo «date» de tipo «string».
  date: string;
  // Esta línea sirve para declarar el campo «value» de tipo «number».
  value: number;
}

// Esta línea sirve para declarar la interfaz «BodyMeasurement».
export interface BodyMeasurement {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «measured_at» de tipo «string».
  measured_at: string;
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number | null».
  weight_kg: number | null;
  // Esta línea sirve para declarar el campo «body_fat_pct» de tipo «number | null».
  body_fat_pct: number | null;
  // Esta línea sirve para declarar el campo «chest_cm» de tipo «number | null».
  chest_cm: number | null;
  // Esta línea sirve para declarar el campo «waist_cm» de tipo «number | null».
  waist_cm: number | null;
  // Esta línea sirve para declarar el campo «hip_cm» de tipo «number | null».
  hip_cm: number | null;
  // Esta línea sirve para declarar el campo «arm_cm» de tipo «number | null».
  arm_cm: number | null;
  // Esta línea sirve para declarar el campo «thigh_cm» de tipo «number | null».
  thigh_cm: number | null;
  // Esta línea sirve para declarar el campo «progress_photo_url» de tipo «string | null».
  progress_photo_url: string | null;
}

// Esta línea sirve para declarar la interfaz «RecordBodyMeasurementPayload».
export interface RecordBodyMeasurementPayload {
  // Esta línea sirve para declarar el campo opcional «measured_at» de tipo «string».
  measured_at?: string;
  // Esta línea sirve para declarar el campo opcional «weight_kg» de tipo «number».
  weight_kg?: number;
  // Esta línea sirve para declarar el campo opcional «body_fat_pct» de tipo «number».
  body_fat_pct?: number;
  // Esta línea sirve para declarar el campo opcional «chest_cm» de tipo «number».
  chest_cm?: number;
  // Esta línea sirve para declarar el campo opcional «waist_cm» de tipo «number».
  waist_cm?: number;
  // Esta línea sirve para declarar el campo opcional «hip_cm» de tipo «number».
  hip_cm?: number;
  // Esta línea sirve para declarar el campo opcional «arm_cm» de tipo «number».
  arm_cm?: number;
  // Esta línea sirve para declarar el campo opcional «thigh_cm» de tipo «number».
  thigh_cm?: number;
  // Esta línea sirve para declarar el campo opcional «progress_photo_url» de tipo «string».
  progress_photo_url?: string;
}
