import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { GamificationEventResult, LoggedWorkoutSet, Routine, WorkoutExercise, WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RestTimer } from "@/components/workout/RestTimer"
import { LevelUpModal } from "@/components/workout/LevelUpModal"

function updateExercise(
  session: WorkoutSession,
  exerciseId: number,
  updater: (exercise: WorkoutExercise) => WorkoutExercise,
): WorkoutSession {
  return {
    ...session,
    exercises: session.exercises.map((e) => (e.id === exerciseId ? updater(e) : e)),
  }
}

export function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const sessionQuery = useQuery({
    queryKey: ["workout-sessions", sessionId],
    queryFn: () => api.get<WorkoutSession>(`/workout-sessions/${sessionId}`),
    enabled: Boolean(sessionId),
    retry: false,
  })

  const routineQuery = useQuery({
    queryKey: ["routines", "active"],
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [restingUntil, setRestingUntil] = useState<number | null>(null)
  const [lastSetWasPersonalRecord, setLastSetWasPersonalRecord] = useState(false)
  const [weightInput, setWeightInput] = useState("")
  const [repsInput, setRepsInput] = useState("")
  const [rpeInput, setRpeInput] = useState("")
  const [levelUpResult, setLevelUpResult] = useState<GamificationEventResult | null>(null)

  const session = sessionQuery.data
  const routine = routineQuery.data?.data ?? null
  const routineDay = routine?.days.find((d) => d.id === session?.routine_day_id) ?? null
  const currentExercise = session?.exercises[currentIndex] ?? null
  const targetExercise = routineDay?.exercises[currentIndex] ?? null
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false

  useEffect(() => {
    setWeightInput(targetExercise?.suggested_weight_kg?.toString() ?? "")
    setRepsInput("")
    setRpeInput("")
  }, [currentIndex, targetExercise?.suggested_weight_kg])

  const logSetMutation = useMutation({
    mutationFn: (payload: { weight_kg: number; reps: number; rpe?: number }) =>
      api.post<LoggedWorkoutSet>(`/workout-sessions/${sessionId}/exercises/${currentExercise!.id}/sets`, payload),
    onSuccess: (loggedSet) => {
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        old ? updateExercise(old, currentExercise!.id, (e) => ({ ...e, sets: [...e.sets, loggedSet] })) : old,
      )
      setLastSetWasPersonalRecord(loggedSet.is_personal_record)
      setRestingUntil(Date.now() + (targetExercise?.rest_seconds ?? 90) * 1000)
      setRepsInput("")
      setRpeInput("")
    },
  })

  const finishExerciseMutation = useMutation({
    mutationFn: (workoutExerciseId: number) =>
      api.patch(`/workout-sessions/${sessionId}/exercises/${workoutExerciseId}`, { all_sets_completed: true }),
    onSuccess: (_data, workoutExerciseId) => {
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        old ? updateExercise(old, workoutExerciseId, (e) => ({ ...e, all_sets_completed: true })) : old,
      )
    },
  })

  const completeMutation = useMutation({
    mutationFn: (duration_minutes: number) =>
      api.postWithMeta<WorkoutSession>(`/workout-sessions/${sessionId}/complete`, { duration_minutes }),
    onSuccess: (envelope) => {
      queryClient.setQueryData(["workout-sessions", sessionId], envelope.data)
      queryClient.invalidateQueries({ queryKey: ["routines", "active"] })
      queryClient.invalidateQueries({ queryKey: ["gamification"] })
      const gamification = envelope.meta?.gamification as GamificationEventResult | undefined
      if (gamification?.leveled_up) setLevelUpResult(gamification)
    },
  })

  const feedbackMutation = useMutation({
    mutationFn: (completed_as_planned: boolean) =>
      api.post<WorkoutSession>(`/workout-sessions/${sessionId}/feedback`, { completed_as_planned }),
    onSuccess: (updated) => queryClient.setQueryData(["workout-sessions", sessionId], updated),
  })

  if (sessionQuery.isError) {
    return <Navigate to="/dashboard" replace />
  }

  if (sessionQuery.isLoading || !session) {
    return (
      <main className="min-h-svh bg-background px-6 py-8 text-foreground">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </main>
    )
  }

  async function handleLogSet() {
    const weight = Number(weightInput)
    const reps = Number(repsInput)
    if (!Number.isFinite(weight) || weight < 0 || !Number.isFinite(reps) || reps < 1) return
    const rpe = rpeInput.trim() === "" ? undefined : Number(rpeInput)
    await logSetMutation.mutateAsync({ weight_kg: weight, reps, rpe })
  }

  async function handleAdvance() {
    if (!currentExercise || !session) return
    await finishExerciseMutation.mutateAsync(currentExercise.id)

    if (isLastExercise) {
      // performed_at es solo fecha (medianoche), no datetime — completar
      // tarde en el día puede inflar este cálculo muy por encima del
      // máximo que valida el backend (600 min), así que se acota.
      const durationMinutes = Math.min(
        600,
        Math.max(1, Math.round((Date.now() - new Date(session.performed_at).getTime()) / 60000)),
      )
      await completeMutation.mutateAsync(durationMinutes)
    } else {
      setCurrentIndex((i) => i + 1)
      setRestingUntil(null)
      setLastSetWasPersonalRecord(false)
    }
  }

  // Feedback post-sesión: máquina de estados derivada de `session`, sin estado propio.
  if (session.completed && session.completed_as_planned === null) {
    return (
      <main className="min-h-svh bg-background px-6 py-8 text-foreground">
        <LevelUpModal result={levelUpResult} onClose={() => setLevelUpResult(null)} />
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-2xl font-medium tracking-tight">¡Entrenamiento completado!</h1>
          <p className="text-sm text-muted-foreground">
            ¿Pudiste completar el entrenamiento tal como estaba planeado?
          </p>
          <div className="flex gap-3">
            <Button disabled={feedbackMutation.isPending} onClick={() => feedbackMutation.mutate(true)}>
              Sí
            </Button>
            <Button
              variant="outline"
              disabled={feedbackMutation.isPending}
              onClick={() => feedbackMutation.mutate(false)}
            >
              No
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (session.completed && session.completed_as_planned !== null) {
    return (
      <main className="min-h-svh bg-background px-6 py-8 text-foreground">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Buen trabajo</h1>
          <p className="text-sm text-muted-foreground">
            {session.completed_as_planned
              ? "La próxima vez ajustaremos el peso automáticamente para seguir progresando."
              : "La próxima vez mantendremos el mismo peso para consolidar la técnica."}
          </p>
          <Button onClick={() => navigate("/dashboard")}>Volver al dashboard</Button>
        </div>
      </main>
    )
  }

  if (!currentExercise) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Ejercicio {currentIndex + 1} de {session.exercises.length}
            </p>
            <h1 className="font-heading text-xl font-medium tracking-tight">{currentExercise.exercise.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xs text-muted-foreground hover:underline"
          >
            Salir
          </button>
        </header>

        {targetExercise && (
          <p className="text-sm text-muted-foreground">
            Meta: {targetExercise.target_sets}×{targetExercise.target_reps}
            {targetExercise.target_rpe ? ` · RPE ${targetExercise.target_rpe}` : ""} · descanso{" "}
            {targetExercise.rest_seconds}s
          </p>
        )}

        {lastSetWasPersonalRecord && (
          <div className="rounded-lg border border-primary/25 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
            🏆 ¡Nuevo récord personal!
          </div>
        )}

        <RestTimer restingUntil={restingUntil} onSkip={() => setRestingUntil(null)} />

        {currentExercise.sets.length > 0 && (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {currentExercise.sets.map((set) => (
              <li key={set.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="text-muted-foreground">Serie {set.set_number}</span>
                <span className="text-foreground">
                  {set.weight_kg} kg × {set.reps}
                  {set.rpe !== null ? ` · RPE ${set.rpe}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Peso (kg)</label>
            <input
              type="number"
              step="0.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Reps</label>
            <input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">RPE</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={rpeInput}
              onChange={(e) => setRpeInput(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <Button
            type="button"
            className="col-span-3"
            disabled={logSetMutation.isPending}
            onClick={handleLogSet}
          >
            Registrar serie
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={finishExerciseMutation.isPending || completeMutation.isPending}
          onClick={handleAdvance}
        >
          {isLastExercise ? "Finalizar entrenamiento" : "Siguiente ejercicio"}
        </Button>
      </div>
    </main>
  )
}
