import { useQuery } from "@tanstack/react-query"
import type { ConversationSummary } from "@sanken/core"
import { api } from "@/lib/api"

/**
 * Mismo queryKey que ChatInboxPage ("conversations") — TanStack Query
 * dedupea/cachea el fetch entre el badge del sidebar y la página completa,
 * no hay endpoint nuevo ni petición duplicada.
 */
export function useChatUnread() {
  const { data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  return (data ?? []).reduce((sum, c) => sum + c.unread_count, 0)
}
