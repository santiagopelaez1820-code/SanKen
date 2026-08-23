import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { ConversationSummary } from "@sanken/core"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function ChatInboxPage() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Chat</h1>

        {isLoading && <Skeleton className="h-20 w-full" />}

        {!isLoading && conversations?.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no tenés conversaciones.</p>
        )}

        <ul className="flex flex-col gap-2">
          {conversations?.map((conversation) => (
            <li key={conversation.id}>
              <Link
                to={`/chat/${conversation.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{conversation.other_party.name}</p>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {conversation.last_message?.body ?? "Sin mensajes todavía"}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                    {conversation.unread_count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
