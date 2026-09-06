import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { ChevronLeft } from "lucide-react"
import { formatCurrency, type Order } from "@sanken/core"
import { api } from "@/lib/api"
import { ORDER_STATUS_LABELS, ORDER_STATUS_SANK_VARIANT } from "@/lib/order-status"
import { Skeleton } from "@/components/ui/skeleton"
import { SankBadge } from "@/components/ui/SankBadge"
import { SankButton } from "@/components/ui/SankButton"
import { OrderTimeline } from "@/components/store/OrderTimeline"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function MyOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => api.get<Order>(`/orders/${orderId}`),
    enabled: Boolean(orderId),
  })

  if (isLoading || !order) {
    return (
      <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 640 }}>
        <Skeleton style={{ height: 320, width: "100%" }} />
      </Container>
    )
  }

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 640 }}>
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <Link
            to="/pedidos"
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            <ChevronLeft size={16} /> Mis pedidos
          </Link>
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="fs-3 fw-bold mb-0">Pedido #{String(order.id).padStart(6, "0")}</h1>
            <SankBadge variant={ORDER_STATUS_SANK_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</SankBadge>
          </div>
          <p className="small text-body-secondary mb-0">{new Date(order.created_at).toLocaleString()}</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3">
          <p className="sank-eyebrow mb-3">Seguimiento</p>
          <OrderTimeline status={order.status} />
        </motion.div>

        {(order.tracking_number || order.carrier || order.customer_message) && (
          <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
            <p className="sank-eyebrow mb-0">Envío</p>
            {order.carrier && (
              <p className="small mb-0">
                <span className="text-body-secondary">Transportadora: </span>
                {order.carrier}
              </p>
            )}
            {order.tracking_number && (
              <p className="small mb-0">
                <span className="text-body-secondary">Número de guía: </span>
                {order.tracking_number}
              </p>
            )}
            {order.customer_message && (
              <div className="rounded-2 p-2" style={{ backgroundColor: "var(--bs-secondary-bg)" }}>
                <p className="small text-body-secondary mb-1">Mensaje de SanKen</p>
                <p className="small mb-0">{order.customer_message}</p>
              </div>
            )}
          </motion.div>
        )}

        {order.support_whatsapp_url && (
          <motion.div variants={fadeInUp}>
            <SankButton
              variant="outline"
              className="w-100 justify-content-center"
              href={order.support_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Contactar con SanKen
            </SankButton>
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          <p className="sank-eyebrow mb-0">Entrega</p>
          <p className="small mb-0">{order.address}</p>
          <p className="small text-body-secondary mb-0">
            {order.city}, {order.department}
          </p>
          {order.additional_info && <p className="small text-body-secondary mb-0">{order.additional_info}</p>}
        </motion.div>

        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          <p className="sank-eyebrow mb-0">Productos</p>
          {order.items.map((item) => (
            <div key={item.id} className="d-flex justify-content-between small">
              <span className="text-truncate me-2">
                {item.quantity}× {item.product_name}
              </span>
              <span className="flex-shrink-0">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div
            className="pt-2 d-flex justify-content-between small text-body-secondary"
            style={{ borderTop: "1px solid var(--bs-border-color)" }}
          >
            <span>Subtotal (COP)</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="d-flex justify-content-between small text-body-secondary">
            <span>Envío (COP)</span>
            <span>{order.shipping_cost ? formatCurrency(order.shipping_cost) : "Por definir"}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total (COP)</span>
            <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(order.total)}</span>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  )
}
