import { useState } from "react"
import { Alert, Form } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import {
  ApiError,
  CHECKIN_MOODS,
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
  type AdminSupportTicket,
  type CheckinMood,
  type CheckinTopic,
} from "@sanken/core"
import { api } from "@/lib/api"
import { formatSupportDate, PRIORITY_VARIANT, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings } from "@/lib/support"
import { Card } from "@/components/ui/card"
import { SankBadge } from "@/components/ui/SankBadge"
import { SankButton } from "@/components/ui/SankButton"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketConversation } from "@/components/support/TicketConversation"

const t = supportStrings
const s = supportStrings.admin

function contextValue(key: string, value: unknown): string {
  if (key === "mood" && CHECKIN_MOODS.includes(value as CheckinMood)) {
    const mood = t.moods[value as CheckinMood]
    return `${mood.emoji} ${mood.label}`
  }
  if (key === "topic" && typeof value === "string" && value in t.topics) return t.topics[value as CheckinTopic]
  return value === null || value === undefined ? "—" : String(value)
}

/** /admin/soporte/:ticketId — leer, responder y gestionar una solicitud. */
export function AdminSupportTicketPage() {
  const { ticketId = "" } = useParams()
  const queryClient = useQueryClient()
  const [body, setBody] = useState("")
  const key = [...SUPPORT_QUERY_KEYS.admin, "ticket", ticketId]

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: () => api.get<AdminSupportTicket>(`/admin/support/tickets/${ticketId}`),
  })

  const staff = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "staff"],
    queryFn: () => api.get<{ id: number; name: string }[]>("/admin/support/staff"),
    staleTime: 10 * 60_000,
  })

  const onUpdated = (updated: AdminSupportTicket) => {
    queryClient.setQueryData(key, updated)
    queryClient.invalidateQueries({ queryKey: [...SUPPORT_QUERY_KEYS.admin, "tickets"] })
    queryClient.invalidateQueries({ queryKey: [...SUPPORT_QUERY_KEYS.admin, "stats"] })
  }

  const reply = useMutation({
    mutationFn: () => api.post<AdminSupportTicket>(`/admin/support/tickets/${ticketId}/messages`, { body: body.trim() }),
    onSuccess: (updated) => {
      setBody("")
      onUpdated(updated)
    },
  })

  const update = useMutation({
    mutationFn: (changes: Record<string, string | number | null>) => api.patch<AdminSupportTicket>(`/admin/support/tickets/${ticketId}`, changes),
    onSuccess: onUpdated,
  })

  const error = reply.error ?? update.error
  const errorMessage = error
    ? error instanceof ApiError
      ? (Object.values(error.body.errors ?? {})[0]?.[0] ?? error.body.message)
      : t.createError
    : null

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <Link to="/admin/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {s.title}
        </Link>

        {isLoading && <Skeleton className="h-40 w-full" />}
        {isError && <p className="text-sm text-destructive">{t.loadError}</p>}

        {ticket && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <header className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t.requestNumber(ticket.id)}</span>
                  <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                  <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                  <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                </div>
                <h1 className="fs-4 m-0 font-heading font-bold tracking-tight">{ticket.subject}</h1>
                <p className="m-0 text-xs text-muted-foreground">{t.createdOn(formatSupportDate(ticket.created_at, true))}</p>
              </header>

              <Card variant="flat">
                <TicketConversation messages={ticket.messages ?? []} viewer="staff" />
              </Card>

              {errorMessage && (
                <Alert variant="danger" className="py-2 small mb-0" role="alert">
                  {errorMessage}
                </Alert>
              )}

              <Form
                className="d-flex flex-column gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (body.trim()) reply.mutate()
                }}
              >
                <Form.Label htmlFor="staff-reply" className="small fw-medium">
                  {s.replyAsStaff}
                </Form.Label>
                <Form.Control id="staff-reply" as="textarea" rows={4} maxLength={5000} value={body} onChange={(e) => setBody(e.target.value)} />
                <SankButton type="submit" className="align-self-end" disabled={!body.trim() || reply.isPending} loading={reply.isPending}>
                  {t.reply}
                </SankButton>
              </Form>
            </div>

            <aside className="flex flex-col gap-4" aria-label={s.title}>
              <Card variant="flat" className="flex flex-col gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold text-muted-foreground">{s.user}</p>
                  <p className="m-0 font-medium">{ticket.user?.name}</p>
                  <p className="m-0 text-xs text-muted-foreground">{ticket.user?.email}</p>
                </div>

                <Form.Group controlId="ticket-status">
                  <Form.Label className="small fw-medium">{s.status}</Form.Label>
                  <Form.Select value={ticket.status} disabled={update.isPending} onChange={(e) => update.mutate({ status: e.target.value })}>
                    {SUPPORT_TICKET_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t.statuses[status]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="ticket-priority">
                  <Form.Label className="small fw-medium">{s.priority}</Form.Label>
                  <Form.Select value={ticket.priority} disabled={update.isPending} onChange={(e) => update.mutate({ priority: e.target.value })}>
                    {SUPPORT_TICKET_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {t.priorities[priority]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="ticket-assignee">
                  <Form.Label className="small fw-medium">{s.assignee}</Form.Label>
                  <Form.Select
                    value={ticket.assignee?.id ?? ""}
                    disabled={update.isPending}
                    onChange={(e) => update.mutate({ assigned_to: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">{s.unassigned}</option>
                    {staff.data?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card>

              {ticket.context && (
                <Card variant="flat">
                  <p className="m-0 mb-2 text-xs font-semibold text-muted-foreground">{s.context}</p>
                  <dl className="m-0 flex flex-col gap-1 text-sm">
                    {Object.entries(ticket.context).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{s.contextLabels[key] ?? key}</dt>
                        <dd className="m-0 text-right">{contextValue(key, value)}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
