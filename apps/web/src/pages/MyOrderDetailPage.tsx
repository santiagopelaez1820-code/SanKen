// Esta línea sirve para importar «Link, useParams» desde «react-router-dom».
import { Link, useParams } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «ChevronLeft» desde «lucide-react».
import { ChevronLeft } from "lucide-react"
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
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «OrderTimeline» desde «@/components/store/OrderTimeline».
import { OrderTimeline } from "@/components/store/OrderTimeline"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «MyOrderDetailPage».
export function MyOrderDetailPage() {
  // Esta línea sirve para extraer «orderId» de «useParams<{ orderId: string }>()».
  const { orderId } = useParams<{ orderId: string }>()

  // Esta línea sirve para obtener «data: order, isLoading» con el hook «useQuery».
  const { data: order, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["orders", orderId]».
    queryKey: ["orders", orderId],
    // Esta línea sirve para pedir a la API los datos de «/orders/${orderId}».
    queryFn: () => api.get<Order>(`/orders/${orderId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(orderId)».
    enabled: Boolean(orderId),
  })

  // Esta línea sirve para revisar si «isLoading || !order».
  if (isLoading || !order) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «Container».
      <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 640 }}>
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton style={{ height: 320, width: "100%" }} />
      </Container>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 640 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-3». */}
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
          <Link
            // Esta línea sirve para definir el atributo «to» con el valor «/pedidos».
            to="/pedidos"
            // Esta línea sirve para aplicar las clases de estilo «d-inline-flex align-items-center gap-1 small ».
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            {/* Esta línea sirve para mostrar el texto del enlace de volver. */}
            <ChevronLeft size={16} /> Mis pedidos
          </Link>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten». */}
          <div className="d-flex align-items-center justify-content-between">
            {/* Esta línea sirve para abrir el elemento «h1» con sus propiedades. */}
            <h1 className="fs-3 fw-bold mb-0">Pedido #{String(order.id).padStart(6, "0")}</h1>
            {/* Esta línea sirve para mostrar el valor «ORDER_STATUS_LABELS[order.status]» dentro de «SankBadge». */}
            <SankBadge variant={ORDER_STATUS_SANK_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</SankBadge>
          </div>
          {/* Esta línea sirve para mostrar el valor «new Date(order.created_at).toLocaleString()» dentro de un «p». */}
          <p className="small text-body-secondary mb-0">{new Date(order.created_at).toLocaleString()}</p>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3">
          {/* Esta línea sirve para mostrar el texto «Seguimiento» dentro de un «p». */}
          <p className="sank-eyebrow mb-3">Seguimiento</p>
          {/* Esta línea sirve para abrir el componente «OrderTimeline». */}
          <OrderTimeline status={order.status} />
        </motion.div>

        {/* Esta línea sirve para mostrar el seguimiento si hay guía, transportista o mensaje. */}
        {(order.tracking_number || order.carrier || order.customer_message) && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
            {/* Esta línea sirve para mostrar el texto «Envío» dentro de un «p». */}
            <p className="sank-eyebrow mb-0">Envío</p>
            {/* Esta línea sirve para mostrar el bloque solo si «order.carrier». */}
            {order.carrier && (
              // Esta línea sirve para abrir el elemento «p» con las clases «small mb-0».
              <p className="small mb-0">
                {/* Esta línea sirve para mostrar el texto «Transportadora: » dentro de un «span». */}
                <span className="text-body-secondary">Transportadora: </span>
                {/* Esta línea sirve para mostrar el valor «order.carrier». */}
                {order.carrier}
              </p>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «order.tracking_number». */}
            {order.tracking_number && (
              // Esta línea sirve para abrir el elemento «p» con las clases «small mb-0».
              <p className="small mb-0">
                {/* Esta línea sirve para mostrar el texto «Número de guía: » dentro de un «span». */}
                <span className="text-body-secondary">Número de guía: </span>
                {/* Esta línea sirve para mostrar el valor «order.tracking_number». */}
                {order.tracking_number}
              </p>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «order.customer_message». */}
            {order.customer_message && (
              // Esta línea sirve para abrir el elemento «div» con las clases «rounded-2 p-2».
              <div className="rounded-2 p-2" style={{ backgroundColor: "var(--bs-secondary-bg)" }}>
                {/* Esta línea sirve para mostrar el texto «Mensaje de SanKen» dentro de un «p». */}
                <p className="small text-body-secondary mb-1">Mensaje de SanKen</p>
                {/* Esta línea sirve para mostrar el valor «order.customer_message» dentro de un «p». */}
                <p className="small mb-0">{order.customer_message}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «order.support_whatsapp_url». */}
        {order.support_whatsapp_url && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp}>
            {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
            <SankButton
              // Esta línea sirve para definir el atributo «variant» con el valor «outline».
              variant="outline"
              // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
              className="w-100 justify-content-center"
              // Esta línea sirve para pasar la propiedad «href» con el valor «order.support_whatsapp_url}».
              href={order.support_whatsapp_url}
              // Esta línea sirve para definir el atributo «target» con el valor «_blank».
              target="_blank"
              // Esta línea sirve para definir el atributo «rel» con el valor «noopener noreferrer».
              rel="noopener noreferrer"
            >
              {/* Esta línea sirve para mostrar el contenido dinámico «💬 Contactar con SanKen». */}
              💬 Contactar con SanKen
            </SankButton>
          </motion.div>
        )}

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          {/* Esta línea sirve para mostrar el texto «Entrega» dentro de un «p». */}
          <p className="sank-eyebrow mb-0">Entrega</p>
          {/* Esta línea sirve para mostrar el valor «order.address» dentro de un «p». */}
          <p className="small mb-0">{order.address}</p>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
          <p className="small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar el contenido dinámico «{order.city}, {order.department}». */}
            {order.city}, {order.department}
          </p>
          {/* Esta línea sirve para mostrar el elemento solo si «order.additional_info». */}
          {order.additional_info && <p className="small text-body-secondary mb-0">{order.additional_info}</p>}
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          {/* Esta línea sirve para mostrar el texto «Productos» dentro de un «p». */}
          <p className="sank-eyebrow mb-0">Productos</p>
          {/* Esta línea sirve para recorrer «order.items» y mostrar un bloque por elemento. */}
          {order.items.map((item) => (
            // Esta línea sirve para abrir el elemento «div».
            <div key={item.id} className="d-flex justify-content-between small">
              {/* Esta línea sirve para abrir el elemento «span» con las clases «text-truncate me-2». */}
              <span className="text-truncate me-2">
                {/* Esta línea sirve para mostrar el contenido dinámico «{item.quantity}× {item.product_name}». */}
                {item.quantity}× {item.product_name}
              </span>
              {/* Esta línea sirve para mostrar el valor «formatCurrency(item.subtotal)» dentro de un «span». */}
              <span className="flex-shrink-0">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
          <div
            // Esta línea sirve para aplicar las clases de estilo «pt-2 d-flex justify-content-between small tex».
            className="pt-2 d-flex justify-content-between small text-body-secondary"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ borderTop: "1px solid var(--bs-border-color».
            style={{ borderTop: "1px solid var(--bs-border-color)" }}
          >
            {/* Esta línea sirve para mostrar el texto «Subtotal (COP)» dentro de un «span». */}
            <span>Subtotal (COP)</span>
            {/* Esta línea sirve para mostrar el valor «formatCurrency(order.subtotal)» dentro de un «span». */}
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between small tex». */}
          <div className="d-flex justify-content-between small text-body-secondary">
            {/* Esta línea sirve para mostrar el texto «Envío (COP)» dentro de un «span». */}
            <span>Envío (COP)</span>
            {/* Esta línea sirve para mostrar el costo de envío o «Por definir». */}
            <span>{order.shipping_cost ? formatCurrency(order.shipping_cost) : "Por definir"}</span>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between fw-bold». */}
          <div className="d-flex justify-content-between fw-bold">
            {/* Esta línea sirve para mostrar el texto «Total (COP)» dentro de un «span». */}
            <span>Total (COP)</span>
            {/* Esta línea sirve para mostrar el valor «formatCurrency(order.total)» dentro de un «span». */}
            <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(order.total)}</span>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  )
}
