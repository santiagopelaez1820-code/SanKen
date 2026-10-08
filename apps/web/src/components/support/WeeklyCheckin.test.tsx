// Esta línea sirve para importar «beforeEach, describe, expect, it, vi» desde «vitest».
import { beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen, waitFor» desde «@testing-library/react».
import { render, screen, waitFor } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter» desde «react-router-dom».
import { MemoryRouter } from "react-router-dom"
// Esta línea sirve para importar «QueryClient, QueryClientProvider» desde «@tanstack/react-query».
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «User, WeeklyCheckin» desde «@sanken/core».
import type { User, WeeklyCheckin } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «WeeklyCheckinForm» desde «./WeeklyCheckinForm».
import { WeeklyCheckinForm } from "./WeeklyCheckinForm"
// Esta línea sirve para importar «WeeklyCheckinPrompt» desde «./WeeklyCheckinPrompt».
import { WeeklyCheckinPrompt } from "./WeeklyCheckinPrompt"

// Esta línea sirve para crear la función espía «get».
const get = vi.fn()
// Esta línea sirve para crear la función espía «post».
const post = vi.fn()

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
vi.mock("@/lib/api", () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{».
  api: {
    // Esta línea sirve para declarar la propiedad «get» con el valor o tipo «(...args: unknown[]) => get(...args)».
    get: (...args: unknown[]) => get(...args),
    // Esta línea sirve para declarar la propiedad «post» con el valor o tipo «(...args: unknown[]) => post(...args)».
    post: (...args: unknown[]) => post(...args),
  },
}))

// Esta línea sirve para declarar un check-in semanal de ejemplo.
const checkin: WeeklyCheckin = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «7».
  id: 7,
  // Esta línea sirve para declarar la propiedad «week» con el valor o tipo «"2026-W40"».
  week: "2026-W40",
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «"pending"».
  status: "pending",
  // Esta línea sirve para declarar la propiedad «mood» con el valor o tipo «null».
  mood: null,
  // Esta línea sirve para declarar la propiedad «topic» con el valor o tipo «null».
  topic: null,
  // Esta línea sirve para declarar la propiedad «postpone_count» con el valor o tipo «0».
  postpone_count: 0,
  // Esta línea sirve para declarar la propiedad «answered_at» con el valor o tipo «null».
  answered_at: null,
  // Esta línea sirve para declarar la propiedad «support_ticket_id» con el valor o tipo «null».
  support_ticket_id: null,
}

// Esta línea sirve para declarar un usuario de ejemplo.
const user = { id: 1, name: "Ana", role: "user" } as User

// Esta línea sirve para declarar la función que envuelve un componente con los proveedores.
function wrap(ui: React.ReactNode) {
  // Esta línea sirve para crear un cliente de consultas sin reintentos.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  // Esta línea sirve para devolver el componente dibujado.
  return render(
    // Esta línea sirve para abrir el componente «QueryClientProvider».
    <QueryClientProvider client={client}>
      {/* Esta línea sirve para envolver el componente en un enrutador de memoria. */}
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

// Esta línea sirve para agrupar las pruebas de «WeeklyCheckinForm».
describe("WeeklyCheckinForm", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía de lectura.
    get.mockReset()
    // Esta línea sirve para reiniciar el espía de envío.
    post.mockReset()
  })

  // Esta línea sirve para declarar la prueba que verifica que «answers 'all good' in two taps without asking for a comment».
  it("answers 'all good' in two taps without asking for a comment", async () => {
    // Esta línea sirve para simular una respuesta de check-in respondido.
    post.mockResolvedValue({ checkin: { ...checkin, status: "answered" }, ticket: null })
    // Esta línea sirve para crear la función espía «onDone».
    const onDone = vi.fn()
    // Esta línea sirve para dibujar el formulario del check-in.
    wrap(<WeeklyCheckinForm checkin={checkin} onDone={onDone} />)

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("radio", { name: /Muy bien/ }))
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("radio", { name: "No, todo está bien" }))
    // Esta línea sirve para verificar que «screen.queryByLabelText("Cuéntanos qué ocurrió")» cumple «not.toBeInTheDocument».
    expect(screen.queryByLabelText("Cuéntanos qué ocurrió")).not.toBeInTheDocument()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }))

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith("/support/check-ins/7/answer", { mood: "great", topic: "none" })
    // Esta línea sirve para esperar a que se llame al callback de terminado.
    await waitFor(() => expect(onDone).toHaveBeenCalled())
  })

  // Esta línea sirve para declarar la prueba que verifica que «requires the comment when the user wants to tell something and sends i».
  it("requires the comment when the user wants to tell something and sends it", async () => {
    // Esta línea sirve para simular una respuesta con un ticket creado.
    post.mockResolvedValue({ checkin: { ...checkin, status: "answered" }, ticket: { id: 1052 } })
    // Esta línea sirve para dibujar el formulario del check-in.
    wrap(<WeeklyCheckinForm checkin={checkin} onDone={() => {}} />)

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("radio", { name: /No muy bien/ }))
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("radio", { name: "Quiero hacer una observación" }))
    // Esta línea sirve para obtener el botón de enviar.
    const submit = screen.getByRole("button", { name: "Enviar" })
    // Esta línea sirve para verificar que «submit» cumple «toBeDisabled».
    expect(submit).toBeDisabled()

    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Cuéntanos qué ocurrió"), "Las rutinas están muy pesadas")
    // Esta línea sirve para verificar que «submit» cumple «toBeEnabled».
    expect(submit).toBeEnabled()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(submit)

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith("/support/check-ins/7/answer", {
      // Esta línea sirve para declarar la propiedad «mood» con el valor o tipo «"not_good"».
      mood: "not_good",
      // Esta línea sirve para declarar la propiedad «topic» con el valor o tipo «"observation"».
      topic: "observation",
      // Esta línea sirve para declarar la propiedad «comment» con el valor o tipo «"Las rutinas están muy pesadas"».
      comment: "Las rutinas están muy pesadas",
    })
  })
})

// Esta línea sirve para agrupar las pruebas de «WeeklyCheckinPrompt».
describe("WeeklyCheckinPrompt", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía de lectura.
    get.mockReset()
    // Esta línea sirve para reiniciar el espía de envío.
    post.mockReset()
    // Esta línea sirve para simular un usuario con sesión iniciada.
    useAuthStore.setState({ token: "t", user })
  })

  // Esta línea sirve para declarar la prueba que verifica que «opens only when the backend says it should prompt».
  it("opens only when the backend says it should prompt", async () => {
    // Esta línea sirve para simular que no hay que mostrar el aviso.
    get.mockResolvedValue({ checkin, should_prompt: false })
    // Esta línea sirve para dibujar el aviso del check-in.
    wrap(<WeeklyCheckinPrompt />)
    // Esta línea sirve para esperar a que se consulte el check-in actual.
    await waitFor(() => expect(get).toHaveBeenCalledWith("/support/check-ins/current"))
    // Esta línea sirve para verificar que «screen.queryByRole("dialog")» cumple «not.toBeInTheDocument».
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «'Not now' postpones it and closes the dialog».
  it("'Not now' postpones it and closes the dialog", async () => {
    // Esta línea sirve para simular que sí hay que mostrar el aviso.
    get.mockResolvedValue({ checkin, should_prompt: true })
    // Esta línea sirve para simular una respuesta de check-in pospuesto.
    post.mockResolvedValue({ checkin: { ...checkin, status: "postponed" } })
    // Esta línea sirve para dibujar el aviso del check-in.
    wrap(<WeeklyCheckinPrompt />)

    // Esta línea sirve para verificar que «await screen.findByRole("dialog")» cumple «toHaveTextContent».
    expect(await screen.findByRole("dialog")).toHaveTextContent("¿Cómo te has sentido esta semana con tus entrenamientos?")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Ahora no" }))

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith("/support/check-ins/7/postpone")
    // Esta línea sirve para esperar a que se cierre el diálogo.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
