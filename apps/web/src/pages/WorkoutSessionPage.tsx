// Esta línea sirve para importar «useEffect, useMemo, useState» desde «react».
import { useEffect, useMemo, useState } from "react"
// Esta línea sirve para importar «Navigate, useNavigate, useParams» desde «react-router-dom».
import { Navigate, useNavigate, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «CheckCircle2, Dumbbell, Info, RefreshCw, TrendingUp, Trophy» desde «lucide-react».
import { CheckCircle2, Dumbbell, Info, RefreshCw, TrendingUp, Trophy } from "lucide-react"
// Esta línea sirve para importar los tipos de gamificación y de la sesión de entrenamiento.
import type { GamificationEventResult, LoggedWorkoutSet, WorkoutExercise, WorkoutSession } from "@sanken/core"
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
// Esta línea sirve para importar «LevelUpModal» desde «@/components/workout/LevelUpModal».
import { LevelUpModal } from "@/components/workout/LevelUpModal"
// Esta línea sirve para importar «ExerciseVideoPlayer» desde «@/components/workout/ExerciseVideoPlayer».
import { ExerciseVideoPlayer } from "@/components/workout/ExerciseVideoPlayer"
// Esta línea sirve para importar «RestTimerRing» desde «@/components/ui/rest-timer-ring».
import { RestTimerRing } from "@/components/ui/rest-timer-ring"
// Esta línea sirve para importar «SetTrackerTable» desde «@/components/ui/set-tracker-table».
import { SetTrackerTable } from "@/components/ui/set-tracker-table"
// Esta línea sirve para importar «RulerSlider» desde «@/components/ui/ruler-slider».
import { RulerSlider } from "@/components/ui/ruler-slider"
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from "@/components/ui/stepper"
// Esta línea sirve para importar «CelebrationOverlay» desde «@/components/ui/celebration-overlay».
import { CelebrationOverlay } from "@/components/ui/celebration-overlay"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «ADVANCE_DELAY_MS» con el valor «900».
const ADVANCE_DELAY_MS = 900

// Esta línea sirve para declarar la función «updateExercise».
function updateExercise(
  // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «WorkoutSession».
  session: WorkoutSession,
  // Esta línea sirve para declarar la propiedad «exerciseId» con el valor o tipo «number».
  exerciseId: number,
  // Esta línea sirve para recibir la función que modifica un ejercicio.
  updater: (exercise: WorkoutExercise) => WorkoutExercise,
// Esta línea sirve para cerrar los parámetros y declarar que devuelve la sesión.
): WorkoutSession {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para copiar las propiedades de «session».
    ...session,
    // Esta línea sirve para reemplazar solo el ejercicio indicado con su versión modificada.
    exercises: session.exercises.map((e) => (e.id === exerciseId ? updater(e) : e)),
  }
}

// Esta línea sirve para declarar la función «WorkoutSessionPage».
export function WorkoutSessionPage() {
  // Esta línea sirve para extraer «sessionId» de «useParams<{ sessionId: string }>()».
  const { sessionId } = useParams<{ sessionId: string }>()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()

  // Esta línea sirve para obtener «sessionQuery» con el hook «useQuery».
  const sessionQuery = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["workout-sessions", sessionId]».
    queryKey: ["workout-sessions", sessionId],
    // Esta línea sirve para pedir a la API los datos de «/workout-sessions/${sessionId}».
    queryFn: () => api.get<WorkoutSession>(`/workout-sessions/${sessionId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(sessionId)».
    enabled: Boolean(sessionId),
    // Esta línea sirve para declarar la propiedad «retry» con el valor o tipo «false».
    retry: false,
  })

  // Esta línea sirve para crear el estado «restingUntil» y su función «setRestingUntil».
  const [restingUntil, setRestingUntil] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «lastSetWasPersonalRecord» y su función «setLastSetWasPersonalRecord».
  const [lastSetWasPersonalRecord, setLastSetWasPersonalRecord] = useState(false)
  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «repsInput» y su función «setRepsInput».
  const [repsInput, setRepsInput] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «rpeInput» y su función «setRpeInput».
  const [rpeInput, setRpeInput] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «levelUpResult» y su función «setLevelUpResult».
  const [levelUpResult, setLevelUpResult] = useState<GamificationEventResult | null>(null)
  // Esta línea sirve para crear el estado «justSwapped» y su función «setJustSwapped».
  const [justSwapped, setJustSwapped] = useState(false)
  // Esta línea sirve para crear el estado «swapError» y su función «setSwapError».
  const [swapError, setSwapError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «showExitConfirm» y su función «setShowExitConfirm».
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Esta línea sirve para extraer «essio» de «sessionQuery.data».
  const session = sessionQuery.data

  // currentIndex es un valor derivado, no estado propio: el primer ejercicio
  // sin las 3 series completas. Esto es lo que hace que recargar la página a
  // mitad de sesión conserve el progreso — GET /workout-sessions/:id ya trae
  // all_sets_completed por ejercicio, no hace falta guardar nada aparte.
  // Esta línea sirve para obtener «currentIndex» con el hook «useMemo».
  const currentIndex = useMemo(() => {
    // Esta línea sirve para devolver «0» si «!session».
    if (!session) return 0
    // Esta línea sirve para extraer «d» de «session.exercises.findIndex((e) => !e.al».
    const idx = session.exercises.findIndex((e) => !e.all_sets_completed)
    // Esta línea sirve para devolver «idx === -1 ? session.exercises.length - 1 : idx».
    return idx === -1 ? session.exercises.length - 1 : idx
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «session».
  }, [session])

  // Esta línea sirve para extraer «urrentExercis» de «session?.exercises[currentIndex] ?? null».
  const currentExercise = session?.exercises[currentIndex] ?? null
  // Esta línea sirve para extraer «sLastExercis» de «session ? currentIndex === session.exerc».
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false
  // Esta línea sirve para extraer «llExercisesComplete» de «session ? session.exercises.every((e) =>».
  const allExercisesCompleted = session ? session.exercises.every((e) => e.all_sets_completed) : false

  // Reps recomendadas para la PRÓXIMA serie de este ejercicio (índice =
  // cuántas ya se registraron) — cada serie puede tener un objetivo
  // distinto (ver ProgressiveOverloadCalculator, rampa por serie).
  // Esta línea sirve para extraer «extSetInde» de «currentExercise?.sets.length ?? 0».
  const nextSetIndex = currentExercise?.sets.length ?? 0
  // Esta línea sirve para extraer «uggestedRepsForNextSe» de «currentExercise?.suggested_reps_per_set?».
  const suggestedRepsForNextSet = currentExercise?.suggested_reps_per_set?.[nextSetIndex] ?? null

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para guardar en el estado con «setWeightInput» el valor «currentExercise?.suggested_weight_kg ?? null)…».
    setWeightInput(currentExercise?.suggested_weight_kg ?? null)
    // Esta línea sirve para guardar en el estado con «setRpeInput» el valor «null)…».
    setRpeInput(null)
    // Esta línea sirve para guardar en el estado con «setJustSwapped» el valor «false)…».
    setJustSwapped(false)
    // Esta línea sirve para guardar en el estado con «setSwapError» el valor «null)…».
    setSwapError(null)
    // Esta línea sirve para guardar en el estado con «setLastSetWasPersonalRecord» el valor «false)…».
    setLastSetWasPersonalRecord(false)
    // Esta línea sirve para guardar en el estado con «setRestingUntil» el valor «null)…».
    setRestingUntil(null)
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «currentExercise?.id».
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset solo al cambiar de ejercicio, no en cada recalculo de suggested_weight_kg del mismo ejercicio
  }, [currentExercise?.id])

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para guardar en el estado con «setRepsInput» el valor «suggestedRepsForNextSet)…».
    setRepsInput(suggestedRepsForNextSet)
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «currentExercise?.id, nextSetIndex».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id, nextSetIndex])

  // Esta línea sirve para obtener «swapExerciseMutation» con el hook «useMutation».
  const swapExerciseMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/workout-sessions/${sessionId}/exercises/${currentExercise!.».
    mutationFn: () => api.post<WorkoutExercise>(`/workout-sessions/${sessionId}/exercises/${currentExercise!.id}/swap`),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (updated) => {
      // Esta línea sirve para actualizar la sesión en caché.
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        // Esta línea sirve para aplicar el ejercicio actualizado si la sesión existe.
        old ? updateExercise(old, updated.id, () => updated) : old,
      )
      // Esta línea sirve para guardar en el estado con «setJustSwapped» el valor «(prev) => !prev)…».
      setJustSwapped((prev) => !prev)
      // Esta línea sirve para guardar en el estado con «setSwapError» el valor «null)…».
      setSwapError(null)
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) => {
      // Esta línea sirve para guardar en el estado con «setSwapError» el valor «err instanceof ApiError ? err.body.message : …».
      setSwapError(err instanceof ApiError ? err.body.message : "No se pudo cambiar el ejercicio.")
    },
  })

  // Esta línea sirve para obtener «logSetMutation» con el hook «useMutation».
  const logSetMutation = useMutation({
    // Esta línea sirve para declarar la mutación que registra una serie.
    mutationFn: (payload: { weight_kg: number; reps: number; rpe?: number }) =>
      // Esta línea sirve para enviar la serie a la API.
      api.post<LoggedWorkoutSet>(`/workout-sessions/${sessionId}/exercises/${currentExercise!.id}/sets`, payload),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (loggedSet) => {
      // Esta línea sirve para extraer «xerciseI» de «currentExercise!.id».
      const exerciseId = currentExercise!.id
      // Esta línea sirve para actualizar la sesión en caché.
      queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
        // Esta línea sirve para agregar la serie registrada al ejercicio.
        old ? updateExercise(old, exerciseId, (e) => ({ ...e, sets: [...e.sets, loggedSet] })) : old,
      )
      // Esta línea sirve para guardar en el estado con «setLastSetWasPersonalRecord» el valor «loggedSet.is_personal_record)…».
      setLastSetWasPersonalRecord(loggedSet.is_personal_record)
      // Esta línea sirve para guardar en el estado con «setRestingUntil» el valor «Date.now() + (currentExercise?.rest_seconds ?…».
      setRestingUntil(Date.now() + (currentExercise?.rest_seconds ?? 90) * 1000)
      // repsInput se re-precarga solo con la sugerencia de la próxima serie
      // (ver el useEffect de nextSetIndex más arriba) — no hace falta limpiarlo acá.
      // Esta línea sirve para guardar en el estado con «setRpeInput» el valor «null)…».
      setRpeInput(null)

      // Esta línea sirve para extraer «etsSoFa» de «(currentExercise?.sets.length ?? 0) + 1».
      const setsSoFar = (currentExercise?.sets.length ?? 0) + 1
      // Esta línea sirve para revisar si «setsSoFar >= (currentExercise?.target_sets ?? 3)».
      if (setsSoFar >= (currentExercise?.target_sets ?? 3)) {
        // Pausa breve para que el usuario vea la 3ª serie confirmada antes
        // de saltar automáticamente al siguiente ejercicio (sección 3 del
        // pedido: el avance es automático, sin botón manual).
        // Esta línea sirve para guardar en el estado con «setTimeout» el valor «() => {…».
        setTimeout(() => {
          // Esta línea sirve para actualizar la sesión en caché.
          queryClient.setQueryData<WorkoutSession>(["workout-sessions", sessionId], (old) =>
            // Esta línea sirve para marcar el ejercicio como completado.
            old ? updateExercise(old, exerciseId, (e) => ({ ...e, all_sets_completed: true })) : old,
          )
        // Esta línea sirve para volver a ejecutar el efecto cuando cambian «DVANCE_DELAY_M».
        }, ADVANCE_DELAY_MS)
      }
    },
  })

  // Esta línea sirve para obtener «completeMutation» con el hook «useMutation».
  const completeMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(duration_minutes: number) =>».
    mutationFn: (duration_minutes: number) =>
      // Esta línea sirve para enviar a la API que se completa la sesión con su duración.
      api.postWithMeta<WorkoutSession>(`/workout-sessions/${sessionId}/complete`, { duration_minutes }),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (envelope) => {
      // Esta línea sirve para guardar la sesión completada en caché.
      queryClient.setQueryData(["workout-sessions", sessionId], envelope.data)
      // Esta línea sirve para extraer «amificatio» de «envelope.meta?.gamification as Gamificat».
      const gamification = envelope.meta?.gamification as GamificationEventResult | undefined
      // Esta línea sirve para mostrar el modal de nivel si subió de nivel.
      if (gamification?.leveled_up) setLevelUpResult(gamification)
    },
  })

  // Esta línea sirve para obtener «cancelMutation» con el hook «useMutation».
  const cancelMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/workout-sessions/${sessionId}/cancel».
    mutationFn: () => api.post(`/workout-sessions/${sessionId}/cancel`),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => navigate("/dashboard"),
  })

  // Esta línea sirve para obtener «feedbackMutation» con el hook «useMutation».
  const feedbackMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(completed_as_planned: boolean) =>».
    mutationFn: (completed_as_planned: boolean) =>
      // Esta línea sirve para enviar a la API si se completó como estaba planeado.
      api.post<WorkoutSession>(`/workout-sessions/${sessionId}/feedback`, { completed_as_planned }),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (updated) => {
      // Esta línea sirve para llamar a «queryClient.setQueryData» con «["workout-sessions", sessionId], updated».
      queryClient.setQueryData(["workout-sessions", sessionId], updated)
      // Recién acá el peso sugerido de la próxima sesión ya está calculado
      // (ver SubmitSessionFeedbackAction) — invalidar antes de esto muestra
      // el peso viejo en el dashboard/precheck si el usuario vuelve rápido.
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["routines", "active"] }».
      queryClient.invalidateQueries({ queryKey: ["routines", "active"] })
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["gamification"] }».
      queryClient.invalidateQueries({ queryKey: ["gamification"] })
    },
  })

  // Avance automático de sesión completa: cuando el último ejercicio llega a
  // sus 3 series, cerrar la sesión sin esperar un click en "Finalizar".
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir si no se puede cerrar todavía el entrenamiento.
    if (!session || session.completed || !allExercisesCompleted || completeMutation.isPending) return

    // Esta línea sirve para extraer «urationMinute» de «Math.min(».
    const durationMinutes = Math.min(
      // Esta línea sirve para incluir el valor «600» en la lista.
      600,
      // Esta línea sirve para calcular los minutos transcurridos, con un mínimo de 1.
      Math.max(1, Math.round((Date.now() - new Date(session.performed_at).getTime()) / 60000)),
    )
    // Esta línea sirve para extraer «imeou» de «setTimeout(() => completeMutation.mutate».
    const timeout = setTimeout(() => completeMutation.mutate(durationMinutes), ADVANCE_DELAY_MS)
    // Esta línea sirve para devolver «() => clearTimeout(timeout)».
    return () => clearTimeout(timeout)
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «allExercisesCompleted, session?.completed».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allExercisesCompleted, session?.completed])

  // Esta línea sirve para revisar si «sessionQuery.isError».
  if (sessionQuery.isError) {
    // Esta línea sirve para devolver «<Navigate to="/dashboard" replace />».
    return <Navigate to="/dashboard" replace />
  }

  // Esta línea sirve para revisar si «sessionQuery.isLoading || !session».
  if (sessionQuery.isLoading || !session) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-4». */}
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton className="h-8 w-2/3" />
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton className="h-48 w-full" />
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton className="h-32 w-full" />
        </div>
      </main>
    )
  }

  // Esta línea sirve para declarar la función que registra una serie.
  async function handleLogSet() {
    // Esta línea sirve para salir si faltan el peso o las repeticiones o son inválidos.
    if (weightInput === null || weightInput < 0 || repsInput === null || repsInput < 1) return
    // Esta línea sirve para esperar el resultado de «logSetMutation.mutateAsync».
    await logSetMutation.mutateAsync({ weight_kg: weightInput, reps: repsInput, rpe: rpeInput ?? undefined })
  }

  // Feedback post-sesión: máquina de estados derivada de `session`, sin estado propio.
  // Esta línea sirve para revisar si «session.completed && session.completed_as_planned === null».
  if (session.completed && session.completed_as_planned === null) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para mostrar el componente «LevelUpModal». */}
        <LevelUpModal result={levelUpResult} onClose={() => setLevelUpResult(null)} />
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col items-cen». */}
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          {/* Esta línea sirve para mostrar el texto «¡Entrenamiento completado!» dentro de un «h1». */}
          <h1 className="font-heading text-2xl font-medium tracking-tight">¡Entrenamiento completado!</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
          <p className="text-sm text-muted-foreground">
            {/* Esta línea sirve para mostrar el texto «¿Pudiste completar el entrenamiento tal como estaba planeado?». */}
            ¿Pudiste completar el entrenamiento tal como estaba planeado?
          </p>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-3». */}
          <div className="flex gap-3">
            {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
            <Button disabled={feedbackMutation.isPending} onClick={() => feedbackMutation.mutate(true)}>
              {/* Esta línea sirve para mostrar el texto «Sí». */}
              Sí
            </Button>
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «variant» con el valor «outline».
              variant="outline"
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «feedbackMutation.isPending}».
              disabled={feedbackMutation.isPending}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => feedbackMutation.mutate(false)}
            >
              {/* Esta línea sirve para mostrar el texto «No». */}
              No
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Esta línea sirve para revisar si «session.completed && session.completed_as_planned !== null».
  if (session.completed && session.completed_as_planned !== null) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col items-cen». */}
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          {/* Esta línea sirve para mostrar el texto «Buen trabajo» dentro de un «h1». */}
          <h1 className="font-heading text-2xl font-medium tracking-tight">Buen trabajo</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
          <p className="text-sm text-muted-foreground">
            {/* Esta línea sirve para mostrar el contenido dinámico «{session.completed_as_planned». */}
            {session.completed_as_planned
              // Esta línea sirve para avisar que se ajustará el peso automáticamente.
              ? "La próxima vez ajustaremos el peso automáticamente para seguir progresando."
              // Esta línea sirve para avisar que se mantendrá el mismo peso.
              : "La próxima vez mantendremos el mismo peso para consolidar la técnica."}
          </p>
          {/* Esta línea sirve para mostrar el texto « navigate("/dashboard")}>Volver al dashboard» dentro de «Button». */}
          <Button onClick={() => navigate("/dashboard")}>Volver al dashboard</Button>
        </div>
      </main>
    )
  }

  // Esta línea sirve para revisar si «!currentExercise».
  if (!currentExercise) {
    // Esta línea sirve para devolver «<Navigate to="/dashboard" replace />».
    return <Navigate to="/dashboard" replace />
  }

  // Esta línea sirve para extraer «etsRemainin» de «currentExercise.target_sets - currentExe».
  const setsRemaining = currentExercise.target_sets - currentExercise.sets.length
  // Esta línea sirve para extraer «xerciseJustComplete» de «currentExercise.sets.length >= currentEx».
  const exerciseJustCompleted = currentExercise.sets.length >= currentExercise.target_sets

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-4». */}
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        {/* Esta línea sirve para abrir el elemento «header» con las clases «flex items-center justify-between». */}
        <header className="flex items-center justify-between">
          {/* Esta línea sirve para mostrar el texto «Entrenamiento» dentro de un «p». */}
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Entrenamiento</p>
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => setShowExitConfirm(true)}
            // Esta línea sirve para aplicar las clases de estilo «text-xs text-muted-foreground hover:underline».
            className="text-xs text-muted-foreground hover:underline"
          >
            {/* Esta línea sirve para mostrar el texto «Salir». */}
            Salir
          </button>
        </header>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-1.5». */}
        <div className="flex gap-1.5">
          {/* Esta línea sirve para recorrer «session.exercises» y mostrar un bloque por elemento. */}
          {session.exercises.map((exercise, i) => (
            // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
            <div
              // Esta línea sirve para identificar el elemento de la lista con «exercise.id}».
              key={exercise.id}
              // Esta línea sirve para aplicar las clases de estilo «h-1.5 flex-1 rounded-full ${».
              className={`h-1.5 flex-1 rounded-full ${
                // Esta línea sirve para elegir el color del indicador de cada ejercicio.
                exercise.all_sets_completed ? "bg-primary" : i === currentIndex ? "bg-secondary-accent" : "bg-muted"
              // Esta línea sirve para cerrar las clases del indicador.
              }`}
            />
          ))}
        </div>

        {/* Esta línea sirve para mostrar el contenido dinámico «{session.readiness_adjusted && session.readiness_note && (». */}
        {session.readiness_adjusted && session.readiness_note && (
          // Esta línea sirve para abrir el elemento «div» con las clases «flex items-start gap-2 rounded-xl border».
          <div className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
            {/* Esta línea sirve para abrir el componente «Info». */}
            <Info className="mt-0.5 size-4 shrink-0 text-warning" />
            {/* Esta línea sirve para mostrar el valor «session.readiness_note» dentro de un «p». */}
            <p>{session.readiness_note}</p>
          </div>
        )}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «relative overflow-hidden rounded-2xl bor». */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary-accent/10 via-card to-primary/8 p-6">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «pointer-events-none absolute -top-14 -ri». */}
          <div className="pointer-events-none absolute -top-14 -right-14 size-40 rounded-full bg-primary/12 blur-3xl" />
          {/* Esta línea sirve para abrir el elemento «div» con las clases «relative». */}
          <div className="relative">
            {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs font-semibold tracking-widest te». */}
            <p className="text-xs font-semibold tracking-widest text-secondary-accent uppercase">
              {/* Esta línea sirve para mostrar el contenido dinámico «Ejercicio {currentIndex + 1} de {session.exercises.length}». */}
              Ejercicio {currentIndex + 1} de {session.exercises.length}
            </p>
            {/* Esta línea sirve para abrir el elemento «h1» con las clases «mt-1 font-heading text-3xl font-bold tra». */}
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              {/* Esta línea sirve para mostrar el valor «currentExercise.exercise.name». */}
              {currentExercise.exercise.name}
            </h1>
            {/* Esta línea sirve para mostrar el bloque solo si «currentExercise.exercise.primary_muscle». */}
            {currentExercise.exercise.primary_muscle && (
              // Esta línea sirve para abrir el elemento «p» con las clases «mt-0.5 flex items-center gap-1.5 text-sm».
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                {/* Esta línea sirve para abrir el componente «Dumbbell». */}
                <Dumbbell className="size-3.5" />
                {/* Esta línea sirve para mostrar el valor «currentExercise.exercise.primary_muscle». */}
                {currentExercise.exercise.primary_muscle}
              </p>
            )}
            {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-2 text-sm font-bold tracking-wide tex». */}
            <p className="mt-2 text-sm font-bold tracking-wide text-primary uppercase">
              {/* Esta línea sirve para mostrar el número de serie actual y el total objetivo. */}
              Serie {currentExercise.sets.length + 1} de {currentExercise.target_sets}
            </p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
            <p className="text-xs text-muted-foreground">
              {/* Esta línea sirve para mostrar el RPE objetivo si existe. */}
              {currentExercise.target_rpe ? `RPE objetivo ${currentExercise.target_rpe} · ` : ""}
              {/* Esta línea sirve para mostrar el descanso si existe. */}
              {currentExercise.rest_seconds ? `descanso ${currentExercise.rest_seconds}s` : ""}
            </p>
          </div>
        </div>

        {/* Esta línea sirve para mostrar las sugerencias solo si hay peso o repeticiones sugeridas. */}
        {(currentExercise.suggested_weight_kg !== null || suggestedRepsForNextSet !== null) && (
          // Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-3».
          <div className="grid grid-cols-2 gap-3">
            {/* Esta línea sirve para mostrar el bloque solo si «currentExercise.suggested_weight_kg !== null». */}
            {currentExercise.suggested_weight_kg !== null && (
              // Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 rounded-xl border border-border ».
              <div className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «flex items-center gap-1 text-xs font-sem». */}
                <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {/* Esta línea sirve para abrir el componente «TrendingUp». */}
                  <TrendingUp className="size-3.5 text-primary" />
                  {/* Esta línea sirve para mostrar el texto «Peso recomendado». */}
                  Peso recomendado
                </p>
                {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 font-heading text-3xl font-bold tex». */}
                <p className="mt-1 font-heading text-3xl font-bold text-primary tabular-nums sm:text-4xl">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{currentExercise.suggested_weight_kg} kg». */}
                  {currentExercise.suggested_weight_kg} kg
                </p>
              </div>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «suggestedRepsForNextSet !== null». */}
            {suggestedRepsForNextSet !== null && (
              // Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 rounded-xl border border-border ».
              <div className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «flex items-center gap-1 text-xs font-sem». */}
                <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {/* Esta línea sirve para abrir el componente «TrendingUp». */}
                  <TrendingUp className="size-3.5 text-primary" />
                  {/* Esta línea sirve para mostrar el texto «Reps recomendadas». */}
                  Reps recomendadas
                </p>
                {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 font-heading text-3xl font-bold tex». */}
                <p className="mt-1 font-heading text-3xl font-bold text-primary tabular-nums sm:text-4xl">
                  {/* Esta línea sirve para mostrar el valor «suggestedRepsForNextSet». */}
                  {suggestedRepsForNextSet}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Esta línea sirve para abrir el elemento «ExerciseVideoPlayer» con sus atributos en varias líneas. */}
        <ExerciseVideoPlayer
          // Esta línea sirve para pasar la propiedad «videoUrl» con el valor «currentExercise.exercise.video_url}».
          videoUrl={currentExercise.exercise.video_url}
          // Esta línea sirve para pasar la propiedad «exerciseName» con el valor «currentExercise.exercise.name}».
          exerciseName={currentExercise.exercise.name}
          // Esta línea sirve para activar la opción «autoPlay».
          autoPlay
        />

        {/* Esta línea sirve para mostrar el bloque solo si «currentExercise.alternative». */}
        {currentExercise.alternative && (
          // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-1».
          <div className="flex flex-col gap-1">
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «type» con el valor «button».
              type="button"
              // Esta línea sirve para definir el atributo «variant» con el valor «outline».
              variant="outline"
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «swapExerciseMutation.isPending || currentExer».
              disabled={swapExerciseMutation.isPending || currentExercise.sets.length > 0}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => swapExerciseMutation.mutate()}
            >
              {/* Esta línea sirve para abrir el componente «RefreshCw». */}
              <RefreshCw className="size-3.5" />
              {/* Esta línea sirve para mostrar el contenido dinámico «{justSwapped ? "Volver al anterior" : "Cambiar ejercicio"}». */}
              {justSwapped ? "Volver al anterior" : "Cambiar ejercicio"}
            </Button>
            {/* Esta línea sirve para mostrar el bloque solo si «currentExercise.sets.length > 0». */}
            {currentExercise.sets.length > 0 && (
              // Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground».
              <p className="text-xs text-muted-foreground">
                {/* Esta línea sirve para avisar que no se puede cambiar de ejercicio con series registradas. */}
                Ya registraste series — no se puede cambiar el ejercicio en esta sesión.
              </p>
            )}
            {/* Esta línea sirve para mostrar el elemento solo si «swapError». */}
            {swapError && <p className="text-xs text-destructive">{swapError}</p>}
          </div>
        )}

        {/* Esta línea sirve para abrir el componente «CelebrationOverlay». */}
        <CelebrationOverlay show={lastSetWasPersonalRecord}>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-center gap-2 r». */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/8 px-4 py-2 text-sm font-bold tracking-wide text-primary uppercase">
            {/* Esta línea sirve para abrir el componente «Trophy». */}
            <Trophy className="size-4" />
            {/* Esta línea sirve para mostrar el texto «Récord personal». */}
            Récord personal
          </div>
        </CelebrationOverlay>

        {/* Esta línea sirve para elegir entre dos bloques según «exerciseJustCompleted». */}
        {exerciseJustCompleted ? (
          // Esta línea sirve para abrir el componente «CelebrationOverlay».
          <CelebrationOverlay show>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-center gap-2 r». */}
            <div className="flex items-center justify-center gap-2 rounded-lg border border-secondary-accent/25 bg-secondary-accent/8 px-4 py-3 text-center text-sm font-bold text-secondary-accent">
              {/* Esta línea sirve para abrir el componente «CheckCircle2». */}
              <CheckCircle2 className="size-4" />
              {/* Esta línea sirve para mostrar que el ejercicio terminó y qué sigue. */}
              Ejercicio completado — {isLastExercise ? "cerrando entrenamiento…" : "pasando al siguiente…"}
            </div>
          </CelebrationOverlay>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el elemento «RestTimerRing» con sus atributos en varias líneas.
          <RestTimerRing
            // Esta línea sirve para pasar la propiedad «restingUntil» con el valor «restingUntil}».
            restingUntil={restingUntil}
            // Esta línea sirve para pasar la propiedad «totalSeconds» con el valor «currentExercise.rest_seconds ?? 90}».
            totalSeconds={currentExercise.rest_seconds ?? 90}
            // Esta línea sirve para asignar el manejador del evento «onSkip».
            onSkip={() => setRestingUntil(null)}
          />
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «currentExercise.sets.length > 0». */}
        {currentExercise.sets.length > 0 && (
          // Esta línea sirve para abrir el elemento «SetTrackerTable» con sus atributos en varias líneas.
          <SetTrackerTable
            // Esta línea sirve para pasar la propiedad «sets» con el valor «currentExercise.sets}».
            sets={currentExercise.sets}
            // Esta línea sirve para pasar la propiedad «targetSets» con el valor «currentExercise.target_sets}».
            targetSets={currentExercise.target_sets}
            // Esta línea sirve para pasar la propiedad «suggestedWeightKg» con el valor «null}».
            suggestedWeightKg={null}
            // Esta línea sirve para pasar la propiedad «suggestedRepsForNextSet» con el valor «null}».
            suggestedRepsForNextSet={null}
          />
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «!exerciseJustCompleted». */}
        {!exerciseJustCompleted && (
          // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-3 rounded-xl border bo».
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el texto «Peso (kg) — deslizá la regla» dentro de un «p». */}
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Peso (kg) — deslizá la regla</p>
              {/* Esta línea sirve para abrir el componente «RulerSlider». */}
              <RulerSlider value={weightInput} onChange={setWeightInput} unit="kg" />
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-1 gap-3 sm:grid-cols-2». */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para mostrar el texto «Repeticiones» dentro de un «p». */}
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Repeticiones</p>
                {/* Esta línea sirve para abrir el componente «Stepper». */}
                <Stepper value={repsInput} onChange={setRepsInput} step={1} unit="reps" />
              </div>
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para mostrar el texto «RPE (opcional)» dentro de un «p». */}
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">RPE (opcional)</p>
                {/* Esta línea sirve para abrir el componente «Stepper». */}
                <Stepper value={rpeInput} onChange={setRpeInput} step={0.5} max={10} unit="RPE" />
              </div>
            </div>
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «type» con el valor «button».
              type="button"
              // Esta línea sirve para definir el atributo «variant» con el valor «emphasis».
              variant="emphasis"
              // Esta línea sirve para definir el atributo «size» con el valor «lg».
              size="lg"
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «logSetMutation.isPending || weightInput === n».
              disabled={logSetMutation.isPending || weightInput === null || repsInput === null}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={handleLogSet}
            >
              {/* Esta línea sirve para mostrar el texto del botón con el número de serie actual y el objetivo. */}
              Registrar serie {currentExercise.sets.length + 1} de {currentExercise.target_sets}
              {/* Esta línea sirve para mostrar el contenido dinámico «{setsRemaining === 1 ? " (última)" : ""}». */}
              {setsRemaining === 1 ? " (última)" : ""}
            </Button>
          </div>
        )}
      </div>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «open» con el valor «showExitConfirm}».
        open={showExitConfirm}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Salir del entrenamiento?».
        title="¿Salir del entrenamiento?"
        // Esta línea sirve para definir el atributo «description».
        description="Las series que ya registraste se conservan, pero esta sesión no contará como completada."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Salir».
        confirmLabel="Salir"
        // Esta línea sirve para definir el atributo «cancelLabel» con el valor «Seguir entrenando».
        cancelLabel="Seguir entrenando"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «cancelMutation.isPending}».
        isLoading={cancelMutation.isPending}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={() => cancelMutation.mutate()}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setShowExitConfirm(false)}
      />
    </main>
  )
}
