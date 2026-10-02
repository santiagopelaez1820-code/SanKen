import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isLinkedNotificationData, type ApiSuccess, type FeedItem, type NewChatMessageNotificationData } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFeed } from "@/hooks/use-feed"
import { Skeleton } from "@/components/ui/skeleton"

function FeedItemRow({ item, onRead }: { item: FeedItem; onRead: (item: FeedItem) => void }) {
  const navigate = useNavigate()

  if (item.feed_type === "news") {
    return (
      <button
        onClick={() => !item.read_at && onRead(item)}
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

  // Notificaciones con título/cuerpo/link propios (soporte, check-in
  // semanal): se muestran tal cual y abren su `link`.
  if (isLinkedNotificationData(item.data)) {
    const data = item.data
    return (
      <button
        onClick={() => {
          if (!item.read_at) onRead(item)
          navigate(data.link)
        }}
        className={cn(
          "w-full rounded-xl border border-border bg-card p-5 text-left",
          !item.read_at && "border-primary/40 bg-primary/5"
        )}
      >
        <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
        <p className="font-medium">{data.title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{data.body}</p>
      </button>
    )
  }

  const chatData = item.data as unknown as NewChatMessageNotificationData
  return (
    <button
      onClick={() => {
        if (!item.read_at) onRead(item)
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

  // Optimista: la tarjeta y el badge se actualizan en el mismo clic (antes
  // había que salir y volver a entrar — reporte del tester). onSettled
  // resincroniza con el servidor, y si falló vuelve al estado real.
  const markAsReadLocally = (predicate: (item: FeedItem) => boolean) => {
    const readAt = new Date().toISOString()
    queryClient.setQueryData<ApiSuccess<FeedItem[]>>(["feed"], (old) => {
      if (!old) return old
      let newlyRead = 0
      const data = old.data.map((i) => {
        if (i.read_at || !predicate(i)) return i
        newlyRead++
        return { ...i, read_at: readAt }
      })
      const unread = (old.meta?.unread_count as number | undefined) ?? 0
      return { ...old, data, meta: { ...old.meta, unread_count: Math.max(0, unread - newlyRead) } }
    })
  }

  const markReadMutation = useMutation({
    mutationFn: (item: FeedItem) => api.post(`/feed/${item.feed_type}/${item.id}/read`),
    onMutate: (item) => markAsReadLocally((i) => i.feed_type === item.feed_type && i.id === item.id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/feed/read-all"),
    onMutate: () => markAsReadLocally(() => true),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Novedades</h1>

        {unreadCount > 0 && (
          <button
            className="self-start text-sm text-primary hover:underline"
            onClick={() => markAllReadMutation.mutate()}
          >
            Marcar todo leído
          </button>
        )}

        {isLoading && <Skeleton className="h-20 w-full" />}

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
