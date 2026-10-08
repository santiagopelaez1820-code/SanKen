// Esta línea sirve para importar «Modal» desde «react-bootstrap».
import { Modal } from "react-bootstrap"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"

// Esta línea sirve para declarar la interfaz «ConfirmDialogProps».
interface ConfirmDialogProps {
  // Esta línea sirve para declarar la propiedad «open» con el valor o tipo «boolean».
  open: boolean
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description?: string
  // Esta línea sirve para declarar la propiedad «confirmLabel» con el valor o tipo «string».
  confirmLabel?: string
  // Esta línea sirve para declarar la propiedad «cancelLabel» con el valor o tipo «string».
  cancelLabel?: string
  // Esta línea sirve para declarar la propiedad «destructive» con el valor o tipo «boolean».
  destructive?: boolean
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading?: boolean
  // Esta línea sirve para declarar la propiedad «onConfirm» con el valor o tipo «() => void».
  onConfirm: () => void
  // Esta línea sirve para declarar la propiedad «onCancel» con el valor o tipo «() => void».
  onCancel: () => void
}

/** Modal de confirmación genérico, reutilizable para cualquier acción que necesite un "¿Seguro?" antes de ejecutarse. */
// Esta línea sirve para declarar el componente del diálogo de confirmación.
export function ConfirmDialog({
  // Esta línea sirve para incluir el valor «open» en la lista.
  open,
  // Esta línea sirve para incluir el valor «title» en la lista.
  title,
  // Esta línea sirve para incluir el valor «description» en la lista.
  description,
  // Esta línea sirve para incluir el valor «confirmLabel» en la lista.
  confirmLabel = "Confirmar",
  // Esta línea sirve para incluir el valor «cancelLabel» en la lista.
  cancelLabel = "Cancelar",
  // Esta línea sirve para incluir el valor «destructive» en la lista.
  destructive = false,
  // Esta línea sirve para incluir el valor «isLoading» en la lista.
  isLoading = false,
  // Esta línea sirve para incluir el valor «onConfirm» en la lista.
  onConfirm,
  // Esta línea sirve para incluir el valor «onCancel» en la lista.
  onCancel,
// Esta línea sirve para cerrar los parámetros del componente.
}: ConfirmDialogProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal show={open} onHide={onCancel} centered size="sm">
      {/* Esta línea sirve para abrir el componente «Modal.Body». */}
      <Modal.Body className="text-center py-4">
        {/* Esta línea sirve para mostrar el título del diálogo. */}
        <p className="fw-medium fs-5 mb-1">{title}</p>
        {/* Esta línea sirve para mostrar el elemento solo si «description». */}
        {description && <p className="small text-body-secondary mb-0">{description}</p>}
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-center gap-2 mt-4». */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          {/* Esta línea sirve para abrir el componente «SankButton». */}
          <SankButton variant="outline" onClick={onCancel} disabled={isLoading}>
            {/* Esta línea sirve para mostrar el valor «cancelLabel». */}
            {cancelLabel}
          </SankButton>
          {/* Esta línea sirve para abrir el componente «SankButton». */}
          <SankButton variant={destructive ? "destructive" : "primary"} onClick={onConfirm} disabled={isLoading} loading={isLoading}>
            {/* Esta línea sirve para mostrar el valor «confirmLabel». */}
            {confirmLabel}
          </SankButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}
