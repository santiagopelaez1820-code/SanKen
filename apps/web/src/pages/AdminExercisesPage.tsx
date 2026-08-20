import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AdminExercise, MuscleGroupOption } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ExerciseVideoControls } from "@/components/admin/ExerciseVideoControls"

interface ExerciseFormState {
  name: string
  primary_muscle_id: string
  equipment: string
  level: string
  type: string
  instructions: string
  video_url: string
  alternative_exercise_id: string
}

const EMPTY_FORM: ExerciseFormState = {
  name: "",
  primary_muscle_id: "",
  equipment: "barbell",
  level: "beginner",
  type: "compound",
  instructions: "",
  video_url: "",
  alternative_exercise_id: "",
}

const EQUIPMENT_OPTIONS = [
  "barbell", "dumbbells", "bench", "squat_rack", "pull_up_bar",
  "cables", "machines", "kettlebells", "resistance_bands", "bodyweight_only",
]
const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"]
const TYPE_OPTIONS = ["compound", "isolation", "cardio", "mobility"]

export function AdminExercisesPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ExerciseFormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "exercises"],
    queryFn: () => api.getWithMeta<AdminExercise[]>("/admin/exercises"),
  })
  const muscleGroups = (response?.meta?.muscle_groups as MuscleGroupOption[] | undefined) ?? []

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "exercises"] })

  const buildPayload = () => ({
    ...form,
    primary_muscle_id: Number(form.primary_muscle_id),
    video_url: form.video_url.trim() || null,
    alternative_exercise_id: form.alternative_exercise_id ? Number(form.alternative_exercise_id) : null,
  })

  const createMutation = useMutation({
    mutationFn: () => api.post("/admin/exercises", buildPayload()),
    onSuccess: () => {
      setForm(EMPTY_FORM)
      invalidate()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/exercises/${id}`, buildPayload()),
    onSuccess: () => {
      setEditingId(null)
      setForm(EMPTY_FORM)
      invalidate()
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/exercises/${id}`),
    onSuccess: invalidate,
  })

  const startEdit = (exercise: AdminExercise) => {
    setEditingId(exercise.id)
    setForm({
      name: exercise.name,
      primary_muscle_id: String(exercise.primary_muscle_id),
      equipment: exercise.equipment,
      level: exercise.level,
      type: exercise.type,
      instructions: exercise.instructions ?? "",
      video_url: exercise.video_url ?? "",
      alternative_exercise_id: exercise.alternatives[0] ? String(exercise.alternatives[0].id) : "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Ejercicios</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Volver</Link>
          </Button>
        </header>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar ejercicio" : "Nuevo ejercicio"}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <select
              value={form.primary_muscle_id}
              onChange={(e) => setForm({ ...form, primary_muscle_id: e.target.value })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              <option value="">Músculo principal…</option>
              {muscleGroups.map((muscle) => (
                <option key={muscle.id} value={muscle.id}>
                  {muscle.name}
                </option>
              ))}
            </select>
            <select
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {EQUIPMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Instrucciones (opcional)"
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <input
              placeholder="URL del video (opcional)"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <select
              value={form.alternative_exercise_id}
              onChange={(e) => setForm({ ...form, alternative_exercise_id: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              <option value="">Sin ejercicio alternativo (A/B)</option>
              {(response?.data ?? [])
                .filter((exercise) => exercise.id !== editingId)
                .map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            {editingId ? (
              <>
                <Button
                  size="sm"
                  onClick={() => updateMutation.mutate(editingId)}
                  disabled={!form.name || !form.primary_muscle_id || updateMutation.isPending}
                >
                  Guardar cambios
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => createMutation.mutate()}
                disabled={!form.name || !form.primary_muscle_id || createMutation.isPending}
              >
                Crear
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          {!isLoading && response && (
            <ul className="divide-y divide-border">
              {response.data.map((exercise) => (
                <li key={exercise.id} className="flex flex-col gap-2 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => startEdit(exercise)}
                      className={`flex-1 text-left text-sm ${exercise.is_active ? "" : "opacity-50"}`}
                    >
                      {exercise.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        · {exercise.primary_muscle.name} · {exercise.equipment} · {exercise.level}
                        {exercise.alternatives[0] && ` · alt: ${exercise.alternatives[0].name}`}
                        {!exercise.is_active && " · inactivo"}
                      </span>
                    </button>
                    {exercise.is_active && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deactivateMutation.mutate(exercise.id)}
                        disabled={deactivateMutation.isPending}
                      >
                        Desactivar
                      </Button>
                    )}
                  </div>
                  <ExerciseVideoControls exercise={exercise} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
