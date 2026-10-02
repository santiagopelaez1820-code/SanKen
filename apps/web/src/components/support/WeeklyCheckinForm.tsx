import { useState } from "react"
import { Alert, Form } from "react-bootstrap"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ApiError,
  CHECKIN_MOODS,
  CHECKIN_TOPICS,
  type AnswerCheckinPayload,
  type AnswerCheckinResponse,
  type CheckinMood,
  type CheckinTopic,
  type WeeklyCheckin,
} from "@sanken/core"
import { api } from "@/lib/api"
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
import { SankButton } from "@/components/ui/SankButton"
import { cn } from "@/lib/utils"

interface WeeklyCheckinFormProps {
  checkin: WeeklyCheckin
  onDone: (result: AnswerCheckinResponse) => void
  /** "Ahora no" — solo en el diálogo automático; en la página se omite. */
  onPostpone?: () => void
  isPostponing?: boolean
}

/**
 * El check-in en sí: 1) cómo se sintió, 2) si quiere contar algo, 3) solo si
 * eligió contar algo, el comentario. Pensado para responderse en menos de
 * un minuto. Se usa en el diálogo automático y en /soporte/check-in.
 */
export function WeeklyCheckinForm({ checkin, onDone, onPostpone, isPostponing }: WeeklyCheckinFormProps) {
  const queryClient = useQueryClient()
  const [mood, setMood] = useState<CheckinMood | null>(null)
  const [topic, setTopic] = useState<CheckinTopic | null>(null)
  const [comment, setComment] = useState("")
  const needsComment = topic !== null && topic !== "none"
  const canSubmit = mood !== null && topic !== null && (!needsComment || comment.trim().length >= 3)

  const mutation = useMutation({
    mutationFn: (payload: AnswerCheckinPayload) =>
      api.post<AnswerCheckinResponse>(`/support/check-ins/${checkin.id}/answer`, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.checkin })
      if (result.ticket) queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      onDone(result)
    },
  })

  const error = mutation.error
    ? mutation.error instanceof ApiError
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      : t.createError
    : null

  return (
    <Form
      className="d-flex flex-column gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!canSubmit || !mood || !topic) return
        mutation.mutate({ mood, topic, ...(needsComment ? { comment: comment.trim() } : {}) })
      }}
    >
      <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
        <legend className="fs-6 fw-semibold mb-2">{t.checkinMoodQuestion}</legend>
        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={t.checkinMoodQuestion}>
          {CHECKIN_MOODS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mood === value}
              onClick={() => setMood(value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-xs transition-colors",
                mood === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
              )}
            >
              <span className="text-2xl" aria-hidden="true">
                {t.moods[value].emoji}
              </span>
              <span className="text-center leading-tight">{t.moods[value].label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {mood && (
        <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
          <legend className="fs-6 fw-semibold mb-2">{t.checkinTopicQuestion}</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.checkinTopicQuestion}>
            {CHECKIN_TOPICS.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={topic === value}
                onClick={() => setTopic(value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  topic === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
                )}
              >
                {t.topics[value]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {needsComment && (
        <Form.Group controlId="checkin-comment">
          <Form.Label className="fw-semibold">{t.checkinCommentQuestion}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={2000}
            placeholder={t.checkinCommentPlaceholder}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </Form.Group>
      )}

      <p className="small text-body-secondary mb-0">{t.checkinPrivacyNote}</p>

      {error && (
        <Alert variant="danger" className="py-2 small mb-0" role="alert">
          {error}
        </Alert>
      )}

      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
        {onPostpone && (
          <SankButton type="button" variant="ghost" onClick={onPostpone} disabled={mutation.isPending || isPostponing} loading={isPostponing}>
            {t.checkinLater}
          </SankButton>
        )}
        <SankButton type="submit" disabled={!canSubmit || mutation.isPending} loading={mutation.isPending}>
          {t.checkinSubmit}
        </SankButton>
      </div>
    </Form>
  )
}
