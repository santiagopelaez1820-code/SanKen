import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { RegisterPage } from "./RegisterPage"

const post = vi.fn()

vi.mock("@/lib/api", () => ({
  api: {
    bootstrapCsrf: vi.fn().mockResolvedValue(undefined),
    post: (...args: unknown[]) => post(...args),
  },
}))

vi.mock("@/lib/social-auth", () => ({
  signInWithGoogle: vi.fn(),
  describeSocialAuthError: () => "error",
  SocialAuthCancelledError: class extends Error {},
}))

async function fillForm() {
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana")
  await userEvent.type(screen.getByLabelText("Correo"), "ana@example.com")
  await userEvent.type(screen.getByLabelText("Contraseña"), "Password!234")
  await userEvent.type(screen.getByLabelText("Confirmar contraseña"), "Password!234")
}

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

describe("RegisterPage legal consents", () => {
  beforeEach(() => {
    post.mockReset()
    localStorage.clear()
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  it("shows one checkbox per consent, each linking to its document", () => {
    renderPage()
    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
    // El primero es el de la casilla; el pie de página también enlaza los documentos.
    expect(screen.getAllByRole("link", { name: /^Términos y Condiciones/ })[0]).toHaveAttribute("href", "/legal/terminos")
    expect(screen.getAllByRole("link", { name: /^Términos y Condiciones/ })[0]).toHaveAttribute("target", "_blank")
    expect(screen.getAllByRole("link", { name: /^Política de Privacidad/ })[0]).toHaveAttribute("href", "/legal/privacidad")
  })

  it("does not create the account if the consents are not accepted", async () => {
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(post).not.toHaveBeenCalled()
    expect(await screen.findByText("Debes aceptar los Términos y Condiciones.")).toBeInTheDocument()
    expect(screen.getByText("Debes aceptar la Política de Privacidad.")).toBeInTheDocument()
  })

  it("rejects when only some consents are accepted", async () => {
    renderPage()
    await fillForm()
    await userEvent.click(screen.getAllByRole("checkbox")[0])
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(post).not.toHaveBeenCalled()
    expect(await screen.findByText(/datos de salud y condición física/, { selector: ".invalid-feedback" })).toBeInTheDocument()
  })

  it("sends every consent with the displayed document versions once accepted", async () => {
    post.mockResolvedValue({ token: "t", user: { id: 1, role: "user" } })
    renderPage()
    await fillForm()
    for (const checkbox of screen.getAllByRole("checkbox")) await userEvent.click(checkbox)
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(post).toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({
        accept_terms: true,
        accept_privacy: true,
        accept_health_data: true,
        legal_versions: { terms: "1.0", privacy: "1.0", health_data: "1.0" },
      })
    )
  })
})
