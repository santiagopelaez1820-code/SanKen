export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

/** Grilla de 6 semanas (42 días) empezando en lunes, igual que el backend (Carbon::startOfWeek() = lunes). */
export function monthGrid(monthStart: Date): Date[] {
  const startOffset = (monthStart.getDay() + 6) % 7
  const gridStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - startOffset)
  return Array.from(
    { length: 42 },
    (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  )
}
