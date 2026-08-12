import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AppNotification, NewChatMessageNotificationData } from "@sanken/core"
import { api } from "@/lib/api"
import { getEcho } from "@/lib/echo"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

/**
 * A diferencia de ChallengeProgressUpdated/MessageSent (broadcastAs custom),
 * las notificaciones usan el evento nativo de Laravel
 * (BroadcastNotificationCreated) — Echo tiene un helper dedicado para eso,
 * `channel.notification(cb)`, en vez de `.listen()`.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  const { data: response } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.getWithMeta<AppNotification[]>("/notifications"),
  })

  useEffect(() => {
    if (!userId) return

    const echo = getEcho()
    const channel = echo.private(`App.Models.User.${userId}`)
    channel.notification(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    })

    // No desuscribimos acá: esta suscripción vive mientras dure la sesión
    // (el usuario está logueado en toda la app), no atada al ciclo de vida
    // de este componente puntual — a diferencia del hilo de chat.
  }, [userId, queryClient])

  const markRead = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })

  const markAllRead = useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })

  const notifications = response?.data ?? []
  const unreadCount = (response?.meta?.unread_count as number) ?? 0

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm hover:bg-muted"
        aria-label="Notificaciones"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Notificaciones</p>
            {unreadCount > 0 && (
              <button className="text-xs text-primary hover:underline" onClick={() => markAllRead.mutate()}>
                Marcar todas leídas
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">No tenés notificaciones.</p>
          )}

          <ul className="mt-2 flex flex-col gap-1">
            {notifications.map((notification) => {
              const chatData = notification.data as unknown as NewChatMessageNotificationData
              return (
                <li key={notification.id}>
                  <button
                    onClick={() => {
                      markRead.mutate(notification.id)
                      setOpen(false)
                      if (chatData.conversation_id) navigate(`/chat/${chatData.conversation_id}`)
                    }}
                    className={cn(
                      "w-full rounded-lg p-2 text-left text-sm hover:bg-muted",
                      !notification.read_at && "bg-primary/5 font-medium"
                    )}
                  >
                    <p>{chatData.sender_name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{chatData.body}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
