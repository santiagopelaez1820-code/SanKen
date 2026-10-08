// Esta línea sirve para importar los tipos que usa este archivo.
import type { FitnessGoal } from './onboarding';

// Esta línea sirve para declarar el tipo «RoutineSource» como «'engine' | 'trainer'».
export type RoutineSource = 'engine' | 'trainer';
// Esta línea sirve para declarar el tipo «SplitType».
export type SplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split' | 'ppl_upper_lower';

// Esta línea sirve para declarar la interfaz «RoutineExerciseSummary».
export interface RoutineExerciseSummary {
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

// Esta línea sirve para declarar la interfaz «RoutineExercise».
export interface RoutineExercise {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «order» de tipo «number».
  order: number;
  // Esta línea sirve para declarar el campo «exercise» de tipo «RoutineExerciseSummary».
  exercise: RoutineExerciseSummary;
  /** Ejercicio alternativo (A/B) — null si este ejercicio no tiene uno configurado. */
  // Esta línea sirve para declarar el campo «alternative» de tipo «RoutineExerciseSummary | null».
  alternative: RoutineExerciseSummary | null;
  // Esta línea sirve para declarar el campo «target_sets» de tipo «number».
  target_sets: number;
  // Esta línea sirve para declarar el campo «target_reps» de tipo «string».
  target_reps: string;
  // Esta línea sirve para declarar el campo «rest_seconds» de tipo «number».
  rest_seconds: number;
  // Esta línea sirve para declarar el campo «target_rpe» de tipo «number | null».
  target_rpe: number | null;
  // Esta línea sirve para declarar el campo «suggested_weight_kg» de tipo «number | null».
  suggested_weight_kg: number | null;
  // Esta línea sirve para declarar el campo «suggested_reps_per_set» de tipo «number[] | null».
  suggested_reps_per_set: number[] | null;
}

// Esta línea sirve para declarar la interfaz «RoutineDay».
export interface RoutineDay {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «day_order» de tipo «number».
  day_order: number;
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
  // Esta línea sirve para declarar el campo «target_muscle_groups» de tipo «string[]».
  target_muscle_groups: string[];
  // Esta línea sirve para declarar el campo «exercises» de tipo «RoutineExercise[]».
  exercises: RoutineExercise[];
}

// Esta línea sirve para declarar la interfaz «Routine».
export interface Routine {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «source» de tipo «RoutineSource».
  source: RoutineSource;
  // Esta línea sirve para declarar el campo «goal» de tipo «FitnessGoal».
  goal: FitnessGoal;
  // Esta línea sirve para declarar el campo «split_type» de tipo «SplitType».
  split_type: SplitType;
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «number».
  frequency_days: number;
  // Esta línea sirve para declarar el campo «duration_weeks» de tipo «number».
  duration_weeks: number;
  // Esta línea sirve para declarar el campo «is_active» de tipo «boolean».
  is_active: boolean;
  // Esta línea sirve para declarar el campo «starts_at» de tipo «string | null».
  starts_at: string | null;
  // Esta línea sirve para declarar el campo «ends_at» de tipo «string | null».
  ends_at: string | null;
  // Esta línea sirve para declarar el campo «days» de tipo «RoutineDay[]».
  days: RoutineDay[];
}

/**
 * Estado del desbloqueo diario, tal como lo calcula el backend (nunca el
 * cliente) — viene en `meta.daily_lock` de `GET /routines/active`. `reason`
 * indica si el turno de hoy se gastó completando o saltando el
 * entrenamiento; `unlocks_at` es la medianoche (UTC) del día calendario
 * siguiente, o null si no está bloqueado.
 */
// Esta línea sirve para declarar la interfaz «DailyLock».
export interface DailyLock {
  // Esta línea sirve para declarar el campo «locked» de tipo «boolean».
  locked: boolean;
  // Esta línea sirve para declarar el campo «unlocks_at» de tipo «string | null».
  unlocks_at: string | null;
  // Esta línea sirve para declarar el campo «reason» de tipo «'completed' | 'skipped' | null».
  reason: 'completed' | 'skipped' | null;
}
