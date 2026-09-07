import type { OrderStatus } from '../types/store';

/**
 * Única fuente de verdad para las etiquetas de estado de pedido en el
 * frontend — antes vivía copiada por separado en apps/web y apps/mobile
 * (con el riesgo de que un cambio se aplicara en un lado y se olvidara en
 * el otro, como pasó con el rename confirmed→confirming). Debe coincidir
 * EXACTO con `App\Domain\Order\OrderStatusCatalog::LABELS` (backend, no se
 * puede compartir directo entre PHP y TS).
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pedido recibido',
  confirming: 'Confirmando pedido',
  processing: 'Procesando pedido',
  shipped: 'En camino',
  delivered: 'Entregado',
  problem: 'Problema con el pedido',
  cancelled: 'Cancelado',
};

/**
 * Todos los estados posibles, mismo orden que `OrderStatusCatalog::STATUSES`
 * (backend) — para selects/filtros que necesitan los 7 (a diferencia de
 * ORDER_STATUS_FLOW, que a propósito excluye problem/cancelled). Antes cada
 * pantalla de admin que necesitaba esta lista la retipeaba a mano.
 */
export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

/**
 * Secuencia normal de un pedido, para el timeline visual (mobile y web).
 * `problem` y `cancelled` son estados especiales por fuera de esta
 * secuencia — nunca se renderizan como "paso N de 5".
 */
export const ORDER_STATUS_FLOW: OrderStatus[] = ['pending', 'confirming', 'processing', 'shipped', 'delivered'];

export interface OrderTimelineStep {
  step: OrderStatus;
  label: string;
  isDone: boolean;
  isCurrent: boolean;
  isLast: boolean;
}

export type OrderTimelineResult =
  | { kind: 'special'; isProblem: boolean; label: string }
  | { kind: 'steps'; steps: OrderTimelineStep[] };

/**
 * Cálculo puro de los pasos del timeline de un pedido — compartido entre los
 * 3 componentes que lo renderizan (admin/OrderTimeline y store/OrderTimeline
 * en web, store/order-timeline en mobile), que antes tenían cada uno su
 * propia copia de esta misma lógica de isDone/isCurrent/isLast y del caso
 * especial problem/cancelled.
 */
export function getOrderTimeline(status: OrderStatus): OrderTimelineResult {
  if (status === 'problem' || status === 'cancelled') {
    return { kind: 'special', isProblem: status === 'problem', label: ORDER_STATUS_LABELS[status] };
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return {
    kind: 'steps',
    steps: ORDER_STATUS_FLOW.map((step, index) => ({
      step,
      label: ORDER_STATUS_LABELS[step],
      isDone: index < currentIndex,
      isCurrent: index === currentIndex,
      isLast: index === ORDER_STATUS_FLOW.length - 1,
    })),
  };
}
