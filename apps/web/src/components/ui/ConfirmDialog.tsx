import { Modal } from "react-bootstrap"
import { SankButton } from "@/components/ui/SankButton"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Modal de confirmación genérico, reutilizable para cualquier acción que necesite un "¿Seguro?" antes de ejecutarse. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal show={open} onHide={onCancel} centered size="sm">
      <Modal.Body className="text-center py-4">
        <p className="fw-medium fs-5 mb-1">{title}</p>
        {description && <p className="small text-body-secondary mb-0">{description}</p>}
        <div className="d-flex justify-content-center gap-2 mt-4">
          <SankButton variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </SankButton>
          <SankButton variant={destructive ? "destructive" : "primary"} onClick={onConfirm} disabled={isLoading} loading={isLoading}>
            {confirmLabel}
          </SankButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}
