import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AdminRoutineTemplate, ExerciseCatalogItem, RoutineSplitType, RoutineTemplatePayload } from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"

interface ExerciseFormRow {
  exercise_id: string
  default_sets: string
  default_reps: string
  rest_seconds: string
  default_rpe: string
}

interface DayFormRow {
  label: string
  exercises: ExerciseFormRow[]
}

interface TemplateFormState {
  name: string
  sex: "male" | "female"
  frequency_days: string
  split_type: RoutineSplitType
  days: DayFormRow[]
}

const EMPTY_EXERCISE: ExerciseFormRow = {
  exercise_id: "",
  default_sets: "3",
  default_reps: "10",
  rest_seconds: "90",
  default_rpe: "",
}

const EMPTY_DAY: DayFormRow = { label: "", exercises: [{ ...EMPTY_EXERCISE }] }

const EMPTY_FORM: TemplateFormState = {
  name: "",
  sex: "male",
  frequency_days: "3",
  split_type: "full_body",
  days: [{ ...EMPTY_DAY }],
}

const SPLIT_OPTIONS: RoutineSplitType[] = ["full_body", "upper_lower", "push_pull_legs", "bro_split", "ppl_upper_lower"]

const selectClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
const inputClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"

function templateToForm(template: AdminRoutineTemplate): TemplateFormState {
  return {
    name: template.name ?? "",
    sex: template.sex,
    frequency_days: String(template.frequency_days),
    split_type: template.split_type,
    days: template.days.map((day) => ({
      label: day.label,
      exercises: day.exercises.map((ex) => ({
        exercise_id: String(ex.exercise_id),
        default_sets: String(ex.default_sets),
        default_reps: ex.default_reps,
        rest_seconds: String(ex.rest_seconds),
        default_rpe: ex.default_rpe !== null ? String(ex.default_rpe) : "",
      })),
    })),
  }
}

function buildPayload(form: TemplateFormState): RoutineTemplatePayload {
  return {
    name: form.name.trim() || null,
    sex: form.sex,
    frequency_days: Number(form.frequency_days),
    split_type: form.split_type,
    days: form.days.map((day, dayIndex) => ({
      day_order: dayIndex + 1,
      label: day.label,
      exercises: day.exercises.map((ex, exIndex) => ({
        exercise_id: Number(ex.exercise_id),
        order: exIndex + 1,
        default_sets: Number(ex.default_sets),
        default_reps: ex.default_reps,
        rest_seconds: Number(ex.rest_seconds),
        default_rpe: ex.default_rpe.trim() ? Number(ex.default_rpe) : null,
      })),
    })),
  }
}

function isFormValid(form: TemplateFormState): boolean {
  if (!form.frequency_days || form.days.length === 0) return false
  return form.days.every(
    (day) => day.label.trim() && day.exercises.length > 0 && day.exercises.every((ex) => ex.exercise_id),
  )
}

export function AdminRoutineTemplatesPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<TemplateFormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<number | null>(null)

  const { data: templates, isLoading } = useQuery({
    queryKey: ["admin", "routine-templates"],
    queryFn: () => api.get<AdminRoutineTemplate[]>("/admin/routine-templates"),
  })

  const { data: exerciseCatalog } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "routine-templates"] })

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  const handleError = (err: unknown) => {
    setFormError(err instanceof ApiError ? err.body.message : "No se pudo guardar la plantilla.")
  }

  const createMutation = useMutation({
    mutationFn: () => api.post("/admin/routine-templates", buildPayload(form)),
    onSuccess: () => {
      resetForm()
      invalidate()
    },
    onError: handleError,
  })

  const updateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}`, buildPayload(form)),
    onSuccess: () => {
      resetForm()
      invalidate()
    },
    onError: handleError,
  })

  const duplicateMutation = useMutation({
    mutationFn: (id: number) => api.post(`/admin/routine-templates/${id}/duplicate`),
    onSuccess: invalidate,
  })

  const activateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}/activate`),
    onSuccess: invalidate,
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}/deactivate`),
    onSuccess: () => {
      setConfirmingDeactivateId(null)
      invalidate()
    },
    onError: (err) => {
      setConfirmingDeactivateId(null)
      handleError(err)
    },
  })

  const startEdit = (template: AdminRoutineTemplate) => {
    setEditingId(template.id)
    setForm(templateToForm(template))
    setFormError(null)
  }

  const updateDay = (dayIndex: number, patch: Partial<DayFormRow>) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, i) => (i === dayIndex ? { ...day, ...patch } : day)),
    }))
  }

  const updateExercise = (dayIndex: number, exIndex: number, patch: Partial<ExerciseFormRow>) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex
          ? { ...day, exercises: day.exercises.map((ex, j) => (j === exIndex ? { ...ex, ...patch } : ex)) }
          : day,
      ),
    }))
  }

  const addDay = () => setForm((prev) => ({ ...prev, days: [...prev.days, { ...EMPTY_DAY, exercises: [{ ...EMPTY_EXERCISE }] }] }))
  const removeDay = (dayIndex: number) =>
    setForm((prev) => ({ ...prev, days: prev.days.filter((_, i) => i !== dayIndex) }))

  const addExercise = (dayIndex: number) =>
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, i) => (i === dayIndex ? { ...day, exercises: [...day.exercises, { ...EMPTY_EXERCISE }] } : day)),
    }))
  const removeExercise = (dayIndex: number, exIndex: number) =>
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, i) =>
        i === dayIndex ? { ...day, exercises: day.exercises.filter((_, j) => j !== exIndex) } : day,
      ),
    }))

  const moveExercise = (dayIndex: number, exIndex: number, direction: -1 | 1) =>
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, i) => {
        if (i !== dayIndex) return day
        const target = exIndex + direction
        if (target < 0 || target >= day.exercises.length) return day
        const exercises = [...day.exercises]
        ;[exercises[exIndex], exercises[target]] = [exercises[target], exercises[exIndex]]
        return { ...day, exercises }
      }),
    }))

  const grouped = new Map<string, AdminRoutineTemplate[]>()
  for (const t of templates ?? []) {
    const key = `${t.sex}-${t.frequency_days}`
    grouped.set(key, [...(grouped.get(key) ?? []), t])
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Rutinas generales</h1>

        <p className="text-sm text-muted-foreground">
          Estas son las plantillas que el motor asigna automáticamente a cada usuario según su sexo y la frecuencia
          de entrenamiento que eligió en el onboarding. Editar una plantilla no modifica el historial de
          entrenamientos ya realizados por nadie — solo afecta a quién reciba esta plantilla de ahora en adelante.
        </p>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar plantilla" : "Nueva plantilla"}</h2>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              placeholder="Nombre (opcional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`col-span-2 ${inputClass}`}
            />
            <select
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value as "male" | "female" })}
              className={selectClass}
            >
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
            </select>
            <input
              type="number"
              min={1}
              max={7}
              placeholder="Días por semana"
              value={form.frequency_days}
              onChange={(e) => setForm({ ...form, frequency_days: e.target.value })}
              className={inputClass}
            />
            <select
              value={form.split_type}
              onChange={(e) => setForm({ ...form, split_type: e.target.value as RoutineSplitType })}
              className={`col-span-2 ${selectClass}`}
            >
              {SPLIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 space-y-4">
            {form.days.map((day, dayIndex) => (
              <div key={dayIndex} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <input
                    placeholder={`Día ${dayIndex + 1} (ej. Empuje)`}
                    value={day.label}
                    onChange={(e) => updateDay(dayIndex, { label: e.target.value })}
                    className={`flex-1 ${inputClass}`}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeDay(dayIndex)} disabled={form.days.length <= 1}>
                    Quitar día
                  </Button>
                </div>

                <div className="mt-3 space-y-2">
                  {day.exercises.map((ex, exIndex) => (
                    <div key={exIndex} className="flex flex-wrap items-center gap-1.5">
                      <select
                        value={ex.exercise_id}
                        onChange={(e) => updateExercise(dayIndex, exIndex, { exercise_id: e.target.value })}
                        className={`min-w-[180px] flex-1 ${selectClass}`}
                      >
                        <option value="">Ejercicio…</option>
                        {exerciseCatalog?.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        title="Series"
                        value={ex.default_sets}
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_sets: e.target.value })}
                        className={`w-16 ${inputClass}`}
                      />
                      <input
                        placeholder="Reps"
                        title="Repeticiones"
                        value={ex.default_reps}
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_reps: e.target.value })}
                        className={`w-16 ${inputClass}`}
                      />
                      <input
                        type="number"
                        min={0}
                        max={600}
                        title="Descanso (seg)"
                        value={ex.rest_seconds}
                        onChange={(e) => updateExercise(dayIndex, exIndex, { rest_seconds: e.target.value })}
                        className={`w-20 ${inputClass}`}
                      />
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        placeholder="RPE"
                        title="RPE objetivo (opcional)"
                        value={ex.default_rpe}
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_rpe: e.target.value })}
                        className={`w-16 ${inputClass}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveExercise(dayIndex, exIndex, -1)}
                        disabled={exIndex === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveExercise(dayIndex, exIndex, 1)}
                        disabled={exIndex === day.exercises.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeExercise(dayIndex, exIndex)}
                        disabled={day.exercises.length <= 1}
                      >
                        Quitar
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addExercise(dayIndex)}>
                    + Agregar ejercicio
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addDay}>
              + Agregar día
            </Button>
          </div>

          {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}

          <div className="mt-4 flex gap-2">
            {editingId ? (
              <>
                <Button
                  size="sm"
                  onClick={() => updateMutation.mutate(editingId)}
                  disabled={!isFormValid(form) || updateMutation.isPending}
                >
                  Guardar cambios
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => createMutation.mutate()} disabled={!isFormValid(form) || createMutation.isPending}>
                Crear (queda inactiva hasta que la actives)
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <Skeleton className="h-20 w-full" />}

          {!isLoading &&
            Array.from(grouped.entries()).map(([key, group]) => (
              <div key={key} className="mb-4 last:mb-0">
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {group[0].sex === "male" ? "Hombre" : "Mujer"} · {group[0].frequency_days} días
                </p>
                <ul className="mt-1 divide-y divide-border">
                  {group.map((template) => (
                    <li key={template.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-sm text-foreground">
                          {template.name ?? `Plantilla #${template.id}`}
                          {template.is_active ? (
                            <span className="ml-2 text-xs text-primary">● Activa</span>
                          ) : (
                            <span className="ml-2 text-xs text-muted-foreground">○ Inactiva</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {template.split_type} · {template.days.length} días · {template.days.reduce((n, d) => n + d.exercises.length, 0)} ejercicios
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => startEdit(template)}>
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateMutation.mutate(template.id)}
                          disabled={duplicateMutation.isPending}
                        >
                          Duplicar
                        </Button>
                        {template.is_active ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmingDeactivateId(template.id)}
                          >
                            Desactivar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => activateMutation.mutate(template.id)}
                            disabled={activateMutation.isPending}
                          >
                            Activar
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>

        <ConfirmDialog
          open={confirmingDeactivateId !== null}
          title="¿Desactivar esta plantilla?"
          description="Deja de asignarse a usuarios nuevos. Si es la única activa para ese sexo y frecuencia, el servidor va a rechazar la desactivación."
          confirmLabel="Sí, desactivar"
          destructive
          isLoading={deactivateMutation.isPending}
          onConfirm={() => confirmingDeactivateId && deactivateMutation.mutate(confirmingDeactivateId)}
          onCancel={() => setConfirmingDeactivateId(null)}
        />
      </div>
    </main>
  )
}
