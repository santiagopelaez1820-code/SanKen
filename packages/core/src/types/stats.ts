export interface PersonalRecordSummary {
  id: number;
  exercise_id: number;
  exercise_name: string;
  record_type: '1rm' | 'max_reps' | 'max_volume';
  value: number;
  achieved_at: string;
}

/** Registro voluntario de PR — independiente del flujo de entrenamiento, ver sección "PR" del pedido. */
export interface RegisterPersonalRecordPayload {
  exercise_id: number;
  weight_kg: number;
  reps: number;
}

/** meta.is_new_best es false cuando el valor enviado no superó el récord existente — el PR mostrado sigue siendo el anterior. */
export interface RegisterPersonalRecordMeta {
  is_new_best: boolean;
}

export interface DashboardStats {
  total_hours: number;
  total_sets: number;
  total_volume_kg: number;
  current_streak_days: number;
  recent_personal_records: PersonalRecordSummary[];
}

export type VolumeRange = 'weekly' | 'monthly';

export interface MuscleVolume {
  muscle_group: string;
  volume_kg: number;
}

export type ProgressMetric = 'weight' | 'volume' | '1rm';

export interface ProgressPoint {
  date: string;
  value: number;
}

export interface BodyMeasurement {
  id: number;
  measured_at: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  progress_photo_url: string | null;
}

export interface RecordBodyMeasurementPayload {
  measured_at?: string;
  weight_kg?: number;
  body_fat_pct?: number;
  chest_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  progress_photo_url?: string;
}
