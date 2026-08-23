import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Stepper } from "./stepper"

describe("Stepper", () => {
  it("renders the current value", () => {
    render(<Stepper value={42.5} onChange={() => {}} />)
    expect(screen.getByText("42.5")).toBeInTheDocument()
  })

  it("treats a null value as 0", () => {
    render(<Stepper value={null} onChange={() => {}} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("increments by step on the plus button", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Stepper value={40} onChange={onChange} step={2.5} />)
    await user.click(screen.getByRole("button", { name: /sumar/i }))
    expect(onChange).toHaveBeenCalledWith(42.5)
  })

  it("decrements by step on the minus button", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Stepper value={40} onChange={onChange} step={2.5} />)
    await user.click(screen.getByRole("button", { name: /restar/i }))
    expect(onChange).toHaveBeenCalledWith(37.5)
  })

  it("clamps to min", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Stepper value={0} onChange={onChange} min={0} step={1} />)
    await user.click(screen.getByRole("button", { name: /restar/i }))
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it("clamps to max", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Stepper value={100} onChange={onChange} max={100} step={1} />)
    await user.click(screen.getByRole("button", { name: /sumar/i }))
    expect(onChange).toHaveBeenCalledWith(100)
  })
})
