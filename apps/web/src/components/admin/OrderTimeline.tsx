import { Check, TriangleAlert, X } from "lucide-react"
import type { OrderStatus } from "@sanken/core"
import { getOrderTimeline } from "@/lib/order-timeline"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  status: OrderStatus
}

/**
 * Timeline horizontal del progreso del pedido para el panel admin (Tailwind).
 * `problem`/`cancelled` son estados especiales: no se dibujan como "paso N
 * de 5", se muestra un aviso aparte. El cálculo de qué mostrar vive en
 * `lib/order-timeline.ts` (compartido con components/store/OrderTimeline.tsx).
 */
export function OrderTimeline({ status }: OrderTimelineProps) {
  const timeline = getOrderTimeline(status)

  if (timeline.kind === "special") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2",
          timeline.isProblem
            ? "border-destructive/35 bg-destructive/10 text-destructive"
            : "border-border bg-muted text-muted-foreground"
        )}
      >
        {timeline.isProblem ? <TriangleAlert size={16} className="shrink-0" /> : <X size={16} className="shrink-0" />}
        <span className="text-sm font-medium">{timeline.label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }, index) => (
        <div key={step} className={cn("flex items-center", !isLast && "flex-1")}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isDone || isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                isCurrent && "ring-4 ring-primary/20"
              )}
            >
              {isDone ? <Check size={13} /> : index + 1}
            </div>
            <span className={cn("text-center text-[0.7rem] leading-tight", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")} style={{ maxWidth: 80 }}>
              {label}
            </span>
          </div>
          {!isLast && (
            <div className={cn("mx-1 h-0.5 flex-1", isDone ? "bg-primary" : "bg-border")} style={{ marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  )
}
