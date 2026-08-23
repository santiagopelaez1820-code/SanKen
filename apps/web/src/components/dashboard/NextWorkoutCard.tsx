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

  if (isLoading) return <Skeleton style={{ height: 280, width: "100%" }} />

  if (genericError) {
    return (
      <div className="sank-surface rounded-2 p-4">
        <p className="small text-body-secondary mb-0">No se pudo cargar tu rutina.</p>
      </div>
    )
  }

  if (hasNoRoutine) {
    return (
      <div className="sank-surface sank-hairline rounded-2">
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
      className="position-relative overflow-hidden rounded-2 sank-hairline"
      style={{
        background: `
          linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%),
          radial-gradient(120% 140% at 100% 0%, rgba(255, 106, 0,0.22), transparent 55%),
          var(--sanken-black-2)`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.7)",
      }}
    >
      <div className="p-4 p-sm-5">
        <p className="sank-eyebrow sank-eyebrow--orange mb-2">Entrenamiento de hoy</p>
        <h2 className="display-4 sank-stat mb-0">{day.label}</h2>

        <div className="d-flex gap-4 gap-sm-5 mt-4 mb-4">
          <div>
            <div className="display-6 sank-stat">{estimateWorkoutMinutes(day)}</div>
            <p className="sank-eyebrow mb-0">Minutos</p>
          </div>
          <div>
            <div className="display-6 sank-stat">{day.exercises.length}</div>
            <p className="sank-eyebrow mb-0">Ejercicios</p>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <SankButton variant="primary" size="lg" onClick={() => navigate("/workout/precheck")} iconEnd={<ArrowRight size={18} />}>
            Comenzar
          </SankButton>
          <SankButton variant="ghost" onClick={() => setConfirmingSkip(true)}>
            Saltar
          </SankButton>
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
