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
 * Timeline horizontal del progreso del pedido para el panel admin (Tailwind).
 * `problem`/`cancelled` son estados especiales: no se dibujan como "paso N
 * de 5", se muestra un aviso aparte. El cálculo de qué mostrar vive en
 * `lib/order-timeline.ts` (compartido con components/store/OrderTimeline.tsx).
 */
// Esta línea sirve para declarar el componente que dibuja la línea de tiempo de un pedido.
export function OrderTimeline({ status }: OrderTimelineProps) {
  // Esta línea sirve para calcular los pasos o el estado especial del pedido.
  const timeline = getOrderTimeline(status)

  // Esta línea sirve para revisar si el estado es especial (problema o cancelado).
  if (timeline.kind === "special") {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
      <div
        // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
        className={cn(
          // Esta línea sirve para aplicar las clases base de la caja del estado especial.
          "flex items-center gap-2 rounded-lg border px-3 py-2",
          // Esta línea sirve para elegir los colores según si hay un problema.
          timeline.isProblem
            // Esta línea sirve para usar el color de error cuando hay un problema.
            ? "border-destructive/35 bg-destructive/10 text-destructive"
            // Esta línea sirve para usar el color neutro cuando está cancelado.
            : "border-border bg-muted text-muted-foreground"
        )}
      >
        {/* Esta línea sirve para mostrar un ícono de alerta o una X según el estado. */}
        {timeline.isProblem ? <TriangleAlert size={16} className="shrink-0" /> : <X size={16} className="shrink-0" />}
        {/* Esta línea sirve para mostrar la etiqueta del estado. */}
        <span className="text-sm font-medium">{timeline.label}</span>
      </div>
    )
  }

  // En celular los 5 pasos no entran en una fila: se apilan en vertical
  // (círculo + etiqueta al lado); desde sm vuelve a ser la línea horizontal.
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-2 sm:flex-row sm:items».
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
      {/* Esta línea sirve para recorrer «timeline.steps» y mostrar un bloque por elemento. */}
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }, index) => (
        // Esta línea sirve para abrir el elemento «div».
        <div key={step} className={cn("flex items-center", !isLast && "sm:flex-1")}>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2 sm:flex-col sm:g». */}
          <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
            {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
            <div
              // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
              className={cn(
                // Esta línea sirve para aplicar las clases base del círculo del paso.
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                // Esta línea sirve para pintar el círculo de color primario si el paso está hecho o es el actual.
                isDone || isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                // Esta línea sirve para agregar un halo al paso actual.
                isCurrent && "ring-4 ring-primary/20"
              )}
            >
              {/* Esta línea sirve para mostrar una marca si el paso está hecho o el número del paso. */}
              {isDone ? <Check size={13} /> : index + 1}
            </div>
            {/* Esta línea sirve para abrir el elemento «span». */}
            <span className={cn("text-sm leading-tight sm:max-w-20 sm:text-center sm:text-[0.7rem]", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {/* Esta línea sirve para mostrar el valor «label». */}
              {label}
            </span>
          </div>
          {/* Esta línea sirve para mostrar el bloque solo si «!isLast». */}
          {!isLast && (
            // Esta línea sirve para abrir el elemento «div».
            <div className={cn("mx-1 mb-5 hidden h-0.5 flex-1 sm:block", isDone ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  )
}
