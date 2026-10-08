// Esta línea sirve para declarar la función que da la clave de fecha AAAA-MM-DD.
export function toDateKey(date: Date): string {
  // Esta línea sirve para devolver el año, el mes y el día con dos dígitos.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Esta línea sirve para declarar la función que da la clave de mes AAAA-MM.
export function toMonthKey(date: Date): string {
  // Esta línea sirve para devolver el año y el mes con dos dígitos.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

/** Grilla de 6 semanas (42 días) empezando en lunes, igual que el backend (Carbon::startOfWeek() = lunes). */
// Esta línea sirve para declarar la función que arma la cuadrícula de 42 días de un mes.
export function monthGrid(monthStart: Date): Date[] {
  // Esta línea sirve para declarar «startOffset» con el valor «(monthStart.getDay() + 6) % 7».
  const startOffset = (monthStart.getDay() + 6) % 7
  // Esta línea sirve para calcular el primer día visible de la cuadrícula (lunes anterior o igual).
  const gridStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - startOffset)
  // Esta línea sirve para devolver «Array.from(».
  return Array.from(
    // Esta línea sirve para indicar que se generan 42 días.
    { length: 42 },
    // Esta línea sirve para crear cada día sumando su posición al primer día.
    (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  )
}
