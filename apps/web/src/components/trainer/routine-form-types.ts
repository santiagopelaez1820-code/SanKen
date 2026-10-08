// Esta línea sirve para importar los tipos «FitnessGoal» desde «@sanken/core».
import type { FitnessGoal } from "@sanken/core"
// Esta línea sirve para importar los tipos «SplitType» desde «@sanken/core».
import type { SplitType } from "@sanken/core"

// Esta línea sirve para declarar la interfaz «ExerciseFormValues».
export interface ExerciseFormValues {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «number».
  exercise_id: number
  // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «number».
  target_sets: number
  // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «string».
  target_reps: string
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «number».
  rest_seconds: number
  // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «number | null».
  target_rpe: number | null
}

// Esta línea sirve para declarar la interfaz «DayFormValues».
export interface DayFormValues {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «string».
  target_muscle_groups: string
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «ExerciseFormValues[]».
  exercises: ExerciseFormValues[]
}

// Esta línea sirve para declarar la interfaz «RoutineFormValues».
export interface RoutineFormValues {
  // Esta línea sirve para declarar la propiedad «goal» con el valor o tipo «FitnessGoal».
  goal: FitnessGoal
  // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «SplitType».
  split_type: SplitType
  // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «number».
  frequency_days: number
  // Esta línea sirve para declarar la propiedad «duration_weeks» con el valor o tipo «number».
  duration_weeks: number
  // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «DayFormValues[]».
  days: DayFormValues[]
}

// Esta línea sirve para declarar las opciones de objetivo de entrenamiento.
export const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  // Esta línea sirve para agregar la opción «Ganar músculo».
  { value: "gain_muscle", label: "Ganar músculo" },
  // Esta línea sirve para agregar la opción «Recomposición corporal».
  { value: "body_recomposition", label: "Recomposición corporal" },
  // Esta línea sirve para agregar la opción «Fuerza».
  { value: "strength", label: "Fuerza" },
  // Esta línea sirve para agregar la opción «Rendimiento deportivo».
  { value: "sport_performance", label: "Rendimiento deportivo" },
  // Esta línea sirve para agregar la opción «Perder grasa».
  { value: "lose_fat", label: "Perder grasa" },
  // Esta línea sirve para agregar la opción «Salud general».
  { value: "health", label: "Salud general" },
  // Esta línea sirve para agregar la opción «Resistencia muscular».
  { value: "endurance", label: "Resistencia muscular" },
  // Esta línea sirve para agregar la opción «Cardio».
  { value: "cardio", label: "Cardio" },
]

// Esta línea sirve para declarar las opciones de tipo de división de rutina.
export const SPLIT_OPTIONS: { value: SplitType; label: string }[] = [
  // Esta línea sirve para agregar la opción «Full Body».
  { value: "full_body", label: "Full Body" },
  // Esta línea sirve para agregar la opción «Upper / Lower».
  { value: "upper_lower", label: "Upper / Lower" },
  // Esta línea sirve para agregar la opción «Push / Pull / Legs».
  { value: "push_pull_legs", label: "Push / Pull / Legs" },
  // Esta línea sirve para agregar la opción «Bro Split».
  { value: "bro_split", label: "Bro Split" },
]

// Esta línea sirve para declarar los valores vacíos de un ejercicio nuevo.
export const EMPTY_EXERCISE: ExerciseFormValues = {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «0».
  exercise_id: 0,
  // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «3».
  target_sets: 3,
  // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «"8-12"».
  target_reps: "8-12",
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «90».
  rest_seconds: 90,
  // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «null».
  target_rpe: null,
}

// Esta línea sirve para declarar los valores vacíos de un día nuevo.
export const EMPTY_DAY: DayFormValues = {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «""».
  label: "",
  // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «""».
  target_muscle_groups: "",
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[EMPTY_EXERCISE]».
  exercises: [EMPTY_EXERCISE],
}
