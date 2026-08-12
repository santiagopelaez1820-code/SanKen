import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import type { Achievement } from "@sanken/core"
import { AchievementsList } from "./AchievementsList"

const achievements: Achievement[] = [
  {
    code: "first_workout",
    name: "Primer entrenamiento",
    description: "Completa tu primera sesión de entrenamiento.",
    xp_bonus: 50,
    unlocked: true,
    achieved_at: "2026-08-09T00:00:00Z",
  },
  {
    code: "consistent",
    name: "Constante",
    description: "Completa 10 sesiones de entrenamiento.",
    xp_bonus: 100,
    unlocked: false,
    achieved_at: null,
  },
]

describe("AchievementsList", () => {
  it("shows an empty state when there are no achievements", () => {
    render(<AchievementsList achievements={[]} />)
    expect(screen.getByText("Todavía no hay logros disponibles.")).toBeInTheDocument()
  })

  it("renders both locked and unlocked achievements", () => {
    render(<AchievementsList achievements={achievements} />)
    expect(screen.getByText("Primer entrenamiento")).toBeInTheDocument()
    expect(screen.getByText("Constante")).toBeInTheDocument()
    expect(screen.getByText("+50 XP")).toBeInTheDocument()
    expect(screen.getByText("+100 XP")).toBeInTheDocument()
  })
})
