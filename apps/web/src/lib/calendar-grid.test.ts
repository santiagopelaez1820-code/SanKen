import { describe, expect, it } from "vitest"
import { monthGrid, toDateKey, toMonthKey } from "./calendar-grid"

describe("toDateKey / toMonthKey", () => {
  it("pads single-digit months and days", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05")
    expect(toMonthKey(new Date(2026, 0, 5))).toBe("2026-01")
  })
})

describe("monthGrid", () => {
  it("starts on the Monday on or before the 1st of the month", () => {
    // agosto 2026 empieza un sábado.
    const grid = monthGrid(new Date(2026, 7, 1))
    expect(grid[0].getDay()).toBe(1) // lunes
    expect(toDateKey(grid[0])).toBe("2026-07-27")
  })

  it("always returns 42 days (6 full weeks)", () => {
    expect(monthGrid(new Date(2026, 7, 1))).toHaveLength(42)
    expect(monthGrid(new Date(2026, 1, 1))).toHaveLength(42)
  })

  it("includes every day of the requested month", () => {
    const grid = monthGrid(new Date(2026, 7, 1))
    const inMonthCount = grid.filter((d) => d.getMonth() === 7).length
    expect(inMonthCount).toBe(31)
  })

  it("returns a grid that already starts on Monday when the 1st itself is a Monday", () => {
    // agosto 2027 empieza un domingo — probamos un mes que arranca lunes: marzo 2027.
    const grid = monthGrid(new Date(2027, 2, 1))
    expect(toDateKey(grid[0])).toBe("2027-03-01")
  })
})
