// Esta línea sirve para importar «Form» desde «react-bootstrap».
import { Form } from "react-bootstrap"
// Esta línea sirve para importar los tipos «ConsentType» desde «@sanken/core».
import type { ConsentType } from "@sanken/core"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_PATHS } from "@/lib/legal-paths"

// Esta línea sirve para declarar la interfaz «ConsentCheckboxesProps».
interface ConsentCheckboxesProps {
  // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «ConsentType[]».
  consents: ConsentType[]
  // Esta línea sirve para declarar la propiedad «values» con el valor o tipo «Partial<Record<ConsentType, boolean>>».
  values: Partial<Record<ConsentType, boolean>>
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(type: ConsentType, checked: boolean) => void».
  onChange: (type: ConsentType, checked: boolean) => void
  // Esta línea sirve para declarar el campo de errores por tipo de consentimiento.
  errors?: Partial<Record<ConsentType, string | undefined>>
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «boolean».
  disabled?: boolean
  /** Prefijo de ids — evita colisiones si hay dos grupos en la misma página. */
  // Esta línea sirve para declarar la propiedad «idPrefix» con el valor o tipo «string».
  idPrefix?: string
}

/**
 * Una casilla por consentimiento (nunca una sola genérica). Los enlaces a
 * los documentos abren en pestaña nueva para no perder lo ya escrito en el
 * formulario. Usado por el registro, el diálogo de Google y la re-aceptación.
 */
// Esta línea sirve para declarar el componente de las casillas de consentimiento.
export function ConsentCheckboxes({ consents, values, onChange, errors, disabled, idPrefix = "consent" }: ConsentCheckboxesProps) {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «fieldset» con las clases «d-flex flex-column gap-2 border-0 p-0 m-».
    <fieldset className="d-flex flex-column gap-2 border-0 p-0 m-0">
      {/* Esta línea sirve para recorrer cada tipo de consentimiento. */}
      {consents.map((type) => {
        // Esta línea sirve para obtener el texto del consentimiento.
        const label = t.consentLabels[type]
        // Esta línea sirve para construir el id único de la casilla.
        const id = `${idPrefix}-${type}`
        // Esta línea sirve para obtener el error de ese consentimiento.
        const error = errors?.[type]
        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el componente «Form.Check».
          <Form.Check key={type} id={id} className="small">
            {/* Esta línea sirve para abrir la casilla de verificación. */}
            <Form.Check.Input
              // Esta línea sirve para definir el atributo «type» con el valor «checkbox».
              type="checkbox"
              // Esta línea sirve para pasar la propiedad «checked» con el valor «values[type] === true}».
              checked={values[type] === true}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled}».
              disabled={disabled}
              // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!error}».
              isInvalid={!!error}
              // Esta línea sirve para pasar la propiedad «aria-describedby» con el valor «error ? `${id}-error` : undefined}».
              aria-describedby={error ? `${id}-error` : undefined}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(event) => onChange(type, event.target.checked)}
            />
            {/* Esta línea sirve para abrir el componente «Form.Check.Label». */}
            <Form.Check.Label>
              {/* Esta línea sirve para mostrar el valor «label.before». */}
              {label.before}
              {/* Esta línea sirve para abrir el elemento «a» con sus atributos en varias líneas. */}
              <a
                // Esta línea sirve para pasar la propiedad «href» con el valor «LEGAL_PATHS[label.document]}».
                href={LEGAL_PATHS[label.document]}
                // Esta línea sirve para definir el atributo «target» con el valor «_blank».
                target="_blank"
                // Esta línea sirve para definir el atributo «rel» con el valor «noopener».
                rel="noopener"
                // Esta línea sirve para aplicar las clases de estilo «fw-medium».
                className="fw-medium"
                // Esta línea sirve para pasar la propiedad «style» con el valor «{ color: "var(--sanken-cyan-light)" }}».
                style={{ color: "var(--sanken-cyan-light)" }}
              >
                {/* Esta línea sirve para mostrar el valor «label.link». */}
                {label.link}
                {/* Esta línea sirve para mostrar el aviso accesible de que el enlace abre una pestaña nueva. */}
                <span className="visually-hidden"> {t.opensInNewTab}</span>
              </a>
              {/* Esta línea sirve para mostrar el valor «label.after». */}
              {label.after}
            </Form.Check.Label>
            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «Form.Control.Feedback».
              <Form.Control.Feedback type="invalid" id={`${id}-error`}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Check>
        )
      })}
    </fieldset>
  )
}
