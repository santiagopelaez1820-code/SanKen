// Esta línea sirve para importar «useMemo, useRef, useState» desde «react».
import { useMemo, useRef, useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «ShoppingBag, ShoppingCart» desde «lucide-react».
import { ShoppingBag, ShoppingCart } from "lucide-react"
// Esta línea sirve para importar los tipos «Product, ProductCategory» desde «@sanken/core».
import type { Product, ProductCategory } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"
// Esta línea sirve para importar «ProductCard» desde «@/components/store/ProductCard».
import { ProductCard } from "@/components/store/ProductCard"
// Esta línea sirve para importar «CategoryChips» desde «@/components/store/CategoryChips».
import { CategoryChips } from "@/components/store/CategoryChips"
import { SourcingBanner } from "@/components/store/SourcingBanner"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «StorePage».
export function StorePage() {
  // Esta línea sirve para crear el estado «category» y su función «setCategory».
  const [category, setCategory] = useState<ProductCategory | null>(null)
  // Esta línea sirve para obtener «itemCount» con el hook «useCartStore».
  const itemCount = useCartStore((s) => s.getItemCount())
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)

  // Esta línea sirve para obtener «data: products, isLoading» con el hook «useQuery».
  const { data: products, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["store", "products"]».
    queryKey: ["store", "products"],
    // Esta línea sirve para pedir a la API los datos de «/products».
    queryFn: () => api.get<Product[]>("/products"),
  })

  // Esta línea sirve para obtener «featured» con el hook «useMemo».
  const featured = useMemo(() => (products ?? []).slice(0, 5), [products])
  // Esta línea sirve para obtener «filtered» con el hook «useMemo».
  const filtered = useMemo(
    // Esta línea sirve para filtrar los productos por la categoría elegida.
    () => (category ? (products ?? []).filter((p) => p.category === category) : (products ?? [])),
    // Esta línea sirve para volver a calcular cuando cambian los productos o la categoría.
    [products, category]
  )

  // Esta línea sirve para crear la referencia «headerRef».
  const headerRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para crear la referencia «categoryChipsRef».
  const categoryChipsRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para crear la referencia «cartLinkRef».
  const cartLinkRef = useRef<HTMLAnchorElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «tienda…».
    "tienda",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «headerRef».
        target: headerRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tienda SanKen"».
        title: "Tienda SanKen",
        // Esta línea sirve para definir la propiedad «description» con «Suplementos y merch pensados para tu ent…».
        description: "Suplementos y merch pensados para tu entrenamiento, con envío a todo el país.",
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «categoryChipsRef».
        target: categoryChipsRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Explorá por categoría"».
        title: "Explorá por categoría",
        // Esta línea sirve para definir la propiedad «description» con «Filtrá por categoría o mirá los producto…».
        description: "Filtrá por categoría o mirá los productos destacados arriba de la lista.",
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «cartLinkRef».
        target: cartLinkRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tu carrito"».
        title: "Tu carrito",
        // Esta línea sirve para definir la propiedad «description» con «Sumá productos acá y confirmá tu pedido …».
        description: "Sumá productos acá y confirmá tu pedido cuando quieras.",
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    userId
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-4». */}
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el bloque animado del título. */}
        <motion.div
          // Esta línea sirve para conectar la referencia «headerRef}» con el elemento.
          ref={headerRef}
          // Esta línea sirve para pasar la propiedad «variants» con el valor «fadeInUp}».
          variants={fadeInUp}
          // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-start justify-content-betw».
          className="d-flex align-items-start justify-content-between"
        >
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «SanKen» dentro de un «p». */}
            <p className="sank-eyebrow sank-eyebrow--cyan mb-1">SanKen</p>
            {/* Esta línea sirve para mostrar el texto «Tienda» dentro de un «h1». */}
            <h1 className="display-5 sank-stat mb-0">Tienda</h1>
          </div>
          {/* Esta línea sirve para abrir el comentario que explica por qué el carrito es fijo. */}
          {/* position: fixed (no sticky): antes se quedaba junto al título
              // Esta línea sirve para incluir el texto o las clases «Tienda…».
              "Tienda" y desaparecía apenas se bajaba en la lista de
              // Esta línea sirve para continuar el comentario sobre el carrito fijo.
              productos — el cliente tenía que volver arriba para verlo de
              // Esta línea sirve para continuar el comentario sobre el carrito fijo.
              nuevo. `sticky` no alcanzaba a "engancharse" acá porque su
              // Esta línea sirve para continuar el comentario sobre el carrito fijo.
              contenedor directo (esta fila del título) es angosto — no le
              // Esta línea sirve para continuar el comentario sobre el carrito fijo.
              daba altura de sobra para demostrar el efecto. `fixed` lo deja
              // Esta línea sirve para continuar el comentario sobre el carrito fijo.
              anclado al viewport, siempre visible sin importar el
              // Esta línea sirve para cerrar el comentario sobre el carrito fijo.
              contenedor ni cuánto se haga scroll. */}
          {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
          <Link
            // Esta línea sirve para conectar la referencia «cartLinkRef}» con el elemento.
            ref={cartLinkRef}
            // Esta línea sirve para definir el atributo «to» con el valor «/store/cart».
            to="/store/cart"
            // Esta línea sirve para aplicar las clases de estilo «position-fixed d-flex align-items-center just».
            className="position-fixed d-flex align-items-center justify-content-center rounded-2 sank-surface"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 44, height: 44, top: 76, right: 16, ».
            style={{ width: 44, height: 44, top: 76, right: 16, zIndex: 1025 }}
            // Esta línea sirve para definir el atributo «aria-label» con el valor «Ver carrito».
            aria-label="Ver carrito"
          >
            {/* Esta línea sirve para abrir el componente «ShoppingCart». */}
            <ShoppingCart size={20} />
            {/* Esta línea sirve para mostrar el bloque solo si «itemCount > 0». */}
            {itemCount > 0 && (
              // Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas.
              <span
                // Esta línea sirve para aplicar las clases de estilo «position-absolute d-flex align-items-center j».
                className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                // Esta línea sirve para pasar la propiedad «style» con el valor «{».
                style={{
                  // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «-4».
                  top: -4,
                  // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «-4».
                  right: -4,
                  // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «20».
                  minWidth: 20,
                  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «20».
                  height: 20,
                  // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
                  fontSize: 11,
                  // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--sanken-cyan)"».
                  background: "var(--sanken-cyan)",
                  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"#050505"».
                  color: "#050505",
                  // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «"0 4px"».
                  padding: "0 4px",
                }}
              >
                {/* Esta línea sirve para mostrar el contador de productos con tope en 9+. */}
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <SourcingBanner />
        </motion.div>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton style={{ height: 240, width: "100%" }} />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading». */}
        {!isLoading && (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para mostrar el bloque solo si «featured.length > 0». */}
            {featured.length > 0 && (
              // Esta línea sirve para abrir el elemento «motion.div».
              <motion.div variants={fadeInUp}>
                {/* Esta línea sirve para mostrar el texto «Destacados» dentro de un «p». */}
                <p className="sank-eyebrow mb-3">Destacados</p>
                {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-3 overflow-x-auto pb-2». */}
                <div className="d-flex gap-3 overflow-x-auto pb-2">
                  {/* Esta línea sirve para recorrer «featured» y mostrar un bloque por elemento. */}
                  {featured.map((product) => (
                    // Esta línea sirve para abrir el elemento «div».
                    <div key={product.id} style={{ minWidth: 200, maxWidth: 200 }}>
                      {/* Esta línea sirve para abrir el componente «ProductCard». */}
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Esta línea sirve para abrir el elemento «motion.div». */}
            <motion.div ref={categoryChipsRef} variants={fadeInUp}>
              {/* Esta línea sirve para abrir el componente «CategoryChips». */}
              <CategoryChips value={category} onChange={setCategory} />
            </motion.div>

            {/* Esta línea sirve para abrir el elemento «motion.div». */}
            <motion.div variants={fadeInUp}>
              {/* Esta línea sirve para elegir entre dos bloques según «filtered.length === 0». */}
              {filtered.length === 0 ? (
                // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2».
                <div className="sank-surface rounded-2">
                  {/* Esta línea sirve para abrir el elemento «SankEmptyState» con sus atributos en varias líneas. */}
                  <SankEmptyState
                    // Esta línea sirve para pasar la propiedad «icon» con el valor «ShoppingBag}».
                    icon={ShoppingBag}
                    // Esta línea sirve para definir el atributo «title» con el valor «No hay productos en esta categoría».
                    title="No hay productos en esta categoría"
                    // Esta línea sirve para definir el atributo «description» con el valor «Probá con otra categoría.».
                    description="Probá con otra categoría."
                  />
                </div>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el elemento «div» con las clases «row g-3».
                <div className="row g-3">
                  {/* Esta línea sirve para recorrer «filtered» y mostrar un bloque por elemento. */}
                  {filtered.map((product) => (
                    // Esta línea sirve para abrir el elemento «div».
                    <div key={product.id} className="col-6 col-sm-4 col-lg-3">
                      {/* Esta línea sirve para abrir el componente «ProductCard». */}
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </Container>
  )
}
