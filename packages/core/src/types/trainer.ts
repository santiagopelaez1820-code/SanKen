// Esta línea sirve para importar los tipos que usa este archivo.
import type { FitnessGoal } from './onboarding';
// Esta línea sirve para importar los tipos que usa este archivo.
import type { SplitType } from './routine';
// Esta línea sirve para importar los tipos que usa este archivo.
import type { User } from './user';

// Esta línea sirve para declarar el tipo «TrainerClientStatus» como «'pending' | 'active' | 'paused' | 'ended'».
export type TrainerClientStatus = 'pending' | 'active' | 'paused' | 'ended';

/** GET/POST /trainer/clients — relación entrenador-cliente. */
// Esta línea sirve para declarar la interfaz «TrainerClient».
export interface TrainerClient {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «status» de tipo «TrainerClientStatus».
  status: TrainerClientStatus;
  // Esta línea sirve para declarar el campo «started_at» de tipo «string | null».
  started_at: string | null;
  // Esta línea sirve para declarar el campo «ended_at» de tipo «string | null».
  ended_at: string | null;
  // Esta línea sirve para declarar el campo «client» de tipo «User».
  client: User;
}

/** GET /me/trainers — perspectiva del cliente sobre su propia relación (Sprint 11, antes no existía). */
// Esta línea sirve para declarar la interfaz «MyTrainer».
export interface MyTrainer {
  // Esta línea sirve para declarar el campo «trainer_client_id» de tipo «number».
  trainer_client_id: number;
  // Esta línea sirve para declarar el campo «status» de tipo «TrainerClientStatus».
  status: TrainerClientStatus;
  // Esta línea sirve para declarar el campo «trainer» de tipo «User».
  trainer: User;
}

// Esta línea sirve para declarar la interfaz «AddClientPayload».
export interface AddClientPayload {
  // Esta línea sirve para declarar el campo «email» de tipo «string».
  email: string;
}

// Esta línea sirve para declarar la interfaz «UpdateClientStatusPayload».
export interface UpdateClientStatusPayload {
  // Esta línea sirve para declarar el campo «status» de tipo «TrainerClientStatus».
  status: TrainerClientStatus;
}

// Esta línea sirve para declarar la interfaz «ManualRoutineExercisePayload».
export interface ManualRoutineExercisePayload {
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «order» de tipo «number».
  order: number;
  // Esta línea sirve para declarar el campo «target_sets» de tipo «number».
  target_sets: number;
  // Esta línea sirve para declarar el campo «target_reps» de tipo «string».
  target_reps: string;
  // Esta línea sirve para declarar el campo «rest_seconds» de tipo «number».
  rest_seconds: number;
  // Esta línea sirve para declarar el campo opcional «target_rpe» de tipo «number | null».
  target_rpe?: number | null;
}

// Esta línea sirve para declarar la interfaz «ManualRoutineDayPayload».
export interface ManualRoutineDayPayload {
  // Esta línea sirve para declarar el campo «day_order» de tipo «number».
  day_order: number;
  // Esta línea sirve para declarar el campo «label» de tipo «string».
  label: string;
  // Esta línea sirve para declarar el campo opcional «target_muscle_groups» de tipo «string[]».
  target_muscle_groups?: string[];
  // Esta línea sirve para declarar el campo «exercises» de tipo «ManualRoutineExercisePayload[]».
  exercises: ManualRoutineExercisePayload[];
}

/** POST /trainer/clients/{id}/routines y PATCH /trainer/routines/{id} — el editor siempre envía el plan completo. */
// Esta línea sirve para declarar la interfaz «ManualRoutinePayload».
export interface ManualRoutinePayload {
  // Esta línea sirve para declarar el campo «goal» de tipo «FitnessGoal».
  goal: FitnessGoal;
  // Esta línea sirve para declarar el campo «split_type» de tipo «SplitType».
  split_type: SplitType;
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «number».
  frequency_days: number;
  // Esta línea sirve para declarar el campo «duration_weeks» de tipo «number».
  duration_weeks: number;
  // Esta línea sirve para declarar el campo «days» de tipo «ManualRoutineDayPayload[]».
  days: ManualRoutineDayPayload[];
}
