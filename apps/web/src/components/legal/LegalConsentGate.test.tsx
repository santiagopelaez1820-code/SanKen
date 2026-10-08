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
// Esta línea sirve para importar «currentConsentVersions, type LegalConsentsResponse, type User» desde «@sanken/core».
import { currentConsentVersions, type LegalConsentsResponse, type User } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «LegalConsentGate» desde «./LegalConsentGate».
import { LegalConsentGate } from "./LegalConsentGate"

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

// Esta línea sirve para simular el módulo «@/lib/echo» en la prueba.
vi.mock("@/lib/echo", () => ({ disconnectEcho: vi.fn() }))

// Esta línea sirve para declarar un usuario de ejemplo.
const user: User = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «9».
  id: 9,
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
}

// Esta línea sirve para declarar la función que dibuja el control de consentimientos.
function renderGate() {
  // Esta línea sirve para crear un cliente de consultas sin reintentos.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  // Esta línea sirve para devolver el control dibujado.
  return render(
    // Esta línea sirve para abrir el componente «QueryClientProvider».
    <QueryClientProvider client={client}>
      {/* Esta línea sirve para abrir el componente «MemoryRouter». */}
      <MemoryRouter>
        {/* Esta línea sirve para abrir el componente «LegalConsentGate». */}
        <LegalConsentGate>
          {/* Esta línea sirve para mostrar el contenido protegido de ejemplo. */}
          <p>Contenido de la app</p>
        </LegalConsentGate>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// Esta línea sirve para agrupar las pruebas de «LegalConsentGate».
describe("LegalConsentGate", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía de lectura.
    get.mockReset()
    // Esta línea sirve para reiniciar el espía de envío.
    post.mockReset()
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not interrupt a user whose accepted versions are current».
  it("does not interrupt a user whose accepted versions are current", async () => {
    // Esta línea sirve para simular un usuario sin consentimientos pendientes.
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: [] } })
    // Esta línea sirve para simular que la API no devuelve pendientes.
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)

    // Esta línea sirve para dibujar el control.
    renderGate()

    // Esta línea sirve para verificar que «screen.getByText("Contenido de la app")» cumple «toBeInTheDocument».
    expect(screen.getByText("Contenido de la app")).toBeInTheDocument()
    // Esta línea sirve para esperar a que se consulten los consentimientos.
    await waitFor(() => expect(get).toHaveBeenCalledWith("/legal/consents"))
    // Esta línea sirve para verificar que no aparece la pantalla de reaceptación.
    expect(screen.queryByText("Actualizamos nuestros documentos")).not.toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows the re-acceptance screen when the backend blocked a request even».
  it("shows the re-acceptance screen when the backend blocked a request even if the cache says nothing is pending", async () => {
    // Estado que deja lib/api.ts tras un 403 consent_required en mitad de la sesión.
    // Esta línea sirve para simular un usuario con el consentimiento de términos pendiente.
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: ["terms"] } })
    // Esta línea sirve para simular que la API no devuelve pendientes.
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)

    // Esta línea sirve para dibujar el control.
    renderGate()

    // Esta línea sirve para esperar a que se consulte la API.
    await waitFor(() => expect(get).toHaveBeenCalled())
    // Esta línea sirve para verificar que aparece la pantalla de reaceptación.
    expect(screen.getByText("Actualizamos nuestros documentos")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByText("Contenido de la app")» cumple «not.toBeInTheDocument».
    expect(screen.queryByText("Contenido de la app")).not.toBeInTheDocument()
    // Esta línea sirve para verificar que se ofrece eliminar la cuenta.
    expect(screen.getByRole("button", { name: "No acepto: eliminar mi cuenta" })).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «asks a user with an outdated version to accept again, then lets them i».
  it("asks a user with an outdated version to accept again, then lets them in", async () => {
    // Esta línea sirve para simular un usuario con la privacidad pendiente.
    useAuthStore.setState({ token: "t", user: { ...user, pending_consents: ["privacy"] } })
    // Esta línea sirve para simular que la API devuelve un pendiente de privacidad.
    get.mockResolvedValueOnce({
      // Esta línea sirve para definir el pendiente de privacidad versión 2.0.
      pending: [{ type: "privacy", document: "privacy", version: "2.0", accepted_version: "1.0" }],
      // Esta línea sirve para declarar la propiedad «history» con el valor o tipo «[]».
      history: [],
    // Esta línea sirve para tipar la respuesta simulada.
    } satisfies LegalConsentsResponse)
    // Refetch tras aceptar: el backend ya no tiene pendientes.
    // Esta línea sirve para simular que la API ya no devuelve pendientes.
    get.mockResolvedValue({ pending: [], history: [] } satisfies LegalConsentsResponse)
    // Esta línea sirve para simular que el envío devuelve al usuario sin pendientes.
    post.mockResolvedValue({ pending: [], user: { ...user, pending_consents: [] } })

    // Esta línea sirve para dibujar el control.
    renderGate()

    // Esta línea sirve para verificar que aparece la pantalla de reaceptación.
    expect(await screen.findByText("Actualizamos nuestros documentos")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByText("Contenido de la app")» cumple «not.toBeInTheDocument».
    expect(screen.queryByText("Contenido de la app")).not.toBeInTheDocument()
    // Esta línea sirve para verificar que se muestra la versión aceptada y la vigente.
    expect(await screen.findByText(/Aceptaste la versión 1\.0 · vigente: 2\.0/)).toBeInTheDocument()

    // Esta línea sirve para obtener el botón de aceptar.
    const submit = screen.getByRole("button", { name: "Aceptar y continuar" })
    // Esta línea sirve para verificar que «submit» cumple «toBeDisabled».
    expect(submit).toBeDisabled()

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("checkbox"))
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(submit)

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith("/legal/consents", { consents: ["privacy"], legal_versions: currentConsentVersions(["privacy"]) })
    // Esta línea sirve para verificar que «await screen.findByText("Contenido de la app")» cumple «toBeInTheDocument».
    expect(await screen.findByText("Contenido de la app")).toBeInTheDocument()
  })
})
