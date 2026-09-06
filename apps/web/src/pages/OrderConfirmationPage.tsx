import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { CheckCircle2 } from "lucide-react"
import { SankButton } from "@/components/ui/SankButton"
import { EASE_OUT } from "@/lib/motion"

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <Container
      fluid
      className="px-3 py-5 d-flex flex-column align-items-center text-center"
      style={{ maxWidth: 480, minHeight: "60vh", justifyContent: "center", margin: "0 auto" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: 72, height: 72, background: "var(--sanken-charcoal)" }}
      >
        <CheckCircle2 size={36} style={{ color: "var(--sanken-cyan)" }} />
      </motion.div>
      <h1 className="fs-3 fw-bold mb-2">¡Pedido realizado!</h1>
      <p className="text-body-secondary mb-4">
        Tu pedido #{String(orderId ?? "").padStart(6, "0")} quedó registrado y está pendiente de confirmación.
      </p>
      <div className="d-flex gap-2">
        <Link to="/store">
          <SankButton>Volver a la tienda</SankButton>
        </Link>
        <Link to={orderId ? `/pedidos/${orderId}` : "/pedidos"}>
          <SankButton variant="ghost">Ver mis pedidos</SankButton>
        </Link>
      </div>
    </Container>
  )
}
