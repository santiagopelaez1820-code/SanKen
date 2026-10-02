import { useState } from "react"
import { Modal } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AnswerCheckinResponse, CurrentCheckinResponse } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
import { SankButton } from "@/components/ui/SankButton"
import { WeeklyCheckinForm } from "@/components/support/WeeklyCheckinForm"

/**
 * Diálogo del check-in semanal, montado una vez en AppShell. Consulta
 * GET /support/check-ins/current al abrir la app: el backend decide si toca
 * mostrarlo (viernes a domingo, una vez por semana, respetando "Ahora no").
 * No se vuelve a consultar en cada navegación (staleTime largo), y no se
 * abre si el usuario ya está en /soporte/check-in.
 */
export function WeeklyCheckinPrompt() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const userId = useAuthStore((s) => s.user?.id)
  const [dismissed, setDismissed] = useState(false)
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null)

  const { data } = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    enabled: !!userId,
    staleTime: 30 * 60_000,
    refetchOnWindowFocus: false,
  })

  const postpone = useMutation({
    mutationFn: () => api.post(`/support/check-ins/${data?.checkin?.id}/postpone`),
    onSettled: () => {
      setDismissed(true)
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.checkin })
    },
  })

  const onCheckinPage = location.pathname === "/soporte/check-in"
  const open = !dismissed && !onCheckinPage && ((!!data?.should_prompt && !!data.checkin) || !!result)

  const close = () => {
    setDismissed(true)
    setResult(null)
  }

  return (
    <Modal show={open} onHide={() => (result ? close() : postpone.mutate())} centered aria-labelledby="weekly-checkin-title">
      <Modal.Header closeButton>
        <Modal.Title id="weekly-checkin-title" as="h2" className="fs-5">
          {t.checkinTitle} 💪
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result ? (
          <div className="d-flex flex-column gap-3" role="status">
            <p className="mb-0">{result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}</p>
            <SankButton onClick={close} className="align-self-end">
              {t.done}
            </SankButton>
          </div>
        ) : (
          data?.checkin && (
            <WeeklyCheckinForm
              checkin={data.checkin}
              onDone={setResult}
              onPostpone={() => postpone.mutate()}
              isPostponing={postpone.isPending}
            />
          )
        )}
      </Modal.Body>
    </Modal>
  )
}
