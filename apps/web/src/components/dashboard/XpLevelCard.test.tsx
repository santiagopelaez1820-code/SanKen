import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import type { GamificationSummary } from "@sanken/core"
import { XpLevelCard } from "./XpLevelCard"

const summary: GamificationSummary = {
  total_xp: 150,
  level: 2,
  xp_for_current_level: 100,
  xp_for_next_level: 400,
  progress_pct: 0.1667,
  unlocked_achievements: [],
  locked_achievements: [],
}

describe("XpLevelCard", () => {
  it("shows a loading placeholder while fetching", () => {
    render(<XpLevelCard summary={undefined} isLoading={true} />)
    expect(screen.getByText("Nivel…")).toBeInTheDocument()
  })

  it("shows the level and xp progress once loaded", () => {
    render(<XpLevelCard summary={summary} isLoading={false} />)
    expect(screen.getByText("Nivel 2")).toBeInTheDocument()
    expect(screen.getByText("150 / 400 XP")).toBeInTheDocument()
  })
})
