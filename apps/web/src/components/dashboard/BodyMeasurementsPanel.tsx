import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Form } from "react-bootstrap"
import type { BodyMeasurement } from "@sanken/core"
import { api } from "@/lib/api"
import { SankButton } from "@/components/ui/SankButton"
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
    <div className="sank-surface rounded-2 p-4 h-100">
      <h2 className="sank-eyebrow mb-2">Medidas corporales</h2>

      <Form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="d-flex align-items-end gap-2">
        <Form.Group className="flex-grow-1">
          <Form.Label className="small text-body-secondary mb-1">Peso de hoy (kg)</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            size="sm"
            isInvalid={!!errors.weight_kg}
            {...register("weight_kg", { valueAsNumber: true })}
          />
        </Form.Group>
        <SankButton type="submit" size="sm" disabled={isSubmitting} loading={isSubmitting}>
          Registrar
        </SankButton>
      </Form>
      {errors.weight_kg && <p className="small mt-1 mb-0" style={{ color: "var(--bs-danger)" }}>{errors.weight_kg.message}</p>}

      {isLoading && <Skeleton style={{ height: 120, width: "100%" }} className="mt-3" />}

      {!isLoading && measurements.length === 0 && (
        <p className="mt-3 small text-body-secondary mb-0">Todavía no hay medidas registradas.</p>
      )}

      {!isLoading && measurements.length > 0 && (
        <ul className="mt-2 list-unstyled mb-0">
          {measurements.slice(0, 5).map((m) => (
            <li key={m.id} className="d-flex align-items-center justify-content-between py-2" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
              <span className="small text-body-secondary">{m.measured_at}</span>
              <span className="small sank-tabular-nums">{m.weight_kg !== null ? `${m.weight_kg} kg` : "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
