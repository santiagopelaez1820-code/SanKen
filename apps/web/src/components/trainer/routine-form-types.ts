import type { FitnessGoal } from "@sanken/core"
import type { SplitType } from "@sanken/core"

export interface ExerciseFormValues {
  exercise_id: number
  target_sets: number
  target_reps: string
  rest_seconds: number
  target_rpe: number | null
}

export interface DayFormValues {
  label: string
  target_muscle_groups: string
  exercises: ExerciseFormValues[]
}

export interface RoutineFormValues {
  goal: FitnessGoal
  split_type: SplitType
  frequency_days: number
  duration_weeks: number
  days: DayFormValues[]
}

export const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  { value: "gain_muscle", label: "Ganar músculo" },
  { value: "body_recomposition", label: "Recomposición corporal" },
  { value: "strength", label: "Fuerza" },
  { value: "sport_performance", label: "Rendimiento deportivo" },
  { value: "lose_fat", label: "Perder grasa" },
  { value: "health", label: "Salud general" },
  { value: "endurance", label: "Resistencia muscular" },
  { value: "cardio", label: "Cardio" },
]

export const SPLIT_OPTIONS: { value: SplitType; label: string }[] = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "push_pull_legs", label: "Push / Pull / Legs" },
  { value: "bro_split", label: "Bro Split" },
]

export const EMPTY_EXERCISE: ExerciseFormValues = {
  exercise_id: 0,
  target_sets: 3,
  target_reps: "8-12",
  rest_seconds: 90,
  target_rpe: null,
}

export const EMPTY_DAY: DayFormValues = {
  label: "",
  target_muscle_groups: "",
  exercises: [EMPTY_EXERCISE],
}
