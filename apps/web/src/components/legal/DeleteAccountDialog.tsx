import { useState } from "react"
import { Alert, Form, Modal } from "react-bootstrap"
import { useMutation } from "@tanstack/react-query"
import { ApiError, DELETE_ACCOUNT_CONFIRMATION } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { useLogout } from "@/hooks/use-logout"
import { SankButton } from "@/components/ui/SankButton"

interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
}

/**
 * Eliminación de la propia cuenta (DELETE /auth/me). Doble confirmación:
 * escribir ELIMINAR y, si la cuenta es de correo/contraseña, la contraseña.
 * Se usa desde Configuración y desde la pantalla de re-aceptación (quien no
 * acepta una versión nueva de los documentos tiene que poder irse).
 */
export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const { t } = useLegalStrings()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const [confirmation, setConfirmation] = useState("")
  const [password, setPassword] = useState("")
  // `auth_provider` vacío = cuenta de correo (o un `user` guardado por una
  // versión anterior sin ese campo): se muestra el campo; el backend decide
  // si es obligatorio.
  const needsPassword = !user?.auth_provider
  const isSuperAdmin = user?.role === "super_admin"

  const mutation = useMutation({
    mutationFn: () =>
      api.delete<{ message: string }>("/auth/me", {
        confirmation,
        ...(needsPassword ? { password } : {}),
      }),
    onSuccess: () => logout(),
  })

  const error = mutation.error
    ? mutation.error instanceof ApiError
      ? (Object.values(mutation.error.body.errors ?? {})[0]?.[0] ?? mutation.error.body.message)
      : t.deleteAccountError
    : null

  const close = () => {
    setConfirmation("")
    setPassword("")
    mutation.reset()
    onClose()
  }

  const canSubmit = confirmation.trim() === DELETE_ACCOUNT_CONFIRMATION && (!needsPassword || password.length > 0)

  return (
    <Modal show={open} onHide={close} centered aria-labelledby="delete-account-title">
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          if (canSubmit && !isSuperAdmin) mutation.mutate()
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="delete-account-title" as="h2" className="fs-5">
            {t.deleteAccountTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <p className="small text-body-secondary mb-0">{t.deleteAccountDescription}</p>

          {isSuperAdmin ? (
            <Alert variant="warning" className="py-2 small mb-0">
              {t.deleteAccountAdminNote}
            </Alert>
          ) : (
            <>
              {needsPassword && (
                <Form.Group controlId="delete-account-password">
                  <Form.Label className="small fw-medium">{t.deleteAccountPasswordLabel}</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
              )}
              <Form.Group controlId="delete-account-confirmation">
                <Form.Label className="small fw-medium">{t.deleteAccountConfirmLabel}</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </Form.Group>
            </>
          )}

          {error && (
            <Alert variant="danger" className="py-2 small mb-0" role="alert">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="gap-2">
          <SankButton type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
            {t.cancel}
          </SankButton>
          {!isSuperAdmin && (
            <SankButton type="submit" variant="destructive" disabled={!canSubmit || mutation.isPending} loading={mutation.isPending}>
              {t.deleteAccountSubmit}
            </SankButton>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
