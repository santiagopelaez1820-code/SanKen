// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «ApiError, type TrainerClient, type TrainerClientStatus» desde «@sanken/core».
import { ApiError, type TrainerClient, type TrainerClientStatus } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «addClientSchema» con el valor «z.object({».
const addClientSchema = z.object({
  // Esta línea sirve para validar el campo «email» con el esquema de Zod.
  email: z.string().email("Ingresa un correo válido"),
})

// Esta línea sirve para declarar el tipo «AddClientFormValues» como «z.infer<typeof addClientSchema>».
type AddClientFormValues = z.infer<typeof addClientSchema>

// Esta línea sirve para declarar «STATUS_LABELS» con el valor «{».
const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"Pendiente"».
  pending: "Pendiente",
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «"Activo"».
  active: "Activo",
  // Esta línea sirve para declarar la propiedad «paused» con el valor o tipo «"Pausado"».
  paused: "Pausado",
  // Esta línea sirve para declarar la propiedad «ended» con el valor o tipo «"Finalizado"».
  ended: "Finalizado",
}

// Esta línea sirve para declarar «STATUS_CLASSES» con el valor «{».
const STATUS_CLASSES: Record<TrainerClientStatus, string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"text-muted-foreground"».
  pending: "text-muted-foreground",
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «"text-primary"».
  active: "text-primary",
  // Esta línea sirve para declarar la propiedad «paused» con el valor o tipo «"text-muted-foreground"».
  paused: "text-muted-foreground",
  // Esta línea sirve para declarar la propiedad «ended» con el valor o tipo «"text-destructive"».
  ended: "text-destructive",
}

// Esta línea sirve para declarar la función «TrainerClientsPage».
export function TrainerClientsPage() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()

  // Esta línea sirve para obtener «data: clients, isLoading» con el hook «useQuery».
  const { data: clients, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["trainer", "clients"]».
    queryKey: ["trainer", "clients"],
    // Esta línea sirve para pedir a la API los datos de «/trainer/clients».
    queryFn: () => api.get<TrainerClient[]>("/trainer/clients"),
  })

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para incluir el valor «reset» en la lista.
    reset,
    // Esta línea sirve para incluir el valor «setError» en la lista.
    setError,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado.
  } = useForm<AddClientFormValues>({ resolver: zodResolver(addClientSchema) })

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/trainer/clients».
    mutationFn: (values: AddClientFormValues) => api.post<TrainerClient>("/trainer/clients", values),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => {
      // Esta línea sirve para llamar a «reset».
      reset()
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["trainer", "clients"] }».
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) => {
      // Esta línea sirve para extraer «essag» de «err instanceof ApiError ? err.body.error».
      const message = err instanceof ApiError ? err.body.errors?.email?.[0] ?? err.body.message : "No se pudo agregar al cliente."
      // Esta línea sirve para guardar en el estado con «setError» el valor «"email", { message })…».
      setError("email", { message })
    },
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el texto «Entrenador» dentro de un «p». */}
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Entrenador</p>
          {/* Esta línea sirve para abrir el elemento «h1» con las clases «font-heading text-2xl font-bold tracking». */}
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {/* Esta línea sirve para mostrar el contenido dinámico «Hola, {user?.name?.split(" ")[0] ?? "coach"}». */}
            Hola, {user?.name?.split(" ")[0] ?? "coach"}
          </h1>
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Agregar cliente» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Agregar cliente</h2>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
          <p className="mt-1 text-xs text-muted-foreground">
            {/* Esta línea sirve para explicar que el cliente debe tener cuenta en SanKen. */}
            El cliente debe tener una cuenta creada en SanKen. Ingresa su correo para vincularlo.
          </p>

          {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
          <form
            // Esta línea sirve para asignar el manejador del evento «onSubmit».
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            // Esta línea sirve para aplicar las clases de estilo «mt-3 flex items-end gap-2».
            className="mt-3 flex items-end gap-2"
          >
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex-1 space-y-1.5». */}
            <div className="flex-1 space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                {/* Esta línea sirve para mostrar el texto «Correo del cliente». */}
                Correo del cliente
              </label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «id» con el valor «email».
                id="email"
                // Esta línea sirve para definir el atributo «type» con el valor «email».
                type="email"
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para conectar el campo «email» con el formulario.
                {...register("email")}
              />
            </div>
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button type="submit" disabled={isSubmitting} size="sm">
              {/* Esta línea sirve para mostrar el texto «Agregar». */}
              Agregar
            </Button>
          </form>
          {/* Esta línea sirve para mostrar el elemento solo si «errors.email». */}
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Mis clientes» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Mis clientes</h2>

          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="mt-4 h-20 w-full" />}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && clients?.length === 0». */}
          {!isLoading && clients?.length === 0 && (
            // Esta línea sirve para mostrar el texto «Todavía no tienes clientes vinculados.» dentro de un «p».
            <p className="mt-4 text-sm text-muted-foreground">Todavía no tienes clientes vinculados.</p>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && clients && clients.length > 0». */}
          {!isLoading && clients && clients.length > 0 && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «mt-3 divide-y divide-border».
            <ul className="mt-3 divide-y divide-border">
              {/* Esta línea sirve para recorrer «clients» y mostrar un bloque por elemento. */}
              {clients.map((trainerClient) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={trainerClient.id} className="py-2.5">
                  {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
                  <Link
                    // Esta línea sirve para pasar la propiedad «to» con el valor «`/trainer/clients/${trainerClient.id}`}».
                    to={`/trainer/clients/${trainerClient.id}`}
                    // Esta línea sirve para aplicar las clases de estilo «flex items-center justify-between rounded-lg ».
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {/* Esta línea sirve para abrir el elemento «div». */}
                    <div>
                      {/* Esta línea sirve para mostrar el valor «trainerClient.client.name» dentro de un «p». */}
                      <p className="text-foreground">{trainerClient.client.name}</p>
                      {/* Esta línea sirve para mostrar el valor «trainerClient.client.email» dentro de un «p». */}
                      <p className="text-xs text-muted-foreground">{trainerClient.client.email}</p>
                    </div>
                    {/* Esta línea sirve para abrir el elemento «span». */}
                    <span className={`text-xs font-medium ${STATUS_CLASSES[trainerClient.status]}`}>
                      {/* Esta línea sirve para mostrar el contenido dinámico «{STATUS_LABELS[trainerClient.status]}». */}
                      {STATUS_LABELS[trainerClient.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
