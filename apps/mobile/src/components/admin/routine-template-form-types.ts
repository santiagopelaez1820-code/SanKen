import type { AdminRoutineTemplate, RoutineSplitType, RoutineTemplatePayload } from '@sanken/core';

export interface TemplateExerciseFormValues {
  exercise_id: number;
  exercise_name: string;
  default_sets: string;
  default_reps: string;
  rest_seconds: string;
  default_rpe: string;
}

export interface TemplateDayFormValues {
  label: string;
  exercises: TemplateExerciseFormValues[];
}

export const EMPTY_TEMPLATE_EXERCISE: TemplateExerciseFormValues = {
  exercise_id: 0,
  exercise_name: '',
  default_sets: '3',
  default_reps: '8-12',
  rest_seconds: '90',
  default_rpe: '',
};

export const EMPTY_TEMPLATE_DAY: TemplateDayFormValues = {
  label: '',
  exercises: [],
};

export const SPLIT_OPTIONS: { value: RoutineSplitType; label: string }[] = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_lower', label: 'Upper / Lower' },
  { value: 'push_pull_legs', label: 'Push / Pull / Legs' },
  { value: 'bro_split', label: 'Bro Split' },
  { value: 'ppl_upper_lower', label: 'PPL + Upper/Lower' },
];

export function templateToDays(template: AdminRoutineTemplate): TemplateDayFormValues[] {
  return [...template.days]
    .sort((a, b) => a.day_order - b.day_order)
    .map((day) => ({
      label: day.label,
      exercises: [...day.exercises]
        .sort((a, b) => a.order - b.order)
        .map((ex) => ({
          exercise_id: ex.exercise.id,
          exercise_name: ex.exercise.name,
          default_sets: String(ex.default_sets),
          default_reps: ex.default_reps,
          rest_seconds: String(ex.rest_seconds),
          default_rpe: ex.default_rpe !== null ? String(ex.default_rpe) : '',
        })),
    }));
}

export function buildTemplatePayload(
  name: string,
  sex: 'male' | 'female',
  frequencyDays: string,
  splitType: RoutineSplitType,
  days: TemplateDayFormValues[],
): RoutineTemplatePayload | null {
  const frequency = Number(frequencyDays);
  if (!Number.isFinite(frequency) || frequency < 1) return null;
  if (days.length === 0 || days.some((d) => !d.label.trim() || d.exercises.length === 0)) return null;
  if (days.some((d) => d.exercises.some((e) => e.exercise_id === 0))) return null;

  return {
    name: name.trim() || null,
    sex,
    frequency_days: frequency,
    split_type: splitType,
    days: days.map((day, dayIndex) => ({
      day_order: dayIndex + 1,
      label: day.label,
      exercises: day.exercises.map((ex, exIndex) => ({
        exercise_id: ex.exercise_id,
        order: exIndex + 1,
        default_sets: Number(ex.default_sets) || 1,
        default_reps: ex.default_reps,
        rest_seconds: Number(ex.rest_seconds) || 0,
        default_rpe: ex.default_rpe.trim() === '' ? null : Number(ex.default_rpe),
      })),
    })),
  };
}
