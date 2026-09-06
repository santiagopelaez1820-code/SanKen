import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from "@sanken/core"

/**
 * Cálculo puro de los pasos del timeline de un pedido — compartido entre
 * `components/admin/OrderTimeline.tsx` (Tailwind) y
 * `components/store/OrderTimeline.tsx` (Bootstrap/Sank), que antes tenían
 * cada uno su propia copia de esta misma lógica de isDone/isCurrent/isLast
 * y del caso especial problem/cancelled. Cada componente sigue con su
 * propio marcado — solo el cálculo de qué mostrar vive en un solo lugar.
 */

export interface OrderTimelineStep {
  step: OrderStatus
  label: string
  isDone: boolean
  isCurrent: boolean
  isLast: boolean
}

export type OrderTimelineResult =
  | { kind: "special"; isProblem: boolean; label: string }
  | { kind: "steps"; steps: OrderTimelineStep[] }

export function getOrderTimeline(status: OrderStatus): OrderTimelineResult {
  if (status === "problem" || status === "cancelled") {
    return { kind: "special", isProblem: status === "problem", label: ORDER_STATUS_LABELS[status] }
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)

  return {
    kind: "steps",
    steps: ORDER_STATUS_FLOW.map((step, index) => ({
      step,
      label: ORDER_STATUS_LABELS[step],
      isDone: index < currentIndex,
      isCurrent: index === currentIndex,
      isLast: index === ORDER_STATUS_FLOW.length - 1,
    })),
  }
}
