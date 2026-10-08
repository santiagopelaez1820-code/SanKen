// Esta línea sirve para importar «Check, TriangleAlert, X» desde «lucide-react».
import { Check, TriangleAlert, X } from "lucide-react"
// Esta línea sirve para importar los tipos «OrderStatus» desde «@sanken/core».
import type { OrderStatus } from "@sanken/core"
// Esta línea sirve para importar «getOrderTimeline» desde «@/lib/order-timeline».
import { getOrderTimeline } from "@/lib/order-timeline"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «OrderTimelineProps».
interface OrderTimelineProps {
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «OrderStatus».
  status: OrderStatus
}

/**
 * Timeline vertical del progreso del pedido para las páginas de cliente
 * (Sank* + Bootstrap). `problem`/`cancelled` son estados especiales: no se
 * dibujan como "paso N de 5", se muestra un aviso aparte. El cálculo de qué
 * mostrar vive en `lib/order-timeline.ts` (compartido con
 * components/admin/OrderTimeline.tsx).
 */
// Esta línea sirve para declarar la línea de tiempo del pedido en la tienda.
export function OrderTimeline({ status }: OrderTimelineProps) {
  // Esta línea sirve para calcular los pasos o el estado especial del pedido.
  const timeline = getOrderTimeline(status)

  // Esta línea sirve para revisar si el estado es especial (problema o cancelado).
  if (timeline.kind === "special") {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
      <div
        // Esta línea sirve para aplicar las clases de estilo «rounded-2 p-3 d-flex align-items-center gap-2».
        className="rounded-2 p-3 d-flex align-items-center gap-2"
        // Esta línea sirve para pasar la propiedad «style» con el valor «{».
        style={{
          // Esta línea sirve para elegir el color de fondo según si hay problema.
          backgroundColor: timeline.isProblem ? "rgba(220, 53, 69, 0.12)" : "rgba(108, 117, 125, 0.12)",
          // Esta línea sirve para elegir el color del borde según si hay problema.
          border: `1px solid ${timeline.isProblem ? "rgba(220, 53, 69, 0.35)" : "rgba(108, 117, 125, 0.35)"}`,
        }}
      >
        {/* Esta línea sirve para elegir entre dos bloques según «timeline.isProblem». */}
        {timeline.isProblem ? (
          // Esta línea sirve para abrir el componente «TriangleAlert».
          <TriangleAlert size={18} className="text-danger flex-shrink-0" />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el componente «X».
          <X size={18} className="text-body-secondary flex-shrink-0" />
        )}
        {/* Esta línea sirve para abrir el elemento «span». */}
        <span className={cn("small fw-semibold", timeline.isProblem ? "text-danger" : "text-body-secondary")}>
          {/* Esta línea sirve para mostrar el valor «timeline.label». */}
          {timeline.label}
        </span>
      </div>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column».
    <div className="d-flex flex-column">
      {/* Esta línea sirve para recorrer «timeline.steps» y mostrar un bloque por elemento. */}
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }, index) => (
        // Esta línea sirve para abrir el elemento «div».
        <div key={step} className="d-flex">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column align-items-center». */}
          <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
            {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
            <div
              // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{».
              style={{
                // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «24».
                width: 24,
                // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «24».
                height: 24,
                // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «isDone».
                backgroundColor: isDone
                  // Esta línea sirve para pintar el paso con el color de acento si está hecho.
                  ? "var(--sanken-cyan)"
                  // Esta línea sirve para revisar si es el paso actual.
                  : isCurrent
                    // Esta línea sirve para pintar el paso actual con el color de acento.
                    ? "var(--sanken-cyan)"
                    // Esta línea sirve para usar el color neutro en los pasos pendientes.
                    : "var(--bs-secondary-bg)",
                // Esta línea sirve para elegir el color del texto según el estado del paso.
                color: isDone || isCurrent ? "#0b0b0b" : "var(--bs-body-color)",
                // Esta línea sirve para agregar un halo al paso actual.
                boxShadow: isCurrent ? "0 0 0 4px rgba(0, 184, 217, 0.2)" : undefined,
              }}
            >
              {/* Esta línea sirve para mostrar una marca si el paso está hecho o el número del paso. */}
              {isDone ? <Check size={14} /> : <span className="small fw-bold">{index + 1}</span>}
            </div>
            {/* Esta línea sirve para mostrar el bloque solo si «!isLast». */}
            {!isLast && (
              // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
              <div
                // Esta línea sirve para pasar la propiedad «style» con el valor «{».
                style={{
                  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «2».
                  width: 2,
                  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
                  flex: 1,
                  // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «24».
                  minHeight: 24,
                  // Esta línea sirve para pintar la línea con el color de acento si el paso está hecho.
                  backgroundColor: isDone ? "var(--sanken-cyan)" : "var(--bs-border-color)",
                }}
              />
            )}
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div className={cn("pb-3 ps-2", isLast && "pb-0")}>
            {/* Esta línea sirve para mostrar la etiqueta del paso con énfasis si es el actual. */}
            <span className={cn("small", isCurrent ? "fw-bold" : isDone ? "" : "text-body-secondary")}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
