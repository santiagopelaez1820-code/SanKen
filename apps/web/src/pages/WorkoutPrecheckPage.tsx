// Esta línea sirve para importar «Controller, useForm» desde «react-hook-form».
import { Controller, useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery» desde «@tanstack/react-query».
import { useMutation, useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar el error de la API, la búsqueda del siguiente día y los tipos de sesión.
import { ApiError, findNextDay, type Routine, type StartWorkoutSessionPayload, type WorkoutSession } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ScaleSelector» desde «@/components/workout/ScaleSelector».
import { ScaleSelector } from "@/components/workout/ScaleSelector"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «precheckSchema» con el valor «z.object({».
const precheckSchema = z.object({
  // Esta línea sirve para validar el campo «sleep_quality» con el esquema de Zod.
  sleep_quality: z.number().min(1).max(5).nullable(),
  // Esta línea sirve para validar el campo «energy_level» con el esquema de Zod.
  energy_level: z.number().min(1).max(5).nullable(),
  // Esta línea sirve para validar el campo «muscle_soreness» con el esquema de Zod.
  muscle_soreness: z.number().min(1).max(5).nullable(),
})

// Esta línea sirve para declarar el tipo «PrecheckFormValues» como «z.infer<typeof precheckSchema>».
type PrecheckFormValues = z.infer<typeof precheckSchema>

// Esta línea sirve para declarar la función «WorkoutPrecheckPage».
export function WorkoutPrecheckPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()

  // Esta línea sirve para obtener «data: envelope, isLoading» con el hook «useQuery».
  const { data: envelope, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["routines", "active"]».
    queryKey: ["routines", "active"],
    // Esta línea sirve para pedir a la API los datos de «/routines/active».
    queryFn: () => api.getWithMeta<Routine>("/routines/active"),
  })

  // Esta línea sirve para extraer «a» de «findNextDay(envelope?.data ?? null, (env».
  const day = findNextDay(envelope?.data ?? null, (envelope?.meta?.next_day_id as number | null) ?? null)

  // Esta línea sirve para extraer «control, handleSubmit» de «useForm<PrecheckFormValues>({».
  const { control, handleSubmit } = useForm<PrecheckFormValues>({
    // Esta línea sirve para declarar la propiedad «resolver» con el valor o tipo «zodResolver(precheckSchema)».
    resolver: zodResolver(precheckSchema),
    // Esta línea sirve para definir los valores iniciales de sueño, energía y dolor muscular como vacíos.
    defaultValues: { sleep_quality: null, energy_level: null, muscle_soreness: null },
  })

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(values: PrecheckFormValues) =>».
    mutationFn: (values: PrecheckFormValues) =>
      // Esta línea sirve para enviar a la API el inicio de la sesión de entrenamiento.
      api.post<WorkoutSession>("/workout-sessions", {
        // Esta línea sirve para declarar la propiedad «routine_day_id» con el valor o tipo «day?.id ?? null».
        routine_day_id: day?.id ?? null,
        // Esta línea sirve para declarar la propiedad «sleep_quality» con el valor o tipo «values.sleep_quality ?? undefined».
        sleep_quality: values.sleep_quality ?? undefined,
        // Esta línea sirve para declarar la propiedad «energy_level» con el valor o tipo «values.energy_level ?? undefined».
        energy_level: values.energy_level ?? undefined,
        // Esta línea sirve para declarar la propiedad «muscle_soreness» con el valor o tipo «values.muscle_soreness ?? undefined».
        muscle_soreness: values.muscle_soreness ?? undefined,
      // Esta línea sirve para verificar que el cuerpo cumple el tipo de inicio de sesión.
      } satisfies StartWorkoutSessionPayload),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (session) => navigate(`/workout/session/${session.id}`),
  })

  // Esta línea sirve para revisar si «isLoading».
  if (isLoading) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-6». */}
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «header». */}
        <header>
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => navigate(-1)}
            // Esta línea sirve para aplicar las clases de estilo «text-xs text-muted-foreground hover:underline».
            className="text-xs text-muted-foreground hover:underline"
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «← Volver». */}
            ← Volver
          </button>
          {/* Esta línea sirve para abrir el elemento «h1» con las clases «mt-1 font-heading text-2xl font-medium t». */}
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">
            {/* Esta línea sirve para mostrar el contenido dinámico «{day ? day.label : "Entrenamiento"}». */}
            {day ? day.label : "Entrenamiento"}
          </h1>
          {/* Esta línea sirve para mostrar el texto «¿Cómo llegas hoy?» dentro de un «p». */}
          <p className="text-sm text-muted-foreground">¿Cómo llegas hoy?</p>
        </header>

        {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
        <form
          // Esta línea sirve para asignar el manejador del evento «onSubmit».
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          // Esta línea sirve para aplicar las clases de estilo «flex flex-col gap-5 rounded-xl border border-».
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
        >
          {/* Esta línea sirve para abrir el elemento «Controller» con sus atributos en varias líneas. */}
          <Controller
            // Esta línea sirve para pasar la propiedad «control» con el valor «control}».
            control={control}
            // Esta línea sirve para definir el atributo «name» con el valor «sleep_quality».
            name="sleep_quality"
            // Esta línea sirve para pasar la propiedad «render» con el valor «({ field }) => (».
            render={({ field }) => (
              // Esta línea sirve para abrir el componente «ScaleSelector».
              <ScaleSelector label="Calidad de sueño" value={field.value} onChange={field.onChange} />
            )}
          />
          {/* Esta línea sirve para abrir el elemento «Controller» con sus atributos en varias líneas. */}
          <Controller
            // Esta línea sirve para pasar la propiedad «control» con el valor «control}».
            control={control}
            // Esta línea sirve para definir el atributo «name» con el valor «energy_level».
            name="energy_level"
            // Esta línea sirve para pasar la propiedad «render» con el valor «({ field }) => (».
            render={({ field }) => (
              // Esta línea sirve para abrir el componente «ScaleSelector».
              <ScaleSelector label="Nivel de energía" value={field.value} onChange={field.onChange} />
            )}
          />
          {/* Esta línea sirve para abrir el elemento «Controller» con sus atributos en varias líneas. */}
          <Controller
            // Esta línea sirve para pasar la propiedad «control» con el valor «control}».
            control={control}
            // Esta línea sirve para definir el atributo «name» con el valor «muscle_soreness».
            name="muscle_soreness"
            // Esta línea sirve para pasar la propiedad «render» con el valor «({ field }) => (».
            render={({ field }) => (
              // Esta línea sirve para abrir el componente «ScaleSelector».
              <ScaleSelector label="Dolor muscular" value={field.value} onChange={field.onChange} />
            )}
          />

          {/* Esta línea sirve para mostrar el bloque solo si «mutation.isError». */}
          {mutation.isError && (
            // Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-destructive».
            <p className="text-sm text-destructive">
              {/* Esta línea sirve para mostrar el mensaje de error de la API o uno genérico. */}
              {mutation.error instanceof ApiError ? mutation.error.body.message : "No se pudo iniciar el entrenamiento."}
            </p>
          )}

          {/* Esta línea sirve para abrir el componente «Button». */}
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {/* Esta línea sirve para mostrar el contenido dinámico «{mutation.isPending ? "Comenzando…" : "Comenzar"}». */}
            {mutation.isPending ? "Comenzando…" : "Comenzar"}
          </Button>
        </form>
      </div>
    </main>
  )
}
