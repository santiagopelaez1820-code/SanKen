import { useEffect, useState } from "react"
import { Alert, Modal } from "react-bootstrap"
import type { ConsentType, PendingConsent } from "@sanken/core"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { SankButton } from "@/components/ui/SankButton"
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"

interface SocialConsentDialogProps {
  pending: PendingConsent[] | null
  isSubmitting: boolean
  error: string | null
  onConfirm: (accepted: Partial<Record<ConsentType, boolean>>) => void
  onCancel: () => void
}

/**
 * Se abre cuando "Continuar con Google" crearía una cuenta NUEVA: la cuenta
 * no existe todavía y no se crea hasta que se marquen todas las casillas.
 */
export function SocialConsentDialog({ pending, isSubmitting, error, onConfirm, onCancel }: SocialConsentDialogProps) {
  const { t } = useLegalStrings()
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({})
  const consents = pending?.map((p) => p.type) ?? []
  const allChecked = consents.length > 0 && consents.every((type) => values[type])

  useEffect(() => {
    if (pending) setValues({})
  }, [pending])

  return (
    <Modal show={!!pending} onHide={onCancel} centered aria-labelledby="social-consent-title">
      <Modal.Header closeButton>
        <Modal.Title id="social-consent-title" as="h2" className="fs-5">
          {t.socialConsentTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <p className="small text-body-secondary mb-0">{t.socialConsentDescription}</p>
        <ConsentCheckboxes
          idPrefix="social-consent"
          consents={consents}
          values={values}
          disabled={isSubmitting}
          onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
        />
        {error && (
          <Alert variant="danger" className="py-2 small mb-0">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <SankButton variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t.cancel}
        </SankButton>
        <SankButton onClick={() => onConfirm(values)} disabled={!allChecked || isSubmitting} loading={isSubmitting}>
          {t.socialConsentConfirm}
        </SankButton>
      </Modal.Footer>
    </Modal>
  )
}
