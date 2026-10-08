// Esta línea sirve para importar «Link, useNavigate, useParams» desde «react-router-dom».
import { Link, useNavigate, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «ConversationWithMessages, Routine, TrainerClient, TrainerClientStatus» desde «@sanken/core».
import type { ConversationWithMessages, Routine, TrainerClient, TrainerClientStatus } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «STATUS_LABELS» con el valor «{».
const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"Pendiente"».
  pending: "Pendiente",
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «"Activo"».
  active: "Activo",
  // Esta línea sirve para declarar la propiedad «paused» con el valor o tipo «"Pausado"».
  paused: "Pausado",
  // Esta línea sirve para declarar la propiedad «ended» con el valor o tipo «"Finalizado"».
  ended: "Finalizado",
}

// Esta línea sirve para declarar la función «TrainerClientDetailPage».
export function TrainerClientDetailPage() {
  // Esta línea sirve para extraer «trainerClientId» de «useParams<{ trainerClientId: string }>()».
  const { trainerClientId } = useParams<{ trainerClientId: string }>()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["trainer", "clients", trainerClientId]».
    queryKey: ["trainer", "clients", trainerClientId],
    // Esta línea sirve para pedir a la API los datos de «/trainer/clients/${trainerClientId}».
    queryFn: () => api.getWithMeta<TrainerClient>(`/trainer/clients/${trainerClientId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(trainerClientId)».
    enabled: Boolean(trainerClientId),
  })

  // Esta línea sirve para obtener «statusMutation» con el hook «useMutation».
  const statusMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(status: TrainerClientStatus) =>».
    mutationFn: (status: TrainerClientStatus) =>
      // Esta línea sirve para enviar a la API el nuevo estado del cliente.
      api.patch<TrainerClient>(`/trainer/clients/${trainerClientId}`, { status }),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => {
      // Esta línea sirve para refrescar los datos del cliente.
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients", trainerClientId] })
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["trainer", "clients"] }».
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
    },
  })

  // Esta línea sirve para obtener «openChat» con el hook «useMutation».
  const openChat = useMutation({
    // Esta línea sirve para enviar a la API la petición «get» hacia «/trainer-clients/${trainerClientId}/conversation».
    mutationFn: () => api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (conversation) => navigate(`/chat/${conversation.conversation_id}`),
  })

  // Esta línea sirve para revisar si «isLoading || !data».
  if (isLoading || !data) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  // Esta línea sirve para extraer «rainerClien» de «data.data».
  const trainerClient = data.data
  // Esta línea sirve para extraer «ctiveRoutin» de «(data.meta?.active_routine as Routine | ».
  const activeRoutine = (data.meta?.active_routine as Routine | null) ?? null
  // Esta línea sirve para extraer «wnsActiveRoutin» de «activeRoutine?.source === "trainer"».
  const ownsActiveRoutine = activeRoutine?.source === "trainer"

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «header». */}
        <header>
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/trainer" className="text-xs text-muted-foreground hover:underline">
            {/* Esta línea sirve para mostrar el contenido dinámico «← Mis clientes». */}
            ← Mis clientes
          </Link>
          {/* Esta línea sirve para mostrar el valor «trainerClient.client.name» dentro de un «h1». */}
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">{trainerClient.client.name}</h1>
          {/* Esta línea sirve para mostrar el valor «trainerClient.client.email» dentro de un «p». */}
          <p className="text-sm text-muted-foreground">{trainerClient.client.email}</p>
        </header>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between». */}
          <div className="flex items-center justify-between">
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el texto «Relación» dentro de un «h2». */}
              <h2 className="font-heading text-sm font-medium text-foreground">Relación</h2>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
              <p className="mt-1 text-xs text-muted-foreground">
                {/* Esta línea sirve para mostrar el estado del cliente. */}
                Estado: <span className="font-medium text-foreground">{STATUS_LABELS[trainerClient.status]}</span>
                {/* Esta línea sirve para mostrar desde cuándo es cliente, si hay fecha. */}
                {trainerClient.started_at && ` · desde ${new Date(trainerClient.started_at).toLocaleDateString()}`}
              </p>
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
            <div className="flex gap-2">
              {/* Esta línea sirve para mostrar el bloque solo si «trainerClient.status === "active"». */}
              {trainerClient.status === "active" && (
                // Esta línea sirve para abrir el componente «Button» con sus propiedades.
                <Button size="sm" disabled={openChat.isPending} onClick={() => openChat.mutate()}>
                  {/* Esta línea sirve para mostrar el texto «Chat». */}
                  Chat
                </Button>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «trainerClient.status === "active"». */}
              {trainerClient.status === "active" && (
                // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                <Button
                  // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                  variant="outline"
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «statusMutation.isPending}».
                  disabled={statusMutation.isPending}
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => statusMutation.mutate("paused")}
                >
                  {/* Esta línea sirve para mostrar el texto «Pausar». */}
                  Pausar
                </Button>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «trainerClient.status === "paused"». */}
              {trainerClient.status === "paused" && (
                // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                <Button
                  // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                  variant="outline"
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «statusMutation.isPending}».
                  disabled={statusMutation.isPending}
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => statusMutation.mutate("active")}
                >
                  {/* Esta línea sirve para mostrar el texto «Reactivar». */}
                  Reactivar
                </Button>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «trainerClient.status !== "ended"». */}
              {trainerClient.status !== "ended" && (
                // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                <Button
                  // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                  variant="destructive"
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «statusMutation.isPending}».
                  disabled={statusMutation.isPending}
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => statusMutation.mutate("ended")}
                >
                  {/* Esta línea sirve para mostrar el texto «Finalizar». */}
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Rutina activa» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Rutina activa</h2>

          {/* Esta línea sirve para mostrar el bloque solo si «!activeRoutine». */}
          {!activeRoutine && (
            // Esta línea sirve para mostrar el texto «Este cliente no tiene una rutina activa.» dentro de un «p».
            <p className="mt-2 text-sm text-muted-foreground">Este cliente no tiene una rutina activa.</p>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «activeRoutine». */}
          {activeRoutine && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-2 text-sm».
            <div className="mt-2 text-sm">
              {/* Esta línea sirve para abrir el elemento «p» con las clases «text-foreground». */}
              <p className="text-foreground">
                {/* Esta línea sirve para mostrar el tipo de división y la frecuencia de la rutina. */}
                {activeRoutine.split_type} · {activeRoutine.frequency_days} días/semana · {activeRoutine.duration_weeks} semanas
              </p>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
              <p className="text-xs text-muted-foreground">
                {/* Esta línea sirve para mostrar el origen de la rutina. */}
                Origen: {activeRoutine.source === "trainer" ? "asignada manualmente" : "motor automático"}
              </p>
            </div>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «trainerClient.status === "active"». */}
          {trainerClient.status === "active" && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4».
            <div className="mt-4">
              {/* Esta línea sirve para elegir entre dos bloques según «ownsActiveRoutine». */}
              {ownsActiveRoutine ? (
                // Esta línea sirve para abrir el componente «Button» con sus propiedades.
                <Button size="sm" onClick={() => navigate(`/trainer/routines/${activeRoutine!.id}/edit`)}>
                  {/* Esta línea sirve para mostrar el texto «Editar rutina». */}
                  Editar rutina
                </Button>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «Button» con sus propiedades.
                <Button size="sm" onClick={() => navigate(`/trainer/clients/${trainerClientId}/routine/new`)}>
                  {/* Esta línea sirve para mostrar el texto «Asignar rutina manual». */}
                  Asignar rutina manual
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
