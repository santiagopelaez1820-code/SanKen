import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import type { ExerciseCatalogItem } from "@sanken/core"
import { Button } from "@/components/ui/button"
import { EMPTY_EXERCISE, type RoutineFormValues } from "./routine-form-types"

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

interface RoutineDayFieldsetProps {
  control: Control<RoutineFormValues>
  register: UseFormRegister<RoutineFormValues>
  dayIndex: number
  onRemoveDay: () => void
  canRemoveDay: boolean
  exercises: ExerciseCatalogItem[]
  errors: FieldErrors<RoutineFormValues>
}

export function RoutineDayFieldset({
  control,
  register,
  dayIndex,
  onRemoveDay,
  canRemoveDay,
  exercises,
  errors,
}: RoutineDayFieldsetProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.exercises`,
  })

  const dayErrors = errors.days?.[dayIndex]

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Nombre del día</label>
          <input
            className={fieldClass}
            placeholder="Ej. Push, Pierna, Full Body A"
            {...register(`days.${dayIndex}.label` as const)}
          />
          {dayErrors?.label && <p className="text-xs text-destructive">{dayErrors.label.message}</p>}
        </div>
        {canRemoveDay && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemoveDay}>
            Quitar día
          </Button>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Grupos musculares (separados por coma)
        </label>
        <input
          className={fieldClass}
          placeholder="chest, back, shoulders"
          {...register(`days.${dayIndex}.target_muscle_groups` as const)}
        />
      </div>

      <div className="mt-4 space-y-3">
        {fields.map((field, exIndex) => {
          const exerciseErrors = dayErrors?.exercises?.[exIndex]
          return (
            <div key={field.id} className="grid grid-cols-12 gap-2 rounded-lg bg-muted/50 p-3">
              <div className="col-span-12 sm:col-span-4">
                <select
                  className={fieldClass}
                  defaultValue={0}
                  {...register(`days.${dayIndex}.exercises.${exIndex}.exercise_id` as const, {
                    valueAsNumber: true,
                  })}
                >
                  <option value={0}>Selecciona un ejercicio…</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} — {ex.primary_muscle.name} ({ex.equipment})
                    </option>
                  ))}
                </select>
                {exerciseErrors?.exercise_id && (
                  <p className="mt-1 text-xs text-destructive">{exerciseErrors.exercise_id.message}</p>
                )}
              </div>

              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  placeholder="Series"
                  className={fieldClass}
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_sets` as const, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <input
                  type="text"
                  placeholder="Reps (ej. 8-12)"
                  className={fieldClass}
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_reps` as const)}
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  placeholder="Descanso (s)"
                  className={fieldClass}
                  {...register(`days.${dayIndex}.exercises.${exIndex}.rest_seconds` as const, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="col-span-8 sm:col-span-1">
                <input
                  type="number"
                  step="0.5"
                  placeholder="RPE"
                  className={fieldClass}
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_rpe` as const, {
                    setValueAs: (value) => (value === "" ? null : Number(value)),
                  })}
                />
              </div>

              <div className="col-span-4 sm:col-span-1 flex items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(exIndex)}
                  disabled={fields.length <= 1}
                >
                  ✕
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {dayErrors?.exercises?.message && (
        <p className="mt-2 text-xs text-destructive">{dayErrors.exercises.message}</p>
      )}

      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => append(EMPTY_EXERCISE)}>
        + Agregar ejercicio
      </Button>
    </div>
  )
}
