import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Dumbbell } from "lucide-react"
import { ApiError, estimateWorkoutMinutes, findNextDay, type Routine, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

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

  if (isLoading) return <Skeleton className="h-48 w-full" />

  if (genericError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">No se pudo cargar tu rutina.</p>
      </div>
    )
  }

  if (hasNoRoutine) {
    return (
      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={Dumbbell}
          title="Generando tu plan"
          description="Todavía estamos armando tu rutina. Vuelve en un momento."
        />
      </div>
    )
  }

  if (!day) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary-accent/12 via-card to-primary/8 p-6">
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-secondary-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-semibold tracking-widest text-secondary-accent uppercase">Entrenamiento de hoy</p>
        <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">{day.label}</h2>
        <p className="mt-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="emphasis" onClick={() => navigate("/workout/precheck")}>
            Comenzar entrenamiento
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="ghost" onClick={() => setConfirmingSkip(true)}>
            Saltar entrenamiento
          </Button>
        </div>
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
    </div>
  )
}
