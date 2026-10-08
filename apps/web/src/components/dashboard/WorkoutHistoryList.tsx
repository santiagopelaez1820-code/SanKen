// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Dumbbell» desde «lucide-react».
import { Dumbbell } from "lucide-react"
// Esta línea sirve para importar el estado de sesión, sus etiquetas y el tipo de sesión.
import { getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankBadge, type SankBadgeVariant» desde «@/components/ui/SankBadge».
import { SankBadge, type SankBadgeVariant } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la variante de insignia de cada estado de sesión.
const STATUS_BADGE_VARIANT: Record<ReturnType<typeof getWorkoutSessionStatus>, SankBadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «"success"».
  completed: "success",
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «"cyan"».
  active: "cyan",
  // Esta línea sirve para declarar la propiedad «skipped» con el valor o tipo «"neutral"».
  skipped: "neutral",
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «"warning"».
  cancelled: "warning",
}

// Esta línea sirve para declarar la función que da formato a la fecha de una sesión.
function formatDate(performedAt: string): string {
  // Esta línea sirve para crear la fecha a partir del texto recibido.
  return new Date(performedAt)
    // Esta línea sirve para formatear la fecha en español con día, mes corto y año.
    .toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    // Esta línea sirve para pasar la fecha a mayúsculas.
    .toUpperCase()
}

// Esta línea sirve para declarar el componente de la lista del historial de entrenamientos.
export function WorkoutHistoryList() {
  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["workout-sessions"]».
    queryKey: ["workout-sessions"],
    // Esta línea sirve para pedir las sesiones de entrenamiento a la API.
    queryFn: () => api.getWithMeta<WorkoutSession[]>("/workout-sessions"),
  })

  // Esta línea sirve para obtener la lista de sesiones o una lista vacía.
  const sessions = data?.data ?? []

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4 h-100».
    <div className="sank-surface rounded-2 p-4 h-100">
      {/* Esta línea sirve para mostrar el título de la sección. */}
      <h2 className="sank-eyebrow mb-1">Historial de entrenamientos</h2>

      {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
      {isLoading && <Skeleton style={{ height: 160, width: "100%" }} className="mt-3" />}

      {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && sessions.length === 0». */}
      {!isLoading && sessions.length === 0 && (
        // Esta línea sirve para mostrar el mensaje cuando no hay entrenamientos.
        <p className="mt-3 small text-body-secondary mb-0">Todavía no hay entrenamientos registrados.</p>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && sessions.length > 0». */}
      {!isLoading && sessions.length > 0 && (
        // Esta línea sirve para abrir la lista animada.
        <motion.ul
          // Esta línea sirve para aplicar las clases de estilo «mt-2 list-unstyled mb-0».
          className="mt-2 list-unstyled mb-0"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{ maxHeight: 420, overflowY: "auto" }}».
          style={{ maxHeight: 420, overflowY: "auto" }}
          // Esta línea sirve para pasar la propiedad «variants» con el valor «staggerContainer(0.04)}».
          variants={staggerContainer(0.04)}
          // Esta línea sirve para definir el atributo «initial» con el valor «hidden».
          initial="hidden"
          // Esta línea sirve para definir el atributo «animate» con el valor «show».
          animate="show"
        >
          {/* Esta línea sirve para recorrer las sesiones para dibujar cada una. */}
          {sessions.map((session) => {
            // Esta línea sirve para calcular el estado de la sesión.
            const status = getWorkoutSessionStatus(session)
            // Esta línea sirve para devolver la interfaz del componente.
            return (
              // Esta línea sirve para abrir el elemento animado de la sesión.
              <motion.li
                // Esta línea sirve para identificar el elemento de la lista con «session.id}».
                key={session.id}
                // Esta línea sirve para pasar la propiedad «variants» con el valor «fadeInUp}».
                variants={fadeInUp}
                // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center gap-3 rounded-1 py-».
                className="d-flex align-items-center gap-3 rounded-1 py-2"
              >
                {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
                <div
                  // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 34, height: 34, background: "var(--s».
                  style={{ width: 34, height: 34, background: "var(--sanken-charcoal)" }}
                >
                  {/* Esta línea sirve para abrir el componente «Dumbbell». */}
                  <Dumbbell size={15} className="text-body-secondary" />
                </div>
                {/* Esta línea sirve para abrir el elemento «div» con las clases «flex-grow-1». */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  {/* Esta línea sirve para mostrar el nombre del día o «Sesión libre». */}
                  <p className="small text-truncate mb-0">{session.routine_day_label ?? "Sesión libre"}</p>
                  {/* Esta línea sirve para abrir el elemento «p» con las clases «text-body-secondary mb-0». */}
                  <p className="text-body-secondary mb-0" style={{ fontSize: "0.72rem" }}>
                    {/* Esta línea sirve para mostrar la fecha y la cantidad de ejercicios. */}
                    {formatDate(session.performed_at)} · {session.exercises.length} ejercicios
                    {/* Esta línea sirve para revisar si la sesión terminó y tiene duración. */}
                    {session.completed && session.duration_minutes !== null
                      // Esta línea sirve para agregar la duración en minutos.
                      ? ` · ${session.duration_minutes} min`
                      // Esta línea sirve para dejar vacío si no aplica.
                      : ""}
                  </p>
                </div>
                {/* Esta línea sirve para mostrar la insignia con el estado de la sesión. */}
                <SankBadge variant={STATUS_BADGE_VARIANT[status]}>{WORKOUT_SESSION_STATUS_LABEL[status]}</SankBadge>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
