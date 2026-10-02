import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { SupportTicket, User } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { SupportPage } from "./SupportPage"
import { SupportTicketPage } from "./SupportTicketPage"

const get = vi.fn()
const post = vi.fn()

vi.mock("@/lib/api", () => ({
  api: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}))

const ticket: SupportTicket = {
  id: 1042,
  type: "question",
  subject: "No entiendo mi rutina de hoy",
  status: "answered",
  source: "app",
  weekly_checkin_id: null,
  last_message_at: "2026-09-28T15:00:00Z",
  last_message_by_staff: true,
  first_response_at: "2026-09-28T15:00:00Z",
  resolved_at: null,
  closed_at: null,
  created_at: "2026-09-28T14:00:00Z",
  messages: [
    { id: 1, body: "¿Por qué me aparecen estos ejercicios?", is_staff: false, author_name: "Ana", created_at: "2026-09-28T14:00:00Z" },
    { id: 2, body: "Claro, ¿qué parte no entiendes?", is_staff: true, author_name: null, created_at: "2026-09-28T15:00:00Z" },
  ],
}

function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/soporte" element={<SupportPage />} />
          <Route path="/soporte/:ticketId" element={<SupportTicketPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("Support pages", () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    useAuthStore.setState({ token: "t", user: { id: 1, name: "Ana", role: "user" } as User })
  })

  it("lists the user's requests with status and a check-in shortcut when available", async () => {
    get.mockImplementation((path: string) =>
      Promise.resolve(path === "/support/tickets" ? [ticket] : { checkin: { id: 7, status: "pending" }, should_prompt: false })
    )
    renderAt("/soporte")

    expect(await screen.findByText("No entiendo mi rutina de hoy")).toBeInTheDocument()
    expect(screen.getByText("Respondida")).toBeInTheDocument()
    expect(screen.getByText("Respuesta nueva")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Check-in semanal/ })).toHaveAttribute("href", "/soporte/check-in")
  })

  it("creates a request with type, subject and message", async () => {
    get.mockImplementation((path: string) => Promise.resolve(path === "/support/tickets" ? [] : { checkin: null, should_prompt: false }))
    post.mockResolvedValue({ ...ticket, status: "open" })
    renderAt("/soporte")

    await userEvent.click(await screen.findByRole("button", { name: "Nueva solicitud" }))
    await userEvent.click(screen.getByRole("radio", { name: "Reclamo" }))
    await userEvent.type(screen.getByLabelText("Asunto"), "Cobro repetido")
    await userEvent.type(screen.getByLabelText("Mensaje"), "Me cobraron dos veces")
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }))

    expect(post).toHaveBeenCalledWith("/support/tickets", { type: "complaint", subject: "Cobro repetido", message: "Me cobraron dos veces" })
  })

  it("shows the conversation history with the team name and lets the user reply", async () => {
    get.mockResolvedValue(ticket)
    post.mockResolvedValue({ ...ticket, status: "open" })
    renderAt("/soporte/1042")

    expect(await screen.findByText("Claro, ¿qué parte no entiendes?")).toBeInTheDocument()
    expect(screen.getByText(/Equipo SanKen ·/)).toBeInTheDocument()
    expect(screen.getByText(/El equipo te respondió/)).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText("Escribe tu respuesta…"), "Gracias, ya entendí")
    await userEvent.click(screen.getByRole("button", { name: "Responder" }))
    await waitFor(() => expect(post).toHaveBeenCalledWith("/support/tickets/1042/messages", { body: "Gracias, ya entendí" }))
  })

  it("a closed request is read-only", async () => {
    get.mockResolvedValue({ ...ticket, status: "closed" })
    renderAt("/soporte/1042")

    expect(await screen.findByText(/Esta solicitud está cerrada/)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Responder" })).not.toBeInTheDocument()
  })
})
