import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { FeedResponse } from "@sanken/core"
import { api } from "@/lib/api"
import { getEcho } from "@/lib/echo"
import { useAuthStore } from "@/lib/auth-store"

/**
 * Feed unificado (Novedades + Notificaciones) — compartido entre el badge
 * del header (DashboardPage) y la página completa (FeedPage) para no
 * duplicar la suscripción en vivo a notificaciones nuevas (mismo canal que
 * antes usaba NotificationBell).
 */
export function useFeed() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  const query = useQuery({
    queryKey: ["feed"],
    queryFn: () => api.getWithMeta<FeedResponse["data"]>("/feed"),
  })

  useEffect(() => {
    if (!userId) return

    const echo = getEcho()
    const channel = echo.private(`App.Models.User.${userId}`)
    channel.notification(() => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    })
  }, [userId, queryClient])

  return {
    items: query.data?.data ?? [],
    unreadCount: (query.data?.meta?.unread_count as number | undefined) ?? 0,
    isLoading: query.isLoading,
  }
}
