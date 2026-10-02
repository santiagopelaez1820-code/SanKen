import { SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus } from '@sanken/core';

import type { BadgeVariant } from '@/components/ui/badge';

/** La interfaz de SanKen es en español (ver @sanken/core support/strings.ts). */
export const supportStrings = SUPPORT_STRINGS.es;

export const STATUS_BADGE: Record<SupportTicketStatus, BadgeVariant> = {
  open: 'default',
  in_review: 'warning',
  answered: 'success',
  resolved: 'neutral',
  closed: 'neutral',
};

export const PRIORITY_BADGE: Record<SupportTicketPriority, BadgeVariant> = {
  low: 'neutral',
  normal: 'neutral',
  high: 'warning',
  urgent: 'error',
};

export function formatSupportDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}
