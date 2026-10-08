// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Alert, Form» desde «react-bootstrap».
import { Alert, Form } from "react-bootstrap"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «ChevronRight, HeartPulse, LifeBuoy, Plus» desde «lucide-react».
import { ChevronRight, HeartPulse, LifeBuoy, Plus } from "lucide-react"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_TYPES» en la lista.
  SUPPORT_TICKET_TYPES,
  // Esta línea sirve para importar el tipo «CreateSupportTicketPayload».
  type CreateSupportTicketPayload,
  // Esta línea sirve para importar el tipo «CurrentCheckinResponse».
  type CurrentCheckinResponse,
  // Esta línea sirve para importar el tipo «SupportTicket».
  type SupportTicket,
  // Esta línea sirve para importar el tipo «SupportTicketType».
  type SupportTicketType,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar las utilidades y variantes de soporte.
import { formatSupportDate, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «SankBadge» desde «@/components/ui/SankBadge».
import { SankBadge } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «NewTicketForm».
function NewTicketForm({ onCancel }: { onCancel: () => void }) {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «type» y su función «setType».
  const [type, setType] = useState<SupportTicketType>("question")
  // Esta línea sirve para crear el estado «subject» y su función «setSubject».
  const [subject, setSubject] = useState("")
  // Esta línea sirve para crear el estado «message» y su función «setMessage».
  const [message, setMessage] = useState("")

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/support/tickets».
    mutationFn: (payload: CreateSupportTicketPayload) => api.post<SupportTicket>("/support/tickets", payload),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (ticket) => {
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: SUPPORT_QUERY_KEYS.tickets }».
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      // Esta línea sirve para llamar a «navigate» con «`/soporte/${ticket.id}`».
      navigate(`/soporte/${ticket.id}`)
    },
  })

  // Esta línea sirve para extraer «rro» de «mutation.error».
  const error = mutation.error
    // Esta línea sirve para calcular el mensaje de error.
    ? mutation.error instanceof ApiError
      // Esta línea sirve para mostrar el primer error de validación o el mensaje de la API.
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      // Esta línea sirve para usar el mensaje genérico si no es un error de la API.
      : t.createError
    // Esta línea sirve para dejar sin error cuando no hay ninguno.
    : null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Card».
    <Card variant="flat">
      {/* Esta línea sirve para abrir el elemento «Form» con sus atributos en varias líneas. */}
      <Form
        // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column gap-3».
        className="d-flex flex-column gap-3"
        // Esta línea sirve para asignar el manejador del evento «onSubmit».
        onSubmit={(event) => {
          // Esta línea sirve para llamar a «event.preventDefault».
          event.preventDefault()
          // Esta línea sirve para enviar la solicitud con tipo, asunto y mensaje recortados.
          mutation.mutate({ type, subject: subject.trim(), message: message.trim() })
        }}
      >
        {/* Esta línea sirve para mostrar el valor «t.newRequest» dentro de un «h2». */}
        <h2 className="fs-5 m-0 font-heading font-semibold">{t.newRequest}</h2>

        {/* Esta línea sirve para abrir el elemento «fieldset» con las clases «border-0 p-0 m-0». */}
        <fieldset className="border-0 p-0 m-0">
          {/* Esta línea sirve para mostrar el valor «t.typeLabel» dentro de un «legend». */}
          <legend className="small fw-medium mb-2">{t.typeLabel}</legend>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-2 sm:grid-cols-3». */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={t.typeLabel}>
            {/* Esta línea sirve para recorrer «SUPPORT_TICKET_TYPES» y mostrar un bloque por elemento. */}
            {SUPPORT_TICKET_TYPES.map((value) => (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para definir el atributo «role» con el valor «radio».
                role="radio"
                // Esta línea sirve para pasar la propiedad «aria-checked» con el valor «type === value}».
                aria-checked={type === value}
                // Esta línea sirve para pasar la propiedad «title» con el valor «t.typeHints[value]}».
                title={t.typeHints[value]}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setType(value)}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «».
                className={
                  // Esta línea sirve para incluir el texto o las clases «rounded-xl border px-3 py-2 text-left text-sm…».
                  "rounded-xl border px-3 py-2 text-left text-sm transition-colors " +
                  // Esta línea sirve para elegir el estilo del botón de tipo según esté elegido.
                  (type === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50")
                }
              >
                {/* Esta línea sirve para mostrar el contenido dinámico «{t.types[value]}». */}
                {t.types[value]}
              </button>
            ))}
          </div>
          {/* Esta línea sirve para mostrar el valor «t.typeHints[type]» dentro de un «p». */}
          <p className="small text-body-secondary mt-2 mb-0">{t.typeHints[type]}</p>
        </fieldset>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="support-subject">
          {/* Esta línea sirve para mostrar el valor «t.subjectLabel» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">{t.subjectLabel}</Form.Label>
          {/* Esta línea sirve para mostrar el componente «Form.Control». */}
          <Form.Control maxLength={150} placeholder={t.subjectPlaceholder} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Group>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="support-message">
          {/* Esta línea sirve para mostrar el valor «t.messageLabel» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">{t.messageLabel}</Form.Label>
          {/* Esta línea sirve para mostrar el componente «Form.Control». */}
          <Form.Control as="textarea" rows={5} maxLength={5000} placeholder={t.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Group>

        {/* Esta línea sirve para mostrar el bloque solo si «error». */}
        {error && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {/* Esta línea sirve para mostrar el valor «error». */}
            {error}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-end gap-2». */}
        <div className="d-flex justify-content-end gap-2">
          {/* Esta línea sirve para abrir el componente «SankButton». */}
          <SankButton type="button" variant="ghost" onClick={onCancel} disabled={mutation.isPending}>
            {/* Esta línea sirve para mostrar el valor «t.cancel». */}
            {t.cancel}
          </SankButton>
          {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
          <SankButton
            // Esta línea sirve para definir el atributo «type» con el valor «submit».
            type="submit"
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «subject.trim().length < 3 || message.trim().l».
            disabled={subject.trim().length < 3 || message.trim().length < 3 || mutation.isPending}
            // Esta línea sirve para pasar la propiedad «loading» con el valor «mutation.isPending}».
            loading={mutation.isPending}
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «{mutation.isPending ? t.sending : t.send}». */}
            {mutation.isPending ? t.sending : t.send}
          </SankButton>
        </div>
      </Form>
    </Card>
  )
}

/** /soporte — solicitudes del usuario, nueva solicitud y acceso al check-in semanal. */
// Esta línea sirve para declarar la función «SupportPage».
export function SupportPage() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para crear el estado «creating» y su función «setCreating».
  const [creating, setCreating] = useState(false)

  // Esta línea sirve para obtener «tickets» con el hook «useQuery».
  const tickets = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «SUPPORT_QUERY_KEYS.tickets».
    queryKey: SUPPORT_QUERY_KEYS.tickets,
    // Esta línea sirve para pedir a la API los datos de «/support/tickets».
    queryFn: () => api.get<SupportTicket[]>("/support/tickets"),
  })

  // Esta línea sirve para obtener «checkin» con el hook «useQuery».
  const checkin = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...SUPPORT_QUERY_KEYS.checkin, userId]».
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    // Esta línea sirve para pedir a la API los datos de «/support/check-ins/current».
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «!!userId».
    enabled: !!userId,
    // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «30 * 60_000».
    staleTime: 30 * 60_000,
  })
  // Esta línea sirve para extraer «heckinOpe» de «checkin.data?.checkin && checkin.data.ch».
  const checkinOpen = checkin.data?.checkin && checkin.data.checkin.status !== "answered"

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-8 sm:px-6».
    <main className="px-4 py-8 sm:px-6">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-2xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-end justify-between». */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 text-xs font-semibold tracking-wides». */}
            <p className="m-0 text-xs font-semibold tracking-widest text-primary uppercase">
              {/* Esta línea sirve para abrir el componente «LifeBuoy». */}
              <LifeBuoy className="me-1 inline size-3.5" aria-hidden="true" />
              {/* Esta línea sirve para mostrar el valor «t.sectionTitle». */}
              {t.sectionTitle}
            </p>
            {/* Esta línea sirve para mostrar el valor «t.myRequests» dentro de un «h1». */}
            <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{t.myRequests}</h1>
            {/* Esta línea sirve para mostrar el valor «t.sectionSubtitle» dentro de un «p». */}
            <p className="mt-1 mb-0 text-sm text-muted-foreground">{t.sectionSubtitle}</p>
          </div>
          {/* Esta línea sirve para mostrar el bloque solo si «!creating». */}
          {!creating && (
            // Esta línea sirve para abrir el componente «Button» con sus propiedades.
            <Button onClick={() => setCreating(true)}>
              {/* Esta línea sirve para abrir el componente «Plus». */}
              <Plus aria-hidden="true" />
              {/* Esta línea sirve para mostrar el valor «t.newRequest». */}
              {t.newRequest}
            </Button>
          )}
        </div>

        {/* Esta línea sirve para mostrar el bloque solo si «checkinOpen». */}
        {checkinOpen && (
          // Esta línea sirve para abrir el componente «Link».
          <Link to="/soporte/check-in" className="no-underline">
            {/* Esta línea sirve para abrir el componente «Card». */}
            <Card variant="elevated" className="flex items-center gap-3">
              {/* Esta línea sirve para abrir el componente «HeartPulse». */}
              <HeartPulse className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1». */}
              <div className="min-w-0 flex-1">
                {/* Esta línea sirve para mostrar el valor «t.checkinTitle» dentro de un «p». */}
                <p className="m-0 font-medium text-foreground">{t.checkinTitle}</p>
                {/* Esta línea sirve para mostrar el valor «t.checkinCta» dentro de un «p». */}
                <p className="m-0 text-sm text-muted-foreground">{t.checkinCta}</p>
              </div>
              {/* Esta línea sirve para abrir el componente «ChevronRight». */}
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Card>
          </Link>
        )}

        {/* Esta línea sirve para mostrar el elemento solo si «creating». */}
        {creating && <NewTicketForm onCancel={() => setCreating(false)} />}

        {/* Esta línea sirve para abrir el elemento «section». */}
        <section aria-label={t.myRequests} className="flex flex-col gap-3">
          {/* Esta línea sirve para mostrar el elemento solo si «tickets.isLoading». */}
          {tickets.isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el elemento solo si «tickets.isError». */}
          {tickets.isError && <p className="text-sm text-destructive">{t.loadError}</p>}
          {/* Esta línea sirve para mostrar el elemento solo si «tickets.data?.length === 0 && !creating». */}
          {tickets.data?.length === 0 && !creating && <p className="text-sm text-muted-foreground">{t.emptyRequests}</p>}
          {/* Esta línea sirve para recorrer «tickets.data?» y mostrar un bloque por elemento. */}
          {tickets.data?.map((ticket) => (
            // Esta línea sirve para abrir el componente «Link».
            <Link key={ticket.id} to={`/soporte/${ticket.id}`} className="no-underline">
              {/* Esta línea sirve para abrir el componente «Card». */}
              <Card className="flex items-center gap-3">
                {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1». */}
                <div className="min-w-0 flex-1">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center gap-2». */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
                    <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                    {/* Esta línea sirve para mostrar el valor «t.types[ticket.type]» dentro de «SankBadge». */}
                    <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                    {/* Esta línea sirve para mostrar el valor «t.statuses[ticket.status]» dentro de «SankBadge». */}
                    <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    {/* Esta línea sirve para mostrar el aviso de nueva respuesta si el equipo respondió. */}
                    {ticket.status === "answered" && ticket.last_message_by_staff && (
                      // Esta línea sirve para mostrar el valor «t.newReply» dentro de un «span».
                      <span className="text-xs font-semibold text-primary">{t.newReply}</span>
                    )}
                  </div>
                  {/* Esta línea sirve para mostrar el valor «ticket.subject» dentro de un «p». */}
                  <p className="m-0 mt-1 truncate font-medium text-foreground">{ticket.subject}</p>
                  {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
                  <p className="m-0 text-xs text-muted-foreground">{t.lastActivity(formatSupportDate(ticket.last_message_at))}</p>
                </div>
                {/* Esta línea sirve para abrir el componente «ChevronRight». */}
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
