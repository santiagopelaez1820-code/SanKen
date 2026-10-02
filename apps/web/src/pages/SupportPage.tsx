import { useState } from "react"
import { Alert, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronRight, HeartPulse, LifeBuoy, Plus } from "lucide-react"
import {
  ApiError,
  SUPPORT_TICKET_TYPES,
  type CreateSupportTicketPayload,
  type CurrentCheckinResponse,
  type SupportTicket,
  type SupportTicketType,
} from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { formatSupportDate, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SankBadge } from "@/components/ui/SankBadge"
import { SankButton } from "@/components/ui/SankButton"
import { Skeleton } from "@/components/ui/skeleton"

function NewTicketForm({ onCancel }: { onCancel: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [type, setType] = useState<SupportTicketType>("question")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const mutation = useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) => api.post<SupportTicket>("/support/tickets", payload),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      navigate(`/soporte/${ticket.id}`)
    },
  })

  const error = mutation.error
    ? mutation.error instanceof ApiError
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      : t.createError
    : null

  return (
    <Card variant="flat">
      <Form
        className="d-flex flex-column gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate({ type, subject: subject.trim(), message: message.trim() })
        }}
      >
        <h2 className="fs-5 m-0 font-heading font-semibold">{t.newRequest}</h2>

        <fieldset className="border-0 p-0 m-0">
          <legend className="small fw-medium mb-2">{t.typeLabel}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={t.typeLabel}>
            {SUPPORT_TICKET_TYPES.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={type === value}
                title={t.typeHints[value]}
                onClick={() => setType(value)}
                className={
                  "rounded-xl border px-3 py-2 text-left text-sm transition-colors " +
                  (type === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50")
                }
              >
                {t.types[value]}
              </button>
            ))}
          </div>
          <p className="small text-body-secondary mt-2 mb-0">{t.typeHints[type]}</p>
        </fieldset>

        <Form.Group controlId="support-subject">
          <Form.Label className="small fw-medium">{t.subjectLabel}</Form.Label>
          <Form.Control maxLength={150} placeholder={t.subjectPlaceholder} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="support-message">
          <Form.Label className="small fw-medium">{t.messageLabel}</Form.Label>
          <Form.Control as="textarea" rows={5} maxLength={5000} placeholder={t.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Group>

        {error && (
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {error}
          </Alert>
        )}

        <div className="d-flex justify-content-end gap-2">
          <SankButton type="button" variant="ghost" onClick={onCancel} disabled={mutation.isPending}>
            {t.cancel}
          </SankButton>
          <SankButton
            type="submit"
            disabled={subject.trim().length < 3 || message.trim().length < 3 || mutation.isPending}
            loading={mutation.isPending}
          >
            {mutation.isPending ? t.sending : t.send}
          </SankButton>
        </div>
      </Form>
    </Card>
  )
}

/** /soporte — solicitudes del usuario, nueva solicitud y acceso al check-in semanal. */
export function SupportPage() {
  const userId = useAuthStore((s) => s.user?.id)
  const [creating, setCreating] = useState(false)

  const tickets = useQuery({
    queryKey: SUPPORT_QUERY_KEYS.tickets,
    queryFn: () => api.get<SupportTicket[]>("/support/tickets"),
  })

  const checkin = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    enabled: !!userId,
    staleTime: 30 * 60_000,
  })
  const checkinOpen = checkin.data?.checkin && checkin.data.checkin.status !== "answered"

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-semibold tracking-widest text-primary uppercase">
              <LifeBuoy className="me-1 inline size-3.5" aria-hidden="true" />
              {t.sectionTitle}
            </p>
            <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{t.myRequests}</h1>
            <p className="mt-1 mb-0 text-sm text-muted-foreground">{t.sectionSubtitle}</p>
          </div>
          {!creating && (
            <Button onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" />
              {t.newRequest}
            </Button>
          )}
        </div>

        {checkinOpen && (
          <Link to="/soporte/check-in" className="no-underline">
            <Card variant="elevated" className="flex items-center gap-3">
              <HeartPulse className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="m-0 font-medium text-foreground">{t.checkinTitle}</p>
                <p className="m-0 text-sm text-muted-foreground">{t.checkinCta}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Card>
          </Link>
        )}

        {creating && <NewTicketForm onCancel={() => setCreating(false)} />}

        <section aria-label={t.myRequests} className="flex flex-col gap-3">
          {tickets.isLoading && <Skeleton className="h-20 w-full" />}
          {tickets.isError && <p className="text-sm text-destructive">{t.loadError}</p>}
          {tickets.data?.length === 0 && !creating && <p className="text-sm text-muted-foreground">{t.emptyRequests}</p>}
          {tickets.data?.map((ticket) => (
            <Link key={ticket.id} to={`/soporte/${ticket.id}`} className="no-underline">
              <Card className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                    <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                    <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    {ticket.status === "answered" && ticket.last_message_by_staff && (
                      <span className="text-xs font-semibold text-primary">{t.newReply}</span>
                    )}
                  </div>
                  <p className="m-0 mt-1 truncate font-medium text-foreground">{ticket.subject}</p>
                  <p className="m-0 text-xs text-muted-foreground">{t.lastActivity(formatSupportDate(ticket.last_message_at))}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
