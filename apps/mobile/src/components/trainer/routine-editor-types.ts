import type { FitnessGoal, SplitType } from '@sanken/core';

export interface ExerciseFormValues {
  exercise_id: number;
  exercise_name: string;
  target_sets: string;
  target_reps: string;
  rest_seconds: string;
  target_rpe: string;
}

export interface DayFormValues {
  label: string;
  target_muscle_groups: string;
  exercises: ExerciseFormValues[];
}

export const EMPTY_EXERCISE: ExerciseFormValues = {
  exercise_id: 0,
  exercise_name: '',
  target_sets: '3',
  target_reps: '8-12',
  rest_seconds: '90',
  target_rpe: '',
};

export const EMPTY_DAY: DayFormValues = {
  label: '',
  target_muscle_groups: '',
  exercises: [],
};

export const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  { value: 'gain_muscle', label: 'Ganar músculo' },
  { value: 'body_recomposition', label: 'Recomposición corporal' },
  { value: 'strength', label: 'Fuerza' },
  { value: 'sport_performance', label: 'Rendimiento deportivo' },
  { value: 'lose_fat', label: 'Perder grasa' },
  { value: 'health', label: 'Salud general' },
  { value: 'endurance', label: 'Resistencia muscular' },
  { value: 'cardio', label: 'Cardio' },
];

export const SPLIT_OPTIONS: { value: SplitType; label: string }[] = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_lower', label: 'Upper / Lower' },
  { value: 'push_pull_legs', label: 'Push / Pull / Legs' },
  { value: 'bro_split', label: 'Bro Split' },
];
