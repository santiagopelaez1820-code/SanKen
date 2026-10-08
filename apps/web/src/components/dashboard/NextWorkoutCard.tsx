// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «ArrowRight, Dumbbell» desde «lucide-react».
import { ArrowRight, Dumbbell } from "lucide-react"
// Esta línea sirve para abrir la importación de utilidades del núcleo.
import {
  // Esta línea sirve para importar el error tipado de la API.
  ApiError,
  // Esta línea sirve para importar el cálculo de duración estimada.
  estimateWorkoutMinutes,
  // Esta línea sirve para importar la búsqueda del siguiente día de rutina.
  findNextDay,
  // Esta línea sirve para importar el formato de cuenta regresiva.
  formatUnlockCountdown,
  // Esta línea sirve para importar la lectura del bloqueo diario.
  parseDailyLock,
  // Esta línea sirve para importar el tipo de rutina.
  type Routine,
  // Esta línea sirve para importar el tipo de sesión de entrenamiento.
  type WorkoutSession,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"

// Esta línea sirve para declarar el componente de la tarjeta del próximo entrenamiento.
export function NextWorkoutCard() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para guardar si se está confirmando saltar el entrenamiento.
  const [confirmingSkip, setConfirmingSkip] = useState(false)

  // Esta línea sirve para pedir la rutina activa y obtener sus estados.
  const { data: envelope, isLoading, isError, error, refetch } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["routines", "active"]».
    queryKey: ["routines", "active"],
    // Esta línea sirve para pedir la rutina activa a la API.
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
    // Esta línea sirve para declarar la propiedad «retry» con el valor o tipo «false».
    retry: false,
  })

  // Esta línea sirve para detectar que el usuario no tiene rutina (error 404).
  const hasNoRoutine = isError && error instanceof ApiError && error.status === 404
  // Esta línea sirve para detectar cualquier otro error de carga.
  const genericError = isError && !hasNoRoutine

  // Esta línea sirve para buscar el día que toca entrenar.
  const day = findNextDay(envelope?.data ?? null, (envelope?.meta?.next_day_id as number | null) ?? null)
  // Autoridad del backend sobre si el entrenamiento de hoy ya está gastado
  // (ver DetermineDailyLockStatusAction en la API) -- esta card antes no
  // tenía ninguna noción de "ya entrenaste hoy", a diferencia de mobile.
  // Esta línea sirve para leer si el entrenamiento está bloqueado hasta mañana.
  const dailyLock = parseDailyLock(envelope?.meta)

  // Puramente visual -- al llegar a 0 se vuelve a pedir /routines/active
  // para confirmar el desbloqueo real, nunca se confía en el reloj del
  // navegador para decidir si mostrar el botón "Comenzar".
  // Esta línea sirve para guardar el texto de la cuenta regresiva.
  const [countdown, setCountdown] = useState<string | null>(null)
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir del efecto si no hay bloqueo.
    if (!dailyLock.locked || !dailyLock.unlocks_at) {
      // Esta línea sirve para limpiar la cuenta regresiva.
      setCountdown(null)
      // Esta línea sirve para terminar el efecto.
      return
    }
    // Esta línea sirve para declarar la función que actualiza la cuenta regresiva.
    const tick = () => {
      // Esta línea sirve para calcular el tiempo que falta.
      const remaining = formatUnlockCountdown(dailyLock.unlocks_at)
      // Esta línea sirve para mostrar el tiempo que falta.
      setCountdown(remaining)
      // Esta línea sirve para volver a pedir la rutina cuando termina el bloqueo.
      if (!remaining) refetch()
    }
    // Esta línea sirve para actualizar la cuenta regresiva de inmediato.
    tick()
    // Esta línea sirve para repetir la actualización cada 30 segundos.
    const interval = setInterval(tick, 30_000)
    // Esta línea sirve para detener el temporizador al desmontar.
    return () => clearInterval(interval)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el bloqueo.
  }, [dailyLock.locked, dailyLock.unlocks_at, refetch])

  // Esta línea sirve para obtener «skipMutation» con el hook «useMutation».
  const skipMutation = useMutation({
    // Esta línea sirve para enviar a la API que se salta el entrenamiento.
    mutationFn: () => api.post<WorkoutSession>("/workout-sessions/skip", { routine_day_id: day?.id ?? null }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para cerrar el diálogo de confirmación.
      setConfirmingSkip(false)
      // Esta línea sirve para refrescar la rutina activa.
      queryClient.invalidateQueries({ queryKey: ["routines", "active"] })
    },
  })

  // Esta línea sirve para mostrar un esqueleto mientras carga.
  if (isLoading) return <Skeleton style={{ height: 280, width: "100%" }} />

  // Esta línea sirve para revisar si hubo un error de carga.
  if (genericError) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4».
      <div className="sank-surface rounded-2 p-4">
        {/* Esta línea sirve para mostrar el mensaje de error de carga. */}
        <p className="small text-body-secondary mb-0">No se pudo cargar tu rutina.</p>
      </div>
    )
  }

  // Esta línea sirve para revisar si el usuario no tiene rutina.
  if (hasNoRoutine) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface sank-hairline rounded-2».
      <div className="sank-surface sank-hairline rounded-2">
        {/* Esta línea sirve para abrir el elemento «SankEmptyState» con sus atributos en varias líneas. */}
        <SankEmptyState
          // Esta línea sirve para pasar la propiedad «icon» con el valor «Dumbbell}».
          icon={Dumbbell}
          // Esta línea sirve para definir el atributo «title» con el valor «Generando tu plan».
          title="Generando tu plan"
          // Esta línea sirve para definir el atributo «description».
          description="Todavía estamos armando tu rutina. Vuelve en un momento."
        />
      </div>
    )
  }

  // Esta línea sirve para revisar si el entrenamiento está bloqueado.
  if (dailyLock.locked) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
      <div
        // Esta línea sirve para aplicar las clases de estilo «position-relative overflow-hidden rounded-2 s».
        className="position-relative overflow-hidden rounded-2 sank-hairline"
        // Esta línea sirve para pasar la propiedad «style» con el valor «{».
        style={{
          // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «`».
          background: `
            linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--sanken-black) 65%, transparent) 100%),
            radial-gradient(120% 140% at 100% 0%, rgba(0, 184, 217, 0.22), transparent 55%),
            var(--sanken-black-2)`,
          // Esta línea sirve para definir la sombra de la tarjeta.
          boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.7)",
        }}
      >
        {/* Esta línea sirve para abrir el elemento «div» con las clases «p-4 p-sm-5». */}
        <div className="p-4 p-sm-5">
          {/* Esta línea sirve para mostrar el título de la tarjeta. */}
          <p className="sank-eyebrow sank-eyebrow--cyan mb-2">Entrenamiento de hoy</p>
          {/* Esta línea sirve para abrir el elemento «h2» con las clases «display-6 sank-stat mb-4». */}
          <h2 className="display-6 sank-stat mb-4">
            {/* Esta línea sirve para mostrar si el entrenamiento fue saltado o completado. */}
            {dailyLock.reason === "skipped" ? "Entrenamiento saltado" : "✅ Entrenamiento completado"}
          </h2>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-2 p-3». */}
          <div className="rounded-2 p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            {/* Esta línea sirve para mostrar el aviso de próximo entrenamiento bloqueado. */}
            <p className="mb-1 fw-semibold">🔒 Próximo entrenamiento bloqueado</p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
            <p className="small text-body-secondary mb-0">
              {/* Esta línea sirve para mostrar la hora de desbloqueo y la cuenta regresiva. */}
              Se desbloquea a las 00:00{countdown ? ` · Disponible en ${countdown}` : ""}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Esta línea sirve para evitar mostrar algo si no hay día de entrenamiento.
  if (!day) return null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para aplicar las clases de estilo «position-relative overflow-hidden rounded-2 s».
      className="position-relative overflow-hidden rounded-2 sank-hairline"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{».
      style={{
        // El scrim de abajo usa color-mix con --sanken-black (no rgba(0,0,0,..)
        // fijo) a propósito: en dark eso da casi el mismo negro translúcido
        // de siempre (--sanken-black es casi negro puro), pero en light
        // produce un degradado hacia un tono CLARO en vez de un scrim negro
        // horneado que se vería fuera de lugar sobre un fondo claro.
        // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «`».
        background: `
          linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--sanken-black) 65%, transparent) 100%),
          radial-gradient(120% 140% at 100% 0%, rgba(0, 184, 217, 0.22), transparent 55%),
          var(--sanken-black-2)`,
        // Esta línea sirve para definir la sombra de la tarjeta.
        boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.7)",
      }}
    >
      {/* Esta línea sirve para abrir el elemento «div» con las clases «p-4 p-sm-5». */}
      <div className="p-4 p-sm-5">
        {/* Esta línea sirve para mostrar el título de la tarjeta. */}
        <p className="sank-eyebrow sank-eyebrow--cyan mb-2">Entrenamiento de hoy</p>
        {/* Esta línea sirve para mostrar el nombre del día de entrenamiento. */}
        <h2 className="display-4 sank-stat mb-0">{day.label}</h2>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-4 gap-sm-5 mt-4 mb-4». */}
        <div className="d-flex gap-4 gap-sm-5 mt-4 mb-4">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar los minutos estimados. */}
            <div className="display-6 sank-stat">{estimateWorkoutMinutes(day)}</div>
            {/* Esta línea sirve para mostrar la etiqueta de minutos. */}
            <p className="sank-eyebrow mb-0">Minutos</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar la cantidad de ejercicios. */}
            <div className="display-6 sank-stat">{day.exercises.length}</div>
            {/* Esta línea sirve para mostrar la etiqueta de ejercicios. */}
            <p className="sank-eyebrow mb-0">Ejercicios</p>
          </div>
        </div>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-wrap align-items-center gap-». */}
        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* Esta línea sirve para abrir el botón que lleva a la pantalla previa al entrenamiento. */}
          <SankButton variant="primary" size="lg" onClick={() => navigate("/workout/precheck")} iconEnd={<ArrowRight size={18} />}>
            {/* Esta línea sirve para mostrar el texto «Comenzar». */}
            Comenzar
          </SankButton>
          {/* Esta línea sirve para abrir el botón que pide confirmar saltar el entrenamiento. */}
          <SankButton variant="ghost" onClick={() => setConfirmingSkip(true)}>
            {/* Esta línea sirve para mostrar el texto «Saltar». */}
            Saltar
          </SankButton>
        </div>
      </div>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingSkip}».
        open={confirmingSkip}
        // Esta línea sirve para definir el atributo «title».
        title="¿Seguro que quieres saltar este entrenamiento?"
        // Esta línea sirve para definir el atributo «description».
        description="No se va a registrar como completado — pasa directo al siguiente entrenamiento de tu rutina."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, saltar».
        confirmLabel="Sí, saltar"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «skipMutation.isPending}».
        isLoading={skipMutation.isPending}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={() => skipMutation.mutate()}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingSkip(false)}
      />
    </div>
  )
}
