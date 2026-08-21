import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ApiError, estimateWorkoutMinutes, findNextDay, type Routine, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export function NextWorkoutCard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmingSkip, setConfirmingSkip] = useState(false)

  const { data: envelope, isLoading, isError, error } = useQuery({
    queryKey: ["routines", "active"],
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
    retry: false,
  })

  const hasNoRoutine = isError && error instanceof ApiError && error.status === 404
  const genericError = isError && !hasNoRoutine

  const day = findNextDay(envelope?.data ?? null, (envelope?.meta?.next_day_id as number | null) ?? null)

  const skipMutation = useMutation({
    mutationFn: () => api.post<WorkoutSession>("/workout-sessions/skip", { routine_day_id: day?.id ?? null }),
    onSuccess: () => {
      setConfirmingSkip(false)
      queryClient.invalidateQueries({ queryKey: ["routines", "active"] })
    },
  })

  return (
    <div className="rounded-xl border border-secondary-accent/25 bg-secondary-accent/8 p-5">
      <p className="text-xs font-semibold tracking-widest text-secondary-accent">ENTRENAMIENTO DE HOY</p>

      {isLoading && <p className="mt-2 text-sm text-muted-foreground">Cargando tu plan…</p>}

      {genericError && <p className="mt-2 text-sm text-muted-foreground">No se pudo cargar tu rutina.</p>}

      {hasNoRoutine && (
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía estamos generando tu plan. Vuelve en un momento.
        </p>
      )}

      {day && (
        <>
          <h2 className="mt-1 font-heading text-lg font-bold text-foreground">{day.label}</h2>
          <p className="text-sm text-muted-foreground">
            {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => navigate("/workout/precheck")}>
              Comenzar entrenamiento
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmingSkip(true)}>
              Saltar entrenamiento
            </Button>
          </div>

          <ConfirmDialog
            open={confirmingSkip}
            title="¿Seguro que quieres saltar este entrenamiento?"
            description="No se va a registrar como completado — pasa directo al siguiente entrenamiento de tu rutina."
            confirmLabel="Sí, saltar"
            isLoading={skipMutation.isPending}
            onConfirm={() => skipMutation.mutate()}
            onCancel={() => setConfirmingSkip(false)}
          />
        </>
      )}
    </div>
  )
}
