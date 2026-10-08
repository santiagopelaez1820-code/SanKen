// Esta línea sirve para importar «beforeEach, describe, expect, it, vi» desde «vitest».
import { beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter» desde «react-router-dom».
import { MemoryRouter } from "react-router-dom"
// Esta línea sirve para importar «currentConsentVersions» desde «@sanken/core».
import { currentConsentVersions } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «RegisterPage» desde «./RegisterPage».
import { RegisterPage } from "./RegisterPage"

// Esta línea sirve para crear la función espía «post».
const post = vi.fn()

// Esta línea sirve para simular el módulo indicado en la prueba.
vi.mock("@/lib/api", () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{».
  api: {
    // Esta línea sirve para declarar la propiedad «bootstrapCsrf» con el valor o tipo «vi.fn().mockResolvedValue(undefined)».
    bootstrapCsrf: vi.fn().mockResolvedValue(undefined),
    // Esta línea sirve para declarar la propiedad «post» con el valor o tipo «(...args: unknown[]) => post(...args)».
    post: (...args: unknown[]) => post(...args),
  },
}))

// Esta línea sirve para simular el módulo indicado en la prueba.
vi.mock("@/lib/social-auth", () => ({
  // Esta línea sirve para declarar la propiedad «signInWithGoogle» con el valor o tipo «vi.fn()».
  signInWithGoogle: vi.fn(),
  // Esta línea sirve para declarar la propiedad «describeSocialAuthError» con el valor o tipo «() => "error"».
  describeSocialAuthError: () => "error",
  // Esta línea sirve para declarar la propiedad «SocialAuthCancelledError» con el valor o tipo «class extends Error {}».
  SocialAuthCancelledError: class extends Error {},
}))

// Esta línea sirve para declarar la función «fillForm».
async function fillForm() {
  // Esta línea sirve para simular la acción del usuario «type».
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana")
  // Esta línea sirve para simular la acción del usuario «type».
  await userEvent.type(screen.getByLabelText("Correo"), "ana@example.com")
  // Esta línea sirve para simular la acción del usuario «type».
  await userEvent.type(screen.getByLabelText("Contraseña"), "Password!234")
  // Esta línea sirve para simular la acción del usuario «type».
  await userEvent.type(screen.getByLabelText("Confirmar contraseña"), "Password!234")
}

// Esta línea sirve para declarar la función «renderPage».
function renderPage() {
  // Esta línea sirve para devolver «render(».
  return render(
    // Esta línea sirve para abrir el componente «MemoryRouter».
    <MemoryRouter>
      {/* Esta línea sirve para abrir el componente «RegisterPage». */}
      <RegisterPage />
    </MemoryRouter>
  )
}

// Esta línea sirve para agrupar las pruebas de «RegisterPage legal consents».
describe("RegisterPage legal consents", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para reiniciar el espía «post».
    post.mockReset()
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows one checkbox per consent, each linking to its document».
  it("shows one checkbox per consent, each linking to its document", () => {
    // Esta línea sirve para llamar a «renderPage».
    renderPage()
    // Esta línea sirve para verificar que «screen.getAllByRole("checkbox")» cumple «toHaveLength».
    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
    // El primero es el de la casilla; el pie de página también enlaza los documentos.
    // Esta línea sirve para verificar que el enlace de términos apunta a su documento.
    expect(screen.getAllByRole("link", { name: /^Términos y Condiciones/ })[0]).toHaveAttribute("href", "/legal/terminos")
    // Esta línea sirve para verificar que el enlace de términos abre en pestaña nueva.
    expect(screen.getAllByRole("link", { name: /^Términos y Condiciones/ })[0]).toHaveAttribute("target", "_blank")
    // Esta línea sirve para verificar que el enlace de privacidad apunta a su documento.
    expect(screen.getAllByRole("link", { name: /^Política de Privacidad/ })[0]).toHaveAttribute("href", "/legal/privacidad")
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not create the account if the consents are not accepted».
  it("does not create the account if the consents are not accepted", async () => {
    // Esta línea sirve para llamar a «renderPage».
    renderPage()
    // Esta línea sirve para esperar el resultado de «fillForm».
    await fillForm()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    // Esta línea sirve para verificar que «post» no cumple «toHaveBeenCalled».
    expect(post).not.toHaveBeenCalled()
    // Esta línea sirve para verificar que aparece el error de términos sin aceptar.
    expect(await screen.findByText("Debes aceptar los Términos y Condiciones.")).toBeInTheDocument()
    // Esta línea sirve para verificar que aparece el error de privacidad sin aceptar.
    expect(screen.getByText("Debes aceptar la Política de Privacidad.")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «rejects when only some consents are accepted».
  it("rejects when only some consents are accepted", async () => {
    // Esta línea sirve para llamar a «renderPage».
    renderPage()
    // Esta línea sirve para esperar el resultado de «fillForm».
    await fillForm()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getAllByRole("checkbox")[0])
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    // Esta línea sirve para verificar que «post» no cumple «toHaveBeenCalled».
    expect(post).not.toHaveBeenCalled()
    // Esta línea sirve para verificar que aparece el error de datos de salud sin aceptar.
    expect(await screen.findByText(/datos de salud y condición física/, { selector: ".invalid-feedback" })).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «sends every consent with the displayed document versions once accepted».
  it("sends every consent with the displayed document versions once accepted", async () => {
    // Esta línea sirve para definir lo que devuelve el espía «post».
    post.mockResolvedValue({ token: "t", user: { id: 1, role: "user" } })
    // Esta línea sirve para llamar a «renderPage».
    renderPage()
    // Esta línea sirve para esperar el resultado de «fillForm».
    await fillForm()
    // Esta línea sirve para marcar todas las casillas de consentimiento.
    for (const checkbox of screen.getAllByRole("checkbox")) await userEvent.click(checkbox)
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    // Esta línea sirve para verificar que «post» cumple «toHaveBeenCalledWith».
    expect(post).toHaveBeenCalledWith(
      // Esta línea sirve para incluir el texto o las clases «/auth/register…».
      "/auth/register",
      // Esta línea sirve para verificar que se envía un objeto con las aceptaciones.
      expect.objectContaining({
        // Esta línea sirve para declarar la propiedad «accept_terms» con el valor o tipo «true».
        accept_terms: true,
        // Esta línea sirve para declarar la propiedad «accept_privacy» con el valor o tipo «true».
        accept_privacy: true,
        // Esta línea sirve para declarar la propiedad «accept_health_data» con el valor o tipo «true».
        accept_health_data: true,
        // Esta línea sirve para declarar la propiedad «legal_versions» con el valor o tipo «currentConsentVersions()».
        legal_versions: currentConsentVersions(),
      })
    )
  })
})
