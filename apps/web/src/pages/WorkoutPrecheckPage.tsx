import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ApiError, findNextDay, type Routine, type StartWorkoutSessionPayload, type WorkoutSession } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ScaleSelector } from "@/components/workout/ScaleSelector"

const precheckSchema = z.object({
  sleep_quality: z.number().min(1).max(5).nullable(),
  energy_level: z.number().min(1).max(5).nullable(),
  muscle_soreness: z.number().min(1).max(5).nullable(),
})

type PrecheckFormValues = z.infer<typeof precheckSchema>

export function WorkoutPrecheckPage() {
  const navigate = useNavigate()

  const { data: envelope, isLoading } = useQuery({
    queryKey: ["routines", "active"],
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
  })

  const day = findNextDay(envelope?.data ?? null, (envelope?.meta?.next_day_id as number | null) ?? null)

  const { control, handleSubmit } = useForm<PrecheckFormValues>({
    resolver: zodResolver(precheckSchema),
    defaultValues: { sleep_quality: null, energy_level: null, muscle_soreness: null },
  })

  const mutation = useMutation({
    mutationFn: (values: PrecheckFormValues) =>
      api.post<WorkoutSession>("/workout-sessions", {
        routine_day_id: day?.id ?? null,
        sleep_quality: values.sleep_quality ?? undefined,
        energy_level: values.energy_level ?? undefined,
        muscle_soreness: values.muscle_soreness ?? undefined,
      } satisfies StartWorkoutSessionPayload),
    onSuccess: (session) => navigate(`/workout/session/${session.id}`),
  })

  if (isLoading) {
    return (
      <main className="min-h-svh bg-background px-6 py-8 text-foreground">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs text-muted-foreground hover:underline"
          >
            ← Volver
          </button>
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">
            {day ? day.label : "Entrenamiento"}
          </h1>
          <p className="text-sm text-muted-foreground">¿Cómo llegas hoy?</p>
        </header>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
        >
          <Controller
            control={control}
            name="sleep_quality"
            render={({ field }) => (
              <ScaleSelector label="Calidad de sueño" value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            control={control}
            name="energy_level"
            render={({ field }) => (
              <ScaleSelector label="Nivel de energía" value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            control={control}
            name="muscle_soreness"
            render={({ field }) => (
              <ScaleSelector label="Dolor muscular" value={field.value} onChange={field.onChange} />
            )}
          />

          {mutation.isError && (
            <p className="text-sm text-destructive">
              {mutation.error instanceof ApiError ? mutation.error.body.message : "No se pudo iniciar el entrenamiento."}
            </p>
          )}

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Comenzando…" : "Comenzar"}
          </Button>
        </form>
      </div>
    </main>
  )
}
