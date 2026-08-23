import * as React from "react"
import { Modal } from "react-bootstrap"

interface SankModalProps {
  show: boolean
  onHide: () => void
  title?: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "lg" | "xl"
  centered?: boolean
  children: React.ReactNode
}

/** Modal con jerarquía consistente: header limpio, body con scroll propio, footer opcional. */
export function SankModal({
  show,
  onHide,
  title,
  footer,
  size,
  centered = true,
  children,
}: SankModalProps) {
  return (
    <Modal show={show} onHide={onHide} size={size} centered={centered} scrollable>
      {title && (
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="fs-6 fw-semibold">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer className="border-top-0 pt-0">{footer}</Modal.Footer>}
    </Modal>
  )
}
