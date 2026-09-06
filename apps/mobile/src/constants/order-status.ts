import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from '@sanken/core';
import type { BadgeVariant } from '@/components/ui/badge';

// ORDER_STATUS_LABELS/ORDER_STATUS_FLOW ahora viven en @sanken/core (una
// sola fuente para web y mobile, en vez de copiadas por separado en cada
// app) — re-exportados acá para no tocar el import path en cada pantalla
// que ya los usa desde "@/constants/order-status".
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS };

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'neutral',
  confirming: 'default',
  processing: 'warning',
  shipped: 'accent2',
  delivered: 'success',
  problem: 'error',
  cancelled: 'error',
};
