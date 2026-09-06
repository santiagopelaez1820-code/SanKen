import { useState, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Container, Form } from "react-bootstrap"
import { ChevronLeft } from "lucide-react"
import { formatCurrency } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { useCartStore } from "@/lib/cart-store"
import { SankButton } from "@/components/ui/SankButton"
import { fadeInUp, staggerContainer } from "@/lib/motion"

interface CheckoutForm {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp: string
  department: string
  city: string
  address: string
  additional_info: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const isSubmittingOrder = useCartStore((s) => s.isSubmittingOrder)
  const orderError = useCartStore((s) => s.orderError)
  const submitOrder = useCartStore((s) => s.submitOrder)

  const [form, setForm] = useState<CheckoutForm>({
    customer_name: user?.name ?? "",
    customer_email: user?.email ?? "",
    customer_phone: "",
    customer_whatsapp: "",
    department: "",
    city: "",
    address: "",
    additional_info: "",
  })
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true)

  const update = (key: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const resolvedWhatsapp = whatsappSameAsPhone ? form.customer_phone : form.customer_whatsapp

  const isValid = Boolean(
    form.customer_name.trim() &&
      form.customer_email.trim() &&
      form.customer_phone.trim() &&
      resolvedWhatsapp.trim() &&
      form.department.trim() &&
      form.city.trim() &&
      form.address.trim()
  )

  const handleSubmit = async () => {
    const order = await submitOrder({
      ...form,
      customer_whatsapp: resolvedWhatsapp.trim(),
      additional_info: form.additional_info.trim() || null,
    })
    if (order) navigate(`/store/confirmation/${order.id}`)
  }

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 640 }}>
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <Link
            to="/store/cart"
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            <ChevronLeft size={16} /> Carrito
          </Link>
          <h1 className="fs-3 fw-bold mb-0">Checkout</h1>
        </motion.div>

        <motion.div variants={fadeInUp} className="d-flex flex-column gap-3">
          <p className="sank-eyebrow mb-0">Datos del cliente</p>
          <Form.Group>
            <Form.Label className="small">Nombre completo</Form.Label>
            <Form.Control value={form.customer_name} onChange={update("customer_name")} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small">Teléfono</Form.Label>
            <Form.Control value={form.customer_phone} onChange={update("customer_phone")} />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              id="whatsapp-same-as-phone"
              className="small mb-2"
              label="Mi WhatsApp es el mismo que mi celular"
              checked={whatsappSameAsPhone}
              onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
            />
            {!whatsappSameAsPhone && (
              <>
                <Form.Label className="small">WhatsApp</Form.Label>
                <Form.Control value={form.customer_whatsapp} onChange={update("customer_whatsapp")} />
              </>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label className="small">Correo</Form.Label>
            <Form.Control type="email" value={form.customer_email} onChange={update("customer_email")} />
          </Form.Group>

          <p className="sank-eyebrow mb-0 mt-2">Datos de entrega</p>
          <Form.Group>
            <Form.Label className="small">Departamento</Form.Label>
            <Form.Control value={form.department} onChange={update("department")} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small">Ciudad</Form.Label>
            <Form.Control value={form.city} onChange={update("city")} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small">Dirección</Form.Label>
            <Form.Control value={form.address} onChange={update("address")} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small">Información adicional (opcional)</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.additional_info} onChange={update("additional_info")} />
          </Form.Group>
        </motion.div>

        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          <p className="sank-eyebrow mb-0">Resumen</p>
          {items.map((item) => (
            <div key={item.product.id} className="d-flex justify-content-between small">
              <span className="text-truncate me-2">
                {item.quantity}× {item.product.name}
              </span>
              <span className="flex-shrink-0">{formatCurrency(Number(item.product.price) * item.quantity)}</span>
            </div>
          ))}
          <div
            className="pt-2 d-flex justify-content-between small text-body-secondary"
            style={{ borderTop: "1px solid var(--bs-border-color)" }}
          >
            <span>Subtotal (COP)</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="d-flex justify-content-between small text-body-secondary">
            <span>Envío (COP)</span>
            <span>Por definir</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total (COP)</span>
            <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(subtotal)}</span>
          </div>
        </motion.div>

        {orderError && (
          <motion.p variants={fadeInUp} className="small text-danger mb-0">
            {orderError}
          </motion.p>
        )}

        <motion.div variants={fadeInUp}>
          <SankButton
            className="w-100 justify-content-center"
            onClick={handleSubmit}
            loading={isSubmittingOrder}
            disabled={!isValid}
          >
            Realizar pedido
          </SankButton>
        </motion.div>
      </motion.div>
    </Container>
  )
}
