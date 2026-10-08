// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Alert, Form» desde «react-bootstrap».
import { Alert, Form } from "react-bootstrap"
// Esta línea sirve para importar «useMutation, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de utilidades y tipos de núcleo.
import {
  // Esta línea sirve para importar ApiError.
  ApiError,
  // Esta línea sirve para importar CHECKIN_MOODS.
  CHECKIN_MOODS,
  // Esta línea sirve para importar CHECKIN_TOPICS.
  CHECKIN_TOPICS,
  // Esta línea sirve para importar AnswerCheckinPayload.
  type AnswerCheckinPayload,
  // Esta línea sirve para importar AnswerCheckinResponse.
  type AnswerCheckinResponse,
  // Esta línea sirve para importar CheckinMood.
  type CheckinMood,
  // Esta línea sirve para importar CheckinTopic.
  type CheckinTopic,
  // Esta línea sirve para importar WeeklyCheckin.
  type WeeklyCheckin,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SUPPORT_QUERY_KEYS, supportStrings as t» desde «@/lib/support».
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «WeeklyCheckinFormProps».
interface WeeklyCheckinFormProps {
  // Esta línea sirve para declarar la propiedad «checkin» con el valor o tipo «WeeklyCheckin».
  checkin: WeeklyCheckin
  // Esta línea sirve para declarar la propiedad «onDone» con el valor o tipo «(result: AnswerCheckinResponse) => void».
  onDone: (result: AnswerCheckinResponse) => void
  /** "Ahora no" — solo en el diálogo automático; en la página se omite. */
  // Esta línea sirve para declarar la propiedad «onPostpone» con el valor o tipo «() => void».
  onPostpone?: () => void
  // Esta línea sirve para declarar la propiedad «isPostponing» con el valor o tipo «boolean».
  isPostponing?: boolean
}

/**
 * El check-in en sí: 1) cómo se sintió, 2) si quiere contar algo, 3) solo si
 * eligió contar algo, el comentario. Pensado para responderse en menos de
 * un minuto. Se usa en el diálogo automático y en /soporte/check-in.
 */
// Esta línea sirve para declarar el formulario del check-in semanal.
export function WeeklyCheckinForm({ checkin, onDone, onPostpone, isPostponing }: WeeklyCheckinFormProps) {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para guardar el estado de ánimo elegido.
  const [mood, setMood] = useState<CheckinMood | null>(null)
  // Esta línea sirve para guardar el tema elegido.
  const [topic, setTopic] = useState<CheckinTopic | null>(null)
  // Esta línea sirve para guardar el comentario escrito.
  const [comment, setComment] = useState("")
  // Esta línea sirve para calcular si el tema exige comentario.
  const needsComment = topic !== null && topic !== "none"
  // Esta línea sirve para calcular si el formulario se puede enviar.
  const canSubmit = mood !== null && topic !== null && (!needsComment || comment.trim().length >= 3)

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(payload: AnswerCheckinPayload) =>».
    mutationFn: (payload: AnswerCheckinPayload) =>
      // Esta línea sirve para enviar la respuesta del check-in a la API.
      api.post<AnswerCheckinResponse>(`/support/check-ins/${checkin.id}/answer`, payload),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(result) => {».
    onSuccess: (result) => {
      // Esta línea sirve para refrescar el check-in actual.
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.checkin })
      // Esta línea sirve para refrescar los tickets si se creó uno.
      if (result.ticket) queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      // Esta línea sirve para avisar al padre que terminó.
      onDone(result)
    },
  })

  // Esta línea sirve para calcular el mensaje de error.
  const error = mutation.error
    // Esta línea sirve para revisar si hubo error en la mutación.
    ? mutation.error instanceof ApiError
      // Esta línea sirve para mostrar el primer error de validación o el mensaje de la API.
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      // Esta línea sirve para usar el mensaje genérico si no es un error de la API.
      : t.createError
    // Esta línea sirve para dejar sin error cuando no hay ninguno.
    : null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Form» con sus atributos en varias líneas.
    <Form
      // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column gap-4».
      className="d-flex flex-column gap-4"
      // Esta línea sirve para asignar el manejador del evento «onSubmit».
      onSubmit={(event) => {
        // Esta línea sirve para evitar el envío nativo del formulario.
        event.preventDefault()
        // Esta línea sirve para salir si el formulario no es válido.
        if (!canSubmit || !mood || !topic) return
        // Esta línea sirve para enviar el estado de ánimo, el tema y el comentario si hace falta.
        mutation.mutate({ mood, topic, ...(needsComment ? { comment: comment.trim() } : {}) })
      }}
    >
      {/* Esta línea sirve para abrir el elemento «fieldset» con las clases «d-flex flex-column gap-2 border-0 p-0 m-». */}
      <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
        {/* Esta línea sirve para mostrar la pregunta del estado de ánimo. */}
        <legend className="fs-6 fw-semibold mb-2">{t.checkinMoodQuestion}</legend>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-5 gap-2». */}
        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={t.checkinMoodQuestion}>
          {/* Esta línea sirve para recorrer «CHECKIN_MOODS» y mostrar un bloque por elemento. */}
          {CHECKIN_MOODS.map((value) => (
            // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
            <button
              // Esta línea sirve para identificar el elemento de la lista con «value}».
              key={value}
              // Esta línea sirve para definir el atributo «type» con el valor «button».
              type="button"
              // Esta línea sirve para definir el atributo «role» con el valor «radio».
              role="radio"
              // Esta línea sirve para pasar la propiedad «aria-checked» con el valor «mood === value}».
              aria-checked={mood === value}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => setMood(value)}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
              className={cn(
                // Esta línea sirve para aplicar las clases base del botón de ánimo.
                "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-xs transition-colors",
                // Esta línea sirve para resaltar el botón del ánimo elegido.
                mood === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
              )}
            >
              {/* Esta línea sirve para abrir el elemento «span» con las clases «text-2xl». */}
              <span className="text-2xl" aria-hidden="true">
                {/* Esta línea sirve para mostrar el emoji del ánimo. */}
                {t.moods[value].emoji}
              </span>
              {/* Esta línea sirve para mostrar la etiqueta del ánimo. */}
              <span className="text-center leading-tight">{t.moods[value].label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Esta línea sirve para mostrar el bloque solo si «mood». */}
      {mood && (
        // Esta línea sirve para abrir el elemento «fieldset» con las clases «d-flex flex-column gap-2 border-0 p-0 m-».
        <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
          {/* Esta línea sirve para mostrar la pregunta del tema. */}
          <legend className="fs-6 fw-semibold mb-2">{t.checkinTopicQuestion}</legend>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.checkinTopicQuestion}>
            {/* Esta línea sirve para recorrer «CHECKIN_TOPICS» y mostrar un bloque por elemento. */}
            {CHECKIN_TOPICS.map((value) => (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para definir el atributo «role» con el valor «radio».
                role="radio"
                // Esta línea sirve para pasar la propiedad «aria-checked» con el valor «topic === value}».
                aria-checked={topic === value}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setTopic(value)}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                className={cn(
                  // Esta línea sirve para aplicar las clases base del botón de tema.
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  // Esta línea sirve para resaltar el botón del tema elegido.
                  topic === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
                )}
              >
                {/* Esta línea sirve para mostrar el nombre del tema. */}
                {t.topics[value]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «needsComment». */}
      {needsComment && (
        // Esta línea sirve para abrir el componente «Form.Group».
        <Form.Group controlId="checkin-comment">
          {/* Esta línea sirve para mostrar la pregunta del comentario. */}
          <Form.Label className="fw-semibold">{t.checkinCommentQuestion}</Form.Label>
          {/* Esta línea sirve para abrir el campo del comentario. */}
          <Form.Control
            // Esta línea sirve para definir el atributo «as» con el valor «textarea».
            as="textarea"
            // Esta línea sirve para pasar la propiedad «rows» con el valor «3}».
            rows={3}
            // Esta línea sirve para pasar la propiedad «maxLength» con el valor «2000}».
            maxLength={2000}
            // Esta línea sirve para pasar la propiedad «placeholder» con el valor «t.checkinCommentPlaceholder}».
            placeholder={t.checkinCommentPlaceholder}
            // Esta línea sirve para pasar la propiedad «value» con el valor «comment}».
            value={comment}
            // Esta línea sirve para asignar el manejador del evento «onChange».
            onChange={(event) => setComment(event.target.value)}
          />
        </Form.Group>
      )}

      {/* Esta línea sirve para mostrar la nota de privacidad. */}
      <p className="small text-body-secondary mb-0">{t.checkinPrivacyNote}</p>

      {/* Esta línea sirve para mostrar el bloque solo si «error». */}
      {error && (
        // Esta línea sirve para abrir el componente «Alert».
        <Alert variant="danger" className="py-2 small mb-0" role="alert">
          {/* Esta línea sirve para mostrar el valor «error». */}
          {error}
        </Alert>
      )}

      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column flex-sm-row gap-2 jus». */}
      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
        {/* Esta línea sirve para mostrar el bloque solo si «onPostpone». */}
        {onPostpone && (
          // Esta línea sirve para abrir el componente «SankButton».
          <SankButton type="button" variant="ghost" onClick={onPostpone} disabled={mutation.isPending || isPostponing} loading={isPostponing}>
            {/* Esta línea sirve para mostrar el valor «t.checkinLater». */}
            {t.checkinLater}
          </SankButton>
        )}
        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="submit" disabled={!canSubmit || mutation.isPending} loading={mutation.isPending}>
          {/* Esta línea sirve para mostrar el valor «t.checkinSubmit». */}
          {t.checkinSubmit}
        </SankButton>
      </div>
    </Form>
  )
}
