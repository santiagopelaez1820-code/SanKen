import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ApiError, estimateWorkoutMinutes, findNextDay, type Routine } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function NextWorkoutCard() {
  const navigate = useNavigate()

  const { data: envelope, isLoading, isError, error } = useQuery({
    queryKey: ["routines", "active"],
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
    retry: false,
  })

  const hasNoRoutine = isError && error instanceof ApiError && error.status === 404
  const genericError = isError && !hasNoRoutine

  const day = findNextDay(envelope?.data ?? null, (envelope?.meta?.next_day_id as number | null) ?? null)

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/8 p-5">
      <p className="text-xs font-medium tracking-wide text-primary">ENTRENAMIENTO DE HOY</p>

      {isLoading && <p className="mt-2 text-sm text-muted-foreground">Cargando tu plan…</p>}

      {genericError && <p className="mt-2 text-sm text-muted-foreground">No se pudo cargar tu rutina.</p>}

      {hasNoRoutine && (
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía estamos generando tu plan. Vuelve en un momento.
        </p>
      )}

      {day && (
        <>
          <h2 className="mt-1 font-heading text-lg font-medium text-foreground">{day.label}</h2>
          <p className="text-sm text-muted-foreground">
            {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
          </p>
          <Button size="sm" className="mt-3" onClick={() => navigate("/workout/precheck")}>
            Comenzar
          </Button>
        </>
      )}
    </div>
  )
}
