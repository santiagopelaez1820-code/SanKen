export interface WorkoutSet {
  id: number;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number | null;
  is_warmup: boolean;
  completed: boolean;
}

export interface WorkoutExerciseSummary {
  id: number;
  name: string;
  primary_muscle: string;
  equipment: string;
  video_url: string | null;
  image_url: string | null;
}

export interface WorkoutExercise {
  id: number;
  order: number;
  all_sets_completed: boolean;
  /** Siempre 3 — snapshot tomado al iniciar la sesión, ver StartWorkoutSessionAction. */
  target_sets: number;
  target_reps: string | null;
  rest_seconds: number | null;
  target_rpe: number | null;
  /** Peso recomendado por la sobrecarga progresiva — no confundir con el peso que el usuario realmente cargó (weight_kg en cada WorkoutSet). */
  suggested_weight_kg: number | null;
  /** Reps recomendadas por serie (índice 0 = serie 1) — null hasta la primera vez que se completa este ejercicio. Largo = target_sets. */
  suggested_reps_per_set: number[] | null;
  exercise: WorkoutExerciseSummary;
  /** Ejercicio alternativo (A/B) — null si este ejercicio no tiene uno configurado. */
  alternative: WorkoutExerciseSummary | null;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  routine_day_id: number | null;
  routine_day_label: string | null;
  performed_at: string;
  duration_minutes: number | null;
  completed: boolean;
  completed_as_planned: boolean | null;
  skipped: boolean;
  cancelled: boolean;
  sleep_quality: number | null;
  energy_level: number | null;
  muscle_soreness: number | null;
  notes: string | null;
  exercises: WorkoutExercise[];
}

/** Respuesta de POST .../sets — igual que WorkoutSet más el flag de récord. */
export interface LoggedWorkoutSet extends WorkoutSet {
  is_personal_record: boolean;
}

export interface SubmitFeedbackPayload {
  completed_as_planned: boolean;
}

export interface StartWorkoutSessionPayload {
  routine_day_id?: number | null;
  sleep_quality?: number;
  energy_level?: number;
  muscle_soreness?: number;
}

export interface LogSetPayload {
  weight_kg: number;
  reps: number;
  rpe?: number | null;
  is_warmup?: boolean;
  completed?: boolean;
}

export interface CompleteWorkoutSessionPayload {
  duration_minutes?: number;
  notes?: string;
}
