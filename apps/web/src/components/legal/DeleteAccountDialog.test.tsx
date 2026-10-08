// Esta línea sirve para importar «beforeEach, describe, expect, it, vi» desde «vitest».
import { beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter» desde «react-router-dom».
import { MemoryRouter } from "react-router-dom"
// Esta línea sirve para importar «QueryClient, QueryClientProvider» desde «@tanstack/react-query».
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «DeleteAccountDialog» desde «./DeleteAccountDialog».
import { DeleteAccountDialog } from "./DeleteAccountDialog"

// Esta línea sirve para crear la función espía «del».
const del = vi.fn()

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
vi.mock("@/lib/api", () => ({
  // Esta línea sirve para simular el método de borrado del cliente de la API.
  api: { delete: (...args: unknown[]) => del(...args) },
}))

// Esta línea sirve para simular el módulo «@/lib/echo» en la prueba.
vi.mock("@/lib/echo", () => ({ disconnectEcho: vi.fn() }))

// Esta línea sirve para declarar un usuario de ejemplo.
const baseUser: User = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «3».
  id: 3,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"Ana"».
  name: "Ana",
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «"ana@example.com"».
  email: "ana@example.com",
  // Esta línea sirve para declarar la propiedad «avatar_url» con el valor o tipo «null».
  avatar_url: null,
  // Esta línea sirve para declarar la propiedad «role» con el valor o tipo «"user"».
  role: "user",
  // Esta línea sirve para declarar la propiedad «two_factor_enabled» con el valor o tipo «false».
  two_factor_enabled: false,
  // Esta línea sirve para declarar la propiedad «is_public_profile» con el valor o tipo «false».
  is_public_profile: false,
  // Esta línea sirve para declarar la propiedad «trainer_verified_at» con el valor o tipo «null».
  trainer_verified_at: null,
  // Esta línea sirve para declarar la propiedad «email_verified_at» con el valor o tipo «null».
  email_verified_at: null,
  // Esta línea sirve para declarar la propiedad «onboarding_completed» con el valor o tipo «true».
  onboarding_completed: true,
  // Esta línea sirve para declarar la propiedad «has_location» con el valor o tipo «true».
  has_location: true,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «"2026-01-01T00:00:00Z"».
  created_at: "2026-01-01T00:00:00Z",
  // Esta línea sirve para declarar la propiedad «pending_consents» con el valor o tipo «[]».
  pending_consents: [],
  // Esta línea sirve para declarar la propiedad «auth_provider» con el valor o tipo «null».
  auth_provider: null,
}

// Esta línea sirve para declarar la función que dibuja el diálogo.
function renderDialog() {
  // Esta línea sirve para crear un cliente de consultas sin reintentos.
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  // Esta línea sirve para devolver el diálogo dibujado.
  return render(
    // Esta línea sirve para abrir el componente «QueryClientProvider».
    <QueryClientProvider client={client}>
      {/* Esta línea sirve para abrir el componente «MemoryRouter». */}
      <MemoryRouter>
        {/* Esta línea sirve para mostrar el componente «DeleteAccountDialog». */}
        <DeleteAccountDialog open onClose={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// Esta línea sirve para agrupar las pruebas de «DeleteAccountDialog».
describe("DeleteAccountDialog", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía de borrado.
    del.mockReset()
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
  })

  // Esta línea sirve para declarar la prueba que verifica que «requires the password and the word ELIMINAR for an email account, then».
  it("requires the password and the word ELIMINAR for an email account, then signs out", async () => {
    // Esta línea sirve para simular un usuario con sesión iniciada.
    useAuthStore.setState({ token: "t", user: baseUser })
    // Esta línea sirve para simular una respuesta correcta de la API.
    del.mockResolvedValue({ message: "ok" })
    // Esta línea sirve para dibujar el diálogo.
    renderDialog()

    // Esta línea sirve para obtener el botón de eliminar.
    const submit = screen.getByRole("button", { name: "Eliminar definitivamente" })
    // Esta línea sirve para verificar que «submit» cumple «toBeDisabled».
    expect(submit).toBeDisabled()

    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Escribe ELIMINAR para confirmar"), "ELIMINAR")
    // Esta línea sirve para verificar que «submit» cumple «toBeDisabled».
    expect(submit).toBeDisabled()
    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Tu contraseña actual"), "Password!234")
    // Esta línea sirve para verificar que «submit» cumple «toBeEnabled».
    expect(submit).toBeEnabled()

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(submit)

    // Esta línea sirve para verificar que «del» cumple «toHaveBeenCalledWith».
    expect(del).toHaveBeenCalledWith("/auth/me", { confirmation: "ELIMINAR", password: "Password!234" })
    // Esta línea sirve para esperar a que se cierre la sesión.
    await vi.waitFor(() => expect(useAuthStore.getState().token).toBeNull())
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not ask for a password on a Google account».
  it("does not ask for a password on a Google account", async () => {
    // Esta línea sirve para simular un usuario que entró con Google.
    useAuthStore.setState({ token: "t", user: { ...baseUser, auth_provider: "google" } })
    // Esta línea sirve para simular una respuesta correcta de la API.
    del.mockResolvedValue({ message: "ok" })
    // Esta línea sirve para dibujar el diálogo.
    renderDialog()

    // Esta línea sirve para verificar que «screen.queryByLabelText("Tu contraseña actual")» cumple «not.toBeInTheDocument».
    expect(screen.queryByLabelText("Tu contraseña actual")).not.toBeInTheDocument()
    // Esta línea sirve para simular la acción del usuario «type».
    await userEvent.type(screen.getByLabelText("Escribe ELIMINAR para confirmar"), "ELIMINAR")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Eliminar definitivamente" }))

    // Esta línea sirve para verificar que «del» cumple «toHaveBeenCalledWith».
    expect(del).toHaveBeenCalledWith("/auth/me", { confirmation: "ELIMINAR" })
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not offer self-deletion to a Super Admin».
  it("does not offer self-deletion to a Super Admin", () => {
    // Esta línea sirve para simular un super administrador.
    useAuthStore.setState({ token: "t", user: { ...baseUser, role: "super_admin" } })
    // Esta línea sirve para dibujar el diálogo.
    renderDialog()

    // Esta línea sirve para verificar que se muestra el aviso de que no puede eliminarse.
    expect(screen.getByText(/Super Admin no se puede eliminar/)).toBeInTheDocument()
    // Esta línea sirve para verificar que el botón de eliminar no aparece.
    expect(screen.queryByRole("button", { name: "Eliminar definitivamente" })).not.toBeInTheDocument()
  })
})
