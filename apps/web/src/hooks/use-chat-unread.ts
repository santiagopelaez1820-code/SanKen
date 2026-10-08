// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «ConversationSummary» desde «@sanken/core».
import type { ConversationSummary } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"

/**
 * Mismo queryKey que ChatInboxPage ("conversations") — TanStack Query
 * dedupea/cachea el fetch entre el badge del sidebar y la página completa,
 * no hay endpoint nuevo ni petición duplicada.
 */
// Esta línea sirve para declarar el hook que cuenta los mensajes sin leer.
export function useChatUnread() {
  // Esta línea sirve para extraer «data» de «useQuery({».
  const { data } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["conversations"]».
    queryKey: ["conversations"],
    // Esta línea sirve para pedir la lista de conversaciones a la API.
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  // Esta línea sirve para devolver la suma de mensajes sin leer de todas las conversaciones.
  return (data ?? []).reduce((sum, c) => sum + c.unread_count, 0)
}
