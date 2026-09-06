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
 * Secuencia normal de un pedido, para el timeline visual (mobile y web).
 * `problem` y `cancelled` son estados especiales por fuera de esta
 * secuencia — nunca se renderizan como "paso N de 5".
 */
export const ORDER_STATUS_FLOW: OrderStatus[] = ['pending', 'confirming', 'processing', 'shipped', 'delivered'];
