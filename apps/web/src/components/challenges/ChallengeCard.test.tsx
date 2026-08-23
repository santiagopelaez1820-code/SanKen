import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { Challenge } from "@sanken/core"
import { ChallengeCard } from "./ChallengeCard"

vi.mock("@/components/challenges/ChallengeLeaderboard", () => ({
  ChallengeLeaderboard: () => <div data-testid="leaderboard-stub" />,
}))

const baseChallenge: Challenge = {
  id: 1,
  title: "Racha semanal",
  description: "Completa 5 entrenamientos esta semana.",
  type: "weekly",
  criteria: { metric: "workouts_count", target: 5 },
  starts_at: "2026-08-10",
  ends_at: "2026-08-16",
  joined: false,
  progress_value: null,
  completed: false,
}

describe("ChallengeCard", () => {
  it("shows a join button and no progress bar when the viewer hasn't joined", async () => {
    const onJoin = vi.fn()
    render(<ChallengeCard challenge={baseChallenge} expanded={false} onToggle={vi.fn()} onJoin={onJoin} />)

    expect(screen.getByText("Racha semanal")).toBeInTheDocument()
    expect(screen.queryByText(/\/ 5 entrenamientos/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Unirme" }))
    expect(onJoin).toHaveBeenCalledOnce()
  })

  it("shows progress toward the target once joined", () => {
    const joined: Challenge = { ...baseChallenge, joined: true, progress_value: 2 }
    render(<ChallengeCard challenge={joined} expanded={false} onToggle={vi.fn()} onJoin={vi.fn()} />)

    expect(screen.getByText("2 / 5 entrenamientos")).toBeInTheDocument()
    expect(screen.queryByText("¡Completado!")).not.toBeInTheDocument()
  })

  it("flags completed challenges and toggles the leaderboard", async () => {
    const onToggle = vi.fn()
    const joined: Challenge = { ...baseChallenge, joined: true, progress_value: 5, completed: true }
    const { rerender } = render(
      <ChallengeCard challenge={joined} expanded={false} onToggle={onToggle} onJoin={vi.fn()} />
    )

    expect(screen.getByText("¡Completado!")).toBeInTheDocument()
    expect(screen.queryByTestId("leaderboard-stub")).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Ver tabla" }))
    expect(onToggle).toHaveBeenCalledOnce()

    rerender(<ChallengeCard challenge={joined} expanded onToggle={onToggle} onJoin={vi.fn()} />)
    expect(screen.getByTestId("leaderboard-stub")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Ocultar tabla" })).toBeInTheDocument()
  })
})
