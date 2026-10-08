// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ROUTINE_TEMPLATE_LEVEL_LABELS» en la lista.
  ROUTINE_TEMPLATE_LEVEL_LABELS,
  // Esta línea sirve para incluir el valor «ROUTINE_TEMPLATE_LEVELS» en la lista.
  ROUTINE_TEMPLATE_LEVELS,
  // Esta línea sirve para importar el tipo «AdminRoutineTemplate».
  type AdminRoutineTemplate,
  // Esta línea sirve para importar el tipo «RoutineSplitType».
  type RoutineSplitType,
  // Esta línea sirve para importar el tipo «RoutineTemplateLevel».
  type RoutineTemplateLevel,
  // Esta línea sirve para importar el tipo «RoutineTemplatePayload».
  type RoutineTemplatePayload,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para declarar la interfaz «TemplateExerciseFormValues».
export interface TemplateExerciseFormValues {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «string».
  exercise_name: string;
  // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «string».
  default_sets: string;
  // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «string».
  default_reps: string;
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «string».
  rest_seconds: string;
  // Esta línea sirve para declarar la propiedad «default_rpe» con el valor o tipo «string».
  default_rpe: string;
}

// Esta línea sirve para declarar la interfaz «TemplateDayFormValues».
export interface TemplateDayFormValues {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «TemplateExerciseFormValues[]».
  exercises: TemplateExerciseFormValues[];
}

// Esta línea sirve para declarar «EMPTY_TEMPLATE_EXERCISE» con el valor «{».
export const EMPTY_TEMPLATE_EXERCISE: TemplateExerciseFormValues = {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «0».
  exercise_id: 0,
  // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «''».
  exercise_name: '',
  // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «'3'».
  default_sets: '3',
  // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «'8-12'».
  default_reps: '8-12',
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «'90'».
  rest_seconds: '90',
  // Esta línea sirve para declarar la propiedad «default_rpe» con el valor o tipo «''».
  default_rpe: '',
};

// Esta línea sirve para declarar «EMPTY_TEMPLATE_DAY» con el valor «{».
export const EMPTY_TEMPLATE_DAY: TemplateDayFormValues = {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «''».
  label: '',
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[]».
  exercises: [],
};

// Esta línea sirve para declarar «SPLIT_OPTIONS» con el valor «[».
export const SPLIT_OPTIONS: { value: RoutineSplitType; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'full_body', label: 'Full Body' },…».
  { value: 'full_body', label: 'Full Body' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'upper_lower', label: 'Upper / Lower' },…».
  { value: 'upper_lower', label: 'Upper / Lower' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'push_pull_legs', label: 'Push / Pull / …».
  { value: 'push_pull_legs', label: 'Push / Pull / Legs' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'bro_split', label: 'Bro Split' },…».
  { value: 'bro_split', label: 'Bro Split' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'ppl_upper_lower', label: 'PPL + Upper/L…».
  { value: 'ppl_upper_lower', label: 'PPL + Upper/Lower' },
];

// Nivel: única fuente en @sanken/core (ver ROUTINE_TEMPLATE_LEVEL_LABELS) —
// acá solo se adapta a la forma {value,label}[] que ya usaban los <Picker>
// de esta pantalla, para no tocar el resto del archivo.
// Esta línea sirve para declarar «LEVEL_OPTIONS» con el valor «ROUTINE_TEMPLATE_LEVELS.map(».
export const LEVEL_OPTIONS: { value: RoutineTemplateLevel; label: string }[] = ROUTINE_TEMPLATE_LEVELS.map(
  // Esta línea sirve para declarar las opciones de nivel a partir de las etiquetas.
  (value) => ({ value, label: ROUTINE_TEMPLATE_LEVEL_LABELS[value] }),
);

// Esta línea sirve para declarar «LEVEL_LABELS» con el valor «ROUTINE_TEMPLATE_LEVEL_LABELS».
export const LEVEL_LABELS = ROUTINE_TEMPLATE_LEVEL_LABELS;

// Esta línea sirve para declarar la función «templateToDays».
export function templateToDays(template: AdminRoutineTemplate): TemplateDayFormValues[] {
  // Esta línea sirve para devolver «[...template.days]».
  return [...template.days]
    // Esta línea sirve para encadenar la operación «sort».
    .sort((a, b) => a.day_order - b.day_order)
    // Esta línea sirve para encadenar la operación «map».
    .map((day) => ({
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[...day.exercises]».
      exercises: [...day.exercises]
        // Esta línea sirve para encadenar la operación «sort».
        .sort((a, b) => a.order - b.order)
        // Esta línea sirve para encadenar la operación «map».
        .map((ex) => ({
          // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise.id».
          exercise_id: ex.exercise.id,
          // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «ex.exercise.name».
          exercise_name: ex.exercise.name,
          // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «String(ex.default_sets)».
          default_sets: String(ex.default_sets),
          // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «ex.default_reps».
          default_reps: ex.default_reps,
          // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «String(ex.rest_seconds)».
          rest_seconds: String(ex.rest_seconds),
          // Esta línea sirve para definir «default_rpe» con «ex.default_rpe !== null ? String(ex.defa…».
          default_rpe: ex.default_rpe !== null ? String(ex.default_rpe) : '',
        })),
    }));
}

// Esta línea sirve para declarar la función «buildTemplatePayload».
export function buildTemplatePayload(
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string,
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «'male' | 'female'».
  sex: 'male' | 'female',
  // Esta línea sirve para declarar la propiedad «frequencyDays» con el valor o tipo «string».
  frequencyDays: string,
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «RoutineTemplateLevel».
  level: RoutineTemplateLevel,
  // Esta línea sirve para declarar la propiedad «splitType» con el valor o tipo «RoutineSplitType».
  splitType: RoutineSplitType,
  // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «TemplateDayFormValues[]».
  days: TemplateDayFormValues[],
// Esta línea sirve para cerrar los parámetros y declarar que devuelve el payload o null.
): RoutineTemplatePayload | null {
  // Esta línea sirve para extraer «requenc» de «Number(frequencyDays)».
  const frequency = Number(frequencyDays);
  // Esta línea sirve para devolver null si «!Number.isFinite(frequency) || frequency < 1».
  if (!Number.isFinite(frequency) || frequency < 1) return null;
  // Esta línea sirve para devolver null si no hay días o alguno está incompleto.
  if (days.length === 0 || days.some((d) => !d.label.trim() || d.exercises.length === 0)) return null;
  // Esta línea sirve para devolver null si algún ejercicio no fue elegido.
  if (days.some((d) => d.exercises.some((e) => e.exercise_id === 0))) return null;

  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «name.trim() || null».
    name: name.trim() || null,
    // Esta línea sirve para incluir el valor «sex» en la lista.
    sex,
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «frequency».
    frequency_days: frequency,
    // Esta línea sirve para incluir el valor «level» en la lista.
    level,
    // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «splitType».
    split_type: splitType,
    // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «days.map((day, dayIndex) => ({».
    days: days.map((day, dayIndex) => ({
      // Esta línea sirve para declarar la propiedad «day_order» con el valor o tipo «dayIndex + 1».
      day_order: dayIndex + 1,
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «day.exercises.map((ex, exIndex) => ({».
      exercises: day.exercises.map((ex, exIndex) => ({
        // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise_id».
        exercise_id: ex.exercise_id,
        // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «exIndex + 1».
        order: exIndex + 1,
        // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «Number(ex.default_sets) || 1».
        default_sets: Number(ex.default_sets) || 1,
        // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «ex.default_reps».
        default_reps: ex.default_reps,
        // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «Number(ex.rest_seconds) || 0».
        rest_seconds: Number(ex.rest_seconds) || 0,
        // Esta línea sirve para definir «default_rpe» con «ex.default_rpe.trim() === '' ? null : Nu…».
        default_rpe: ex.default_rpe.trim() === '' ? null : Number(ex.default_rpe),
      })),
    })),
  };
}
