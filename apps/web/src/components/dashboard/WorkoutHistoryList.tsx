import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Dumbbell } from "lucide-react"
import { getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { SankBadge, type SankBadgeVariant } from "@/components/ui/SankBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInUp, staggerContainer } from "@/lib/motion"

const STATUS_BADGE_VARIANT: Record<ReturnType<typeof getWorkoutSessionStatus>, SankBadgeVariant> = {
  completed: "success",
  active: "cyan",
  skipped: "neutral",
  cancelled: "warning",
}

function formatDate(performedAt: string): string {
  return new Date(performedAt)
    .toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase()
}

export function WorkoutHistoryList() {
  const { data, isLoading } = useQuery({
    queryKey: ["workout-sessions"],
    queryFn: () => api.getWithMeta<WorkoutSession[]>("/workout-sessions"),
  })

  const sessions = data?.data ?? []

  return (
    <div className="sank-surface rounded-2 p-4 h-100">
      <h2 className="sank-eyebrow mb-1">Historial de entrenamientos</h2>

      {isLoading && <Skeleton style={{ height: 160, width: "100%" }} className="mt-3" />}

      {!isLoading && sessions.length === 0 && (
        <p className="mt-3 small text-body-secondary mb-0">Todavía no hay entrenamientos registrados.</p>
      )}

      {!isLoading && sessions.length > 0 && (
        <motion.ul
          className="mt-2 list-unstyled mb-0"
          style={{ maxHeight: 420, overflowY: "auto" }}
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate="show"
        >
          {sessions.map((session) => {
            const status = getWorkoutSessionStatus(session)
            return (
              <motion.li
                key={session.id}
                variants={fadeInUp}
                className="d-flex align-items-center gap-3 rounded-1 py-2"
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ width: 34, height: 34, background: "var(--sanken-charcoal)" }}
                >
                  <Dumbbell size={15} className="text-body-secondary" />
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <p className="small text-truncate mb-0">{session.routine_day_label ?? "Sesión libre"}</p>
                  <p className="text-body-secondary mb-0" style={{ fontSize: "0.72rem" }}>
                    {formatDate(session.performed_at)} · {session.exercises.length} ejercicios
                    {session.completed && session.duration_minutes !== null
                      ? ` · ${session.duration_minutes} min`
                      : ""}
                  </p>
                </div>
                <SankBadge variant={STATUS_BADGE_VARIANT[status]}>{WORKOUT_SESSION_STATUS_LABEL[status]}</SankBadge>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
