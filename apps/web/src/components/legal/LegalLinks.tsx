import { Link } from "react-router-dom"
import { LEGAL_DOCUMENT_IDS } from "@sanken/core"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_PATHS } from "@/lib/legal-paths"
import { cn } from "@/lib/utils"

/**
 * Enlaces a los documentos legales + "Configurar cookies". Un solo
 * componente para el pie de la app, el de las pantallas de auth y el de las
 * páginas legales.
 */
export function LegalLinks({ className }: { className?: string }) {
  const { t } = useLegalStrings()
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)

  return (
    <nav aria-label={t.legalSectionTitle} className={cn("text-xs text-muted-foreground", className)}>
      <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-4 p-0">
        {LEGAL_DOCUMENT_IDS.map((id) => (
          <li key={id}>
            <Link to={LEGAL_PATHS[id]} className="inline-block py-1.5 underline-offset-4 hover:underline" style={{ color: "inherit" }}>
              {t.documentNames[id]}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={openCookieSettings}
            className="border-0 bg-transparent px-0 py-1.5 underline-offset-4 hover:underline"
            style={{ color: "inherit" }}
          >
            {t.cookieSettingsTitle}
          </button>
        </li>
      </ul>
    </nav>
  )
}
