import { useEffect, useMemo, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { GamificationEventResult, LoggedWorkoutSet, WorkoutExercise, WorkoutSession } from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { RestTimer } from "@/components/workout/RestTimer"
import { LevelUpModal } from "@/components/workout/LevelUpModal"
import { ExerciseVideoPlayer } from "@/components/workout/ExerciseVideoPlayer"

const ADVANCE_DELAY_MS = 900

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

  const [restingUntil, setRestingUntil] = useState<number | null>(null)
  const [lastSetWasPersonalRecord, setLastSetWasPersonalRecord] = useState(false)
  const [weightInput, setWeightInput] = useState("")
  const [repsInput, setRepsInput] = useState("")
  const [rpeInput, setRpeInput] = useState("")
  const [levelUpResult, setLevelUpResult] = useState<GamificationEventResult | null>(null)
  const [justSwapped, setJustSwapped] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const session = sessionQuery.data

  // currentIndex es un valor derivado, no estado propio: el primer ejercicio
  // sin las 3 series completas. Esto es lo que hace que recargar la página a
  // mitad de sesión conserve el progreso — GET /workout-sessions/:id ya trae
  // all_sets_completed por ejercicio, no hace falta guardar nada aparte.
  const currentIndex = useMemo(() => {
    if (!session) return 0
    const idx = session.exercises.findIndex((e) => !e.all_sets_completed)
    return idx === -1 ? session.exercises.length - 1 : idx
  }, [session])

  const currentExercise = session?.exercises[currentIndex] ?? null
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false
  const allExercisesCompleted = session ? session.exercises.every((e) => e.all_sets_completed) : false

  // Reps recomendadas para la PRÓXIMA serie de este ejercicio (índice =
  // cuántas ya se registraron) — cada serie puede tener un objetivo
  // distinto (ver ProgressiveOverloadCalculator, rampa por serie).
  const nextSetIndex = currentExercise?.sets.length ?? 0
  const suggestedRepsForNextSet = currentExercise?.suggested_reps_per_set?.[nextSetIndex] ?? null

  useEffect(() => {
    setWeightInput(currentExercise?.suggested_weight_kg?.toString() ?? "")
    setRpeInput("")
    setJustSwapped(false)
    setSwapError(null)
    setLastSetWasPersonalRecord(false)
    setRestingUntil(null)
  }, [currentExercise?.id])

  useEffect(() => {
    setRepsInput(suggestedRepsForNextSet !== null ? String(suggestedRepsForNextSet) : "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id, nextSetIndex])

  const swapExerciseMutation = useMutation({
    mutationFn: () => api.post<WorkoutExercise>(`/workout-sessions/${sessionId}/exercises/${currentExercise!.id}/swap`),
    onSuccess: (updated) => {
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        old ? updateExercise(old, updated.id, () => updated) : old,
      )
      setJustSwapped((prev) => !prev)
      setSwapError(null)
    },
    onError: (err) => {
      setSwapError(err instanceof ApiError ? err.body.message : "No se pudo cambiar el ejercicio.")
    },
  })

  const logSetMutation = useMutation({
    mutationFn: (payload: { weight_kg: number; reps: number; rpe?: number }) =>
      api.post<LoggedWorkoutSet>(`/workout-sessions/${sessionId}/exercises/${currentExercise!.id}/sets`, payload),
    onSuccess: (loggedSet) => {
      const exerciseId = currentExercise!.id
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        old ? updateExercise(old, exerciseId, (e) => ({ ...e, sets: [...e.sets, loggedSet] })) : old,
      )
      setLastSetWasPersonalRecord(loggedSet.is_personal_record)
      setRestingUntil(Date.now() + (currentExercise?.rest_seconds ?? 90) * 1000)
      // repsInput se re-precarga solo con la sugerencia de la próxima serie
      // (ver el useEffect de nextSetIndex más arriba) — no hace falta limpiarlo acá.
      setRpeInput("")

      const setsSoFar = (currentExercise?.sets.length ?? 0) + 1
      if (setsSoFar >= (currentExercise?.target_sets ?? 3)) {
        // Pausa breve para que el usuario vea la 3ª serie confirmada antes
        // de saltar automáticamente al siguiente ejercicio (sección 3 del
        // pedido: el avance es automático, sin botón manual).
        setTimeout(() => {
          queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
            old ? updateExercise(old, exerciseId, (e) => ({ ...e, all_sets_completed: true })) : old,
          )
        }, ADVANCE_DELAY_MS)
      }
    },
  })

  const completeMutation = useMutation({
    mutationFn: (duration_minutes: number) =>
      api.postWithMeta<WorkoutSession>(`/workout-sessions/${sessionId}/complete`, { duration_minutes }),
    onSuccess: (envelope) => {
      queryClient.setQueryData(["workout-sessions", sessionId], envelope.data)
      const gamification = envelope.meta?.gamification as GamificationEventResult | undefined
      if (gamification?.leveled_up) setLevelUpResult(gamification)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => api.post(`/workout-sessions/${sessionId}/cancel`),
    onSuccess: () => navigate("/dashboard"),
  })

  const feedbackMutation = useMutation({
    mutationFn: (completed_as_planned: boolean) =>
      api.post<WorkoutSession>(`/workout-sessions/${sessionId}/feedback`, { completed_as_planned }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["workout-sessions", sessionId], updated)
      // Recién acá el peso sugerido de la próxima sesión ya está calculado
      // (ver SubmitSessionFeedbackAction) — invalidar antes de esto muestra
      // el peso viejo en el dashboard/precheck si el usuario vuelve rápido.
      queryClient.invalidateQueries({ queryKey: ["routines", "active"] })
      queryClient.invalidateQueries({ queryKey: ["gamification"] })
    },
  })

  // Avance automático de sesión completa: cuando el último ejercicio llega a
  // sus 3 series, cerrar la sesión sin esperar un click en "Finalizar".
  useEffect(() => {
    if (!session || session.completed || !allExercisesCompleted || completeMutation.isPending) return

    const durationMinutes = Math.min(
      600,
      Math.max(1, Math.round((Date.now() - new Date(session.performed_at).getTime()) / 60000)),
    )
    const timeout = setTimeout(() => completeMutation.mutate(durationMinutes), ADVANCE_DELAY_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allExercisesCompleted, session?.completed])

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

  const setsRemaining = currentExercise.target_sets - currentExercise.sets.length
  const exerciseJustCompleted = currentExercise.sets.length >= currentExercise.target_sets

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
            onClick={() => setShowExitConfirm(true)}
            className="text-xs text-muted-foreground hover:underline"
          >
            Salir
          </button>
        </header>

        <p className="text-sm text-muted-foreground">
          Meta: {currentExercise.target_sets}×{currentExercise.target_reps}
          {currentExercise.target_rpe ? ` · RPE ${currentExercise.target_rpe}` : ""}
          {currentExercise.rest_seconds ? ` · descanso ${currentExercise.rest_seconds}s` : ""}
        </p>

        {currentExercise.suggested_weight_kg !== null && (
          <p className="text-sm">
            <span className="text-muted-foreground">Peso recomendado: </span>
            <span className="font-medium text-primary">{currentExercise.suggested_weight_kg} kg</span>
          </p>
        )}

        {suggestedRepsForNextSet !== null && (
          <p className="text-sm">
            <span className="text-muted-foreground">Repeticiones recomendadas: </span>
            <span className="font-medium text-primary">{suggestedRepsForNextSet}</span>
          </p>
        )}

        <ExerciseVideoPlayer videoUrl={currentExercise.exercise.video_url} />

        {currentExercise.alternative && (
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={swapExerciseMutation.isPending || currentExercise.sets.length > 0}
              onClick={() => swapExerciseMutation.mutate()}
            >
              {justSwapped ? "↩️ Volver al anterior" : "🔄 Cambiar ejercicio"}
            </Button>
            {currentExercise.sets.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Ya registraste series — no se puede cambiar el ejercicio en esta sesión.
              </p>
            )}
            {swapError && <p className="text-xs text-destructive">{swapError}</p>}
          </div>
        )}

        {lastSetWasPersonalRecord && (
          <div className="rounded-lg border border-primary/25 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
            🏆 ¡Nuevo récord personal!
          </div>
        )}

        {exerciseJustCompleted ? (
          <div className="rounded-lg border border-primary/25 bg-primary/8 px-4 py-3 text-center text-sm font-medium text-primary">
            ✅ Ejercicio completado — {isLastExercise ? "cerrando entrenamiento…" : "pasando al siguiente…"}
          </div>
        ) : (
          <RestTimer restingUntil={restingUntil} onSkip={() => setRestingUntil(null)} />
        )}

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

        {!exerciseJustCompleted && (
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Peso realizado (kg)</label>
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
              Registrar serie {currentExercise.sets.length + 1} de {currentExercise.target_sets}
              {setsRemaining === 1 ? " (última)" : ""}
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showExitConfirm}
        title="¿Salir del entrenamiento?"
        description="Las series que ya registraste se conservan, pero esta sesión no contará como completada."
        confirmLabel="Salir"
        cancelLabel="Seguir entrenando"
        isLoading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
        onCancel={() => setShowExitConfirm(false)}
      />
    </main>
  )
}
