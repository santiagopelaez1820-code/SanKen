import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiError, type TrainerClient, type TrainerClientStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const addClientSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
})

type AddClientFormValues = z.infer<typeof addClientSchema>

const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  pending: "Pendiente",
  active: "Activo",
  paused: "Pausado",
  ended: "Finalizado",
}

const STATUS_CLASSES: Record<TrainerClientStatus, string> = {
  pending: "text-muted-foreground",
  active: "text-primary",
  paused: "text-muted-foreground",
  ended: "text-destructive",
}

export function TrainerClientsPage() {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const { data: clients, isLoading } = useQuery({
    queryKey: ["trainer", "clients"],
    queryFn: () => api.get<TrainerClient[]>("/trainer/clients"),
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddClientFormValues>({ resolver: zodResolver(addClientSchema) })

  const mutation = useMutation({
    mutationFn: (values: AddClientFormValues) => api.post<TrainerClient>("/trainer/clients", values),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.body.errors?.email?.[0] ?? err.body.message : "No se pudo agregar al cliente."
      setError("email", { message })
    },
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Entrenador</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Hola, {user?.name?.split(" ")[0] ?? "coach"}
          </h1>
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Agregar cliente</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            El cliente debe tener una cuenta creada en SanKen. Ingresa su correo para vincularlo.
          </p>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-3 flex items-end gap-2"
          >
            <div className="flex-1 space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Correo del cliente
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("email")}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} size="sm">
              Agregar
            </Button>
          </form>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Mis clientes</h2>

          {isLoading && <Skeleton className="mt-4 h-20 w-full" />}

          {!isLoading && clients?.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">Todavía no tienes clientes vinculados.</p>
          )}

          {!isLoading && clients && clients.length > 0 && (
            <ul className="mt-3 divide-y divide-border">
              {clients.map((trainerClient) => (
                <li key={trainerClient.id} className="py-2.5">
                  <Link
                    to={`/trainer/clients/${trainerClient.id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <div>
                      <p className="text-foreground">{trainerClient.client.name}</p>
                      <p className="text-xs text-muted-foreground">{trainerClient.client.email}</p>
                    </div>
                    <span className={`text-xs font-medium ${STATUS_CLASSES[trainerClient.status]}`}>
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
