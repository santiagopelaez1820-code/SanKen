import type { FitnessGoal } from './onboarding';
import type { SplitType } from './routine';
import type { User } from './user';

export type TrainerClientStatus = 'pending' | 'active' | 'paused' | 'ended';

/** GET/POST /trainer/clients — relación entrenador-cliente. */
export interface TrainerClient {
  id: number;
  status: TrainerClientStatus;
  started_at: string | null;
  ended_at: string | null;
  client: User;
}

/** GET /me/trainers — perspectiva del cliente sobre su propia relación (Sprint 11, antes no existía). */
export interface MyTrainer {
  trainer_client_id: number;
  status: TrainerClientStatus;
  trainer: User;
}

export interface AddClientPayload {
  email: string;
}

export interface UpdateClientStatusPayload {
  status: TrainerClientStatus;
}

export interface ManualRoutineExercisePayload {
  exercise_id: number;
  order: number;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  target_rpe?: number | null;
}

export interface ManualRoutineDayPayload {
  day_order: number;
  label: string;
  target_muscle_groups?: string[];
  exercises: ManualRoutineExercisePayload[];
}

/** POST /trainer/clients/{id}/routines y PATCH /trainer/routines/{id} — el editor siempre envía el plan completo. */
export interface ManualRoutinePayload {
  goal: FitnessGoal;
  split_type: SplitType;
  frequency_days: number;
  duration_weeks: number;
  days: ManualRoutineDayPayload[];
}
