// Esta línea sirve para importar «useState, type ChangeEvent» desde «react».
import { useState, type ChangeEvent } from "react"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container, Form» desde «react-bootstrap».
import { Container, Form } from "react-bootstrap"
// Esta línea sirve para importar «ChevronLeft» desde «lucide-react».
import { ChevronLeft } from "lucide-react"
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la interfaz «CheckoutForm».
interface CheckoutForm {
  // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «string».
  customer_name: string
  // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «string».
  customer_email: string
  // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «string».
  customer_phone: string
  // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «string».
  customer_whatsapp: string
  // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «string».
  department: string
  // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «string».
  city: string
  // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «string».
  address: string
  // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «string».
  additional_info: string
}

// Esta línea sirve para declarar la función «CheckoutPage».
export function CheckoutPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user)
  // Esta línea sirve para obtener «items» con el hook «useCartStore».
  const items = useCartStore((s) => s.items)
  // Esta línea sirve para obtener «subtotal» con el hook «useCartStore».
  const subtotal = useCartStore((s) => s.getSubtotal())
  // Esta línea sirve para obtener «isSubmittingOrder» con el hook «useCartStore».
  const isSubmittingOrder = useCartStore((s) => s.isSubmittingOrder)
  // Esta línea sirve para obtener «orderError» con el hook «useCartStore».
  const orderError = useCartStore((s) => s.orderError)
  // Esta línea sirve para obtener «submitOrder» con el hook «useCartStore».
  const submitOrder = useCartStore((s) => s.submitOrder)

  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState<CheckoutForm>({
    // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «user?.name ?? ""».
    customer_name: user?.name ?? "",
    // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «user?.email ?? ""».
    customer_email: user?.email ?? "",
    // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «""».
    customer_phone: "",
    // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «""».
    customer_whatsapp: "",
    // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «""».
    department: "",
    // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «""».
    city: "",
    // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «""».
    address: "",
    // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «""».
    additional_info: "",
  })
  // Esta línea sirve para crear el estado «whatsappSameAsPhone» y su función «setWhatsappSameAsPhone».
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true)

  // Esta línea sirve para extraer «pdat» de «(key: keyof CheckoutForm) => (e: ChangeE».
  const update = (key: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    // Esta línea sirve para llamar a «setForm» con «(f) => ({ ...f, [key]: e.target.value })».
    setForm((f) => ({ ...f, [key]: e.target.value }))

  // Esta línea sirve para extraer «esolvedWhatsap» de «whatsappSameAsPhone ? form.customer_phon».
  const resolvedWhatsapp = whatsappSameAsPhone ? form.customer_phone : form.customer_whatsapp

  // Esta línea sirve para extraer «sVali» de «Boolean(».
  const isValid = Boolean(
    // Esta línea sirve para exigir el nombre del cliente.
    form.customer_name.trim() &&
      // Esta línea sirve para exigir el correo del cliente.
      form.customer_email.trim() &&
      // Esta línea sirve para exigir el teléfono del cliente.
      form.customer_phone.trim() &&
      // Esta línea sirve para exigir el WhatsApp resuelto.
      resolvedWhatsapp.trim() &&
      // Esta línea sirve para exigir el departamento.
      form.department.trim() &&
      // Esta línea sirve para exigir la ciudad.
      form.city.trim() &&
      // Esta línea sirve para llamar a «form.address.trim».
      form.address.trim()
  )

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para esperar «submitOrder({» y guardar el resultado en «order».
    const order = await submitOrder({
      // Esta línea sirve para copiar las propiedades de «form».
      ...form,
      // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «resolvedWhatsapp.trim()».
      customer_whatsapp: resolvedWhatsapp.trim(),
      // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «form.additional_info.trim() || null».
      additional_info: form.additional_info.trim() || null,
    })
    // Esta línea sirve para navegar a la confirmación del pedido si se creó.
    if (order) navigate(`/store/confirmation/${order.id}`)
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
            // Esta línea sirve para definir el atributo «to» con el valor «/store/cart».
            to="/store/cart"
            // Esta línea sirve para aplicar las clases de estilo «d-inline-flex align-items-center gap-1 small ».
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none mb-2"
          >
            {/* Esta línea sirve para mostrar el texto del enlace de volver. */}
            <ChevronLeft size={16} /> Carrito
          </Link>
          {/* Esta línea sirve para mostrar el texto «Checkout» dentro de un «h1». */}
          <h1 className="fs-3 fw-bold mb-0">Checkout</h1>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="d-flex flex-column gap-3">
          {/* Esta línea sirve para mostrar el texto «Datos del cliente» dentro de un «p». */}
          <p className="sank-eyebrow mb-0">Datos del cliente</p>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Nombre completo» dentro de «Form.Label». */}
            <Form.Label className="small">Nombre completo</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control value={form.customer_name} onChange={update("customer_name")} />
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Teléfono» dentro de «Form.Label». */}
            <Form.Label className="small">Teléfono</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control value={form.customer_phone} onChange={update("customer_phone")} />
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para abrir la casilla de verificación. */}
            <Form.Check
              // Esta línea sirve para definir el atributo «type» con el valor «checkbox».
              type="checkbox"
              // Esta línea sirve para definir el atributo «id» con el valor «whatsapp-same-as-phone».
              id="whatsapp-same-as-phone"
              // Esta línea sirve para aplicar las clases de estilo «small mb-2».
              className="small mb-2"
              // Esta línea sirve para definir el atributo «label» con el valor «Mi WhatsApp es el mismo que mi celular».
              label="Mi WhatsApp es el mismo que mi celular"
              // Esta línea sirve para pasar la propiedad «checked» con el valor «whatsappSameAsPhone}».
              checked={whatsappSameAsPhone}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
            />
            {/* Esta línea sirve para mostrar el bloque solo si «!whatsappSameAsPhone». */}
            {!whatsappSameAsPhone && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para mostrar el texto «WhatsApp» dentro de «Form.Label». */}
                <Form.Label className="small">WhatsApp</Form.Label>
                {/* Esta línea sirve para abrir el componente «Form.Control». */}
                <Form.Control value={form.customer_whatsapp} onChange={update("customer_whatsapp")} />
              </>
            )}
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Correo» dentro de «Form.Label». */}
            <Form.Label className="small">Correo</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control type="email" value={form.customer_email} onChange={update("customer_email")} />
          </Form.Group>

          {/* Esta línea sirve para mostrar el texto «Datos de entrega» dentro de un «p». */}
          <p className="sank-eyebrow mb-0 mt-2">Datos de entrega</p>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Departamento» dentro de «Form.Label». */}
            <Form.Label className="small">Departamento</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control value={form.department} onChange={update("department")} />
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Ciudad» dentro de «Form.Label». */}
            <Form.Label className="small">Ciudad</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control value={form.city} onChange={update("city")} />
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Dirección» dentro de «Form.Label». */}
            <Form.Label className="small">Dirección</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control value={form.address} onChange={update("address")} />
          </Form.Group>
          {/* Esta línea sirve para abrir el componente «Form.Group». */}
          <Form.Group>
            {/* Esta línea sirve para mostrar el texto «Información adicional (opcional)» dentro de «Form.Label». */}
            <Form.Label className="small">Información adicional (opcional)</Form.Label>
            {/* Esta línea sirve para abrir el componente «Form.Control». */}
            <Form.Control as="textarea" rows={2} value={form.additional_info} onChange={update("additional_info")} />
          </Form.Group>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="sank-surface rounded-2 p-3 d-flex flex-column gap-2">
          {/* Esta línea sirve para mostrar el texto «Resumen» dentro de un «p». */}
          <p className="sank-eyebrow mb-0">Resumen</p>
          {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
          {items.map((item) => (
            // Esta línea sirve para abrir el elemento «div».
            <div key={item.product.id} className="d-flex justify-content-between small">
              {/* Esta línea sirve para abrir el elemento «span» con las clases «text-truncate me-2». */}
              <span className="text-truncate me-2">
                {/* Esta línea sirve para mostrar el contenido dinámico «{item.quantity}× {item.product.name}». */}
                {item.quantity}× {item.product.name}
              </span>
              {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
              <span className="flex-shrink-0">{formatCurrency(Number(item.product.price) * item.quantity)}</span>
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
            {/* Esta línea sirve para mostrar el valor «formatCurrency(subtotal)» dentro de un «span». */}
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between small tex». */}
          <div className="d-flex justify-content-between small text-body-secondary">
            {/* Esta línea sirve para mostrar el texto «Envío (COP)» dentro de un «span». */}
            <span>Envío (COP)</span>
            {/* Esta línea sirve para mostrar el texto «Por definir» dentro de un «span». */}
            <span>Por definir</span>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between fw-bold». */}
          <div className="d-flex justify-content-between fw-bold">
            {/* Esta línea sirve para mostrar el texto «Total (COP)» dentro de un «span». */}
            <span>Total (COP)</span>
            {/* Esta línea sirve para mostrar el valor «formatCurrency(subtotal)» dentro de un «span». */}
            <span style={{ color: "var(--sanken-cyan)" }}>{formatCurrency(subtotal)}</span>
          </div>
        </motion.div>

        {/* Esta línea sirve para mostrar el bloque solo si «orderError». */}
        {orderError && (
          // Esta línea sirve para abrir el elemento «motion.p».
          <motion.p variants={fadeInUp} className="small text-danger mb-0">
            {/* Esta línea sirve para mostrar el valor «orderError». */}
            {orderError}
          </motion.p>
        )}

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
          <SankButton
            // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
            className="w-100 justify-content-center"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={handleSubmit}
            // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmittingOrder}».
            loading={isSubmittingOrder}
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «!isValid}».
            disabled={!isValid}
          >
            {/* Esta línea sirve para mostrar el texto «Realizar pedido». */}
            Realizar pedido
          </SankButton>
        </motion.div>
      </motion.div>
    </Container>
  )
}
