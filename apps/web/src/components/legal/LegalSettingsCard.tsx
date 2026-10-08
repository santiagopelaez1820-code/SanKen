// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «ChevronRight, Cookie, FileText, Trash2» desde «lucide-react».
import { ChevronRight, Cookie, FileText, Trash2 } from "lucide-react"
// Esta línea sirve para importar las utilidades y tipos de los documentos legales.
import { formatLegalDate, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, type LegalConsentsResponse, type LegalDocumentId } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS } from "@/lib/legal-paths"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «DeleteAccountDialog» desde «@/components/legal/DeleteAccountDialog».
import { DeleteAccountDialog } from "@/components/legal/DeleteAccountDialog"

/**
 * Sección de Configuración: acceso a los documentos, versión vigente vs.
 * versión que aceptó el usuario (según su historial en el backend) y botón
 * para cambiar las preferencias de cookies de este navegador.
 */
// Esta línea sirve para declarar la tarjeta de privacidad y documentos legales.
export function LegalSettingsCard() {
  // Esta línea sirve para obtener «t, locale» con el hook «useLegalStrings».
  const { t, locale } = useLegalStrings()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para obtener «openCookieSettings» con el hook «useCookieConsentStore».
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)
  // Esta línea sirve para guardar si el diálogo de eliminar cuenta está abierto.
  const [deleteOpen, setDeleteOpen] = useState(false)
  // Esta línea sirve para obtener «data» con el hook «useQuery».
  const { data } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...LEGAL_CONSENTS_QUERY_KEY, userId]».
    queryKey: [...LEGAL_CONSENTS_QUERY_KEY, userId],
    // Esta línea sirve para pedir a la API los consentimientos aceptados.
    queryFn: () => api.get<LegalConsentsResponse>("/legal/consents"),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «!!userId».
    enabled: !!userId,
    // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «5 * 60_000».
    staleTime: 5 * 60_000,
  })

  // El historial viene del más reciente al más antiguo.
  // Esta línea sirve para declarar la función que busca el registro aceptado de un documento.
  const acceptedFor = (id: LegalDocumentId) =>
    // Esta línea sirve para devolver undefined para cookies o el registro del historial.
    id === "cookies" ? undefined : data?.history.find((record) => record.consent_type === id)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Card».
    <Card>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
      <div className="flex items-center gap-2">
        {/* Esta línea sirve para abrir el componente «FileText». */}
        <FileText className="size-4 text-primary" aria-hidden="true" />
        {/* Esta línea sirve para mostrar el título de la sección. */}
        <h2 className="font-heading text-sm font-medium text-foreground">{t.legalSectionTitle}</h2>
      </div>
      {/* Esta línea sirve para mostrar la descripción de la sección. */}
      <p className="mt-1 text-xs text-muted-foreground">{t.legalSectionDescription}</p>

      {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-3 flex list-none flex-col divide-y di». */}
      <ul className="mt-3 flex list-none flex-col divide-y divide-border p-0">
        {/* Esta línea sirve para recorrer los documentos legales. */}
        {LEGAL_DOCUMENT_IDS.map((id) => {
          // Esta línea sirve para buscar el registro aceptado del documento.
          const accepted = acceptedFor(id)
          // Esta línea sirve para devolver la interfaz del componente.
          return (
            // Esta línea sirve para abrir el elemento «li».
            <li key={id}>
              {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
              <Link
                // Esta línea sirve para pasar la propiedad «to» con el valor «LEGAL_PATHS[id]}».
                to={LEGAL_PATHS[id]}
                // Esta línea sirve para aplicar las clases de estilo «flex items-center justify-between gap-3 py-2.».
                className="flex items-center justify-between gap-3 py-2.5 text-sm text-foreground no-underline hover:text-primary"
              >
                {/* Esta línea sirve para abrir el elemento «span» con las clases «flex flex-col». */}
                <span className="flex flex-col">
                  {/* Esta línea sirve para mostrar el nombre del documento. */}
                  <span className="font-medium">{t.documentNames[id]}</span>
                  {/* Esta línea sirve para abrir el elemento «span» con las clases «text-xs text-muted-foreground». */}
                  <span className="text-xs text-muted-foreground">
                    {/* Esta línea sirve para mostrar la versión vigente y su fecha. */}
                    {t.versionLine(LEGAL_DOCUMENTS[id].version, formatLegalDate(LEGAL_DOCUMENTS[id].updatedAt, locale))}
                    {/* Esta línea sirve para mostrar la versión aceptada si existe. */}
                    {accepted &&
                      // Esta línea sirve para formatear la versión y la fecha de aceptación.
                      ` · ${t.acceptedVersionLine(accepted.document_version, formatLegalDate(accepted.recorded_at, locale))}`}
                  </span>
                </span>
                {/* Esta línea sirve para abrir el componente «ChevronRight». */}
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Esta línea sirve para abrir el componente «Button». */}
      <Button variant="outline" size="sm" className="mt-3" onClick={openCookieSettings}>
        {/* Esta línea sirve para abrir el componente «Cookie». */}
        <Cookie aria-hidden="true" />
        {/* Esta línea sirve para mostrar el valor «t.cookieSettingsTitle». */}
        {t.cookieSettingsTitle}
      </Button>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4 border-t border-border pt-4». */}
      <div className="mt-4 border-t border-border pt-4">
        {/* Esta línea sirve para mostrar el título de eliminar la cuenta. */}
        <h3 className="fs-6 m-0 font-medium text-foreground">{t.deleteAccountTitle}</h3>
        {/* Esta línea sirve para mostrar la descripción de eliminar la cuenta. */}
        <p className="mt-1 mb-0 text-xs text-muted-foreground">{t.deleteAccountDescription}</p>
        {/* Esta línea sirve para abrir el botón que abre el diálogo de eliminación. */}
        <Button variant="destructive" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
          {/* Esta línea sirve para abrir el componente «Trash2». */}
          <Trash2 aria-hidden="true" />
          {/* Esta línea sirve para mostrar el valor «t.deleteAccountOpen». */}
          {t.deleteAccountOpen}
        </Button>
      </div>
      {/* Esta línea sirve para mostrar el componente «DeleteAccountDialog». */}
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </Card>
  )
}
