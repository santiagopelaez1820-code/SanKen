import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ConversationWithMessages, Routine, TrainerClient, TrainerClientStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  pending: "Pendiente",
  active: "Activo",
  paused: "Pausado",
  ended: "Finalizado",
}

export function TrainerClientDetailPage() {
  const { trainerClientId } = useParams<{ trainerClientId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["trainer", "clients", trainerClientId],
    queryFn: () => api.getWithMeta<TrainerClient>(`/trainer/clients/${trainerClientId}`),
    enabled: Boolean(trainerClientId),
  })

  const statusMutation = useMutation({
    mutationFn: (status: TrainerClientStatus) =>
      api.patch<TrainerClient>(`/trainer/clients/${trainerClientId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients", trainerClientId] })
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
    },
  })

  const openChat = useMutation({
    mutationFn: () => api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`),
    onSuccess: (conversation) => navigate(`/chat/${conversation.conversation_id}`),
  })

  if (isLoading || !data) {
    return (
      <main className="px-6 py-8">
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  const trainerClient = data.data
  const activeRoutine = (data.meta?.active_routine as Routine | null) ?? null
  const ownsActiveRoutine = activeRoutine?.source === "trainer"

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <Link to="/trainer" className="text-xs text-muted-foreground hover:underline">
            ← Mis clientes
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">{trainerClient.client.name}</h1>
          <p className="text-sm text-muted-foreground">{trainerClient.client.email}</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-sm font-medium text-foreground">Relación</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Estado: <span className="font-medium text-foreground">{STATUS_LABELS[trainerClient.status]}</span>
                {trainerClient.started_at && ` · desde ${new Date(trainerClient.started_at).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              {trainerClient.status === "active" && (
                <Button size="sm" disabled={openChat.isPending} onClick={() => openChat.mutate()}>
                  Chat
                </Button>
              )}
              {trainerClient.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate("paused")}
                >
                  Pausar
                </Button>
              )}
              {trainerClient.status === "paused" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate("active")}
                >
                  Reactivar
                </Button>
              )}
              {trainerClient.status !== "ended" && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate("ended")}
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Rutina activa</h2>

          {!activeRoutine && (
            <p className="mt-2 text-sm text-muted-foreground">Este cliente no tiene una rutina activa.</p>
          )}

          {activeRoutine && (
            <div className="mt-2 text-sm">
              <p className="text-foreground">
                {activeRoutine.split_type} · {activeRoutine.frequency_days} días/semana · {activeRoutine.duration_weeks} semanas
              </p>
              <p className="text-xs text-muted-foreground">
                Origen: {activeRoutine.source === "trainer" ? "asignada manualmente" : "motor automático"}
              </p>
            </div>
          )}

          {trainerClient.status === "active" && (
            <div className="mt-4">
              {ownsActiveRoutine ? (
                <Button size="sm" onClick={() => navigate(`/trainer/routines/${activeRoutine!.id}/edit`)}>
                  Editar rutina
                </Button>
              ) : (
                <Button size="sm" onClick={() => navigate(`/trainer/clients/${trainerClientId}/routine/new`)}>
                  Asignar rutina manual
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
