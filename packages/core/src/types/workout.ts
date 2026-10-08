// Esta línea sirve para declarar la interfaz «WorkoutSet».
export interface WorkoutSet {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «set_number» de tipo «number».
  set_number: number;
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number».
  weight_kg: number;
  // Esta línea sirve para declarar el campo «reps» de tipo «number».
  reps: number;
  // Esta línea sirve para declarar el campo «rpe» de tipo «number | null».
  rpe: number | null;
  // Esta línea sirve para declarar el campo «is_warmup» de tipo «boolean».
  is_warmup: boolean;
  // Esta línea sirve para declarar el campo «completed» de tipo «boolean».
  completed: boolean;
}

// Esta línea sirve para declarar la interfaz «WorkoutExerciseSummary».
export interface WorkoutExerciseSummary {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «primary_muscle» de tipo «string».
  primary_muscle: string;
  // Esta línea sirve para declarar el campo «equipment» de tipo «string».
  equipment: string;
  // Esta línea sirve para declarar el campo «video_url» de tipo «string | null».
  video_url: string | null;
  // Esta línea sirve para declarar el campo «image_url» de tipo «string | null».
  image_url: string | null;
}

// Esta línea sirve para declarar la interfaz «WorkoutExercise».
export interface WorkoutExercise {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «order» de tipo «number».
  order: number;
  // Esta línea sirve para declarar el campo «all_sets_completed» de tipo «boolean».
  all_sets_completed: boolean;
  /** Siempre 3 — snapshot tomado al iniciar la sesión, ver StartWorkoutSessionAction. */
  // Esta línea sirve para declarar el campo «target_sets» de tipo «number».
  target_sets: number;
  // Esta línea sirve para declarar el campo «target_reps» de tipo «string | null».
  target_reps: string | null;
  // Esta línea sirve para declarar el campo «rest_seconds» de tipo «number | null».
  rest_seconds: number | null;
  // Esta línea sirve para declarar el campo «target_rpe» de tipo «number | null».
  target_rpe: number | null;
  /** Peso recomendado por la sobrecarga progresiva — no confundir con el peso que el usuario realmente cargó (weight_kg en cada WorkoutSet). */
  // Esta línea sirve para declarar el campo «suggested_weight_kg» de tipo «number | null».
  suggested_weight_kg: number | null;
  /** Reps recomendadas por serie (índice 0 = serie 1) — null hasta la primera vez que se completa este ejercicio. Largo = target_sets. */
  // Esta línea sirve para declarar el campo «suggested_reps_per_set» de tipo «number[] | null».
  suggested_reps_per_set: number[] | null;
  // Esta línea sirve para declarar el campo «exercise» de tipo «WorkoutExerciseSummary».
  exercise: WorkoutExerciseSummary;
  /** Ejercicio alternativo (A/B) — null si este ejercicio no tiene uno configurado. */
  // Esta línea sirve para declarar el campo «alternative» de tipo «WorkoutExerciseSummary | null».
  alternative: WorkoutExerciseSummary | null;
  // Esta línea sirve para declarar el campo «sets» de tipo «WorkoutSet[]».
  sets: WorkoutSet[];
}

// Esta línea sirve para declarar la interfaz «WorkoutSession».
export interface WorkoutSession {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «routine_day_id» de tipo «number | null».
  routine_day_id: number | null;
  // Esta línea sirve para declarar el campo «routine_day_label» de tipo «string | null».
  routine_day_label: string | null;
  // Esta línea sirve para declarar el campo «performed_at» de tipo «string».
  performed_at: string;
  // Esta línea sirve para declarar el campo «duration_minutes» de tipo «number | null».
  duration_minutes: number | null;
  // Esta línea sirve para declarar el campo «completed» de tipo «boolean».
  completed: boolean;
  // Esta línea sirve para declarar el campo «completed_as_planned» de tipo «boolean | null».
  completed_as_planned: boolean | null;
  // Esta línea sirve para declarar el campo «skipped» de tipo «boolean».
  skipped: boolean;
  // Esta línea sirve para declarar el campo «cancelled» de tipo «boolean».
  cancelled: boolean;
  // Esta línea sirve para declarar el campo «sleep_quality» de tipo «number | null».
  sleep_quality: number | null;
  // Esta línea sirve para declarar el campo «energy_level» de tipo «number | null».
  energy_level: number | null;
  // Esta línea sirve para declarar el campo «muscle_soreness» de tipo «number | null».
  muscle_soreness: number | null;
  /** true si el precheck (sueño/energía/dolor) hizo que se recorten series/peso/RPE de esta sesión puntual — ver SessionReadinessAdjuster. */
  // Esta línea sirve para declarar el campo «readiness_adjusted» de tipo «boolean».
  readiness_adjusted: boolean;
  /** Explicación en español de por qué se ajustó, lista para mostrar tal cual — null cuando readiness_adjusted es false. */
  // Esta línea sirve para declarar el campo «readiness_note» de tipo «string | null».
  readiness_note: string | null;
  // Esta línea sirve para declarar el campo «notes» de tipo «string | null».
  notes: string | null;
  // Esta línea sirve para declarar el campo «exercises» de tipo «WorkoutExercise[]».
  exercises: WorkoutExercise[];
}

/** Respuesta de POST .../sets — igual que WorkoutSet más el flag de récord. */
// Esta línea sirve para declarar la interfaz «LoggedWorkoutSet».
export interface LoggedWorkoutSet extends WorkoutSet {
  // Esta línea sirve para declarar el campo «is_personal_record» de tipo «boolean».
  is_personal_record: boolean;
}

// Esta línea sirve para declarar la interfaz «SubmitFeedbackPayload».
export interface SubmitFeedbackPayload {
  // Esta línea sirve para declarar el campo «completed_as_planned» de tipo «boolean».
  completed_as_planned: boolean;
}

// Esta línea sirve para declarar la interfaz «StartWorkoutSessionPayload».
export interface StartWorkoutSessionPayload {
  // Esta línea sirve para declarar el campo opcional «routine_day_id» de tipo «number | null».
  routine_day_id?: number | null;
  // Esta línea sirve para declarar el campo opcional «sleep_quality» de tipo «number».
  sleep_quality?: number;
  // Esta línea sirve para declarar el campo opcional «energy_level» de tipo «number».
  energy_level?: number;
  // Esta línea sirve para declarar el campo opcional «muscle_soreness» de tipo «number».
  muscle_soreness?: number;
}

// Esta línea sirve para declarar la interfaz «LogSetPayload».
export interface LogSetPayload {
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number».
  weight_kg: number;
  // Esta línea sirve para declarar el campo «reps» de tipo «number».
  reps: number;
  // Esta línea sirve para declarar el campo opcional «rpe» de tipo «number | null».
  rpe?: number | null;
  // Esta línea sirve para declarar el campo opcional «is_warmup» de tipo «boolean».
  is_warmup?: boolean;
  // Esta línea sirve para declarar el campo opcional «completed» de tipo «boolean».
  completed?: boolean;
}

// Esta línea sirve para declarar la interfaz «CompleteWorkoutSessionPayload».
export interface CompleteWorkoutSessionPayload {
  // Esta línea sirve para declarar el campo opcional «duration_minutes» de tipo «number».
  duration_minutes?: number;
  // Esta línea sirve para declarar el campo opcional «notes» de tipo «string».
  notes?: string;
}
