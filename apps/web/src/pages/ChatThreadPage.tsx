import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Flag, Loader2, SendHorizontal } from "lucide-react"
import type { ChatMessage, ConversationSummary, MessageSentBroadcast, ReportReason } from "@sanken/core"
import { api } from "@/lib/api"
import { getEcho } from "@/lib/echo"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  abuse: "Abuso",
  spam: "Spam",
  inappropriate_content: "Contenido inapropiado",
  other: "Otro",
}

/**
 * Agrega un mensaje sin duplicarlo. El backend transmite `message.sent` a
 * todo el canal (no usa toOthers(): el cliente no manda X-Socket-ID), así
 * que quien envía recibe su propio mensaje por websocket además de la
 * respuesta del POST — antes aparecía dos veces y como si fuera del otro.
 */
function upsertMessage(current: ChatMessage[], message: ChatMessage): ChatMessage[] {
  return current.some((m) => m.id === message.id)
    ? current.map((m) => (m.id === message.id ? message : m))
    : [...current, message]
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}

export function ChatThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const queryClient = useQueryClient()
  const myId = useAuthStore((s) => s.user?.id)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [body, setBody] = useState("")
  const [sendError, setSendError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null)
  const [reportReason, setReportReason] = useState<ReportReason>("abuse")
  const [reportDetails, setReportDetails] = useState("")
  const [reportedIds, setReportedIds] = useState<number[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`),
    enabled: Boolean(conversationId),
  })

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get<ConversationSummary[]>("/conversations"),
  })

  const otherPartyName =
    conversations?.find((c) => String(c.id) === conversationId)?.other_party.name ??
    messages.find((m) => !m.is_mine)?.sender_name ??
    "Chat"

  useEffect(() => {
    if (data) setMessages(data)
  }, [data])

  useEffect(() => {
    if (!conversationId) return

    const echo = getEcho()
    const channel = echo.private(`conversations.${conversationId}`)
    channel.listen(".message.sent", (payload: MessageSentBroadcast) => {
      setMessages((current) => upsertMessage(current, { ...payload, is_mine: payload.sender_id === myId }))
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    })

    return () => echo.leave(`conversations.${conversationId}`)
  }, [conversationId, queryClient, myId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  // El textarea crece con el texto hasta ~5 líneas.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`
  }, [body])

  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body: text }),
    onMutate: () => {
      setSendError(null)
      setBody("")
    },
    onSuccess: (message) => {
      setMessages((current) => upsertMessage(current, message))
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
    onError: (_err, text) => {
      // El texto vuelve al campo: antes se perdía si el envío fallaba.
      setBody(text)
      setSendError("No se pudo enviar el mensaje. Revisá tu conexión y probá de nuevo.")
    },
  })

  const reportMutation = useMutation({
    mutationFn: (messageId: number) =>
      api.post("/reports", {
        reportable_type: "chat_message",
        reportable_id: messageId,
        reason: reportReason,
        details: reportDetails.trim() || undefined,
      }),
    onSuccess: (_data, messageId) => {
      setReportedIds((current) => [...current, messageId])
      setReportingMessageId(null)
      setReportDetails("")
    },
  })

  const canSend = body.trim().length > 0 && !sendMutation.isPending
  const send = () => {
    if (canSend) sendMutation.mutate(body.trim())
  }

  return (
    // Alto fijo al viewport: el campo de escritura queda siempre visible
    // abajo y solo scrollea la lista de mensajes.
    <main className="flex h-[calc(100dvh-8rem)] flex-col px-4 py-4 sm:px-6 lg:h-[calc(100dvh-5rem)]">
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <header className="flex items-center gap-3 border-b border-border px-3 py-2.5">
          <Link
            to="/chat"
            aria-label="Volver al chat"
            className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-sm font-bold">
            {otherPartyName.trim()[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 className="min-w-0 flex-1 truncate font-heading text-base font-semibold">{otherPartyName}</h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {isLoading && (
            <>
              <Skeleton className="h-11 w-3/5 rounded-2xl" />
              <Skeleton className="ml-auto h-11 w-2/5 rounded-2xl" />
            </>
          )}

          {!isLoading && messages.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">Todavía no hay mensajes. ¡Escribí el primero!</p>
          )}

          {!isLoading &&
            messages.map((message, index) => {
              const previous = messages[index - 1]
              const isFirstOfGroup = !previous || previous.is_mine !== message.is_mine
              const isReported = reportedIds.includes(message.id)
              return (
                <div
                  key={message.id}
                  className={cn(
                    "group flex flex-col gap-0.5",
                    message.is_mine ? "items-end" : "items-start",
                    isFirstOfGroup && "mt-2"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 pt-2 pb-1 text-[15px] leading-snug",
                      message.is_mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted text-foreground"
                    )}
                  >
                    {message.body}
                    <span
                      className={cn(
                        "mt-0.5 block text-right text-[10px]",
                        message.is_mine ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.created_at)}
                    </span>
                  </div>

                  {!message.is_mine && !isReported && reportingMessageId !== message.id && (
                    <button
                      type="button"
                      onClick={() => setReportingMessageId(message.id)}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Flag className="size-3" /> Reportar
                    </button>
                  )}
                  {isReported && <span className="text-[11px] text-muted-foreground">Reportado</span>}

                  {reportingMessageId === message.id && (
                    <div className="mt-1 flex w-full max-w-[82%] flex-col gap-2 rounded-xl border border-border bg-background p-3">
                      <p className="text-sm font-medium">Reportar mensaje</p>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value as ReportReason)}
                        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      >
                        {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="Detalle (opcional)"
                        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setReportingMessageId(null)}>
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => reportMutation.mutate(message.id)}
                          disabled={reportMutation.isPending}
                        >
                          Enviar reporte
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          <div ref={bottomRef} />
        </div>

        {sendError && <p className="px-4 pb-1 text-xs text-destructive">{sendError}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-end gap-2 border-t border-border p-3"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              if (sendError) setSendError(null)
            }}
            onKeyDown={(e) => {
              // Enter envía, Shift+Enter hace salto de línea.
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                send()
              }
            }}
            maxLength={2000}
            placeholder="Escribí un mensaje…"
            aria-label="Mensaje"
            className="min-h-11 flex-1 resize-none rounded-3xl border border-input bg-background px-4 py-2.5 text-[15px] leading-snug outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Enviar mensaje"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
              canSend ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
            )}
          >
            {sendMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : <SendHorizontal className="size-5" />}
          </button>
        </form>
      </div>
    </main>
  )
}
