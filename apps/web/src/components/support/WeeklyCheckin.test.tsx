import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { User, WeeklyCheckin } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { WeeklyCheckinForm } from "./WeeklyCheckinForm"
import { WeeklyCheckinPrompt } from "./WeeklyCheckinPrompt"

const get = vi.fn()
const post = vi.fn()

vi.mock("@/lib/api", () => ({
  api: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}))

const checkin: WeeklyCheckin = {
  id: 7,
  week: "2026-W40",
  status: "pending",
  mood: null,
  topic: null,
  postpone_count: 0,
  answered_at: null,
  support_ticket_id: null,
}

const user = { id: 1, name: "Ana", role: "user" } as User

function wrap(ui: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe("WeeklyCheckinForm", () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
  })

  it("answers 'all good' in two taps without asking for a comment", async () => {
    post.mockResolvedValue({ checkin: { ...checkin, status: "answered" }, ticket: null })
    const onDone = vi.fn()
    wrap(<WeeklyCheckinForm checkin={checkin} onDone={onDone} />)

    await userEvent.click(screen.getByRole("radio", { name: /Muy bien/ }))
    await userEvent.click(screen.getByRole("radio", { name: "No, todo está bien" }))
    expect(screen.queryByLabelText("Cuéntanos qué ocurrió")).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }))

    expect(post).toHaveBeenCalledWith("/support/check-ins/7/answer", { mood: "great", topic: "none" })
    await waitFor(() => expect(onDone).toHaveBeenCalled())
  })

  it("requires the comment when the user wants to tell something and sends it", async () => {
    post.mockResolvedValue({ checkin: { ...checkin, status: "answered" }, ticket: { id: 1052 } })
    wrap(<WeeklyCheckinForm checkin={checkin} onDone={() => {}} />)

    await userEvent.click(screen.getByRole("radio", { name: /No muy bien/ }))
    await userEvent.click(screen.getByRole("radio", { name: "Quiero hacer una observación" }))
    const submit = screen.getByRole("button", { name: "Enviar" })
    expect(submit).toBeDisabled()

    await userEvent.type(screen.getByLabelText("Cuéntanos qué ocurrió"), "Las rutinas están muy pesadas")
    expect(submit).toBeEnabled()
    await userEvent.click(submit)

    expect(post).toHaveBeenCalledWith("/support/check-ins/7/answer", {
      mood: "not_good",
      topic: "observation",
      comment: "Las rutinas están muy pesadas",
    })
  })
})

describe("WeeklyCheckinPrompt", () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    useAuthStore.setState({ token: "t", user })
  })

  it("opens only when the backend says it should prompt", async () => {
    get.mockResolvedValue({ checkin, should_prompt: false })
    wrap(<WeeklyCheckinPrompt />)
    await waitFor(() => expect(get).toHaveBeenCalledWith("/support/check-ins/current"))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("'Not now' postpones it and closes the dialog", async () => {
    get.mockResolvedValue({ checkin, should_prompt: true })
    post.mockResolvedValue({ checkin: { ...checkin, status: "postponed" } })
    wrap(<WeeklyCheckinPrompt />)

    expect(await screen.findByRole("dialog")).toHaveTextContent("¿Cómo te has sentido esta semana con tus entrenamientos?")
    await userEvent.click(screen.getByRole("button", { name: "Ahora no" }))

    expect(post).toHaveBeenCalledWith("/support/check-ins/7/postpone")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
