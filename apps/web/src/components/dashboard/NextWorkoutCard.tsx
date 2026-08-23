import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Dumbbell } from "lucide-react"
import { ApiError, estimateWorkoutMinutes, findNextDay, type Routine, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { SankButton } from "@/components/ui/SankButton"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { SankEmptyState } from "@/components/ui/SankEmptyState"

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

  if (isLoading) return <Skeleton style={{ height: 192, width: "100%" }} />

  if (genericError) {
    return (
      <div className="sank-surface rounded-4 p-4">
        <p className="small text-body-secondary mb-0">No se pudo cargar tu rutina.</p>
      </div>
    )
  }

  if (hasNoRoutine) {
    return (
      <div className="sank-surface rounded-4">
        <SankEmptyState
          icon={Dumbbell}
          title="Generando tu plan"
          description="Todavía estamos armando tu rutina. Vuelve en un momento."
        />
      </div>
    )
  }

  if (!day) return null

  return (
    <div
      className="position-relative overflow-hidden rounded-4 p-4 p-sm-5"
      style={{
        background:
          "radial-gradient(140% 180% at 100% 0%, rgba(201,162,39,0.18), transparent 55%), var(--sanken-black-2)",
        border: "1px solid rgba(201,162,39,0.18)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 20px 44px -18px rgba(0,0,0,0.65)",
      }}
    >
      <p className="small fw-semibold text-uppercase mb-1" style={{ letterSpacing: "0.08em", color: "var(--sanken-gold-light)" }}>
        Entrenamiento de hoy
      </p>
      <h2 className="display-6 fw-bold mb-1" style={{ letterSpacing: "-0.01em" }}>
        {day.label}
      </h2>
      <p className="small fw-medium text-uppercase text-body-secondary mb-4" style={{ letterSpacing: "0.04em" }}>
        {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
      </p>

      <div className="d-flex flex-wrap align-items-center gap-3">
        <SankButton variant="primary" onClick={() => navigate("/workout/precheck")} iconEnd={<ArrowRight size={16} />}>
          Comenzar entrenamiento
        </SankButton>
        <SankButton variant="ghost" onClick={() => setConfirmingSkip(true)}>
          Saltar entrenamiento
        </SankButton>
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
