import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { currentConsentVersions, type LegalConsentsResponse, type User } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { LegalConsentGate } from "./LegalConsentGate"

const get = vi.fn()
const post = vi.fn()

vi.mock("@/lib/api", () => ({
  api: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}))

vi.mock("@/lib/echo", () => ({ disconnectEcho: vi.fn() }))

const user: User = {
  id: 9,
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
}

function renderGate() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LegalConsentGate>
          <p>Contenido de la app</p>
        </LegalConsentGate>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("LegalConsentGate", () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    localStorage.clear()
  })

  it("does not interrupt a user whose accepted versions are current", async () => {
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: [] } })
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)

    renderGate()

    expect(screen.getByText("Contenido de la app")).toBeInTheDocument()
    await waitFor(() => expect(get).toHaveBeenCalledWith("/legal/consents"))
    expect(screen.queryByText("Actualizamos nuestros documentos")).not.toBeInTheDocument()
  })

  it("shows the re-acceptance screen when the backend blocked a request even if the cache says nothing is pending", async () => {
    // Estado que deja lib/api.ts tras un 403 consent_required en mitad de la sesión.
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: ["terms"] } })
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)

    renderGate()

    await waitFor(() => expect(get).toHaveBeenCalled())
    expect(screen.getByText("Actualizamos nuestros documentos")).toBeInTheDocument()
    expect(screen.queryByText("Contenido de la app")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "No acepto: eliminar mi cuenta" })).toBeInTheDocument()
  })

  it("asks a user with an outdated version to accept again, then lets them in", async () => {
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: ["privacy"] } })
    get.mockResolvedValueOnce({
      pending: [{ type: "privacy", document: "privacy", version: "2.0", accepted_version: "1.0" }],
      history: [],
    } satisfies LegalConsentsResponse)
    // Refetch tras aceptar: el backend ya no tiene pendientes.
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)
    post.mockResolvedValue({ pending: [], user: { ...user, pending_consents: [] } })

    renderGate()

    expect(await screen.findByText("Actualizamos nuestros documentos")).toBeInTheDocument()
    expect(screen.queryByText("Contenido de la app")).not.toBeInTheDocument()
    expect(await screen.findByText(/Aceptaste la versión 1\.0 · vigente: 2\.0/)).toBeInTheDocument()

    const submit = screen.getByRole("button", { name: "Aceptar y continuar" })
    expect(submit).toBeDisabled()

    await userEvent.click(screen.getByRole("checkbox"))
    await userEvent.click(submit)

    expect(post).toHaveBeenCalledWith("/legal/consents", { consents: ["privacy"], legal_versions: currentConsentVersions(["privacy"]) })
    expect(await screen.findByText("Contenido de la app")).toBeInTheDocument()
  })
})
