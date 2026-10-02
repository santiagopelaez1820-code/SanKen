import { SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus } from "@sanken/core"
import type { SankBadgeVariant } from "@/components/ui/SankBadge"

/** La interfaz de SanKen es en español (ver @sanken/core support/strings.ts). */
export const supportStrings = SUPPORT_STRINGS.es

export const SUPPORT_QUERY_KEYS = {
  tickets: ["support", "tickets"] as const,
  ticket: (id: number | string) => ["support", "tickets", String(id)] as const,
  checkin: ["support", "check-in"] as const,
  admin: ["admin", "support"] as const,
}

export const STATUS_VARIANT: Record<SupportTicketStatus, SankBadgeVariant> = {
  open: "cyan",
  in_review: "warning",
  answered: "success",
  resolved: "neutral",
  closed: "outline",
}

export const PRIORITY_VARIANT: Record<SupportTicketPriority, SankBadgeVariant> = {
  low: "outline",
  normal: "neutral",
  high: "warning",
  urgent: "danger",
}

export function formatSupportDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return ""
  return new Date(iso).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  })
}
