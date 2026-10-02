import type { SupportTicketMessage } from "@sanken/core"
import { formatSupportDate, supportStrings as t } from "@/lib/support"
import { cn } from "@/lib/utils"

/**
 * Historial de la conversación. `viewer` decide de qué lado va cada burbuja:
 * para el usuario sus mensajes van a la derecha; para el equipo, los del
 * equipo. El texto se renderiza como texto (React lo escapa): nunca HTML.
 */
export function TicketConversation({ messages, viewer }: { messages: SupportTicketMessage[]; viewer: "user" | "staff" }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0" aria-label={t.conversation}>
      {messages.map((message) => {
        const mine = viewer === "staff" ? message.is_staff : !message.is_staff
        const author = message.is_staff
          ? (message.author_name ? `${message.author_name} · ${t.staffName}` : t.staffName)
          : viewer === "user"
            ? t.youName
            : (message.author_name ?? t.admin.user)

        return (
          <li key={message.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words",
                message.is_staff ? "border border-primary/30 bg-primary/10 text-foreground" : "bg-muted text-foreground"
              )}
            >
              {message.body}
            </div>
            <p className="m-0 px-1 text-xs text-muted-foreground">
              {author} · {formatSupportDate(message.created_at, true)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
