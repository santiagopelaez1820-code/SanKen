export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Convierte un `performed_at` de la API (fecha pura "YYYY-MM-DD", Carbon::toDateString())
 * a la misma clave que produce toDateKey — sin pasar por `new Date(...)`. `new Date("YYYY-MM-DD")`
 * parsea como medianoche UTC, y en husos horarios negativos (Colombia, UTC-5) toDateKey()
 * extraería el día LOCAL de eso, que cae un día antes del que el backend quiso decir.
 * Como el string ya viene en formato "YYYY-MM-DD", no hace falta (ni conviene) parsearlo.
 */
export function apiDateKey(performedAt: string): string {
  return performedAt;
}

export function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Grilla de 6 semanas (42 días) empezando en lunes, igual que el backend (Carbon::startOfWeek() = lunes). */
export function monthGrid(monthStart: Date): Date[] {
  const startOffset = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - startOffset);
  return Array.from(
    { length: 42 },
    (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  );
}
