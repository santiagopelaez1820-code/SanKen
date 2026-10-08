// Esta línea sirve para importar los tipos «SupportTicketMessage» desde «@sanken/core».
import type { SupportTicketMessage } from "@sanken/core"
// Esta línea sirve para importar «formatSupportDate, supportStrings as t» desde «@/lib/support».
import { formatSupportDate, supportStrings as t } from "@/lib/support"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

/**
 * Historial de la conversación. `viewer` decide de qué lado va cada burbuja:
 * para el usuario sus mensajes van a la derecha; para el equipo, los del
 * equipo. El texto se renderiza como texto (React lo escapa): nunca HTML.
 */
// Esta línea sirve para declarar el componente de la conversación de un ticket.
export function TicketConversation({ messages, viewer }: { messages: SupportTicketMessage[]; viewer: "user" | "staff" }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ol» con las clases «m-0 flex list-none flex-col gap-3 p-0».
    <ol className="m-0 flex list-none flex-col gap-3 p-0" aria-label={t.conversation}>
      {/* Esta línea sirve para recorrer los mensajes del ticket. */}
      {messages.map((message) => {
        // Esta línea sirve para calcular si el mensaje es del espectador actual.
        const mine = viewer === "staff" ? message.is_staff : !message.is_staff
        // Esta línea sirve para calcular el nombre del autor.
        const author = message.is_staff
          // Esta línea sirve para mostrar el nombre con la etiqueta del equipo si es del staff.
          ? (message.author_name ? `${message.author_name} · ${t.staffName}` : t.staffName)
          // Esta línea sirve para revisar si el espectador es el usuario.
          : viewer === "user"
            // Esta línea sirve para mostrar «Tú» para sus propios mensajes.
            ? t.youName
            // Esta línea sirve para mostrar el nombre del usuario en la vista del administrador.
            : (message.author_name ?? t.admin.user)

        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el elemento «li».
          <li key={message.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
            {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
            <div
              // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
              className={cn(
                // Esta línea sirve para aplicar las clases base de la burbuja.
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words",
                // Esta línea sirve para colorear la burbuja según sea del staff o del usuario.
                message.is_staff ? "border border-primary/30 bg-primary/10 text-foreground" : "bg-muted text-foreground"
              )}
            >
              {/* Esta línea sirve para mostrar el valor «message.body». */}
              {message.body}
            </div>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 px-1 text-xs text-muted-foreground». */}
            <p className="m-0 px-1 text-xs text-muted-foreground">
              {/* Esta línea sirve para mostrar el autor y la fecha del mensaje. */}
              {author} · {formatSupportDate(message.created_at, true)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
