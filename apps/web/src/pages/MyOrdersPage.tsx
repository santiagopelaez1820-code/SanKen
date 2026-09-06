import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { Package } from "lucide-react"
import { formatCurrency, type Order } from "@sanken/core"
import { api } from "@/lib/api"
import { ORDER_STATUS_LABELS, ORDER_STATUS_SANK_VARIANT } from "@/lib/order-status"
import { Skeleton } from "@/components/ui/skeleton"
import { SankBadge } from "@/components/ui/SankBadge"
import { SankEmptyState } from "@/components/ui/SankEmptyState"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function MyOrdersPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/orders"),
  })

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">SanKen</p>
          <h1 className="display-5 sank-stat mb-0">Mis pedidos</h1>
        </motion.div>

        {isLoading && <Skeleton style={{ height: 160, width: "100%" }} />}

        {!isLoading && (orders?.length ?? 0) === 0 && (
          <motion.div variants={fadeInUp} className="sank-surface rounded-2">
            <SankEmptyState
              icon={Package}
              title="Todavía no hiciste ningún pedido"
              description="Cuando compres algo en la tienda, lo vas a ver acá."
              action={{ label: "Ir a la tienda", onClick: () => navigate("/store") }}
            />
          </motion.div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <motion.div variants={fadeInUp} className="d-flex flex-column gap-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/pedidos/${order.id}`}
                className="sank-surface rounded-2 p-3 d-flex flex-column gap-1 text-decoration-none text-reset"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold small">Pedido #{String(order.id).padStart(6, "0")}</span>
                  <SankBadge variant={ORDER_STATUS_SANK_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</SankBadge>
                </div>
                <span className="small text-body-secondary">
                  {new Date(order.created_at).toLocaleDateString()} · {order.items.length}{" "}
                  {order.items.length === 1 ? "producto" : "productos"}
                </span>
                <span className="fw-bold small" style={{ color: "var(--sanken-cyan)" }}>
                  {formatCurrency(order.total)}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Container>
  )
}
