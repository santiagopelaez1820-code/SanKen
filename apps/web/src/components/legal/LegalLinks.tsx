// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «LEGAL_DOCUMENT_IDS» desde «@sanken/core».
import { LEGAL_DOCUMENT_IDS } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_PATHS } from "@/lib/legal-paths"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

/**
 * Enlaces a los documentos legales + "Configurar cookies". Un solo
 * componente para el pie de la app, el de las pantallas de auth y el de las
 * páginas legales.
 */
// Esta línea sirve para declarar el componente con los enlaces a los documentos legales.
export function LegalLinks({ className }: { className?: string }) {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()
  // Esta línea sirve para obtener «openCookieSettings» con el hook «useCookieConsentStore».
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «nav».
    <nav aria-label={t.legalSectionTitle} className={cn("text-xs text-muted-foreground", className)}>
      {/* Esta línea sirve para abrir el elemento «ul» con las clases «m-0 flex list-none flex-wrap items-cente». */}
      <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-4 p-0">
        {/* Esta línea sirve para recorrer «LEGAL_DOCUMENT_IDS» y mostrar un bloque por elemento. */}
        {LEGAL_DOCUMENT_IDS.map((id) => (
          // Esta línea sirve para abrir el elemento «li».
          <li key={id}>
            {/* Esta línea sirve para abrir el componente «Link». */}
            <Link to={LEGAL_PATHS[id]} className="inline-block py-1.5 underline-offset-4 hover:underline" style={{ color: "inherit" }}>
              {/* Esta línea sirve para mostrar el nombre del documento. */}
              {t.documentNames[id]}
            </Link>
          </li>
        ))}
        {/* Esta línea sirve para abrir el elemento «li». */}
        <li>
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={openCookieSettings}
            // Esta línea sirve para aplicar las clases de estilo «border-0 bg-transparent px-0 py-1.5 underline».
            className="border-0 bg-transparent px-0 py-1.5 underline-offset-4 hover:underline"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ color: "inherit" }}».
            style={{ color: "inherit" }}
          >
            {/* Esta línea sirve para mostrar el valor «t.cookieSettingsTitle». */}
            {t.cookieSettingsTitle}
          </button>
        </li>
      </ul>
    </nav>
  )
}
