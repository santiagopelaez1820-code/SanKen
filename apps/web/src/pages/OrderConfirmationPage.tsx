// Esta línea sirve para importar «Link, useParams» desde «react-router-dom».
import { Link, useParams } from "react-router-dom"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «CheckCircle2» desde «lucide-react».
import { CheckCircle2 } from "lucide-react"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «EASE_OUT» desde «@/lib/motion».
import { EASE_OUT } from "@/lib/motion"

// Esta línea sirve para declarar la función «OrderConfirmationPage».
export function OrderConfirmationPage() {
  // Esta línea sirve para extraer «orderId» de «useParams<{ orderId: string }>()».
  const { orderId } = useParams<{ orderId: string }>()

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Container» con sus atributos en varias líneas.
    <Container
      // Esta línea sirve para ocupar todo el ancho del contenedor.
      fluid
      // Esta línea sirve para aplicar las clases de estilo «px-3 py-5 d-flex flex-column align-items-cent».
      className="px-3 py-5 d-flex flex-column align-items-center text-center"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{ maxWidth: 480, minHeight: "60vh", justifyCo».
      style={{ maxWidth: 480, minHeight: "60vh", justifyContent: "center", margin: "0 auto" }}
    >
      {/* Esta línea sirve para abrir el bloque animado de la confirmación. */}
      <motion.div
        // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, scale: 0.85 }}».
        initial={{ opacity: 0, scale: 0.85 }}
        // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, scale: 1 }}».
        animate={{ opacity: 1, scale: 1 }}
        // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.35, ease: EASE_OUT }}».
        transition={{ duration: 0.35, ease: EASE_OUT }}
        // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
        // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 72, height: 72, background: "var(--s».
        style={{ width: 72, height: 72, background: "var(--sanken-charcoal)" }}
      >
        {/* Esta línea sirve para abrir el componente «CheckCircle2». */}
        <CheckCircle2 size={36} style={{ color: "var(--sanken-cyan)" }} />
      </motion.div>
      {/* Esta línea sirve para mostrar el texto «¡Pedido realizado!» dentro de un «h1». */}
      <h1 className="fs-3 fw-bold mb-2">¡Pedido realizado!</h1>
      {/* Esta línea sirve para abrir el elemento «p» con las clases «text-body-secondary mb-4». */}
      <p className="text-body-secondary mb-4">
        {/* Esta línea sirve para mostrar el número de pedido con ceros a la izquierda y su estado. */}
        Tu pedido #{String(orderId ?? "").padStart(6, "0")} quedó registrado y está pendiente de confirmación.
      </p>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-2». */}
      <div className="d-flex gap-2">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/store">
          {/* Esta línea sirve para mostrar el texto «Volver a la tienda» dentro de «SankButton». */}
          <SankButton>Volver a la tienda</SankButton>
        </Link>
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to={orderId ? `/pedidos/${orderId}` : "/pedidos"}>
          {/* Esta línea sirve para mostrar el texto «Ver mis pedidos» dentro de «SankButton». */}
          <SankButton variant="ghost">Ver mis pedidos</SankButton>
        </Link>
      </div>
    </Container>
  )
}
