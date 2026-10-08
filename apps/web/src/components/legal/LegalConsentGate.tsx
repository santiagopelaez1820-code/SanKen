// Esta línea sirve para importar «useState, type ReactNode» desde «react».
import { useState, type ReactNode } from "react"
// Esta línea sirve para importar «Alert» desde «react-bootstrap».
import { Alert } from "react-bootstrap"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de utilidades y tipos de núcleo.
import {
  // Esta línea sirve para importar ApiError.
  ApiError,
  // Esta línea sirve para importar CONSENT_DOCUMENT.
  CONSENT_DOCUMENT,
  // Esta línea sirve para importar currentConsentVersions.
  currentConsentVersions,
  // Esta línea sirve para importar LEGAL_DOCUMENTS.
  LEGAL_DOCUMENTS,
  // Esta línea sirve para importar ConsentType.
  type ConsentType,
  // Esta línea sirve para importar LegalConsentsResponse.
  type LegalConsentsResponse,
  // Esta línea sirve para importar PendingConsent.
  type PendingConsent,
  // Esta línea sirve para importar User.
  type User,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_CONSENTS_QUERY_KEY, LEGAL_PATHS } from "@/lib/legal-paths"
// Esta línea sirve para importar «useLogout» desde «@/hooks/use-logout».
import { useLogout } from "@/hooks/use-logout"
// Esta línea sirve para importar «AuthLayout» desde «@/components/layout/AuthLayout».
import { AuthLayout } from "@/components/layout/AuthLayout"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/ConsentCheckboxes».
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"
// Esta línea sirve para importar «DeleteAccountDialog» desde «@/components/legal/DeleteAccountDialog».
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
// Esta línea sirve para declarar el componente que bloquea la app hasta aceptar los documentos.
export function LegalConsentGate({ children }: { children: ReactNode }) {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user)
  // Esta línea sirve para obtener «data» con el hook «useQuery».
  const { data } = useQuery({
    // Incluye el id: otra cuenta en el mismo navegador no reutiliza este caché.
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...LEGAL_CONSENTS_QUERY_KEY, user?.id]».
    queryKey: [...LEGAL_CONSENTS_QUERY_KEY, user?.id],
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «!!user».
    enabled: !!user,
    // Esta línea sirve para pedir a la API los consentimientos pendientes.
    queryFn: () => api.get<LegalConsentsResponse>("/legal/consents"),
    // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «5 * 60_000».
    staleTime: 5 * 60_000,
  })

  // Esta línea sirve para construir pendientes a partir de los datos del usuario.
  const fromUser: PendingConsent[] = (user?.pending_consents ?? []).map((type) => ({
    // Esta línea sirve para guardar el tipo de consentimiento.
    type,
    // Esta línea sirve para declarar la propiedad «document» con el valor o tipo «CONSENT_DOCUMENT[type]».
    document: CONSENT_DOCUMENT[type],
    // Esta línea sirve para guardar la versión vigente del documento.
    version: LEGAL_DOCUMENTS[CONSENT_DOCUMENT[type]].version,
    // Esta línea sirve para declarar la propiedad «accepted_version» con el valor o tipo «null».
    accepted_version: null,
  }))
  // Esta línea sirve para elegir los pendientes de la API o, si no hay, los del usuario.
  const pending: PendingConsent[] = data?.pending.length ? data.pending : fromUser

  // Esta línea sirve para mostrar el contenido normal si no hay pendientes.
  if (pending.length === 0) return children

  // Esta línea sirve para mostrar la pantalla de reaceptación si hay pendientes.
  return <ReacceptanceScreen pending={pending} />
}

// Esta línea sirve para declarar la pantalla donde el usuario acepta los documentos nuevos.
function ReacceptanceScreen({ pending }: { pending: PendingConsent[] }) {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «setUser» con el hook «useAuthStore».
  const setUser = useAuthStore((s) => s.setUser)
  // Esta línea sirve para obtener «logout» con el hook «useLogout».
  const logout = useLogout()
  // Esta línea sirve para guardar las casillas marcadas.
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({})
  // Esta línea sirve para guardar si el diálogo de eliminar cuenta está abierto.
  const [deleteOpen, setDeleteOpen] = useState(false)
  // Esta línea sirve para obtener los tipos de consentimiento pendientes.
  const types = pending.map((p) => p.type)
  // Esta línea sirve para calcular si todas las casillas están marcadas.
  const allChecked = types.every((type) => values[type])
  // Esta línea sirve para obtener los documentos únicos a mostrar.
  const documents = [...new Map(pending.map((p) => [p.document, p])).values()]

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «() =>».
    mutationFn: () =>
      // Esta línea sirve para enviar la aceptación a la API.
      api.post<{ pending: PendingConsent[]; user: User }>("/legal/consents", {
        // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «types».
        consents: types,
        // Esta línea sirve para declarar la propiedad «legal_versions» con el valor o tipo «currentConsentVersions(types)».
        legal_versions: currentConsentVersions(types),
      }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(response) => {».
    onSuccess: (response) => {
      // Esta línea sirve para actualizar el usuario con la respuesta.
      setUser(response.user)
      // Se aplica ya el nuevo `pending` (vacío) para salir de esta pantalla
      // sin esperar al refetch; el historial se actualiza con la invalidación.
      // Esta línea sirve para actualizar la caché de consentimientos con los pendientes restantes.
      queryClient.setQueryData<LegalConsentsResponse>([...LEGAL_CONSENTS_QUERY_KEY, response.user.id], (old) =>
        // Esta línea sirve para conservar los datos anteriores y reemplazar los pendientes.
        old ? { ...old, pending: response.pending } : old
      )
      // Esta línea sirve para refrescar la consulta de consentimientos.
      queryClient.invalidateQueries({ queryKey: LEGAL_CONSENTS_QUERY_KEY })
    },
  })

  // Esta línea sirve para calcular el mensaje de error.
  const errorMessage = mutation.error
    // Esta línea sirve para revisar si hubo error en la mutación.
    ? mutation.error instanceof ApiError
      // Esta línea sirve para mostrar el primer error de validación o el mensaje de la API.
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      // Esta línea sirve para usar el mensaje genérico si no es un error de la API.
      : t.reacceptError
    // Esta línea sirve para dejar sin error cuando no hay ninguno.
    : null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AuthLayout».
    <AuthLayout>
      {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
      <form
        // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column gap-3».
        className="d-flex flex-column gap-3"
        // Esta línea sirve para asignar el manejador del evento «onSubmit».
        onSubmit={(event) => {
          // Esta línea sirve para evitar el envío nativo del formulario.
          event.preventDefault()
          // Esta línea sirve para enviar la aceptación solo si todo está marcado.
          if (allChecked) mutation.mutate()
        }}
      >
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el título de la pantalla. */}
          <h1 className="fs-5 fw-semibold mb-1">{t.reacceptTitle}</h1>
          {/* Esta línea sirve para mostrar la descripción de la pantalla. */}
          <p className="small text-body-secondary mb-0">{t.reacceptDescription}</p>
        </div>

        {/* Esta línea sirve para abrir el elemento «ul» con las clases «list-unstyled d-flex flex-column gap-1 s». */}
        <ul className="list-unstyled d-flex flex-column gap-1 small mb-0">
          {/* Esta línea sirve para recorrer «documents» y mostrar un bloque por elemento. */}
          {documents.map((p) => (
            // Esta línea sirve para abrir el elemento «li».
            <li key={p.document}>
              {/* Esta línea sirve para abrir el componente «Link». */}
              <Link to={LEGAL_PATHS[p.document]} target="_blank" rel="noopener" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
                {/* Esta línea sirve para mostrar el nombre del documento. */}
                {t.documentNames[p.document]}
              {/* Esta línea sirve para cerrar el enlace al documento. */}
              </Link>{" "}
              {/* Esta línea sirve para abrir el elemento «span» con las clases «text-body-secondary». */}
              <span className="text-body-secondary">
                {/* Esta línea sirve para mostrar si el documento es nuevo o fue actualizado. */}
                · {p.accepted_version ? t.reacceptUpdatedDocument(p.accepted_version, p.version) : t.reacceptNewDocument(p.version)}
              </span>
            </li>
          ))}
        </ul>

        {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
        <ConsentCheckboxes
          // Esta línea sirve para definir el atributo «idPrefix» con el valor «reaccept».
          idPrefix="reaccept"
          // Esta línea sirve para pasar la propiedad «consents» con el valor «types}».
          consents={types}
          // Esta línea sirve para pasar la propiedad «values» con el valor «values}».
          values={values}
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «mutation.isPending}».
          disabled={mutation.isPending}
          // Esta línea sirve para asignar el manejador del evento «onChange».
          onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
        />

        {/* Esta línea sirve para mostrar el bloque solo si «errorMessage». */}
        {errorMessage && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {/* Esta línea sirve para mostrar el valor «errorMessage». */}
            {errorMessage}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="submit" disabled={!allChecked || mutation.isPending} loading={mutation.isPending} className="w-100 justify-content-center">
          {/* Esta línea sirve para mostrar el valor «t.reacceptConfirm». */}
          {t.reacceptConfirm}
        </SankButton>
        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="button" variant="ghost" onClick={logout} className="w-100 justify-content-center">
          {/* Esta línea sirve para mostrar el valor «t.reacceptLogout». */}
          {t.reacceptLogout}
        </SankButton>
        {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
        <button
          // Esta línea sirve para definir el atributo «type» con el valor «button».
          type="button"
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => setDeleteOpen(true)}
          // Esta línea sirve para aplicar las clases de estilo «btn btn-link small text-danger p-0 align-self».
          className="btn btn-link small text-danger p-0 align-self-center"
        >
          {/* Esta línea sirve para mostrar el valor «t.deleteAccountFromReaccept». */}
          {t.deleteAccountFromReaccept}
        </button>
      </form>
      {/* Esta línea sirve para mostrar el componente «DeleteAccountDialog». */}
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </AuthLayout>
  )
}
