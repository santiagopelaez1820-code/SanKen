// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Modal» desde «react-bootstrap».
import { Modal } from "react-bootstrap"
// Esta línea sirve para importar «useLocation» desde «react-router-dom».
import { useLocation } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AnswerCheckinResponse, CurrentCheckinResponse» desde «@sanken/core».
import type { AnswerCheckinResponse, CurrentCheckinResponse } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «SUPPORT_QUERY_KEYS, supportStrings as t» desde «@/lib/support».
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «WeeklyCheckinForm» desde «@/components/support/WeeklyCheckinForm».
import { WeeklyCheckinForm } from "@/components/support/WeeklyCheckinForm"

/**
 * Diálogo del check-in semanal, montado una vez en AppShell. Consulta
 * GET /support/check-ins/current al abrir la app: el backend decide si toca
 * mostrarlo (viernes a domingo, una vez por semana, respetando "Ahora no").
 * No se vuelve a consultar en cada navegación (staleTime largo), y no se
 * abre si el usuario ya está en /soporte/check-in.
 */
// Esta línea sirve para declarar el aviso emergente del check-in semanal.
export function WeeklyCheckinPrompt() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para guardar si el usuario cerró el aviso.
  const [dismissed, setDismissed] = useState(false)
  // Esta línea sirve para guardar el resultado de la respuesta.
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null)

  // Esta línea sirve para obtener «data» con el hook «useQuery».
  const { data } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...SUPPORT_QUERY_KEYS.checkin, userId]».
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    // Esta línea sirve para pedir a la API el check-in actual.
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «!!userId».
    enabled: !!userId,
    // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «30 * 60_000».
    staleTime: 30 * 60_000,
    // Esta línea sirve para declarar la propiedad «refetchOnWindowFocus» con el valor o tipo «false».
    refetchOnWindowFocus: false,
  })

  // Esta línea sirve para obtener «postpone» con el hook «useMutation».
  const postpone = useMutation({
    // Esta línea sirve para enviar a la API que se pospone el check-in.
    mutationFn: () => api.post(`/support/check-ins/${data?.checkin?.id}/postpone`),
    // Esta línea sirve para declarar la propiedad «onSettled» con el valor o tipo «() => {».
    onSettled: () => {
      // Esta línea sirve para marcar el aviso como cerrado.
      setDismissed(true)
      // Esta línea sirve para refrescar el check-in actual.
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.checkin })
    },
  })

  // Esta línea sirve para calcular si el usuario ya está en la página del check-in.
  const onCheckinPage = location.pathname === "/soporte/check-in"
  // Esta línea sirve para calcular si el aviso debe mostrarse.
  const open = !dismissed && !onCheckinPage && ((!!data?.should_prompt && !!data.checkin) || !!result)

  // Esta línea sirve para declarar la función que cierra el aviso.
  const close = () => {
    // Esta línea sirve para marcar el aviso como cerrado.
    setDismissed(true)
    // Esta línea sirve para limpiar el resultado.
    setResult(null)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el modal que pospone el check-in al cerrarse sin responder.
    <Modal show={open} onHide={() => (result ? close() : postpone.mutate())} centered aria-labelledby="weekly-checkin-title">
      {/* Esta línea sirve para abrir el componente «Modal.Header». */}
      <Modal.Header closeButton>
        {/* Esta línea sirve para abrir el componente «Modal.Title». */}
        <Modal.Title id="weekly-checkin-title" as="h2" className="fs-5">
          {/* Esta línea sirve para mostrar el título del check-in. */}
          {t.checkinTitle} 💪
        </Modal.Title>
      </Modal.Header>
      {/* Esta línea sirve para abrir el componente «Modal.Body». */}
      <Modal.Body>
        {/* Esta línea sirve para elegir entre dos bloques según «result». */}
        {result ? (
          // Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-3».
          <div className="d-flex flex-column gap-3" role="status">
            {/* Esta línea sirve para mostrar el agradecimiento, con el número de ticket si se creó. */}
            <p className="mb-0">{result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}</p>
            {/* Esta línea sirve para abrir el componente «SankButton». */}
            <SankButton onClick={close} className="align-self-end">
              {/* Esta línea sirve para mostrar el valor «t.done». */}
              {t.done}
            </SankButton>
          </div>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar el formulario si hay un check-in disponible.
          data?.checkin && (
            // Esta línea sirve para abrir el elemento «WeeklyCheckinForm» con sus atributos en varias líneas.
            <WeeklyCheckinForm
              // Esta línea sirve para pasar la propiedad «checkin» con el valor «data.checkin}».
              checkin={data.checkin}
              // Esta línea sirve para asignar el manejador del evento «onDone».
              onDone={setResult}
              // Esta línea sirve para asignar el manejador del evento «onPostpone».
              onPostpone={() => postpone.mutate()}
              // Esta línea sirve para pasar la propiedad «isPostponing» con el valor «postpone.isPending}».
              isPostponing={postpone.isPending}
            />
          )
        )}
      </Modal.Body>
    </Modal>
  )
}
