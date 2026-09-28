import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Cookie, FileText, Trash2 } from "lucide-react"
import { formatLegalDate, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, type LegalConsentsResponse, type LegalDocumentId } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS } from "@/lib/legal-paths"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteAccountDialog } from "@/components/legal/DeleteAccountDialog"

/**
 * Sección de Configuración: acceso a los documentos, versión vigente vs.
 * versión que aceptó el usuario (según su historial en el backend) y botón
 * para cambiar las preferencias de cookies de este navegador.
 */
export function LegalSettingsCard() {
  const { t, locale } = useLegalStrings()
  const userId = useAuthStore((s) => s.user?.id)
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { data } = useQuery({
    queryKey: [...LEGAL_CONSENTS_QUERY_KEY, userId],
    queryFn: () => api.get<LegalConsentsResponse>("/legal/consents"),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  })

  // El historial viene del más reciente al más antiguo.
  const acceptedFor = (id: LegalDocumentId) =>
    id === "cookies" ? undefined : data?.history.find((record) => record.consent_type === id)

  return (
    <Card>
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-primary" aria-hidden="true" />
        <h2 className="font-heading text-sm font-medium text-foreground">{t.legalSectionTitle}</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t.legalSectionDescription}</p>

      <ul className="mt-3 flex list-none flex-col divide-y divide-border p-0">
        {LEGAL_DOCUMENT_IDS.map((id) => {
          const accepted = acceptedFor(id)
          return (
            <li key={id}>
              <Link
                to={LEGAL_PATHS[id]}
                className="flex items-center justify-between gap-3 py-2.5 text-sm text-foreground no-underline hover:text-primary"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{t.documentNames[id]}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.versionLine(LEGAL_DOCUMENTS[id].version, formatLegalDate(LEGAL_DOCUMENTS[id].updatedAt, locale))}
                    {accepted &&
                      ` · ${t.acceptedVersionLine(accepted.document_version, formatLegalDate(accepted.recorded_at, locale))}`}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>

      <Button variant="outline" size="sm" className="mt-3" onClick={openCookieSettings}>
        <Cookie aria-hidden="true" />
        {t.cookieSettingsTitle}
      </Button>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="fs-6 m-0 font-medium text-foreground">{t.deleteAccountTitle}</h3>
        <p className="mt-1 mb-0 text-xs text-muted-foreground">{t.deleteAccountDescription}</p>
        <Button variant="destructive" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
          <Trash2 aria-hidden="true" />
          {t.deleteAccountOpen}
        </Button>
      </div>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </Card>
  )
}
