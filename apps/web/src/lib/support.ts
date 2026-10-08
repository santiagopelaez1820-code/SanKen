// Esta línea sirve para importar «SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus» desde «@sanken/core».
import { SUPPORT_STRINGS, type SupportTicketPriority, type SupportTicketStatus } from "@sanken/core"
// Esta línea sirve para importar los tipos «SankBadgeVariant» desde «@/components/ui/SankBadge».
import type { SankBadgeVariant } from "@/components/ui/SankBadge"

/** La interfaz de SanKen es en español (ver @sanken/core support/strings.ts). */
// Esta línea sirve para declarar «supportStrings» con el valor «SUPPORT_STRINGS.es».
export const supportStrings = SUPPORT_STRINGS.es

// Esta línea sirve para declarar «SUPPORT_QUERY_KEYS» con el valor «{».
export const SUPPORT_QUERY_KEYS = {
  // Esta línea sirve para declarar la propiedad «tickets» con el valor o tipo «["support", "tickets"] as const».
  tickets: ["support", "tickets"] as const,
  // Esta línea sirve para declarar la clave de consulta de un ticket concreto.
  ticket: (id: number | string) => ["support", "tickets", String(id)] as const,
  // Esta línea sirve para declarar la propiedad «checkin» con el valor o tipo «["support", "check-in"] as const».
  checkin: ["support", "check-in"] as const,
  // Esta línea sirve para declarar la propiedad «admin» con el valor o tipo «["admin", "support"] as const».
  admin: ["admin", "support"] as const,
}

// Esta línea sirve para declarar «STATUS_VARIANT» con el valor «{».
export const STATUS_VARIANT: Record<SupportTicketStatus, SankBadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «open» con el valor o tipo «"cyan"».
  open: "cyan",
  // Esta línea sirve para declarar la propiedad «in_review» con el valor o tipo «"warning"».
  in_review: "warning",
  // Esta línea sirve para declarar la propiedad «answered» con el valor o tipo «"success"».
  answered: "success",
  // Esta línea sirve para declarar la propiedad «resolved» con el valor o tipo «"neutral"».
  resolved: "neutral",
  // Esta línea sirve para declarar la propiedad «closed» con el valor o tipo «"outline"».
  closed: "outline",
}

// Esta línea sirve para declarar «PRIORITY_VARIANT» con el valor «{».
export const PRIORITY_VARIANT: Record<SupportTicketPriority, SankBadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «low» con el valor o tipo «"outline"».
  low: "outline",
  // Esta línea sirve para declarar la propiedad «normal» con el valor o tipo «"neutral"».
  normal: "neutral",
  // Esta línea sirve para declarar la propiedad «high» con el valor o tipo «"warning"».
  high: "warning",
  // Esta línea sirve para declarar la propiedad «urgent» con el valor o tipo «"danger"».
  urgent: "danger",
}

// Esta línea sirve para declarar la función «formatSupportDate».
export function formatSupportDate(iso: string | null | undefined, withTime = false): string {
  // Esta línea sirve para devolver «""» si «!iso».
  if (!iso) return ""
  // Esta línea sirve para devolver «new Date(iso).toLocaleString("es-CO", {».
  return new Date(iso).toLocaleString("es-CO", {
    // Esta línea sirve para declarar la propiedad «day» con el valor o tipo «"numeric"».
    day: "numeric",
    // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «"short"».
    month: "short",
    // Esta línea sirve para declarar la propiedad «year» con el valor o tipo «"numeric"».
    year: "numeric",
    // Esta línea sirve para agregar hora y minutos si se pidió la hora.
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  })
}
