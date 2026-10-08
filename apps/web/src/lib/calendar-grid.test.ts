// Esta línea sirve para importar «describe, expect, it» desde «vitest».
import { describe, expect, it } from "vitest"
// Esta línea sirve para importar «monthGrid, toDateKey, toMonthKey» desde «./calendar-grid».
import { monthGrid, toDateKey, toMonthKey } from "./calendar-grid"

// Esta línea sirve para agrupar las pruebas de «toDateKey / toMonthKey».
describe("toDateKey / toMonthKey", () => {
  // Esta línea sirve para declarar la prueba que verifica que «pads single-digit months and days».
  it("pads single-digit months and days", () => {
    // Esta línea sirve para verificar que «toDateKey(new Date(2026, 0, 5))» cumple «toBe».
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05")
    // Esta línea sirve para verificar que «toMonthKey(new Date(2026, 0, 5))» cumple «toBe».
    expect(toMonthKey(new Date(2026, 0, 5))).toBe("2026-01")
  })
})

// Esta línea sirve para agrupar las pruebas de «monthGrid».
describe("monthGrid", () => {
  // Esta línea sirve para declarar la prueba que verifica que «starts on the Monday on or before the 1st of the month».
  it("starts on the Monday on or before the 1st of the month", () => {
    // agosto 2026 empieza un sábado.
    // Esta línea sirve para crear «grid» llamando a «monthGrid».
    const grid = monthGrid(new Date(2026, 7, 1))
    // Esta línea sirve para verificar que «grid[0].getDay()» cumple «toBe».
    expect(grid[0].getDay()).toBe(1) // lunes
    // Esta línea sirve para verificar que «toDateKey(grid[0])» cumple «toBe».
    expect(toDateKey(grid[0])).toBe("2026-07-27")
  })

  // Esta línea sirve para declarar la prueba que verifica que «always returns 42 days (6 full weeks)».
  it("always returns 42 days (6 full weeks)", () => {
    // Esta línea sirve para verificar que «monthGrid(new Date(2026, 7, 1))» cumple «toHaveLength».
    expect(monthGrid(new Date(2026, 7, 1))).toHaveLength(42)
    // Esta línea sirve para verificar que «monthGrid(new Date(2026, 1, 1))» cumple «toHaveLength».
    expect(monthGrid(new Date(2026, 1, 1))).toHaveLength(42)
  })

  // Esta línea sirve para declarar la prueba que verifica que «includes every day of the requested month».
  it("includes every day of the requested month", () => {
    // Esta línea sirve para crear «grid» llamando a «monthGrid».
    const grid = monthGrid(new Date(2026, 7, 1))
    // Esta línea sirve para crear «inMonthCount» llamando a «grid.filter».
    const inMonthCount = grid.filter((d) => d.getMonth() === 7).length
    // Esta línea sirve para verificar que «inMonthCount» cumple «toBe».
    expect(inMonthCount).toBe(31)
  })

  // Esta línea sirve para declarar la prueba que verifica que «returns a grid that already starts on Monday when the 1st itself is a ».
  it("returns a grid that already starts on Monday when the 1st itself is a Monday", () => {
    // agosto 2027 empieza un domingo — probamos un mes que arranca lunes: marzo 2027.
    // Esta línea sirve para crear «grid» llamando a «monthGrid».
    const grid = monthGrid(new Date(2027, 2, 1))
    // Esta línea sirve para verificar que «toDateKey(grid[0])» cumple «toBe».
    expect(toDateKey(grid[0])).toBe("2027-03-01")
  })
})
