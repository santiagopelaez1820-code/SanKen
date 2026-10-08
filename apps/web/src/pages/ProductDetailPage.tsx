// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link, useNavigate, useParams» desde «react-router-dom».
import { Link, useNavigate, useParams } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «ChevronLeft, ShoppingBag» desde «lucide-react».
import { ChevronLeft, ShoppingBag } from "lucide-react"
// Esta línea sirve para importar «formatCurrency, type Product» desde «@sanken/core».
import { formatCurrency, type Product } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «SankBadge» desde «@/components/ui/SankBadge».
import { SankBadge } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from "@/components/ui/stepper"
// Esta línea sirve para importar «CATEGORY_LABELS» desde «@/components/store/CategoryChips».
import { CATEGORY_LABELS } from "@/components/store/CategoryChips"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «ProductDetailPage».
export function ProductDetailPage() {
  // Esta línea sirve para extraer «productId» de «useParams<{ productId: string }>()».
  const { productId } = useParams<{ productId: string }>()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «addItem» con el hook «useCartStore».
  const addItem = useCartStore((s) => s.addItem)
  // Esta línea sirve para crear el estado «quantity» y su función «setQuantity».
  const [quantity, setQuantity] = useState(1)

  // Esta línea sirve para obtener «data: product, isLoading» con el hook «useQuery».
  const { data: product, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["store", "products", productId]».
    queryKey: ["store", "products", productId],
    // Esta línea sirve para pedir a la API los datos de «/products/${productId}».
    queryFn: () => api.get<Product>(`/products/${productId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(productId)».
    enabled: Boolean(productId),
  })

  // Esta línea sirve para revisar si «isLoading || !product».
  if (isLoading || !product) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «Container».
      <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton style={{ height: 400, width: "100%" }} />
      </Container>
    )
  }

  // Esta línea sirve para extraer «mageUr» de «api.mediaUrl(product.image, "productDeta».
  const imageUrl = api.mediaUrl(product.image, "productDetail")

  // Esta línea sirve para extraer «andleAd» de «() => {».
  const handleAdd = () => {
    // Esta línea sirve para llamar a «addItem» con «product, quantity».
    addItem(product, quantity)
    // Esta línea sirve para llamar a «navigate» con «"/store/cart"».
    navigate("/store/cart")
  }

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
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none"
          >
            {/* Esta línea sirve para mostrar el texto del enlace de volver. */}
            <ChevronLeft size={16} /> Tienda
          </Link>
        </motion.div>

        {/* Esta línea sirve para abrir el bloque animado de la imagen. */}
        <motion.div
          // Esta línea sirve para pasar la propiedad «variants» con el valor «fadeInUp}».
          variants={fadeInUp}
          // Esta línea sirve para aplicar las clases de estilo «rounded-3 d-flex align-items-center justify-c».
          className="rounded-3 d-flex align-items-center justify-content-center"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{».
          style={{
            // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «320».
            height: 320,
            // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «"var(--sanken-charcoal)"».
            backgroundColor: "var(--sanken-charcoal)",
            // Esta línea sirve para declarar la propiedad «backgroundImage» con el valor o tipo «imageUrl».
            backgroundImage: imageUrl
              // Esta línea sirve para usar la imagen del producto como fondo.
              ? `url(${imageUrl})`
              // Esta línea sirve para usar un degradado de la marca si no hay imagen.
              : "radial-gradient(120% 140% at 15% 0%, rgba(0, 184, 217, 0.28), transparent 60%), linear-gradient(155deg, var(--sanken-charcoal), var(--sanken-black-2))",
            // Esta línea sirve para declarar la propiedad «backgroundSize» con el valor o tipo «"cover"».
            backgroundSize: "cover",
            // Esta línea sirve para declarar la propiedad «backgroundPosition» con el valor o tipo «"center"».
            backgroundPosition: "center",
          }}
        >
          {/* Esta línea sirve para mostrar el elemento solo si «!imageUrl». */}
          {!imageUrl && <ShoppingBag size={48} className="text-body-secondary" style={{ opacity: 0.6 }} />}
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para mostrar el valor «CATEGORY_LABELS[product.category]» dentro de «SankBadge». */}
          <SankBadge variant="cyan">{CATEGORY_LABELS[product.category]}</SankBadge>
          {/* Esta línea sirve para mostrar el valor «product.name» dentro de un «h1». */}
          <h1 className="fs-3 fw-bold mt-2 mb-1">{product.name}</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «fs-4 fw-bold mb-3». */}
          <p className="fs-4 fw-bold mb-3" style={{ color: "var(--sanken-cyan)" }}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(product.price)}». */}
            {formatCurrency(product.price)}
          </p>
          {/* Esta línea sirve para mostrar el valor «product.description» dentro de un «p». */}
          <p className="text-body-secondary mb-0">{product.description}</p>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          {/* Esta línea sirve para mostrar el texto «Cantidad» dentro de un «span». */}
          <span className="fw-semibold">Cantidad</span>
          {/* Esta línea sirve para abrir el componente «Stepper». */}
          <Stepper value={quantity} min={1} max={50} onChange={setQuantity} />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «SankButton». */}
          <SankButton className="w-100 justify-content-center" onClick={handleAdd}>
            {/* Esta línea sirve para mostrar el texto «Agregar al carrito». */}
            Agregar al carrito
          </SankButton>
        </motion.div>
      </motion.div>
    </Container>
  )
}
