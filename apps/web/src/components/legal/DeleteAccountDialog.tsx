// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Alert, Form, Modal» desde «react-bootstrap».
import { Alert, Form, Modal } from "react-bootstrap"
// Esta línea sirve para importar «useMutation» desde «@tanstack/react-query».
import { useMutation } from "@tanstack/react-query"
// Esta línea sirve para importar «ApiError, DELETE_ACCOUNT_CONFIRMATION» desde «@sanken/core».
import { ApiError, DELETE_ACCOUNT_CONFIRMATION } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «useLogout» desde «@/hooks/use-logout».
import { useLogout } from "@/hooks/use-logout"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"

// Esta línea sirve para declarar la interfaz «DeleteAccountDialogProps».
interface DeleteAccountDialogProps {
  // Esta línea sirve para declarar la propiedad «open» con el valor o tipo «boolean».
  open: boolean
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void
}

/**
 * Eliminación de la propia cuenta (DELETE /auth/me). Doble confirmación:
 * escribir ELIMINAR y, si la cuenta es de correo/contraseña, la contraseña.
 * Se usa desde Configuración y desde la pantalla de re-aceptación (quien no
 * acepta una versión nueva de los documentos tiene que poder irse).
 */
// Esta línea sirve para declarar el componente del diálogo para eliminar la cuenta.
export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user)
  // Esta línea sirve para obtener «logout» con el hook «useLogout».
  const logout = useLogout()
  // Esta línea sirve para guardar la palabra de confirmación escrita.
  const [confirmation, setConfirmation] = useState("")
  // Esta línea sirve para guardar la contraseña escrita.
  const [password, setPassword] = useState("")
  // `auth_provider` vacío = cuenta de correo (o un `user` guardado por una
  // versión anterior sin ese campo): se muestra el campo; el backend decide
  // si es obligatorio.
  // Esta línea sirve para calcular si hace falta contraseña (cuentas sin proveedor social).
  const needsPassword = !user?.auth_provider
  // Esta línea sirve para calcular si el usuario es super administrador.
  const isSuperAdmin = user?.role === "super_admin"

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «() =>».
    mutationFn: () =>
      // Esta línea sirve para enviar la petición de borrado de la cuenta.
      api.delete<{ message: string }>("/auth/me", {
        // Esta línea sirve para incluir la palabra de confirmación.
        confirmation,
        // Esta línea sirve para incluir la contraseña solo si hace falta.
        ...(needsPassword ? { password } : {}),
      }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => logout()».
    onSuccess: () => logout(),
  })

  // Esta línea sirve para calcular el mensaje de error.
  const error = mutation.error
    // Esta línea sirve para revisar si hubo error en la mutación.
    ? mutation.error instanceof ApiError
      // Esta línea sirve para mostrar el primer error de validación o el mensaje de la API.
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      // Esta línea sirve para usar el mensaje genérico si no es un error de la API.
      : t.deleteAccountError
    // Esta línea sirve para dejar sin error cuando no hay ninguno.
    : null

  // Esta línea sirve para declarar la función que cierra el diálogo.
  const close = () => {
    // Esta línea sirve para limpiar la confirmación escrita.
    setConfirmation("")
    // Esta línea sirve para limpiar la contraseña escrita.
    setPassword("")
    // Esta línea sirve para reiniciar el estado de la mutación.
    mutation.reset()
    // Esta línea sirve para avisar al padre que se cerró.
    onClose()
  }

  // Esta línea sirve para calcular si se puede enviar el formulario.
  const canSubmit = confirmation.trim() === DELETE_ACCOUNT_CONFIRMATION && (!needsPassword || password.length > 0)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal show={open} onHide={close} centered aria-labelledby="delete-account-title">
      {/* Esta línea sirve para abrir el elemento «Form» con sus atributos en varias líneas. */}
      <Form
        // Esta línea sirve para asignar el manejador del evento «onSubmit».
        onSubmit={(event) => {
          // Esta línea sirve para evitar el envío nativo del formulario.
          event.preventDefault()
          // Esta línea sirve para borrar la cuenta si el formulario es válido y no es super administrador.
          if (canSubmit && !isSuperAdmin) mutation.mutate()
        }}
      >
        {/* Esta línea sirve para abrir el componente «Modal.Header». */}
        <Modal.Header closeButton>
          {/* Esta línea sirve para abrir el componente «Modal.Title». */}
          <Modal.Title id="delete-account-title" as="h2" className="fs-5">
            {/* Esta línea sirve para mostrar el valor «t.deleteAccountTitle». */}
            {t.deleteAccountTitle}
          </Modal.Title>
        </Modal.Header>
        {/* Esta línea sirve para abrir el componente «Modal.Body». */}
        <Modal.Body className="d-flex flex-column gap-3">
          {/* Esta línea sirve para mostrar la descripción del borrado. */}
          <p className="small text-body-secondary mb-0">{t.deleteAccountDescription}</p>

          {/* Esta línea sirve para elegir entre dos bloques según «isSuperAdmin». */}
          {isSuperAdmin ? (
            // Esta línea sirve para abrir el componente «Alert».
            <Alert variant="warning" className="py-2 small mb-0">
              {/* Esta línea sirve para mostrar el valor «t.deleteAccountAdminNote». */}
              {t.deleteAccountAdminNote}
            </Alert>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para mostrar el bloque solo si «needsPassword». */}
              {needsPassword && (
                // Esta línea sirve para abrir el componente «Form.Group».
                <Form.Group controlId="delete-account-password">
                  {/* Esta línea sirve para mostrar la etiqueta de la contraseña. */}
                  <Form.Label className="small fw-medium">{t.deleteAccountPasswordLabel}</Form.Label>
                  {/* Esta línea sirve para abrir el campo de la contraseña. */}
                  <Form.Control
                    // Esta línea sirve para definir el atributo «type» con el valor «password».
                    type="password"
                    // Esta línea sirve para definir el atributo «autoComplete» con el valor «current-password».
                    autoComplete="current-password"
                    // Esta línea sirve para pasar la propiedad «value» con el valor «password}».
                    value={password}
                    // Esta línea sirve para asignar el manejador del evento «onChange».
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
              )}
              {/* Esta línea sirve para abrir el componente «Form.Group». */}
              <Form.Group controlId="delete-account-confirmation">
                {/* Esta línea sirve para mostrar la etiqueta de la confirmación. */}
                <Form.Label className="small fw-medium">{t.deleteAccountConfirmLabel}</Form.Label>
                {/* Esta línea sirve para abrir el campo de la confirmación. */}
                <Form.Control
                  // Esta línea sirve para definir el atributo «type» con el valor «text».
                  type="text"
                  // Esta línea sirve para definir el atributo «autoComplete» con el valor «off».
                  autoComplete="off"
                  // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «characters».
                  autoCapitalize="characters"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «confirmation}».
                  value={confirmation}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </Form.Group>
            </>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «Alert».
            <Alert variant="danger" className="py-2 small mb-0" role="alert">
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </Alert>
          )}
        </Modal.Body>
        {/* Esta línea sirve para abrir el componente «Modal.Footer». */}
        <Modal.Footer className="gap-2">
          {/* Esta línea sirve para abrir el componente «SankButton». */}
          <SankButton type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
            {/* Esta línea sirve para mostrar el valor «t.cancel». */}
            {t.cancel}
          </SankButton>
          {/* Esta línea sirve para mostrar el bloque solo si «!isSuperAdmin». */}
          {!isSuperAdmin && (
            // Esta línea sirve para abrir el componente «SankButton».
            <SankButton type="submit" variant="destructive" disabled={!canSubmit || mutation.isPending} loading={mutation.isPending}>
              {/* Esta línea sirve para mostrar el valor «t.deleteAccountSubmit». */}
              {t.deleteAccountSubmit}
            </SankButton>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
