// Esta línea sirve para importar «useRef» desde «react».
import { useRef } from "react"
// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery» desde «@tanstack/react-query».
import { useMutation, useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «ConversationWithMessages, MyTrainer» desde «@sanken/core».
import type { ConversationWithMessages, MyTrainer } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"

// Esta línea sirve para declarar la función «MyTrainerPage».
export function MyTrainerPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)

  // Esta línea sirve para obtener «data: trainers, isLoading» con el hook «useQuery».
  const { data: trainers, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["me", "trainers"]».
    queryKey: ["me", "trainers"],
    // Esta línea sirve para pedir a la API los datos de «/me/trainers».
    queryFn: () => api.get<MyTrainer[]>("/me/trainers"),
  })

  // Esta línea sirve para obtener «openChat» con el hook «useMutation».
  const openChat = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(trainerClientId: number) =>».
    mutationFn: (trainerClientId: number) =>
      // Esta línea sirve para pedir la conversación con el entrenador a la API.
      api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`),
    // Esta línea sirve para navegar al chat de la conversación al terminar.
    onSuccess: (conversation) => navigate(`/chat/${conversation.conversation_id}`),
  })

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «mi-entrenador…».
    "mi-entrenador",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «titleRef».
        target: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tu entrenador asignado"».
        title: "Tu entrenador asignado",
        // Esta línea sirve para definir la propiedad «description» con «Acá ves quién es tu entrenador y podés e…».
        description: "Acá ves quién es tu entrenador y podés escribirle directamente cuando quieras.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"¿Dudas sobre tu rutina o nutrición?"».
        title: "¿Dudas sobre tu rutina o nutrición?",
        // Esta línea sirve para definir la propiedad «description» con «Escribile por acá — te va a responder di…».
        description: "Escribile por acá — te va a responder directo en el chat.",
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
          {/* Esta línea sirve para mostrar el texto «Mi entrenador». */}
          Mi entrenador
        </h1>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && trainers?.length === 0». */}
        {!isLoading && trainers?.length === 0 && (
          // Esta línea sirve para mostrar el texto «Todavía no tenés un entrenador asignado.» dentro de un «p».
          <p className="text-sm text-muted-foreground">Todavía no tenés un entrenador asignado.</p>
        )}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-3». */}
        <div className="flex flex-col gap-3">
          {/* Esta línea sirve para recorrer «trainers?» y mostrar un bloque por elemento. */}
          {trainers?.map((relationship) => (
            // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
            <div
              // Esta línea sirve para identificar el elemento de la lista con «relationship.trainer_client_id}».
              key={relationship.trainer_client_id}
              // Esta línea sirve para aplicar las clases de estilo «flex items-center justify-between rounded-xl ».
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para abrir el elemento «p» con las clases «font-medium». */}
                <p className="font-medium">
                  {/* Esta línea sirve para mostrar el valor «relationship.trainer.name». */}
                  {relationship.trainer.name}
                  {/* Esta línea sirve para mostrar el bloque solo si «relationship.trainer.trainer_verified_at». */}
                  {relationship.trainer.trainer_verified_at && (
                    // Esta línea sirve para mostrar el texto «✓ Verificado» dentro de un «span».
                    <span className="ml-1.5 text-xs font-normal text-primary">✓ Verificado</span>
                  )}
                </p>
                {/* Esta línea sirve para mostrar el valor «relationship.trainer.email» dentro de un «p». */}
                <p className="text-sm text-muted-foreground">{relationship.trainer.email}</p>
              </div>
              {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
              <Button
                // Esta línea sirve para definir el atributo «size» con el valor «sm».
                size="sm"
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «openChat.isPending}».
                disabled={openChat.isPending}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => openChat.mutate(relationship.trainer_client_id)}
              >
                {/* Esta línea sirve para mostrar el texto «Chatear». */}
                Chatear
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </main>
  )
}
