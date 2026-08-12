import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ChatMessage, MessageSentBroadcast, ReportReason } from "@sanken/core"
import { api } from "@/lib/api"
import { getEcho } from "@/lib/echo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  abuse: "Abuso",
  spam: "Spam",
  inappropriate_content: "Contenido inapropiado",
  other: "Otro",
}

export function ChatThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [body, setBody] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null)
  const [reportReason, setReportReason] = useState<ReportReason>("abuse")
  const [reportDetails, setReportDetails] = useState("")
  const [reportedIds, setReportedIds] = useState<number[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`),
    enabled: Boolean(conversationId),
  })

  useEffect(() => {
    if (data) setMessages(data)
  }, [data])

  useEffect(() => {
    if (!conversationId) return

    const echo = getEcho()
    const channel = echo.private(`conversations.${conversationId}`)
    channel.listen(".message.sent", (payload: MessageSentBroadcast) => {
      setMessages((current) => [...current, { ...payload, is_mine: false }])
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    })

    return () => echo.leave(`conversations.${conversationId}`)
  }, [conversationId, queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body: text }),
    onSuccess: (message) => {
      setMessages((current) => [...current, message])
      setBody("")
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
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

  return (
    <main className="flex min-h-svh flex-col bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Chat</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/chat">Volver</Link>
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl border border-border bg-card p-4">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

          {!isLoading &&
            messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex flex-col gap-0.5", message.is_mine ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                    message.is_mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  )}
                >
                  {message.body}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {message.is_mine ? "Vos" : message.sender_name} ·{" "}
                  {new Date(message.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  {!message.is_mine && !reportedIds.includes(message.id) && (
                    <button
                      onClick={() => setReportingMessageId(message.id)}
                      className="ml-1.5 underline decoration-dotted"
                    >
                      Reportar
                    </button>
                  )}
                  {reportedIds.includes(message.id) && <span className="ml-1.5">Reportado</span>}
                </span>

                {reportingMessageId === message.id && (
                  <div className="mt-1 flex w-full max-w-[80%] flex-col gap-1.5 rounded-lg border border-border bg-card p-2">
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value as ReportReason)}
                      className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
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
                      className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                    />
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => reportMutation.mutate(message.id)}
                        disabled={reportMutation.isPending}
                      >
                        Enviar reporte
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setReportingMessageId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (body.trim()) sendMutation.mutate(body.trim())
          }}
          className="flex gap-2"
        >
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribí un mensaje…"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button type="submit" disabled={!body.trim() || sendMutation.isPending}>
            Enviar
          </Button>
        </form>
      </div>
    </main>
  )
}
