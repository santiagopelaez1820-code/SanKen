// Esta línea sirve para importar el flujo, las etiquetas, la lista y el tipo de estados de pedido.
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from "@sanken/core"

// ORDER_STATUS_LABELS/ORDER_STATUS_FLOW/ORDER_STATUSES ahora viven en
// @sanken/core (una sola fuente para web y mobile) — re-exportados acá para
// no tener que tocar el import path en cada página/componente que ya los
// usa desde "@/lib/order-status".
// Esta línea sirve para exportar «ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUSES».
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUSES }

/** Para el Badge de Tailwind que usa el panel admin (AdminOrdersPage/AdminOrderDetailPage). */
// Esta línea sirve para declarar la variante de insignia de cada estado de pedido.
export const ORDER_STATUS_BADGE_VARIANT: Record<
  // Esta línea sirve para incluir el valor «OrderStatus» en la lista.
  OrderStatus,
  // Esta línea sirve para incluir el texto o las clases «neutral…».
  "neutral" | "default" | "warning" | "accent2" | "success" | "error"
// Esta línea sirve para cerrar el tipo y abrir el objeto.
> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"neutral"».
  pending: "neutral",
  // Esta línea sirve para declarar la propiedad «confirming» con el valor o tipo «"default"».
  confirming: "default",
  // Esta línea sirve para declarar la propiedad «processing» con el valor o tipo «"warning"».
  processing: "warning",
  // Esta línea sirve para declarar la propiedad «shipped» con el valor o tipo «"accent2"».
  shipped: "accent2",
  // Esta línea sirve para declarar la propiedad «delivered» con el valor o tipo «"success"».
  delivered: "success",
  // Esta línea sirve para declarar la propiedad «problem» con el valor o tipo «"error"».
  problem: "error",
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «"error"».
  cancelled: "error",
}

/**
 * Para SankBadge, que usan las páginas de cliente (MyOrdersPage/MyOrderDetailPage)
 * — vocabulario de variantes distinto al Badge de Tailwind (no hay "accent2" ni
 * "default", es "cyan"/"danger"/"outline"), así que necesita su propio mapeo.
 */
// Esta línea sirve para declarar la variante de insignia de SanKen de cada estado de pedido.
export const ORDER_STATUS_SANK_VARIANT: Record<
  // Esta línea sirve para incluir el valor «OrderStatus» en la lista.
  OrderStatus,
  // Esta línea sirve para incluir el texto o las clases «neutral…».
  "neutral" | "cyan" | "success" | "warning" | "danger" | "outline"
// Esta línea sirve para cerrar el tipo y abrir el objeto.
> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"neutral"».
  pending: "neutral",
  // Esta línea sirve para declarar la propiedad «confirming» con el valor o tipo «"cyan"».
  confirming: "cyan",
  // Esta línea sirve para declarar la propiedad «processing» con el valor o tipo «"warning"».
  processing: "warning",
  // Esta línea sirve para declarar la propiedad «shipped» con el valor o tipo «"cyan"».
  shipped: "cyan",
  // Esta línea sirve para declarar la propiedad «delivered» con el valor o tipo «"success"».
  delivered: "success",
  // Esta línea sirve para declarar la propiedad «problem» con el valor o tipo «"danger"».
  problem: "danger",
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «"danger"».
  cancelled: "danger",
}
