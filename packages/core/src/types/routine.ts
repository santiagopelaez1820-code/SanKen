import type { FitnessGoal } from './onboarding';

export type RoutineSource = 'engine' | 'trainer';
export type SplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split';

export interface RoutineExerciseSummary {
  id: number;
  name: string;
  primary_muscle: string;
  equipment: string;
  video_url: string | null;
  image_url: string | null;
}

export interface RoutineExercise {
  id: number;
  order: number;
  exercise: RoutineExerciseSummary;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  target_rpe: number | null;
  suggested_weight_kg: number | null;
}

export interface RoutineDay {
  id: number;
  day_order: number;
  label: string;
  target_muscle_groups: string[];
  exercises: RoutineExercise[];
}

export interface Routine {
  id: number;
  source: RoutineSource;
  goal: FitnessGoal;
  split_type: SplitType;
  frequency_days: number;
  duration_weeks: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  days: RoutineDay[];
}
