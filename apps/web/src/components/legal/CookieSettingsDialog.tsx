// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «Form, Modal» desde «react-bootstrap».
import { Form, Modal } from "react-bootstrap"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «formatLegalDate» desde «@sanken/core».
import { formatLegalDate } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_PATHS } from "@/lib/legal-paths"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"

/**
 * Panel de preferencias de cookies. Solo lista categorías con tecnologías
 * reales detrás: Necesarias (siempre activas) y Preferencias. Se abre desde
 * el banner, el pie de página, la Política de Cookies y Configuración.
 */
// Esta línea sirve para declarar el componente del diálogo de configuración de cookies.
export function CookieSettingsDialog() {
  // Esta línea sirve para obtener «t, locale» con el hook «useLegalStrings».
  const { t, locale } = useLegalStrings()
  // Esta línea sirve para obtener «open» con el hook «useCookieConsentStore».
  const open = useCookieConsentStore((s) => s.settingsOpen)
  // Esta línea sirve para obtener «consent» con el hook «useCookieConsentStore».
  const consent = useCookieConsentStore((s) => s.consent)
  // Esta línea sirve para obtener «save» con el hook «useCookieConsentStore».
  const save = useCookieConsentStore((s) => s.save)
  // Esta línea sirve para obtener «acceptAll» con el hook «useCookieConsentStore».
  const acceptAll = useCookieConsentStore((s) => s.acceptAll)
  // Esta línea sirve para obtener «close» con el hook «useCookieConsentStore».
  const close = useCookieConsentStore((s) => s.closeSettings)
  // Esta línea sirve para guardar la elección de preferencias.
  const [preferences, setPreferences] = useState(consent?.categories.preferences ?? false)

  // Cada vez que se abre, parte de la elección guardada (no de un borrador anterior).
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para sincronizar la elección con el consentimiento guardado al abrir.
    if (open) setPreferences(consent?.categories.preferences ?? false)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian el diálogo o el consentimiento.
  }, [open, consent])

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal show={open} onHide={close} centered aria-labelledby="cookie-settings-title">
      {/* Esta línea sirve para abrir el componente «Modal.Header». */}
      <Modal.Header closeButton>
        {/* Esta línea sirve para abrir el componente «Modal.Title». */}
        <Modal.Title id="cookie-settings-title" as="h2" className="fs-5">
          {/* Esta línea sirve para mostrar el valor «t.cookieSettingsTitle». */}
          {t.cookieSettingsTitle}
        </Modal.Title>
      </Modal.Header>
      {/* Esta línea sirve para abrir el componente «Modal.Body». */}
      <Modal.Body className="d-flex flex-column gap-3">
        {/* Esta línea sirve para mostrar la descripción del diálogo. */}
        <p className="small text-body-secondary mb-0">{t.cookieSettingsDescription}</p>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-1 rounded-3 borde». */}
        <div className="d-flex flex-column gap-1 rounded-3 border p-3">
          {/* Esta línea sirve para abrir el interruptor de cookies necesarias. */}
          <Form.Check
            // Esta línea sirve para definir el atributo «type» con el valor «switch».
            type="switch"
            // Esta línea sirve para definir el atributo «id» con el valor «cookie-category-necessary».
            id="cookie-category-necessary"
            // Esta línea sirve para definir el atributo «role» con el valor «switch».
            role="switch"
            // Esta línea sirve para pasar la propiedad «label» con el valor «<span className="fw-medium">{t.cookieNecessar».
            label={<span className="fw-medium">{t.cookieNecessaryLabel}</span>}
            // Esta línea sirve para marcarlo como activado.
            checked
            // Esta línea sirve para deshabilitarlo porque son obligatorias.
            disabled
            // Esta línea sirve para definir el atributo «aria-describedby» con el valor «cookie-category-necessary-desc».
            aria-describedby="cookie-category-necessary-desc"
          />
          {/* Esta línea sirve para abrir el elemento «p». */}
          <p id="cookie-category-necessary-desc" className="small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar la descripción de las necesarias y el aviso de siempre activas. */}
            {t.cookieNecessaryDescription} <span className="fw-medium">{t.cookieAlwaysActive}.</span>
          </p>
        </div>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-1 rounded-3 borde». */}
        <div className="d-flex flex-column gap-1 rounded-3 border p-3">
          {/* Esta línea sirve para abrir el interruptor de preferencias. */}
          <Form.Check
            // Esta línea sirve para definir el atributo «type» con el valor «switch».
            type="switch"
            // Esta línea sirve para definir el atributo «id» con el valor «cookie-category-preferences».
            id="cookie-category-preferences"
            // Esta línea sirve para definir el atributo «role» con el valor «switch».
            role="switch"
            // Esta línea sirve para pasar la propiedad «label» con el valor «<span className="fw-medium">{t.cookiePreferen».
            label={<span className="fw-medium">{t.cookiePreferencesLabel}</span>}
            // Esta línea sirve para pasar la propiedad «checked» con el valor «preferences}».
            checked={preferences}
            // Esta línea sirve para asignar el manejador del evento «onChange».
            onChange={(event) => setPreferences(event.target.checked)}
            // Esta línea sirve para definir el atributo «aria-describedby» con el valor «cookie-category-preferences-desc».
            aria-describedby="cookie-category-preferences-desc"
          />
          {/* Esta línea sirve para abrir el elemento «p». */}
          <p id="cookie-category-preferences-desc" className="small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar el valor «t.cookiePreferencesDescription». */}
            {t.cookiePreferencesDescription}
          </p>
        </div>

        {/* Esta línea sirve para mostrar la nota de que no se usan cookies analíticas. */}
        <p className="small text-body-secondary mb-0">{t.cookieNoTrackingNote}</p>

        {/* Esta línea sirve para mostrar el bloque solo si «consent». */}
        {consent && (
          // Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0».
          <p className="small text-body-secondary mb-0" aria-live="polite">
            {/* Esta línea sirve para mostrar la elección actual con su fecha. */}
            {t.cookieCurrentChoice(consent.categories.preferences, formatLegalDate(consent.decidedAt, locale))}
          </p>
        )}

        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to={LEGAL_PATHS.cookies} onClick={close} className="small fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
          {/* Esta línea sirve para mostrar el valor «t.documentNames.cookies». */}
          {t.documentNames.cookies}
        </Link>
      </Modal.Body>
      {/* Esta línea sirve para abrir el componente «Modal.Footer». */}
      <Modal.Footer className="gap-2">
        {/* Esta línea sirve para abrir el botón que guarda la elección. */}
        <SankButton variant="outline" onClick={() => save(preferences)}>
          {/* Esta línea sirve para mostrar el valor «t.cookieSave». */}
          {t.cookieSave}
        </SankButton>
        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton variant="primary" onClick={acceptAll}>
          {/* Esta línea sirve para mostrar el valor «t.cookieAcceptAll». */}
          {t.cookieAcceptAll}
        </SankButton>
      </Modal.Footer>
    </Modal>
  )
}
