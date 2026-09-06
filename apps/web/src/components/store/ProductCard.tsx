import { Link } from "react-router-dom"
import { ShoppingBag } from "lucide-react"
import { formatCurrency, type Product } from "@sanken/core"
import { api } from "@/lib/api"
import { useCartStore } from "@/lib/cart-store"
import { SankButton } from "@/components/ui/SankButton"
import { SankCard, SankCardHero } from "@/components/ui/SankCard"

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const imageUrl = api.mediaUrl(product.image)

  return (
    <SankCard interactive className="h-100 d-flex flex-column">
      <Link
        to={`/store/${product.id}`}
        className="text-decoration-none text-reset d-flex flex-column flex-grow-1"
      >
        <SankCardHero image={imageUrl ?? undefined} height={140}>
          {!imageUrl && <ShoppingBag size={28} className="text-body-secondary mx-auto" style={{ opacity: 0.6 }} />}
        </SankCardHero>
        <div className="p-3 d-flex flex-column flex-grow-1">
          <p className="fw-bold small mb-1 text-truncate">{product.name}</p>
          <p
            className="small text-body-secondary mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.5em",
            }}
          >
            {product.short_description}
          </p>
          <p className="fw-bold mt-auto mb-0" style={{ color: "var(--sanken-cyan)" }}>
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <SankButton
          size="sm"
          variant="outline"
          className="w-100 justify-content-center"
          onClick={() => addItem(product, 1)}
        >
          Agregar
        </SankButton>
      </div>
    </SankCard>
  )
}
