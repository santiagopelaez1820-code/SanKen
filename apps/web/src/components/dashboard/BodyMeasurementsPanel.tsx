import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { BodyMeasurement } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const measurementSchema = z.object({
  weight_kg: z.number().min(1, "Ingresa un peso válido").max(999),
})

type MeasurementFormValues = z.infer<typeof measurementSchema>

export function BodyMeasurementsPanel() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["body-measurements"],
    queryFn: () => api.getWithMeta<BodyMeasurement[]>("/body-measurements"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MeasurementFormValues>({ resolver: zodResolver(measurementSchema) })

  const mutation = useMutation({
    mutationFn: (values: MeasurementFormValues) => api.post("/body-measurements", values),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] })
      queryClient.invalidateQueries({ queryKey: ["stats", "progress", "weight"] })
    },
  })

  const measurements = data?.data ?? []

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-sm font-medium text-foreground">Medidas corporales</h2>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="mt-3 flex items-end gap-2"
      >
        <div className="flex-1 space-y-1.5">
          <label htmlFor="weight_kg" className="text-xs font-medium text-muted-foreground">
            Peso de hoy (kg)
          </label>
          <input
            id="weight_kg"
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("weight_kg", { valueAsNumber: true })}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} size="sm">
          Registrar
        </Button>
      </form>
      {errors.weight_kg && <p className="mt-1 text-xs text-destructive">{errors.weight_kg.message}</p>}

      {isLoading && <Skeleton className="mt-4 h-20 w-full" />}

      {!isLoading && measurements.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay medidas registradas.</p>
      )}

      {!isLoading && measurements.length > 0 && (
        <ul className="mt-3 divide-y divide-border">
          {measurements.slice(0, 5).map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{m.measured_at}</span>
              <span className="text-foreground">{m.weight_kg !== null ? `${m.weight_kg} kg` : "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
