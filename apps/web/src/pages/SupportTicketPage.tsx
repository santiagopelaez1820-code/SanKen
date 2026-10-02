import { useState } from "react"
import { Alert, Form } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { ApiError, type SupportTicket } from "@sanken/core"
import { api } from "@/lib/api"
import { formatSupportDate, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
import { Card } from "@/components/ui/card"
import { SankBadge } from "@/components/ui/SankBadge"
import { SankButton } from "@/components/ui/SankButton"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketConversation } from "@/components/support/TicketConversation"

/** /soporte/:ticketId — conversación de una solicitud propia. */
export function SupportTicketPage() {
  const { ticketId = "" } = useParams()
  const queryClient = useQueryClient()
  const [body, setBody] = useState("")

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: SUPPORT_QUERY_KEYS.ticket(ticketId),
    queryFn: () => api.get<SupportTicket>(`/support/tickets/${ticketId}`),
  })

  const onUpdated = (updated: SupportTicket) => {
    queryClient.setQueryData(SUPPORT_QUERY_KEYS.ticket(ticketId), updated)
    queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets, exact: true })
  }

  const reply = useMutation({
    mutationFn: () => api.post<SupportTicket>(`/support/tickets/${ticketId}/messages`, { body: body.trim() }),
    onSuccess: (updated) => {
      setBody("")
      onUpdated(updated)
    },
  })

  const close = useMutation({
    mutationFn: () => api.post<SupportTicket>(`/support/tickets/${ticketId}/close`),
    onSuccess: onUpdated,
  })

  const error = reply.error ?? close.error
  const errorMessage = error
    ? error instanceof ApiError
      ? (Object.values(error.body.errors ?? {})[0]?.[0] ?? error.body.message)
      : t.createError
    : null

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        <Link to="/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.myRequests}
        </Link>

        {isLoading && <Skeleton className="h-40 w-full" />}
        {isError && <p className="text-sm text-destructive">{t.loadError}</p>}

        {ticket && (
          <>
            <header className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{t.requestNumber(ticket.id)}</span>
                <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                {ticket.source === "weekly_checkin" && <span className="text-xs text-muted-foreground">{t.fromCheckin}</span>}
              </div>
              <h1 className="fs-4 m-0 font-heading font-bold tracking-tight">{ticket.subject}</h1>
              <p className="m-0 text-xs text-muted-foreground">{t.createdOn(formatSupportDate(ticket.created_at, true))}</p>
              <p className="m-0 text-sm text-muted-foreground" role="status">
                {t.statusHints[ticket.status]}
              </p>
            </header>

            <Card variant="flat">
              <TicketConversation messages={ticket.messages ?? []} viewer="user" />
            </Card>

            {errorMessage && (
              <Alert variant="danger" className="py-2 small mb-0" role="alert">
                {errorMessage}
              </Alert>
            )}

            {ticket.status === "closed" ? (
              <p className="text-sm text-muted-foreground">{t.closedNotice}</p>
            ) : (
              <Form
                className="d-flex flex-column gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (body.trim()) reply.mutate()
                }}
              >
                <Form.Label htmlFor="support-reply" className="visually-hidden">
                  {t.reply}
                </Form.Label>
                <Form.Control
                  id="support-reply"
                  as="textarea"
                  rows={3}
                  maxLength={5000}
                  placeholder={t.replyPlaceholder}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <SankButton type="button" variant="ghost" onClick={() => close.mutate()} disabled={close.isPending} loading={close.isPending}>
                    {t.closeRequest}
                  </SankButton>
                  <SankButton type="submit" disabled={!body.trim() || reply.isPending} loading={reply.isPending}>
                    {t.reply}
                  </SankButton>
                </div>
              </Form>
            )}
          </>
        )}
      </div>
    </main>
  )
}
