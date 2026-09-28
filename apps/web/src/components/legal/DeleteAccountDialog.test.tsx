import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { User } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { DeleteAccountDialog } from "./DeleteAccountDialog"

const del = vi.fn()

vi.mock("@/lib/api", () => ({
  api: { delete: (...args: unknown[]) => del(...args) },
}))

vi.mock("@/lib/echo", () => ({ disconnectEcho: vi.fn() }))

const baseUser: User = {
  id: 3,
  name: "Ana",
  email: "ana@example.com",
  avatar_url: null,
  role: "user",
  two_factor_enabled: false,
  is_public_profile: false,
  trainer_verified_at: null,
  email_verified_at: null,
  onboarding_completed: true,
  has_location: true,
  created_at: "2026-01-01T00:00:00Z",
  pending_consents: [],
  auth_provider: null,
}

function renderDialog() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DeleteAccountDialog open onClose={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("DeleteAccountDialog", () => {
  beforeEach(() => {
    del.mockReset()
    localStorage.clear()
  })

  it("requires the password and the word ELIMINAR for an email account, then signs out", async () => {
    useAuthStore.setState({ token: "t", user: baseUser })
    del.mockResolvedValue({ message: "ok" })
    renderDialog()

    const submit = screen.getByRole("button", { name: "Eliminar definitivamente" })
    expect(submit).toBeDisabled()

    await userEvent.type(screen.getByLabelText("Escribe ELIMINAR para confirmar"), "ELIMINAR")
    expect(submit).toBeDisabled()
    await userEvent.type(screen.getByLabelText("Tu contraseña actual"), "Password!234")
    expect(submit).toBeEnabled()

    await userEvent.click(submit)

    expect(del).toHaveBeenCalledWith("/auth/me", { confirmation: "ELIMINAR", password: "Password!234" })
    await vi.waitFor(() => expect(useAuthStore.getState().token).toBeNull())
  })

  it("does not ask for a password on a Google account", async () => {
    useAuthStore.setState({ token: "t", user: { ...baseUser, auth_provider: "google" } })
    del.mockResolvedValue({ message: "ok" })
    renderDialog()

    expect(screen.queryByLabelText("Tu contraseña actual")).not.toBeInTheDocument()
    await userEvent.type(screen.getByLabelText("Escribe ELIMINAR para confirmar"), "ELIMINAR")
    await userEvent.click(screen.getByRole("button", { name: "Eliminar definitivamente" }))

    expect(del).toHaveBeenCalledWith("/auth/me", { confirmation: "ELIMINAR" })
  })

  it("does not offer self-deletion to a Super Admin", () => {
    useAuthStore.setState({ token: "t", user: { ...baseUser, role: "super_admin" } })
    renderDialog()

    expect(screen.getByText(/Super Admin no se puede eliminar/)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Eliminar definitivamente" })).not.toBeInTheDocument()
  })
})
