import { Check, TriangleAlert, X } from "lucide-react"
import type { OrderStatus } from "@sanken/core"
import { getOrderTimeline } from "@/lib/order-timeline"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  status: OrderStatus
}

/**
 * Timeline vertical del progreso del pedido para las páginas de cliente
 * (Sank* + Bootstrap). `problem`/`cancelled` son estados especiales: no se
 * dibujan como "paso N de 5", se muestra un aviso aparte. El cálculo de qué
 * mostrar vive en `lib/order-timeline.ts` (compartido con
 * components/admin/OrderTimeline.tsx).
 */
export function OrderTimeline({ status }: OrderTimelineProps) {
  const timeline = getOrderTimeline(status)

  if (timeline.kind === "special") {
    return (
      <div
        className="rounded-2 p-3 d-flex align-items-center gap-2"
        style={{
          backgroundColor: timeline.isProblem ? "rgba(220, 53, 69, 0.12)" : "rgba(108, 117, 125, 0.12)",
          border: `1px solid ${timeline.isProblem ? "rgba(220, 53, 69, 0.35)" : "rgba(108, 117, 125, 0.35)"}`,
        }}
      >
        {timeline.isProblem ? (
          <TriangleAlert size={18} className="text-danger flex-shrink-0" />
        ) : (
          <X size={18} className="text-body-secondary flex-shrink-0" />
        )}
        <span className={cn("small fw-semibold", timeline.isProblem ? "text-danger" : "text-body-secondary")}>
          {timeline.label}
        </span>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column">
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }, index) => (
        <div key={step} className="d-flex">
          <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: 24,
                height: 24,
                backgroundColor: isDone
                  ? "var(--sanken-cyan)"
                  : isCurrent
                    ? "var(--sanken-cyan)"
                    : "var(--bs-secondary-bg)",
                color: isDone || isCurrent ? "#0b0b0b" : "var(--bs-body-color)",
                boxShadow: isCurrent ? "0 0 0 4px rgba(0, 184, 217, 0.2)" : undefined,
              }}
            >
              {isDone ? <Check size={14} /> : <span className="small fw-bold">{index + 1}</span>}
            </div>
            {!isLast && (
              <div
                style={{
                  width: 2,
                  flex: 1,
                  minHeight: 24,
                  backgroundColor: isDone ? "var(--sanken-cyan)" : "var(--bs-border-color)",
                }}
              />
            )}
          </div>
          <div className={cn("pb-3 ps-2", isLast && "pb-0")}>
            <span className={cn("small", isCurrent ? "fw-bold" : isDone ? "" : "text-body-secondary")}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
