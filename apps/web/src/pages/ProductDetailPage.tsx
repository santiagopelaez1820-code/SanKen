import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { ChevronLeft, ShoppingBag } from "lucide-react"
import { formatCurrency, type Product } from "@sanken/core"
import { api } from "@/lib/api"
import { useCartStore } from "@/lib/cart-store"
import { Skeleton } from "@/components/ui/skeleton"
import { SankButton } from "@/components/ui/SankButton"
import { SankBadge } from "@/components/ui/SankBadge"
import { Stepper } from "@/components/ui/stepper"
import { CATEGORY_LABELS } from "@/components/store/CategoryChips"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ["store", "products", productId],
    queryFn: () => api.get<Product>(`/products/${productId}`),
    enabled: Boolean(productId),
  })

  if (isLoading || !product) {
    return (
      <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
        <Skeleton style={{ height: 400, width: "100%" }} />
      </Container>
    )
  }

  const imageUrl = api.mediaUrl(product.image)

  const handleAdd = () => {
    addItem(product, quantity)
    navigate("/store/cart")
  }

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 720 }}>
      <motion.div className="d-flex flex-column gap-3" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <Link
            to="/store"
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none"
          >
            <ChevronLeft size={16} /> Tienda
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{
            height: 320,
            backgroundColor: "var(--sanken-charcoal)",
            backgroundImage: imageUrl
              ? `url(${imageUrl})`
              : "radial-gradient(120% 140% at 15% 0%, rgba(0, 184, 217, 0.28), transparent 60%), linear-gradient(155deg, var(--sanken-charcoal), var(--sanken-black-2))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!imageUrl && <ShoppingBag size={48} className="text-body-secondary" style={{ opacity: 0.6 }} />}
        </motion.div>

        <motion.div variants={fadeInUp}>
          <SankBadge variant="cyan">{CATEGORY_LABELS[product.category]}</SankBadge>
          <h1 className="fs-3 fw-bold mt-2 mb-1">{product.name}</h1>
          <p className="fs-4 fw-bold mb-3" style={{ color: "var(--sanken-cyan)" }}>
            {formatCurrency(product.price)}
          </p>
          <p className="text-body-secondary mb-0">{product.description}</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span className="fw-semibold">Cantidad</span>
          <Stepper value={quantity} min={1} max={50} onChange={setQuantity} />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <SankButton className="w-100 justify-content-center" onClick={handleAdd}>
            Agregar al carrito
          </SankButton>
        </motion.div>
      </motion.div>
    </Container>
  )
}
