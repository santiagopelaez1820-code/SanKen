// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «ChevronLeft, ShoppingCart» desde «lucide-react».
import { ChevronLeft, ShoppingCart } from "lucide-react"
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from "@sanken/core"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
// Esta línea sirve para importar «CartItemRow» desde «@/components/store/CartItemRow».
import { CartItemRow } from "@/components/store/CartItemRow"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «CartPage».
export function CartPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «items» con el hook «useCartStore».
  const items = useCartStore((s) => s.items)
  // Esta línea sirve para obtener «incrementItem» con el hook «useCartStore».
  const incrementItem = useCartStore((s) => s.incrementItem)
  // Esta línea sirve para obtener «decrementItem» con el hook «useCartStore».
  const decrementItem = useCartStore((s) => s.decrementItem)
  // Esta línea sirve para obtener «removeItem» con el hook «useCartStore».
  const removeItem = useCartStore((s) => s.removeItem)
  // Esta línea sirve para obtener «clear» con el hook «useCartStore».
  const clear = useCartStore((s) => s.clear)
  // Esta línea sirve para obtener «subtotal» con el hook «useCartStore».
  const subtotal = useCartStore((s) => s.getSubtotal())
  // Esta línea sirve para crear el estado «confirmingClear» y su función «setConfirmingClear».
  const [confirmingClear, setConfirmingClear] = useState(false)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-3». */}
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
          <Link
            // Esta línea sirve para definir el atributo «to» con el valor «/store».
            to="/store"
            // Esta línea sirve para aplicar las clases de estilo «d-inline-flex align-items-center gap-1 small ».
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            {/* Esta línea sirve para mostrar el texto del enlace de volver. */}
            <ChevronLeft size={16} /> Tienda
          </Link>
          {/* Esta línea sirve para mostrar el texto «Carrito» dentro de un «h1». */}
          <h1 className="fs-3 fw-bold mb-0">Carrito</h1>
        </motion.div>

        {/* Esta línea sirve para elegir entre dos bloques según «items.length === 0». */}
        {items.length === 0 ? (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp} className="sank-surface rounded-2">
            {/* Esta línea sirve para abrir el elemento «SankEmptyState» con sus atributos en varias líneas. */}
            <SankEmptyState
              // Esta línea sirve para pasar la propiedad «icon» con el valor «ShoppingCart}».
              icon={ShoppingCart}
              // Esta línea sirve para definir el atributo «title» con el valor «Tu carrito está vacío».
              title="Tu carrito está vacío"
              // Esta línea sirve para definir el atributo «description».
              description="Agregá productos desde la tienda para verlos acá."
              // Esta línea sirve para pasar la propiedad «action» con el valor «{ label: "Ir a la tienda", onClick: () => nav».
              action={{ label: "Ir a la tienda", onClick: () => navigate("/store") }}
            />
          </motion.div>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para abrir el elemento «motion.div». */}
            <motion.div variants={fadeInUp} className="d-flex flex-column gap-2">
              {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
              {items.map((item) => (
                // Esta línea sirve para abrir el elemento «CartItemRow» con sus atributos en varias líneas.
                <CartItemRow
                  // Esta línea sirve para identificar el elemento de la lista con «item.product.id}».
                  key={item.product.id}
                  // Esta línea sirve para pasar la propiedad «item» con el valor «item}».
                  item={item}
                  // Esta línea sirve para asignar el manejador del evento «onIncrement».
                  onIncrement={() => incrementItem(item.product.id)}
                  // Esta línea sirve para asignar el manejador del evento «onDecrement».
                  onDecrement={() => decrementItem(item.product.id)}
                  // Esta línea sirve para asignar el manejador del evento «onRemove».
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}
            </motion.div>

            {/* Esta línea sirve para abrir el bloque animado del resumen. */}
            <motion.div
              // Esta línea sirve para pasar la propiedad «variants» con el valor «fadeInUp}».
              variants={fadeInUp}
              // Esta línea sirve para aplicar las clases de estilo «sank-surface sank-sticky-bottom-bar rounded-2».
              className="sank-surface sank-sticky-bottom-bar rounded-2 p-3 d-flex flex-column gap-2"
            >
              {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between fw-bold». */}
              <div className="d-flex justify-content-between fw-bold">
                {/* Esta línea sirve para mostrar el texto «Subtotal (COP)» dentro de un «span». */}
                <span>Subtotal (COP)</span>
                {/* Esta línea sirve para mostrar el valor «formatCurrency(subtotal)» dentro de un «span». */}
                <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(subtotal)}</span>
              </div>
              {/* Esta línea sirve para abrir el componente «SankButton» con sus propiedades. */}
              <SankButton className="w-100 justify-content-center" onClick={() => navigate("/store/checkout")}>
                {/* Esta línea sirve para mostrar el texto «Continuar compra». */}
                Continuar compra
              </SankButton>
              {/* Esta línea sirve para abrir el componente «SankButton» con sus propiedades. */}
              <SankButton variant="ghost" className="w-100 justify-content-center" onClick={() => setConfirmingClear(true)}>
                {/* Esta línea sirve para mostrar el texto «Vaciar carrito». */}
                Vaciar carrito
              </SankButton>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingClear}».
        open={confirmingClear}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Vaciar el carrito?».
        title="¿Vaciar el carrito?"
        // Esta línea sirve para definir el atributo «description».
        description="Se van a quitar todos los productos agregados."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, vaciar».
        confirmLabel="Sí, vaciar"
        // Esta línea sirve para activar la opción «destructive».
        destructive
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={() => {
          // Esta línea sirve para llamar a «clear».
          clear()
          // Esta línea sirve para llamar a «setConfirmingClear» con «false».
          setConfirmingClear(false)
        }}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingClear(false)}
      />
    </Container>
  )
}
