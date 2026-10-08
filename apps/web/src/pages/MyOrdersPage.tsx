// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «Package» desde «lucide-react».
import { Package } from "lucide-react"
// Esta línea sirve para importar «formatCurrency, type Order» desde «@sanken/core».
import { formatCurrency, type Order } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «ORDER_STATUS_LABELS, ORDER_STATUS_SANK_VARIANT» desde «@/lib/order-status».
import { ORDER_STATUS_LABELS, ORDER_STATUS_SANK_VARIANT } from "@/lib/order-status"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «SankBadge» desde «@/components/ui/SankBadge».
import { SankBadge } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «MyOrdersPage».
export function MyOrdersPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «data: orders, isLoading» con el hook «useQuery».
  const { data: orders, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["orders"]».
    queryKey: ["orders"],
    // Esta línea sirve para pedir a la API los datos de «/orders».
    queryFn: () => api.get<Order[]>("/orders"),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-3». */}
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para mostrar el texto «SanKen» dentro de un «p». */}
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">SanKen</p>
          {/* Esta línea sirve para mostrar el texto «Mis pedidos» dentro de un «h1». */}
          <h1 className="display-5 sank-stat mb-0">Mis pedidos</h1>
        </motion.div>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton style={{ height: 160, width: "100%" }} />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && (orders?.length ?? 0) === 0». */}
        {!isLoading && (orders?.length ?? 0) === 0 && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp} className="sank-surface rounded-2">
            {/* Esta línea sirve para abrir el elemento «SankEmptyState» con sus atributos en varias líneas. */}
            <SankEmptyState
              // Esta línea sirve para pasar la propiedad «icon» con el valor «Package}».
              icon={Package}
              // Esta línea sirve para definir el atributo «title» con el valor «Todavía no hiciste ningún pedido».
              title="Todavía no hiciste ningún pedido"
              // Esta línea sirve para definir el atributo «description».
              description="Cuando compres algo en la tienda, lo vas a ver acá."
              // Esta línea sirve para pasar la propiedad «action» con el valor «{ label: "Ir a la tienda", onClick: () => nav».
              action={{ label: "Ir a la tienda", onClick: () => navigate("/store") }}
            />
          </motion.div>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && orders && orders.length > 0». */}
        {!isLoading && orders && orders.length > 0 && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp} className="d-flex flex-column gap-2">
            {/* Esta línea sirve para recorrer «orders» y mostrar un bloque por elemento. */}
            {orders.map((order) => (
              // Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas.
              <Link
                // Esta línea sirve para identificar el elemento de la lista con «order.id}».
                key={order.id}
                // Esta línea sirve para pasar la propiedad «to» con el valor «`/pedidos/${order.id}`}».
                to={`/pedidos/${order.id}`}
                // Esta línea sirve para aplicar las clases de estilo «sank-surface rounded-2 p-3 d-flex flex-column».
                className="sank-surface rounded-2 p-3 d-flex flex-column gap-1 text-decoration-none text-reset"
              >
                {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten». */}
                <div className="d-flex align-items-center justify-content-between">
                  {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
                  <span className="fw-bold small">Pedido #{String(order.id).padStart(6, "0")}</span>
                  {/* Esta línea sirve para mostrar el valor «ORDER_STATUS_LABELS[order.status]» dentro de «SankBadge». */}
                  <SankBadge variant={ORDER_STATUS_SANK_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</SankBadge>
                </div>
                {/* Esta línea sirve para abrir el elemento «span» con las clases «small text-body-secondary». */}
                <span className="small text-body-secondary">
                  {/* Esta línea sirve para mostrar la fecha del pedido y la cantidad de productos. */}
                  {new Date(order.created_at).toLocaleDateString()} · {order.items.length}{" "}
                  {/* Esta línea sirve para mostrar el contenido dinámico «{order.items.length === 1 ? "producto" : "productos"}». */}
                  {order.items.length === 1 ? "producto" : "productos"}
                </span>
                {/* Esta línea sirve para abrir el elemento «span» con las clases «fw-bold small». */}
                <span className="fw-bold small" style={{ color: "var(--sanken-cyan)" }}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(order.total)}». */}
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
