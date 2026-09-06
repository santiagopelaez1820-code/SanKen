import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { ChevronLeft, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@sanken/core"
import { useCartStore } from "@/lib/cart-store"
import { SankButton } from "@/components/ui/SankButton"
import { SankEmptyState } from "@/components/ui/SankEmptyState"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { CartItemRow } from "@/components/store/CartItemRow"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const [confirmingClear, setConfirmingClear] = useState(false)

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <Link
            to="/store"
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            <ChevronLeft size={16} /> Tienda
          </Link>
          <h1 className="fs-3 fw-bold mb-0">Carrito</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div variants={fadeInUp} className="sank-surface rounded-2">
            <SankEmptyState
              icon={ShoppingCart}
              title="Tu carrito está vacío"
              description="Agregá productos desde la tienda para verlos acá."
              action={{ label: "Ir a la tienda", onClick: () => navigate("/store") }}
            />
          </motion.div>
        ) : (
          <>
            <motion.div variants={fadeInUp} className="d-flex flex-column gap-2">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onIncrement={() => incrementItem(item.product.id)}
                  onDecrement={() => decrementItem(item.product.id)}
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="sank-surface sank-sticky-bottom-bar rounded-2 p-3 d-flex flex-column gap-2"
            >
              <div className="d-flex justify-content-between fw-bold">
                <span>Subtotal (COP)</span>
                <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(subtotal)}</span>
              </div>
              <SankButton className="w-100 justify-content-center" onClick={() => navigate("/store/checkout")}>
                Continuar compra
              </SankButton>
              <SankButton variant="ghost" className="w-100 justify-content-center" onClick={() => setConfirmingClear(true)}>
                Vaciar carrito
              </SankButton>
            </motion.div>
          </>
        )}
      </motion.div>

      <ConfirmDialog
        open={confirmingClear}
        title="¿Vaciar el carrito?"
        description="Se van a quitar todos los productos agregados."
        confirmLabel="Sí, vaciar"
        destructive
        onConfirm={() => {
          clear()
          setConfirmingClear(false)
        }}
        onCancel={() => setConfirmingClear(false)}
      />
    </Container>
  )
}
