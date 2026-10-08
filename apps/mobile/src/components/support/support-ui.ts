// Esta línea sirve para importar «SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus» desde «@sanken/core».
import { SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus } from '@sanken/core';

// Esta línea sirve para importar los tipos «BadgeVariant» desde «@/components/ui/badge».
import type { BadgeVariant } from '@/components/ui/badge';

/** La interfaz de SanKen es en español (ver @sanken/core support/strings.ts). */
// Esta línea sirve para declarar «supportStrings» con el valor «SUPPORT_STRINGS.es».
export const supportStrings = SUPPORT_STRINGS.es;

// Esta línea sirve para declarar «STATUS_BADGE» con el valor «{».
export const STATUS_BADGE: Record<SupportTicketStatus, BadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «open» con el valor o tipo «'default'».
  open: 'default',
  // Esta línea sirve para declarar la propiedad «in_review» con el valor o tipo «'warning'».
  in_review: 'warning',
  // Esta línea sirve para declarar la propiedad «answered» con el valor o tipo «'success'».
  answered: 'success',
  // Esta línea sirve para declarar la propiedad «resolved» con el valor o tipo «'neutral'».
  resolved: 'neutral',
  // Esta línea sirve para declarar la propiedad «closed» con el valor o tipo «'neutral'».
  closed: 'neutral',
};

// Esta línea sirve para declarar «PRIORITY_BADGE» con el valor «{».
export const PRIORITY_BADGE: Record<SupportTicketPriority, BadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «low» con el valor o tipo «'neutral'».
  low: 'neutral',
  // Esta línea sirve para declarar la propiedad «normal» con el valor o tipo «'neutral'».
  normal: 'neutral',
  // Esta línea sirve para declarar la propiedad «high» con el valor o tipo «'warning'».
  high: 'warning',
  // Esta línea sirve para declarar la propiedad «urgent» con el valor o tipo «'error'».
  urgent: 'error',
};

// Esta línea sirve para declarar la función «formatSupportDate».
export function formatSupportDate(iso: string | null | undefined, withTime = false): string {
  // Esta línea sirve para devolver «''» si «!iso».
  if (!iso) return '';
  // Esta línea sirve para devolver «new Date(iso).toLocaleString('es-CO', {».
  return new Date(iso).toLocaleString('es-CO', {
    // Esta línea sirve para declarar la propiedad «day» con el valor o tipo «'numeric'».
    day: 'numeric',
    // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «'short'».
    month: 'short',
    // Esta línea sirve para declarar la propiedad «year» con el valor o tipo «'numeric'».
    year: 'numeric',
    // Esta línea sirve para agregar hora y minutos si se pidió la hora.
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}
