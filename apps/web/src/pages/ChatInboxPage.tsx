import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { ConversationSummary } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function ChatInboxPage() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Chat</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

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
