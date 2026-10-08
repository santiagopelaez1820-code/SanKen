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
// Esta línea sirve para importar «ApiError, type SupportTicket» desde «@sanken/core».
import { ApiError, type SupportTicket } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar las utilidades y variantes de soporte.
import { formatSupportDate, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
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

/** /soporte/:ticketId — conversación de una solicitud propia. */
// Esta línea sirve para declarar la función «SupportTicketPage».
export function SupportTicketPage() {
  // Esta línea sirve para obtener «ticketId = ""» con el hook «useParams».
  const { ticketId = "" } = useParams()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState("")

  // Esta línea sirve para obtener «data: ticket, isLoading, isError» con el hook «useQuery».
  const { data: ticket, isLoading, isError } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «SUPPORT_QUERY_KEYS.ticket(ticketId)».
    queryKey: SUPPORT_QUERY_KEYS.ticket(ticketId),
    // Esta línea sirve para pedir a la API los datos de «/support/tickets/${ticketId}».
    queryFn: () => api.get<SupportTicket>(`/support/tickets/${ticketId}`),
  })

  // Esta línea sirve para extraer «nUpdate» de «(updated: SupportTicket) => {».
  const onUpdated = (updated: SupportTicket) => {
    // Esta línea sirve para actualizar el ticket en caché con la respuesta.
    queryClient.setQueryData(SUPPORT_QUERY_KEYS.ticket(ticketId), updated)
    // Esta línea sirve para refrescar la lista de tickets.
    queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets, exact: true })
  }

  // Esta línea sirve para obtener «reply» con el hook «useMutation».
  const reply = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/support/tickets/${ticketId}/messages».
    mutationFn: () => api.post<SupportTicket>(`/support/tickets/${ticketId}/messages`, { body: body.trim() }),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (updated) => {
      // Esta línea sirve para guardar en el estado con «setBody» el valor «"")…».
      setBody("")
      // Esta línea sirve para llamar a «onUpdated» con «updated».
      onUpdated(updated)
    },
  })

  // Esta línea sirve para obtener «close» con el hook «useMutation».
  const close = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/support/tickets/${ticketId}/close».
    mutationFn: () => api.post<SupportTicket>(`/support/tickets/${ticketId}/close`),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: onUpdated,
  })

  // Esta línea sirve para extraer «rro» de «reply.error ?? close.error».
  const error = reply.error ?? close.error
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
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-2xl flex-col gap-5». */}
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          {/* Esta línea sirve para abrir el componente «ArrowLeft». */}
          <ArrowLeft className="size-4" aria-hidden="true" />
          {/* Esta línea sirve para mostrar el valor «t.myRequests». */}
          {t.myRequests}
        </Link>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-40 w-full" />}
        {/* Esta línea sirve para mostrar el elemento solo si «isError». */}
        {isError && <p className="text-sm text-destructive">{t.loadError}</p>}

        {/* Esta línea sirve para mostrar el bloque solo si «ticket». */}
        {ticket && (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
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
                {/* Esta línea sirve para mostrar el elemento solo si «ticket.source === "weekly_checkin"». */}
                {ticket.source === "weekly_checkin" && <span className="text-xs text-muted-foreground">{t.fromCheckin}</span>}
              </div>
              {/* Esta línea sirve para mostrar el valor «ticket.subject» dentro de un «h1». */}
              <h1 className="fs-4 m-0 font-heading font-bold tracking-tight">{ticket.subject}</h1>
              {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
              <p className="m-0 text-xs text-muted-foreground">{t.createdOn(formatSupportDate(ticket.created_at, true))}</p>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 text-sm text-muted-foreground». */}
              <p className="m-0 text-sm text-muted-foreground" role="status">
                {/* Esta línea sirve para mostrar el contenido dinámico «{t.statusHints[ticket.status]}». */}
                {t.statusHints[ticket.status]}
              </p>
            </header>

            {/* Esta línea sirve para abrir el componente «Card». */}
            <Card variant="flat">
              {/* Esta línea sirve para abrir el componente «TicketConversation». */}
              <TicketConversation messages={ticket.messages ?? []} viewer="user" />
            </Card>

            {/* Esta línea sirve para mostrar el bloque solo si «errorMessage». */}
            {errorMessage && (
              // Esta línea sirve para abrir el componente «Alert».
              <Alert variant="danger" className="py-2 small mb-0" role="alert">
                {/* Esta línea sirve para mostrar el valor «errorMessage». */}
                {errorMessage}
              </Alert>
            )}

            {/* Esta línea sirve para elegir entre dos bloques según «ticket.status === "closed"». */}
            {ticket.status === "closed" ? (
              // Esta línea sirve para mostrar el valor «t.closedNotice» dentro de un «p».
              <p className="text-sm text-muted-foreground">{t.closedNotice}</p>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «Form» con sus atributos en varias líneas.
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
                <Form.Label htmlFor="support-reply" className="visually-hidden">
                  {/* Esta línea sirve para mostrar el valor «t.reply». */}
                  {t.reply}
                </Form.Label>
                {/* Esta línea sirve para abrir el campo de la respuesta. */}
                <Form.Control
                  // Esta línea sirve para definir el atributo «id» con el valor «support-reply».
                  id="support-reply"
                  // Esta línea sirve para definir el atributo «as» con el valor «textarea».
                  as="textarea"
                  // Esta línea sirve para pasar la propiedad «rows» con el valor «3}».
                  rows={3}
                  // Esta línea sirve para pasar la propiedad «maxLength» con el valor «5000}».
                  maxLength={5000}
                  // Esta línea sirve para pasar la propiedad «placeholder» con el valor «t.replyPlaceholder}».
                  placeholder={t.replyPlaceholder}
                  // Esta línea sirve para pasar la propiedad «value» con el valor «body}».
                  value={body}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => setBody(e.target.value)}
                />
                {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-wrap justify-content-between». */}
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  {/* Esta línea sirve para abrir el componente «SankButton» con sus propiedades. */}
                  <SankButton type="button" variant="ghost" onClick={() => close.mutate()} disabled={close.isPending} loading={close.isPending}>
                    {/* Esta línea sirve para mostrar el valor «t.closeRequest». */}
                    {t.closeRequest}
                  </SankButton>
                  {/* Esta línea sirve para abrir el componente «SankButton». */}
                  <SankButton type="submit" disabled={!body.trim() || reply.isPending} loading={reply.isPending}>
                    {/* Esta línea sirve para mostrar el valor «t.reply». */}
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
