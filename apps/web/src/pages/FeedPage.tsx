import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { FeedItem, NewChatMessageNotificationData } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFeed } from "@/hooks/use-feed"

function FeedItemRow({ item, onRead }: { item: FeedItem; onRead: (item: FeedItem) => void }) {
  const navigate = useNavigate()

  if (item.feed_type === "news") {
    return (
      <button
        onClick={() => onRead(item)}
        className={cn(
          "w-full rounded-xl border border-border bg-card p-5 text-left",
          !item.read_at && "border-primary/40 bg-primary/5"
        )}
      >
        <h2 className="font-heading text-lg font-medium">{item.title}</h2>
        <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
      </button>
    )
  }

  const chatData = item.data as unknown as NewChatMessageNotificationData
  return (
    <button
      onClick={() => {
        onRead(item)
        if (chatData.conversation_id) navigate(`/chat/${chatData.conversation_id}`)
      }}
      className={cn(
        "w-full rounded-xl border border-border bg-card p-5 text-left",
        !item.read_at && "border-primary/40 bg-primary/5"
      )}
    >
      <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
      <p className="font-medium">{chatData.sender_name}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{chatData.body}</p>
    </button>
  )
}

export function FeedPage() {
  const queryClient = useQueryClient()
  const { items, unreadCount, isLoading, isError, refetch } = useFeed()

  const markReadMutation = useMutation({
    mutationFn: (item: FeedItem) => api.post(`/feed/${item.feed_type}/${item.id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/feed/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Novedades</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        {unreadCount > 0 && (
          <button
            className="self-start text-sm text-primary hover:underline"
            onClick={() => markAllReadMutation.mutate()}
          >
            Marcar todo leído
          </button>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

        {isError && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-destructive">No se pudieron cargar tus novedades.</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay novedades ni notificaciones por ahora.</p>
        )}

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <FeedItemRow key={`${item.feed_type}-${item.id}`} item={item} onRead={(i) => markReadMutation.mutate(i)} />
          ))}
        </div>
      </div>
    </main>
  )
}
