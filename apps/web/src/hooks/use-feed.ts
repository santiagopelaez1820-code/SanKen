// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from "react"
// Esta línea sirve para importar «useQuery, useQueryClient» desde «@tanstack/react-query».
import { useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «FeedResponse» desde «@sanken/core».
import type { FeedResponse } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from "@/lib/echo"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"

/**
 * Feed unificado (Novedades + Notificaciones) — compartido entre el badge
 * del header (DashboardPage) y la página completa (FeedPage) para no
 * duplicar la suscripción en vivo a notificaciones nuevas (mismo canal que
 * antes usaba NotificationBell).
 */
// Esta línea sirve para declarar el hook que carga el feed de novedades.
export function useFeed() {
  // Esta línea sirve para declarar «queryClient» con el valor «useQueryClient()».
  const queryClient = useQueryClient()
  // Esta línea sirve para declarar «userId» con el valor «useAuthStore((state) => state.user?.id)».
  const userId = useAuthStore((state) => state.user?.id)

  // Esta línea sirve para declarar «query» con el valor «useQuery({».
  const query = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["feed"]».
    queryKey: ["feed"],
    // Esta línea sirve para pedir el feed a la API.
    queryFn: () => api.getWithMeta<FeedResponse["data"]>("/feed"),
  })

  // Esta línea sirve para declarar el efecto que escucha notificaciones en vivo.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!userId».
    if (!userId) return

    // Esta línea sirve para declarar «echo» con el valor «getEcho()».
    const echo = getEcho()
    // Esta línea sirve para declarar «channel» con el valor «echo.private(`App.Models.User.${userId}`)».
    const channel = echo.private(`App.Models.User.${userId}`)
    // Esta línea sirve para escuchar nuevas notificaciones del canal.
    channel.notification(() => {
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["feed"] }».
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    })
  // Esta línea sirve para volver a ejecutar el efecto si cambian el usuario o el cliente de caché.
  }, [userId, queryClient])

  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «query.data?.data ?? []».
    items: query.data?.data ?? [],
    // Esta línea sirve para devolver el número de notificaciones sin leer.
    unreadCount: (query.data?.meta?.unread_count as number | undefined) ?? 0,
    // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «query.isLoading».
    isLoading: query.isLoading,
    // Esta línea sirve para declarar la propiedad «isError» con el valor o tipo «query.isError».
    isError: query.isError,
    // Esta línea sirve para declarar la propiedad «refetch» con el valor o tipo «query.refetch».
    refetch: query.refetch,
  }
}
