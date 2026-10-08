// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar las utilidades y tipos del feed.
import { isLinkedNotificationData, type ApiSuccess, type FeedItem, type NewChatMessageNotificationData } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «useFeed» desde «@/hooks/use-feed».
import { useFeed } from "@/hooks/use-feed"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «FeedItemRow».
function FeedItemRow({ item, onRead }: { item: FeedItem; onRead: (item: FeedItem) => void }) {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()

  // Esta línea sirve para revisar si «item.feed_type === "news"».
  if (item.feed_type === "news") {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
      <button
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => !item.read_at && onRead(item)}
        // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
        className={cn(
          // Esta línea sirve para incluir el texto o las clases «w-full rounded-xl border border-border bg-car…».
          "w-full rounded-xl border border-border bg-card p-5 text-left",
          // Esta línea sirve para resaltar la tarjeta si no fue leída.
          !item.read_at && "border-primary/40 bg-primary/5"
        )}
      >
        {/* Esta línea sirve para mostrar el valor «item.title» dentro de un «h2». */}
        <h2 className="font-heading text-lg font-medium">{item.title}</h2>
        {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
        <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
        {/* Esta línea sirve para mostrar el valor «item.body» dentro de un «p». */}
        <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
      </button>
    )
  }

  // Notificaciones con título/cuerpo/link propios (soporte, check-in
  // semanal): se muestran tal cual y abren su `link`.
  // Esta línea sirve para revisar si «isLinkedNotificationData(item.data)».
  if (isLinkedNotificationData(item.data)) {
    // Esta línea sirve para extraer «at» de «item.data».
    const data = item.data
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
      <button
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => {
          // Esta línea sirve para marcar como leída si no lo estaba.
          if (!item.read_at) onRead(item)
          // Esta línea sirve para llamar a «navigate» con «data.link».
          navigate(data.link)
        }}
        // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
        className={cn(
          // Esta línea sirve para incluir el texto o las clases «w-full rounded-xl border border-border bg-car…».
          "w-full rounded-xl border border-border bg-card p-5 text-left",
          // Esta línea sirve para resaltar la tarjeta si no fue leída.
          !item.read_at && "border-primary/40 bg-primary/5"
        )}
      >
        {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
        <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
        {/* Esta línea sirve para mostrar el valor «data.title» dentro de un «p». */}
        <p className="font-medium">{data.title}</p>
        {/* Esta línea sirve para mostrar el valor «data.body» dentro de un «p». */}
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{data.body}</p>
      </button>
    )
  }

  // Esta línea sirve para extraer «hatDat» de «item.data as unknown as NewChatMessageNo».
  const chatData = item.data as unknown as NewChatMessageNotificationData
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
    <button
      // Esta línea sirve para asignar el manejador del evento «onClick».
      onClick={() => {
        // Esta línea sirve para marcar como leída si no lo estaba.
        if (!item.read_at) onRead(item)
        // Esta línea sirve para abrir el chat si la notificación trae una conversación.
        if (chatData.conversation_id) navigate(`/chat/${chatData.conversation_id}`)
      }}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «w-full rounded-xl border border-border bg-car…».
        "w-full rounded-xl border border-border bg-card p-5 text-left",
        // Esta línea sirve para resaltar la tarjeta si no fue leída.
        !item.read_at && "border-primary/40 bg-primary/5"
      )}
    >
      {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
      <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("es-AR")}</p>
      {/* Esta línea sirve para mostrar el valor «chatData.sender_name» dentro de un «p». */}
      <p className="font-medium">{chatData.sender_name}</p>
      {/* Esta línea sirve para mostrar el valor «chatData.body» dentro de un «p». */}
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{chatData.body}</p>
    </button>
  )
}

// Esta línea sirve para declarar la función «FeedPage».
export function FeedPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener las novedades y el contador desde el hook del feed.
  const { items, unreadCount, isLoading, isError, refetch } = useFeed()

  // Optimista: la tarjeta y el badge se actualizan en el mismo clic (antes
  // había que salir y volver a entrar — reporte del tester). onSettled
  // resincroniza con el servidor, y si falló vuelve al estado real.
  // Esta línea sirve para extraer «arkAsReadLocall» de «(predicate: (item: FeedItem) => boolean)».
  const markAsReadLocally = (predicate: (item: FeedItem) => boolean) => {
    // Esta línea sirve para extraer «eadA» de «new Date().toISOString()».
    const readAt = new Date().toISOString()
    // Esta línea sirve para actualizar la caché del feed.
    queryClient.setQueryData<ApiSuccess<FeedItem[]>>(["feed"], (old) => {
      // Esta línea sirve para devolver «old» si «!old».
      if (!old) return old
      // Esta línea sirve para extraer «ewlyRea» de «0».
      let newlyRead = 0
      // Esta línea sirve para extraer «at» de «old.data.map((i) => {».
      const data = old.data.map((i) => {
        // Esta línea sirve para devolver «i» si «i.read_at || !predicate(i)».
        if (i.read_at || !predicate(i)) return i
        // Esta línea sirve para contar la novedad que pasa a leída.
        newlyRead++
        // Esta línea sirve para devolver «{ ...i, read_at: readAt }».
        return { ...i, read_at: readAt }
      })
      // Esta línea sirve para extraer «nrea» de «(old.meta?.unread_count as number | unde».
      const unread = (old.meta?.unread_count as number | undefined) ?? 0
      // Esta línea sirve para devolver los datos con el contador de no leídas actualizado.
      return { ...old, data, meta: { ...old.meta, unread_count: Math.max(0, unread - newlyRead) } }
    })
  }

  // Esta línea sirve para obtener «markReadMutation» con el hook «useMutation».
  const markReadMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/feed/${item.feed_type}/${item.id}/read».
    mutationFn: (item: FeedItem) => api.post(`/feed/${item.feed_type}/${item.id}/read`),
    // Esta línea sirve para marcar como leída en local antes de que responda la API.
    onMutate: (item) => markAsReadLocally((i) => i.feed_type === item.feed_type && i.id === item.id),
    // Esta línea sirve para refrescar el feed al terminar.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  // Esta línea sirve para obtener «markAllReadMutation» con el hook «useMutation».
  const markAllReadMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/feed/read-all».
    mutationFn: () => api.post("/feed/read-all"),
    // Esta línea sirve para declarar la propiedad «onMutate» con el valor o tipo «() => markAsReadLocally(() => true)».
    onMutate: () => markAsReadLocally(() => true),
    // Esta línea sirve para refrescar el feed al terminar.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-2xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Novedades» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Novedades</h1>

        {/* Esta línea sirve para mostrar el bloque solo si «unreadCount > 0». */}
        {unreadCount > 0 && (
          // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
          <button
            // Esta línea sirve para aplicar las clases de estilo «self-start text-sm text-primary hover:underli».
            className="self-start text-sm text-primary hover:underline"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => markAllReadMutation.mutate()}
          >
            {/* Esta línea sirve para mostrar el texto «Marcar todo leído». */}
            Marcar todo leído
          </button>
        )}

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para mostrar el bloque solo si «isError». */}
        {isError && (
          // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-start gap-2».
          <div className="flex flex-col items-start gap-2">
            {/* Esta línea sirve para mostrar el texto «No se pudieron cargar tus novedades.» dentro de un «p». */}
            <p className="text-sm text-destructive">No se pudieron cargar tus novedades.</p>
            {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              {/* Esta línea sirve para mostrar el texto «Reintentar». */}
              Reintentar
            </Button>
          </div>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && !isError && items.length === 0». */}
        {!isLoading && !isError && items.length === 0 && (
          // Esta línea sirve para mostrar el texto «No hay novedades ni notificaciones por ahora.» dentro de un «p».
          <p className="text-sm text-muted-foreground">No hay novedades ni notificaciones por ahora.</p>
        )}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-4». */}
        <div className="flex flex-col gap-4">
          {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
          {items.map((item) => (
            // Esta línea sirve para mostrar el componente «FeedItemRow».
            <FeedItemRow key={`${item.feed_type}-${item.id}`} item={item} onRead={(i) => markReadMutation.mutate(i)} />
          ))}
        </div>
      </div>
    </main>
  )
}
