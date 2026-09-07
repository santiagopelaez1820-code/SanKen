import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from "@sanken/core"

// ORDER_STATUS_LABELS/ORDER_STATUS_FLOW/ORDER_STATUSES ahora viven en
// @sanken/core (una sola fuente para web y mobile) — re-exportados acá para
// no tener que tocar el import path en cada página/componente que ya los
// usa desde "@/lib/order-status".
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUSES }

/** Para el Badge de Tailwind que usa el panel admin (AdminOrdersPage/AdminOrderDetailPage). */
export const ORDER_STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  "neutral" | "default" | "warning" | "accent2" | "success" | "error"
> = {
  pending: "neutral",
  confirming: "default",
  processing: "warning",
  shipped: "accent2",
  delivered: "success",
  problem: "error",
  cancelled: "error",
}

/**
 * Para SankBadge, que usan las páginas de cliente (MyOrdersPage/MyOrderDetailPage)
 * — vocabulario de variantes distinto al Badge de Tailwind (no hay "accent2" ni
 * "default", es "cyan"/"danger"/"outline"), así que necesita su propio mapeo.
 */
export const ORDER_STATUS_SANK_VARIANT: Record<
  OrderStatus,
  "neutral" | "cyan" | "success" | "warning" | "danger" | "outline"
> = {
  pending: "neutral",
  confirming: "cyan",
  processing: "warning",
  shipped: "cyan",
  delivered: "success",
  problem: "danger",
  cancelled: "danger",
}
