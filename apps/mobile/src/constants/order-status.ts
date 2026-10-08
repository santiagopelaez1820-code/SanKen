// Esta línea sirve para importar «ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus» desde «@sanken/core».
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from '@sanken/core';
// Esta línea sirve para importar los tipos «BadgeVariant» desde «@/components/ui/badge».
import type { BadgeVariant } from '@/components/ui/badge';

// ORDER_STATUS_LABELS/ORDER_STATUS_FLOW ahora viven en @sanken/core (una
// sola fuente para web y mobile, en vez de copiadas por separado en cada
// app) — re-exportados acá para no tocar el import path en cada pantalla
// que ya los usa desde "@/constants/order-status".
// Esta línea sirve para exportar «ORDER_STATUS_FLOW, ORDER_STATUS_LABELS».
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS };

// Esta línea sirve para declarar «ORDER_STATUS_BADGE_VARIANT» con el valor «{».
export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «'neutral'».
  pending: 'neutral',
  // Esta línea sirve para declarar la propiedad «confirming» con el valor o tipo «'default'».
  confirming: 'default',
  // Esta línea sirve para declarar la propiedad «processing» con el valor o tipo «'warning'».
  processing: 'warning',
  // Esta línea sirve para declarar la propiedad «shipped» con el valor o tipo «'accent2'».
  shipped: 'accent2',
  // Esta línea sirve para declarar la propiedad «delivered» con el valor o tipo «'success'».
  delivered: 'success',
  // Esta línea sirve para declarar la propiedad «problem» con el valor o tipo «'error'».
  problem: 'error',
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «'error'».
  cancelled: 'error',
};
