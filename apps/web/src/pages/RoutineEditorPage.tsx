import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ApiError,
  type ExerciseCatalogItem,
  type FitnessGoal,
  type ManualRoutinePayload,
  type Routine,
  type SplitType,
} from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RoutineDayFieldset } from "@/components/trainer/RoutineDayFieldset"
import {
  EMPTY_DAY,
  GOAL_OPTIONS,
  SPLIT_OPTIONS,
  type RoutineFormValues,
} from "@/components/trainer/routine-form-types"

const GOAL_VALUES = GOAL_OPTIONS.map((o) => o.value) as [FitnessGoal, ...FitnessGoal[]]
const SPLIT_VALUES = SPLIT_OPTIONS.map((o) => o.value) as [SplitType, ...SplitType[]]

const exerciseSchema = z.object({
  exercise_id: z.number().int().positive("Selecciona un ejercicio"),
  target_sets: z.number().int().min(1).max(10),
  target_reps: z.string().min(1, "Requerido").max(20),
  rest_seconds: z.number().int().min(0).max(600),
  target_rpe: z.number().min(0).max(10).nullable(),
})

const daySchema = z.object({
  label: z.string().min(1, "Ponle un nombre al día").max(100),
  target_muscle_groups: z.string().max(500),
  exercises: z.array(exerciseSchema).min(1, "Agrega al menos un ejercicio"),
})

const routineSchema = z.object({
  goal: z.enum(GOAL_VALUES),
  split_type: z.enum(SPLIT_VALUES),
  frequency_days: z.number().int().min(1).max(7),
  duration_weeks: z.number().int().min(1).max(24),
  days: z.array(daySchema).min(1, "Agrega al menos un día"),
})

const defaultValues: RoutineFormValues = {
  goal: "gain_muscle",
  split_type: "full_body",
  frequency_days: 3,
  duration_weeks: 6,
  days: [EMPTY_DAY],
}

function toFormValues(routine: Routine): RoutineFormValues {
  return {
    goal: routine.goal,
    split_type: routine.split_type,
    frequency_days: routine.frequency_days,
    duration_weeks: routine.duration_weeks,
    days: [...routine.days]
      .sort((a, b) => a.day_order - b.day_order)
      .map((day) => ({
        label: day.label,
        target_muscle_groups: (day.target_muscle_groups ?? []).join(", "),
        exercises: [...day.exercises]
          .sort((a, b) => a.order - b.order)
          .map((ex) => ({
            exercise_id: ex.exercise.id,
            target_sets: ex.target_sets,
            target_reps: ex.target_reps,
            rest_seconds: ex.rest_seconds,
            target_rpe: ex.target_rpe,
          })),
      })),
  }
}

function toPayload(values: RoutineFormValues): ManualRoutinePayload {
  return {
    goal: values.goal,
    split_type: values.split_type,
    frequency_days: values.frequency_days,
    duration_weeks: values.duration_weeks,
    days: values.days.map((day, dayIndex) => ({
      day_order: dayIndex + 1,
      label: day.label,
      target_muscle_groups: day.target_muscle_groups
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      exercises: day.exercises.map((ex, exIndex) => ({
        exercise_id: ex.exercise_id,
        order: exIndex + 1,
        target_sets: ex.target_sets,
        target_reps: ex.target_reps,
        rest_seconds: ex.rest_seconds,
        target_rpe: ex.target_rpe,
      })),
    })),
  }
}

export function RoutineEditorPage() {
  const { trainerClientId, routineId } = useParams<{ trainerClientId?: string; routineId?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(routineId)
  const [serverError, setServerError] = useState<string | null>(null)

  const { data: exerciseCatalog } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  const { data: existingRoutine } = useQuery({
    queryKey: ["trainer", "routines", routineId],
    queryFn: () => api.get<Routine>(`/trainer/routines/${routineId}`),
    enabled: isEditing,
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues,
  })

  useEffect(() => {
    if (existingRoutine) {
      reset(toFormValues(existingRoutine))
    }
  }, [existingRoutine, reset])

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({ control, name: "days" })

  const mutation = useMutation({
    mutationFn: (values: RoutineFormValues) =>
      isEditing
        ? api.patch<Routine>(`/trainer/routines/${routineId}`, toPayload(values))
        : api.post<Routine>(`/trainer/clients/${trainerClientId}/routines`, toPayload(values)),
    onSuccess: () => {
      setServerError(null)
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
      queryClient.invalidateQueries({ queryKey: ["trainer", "routines"] })
      if (isEditing) {
        navigate(-1)
      } else {
        navigate(`/trainer/clients/${trainerClientId}`)
      }
    },
    onError: (err) => {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo guardar la rutina.")
    },
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs text-muted-foreground hover:underline"
          >
            ← Volver
          </button>
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">
            {isEditing ? "Editar rutina" : "Nueva rutina manual"}
          </h1>
        </header>

        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-4">
          <section className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Objetivo</label>
              <select
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("goal")}
              >
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Split</label>
              <select
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("split_type")}
              >
                {SPLIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Días/semana</label>
              <input
                type="number"
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("frequency_days", { valueAsNumber: true })}
              />
              {errors.frequency_days && (
                <p className="text-xs text-destructive">{errors.frequency_days.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Semanas</label>
              <input
                type="number"
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("duration_weeks", { valueAsNumber: true })}
              />
              {errors.duration_weeks && (
                <p className="text-xs text-destructive">{errors.duration_weeks.message}</p>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-3">
            {dayFields.map((field, dayIndex) => (
              <RoutineDayFieldset
                key={field.id}
                control={control}
                register={register}
                dayIndex={dayIndex}
                canRemoveDay={dayFields.length > 1}
                onRemoveDay={() => removeDay(dayIndex)}
                exercises={exerciseCatalog ?? []}
                errors={errors}
              />
            ))}
          </div>
          {errors.days?.message && <p className="text-xs text-destructive">{errors.days.message}</p>}

          <Button type="button" variant="outline" size="sm" onClick={() => appendDay(EMPTY_DAY)}>
            + Agregar día
          </Button>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Guardando…" : "Guardar rutina"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
