import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ConversationWithMessages, MyTrainer } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function MyTrainerPage() {
  const navigate = useNavigate()

  const { data: trainers, isLoading } = useQuery({
    queryKey: ["me", "trainers"],
    queryFn: () => api.get<MyTrainer[]>("/me/trainers"),
  })

  const openChat = useMutation({
    mutationFn: (trainerClientId: number) =>
      api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`),
    onSuccess: (conversation) => navigate(`/chat/${conversation.conversation_id}`),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Mi entrenador</h1>

        {isLoading && <Skeleton className="h-20 w-full" />}

        {!isLoading && trainers?.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no tenés un entrenador asignado.</p>
        )}

        <div className="flex flex-col gap-3">
          {trainers?.map((relationship) => (
            <div
              key={relationship.trainer_client_id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">
                  {relationship.trainer.name}
                  {relationship.trainer.trainer_verified_at && (
                    <span className="ml-1.5 text-xs font-normal text-primary">✓ Verificado</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{relationship.trainer.email}</p>
              </div>
              <Button
                size="sm"
                disabled={openChat.isPending}
                onClick={() => openChat.mutate(relationship.trainer_client_id)}
              >
                Chatear
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
