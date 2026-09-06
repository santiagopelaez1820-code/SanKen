import { X } from "lucide-react"
import { formatCurrency } from "@sanken/core"
import { api } from "@/lib/api"
import { Stepper } from "@/components/ui/stepper"
import type { CartItem } from "@/lib/cart-store"

interface CartItemRowProps {
  item: CartItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const imageUrl = api.mediaUrl(item.product.image)
  const lineSubtotal = Number(item.product.price) * item.quantity

  return (
    <div className="sank-surface rounded-2 p-3 d-flex flex-column flex-sm-row align-items-sm-center gap-3">
      <div className="d-flex gap-3 flex-grow-1" style={{ minWidth: 0 }}>
        <div
          className="rounded-2 flex-shrink-0"
          style={{
            width: 64,
            height: 64,
            backgroundColor: "var(--sanken-charcoal)",
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <p className="fw-semibold small mb-0 text-truncate">{item.product.name}</p>
          <p className="small text-body-secondary mb-0">{formatCurrency(item.product.price)} c/u</p>
          <p className="fw-bold small mb-0" style={{ color: "var(--sanken-cyan)" }}>
            {formatCurrency(lineSubtotal)}
          </p>
        </div>
      </div>

      <div className="d-flex flex-sm-column align-items-center align-items-sm-end justify-content-between gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar producto"
          className="border-0 bg-transparent text-body-secondary p-0"
        >
          <X size={16} />
        </button>
        <Stepper
          value={item.quantity}
          min={0}
          max={50}
          onChange={(next) => (next > item.quantity ? onIncrement() : onDecrement())}
        />
      </div>
    </div>
  )
}
