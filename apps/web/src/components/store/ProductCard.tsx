// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «ShoppingBag» desde «lucide-react».
import { ShoppingBag } from "lucide-react"
// Esta línea sirve para importar «formatCurrency, type Product» desde «@sanken/core».
import { formatCurrency, type Product } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «SankCard, SankCardHero» desde «@/components/ui/SankCard».
import { SankCard, SankCardHero } from "@/components/ui/SankCard"

// Esta línea sirve para declarar la tarjeta de un producto.
export function ProductCard({ product }: { product: Product }) {
  // Esta línea sirve para obtener «addItem» con el hook «useCartStore».
  const addItem = useCartStore((s) => s.addItem)
  // Esta línea sirve para obtener la URL de la imagen de la tarjeta.
  const imageUrl = api.mediaUrl(product.image, "productCard")

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «SankCard».
    <SankCard interactive className="h-100 d-flex flex-column">
      {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
      <Link
        // Esta línea sirve para pasar la propiedad «to» con el valor «`/store/${product.id}`}».
        to={`/store/${product.id}`}
        // Esta línea sirve para aplicar las clases de estilo «text-decoration-none text-reset d-flex flex-c».
        className="text-decoration-none text-reset d-flex flex-column flex-grow-1"
      >
        {/* Esta línea sirve para abrir el componente «SankCardHero». */}
        <SankCardHero image={imageUrl ?? undefined} height={140}>
          {/* Esta línea sirve para mostrar el elemento solo si «!imageUrl». */}
          {!imageUrl && <ShoppingBag size={28} className="text-body-secondary mx-auto" style={{ opacity: 0.6 }} />}
        </SankCardHero>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «p-3 d-flex flex-column flex-grow-1». */}
        <div className="p-3 d-flex flex-column flex-grow-1">
          {/* Esta línea sirve para mostrar el nombre del producto. */}
          <p className="fw-bold small mb-1 text-truncate">{product.name}</p>
          {/* Esta línea sirve para abrir el elemento «p» con sus atributos en varias líneas. */}
          <p
            // Esta línea sirve para aplicar las clases de estilo «small text-body-secondary mb-2».
            className="small text-body-secondary mb-2"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{».
            style={{
              // Esta línea sirve para declarar la propiedad «display» con el valor o tipo «"-webkit-box"».
              display: "-webkit-box",
              // Esta línea sirve para declarar la propiedad «WebkitLineClamp» con el valor o tipo «2».
              WebkitLineClamp: 2,
              // Esta línea sirve para declarar la propiedad «WebkitBoxOrient» con el valor o tipo «"vertical"».
              WebkitBoxOrient: "vertical",
              // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «"hidden"».
              overflow: "hidden",
              // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «"2.5em"».
              minHeight: "2.5em",
            }}
          >
            {/* Esta línea sirve para mostrar el valor «product.short_description». */}
            {product.short_description}
          </p>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «fw-bold mt-auto mb-0». */}
          <p className="fw-bold mt-auto mb-0" style={{ color: "var(--sanken-cyan)" }}>
            {/* Esta línea sirve para mostrar el precio formateado. */}
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «px-3 pb-3». */}
      <div className="px-3 pb-3">
        {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
        <SankButton
          // Esta línea sirve para definir el atributo «size» con el valor «sm».
          size="sm"
          // Esta línea sirve para definir el atributo «variant» con el valor «outline».
          variant="outline"
          // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
          className="w-100 justify-content-center"
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => addItem(product, 1)}
        >
          {/* Esta línea sirve para mostrar el texto «Agregar». */}
          Agregar
        </SankButton>
      </div>
    </SankCard>
  )
}
