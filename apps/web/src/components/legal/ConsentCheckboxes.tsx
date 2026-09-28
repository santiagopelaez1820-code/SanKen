import { Form } from "react-bootstrap"
import type { ConsentType } from "@sanken/core"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_PATHS } from "@/lib/legal-paths"

interface ConsentCheckboxesProps {
  consents: ConsentType[]
  values: Partial<Record<ConsentType, boolean>>
  onChange: (type: ConsentType, checked: boolean) => void
  errors?: Partial<Record<ConsentType, string | undefined>>
  disabled?: boolean
  /** Prefijo de ids — evita colisiones si hay dos grupos en la misma página. */
  idPrefix?: string
}

/**
 * Una casilla por consentimiento (nunca una sola genérica). Los enlaces a
 * los documentos abren en pestaña nueva para no perder lo ya escrito en el
 * formulario. Usado por el registro, el diálogo de Google y la re-aceptación.
 */
export function ConsentCheckboxes({ consents, values, onChange, errors, disabled, idPrefix = "consent" }: ConsentCheckboxesProps) {
  const { t } = useLegalStrings()

  return (
    <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
      {consents.map((type) => {
        const label = t.consentLabels[type]
        const id = `${idPrefix}-${type}`
        const error = errors?.[type]
        return (
          <Form.Check key={type} id={id} className="small">
            <Form.Check.Input
              type="checkbox"
              checked={values[type] === true}
              disabled={disabled}
              isInvalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => onChange(type, event.target.checked)}
            />
            <Form.Check.Label>
              {label.before}
              <a
                href={LEGAL_PATHS[label.document]}
                target="_blank"
                rel="noopener"
                className="fw-medium"
                style={{ color: "var(--sanken-cyan-light)" }}
              >
                {label.link}
                <span className="visually-hidden"> {t.opensInNewTab}</span>
              </a>
              {label.after}
            </Form.Check.Label>
            {error && (
              <Form.Control.Feedback type="invalid" id={`${id}-error`}>
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Check>
        )
      })}
    </fieldset>
  )
}
