// Esta línea sirve para importar «useRef» desde «react».
import { useRef } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «ConversationSummary» desde «@sanken/core».
import type { ConversationSummary } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"

// Esta línea sirve para declarar la función «ChatInboxPage».
export function ChatInboxPage() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para obtener «data: conversations, isLoading» con el hook «useQuery».
  const { data: conversations, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["conversations"]».
    queryKey: ["conversations"],
    // Esta línea sirve para pedir a la API los datos de «/conversations».
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «chat…».
    "chat",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «titleRef».
        target: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Chat con tu entrenador"».
        title: "Chat con tu entrenador",
        // Esta línea sirve para definir la propiedad «description» con «Acá hablás directo con tu entrenador asi…».
        description: "Acá hablás directo con tu entrenador asignado, en tiempo real.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tus conversaciones"».
        title: "Tus conversaciones",
        // Esta línea sirve para definir la propiedad «description» con «Cuando tengas conversaciones activas, la…».
        description: "Cuando tengas conversaciones activas, las vas a ver listadas acá con los mensajes sin leer marcados.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"¿Todavía no escribiste a nadie?"».
        title: "¿Todavía no escribiste a nadie?",
        // Esta línea sirve para definir la propiedad «description» con «Andá a "Mi entrenador" y hacé clic en "C…».
        description: 'Andá a "Mi entrenador" y hacé clic en "Chatear" para empezar una conversación.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    userId
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-6». */}
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «h1». */}
        <h1 ref={titleRef} className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {/* Esta línea sirve para mostrar el texto «Chat». */}
          Chat
        </h1>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && conversations?.length === 0». */}
        {!isLoading && conversations?.length === 0 && (
          // Esta línea sirve para mostrar el texto «Todavía no tenés conversaciones.» dentro de un «p».
          <p className="text-sm text-muted-foreground">Todavía no tenés conversaciones.</p>
        )}

        {/* Esta línea sirve para abrir el elemento «ul» con las clases «flex flex-col gap-2». */}
        <ul className="flex flex-col gap-2">
          {/* Esta línea sirve para recorrer «conversations?» y mostrar un bloque por elemento. */}
          {conversations?.map((conversation) => (
            // Esta línea sirve para abrir el elemento «li».
            <li key={conversation.id}>
              {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
              <Link
                // Esta línea sirve para pasar la propiedad «to» con el valor «`/chat/${conversation.id}`}».
                to={`/chat/${conversation.id}`}
                // Esta línea sirve para aplicar las clases de estilo «flex items-center justify-between rounded-xl ».
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/50"
              >
                {/* Esta línea sirve para abrir el elemento «div». */}
                <div>
                  {/* Esta línea sirve para mostrar el valor «conversation.other_party.name» dentro de un «p». */}
                  <p className="font-medium">{conversation.other_party.name}</p>
                  {/* Esta línea sirve para abrir el elemento «p» con las clases «line-clamp-1 text-sm text-muted-foregrou». */}
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{conversation.last_message?.body ?? "Sin mensajes todavía"}». */}
                    {conversation.last_message?.body ?? "Sin mensajes todavía"}
                  </p>
                </div>
                {/* Esta línea sirve para mostrar el bloque solo si «conversation.unread_count > 0». */}
                {conversation.unread_count > 0 && (
                  // Esta línea sirve para abrir el elemento «span» con las clases «flex h-5 min-w-5 items-center justify-ce».
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                    {/* Esta línea sirve para mostrar el valor «conversation.unread_count». */}
                    {conversation.unread_count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </main>
  )
}
