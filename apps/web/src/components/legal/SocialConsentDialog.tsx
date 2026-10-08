// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «Alert, Modal» desde «react-bootstrap».
import { Alert, Modal } from "react-bootstrap"
// Esta línea sirve para importar los tipos «ConsentType, PendingConsent» desde «@sanken/core».
import type { ConsentType, PendingConsent } from "@sanken/core"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/ConsentCheckboxes».
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"

// Esta línea sirve para declarar la interfaz «SocialConsentDialogProps».
interface SocialConsentDialogProps {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «PendingConsent[] | null».
  pending: PendingConsent[] | null
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null
  // Esta línea sirve para declarar la función que recibe lo aceptado.
  onConfirm: (accepted: Partial<Record<ConsentType, boolean>>) => void
  // Esta línea sirve para declarar la propiedad «onCancel» con el valor o tipo «() => void».
  onCancel: () => void
}

/**
 * Se abre cuando "Continuar con Google" crearía una cuenta NUEVA: la cuenta
 * no existe todavía y no se crea hasta que se marquen todas las casillas.
 */
// Esta línea sirve para declarar el diálogo de consentimientos para el registro con Google.
export function SocialConsentDialog({ pending, isSubmitting, error, onConfirm, onCancel }: SocialConsentDialogProps) {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()
  // Esta línea sirve para guardar las casillas marcadas.
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({})
  // Esta línea sirve para obtener los tipos de consentimiento pendientes.
  const consents = pending?.map((p) => p.type) ?? []
  // Esta línea sirve para calcular si todas las casillas están marcadas.
  const allChecked = consents.length > 0 && consents.every((type) => values[type])

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para limpiar las casillas cuando llegan nuevos pendientes.
    if (pending) setValues({})
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian los pendientes.
  }, [pending])

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal show={!!pending} onHide={onCancel} centered aria-labelledby="social-consent-title">
      {/* Esta línea sirve para abrir el componente «Modal.Header». */}
      <Modal.Header closeButton>
        {/* Esta línea sirve para abrir el componente «Modal.Title». */}
        <Modal.Title id="social-consent-title" as="h2" className="fs-5">
          {/* Esta línea sirve para mostrar el valor «t.socialConsentTitle». */}
          {t.socialConsentTitle}
        </Modal.Title>
      </Modal.Header>
      {/* Esta línea sirve para abrir el componente «Modal.Body». */}
      <Modal.Body className="d-flex flex-column gap-3">
        {/* Esta línea sirve para mostrar la descripción del diálogo. */}
        <p className="small text-body-secondary mb-0">{t.socialConsentDescription}</p>
        {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
        <ConsentCheckboxes
          // Esta línea sirve para definir el atributo «idPrefix» con el valor «social-consent».
          idPrefix="social-consent"
          // Esta línea sirve para pasar la propiedad «consents» con el valor «consents}».
          consents={consents}
          // Esta línea sirve para pasar la propiedad «values» con el valor «values}».
          values={values}
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSubmitting}».
          disabled={isSubmitting}
          // Esta línea sirve para asignar el manejador del evento «onChange».
          onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
        />
        {/* Esta línea sirve para mostrar el bloque solo si «error». */}
        {error && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0">
            {/* Esta línea sirve para mostrar el valor «error». */}
            {error}
          </Alert>
        )}
      </Modal.Body>
      {/* Esta línea sirve para abrir el componente «Modal.Footer». */}
      <Modal.Footer>
        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {/* Esta línea sirve para mostrar el valor «t.cancel». */}
          {t.cancel}
        </SankButton>
        {/* Esta línea sirve para abrir el botón que confirma, deshabilitado hasta marcar todo. */}
        <SankButton onClick={() => onConfirm(values)} disabled={!allChecked || isSubmitting} loading={isSubmitting}>
          {/* Esta línea sirve para mostrar el valor «t.socialConsentConfirm». */}
          {t.socialConsentConfirm}
        </SankButton>
      </Modal.Footer>
    </Modal>
  )
}
