// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from "react"
// Esta línea sirve para importar «Link, useParams» desde «react-router-dom».
import { Link, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «ChevronLeft, Flag, Loader2, SendHorizontal» desde «lucide-react».
import { ChevronLeft, Flag, Loader2, SendHorizontal } from "lucide-react"
// Esta línea sirve para importar los tipos «ChatMessage, ConversationSummary, MessageSentBroadcast, ReportReason» desde «@sanken/core».
import type { ChatMessage, ConversationSummary, MessageSentBroadcast, ReportReason } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from "@/lib/echo"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «REPORT_REASON_LABELS» con el valor «{».
const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  // Esta línea sirve para declarar la propiedad «abuse» con el valor o tipo «"Abuso"».
  abuse: "Abuso",
  // Esta línea sirve para declarar la propiedad «spam» con el valor o tipo «"Spam"».
  spam: "Spam",
  // Esta línea sirve para declarar la propiedad «inappropriate_content» con el valor o tipo «"Contenido inapropiado"».
  inappropriate_content: "Contenido inapropiado",
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «"Otro"».
  other: "Otro",
}

/**
 * Agrega un mensaje sin duplicarlo. El backend transmite `message.sent` a
 * todo el canal (no usa toOthers(): el cliente no manda X-Socket-ID), así
 * que quien envía recibe su propio mensaje por websocket además de la
 * respuesta del POST — antes aparecía dos veces y como si fuera del otro.
 */
// Esta línea sirve para declarar la función «upsertMessage».
function upsertMessage(current: ChatMessage[], message: ChatMessage): ChatMessage[] {
  // Esta línea sirve para devolver «current.some((m) => m.id === message.id)».
  return current.some((m) => m.id === message.id)
    // Esta línea sirve para reemplazar el mensaje si ya existe.
    ? current.map((m) => (m.id === message.id ? message : m))
    // Esta línea sirve para agregar el mensaje al final si es nuevo.
    : [...current, message]
}

// Esta línea sirve para declarar la función «formatTime».
function formatTime(iso: string) {
  // Esta línea sirve para devolver la hora del mensaje con formato de dos dígitos.
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}

// Esta línea sirve para declarar la función «ChatThreadPage».
export function ChatThreadPage() {
  // Esta línea sirve para extraer «conversationId» de «useParams<{ conversationId: string }>()».
  const { conversationId } = useParams<{ conversationId: string }>()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «myId» con el hook «useAuthStore».
  const myId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para crear el estado «messages» y su función «setMessages».
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState("")
  // Esta línea sirve para crear el estado «sendError» y su función «setSendError».
  const [sendError, setSendError] = useState<string | null>(null)
  // Esta línea sirve para crear la referencia «bottomRef».
  const bottomRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para crear la referencia «inputRef».
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // Esta línea sirve para crear el estado «reportingMessageId» y su función «setReportingMessageId».
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «reportReason» y su función «setReportReason».
  const [reportReason, setReportReason] = useState<ReportReason>("abuse")
  // Esta línea sirve para crear el estado «reportDetails» y su función «setReportDetails».
  const [reportDetails, setReportDetails] = useState("")
  // Esta línea sirve para crear el estado «reportedIds» y su función «setReportedIds».
  const [reportedIds, setReportedIds] = useState<number[]>([])

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["conversations", conversationId, "messages"]».
    queryKey: ["conversations", conversationId, "messages"],
    // Esta línea sirve para pedir a la API los datos de «/conversations/${conversationId}/messages».
    queryFn: () => api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(conversationId)».
    enabled: Boolean(conversationId),
  })

  // Esta línea sirve para obtener «data: conversations» con el hook «useQuery».
  const { data: conversations } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["conversations"]».
    queryKey: ["conversations"],
    // Esta línea sirve para pedir a la API los datos de «/conversations».
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  // Esta línea sirve para calcular el nombre de la otra persona de la conversación.
  const otherPartyName =
    // Esta línea sirve para buscarlo primero en la lista de conversaciones.
    conversations?.find((c) => String(c.id) === conversationId)?.other_party.name ??
    // Esta línea sirve para buscarlo después en el remitente de los mensajes recibidos.
    messages.find((m) => !m.is_mine)?.sender_name ??
    // Esta línea sirve para incluir el texto o las clases «Chat…».
    "Chat"

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para guardar los mensajes cargados en el estado.
    if (data) setMessages(data)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian los datos.
  }, [data])

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!conversationId».
    if (!conversationId) return

    // Esta línea sirve para extraer «ch» de «getEcho()».
    const echo = getEcho()
    // Esta línea sirve para extraer «hanne» de «echo.private(`conversations.${conversati».
    const channel = echo.private(`conversations.${conversationId}`)
    // Esta línea sirve para escuchar los mensajes nuevos del canal.
    channel.listen(".message.sent", (payload: MessageSentBroadcast) => {
      // Esta línea sirve para agregar o actualizar el mensaje recibido marcando si es mío.
      setMessages((current) => upsertMessage(current, { ...payload, is_mine: payload.sender_id === myId }))
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["conversations"] }».
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    })

    // Esta línea sirve para devolver la función que abandona el canal.
    return () => echo.leave(`conversations.${conversationId}`)
  // Esta línea sirve para volver a ejecutar el efecto si cambia la conversación, la caché o el usuario.
  }, [conversationId, queryClient, myId])

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «bottomRef.current?.scrollIntoView» con «{ behavior: "smooth", block: "end" }».
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian los mensajes.
  }, [messages])

  // El textarea crece con el texto hasta ~5 líneas.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para extraer «» de «inputRef.current».
    const el = inputRef.current
    // Esta línea sirve para salir de la función si «!el».
    if (!el) return
    // Esta línea sirve para asignar «"auto"» a «el.style.height».
    el.style.height = "auto"
    // Esta línea sirve para asignar «`${Math.min(el.scrollHeight, 132)}px`» a «el.style.height».
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el texto.
  }, [body])

  // Esta línea sirve para obtener «sendMutation» con el hook «useMutation».
  const sendMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(text: string) =>».
    mutationFn: (text: string) =>
      // Esta línea sirve para enviar el mensaje a la API.
      api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body: text }),
    // Esta línea sirve para declarar la propiedad «onMutate» con el valor o tipo «() => {».
    onMutate: () => {
      // Esta línea sirve para llamar a «setSendError» con «null».
      setSendError(null)
      // Esta línea sirve para llamar a «setBody» con «""».
      setBody("")
    },
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(message) => {».
    onSuccess: (message) => {
      // Esta línea sirve para agregar el mensaje enviado a la lista.
      setMessages((current) => upsertMessage(current, message))
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["conversations"] }».
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
    // Esta línea sirve para declarar la propiedad «onError» con el valor o tipo «(_err, text) => {».
    onError: (_err, text) => {
      // El texto vuelve al campo: antes se perdía si el envío fallaba.
      // Esta línea sirve para llamar a «setBody» con «text».
      setBody(text)
      // Esta línea sirve para mostrar el aviso de fallo al enviar.
      setSendError("No se pudo enviar el mensaje. Revisá tu conexión y probá de nuevo.")
    },
  })

  // Esta línea sirve para obtener «reportMutation» con el hook «useMutation».
  const reportMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(messageId: number) =>».
    mutationFn: (messageId: number) =>
      // Esta línea sirve para enviar el reporte del mensaje a la API.
      api.post("/reports", {
        // Esta línea sirve para declarar la propiedad «reportable_type» con el valor o tipo «"chat_message"».
        reportable_type: "chat_message",
        // Esta línea sirve para declarar la propiedad «reportable_id» con el valor o tipo «messageId».
        reportable_id: messageId,
        // Esta línea sirve para declarar la propiedad «reason» con el valor o tipo «reportReason».
        reason: reportReason,
        // Esta línea sirve para declarar la propiedad «details» con el valor o tipo «reportDetails.trim() || undefined».
        details: reportDetails.trim() || undefined,
      }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(_data, messageId) => {».
    onSuccess: (_data, messageId) => {
      // Esta línea sirve para llamar a «setReportedIds» con «(current) => [...current, messageId]».
      setReportedIds((current) => [...current, messageId])
      // Esta línea sirve para llamar a «setReportingMessageId» con «null».
      setReportingMessageId(null)
      // Esta línea sirve para llamar a «setReportDetails» con «""».
      setReportDetails("")
    },
  })

  // Esta línea sirve para extraer «anSen» de «body.trim().length > 0 && !sendMutation.».
  const canSend = body.trim().length > 0 && !sendMutation.isPending
  // Esta línea sirve para extraer «en» de «() => {».
  const send = () => {
    // Esta línea sirve para enviar el mensaje si se puede.
    if (canSend) sendMutation.mutate(body.trim())
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Alto fijo al viewport: el campo de escritura queda siempre visible
    // abajo y solo scrollea la lista de mensajes.
    // Esta línea sirve para abrir el elemento «main» con las clases «flex h-[calc(100dvh-8rem)] flex-col px-4».
    <main className="flex h-[calc(100dvh-8rem)] flex-col px-4 py-4 sm:px-6 lg:h-[calc(100dvh-5rem)]">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex min-h-0 w-full max-w-lg fle». */}
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
        {/* Esta línea sirve para abrir el elemento «header» con las clases «flex items-center gap-3 border-b border-». */}
        <header className="flex items-center gap-3 border-b border-border px-3 py-2.5">
          {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
          <Link
            // Esta línea sirve para definir el atributo «to» con el valor «/chat».
            to="/chat"
            // Esta línea sirve para definir el atributo «aria-label» con el valor «Volver al chat».
            aria-label="Volver al chat"
            // Esta línea sirve para aplicar las clases de estilo «flex size-9 items-center justify-center round».
            className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
          >
            {/* Esta línea sirve para abrir el componente «ChevronLeft». */}
            <ChevronLeft className="size-5" />
          </Link>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex size-9 shrink-0 items-center justif». */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-sm font-bold">
            {/* Esta línea sirve para mostrar el contenido dinámico «{otherPartyName.trim()[0]?.toUpperCase() ?? "?"}». */}
            {otherPartyName.trim()[0]?.toUpperCase() ?? "?"}
          </div>
          {/* Esta línea sirve para mostrar el valor «otherPartyName» dentro de un «h1». */}
          <h1 className="min-w-0 flex-1 truncate font-heading text-base font-semibold">{otherPartyName}</h1>
        </header>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex min-h-0 flex-1 flex-col gap-1 overf». */}
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {/* Esta línea sirve para mostrar el bloque solo si «isLoading». */}
          {isLoading && (
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «Skeleton». */}
              <Skeleton className="h-11 w-3/5 rounded-2xl" />
              {/* Esta línea sirve para abrir el componente «Skeleton». */}
              <Skeleton className="ml-auto h-11 w-2/5 rounded-2xl" />
            </>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && messages.length === 0». */}
          {!isLoading && messages.length === 0 && (
            // Esta línea sirve para mostrar el texto «Todavía no hay mensajes. ¡Escribí el primero!» dentro de un «p».
            <p className="mt-6 text-center text-sm text-muted-foreground">Todavía no hay mensajes. ¡Escribí el primero!</p>
          )}

          {/* Esta línea sirve para mostrar el contenido dinámico «{!isLoading &&». */}
          {!isLoading &&
            // Esta línea sirve para recorrer los mensajes para dibujarlos.
            messages.map((message, index) => {
              // Esta línea sirve para extraer «reviou» de «messages[index - 1]».
              const previous = messages[index - 1]
              // Esta línea sirve para extraer «sFirstOfGrou» de «!previous || previous.is_mine !== messag».
              const isFirstOfGroup = !previous || previous.is_mine !== message.is_mine
              // Esta línea sirve para extraer «sReporte» de «reportedIds.includes(message.id)».
              const isReported = reportedIds.includes(message.id)
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
                <div
                  // Esta línea sirve para identificar el elemento de la lista con «message.id}».
                  key={message.id}
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                  className={cn(
                    // Esta línea sirve para incluir el texto o las clases «group flex flex-col gap-0.5…».
                    "group flex flex-col gap-0.5",
                    // Esta línea sirve para alinear el mensaje según sea mío o de la otra persona.
                    message.is_mine ? "items-end" : "items-start",
                    // Esta línea sirve para agregar margen si es el primero del grupo.
                    isFirstOfGroup && "mt-2"
                  )}
                >
                  {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
                  <div
                    // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                    className={cn(
                      // Esta línea sirve para incluir el texto o las clases «max-w-[82%] whitespace-pre-wrap break-words r…».
                      "max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 pt-2 pb-1 text-[15px] leading-snug",
                      // Esta línea sirve para elegir el color de la burbuja según el autor.
                      message.is_mine
                        // Esta línea sirve para usar el color primario si es mío.
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        // Esta línea sirve para usar el color neutro si es de la otra persona.
                        : "rounded-bl-md bg-muted text-foreground"
                    )}
                  >
                    {/* Esta línea sirve para mostrar el valor «message.body». */}
                    {message.body}
                    {/* Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas. */}
                    <span
                      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                      className={cn(
                        // Esta línea sirve para incluir el texto o las clases «mt-0.5 block text-right text-[10px]…».
                        "mt-0.5 block text-right text-[10px]",
                        // Esta línea sirve para elegir el color de la hora según el autor.
                        message.is_mine ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {/* Esta línea sirve para mostrar el contenido dinámico «{formatTime(message.created_at)}». */}
                      {formatTime(message.created_at)}
                    </span>
                  </div>

                  {/* Esta línea sirve para mostrar el botón de reportar solo en mensajes ajenos y no reportados. */}
                  {!message.is_mine && !isReported && reportingMessageId !== message.id && (
                    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
                    <button
                      // Esta línea sirve para definir el atributo «type» con el valor «button».
                      type="button"
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => setReportingMessageId(message.id)}
                      // Esta línea sirve para aplicar las clases de estilo «flex items-center gap-1 text-[11px] text-mute».
                      className="flex items-center gap-1 text-[11px] text-muted-foreground opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      {/* Esta línea sirve para mostrar el ícono y el texto de reportar. */}
                      <Flag className="size-3" /> Reportar
                    </button>
                  )}
                  {/* Esta línea sirve para mostrar el elemento solo si «isReported». */}
                  {isReported && <span className="text-[11px] text-muted-foreground">Reportado</span>}

                  {/* Esta línea sirve para mostrar el bloque solo si «reportingMessageId === message.id». */}
                  {reportingMessageId === message.id && (
                    // Esta línea sirve para abrir el elemento «div» con las clases «mt-1 flex w-full max-w-[82%] flex-col ga».
                    <div className="mt-1 flex w-full max-w-[82%] flex-col gap-2 rounded-xl border border-border bg-background p-3">
                      {/* Esta línea sirve para mostrar el texto «Reportar mensaje» dentro de un «p». */}
                      <p className="text-sm font-medium">Reportar mensaje</p>
                      {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                      <select
                        // Esta línea sirve para pasar la propiedad «value» con el valor «reportReason}».
                        value={reportReason}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => setReportReason(e.target.value as ReportReason)}
                        // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
                        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      >
                        {/* Esta línea sirve para recorrer «Object.entries(REPORT_REASON_LABELS)» y mostrar un bloque por elemento. */}
                        {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                          // Esta línea sirve para abrir el elemento «option».
                          <option key={value} value={value}>
                            {/* Esta línea sirve para mostrar el valor «label». */}
                            {label}
                          </option>
                        ))}
                      </select>
                      {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
                      <textarea
                        // Esta línea sirve para pasar la propiedad «value» con el valor «reportDetails}».
                        value={reportDetails}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => setReportDetails(e.target.value)}
                        // Esta línea sirve para definir el atributo «placeholder» con el valor «Detalle (opcional)».
                        placeholder="Detalle (opcional)"
                        // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
                        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      />
                      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex justify-end gap-2». */}
                      <div className="flex justify-end gap-2">
                        {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                        <Button size="sm" variant="outline" onClick={() => setReportingMessageId(null)}>
                          {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                          Cancelar
                        </Button>
                        {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                        <Button
                          // Esta línea sirve para definir el atributo «size» con el valor «sm».
                          size="sm"
                          // Esta línea sirve para asignar el manejador del evento «onClick».
                          onClick={() => reportMutation.mutate(message.id)}
                          // Esta línea sirve para pasar la propiedad «disabled» con el valor «reportMutation.isPending}».
                          disabled={reportMutation.isPending}
                        >
                          {/* Esta línea sirve para mostrar el texto «Enviar reporte». */}
                          Enviar reporte
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div ref={bottomRef} />
        </div>

        {/* Esta línea sirve para mostrar el elemento solo si «sendError». */}
        {sendError && <p className="px-4 pb-1 text-xs text-destructive">{sendError}</p>}

        {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
        <form
          // Esta línea sirve para asignar el manejador del evento «onSubmit».
          onSubmit={(e) => {
            // Esta línea sirve para llamar a «e.preventDefault».
            e.preventDefault()
            // Esta línea sirve para llamar a «send».
            send()
          }}
          // Esta línea sirve para aplicar las clases de estilo «flex items-end gap-2 border-t border-border p».
          className="flex items-end gap-2 border-t border-border p-3"
        >
          {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
          <textarea
            // Esta línea sirve para conectar la referencia «inputRef}» con el elemento.
            ref={inputRef}
            // Esta línea sirve para pasar la propiedad «rows» con el valor «1}».
            rows={1}
            // Esta línea sirve para pasar la propiedad «value» con el valor «body}».
            value={body}
            // Esta línea sirve para asignar el manejador del evento «onChange».
            onChange={(e) => {
              // Esta línea sirve para llamar a «setBody» con «e.target.value».
              setBody(e.target.value)
              // Esta línea sirve para limpiar el error de envío al escribir.
              if (sendError) setSendError(null)
            }}
            // Esta línea sirve para asignar el manejador del evento «onKeyDown».
            onKeyDown={(e) => {
              // Enter envía, Shift+Enter hace salto de línea.
              // Esta línea sirve para enviar con Enter si no se pulsa Shift ni se está componiendo texto.
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                // Esta línea sirve para llamar a «e.preventDefault».
                e.preventDefault()
                // Esta línea sirve para llamar a «send».
                send()
              }
            }}
            // Esta línea sirve para pasar la propiedad «maxLength» con el valor «2000}».
            maxLength={2000}
            // Esta línea sirve para definir el atributo «placeholder» con el valor «Escribí un mensaje…».
            placeholder="Escribí un mensaje…"
            // Esta línea sirve para definir el atributo «aria-label» con el valor «Mensaje».
            aria-label="Mensaje"
            // Esta línea sirve para aplicar las clases de estilo «min-h-11 flex-1 resize-none rounded-3xl borde».
            className="min-h-11 flex-1 resize-none rounded-3xl border border-input bg-background px-4 py-2.5 text-[15px] leading-snug outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «submit».
            type="submit"
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canSend}».
            disabled={!canSend}
            // Esta línea sirve para definir el atributo «aria-label» con el valor «Enviar mensaje».
            aria-label="Enviar mensaje"
            // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
            className={cn(
              // Esta línea sirve para incluir el texto o las clases «flex size-11 shrink-0 items-center justify-ce…».
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
              // Esta línea sirve para elegir el color del botón según se pueda enviar.
              canSend ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
            )}
          >
            {/* Esta línea sirve para mostrar un indicador de carga o el ícono de enviar. */}
            {sendMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : <SendHorizontal className="size-5" />}
          </button>
        </form>
      </div>
    </main>
  )
}
