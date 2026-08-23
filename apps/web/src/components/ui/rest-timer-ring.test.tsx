import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RestTimerRing } from "./rest-timer-ring"

describe("RestTimerRing", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders nothing when there is no active rest", () => {
    const { container } = render(<RestTimerRing restingUntil={null} totalSeconds={90} onSkip={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("shows the remaining time as mm:ss", () => {
    const restingUntil = Date.now() + 65_000
    render(<RestTimerRing restingUntil={restingUntil} totalSeconds={90} onSkip={() => {}} />)
    expect(screen.getByText("1:05")).toBeInTheDocument()
  })

  it("counts down as time passes", () => {
    const restingUntil = Date.now() + 5_000
    render(<RestTimerRing restingUntil={restingUntil} totalSeconds={90} onSkip={() => {}} />)
    expect(screen.getByText("0:05")).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3_000)
    })

    expect(screen.getByText("0:02")).toBeInTheDocument()
  })

  it("calls onSkip when the skip button is clicked", async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    const onSkip = vi.fn()

    render(<RestTimerRing restingUntil={Date.now() + 10_000} totalSeconds={90} onSkip={onSkip} />)
    await user.click(screen.getByRole("button", { name: /saltar descanso/i }))

    expect(onSkip).toHaveBeenCalledOnce()
  })
})
