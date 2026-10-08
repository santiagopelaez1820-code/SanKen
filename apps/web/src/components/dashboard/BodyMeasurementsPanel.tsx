// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «Form» desde «react-bootstrap».
import { Form } from "react-bootstrap"
// Esta línea sirve para importar los tipos «BodyMeasurement» desde «@sanken/core».
import type { BodyMeasurement } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar el esquema de validación del formulario.
const measurementSchema = z.object({
  // Esta línea sirve para exigir un peso numérico entre 1 y 999.
  weight_kg: z.number().min(1, "Ingresa un peso válido").max(999),
})

// Esta línea sirve para declarar el tipo «MeasurementFormValues» como «z.infer<typeof measurementSchema>».
type MeasurementFormValues = z.infer<typeof measurementSchema>

// Esta línea sirve para declarar el componente del panel de medidas corporales.
export function BodyMeasurementsPanel() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["body-measurements"]».
    queryKey: ["body-measurements"],
    // Esta línea sirve para pedir la lista de medidas a la API.
    queryFn: () => api.getWithMeta<BodyMeasurement[]>("/body-measurements"),
  })

  // Esta línea sirve para desestructurar las herramientas del formulario.
  const {
    // Esta línea sirve para obtener la función que registra los campos.
    register,
    // Esta línea sirve para obtener la función que gestiona el envío.
    handleSubmit,
    // Esta línea sirve para obtener la función que limpia el formulario.
    reset,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para crear el formulario validado con el esquema.
  } = useForm<MeasurementFormValues>({ resolver: zodResolver(measurementSchema) })

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para enviar la nueva medida a la API.
    mutationFn: (values: MeasurementFormValues) => api.post("/body-measurements", values),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para limpiar el formulario tras guardar.
      reset()
      // Esta línea sirve para refrescar la lista de medidas.
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] })
      // Esta línea sirve para refrescar la gráfica de peso.
      queryClient.invalidateQueries({ queryKey: ["stats", "progress", "weight"] })
    },
  })

  // Esta línea sirve para obtener la lista de medidas o una lista vacía.
  const measurements = data?.data ?? []

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4 h-100».
    <div className="sank-surface rounded-2 p-4 h-100">
      {/* Esta línea sirve para mostrar el título del panel. */}
      <h2 className="sank-eyebrow mb-2">Medidas corporales</h2>

      {/* Esta línea sirve para abrir el formulario que guarda la medida al enviarse. */}
      <Form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="d-flex align-items-end gap-2">
        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group className="flex-grow-1">
          {/* Esta línea sirve para mostrar la etiqueta del campo de peso. */}
          <Form.Label className="small text-body-secondary mb-1">Peso de hoy (kg)</Form.Label>
          {/* Esta línea sirve para abrir el campo numérico del peso. */}
          <Form.Control
            // Esta línea sirve para definir el atributo «type» con el valor «number».
            type="number"
            // Esta línea sirve para definir el atributo «step» con el valor «0.1».
            step="0.1"
            // Esta línea sirve para definir el atributo «size» con el valor «sm».
            size="sm"
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.weight_kg}».
            isInvalid={!!errors.weight_kg}
            // Esta línea sirve para conectar el campo con el formulario como número.
            {...register("weight_kg", { valueAsNumber: true })}
          />
        </Form.Group>
        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="submit" size="sm" disabled={isSubmitting} loading={isSubmitting}>
          {/* Esta línea sirve para mostrar el texto «Registrar». */}
          Registrar
        </SankButton>
      </Form>
      {/* Esta línea sirve para mostrar el elemento solo si «errors.weight_kg». */}
      {errors.weight_kg && <p className="small mt-1 mb-0" style={{ color: "var(--bs-danger)" }}>{errors.weight_kg.message}</p>}

      {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
      {isLoading && <Skeleton style={{ height: 120, width: "100%" }} className="mt-3" />}

      {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && measurements.length === 0». */}
      {!isLoading && measurements.length === 0 && (
        // Esta línea sirve para mostrar el mensaje cuando no hay medidas.
        <p className="mt-3 small text-body-secondary mb-0">Todavía no hay medidas registradas.</p>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && measurements.length > 0». */}
      {!isLoading && measurements.length > 0 && (
        // Esta línea sirve para abrir el elemento «ul» con las clases «mt-2 list-unstyled mb-0».
        <ul className="mt-2 list-unstyled mb-0">
          {/* Esta línea sirve para recorrer «measurements.slice(0, 5)» y mostrar un bloque por elemento. */}
          {measurements.slice(0, 5).map((m) => (
            // Esta línea sirve para abrir el elemento «li».
            <li key={m.id} className="d-flex align-items-center justify-content-between py-2" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
              {/* Esta línea sirve para mostrar la fecha de la medida. */}
              <span className="small text-body-secondary">{m.measured_at}</span>
              {/* Esta línea sirve para mostrar el peso o un guion si no hay dato. */}
              <span className="small sank-tabular-nums">{m.weight_kg !== null ? `${m.weight_kg} kg` : "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
