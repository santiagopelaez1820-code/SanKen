import { useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import type { Product, ProductCategory } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useCartStore } from "@/lib/cart-store"
import { Skeleton } from "@/components/ui/skeleton"
import { SankEmptyState } from "@/components/ui/SankEmptyState"
import { ProductCard } from "@/components/store/ProductCard"
import { CategoryChips } from "@/components/store/CategoryChips"
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
import { useTutorial } from "@/hooks/use-tutorial"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function StorePage() {
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const itemCount = useCartStore((s) => s.getItemCount())
  const userId = useAuthStore((s) => s.user?.id)

  const { data: products, isLoading } = useQuery({
    queryKey: ["store", "products"],
    queryFn: () => api.get<Product[]>("/products"),
  })

  const featured = useMemo(() => (products ?? []).slice(0, 5), [products])
  const filtered = useMemo(
    () => (category ? (products ?? []).filter((p) => p.category === category) : (products ?? [])),
    [products, category]
  )

  const headerRef = useRef<HTMLDivElement>(null)
  const categoryChipsRef = useRef<HTMLDivElement>(null)
  const cartLinkRef = useRef<HTMLAnchorElement>(null)
  const tutorial = useTutorial(
    "tienda",
    [
      {
        target: headerRef,
        title: "SanKen Store",
        description: "Suplementos y merch pensados para tu entrenamiento, con envío a todo el país.",
      },
      {
        target: categoryChipsRef,
        title: "Explorá por categoría",
        description: "Filtrá por categoría o mirá los productos destacados arriba de la lista.",
      },
      {
        target: cartLinkRef,
        title: "Tu carrito",
        description: "Sumá productos acá y confirmá tu pedido cuando quieras.",
      },
    ],
    !isLoading,
    userId
  )

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div
          ref={headerRef}
          variants={fadeInUp}
          className="d-flex align-items-start justify-content-between"
        >
          <div>
            <p className="sank-eyebrow sank-eyebrow--cyan mb-1">SanKen</p>
            <h1 className="display-5 sank-stat mb-0">Store</h1>
          </div>
          {/* position: fixed (no sticky): antes se quedaba junto al título
              "Store" y desaparecía apenas se bajaba en la lista de
              productos — el cliente tenía que volver arriba para verlo de
              nuevo. `sticky` no alcanzaba a "engancharse" acá porque su
              contenedor directo (esta fila del título) es angosto — no le
              daba altura de sobra para demostrar el efecto. `fixed` lo deja
              anclado al viewport, siempre visible sin importar el
              contenedor ni cuánto se haga scroll. */}
          <Link
            ref={cartLinkRef}
            to="/store/cart"
            className="position-fixed d-flex align-items-center justify-content-center rounded-2 sank-surface"
            style={{ width: 44, height: 44, top: 76, right: 16, zIndex: 1025 }}
            aria-label="Ver carrito"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span
                className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{
                  top: -4,
                  right: -4,
                  minWidth: 20,
                  height: 20,
                  fontSize: 11,
                  background: "var(--sanken-cyan)",
                  color: "#050505",
                  padding: "0 4px",
                }}
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </motion.div>

        {isLoading && <Skeleton style={{ height: 240, width: "100%" }} />}

        {!isLoading && (
          <>
            {featured.length > 0 && (
              <motion.div variants={fadeInUp}>
                <p className="sank-eyebrow mb-3">Destacados</p>
                <div className="d-flex gap-3 overflow-x-auto pb-2">
                  {featured.map((product) => (
                    <div key={product.id} style={{ minWidth: 200, maxWidth: 200 }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div ref={categoryChipsRef} variants={fadeInUp}>
              <CategoryChips value={category} onChange={setCategory} />
            </motion.div>

            <motion.div variants={fadeInUp}>
              {filtered.length === 0 ? (
                <div className="sank-surface rounded-2">
                  <SankEmptyState
                    icon={ShoppingBag}
                    title="No hay productos en esta categoría"
                    description="Probá con otra categoría."
                  />
                </div>
              ) : (
                <div className="row g-3">
                  {filtered.map((product) => (
                    <div key={product.id} className="col-6 col-sm-4 col-lg-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>

      <TutorialOverlay tutorial={tutorial} />
    </Container>
  )
}
