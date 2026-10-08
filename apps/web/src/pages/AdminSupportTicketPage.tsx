// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Alert, Form» desde «react-bootstrap».
import { Alert, Form } from "react-bootstrap"
// Esta línea sirve para importar «Link, useParams» desde «react-router-dom».
import { Link, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «ArrowLeft» desde «lucide-react».
import { ArrowLeft } from "lucide-react"
// Esta línea sirve para abrir la importación de utilidades y tipos del núcleo.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «CHECKIN_MOODS» en la lista.
  CHECKIN_MOODS,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_PRIORITIES» en la lista.
  SUPPORT_TICKET_PRIORITIES,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_STATUSES» en la lista.
  SUPPORT_TICKET_STATUSES,
  // Esta línea sirve para importar el tipo «AdminSupportTicket».
  type AdminSupportTicket,
  // Esta línea sirve para importar el tipo «CheckinMood».
  type CheckinMood,
  // Esta línea sirve para importar el tipo «CheckinTopic».
  type CheckinTopic,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar las utilidades y variantes de soporte.
import { formatSupportDate, PRIORITY_VARIANT, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings } from "@/lib/support"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"
// Esta línea sirve para importar «SankBadge» desde «@/components/ui/SankBadge».
import { SankBadge } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «TicketConversation» desde «@/components/support/TicketConversation».
import { TicketConversation } from "@/components/support/TicketConversation"

// Esta línea sirve para declarar «t» con el valor «supportStrings».
const t = supportStrings
// Esta línea sirve para declarar «s» con el valor «supportStrings.admin».
const s = supportStrings.admin

// Esta línea sirve para declarar la función «contextValue».
function contextValue(key: string, value: unknown): string {
  // Esta línea sirve para mostrar la etiqueta del ánimo si la clave es mood.
  if (key === "mood" && CHECKIN_MOODS.includes(value as CheckinMood)) {
    // Esta línea sirve para extraer «oo» de «t.moods[value as CheckinMood]».
    const mood = t.moods[value as CheckinMood]
    // Esta línea sirve para devolver «`${mood.emoji} ${mood.label}`».
    return `${mood.emoji} ${mood.label}`
  }
  // Esta línea sirve para mostrar la etiqueta del tema si la clave es topic.
  if (key === "topic" && typeof value === "string" && value in t.topics) return t.topics[value as CheckinTopic]
  // Esta línea sirve para mostrar un guion si no hay valor o el valor como texto.
  return value === null || value === undefined ? "—" : String(value)
}

/** /admin/soporte/:ticketId — leer, responder y gestionar una solicitud. */
// Esta línea sirve para declarar la función «AdminSupportTicketPage».
export function AdminSupportTicketPage() {
  // Esta línea sirve para obtener «ticketId = ""» con el hook «useParams».
  const { ticketId = "" } = useParams()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState("")
  // Esta línea sirve para extraer «e» de «[...SUPPORT_QUERY_KEYS.admin, "ticket", ».
  const key = [...SUPPORT_QUERY_KEYS.admin, "ticket", ticketId]

  // Esta línea sirve para obtener «data: ticket, isLoading, isError» con el hook «useQuery».
  const { data: ticket, isLoading, isError } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «key».
    queryKey: key,
    // Esta línea sirve para pedir a la API los datos de «/admin/support/tickets/${ticketId}».
    queryFn: () => api.get<AdminSupportTicket>(`/admin/support/tickets/${ticketId}`),
  })

  // Esta línea sirve para obtener «staff» con el hook «useQuery».
  const staff = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...SUPPORT_QUERY_KEYS.admin, "staff"]».
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "staff"],
    // Esta línea sirve para pedir a la API los datos de «/admin/support/staff».
    queryFn: () => api.get<{ id: number; name: string }[]>("/admin/support/staff"),
    // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «10 * 60_000».
    staleTime: 10 * 60_000,
  })

  // Esta línea sirve para extraer «nUpdate» de «(updated: AdminSupportTicket) => {».
  const onUpdated = (updated: AdminSupportTicket) => {
    // Esta línea sirve para llamar a «queryClient.setQueryData» con «key, updated».
    queryClient.setQueryData(key, updated)
    // Esta línea sirve para refrescar la lista de tickets.
    queryClient.invalidateQueries({ queryKey: [...SUPPORT_QUERY_KEYS.admin, "tickets"] })
    // Esta línea sirve para refrescar las estadísticas de soporte.
    queryClient.invalidateQueries({ queryKey: [...SUPPORT_QUERY_KEYS.admin, "stats"] })
  }

  // Esta línea sirve para obtener «reply» con el hook «useMutation».
  const reply = useMutation({
    // Esta línea sirve para enviar la respuesta del administrador al ticket.
    mutationFn: () => api.post<AdminSupportTicket>(`/admin/support/tickets/${ticketId}/messages`, { body: body.trim() }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(updated) => {».
    onSuccess: (updated) => {
      // Esta línea sirve para llamar a «setBody» con «""».
      setBody("")
      // Esta línea sirve para llamar a «onUpdated» con «updated».
      onUpdated(updated)
    },
  })

  // Esta línea sirve para obtener «update» con el hook «useMutation».
  const update = useMutation({
    // Esta línea sirve para enviar los cambios del ticket (estado, prioridad o asignación).
    mutationFn: (changes: Record<string, string | number | null>) => api.patch<AdminSupportTicket>(`/admin/support/tickets/${ticketId}`, changes),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «onUpdated».
    onSuccess: onUpdated,
  })

  // Esta línea sirve para extraer «rro» de «reply.error ?? update.error».
  const error = reply.error ?? update.error
  // Esta línea sirve para extraer «rrorMessag» de «error».
  const errorMessage = error
    // Esta línea sirve para calcular el mensaje de error.
    ? error instanceof ApiError
      // Esta línea sirve para mostrar el primer error de validación o el mensaje de la API.
      ? (Object.values(error.body.errors ?? {})[0]?.[0] ?? error.body.message)
      // Esta línea sirve para usar el mensaje genérico si no es un error de la API.
      : t.createError
    // Esta línea sirve para dejar sin error cuando no hay ninguno.
    : null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-8 sm:px-6».
    <main className="px-4 py-8 sm:px-6">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-5xl flex-col gap-5». */}
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/admin/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          {/* Esta línea sirve para abrir el componente «ArrowLeft». */}
          <ArrowLeft className="size-4" aria-hidden="true" />
          {/* Esta línea sirve para mostrar el valor «s.title». */}
          {s.title}
        </Link>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-40 w-full" />}
        {/* Esta línea sirve para mostrar el elemento solo si «isError». */}
        {isError && <p className="text-sm text-destructive">{t.loadError}</p>}

        {/* Esta línea sirve para mostrar el bloque solo si «ticket». */}
        {ticket && (
          // Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-1 gap-5 lg:grid-cols-3».
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-4 lg:col-span-2». */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Esta línea sirve para abrir el elemento «header» con las clases «flex flex-col gap-2». */}
              <header className="flex flex-col gap-2">
                {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center gap-2». */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Esta línea sirve para mostrar el valor «t.requestNumber(ticket.id)» dentro de un «span». */}
                  <span className="text-sm text-muted-foreground">{t.requestNumber(ticket.id)}</span>
                  {/* Esta línea sirve para mostrar el valor «t.types[ticket.type]» dentro de «SankBadge». */}
                  <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                  {/* Esta línea sirve para mostrar el valor «t.statuses[ticket.status]» dentro de «SankBadge». */}
                  <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                  {/* Esta línea sirve para mostrar el valor «t.priorities[ticket.priority]» dentro de «SankBadge». */}
                  <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                </div>
                {/* Esta línea sirve para mostrar el valor «ticket.subject» dentro de un «h1». */}
                <h1 className="fs-4 m-0 font-heading font-bold tracking-tight">{ticket.subject}</h1>
                {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
                <p className="m-0 text-xs text-muted-foreground">{t.createdOn(formatSupportDate(ticket.created_at, true))}</p>
              </header>

              {/* Esta línea sirve para abrir el componente «Card». */}
              <Card variant="flat">
                {/* Esta línea sirve para abrir el componente «TicketConversation». */}
                <TicketConversation messages={ticket.messages ?? []} viewer="staff" />
              </Card>

              {/* Esta línea sirve para mostrar el bloque solo si «errorMessage». */}
              {errorMessage && (
                // Esta línea sirve para abrir el componente «Alert».
                <Alert variant="danger" className="py-2 small mb-0" role="alert">
                  {/* Esta línea sirve para mostrar el valor «errorMessage». */}
                  {errorMessage}
                </Alert>
              )}

              {/* Esta línea sirve para abrir el elemento «Form» con sus atributos en varias líneas. */}
              <Form
                // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column gap-2».
                className="d-flex flex-column gap-2"
                // Esta línea sirve para asignar el manejador del evento «onSubmit».
                onSubmit={(event) => {
                  // Esta línea sirve para llamar a «event.preventDefault».
                  event.preventDefault()
                  // Esta línea sirve para enviar la respuesta si el texto no está vacío.
                  if (body.trim()) reply.mutate()
                }}
              >
                {/* Esta línea sirve para abrir el componente «Form.Label». */}
                <Form.Label htmlFor="staff-reply" className="small fw-medium">
                  {/* Esta línea sirve para mostrar el valor «s.replyAsStaff». */}
                  {s.replyAsStaff}
                </Form.Label>
                {/* Esta línea sirve para mostrar el componente «Form.Control». */}
                <Form.Control id="staff-reply" as="textarea" rows={4} maxLength={5000} value={body} onChange={(e) => setBody(e.target.value)} />
                {/* Esta línea sirve para abrir el componente «SankButton». */}
                <SankButton type="submit" className="align-self-end" disabled={!body.trim() || reply.isPending} loading={reply.isPending}>
                  {/* Esta línea sirve para mostrar el valor «t.reply». */}
                  {t.reply}
                </SankButton>
              </Form>
            </div>

            {/* Esta línea sirve para abrir el elemento «aside» con las clases «flex flex-col gap-4». */}
            <aside className="flex flex-col gap-4" aria-label={s.title}>
              {/* Esta línea sirve para abrir el componente «Card». */}
              <Card variant="flat" className="flex flex-col gap-3">
                {/* Esta línea sirve para abrir el elemento «div». */}
                <div>
                  {/* Esta línea sirve para mostrar el valor «s.user» dentro de un «p». */}
                  <p className="m-0 text-xs font-semibold text-muted-foreground">{s.user}</p>
                  {/* Esta línea sirve para mostrar el valor «ticket.user?.name» dentro de un «p». */}
                  <p className="m-0 font-medium">{ticket.user?.name}</p>
                  {/* Esta línea sirve para mostrar el valor «ticket.user?.email» dentro de un «p». */}
                  <p className="m-0 text-xs text-muted-foreground">{ticket.user?.email}</p>
                </div>

                {/* Esta línea sirve para abrir el componente «Form.Group». */}
                <Form.Group controlId="ticket-status">
                  {/* Esta línea sirve para mostrar el valor «s.status» dentro de «Form.Label». */}
                  <Form.Label className="small fw-medium">{s.status}</Form.Label>
                  {/* Esta línea sirve para abrir el componente «Form.Select» con sus propiedades. */}
                  <Form.Select value={ticket.status} disabled={update.isPending} onChange={(e) => update.mutate({ status: e.target.value })}>
                    {/* Esta línea sirve para recorrer «SUPPORT_TICKET_STATUSES» y mostrar un bloque por elemento. */}
                    {SUPPORT_TICKET_STATUSES.map((status) => (
                      // Esta línea sirve para abrir el elemento «option».
                      <option key={status} value={status}>
                        {/* Esta línea sirve para mostrar el contenido dinámico «{t.statuses[status]}». */}
                        {t.statuses[status]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Esta línea sirve para abrir el componente «Form.Group». */}
                <Form.Group controlId="ticket-priority">
                  {/* Esta línea sirve para mostrar el valor «s.priority» dentro de «Form.Label». */}
                  <Form.Label className="small fw-medium">{s.priority}</Form.Label>
                  {/* Esta línea sirve para abrir el componente «Form.Select» con sus propiedades. */}
                  <Form.Select value={ticket.priority} disabled={update.isPending} onChange={(e) => update.mutate({ priority: e.target.value })}>
                    {/* Esta línea sirve para recorrer «SUPPORT_TICKET_PRIORITIES» y mostrar un bloque por elemento. */}
                    {SUPPORT_TICKET_PRIORITIES.map((priority) => (
                      // Esta línea sirve para abrir el elemento «option».
                      <option key={priority} value={priority}>
                        {/* Esta línea sirve para mostrar el contenido dinámico «{t.priorities[priority]}». */}
                        {t.priorities[priority]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Esta línea sirve para abrir el componente «Form.Group». */}
                <Form.Group controlId="ticket-assignee">
                  {/* Esta línea sirve para mostrar el valor «s.assignee» dentro de «Form.Label». */}
                  <Form.Label className="small fw-medium">{s.assignee}</Form.Label>
                  {/* Esta línea sirve para abrir el selector de asignación del ticket. */}
                  <Form.Select
                    // Esta línea sirve para pasar la propiedad «value» con el valor «ticket.assignee?.id ?? ""}».
                    value={ticket.assignee?.id ?? ""}
                    // Esta línea sirve para pasar la propiedad «disabled» con el valor «update.isPending}».
                    disabled={update.isPending}
                    // Esta línea sirve para asignar el manejador del evento «onChange».
                    onChange={(e) => update.mutate({ assigned_to: e.target.value ? Number(e.target.value) : null })}
                  >
                    {/* Esta línea sirve para mostrar el valor «s.unassigned» dentro de un «option». */}
                    <option value="">{s.unassigned}</option>
                    {/* Esta línea sirve para recorrer «staff.data?» y mostrar un bloque por elemento. */}
                    {staff.data?.map((member) => (
                      // Esta línea sirve para abrir el elemento «option».
                      <option key={member.id} value={member.id}>
                        {/* Esta línea sirve para mostrar el valor «member.name». */}
                        {member.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card>

              {/* Esta línea sirve para mostrar el bloque solo si «ticket.context». */}
              {ticket.context && (
                // Esta línea sirve para abrir el componente «Card».
                <Card variant="flat">
                  {/* Esta línea sirve para mostrar el valor «s.context» dentro de un «p». */}
                  <p className="m-0 mb-2 text-xs font-semibold text-muted-foreground">{s.context}</p>
                  {/* Esta línea sirve para abrir el elemento «dl» con las clases «m-0 flex flex-col gap-1 text-sm». */}
                  <dl className="m-0 flex flex-col gap-1 text-sm">
                    {/* Esta línea sirve para recorrer «Object.entries(ticket.context)» y mostrar un bloque por elemento. */}
                    {Object.entries(ticket.context).map(([key, value]) => (
                      // Esta línea sirve para abrir el elemento «div».
                      <div key={key} className="flex justify-between gap-3">
                        {/* Esta línea sirve para mostrar el valor «s.contextLabels[key] ?? key» dentro de un «dt». */}
                        <dt className="text-muted-foreground">{s.contextLabels[key] ?? key}</dt>
                        {/* Esta línea sirve para mostrar el valor «contextValue(key, value)» dentro de un «dd». */}
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
