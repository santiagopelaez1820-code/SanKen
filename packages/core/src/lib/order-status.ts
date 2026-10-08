// Esta línea sirve para importar el tipo de estado de pedido.
import type { OrderStatus } from '../types/store';

/**
 * Única fuente de verdad para las etiquetas de estado de pedido en el
 * frontend — antes vivía copiada por separado en apps/web y apps/mobile
 * (con el riesgo de que un cambio se aplicara en un lado y se olvidara en
 * el otro, como pasó con el rename confirmed→confirming). Debe coincidir
 * EXACTO con `App\Domain\Order\OrderStatusCatalog::LABELS` (backend, no se
 * puede compartir directo entre PHP y TS).
 */
// Esta línea sirve para declarar la etiqueta legible de cada estado de pedido.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  // Esta línea sirve para definir la etiqueta del pedido recibido.
  pending: 'Pedido recibido',
  // Esta línea sirve para definir la etiqueta de confirmación.
  confirming: 'Confirmando pedido',
  // Esta línea sirve para definir la etiqueta de procesamiento.
  processing: 'Procesando pedido',
  // Esta línea sirve para definir la etiqueta de envío.
  shipped: 'En camino',
  // Esta línea sirve para definir la etiqueta de entrega.
  delivered: 'Entregado',
  // Esta línea sirve para definir la etiqueta de problema.
  problem: 'Problema con el pedido',
  // Esta línea sirve para definir la etiqueta de cancelado.
  cancelled: 'Cancelado',
};

/**
 * Todos los estados posibles, mismo orden que `OrderStatusCatalog::STATUSES`
 * (backend) — para selects/filtros que necesitan los 7 (a diferencia de
 * ORDER_STATUS_FLOW, que a propósito excluye problem/cancelled). Antes cada
 * pantalla de admin que necesitaba esta lista la retipeaba a mano.
 */
// Esta línea sirve para declarar la lista de todos los estados de pedido.
export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

/**
 * Secuencia normal de un pedido, para el timeline visual (mobile y web).
 * `problem` y `cancelled` son estados especiales por fuera de esta
 * secuencia — nunca se renderizan como "paso N de 5".
 */
// Esta línea sirve para declarar el flujo normal de estados de un pedido.
export const ORDER_STATUS_FLOW: OrderStatus[] = ['pending', 'confirming', 'processing', 'shipped', 'delivered'];

// Esta línea sirve para declarar un paso de la línea de tiempo.
export interface OrderTimelineStep {
  // Esta línea sirve para guardar el estado del paso.
  step: OrderStatus;
  // Esta línea sirve para guardar la etiqueta del paso.
  label: string;
  // Esta línea sirve para indicar si el paso ya se completó.
  isDone: boolean;
  // Esta línea sirve para indicar si es el paso actual.
  isCurrent: boolean;
  // Esta línea sirve para indicar si es el último paso.
  isLast: boolean;
}

// Esta línea sirve para declarar el resultado de la línea de tiempo.
export type OrderTimelineResult =
  // Esta línea sirve para permitir un estado especial como problema o cancelado.
  | { kind: 'special'; isProblem: boolean; label: string }
  // Esta línea sirve para permitir una lista de pasos del flujo normal.
  | { kind: 'steps'; steps: OrderTimelineStep[] };

/**
 * Cálculo puro de los pasos del timeline de un pedido — compartido entre los
 * 3 componentes que lo renderizan (admin/OrderTimeline y store/OrderTimeline
 * en web, store/order-timeline en mobile), que antes tenían cada uno su
 * propia copia de esta misma lógica de isDone/isCurrent/isLast y del caso
 * especial problem/cancelled.
 */
// Esta línea sirve para declarar la función que construye la línea de tiempo de un pedido.
export function getOrderTimeline(status: OrderStatus): OrderTimelineResult {
  // Esta línea sirve para revisar si el estado es especial.
  if (status === 'problem' || status === 'cancelled') {
    // Esta línea sirve para devolver el estado especial con su etiqueta.
    return { kind: 'special', isProblem: status === 'problem', label: ORDER_STATUS_LABELS[status] };
  }

  // Esta línea sirve para obtener la posición del estado actual en el flujo.
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  // Esta línea sirve para devolver el resultado.
  return {
    // Esta línea sirve para indicar que son pasos.
    kind: 'steps',
    // Esta línea sirve para recorrer cada paso del flujo.
    steps: ORDER_STATUS_FLOW.map((step, index) => ({
      // Esta línea sirve para guardar el estado del paso.
      step,
      // Esta línea sirve para guardar la etiqueta del paso.
      label: ORDER_STATUS_LABELS[step],
      // Esta línea sirve para marcar como hecho si está antes del actual.
      isDone: index < currentIndex,
      // Esta línea sirve para marcar como actual si coincide.
      isCurrent: index === currentIndex,
      // Esta línea sirve para marcar como último si es el final del flujo.
      isLast: index === ORDER_STATUS_FLOW.length - 1,
    })),
  };
}
