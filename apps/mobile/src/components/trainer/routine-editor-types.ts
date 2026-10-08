// Esta línea sirve para importar los tipos «FitnessGoal, SplitType» desde «@sanken/core».
import type { FitnessGoal, SplitType } from '@sanken/core';

// Esta línea sirve para declarar la interfaz «ExerciseFormValues».
export interface ExerciseFormValues {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «string».
  exercise_name: string;
  // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «string».
  target_sets: string;
  // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «string».
  target_reps: string;
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «string».
  rest_seconds: string;
  // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «string».
  target_rpe: string;
}

// Esta línea sirve para declarar la interfaz «DayFormValues».
export interface DayFormValues {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «string».
  target_muscle_groups: string;
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «ExerciseFormValues[]».
  exercises: ExerciseFormValues[];
}

// Esta línea sirve para declarar «EMPTY_EXERCISE» con el valor «{».
export const EMPTY_EXERCISE: ExerciseFormValues = {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «0».
  exercise_id: 0,
  // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «''».
  exercise_name: '',
  // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «'3'».
  target_sets: '3',
  // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «'8-12'».
  target_reps: '8-12',
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «'90'».
  rest_seconds: '90',
  // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «''».
  target_rpe: '',
};

// Esta línea sirve para declarar «EMPTY_DAY» con el valor «{».
export const EMPTY_DAY: DayFormValues = {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «''».
  label: '',
  // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «''».
  target_muscle_groups: '',
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[]».
  exercises: [],
};

// Esta línea sirve para declarar «GOAL_OPTIONS» con el valor «[».
export const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'gain_muscle', label: 'Ganar músculo' },…».
  { value: 'gain_muscle', label: 'Ganar músculo' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'body_recomposition', label: 'Recomposic…».
  { value: 'body_recomposition', label: 'Recomposición corporal' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'strength', label: 'Fuerza' },…».
  { value: 'strength', label: 'Fuerza' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'sport_performance', label: 'Rendimiento…».
  { value: 'sport_performance', label: 'Rendimiento deportivo' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'lose_fat', label: 'Perder grasa' },…».
  { value: 'lose_fat', label: 'Perder grasa' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'health', label: 'Salud general' },…».
  { value: 'health', label: 'Salud general' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'endurance', label: 'Resistencia muscula…».
  { value: 'endurance', label: 'Resistencia muscular' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'cardio', label: 'Cardio' },…».
  { value: 'cardio', label: 'Cardio' },
];

// Esta línea sirve para declarar «SPLIT_OPTIONS» con el valor «[».
export const SPLIT_OPTIONS: { value: SplitType; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'full_body', label: 'Full Body' },…».
  { value: 'full_body', label: 'Full Body' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'upper_lower', label: 'Upper / Lower' },…».
  { value: 'upper_lower', label: 'Upper / Lower' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'push_pull_legs', label: 'Push / Pull / …».
  { value: 'push_pull_legs', label: 'Push / Pull / Legs' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'bro_split', label: 'Bro Split' },…».
  { value: 'bro_split', label: 'Bro Split' },
];
