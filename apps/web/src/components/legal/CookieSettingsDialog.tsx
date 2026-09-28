import { useEffect, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { formatLegalDate } from "@sanken/core"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_PATHS } from "@/lib/legal-paths"
import { SankButton } from "@/components/ui/SankButton"

/**
 * Panel de preferencias de cookies. Solo lista categorías con tecnologías
 * reales detrás: Necesarias (siempre activas) y Preferencias. Se abre desde
 * el banner, el pie de página, la Política de Cookies y Configuración.
 */
export function CookieSettingsDialog() {
  const { t, locale } = useLegalStrings()
  const open = useCookieConsentStore((s) => s.settingsOpen)
  const consent = useCookieConsentStore((s) => s.consent)
  const save = useCookieConsentStore((s) => s.save)
  const acceptAll = useCookieConsentStore((s) => s.acceptAll)
  const close = useCookieConsentStore((s) => s.closeSettings)
  const [preferences, setPreferences] = useState(consent?.categories.preferences ?? false)

  // Cada vez que se abre, parte de la elección guardada (no de un borrador anterior).
  useEffect(() => {
    if (open) setPreferences(consent?.categories.preferences ?? false)
  }, [open, consent])

  return (
    <Modal show={open} onHide={close} centered aria-labelledby="cookie-settings-title">
      <Modal.Header closeButton>
        <Modal.Title id="cookie-settings-title" as="h2" className="fs-5">
          {t.cookieSettingsTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <p className="small text-body-secondary mb-0">{t.cookieSettingsDescription}</p>

        <div className="d-flex flex-column gap-1 rounded-3 border p-3">
          <Form.Check
            type="switch"
            id="cookie-category-necessary"
            role="switch"
            label={<span className="fw-medium">{t.cookieNecessaryLabel}</span>}
            checked
            disabled
            aria-describedby="cookie-category-necessary-desc"
          />
          <p id="cookie-category-necessary-desc" className="small text-body-secondary mb-0">
            {t.cookieNecessaryDescription} <span className="fw-medium">{t.cookieAlwaysActive}.</span>
          </p>
        </div>

        <div className="d-flex flex-column gap-1 rounded-3 border p-3">
          <Form.Check
            type="switch"
            id="cookie-category-preferences"
            role="switch"
            label={<span className="fw-medium">{t.cookiePreferencesLabel}</span>}
            checked={preferences}
            onChange={(event) => setPreferences(event.target.checked)}
            aria-describedby="cookie-category-preferences-desc"
          />
          <p id="cookie-category-preferences-desc" className="small text-body-secondary mb-0">
            {t.cookiePreferencesDescription}
          </p>
        </div>

        <p className="small text-body-secondary mb-0">{t.cookieNoTrackingNote}</p>

        {consent && (
          <p className="small text-body-secondary mb-0" aria-live="polite">
            {t.cookieCurrentChoice(consent.categories.preferences, formatLegalDate(consent.decidedAt, locale))}
          </p>
        )}

        <Link to={LEGAL_PATHS.cookies} onClick={close} className="small fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
          {t.documentNames.cookies}
        </Link>
      </Modal.Body>
      <Modal.Footer className="gap-2">
        <SankButton variant="outline" onClick={() => save(preferences)}>
          {t.cookieSave}
        </SankButton>
        <SankButton variant="primary" onClick={acceptAll}>
          {t.cookieAcceptAll}
        </SankButton>
      </Modal.Footer>
    </Modal>
  )
}
