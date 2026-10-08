// Esta línea sirve para importar «beforeEach, describe, expect, it, vi» desde «vitest».
import { beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen, waitFor» desde «@testing-library/react».
import { render, screen, waitFor } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter, Route, Routes» desde «react-router-dom».
import { MemoryRouter, Route, Routes } from "react-router-dom"
// Esta línea sirve para importar «QueryClient, QueryClientProvider» desde «@tanstack/react-query».
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «SupportTicket, User» desde «@sanken/core».
import type { SupportTicket, User } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «SupportPage» desde «./SupportPage».
import { SupportPage } from "./SupportPage"
// Esta línea sirve para importar «SupportTicketPage» desde «./SupportTicketPage».
import { SupportTicketPage } from "./SupportTicketPage"

// Esta línea sirve para crear la función espía «get».
const get = vi.fn()
// Esta línea sirve para crear la función espía «post».
const post = vi.fn()

// Esta línea sirve para simular el módulo indicado en la prueba.
vi.mock("@/lib/api", () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{».
  api: {
    // Esta línea sirve para declarar la propiedad «get» con el valor o tipo «(...args: unknown[]) => get(...args)».
    get: (...args: unknown[]) => get(...args),
    // Esta línea sirve para declarar la propiedad «post» con el valor o tipo «(...args: unknown[]) => post(...args)».
    post: (...args: unknown[]) => post(...args),
  },
}))

// Esta línea sirve para declarar el dato de ejemplo «ticket» de tipo «SupportTicket».
const ticket: SupportTicket = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1042».
  id: 1042,
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «"question"».
  type: "question",
  // Esta línea sirve para declarar la propiedad «subject» con el valor o tipo «"No entiendo mi rutina de hoy"».
  subject: "No entiendo mi rutina de hoy",
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «"answered"».
  status: "answered",
  // Esta línea sirve para declarar la propiedad «source» con el valor o tipo «"app"».
  source: "app",
  // Esta línea sirve para declarar la propiedad «weekly_checkin_id» con el valor o tipo «null».
  weekly_checkin_id: null,
  // Esta línea sirve para declarar la propiedad «last_message_at» con el valor o tipo «"2026-09-28T15:00:00Z"».
  last_message_at: "2026-09-28T15:00:00Z",
  // Esta línea sirve para declarar la propiedad «last_message_by_staff» con el valor o tipo «true».
  last_message_by_staff: true,
  // Esta línea sirve para declarar la propiedad «first_response_at» con el valor o tipo «"2026-09-28T15:00:00Z"».
  first_response_at: "2026-09-28T15:00:00Z",
  // Esta línea sirve para declarar la propiedad «resolved_at» con el valor o tipo «null».
  resolved_at: null,
  // Esta línea sirve para declarar la propiedad «closed_at» con el valor o tipo «null».
  closed_at: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «"2026-09-28T14:00:00Z"».
  created_at: "2026-09-28T14:00:00Z",
  // Esta línea sirve para declarar la propiedad «messages» con el valor o tipo «[».
  messages: [
    // Esta línea sirve para declarar el mensaje del usuario de ejemplo.
    { id: 1, body: "¿Por qué me aparecen estos ejercicios?", is_staff: false, author_name: "Ana", created_at: "2026-09-28T14:00:00Z" },
    // Esta línea sirve para declarar el mensaje del equipo de ejemplo.
    { id: 2, body: "Claro, ¿qué parte no entiendes?", is_staff: true, author_name: null, created_at: "2026-09-28T15:00:00Z" },
  ],
}

// Esta línea sirve para declarar la función «renderAt».
function renderAt(path: string) {
  // Esta línea sirve para crear «client» llamando a «QueryClient».
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  // Esta línea sirve para devolver «render(».
  return render(
    // Esta línea sirve para abrir el componente «QueryClientProvider».
    <QueryClientProvider client={client}>
      {/* Esta línea sirve para abrir el componente «MemoryRouter». */}
      <MemoryRouter initialEntries={[path]}>
        {/* Esta línea sirve para abrir el componente «Routes». */}
        <Routes>
          {/* Esta línea sirve para mostrar el componente «Route». */}
          <Route path="/soporte" element={<SupportPage />} />
          {/* Esta línea sirve para mostrar el componente «Route». */}
          <Route path="/soporte/:ticketId" element={<SupportTicketPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// Esta línea sirve para agrupar las pruebas de «Support pages».
describe("Support pages", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía «get».
    get.mockReset()
    // Esta línea sirve para reiniciar el espía «post».
    post.mockReset()
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ token: "t", user: { id: 1, name: "Ana", role: "user" } as User })
  })

  // Esta línea sirve para declarar la prueba que verifica que «lists the user».
  it("lists the user's requests with status and a check-in shortcut when available", async () => {
    // Esta línea sirve para simular las respuestas de lectura según la ruta.
    get.mockImplementation((path: string) =>
      // Esta línea sirve para devolver la lista de tickets o el check-in.
      Promise.resolve(path === "/support/tickets" ? [ticket] : { checkin: { id: 7, status: "pending" }, should_prompt: false })
    )
    // Esta línea sirve para llamar a «renderAt» con «"/soporte"».
    renderAt("/soporte")

    // Esta línea sirve para verificar que aparece el asunto del ticket.
    expect(await screen.findByText("No entiendo mi rutina de hoy")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText("Respondida")» cumple «toBeInTheDocument».
    expect(screen.getByText("Respondida")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText("Respuesta nueva")» cumple «toBeInTheDocument».
    expect(screen.getByText("Respuesta nueva")).toBeInTheDocument()
    // Esta línea sirve para verificar que existe el enlace al check-in semanal.
    expect(screen.getByRole("link", { name: /Check-in semanal/ })).toHaveAttribute("href", "/soporte/check-in")
  })

  // Esta línea sirve para declarar la prueba que verifica que «creates a request with type, subject and message».
  it("creates a request with type, subject and message", async () => {
    // Esta línea sirve para simular las respuestas de lectura según la ruta.
    get.mockImplementation((path: string) => Promise.resolve(path === "/support/tickets" ? [] : { checkin: null, should_prompt: false }))
    // Esta línea sirve para definir lo que devuelve el espía «post».
    post.mockResolvedValue({ ...ticket, status: "open" })
    // Esta línea sirve para llamar a «renderAt» con «"/soporte"».
    renderAt("/soporte")

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(await screen.findByRole("button", { name: "Nueva solicitud" }))
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("radio", { name: "Reclamo" }))
    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Asunto"), "Cobro repetido")
    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Mensaje"), "Me cobraron dos veces")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }))

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith("/support/tickets", { type: "complaint", subject: "Cobro repetido", message: "Me cobraron dos veces" })
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows the conversation history with the team name and lets the user re».
  it("shows the conversation history with the team name and lets the user reply", async () => {
    // Esta línea sirve para definir lo que devuelve el espía «get».
    get.mockResolvedValue(ticket)
    // Esta línea sirve para definir lo que devuelve el espía «post».
    post.mockResolvedValue({ ...ticket, status: "open" })
    // Esta línea sirve para llamar a «renderAt» con «"/soporte/1042"».
    renderAt("/soporte/1042")

    // Esta línea sirve para verificar que aparece la respuesta del equipo.
    expect(await screen.findByText("Claro, ¿qué parte no entiendes?")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText(/Equipo SanKen ·/)» cumple «toBeInTheDocument».
    expect(screen.getByText(/Equipo SanKen ·/)).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText(/El equipo te respondió/)» cumple «toBeInTheDocument».
    expect(screen.getByText(/El equipo te respondió/)).toBeInTheDocument()

    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByPlaceholderText("Escribe tu respuesta…"), "Gracias, ya entendí")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Responder" }))
    // Esta línea sirve para esperar a que se cumpla la condición.
    await waitFor(() => expect(post).toHaveBeenCalledWith("/support/tickets/1042/messages", { body: "Gracias, ya entendí" }))
  })

  // Esta línea sirve para declarar la prueba que verifica que «a closed request is read-only».
  it("a closed request is read-only", async () => {
    // Esta línea sirve para definir lo que devuelve el espía «get».
    get.mockResolvedValue({ ...ticket, status: "closed" })
    // Esta línea sirve para llamar a «renderAt» con «"/soporte/1042"».
    renderAt("/soporte/1042")

    // Esta línea sirve para verificar que aparece el aviso de solicitud cerrada.
    expect(await screen.findByText(/Esta solicitud está cerrada/)).toBeInTheDocument()
    // Esta línea sirve para verificar que no aparece el botón de responder.
    expect(screen.queryByRole("button", { name: "Responder" })).not.toBeInTheDocument()
  })
})
