// Esta línea sirve para importar «X» desde «lucide-react».
import { X } from "lucide-react"
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from "@/components/ui/stepper"
// Esta línea sirve para importar los tipos «CartItem» desde «@/lib/cart-store».
import type { CartItem } from "@/lib/cart-store"

// Esta línea sirve para declarar la interfaz «CartItemRowProps».
interface CartItemRowProps {
  // Esta línea sirve para declarar la propiedad «item» con el valor o tipo «CartItem».
  item: CartItem
  // Esta línea sirve para declarar la propiedad «onIncrement» con el valor o tipo «() => void».
  onIncrement: () => void
  // Esta línea sirve para declarar la propiedad «onDecrement» con el valor o tipo «() => void».
  onDecrement: () => void
  // Esta línea sirve para declarar la propiedad «onRemove» con el valor o tipo «() => void».
  onRemove: () => void
}

// Esta línea sirve para declarar la fila de un producto en el carrito.
export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  // Esta línea sirve para obtener la URL de la miniatura del producto.
  const imageUrl = api.mediaUrl(item.product.image, "productThumb")
  // Esta línea sirve para calcular el subtotal de la fila.
  const lineSubtotal = Number(item.product.price) * item.quantity

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-3 d-flex flex-c».
    <div className="sank-surface rounded-2 p-3 d-flex flex-column flex-sm-row align-items-sm-center gap-3">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-3 flex-grow-1». */}
      <div className="d-flex gap-3 flex-grow-1" style={{ minWidth: 0 }}>
        {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
        <div
          // Esta línea sirve para aplicar las clases de estilo «rounded-2 flex-shrink-0».
          className="rounded-2 flex-shrink-0"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{».
          style={{
            // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «64».
            width: 64,
            // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «64».
            height: 64,
            // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «"var(--sanken-charcoal)"».
            backgroundColor: "var(--sanken-charcoal)",
            // Esta línea sirve para declarar la propiedad «backgroundImage» con el valor o tipo «imageUrl ? `url(${imageUrl})` : undefined».
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            // Esta línea sirve para declarar la propiedad «backgroundSize» con el valor o tipo «"cover"».
            backgroundSize: "cover",
            // Esta línea sirve para declarar la propiedad «backgroundPosition» con el valor o tipo «"center"».
            backgroundPosition: "center",
          }}
        />
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div style={{ minWidth: 0 }}>
          {/* Esta línea sirve para mostrar el nombre del producto. */}
          <p className="fw-semibold small mb-0 text-truncate">{item.product.name}</p>
          {/* Esta línea sirve para mostrar el precio unitario. */}
          <p className="small text-body-secondary mb-0">{formatCurrency(item.product.price)} c/u</p>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «fw-bold small mb-0». */}
          <p className="fw-bold small mb-0" style={{ color: "var(--sanken-cyan)" }}>
            {/* Esta línea sirve para mostrar el subtotal de la fila. */}
            {formatCurrency(lineSubtotal)}
          </p>
        </div>
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-sm-column align-items-center». */}
      <div className="d-flex flex-sm-column align-items-center align-items-sm-end justify-content-between gap-2 flex-shrink-0">
        {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
        <button
          // Esta línea sirve para definir el atributo «type» con el valor «button».
          type="button"
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={onRemove}
          // Esta línea sirve para definir el atributo «aria-label» con el valor «Quitar producto».
          aria-label="Quitar producto"
          // Esta línea sirve para aplicar las clases de estilo «border-0 bg-transparent text-body-secondary p».
          className="border-0 bg-transparent text-body-secondary p-0"
        >
          {/* Esta línea sirve para abrir el componente «X». */}
          <X size={16} />
        </button>
        {/* Esta línea sirve para abrir el elemento «Stepper» con sus atributos en varias líneas. */}
        <Stepper
          // Esta línea sirve para pasar la propiedad «value» con el valor «item.quantity}».
          value={item.quantity}
          // Esta línea sirve para pasar la propiedad «min» con el valor «0}».
          min={0}
          // Esta línea sirve para pasar la propiedad «max» con el valor «50}».
          max={50}
          // Esta línea sirve para asignar el manejador del evento «onChange».
          onChange={(next) => (next > item.quantity ? onIncrement() : onDecrement())}
        />
      </div>
    </div>
  )
}
