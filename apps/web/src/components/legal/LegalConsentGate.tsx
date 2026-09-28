import { useState, type ReactNode } from "react"
import { Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ApiError,
  CONSENT_DOCUMENT,
  currentConsentVersions,
  LEGAL_DOCUMENTS,
  type ConsentType,
  type LegalConsentsResponse,
  type PendingConsent,
  type User,
} from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS } from "@/lib/legal-paths"
import { useLogout } from "@/hooks/use-logout"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { SankButton } from "@/components/ui/SankButton"
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"
import { DeleteAccountDialog } from "@/components/legal/DeleteAccountDialog"


/**
 * Re-aceptación: si el backend dice que al usuario le falta aceptar la
 * versión vigente de algún documento (nunca lo aceptó — cuenta previa a
 * este sistema — o se publicó una versión nueva), se muestra esta pantalla
 * en lugar de la app hasta que acepte o cierre sesión.
 *
 * La fuente de verdad es GET /legal/consents; mientras carga se usa
 * `user.pending_consents` de la respuesta de login para no mostrar la app
 * ni un instante si ya se sabe que hay pendientes. Si ninguno está
 * disponible todavía, no se bloquea (no se hace esperar al usuario por red).
 *
 * Si en medio de la sesión el backend responde 403 consent_required (versión
 * nueva publicada), lib/api.ts marca `user.pending_consents` y esta pantalla
 * aparece aunque el caché de /legal/consents todavía diga "nada pendiente".
 * El propio backend bloquea igual toda ruta mientras tanto
 * (EnsureLegalConsentsAccepted) — esto es solo la cara visible.
 */
export function LegalConsentGate({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const { data } = useQuery({
    // Incluye el id: otra cuenta en el mismo navegador no reutiliza este caché.
    queryKey: [...LEGAL_CONSENTS_QUERY_KEY, user?.id],
    enabled: !!user,
    queryFn: () => api.get<LegalConsentsResponse>("/legal/consents"),
    staleTime: 5 * 60_000,
  })

  const fromUser: PendingConsent[] = (user?.pending_consents ?? []).map((type) => ({
    type,
    document: CONSENT_DOCUMENT[type],
    version: LEGAL_DOCUMENTS[CONSENT_DOCUMENT[type]].version,
    accepted_version: null,
  }))
  const pending: PendingConsent[] = data?.pending.length ? data.pending : fromUser

  if (pending.length === 0) return children

  return <ReacceptanceScreen pending={pending} />
}

function ReacceptanceScreen({ pending }: { pending: PendingConsent[] }) {
  const { t } = useLegalStrings()
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useLogout()
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({})
  const [deleteOpen, setDeleteOpen] = useState(false)
  const types = pending.map((p) => p.type)
  const allChecked = types.every((type) => values[type])
  const documents = [...new Map(pending.map((p) => [p.document, p])).values()]

  const mutation = useMutation({
    mutationFn: () =>
      api.post<{ pending: PendingConsent[]; user: User }>("/legal/consents", {
        consents: types,
        legal_versions: currentConsentVersions(types),
      }),
    onSuccess: (response) => {
      setUser(response.user)
      // Se aplica ya el nuevo `pending` (vacío) para salir de esta pantalla
      // sin esperar al refetch; el historial se actualiza con la invalidación.
      queryClient.setQueryData<LegalConsentsResponse>([...LEGAL_CONSENTS_QUERY_KEY, response.user.id], (old) =>
        old ? { ...old, pending: response.pending } : old
      )
      queryClient.invalidateQueries({ queryKey: LEGAL_CONSENTS_QUERY_KEY })
    },
  })

  const errorMessage = mutation.error
    ? mutation.error instanceof ApiError
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      : t.reacceptError
    : null

  return (
    <AuthLayout>
      <form
        className="d-flex flex-column gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (allChecked) mutation.mutate()
        }}
      >
        <div>
          <h1 className="fs-5 fw-semibold mb-1">{t.reacceptTitle}</h1>
          <p className="small text-body-secondary mb-0">{t.reacceptDescription}</p>
        </div>

        <ul className="list-unstyled d-flex flex-column gap-1 small mb-0">
          {documents.map((p) => (
            <li key={p.document}>
              <Link to={LEGAL_PATHS[p.document]} target="_blank" rel="noopener" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
                {t.documentNames[p.document]}
              </Link>{" "}
              <span className="text-body-secondary">
                · {p.accepted_version ? t.reacceptUpdatedDocument(p.accepted_version, p.version) : t.reacceptNewDocument(p.version)}
              </span>
            </li>
          ))}
        </ul>

        <ConsentCheckboxes
          idPrefix="reaccept"
          consents={types}
          values={values}
          disabled={mutation.isPending}
          onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
        />

        {errorMessage && (
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {errorMessage}
          </Alert>
        )}

        <SankButton type="submit" disabled={!allChecked || mutation.isPending} loading={mutation.isPending} className="w-100 justify-content-center">
          {t.reacceptConfirm}
        </SankButton>
        <SankButton type="button" variant="ghost" onClick={logout} className="w-100 justify-content-center">
          {t.reacceptLogout}
        </SankButton>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="btn btn-link small text-danger p-0 align-self-center"
        >
          {t.deleteAccountFromReaccept}
        </button>
      </form>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </AuthLayout>
  )
}
