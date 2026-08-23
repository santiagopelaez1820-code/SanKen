import { useQuery } from "@tanstack/react-query"
import type { VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Dumbbell } from "lucide-react"
import { getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInUp, staggerContainer } from "@/lib/motion"

const STATUS_BADGE_VARIANT: Record<
  ReturnType<typeof getWorkoutSessionStatus>,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  completed: "success",
  active: "accent2",
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
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-sm font-medium text-foreground">Historial de entrenamientos</h2>

      {isLoading && <Skeleton className="mt-4 h-20 w-full" />}

      {!isLoading && sessions.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay entrenamientos registrados.</p>
      )}

      {!isLoading && sessions.length > 0 && (
        <motion.ul
          className="mt-3 divide-y divide-border"
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
                className="flex items-center gap-3 rounded-lg py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Dumbbell className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{session.routine_day_label ?? "Sesión libre"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(session.performed_at)} · {session.exercises.length} ejercicios
                    {session.completed && session.duration_minutes !== null
                      ? ` · ${session.duration_minutes} min`
                      : ""}
                  </p>
                </div>
                <Badge variant={STATUS_BADGE_VARIANT[status]}>{WORKOUT_SESSION_STATUS_LABEL[status]}</Badge>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
