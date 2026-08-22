import { useQuery } from "@tanstack/react-query"
import type { WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

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
        <ul className="mt-3 divide-y divide-border">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="text-foreground">{session.routine_day_label ?? "Sesión libre"}</p>
                <p className="text-xs text-muted-foreground">
                  {session.performed_at} · {session.exercises.length} ejercicios
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {session.completed ? `${session.duration_minutes ?? "—"} min` : "En curso"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
