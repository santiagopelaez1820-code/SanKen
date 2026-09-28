import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { COOKIE_CONSENT_STORAGE_KEY } from "@sanken/core"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { resetPreferenceMemoryForTests } from "@/lib/preference-storage"
import { CookieBanner } from "./CookieBanner"
import { CookieSettingsDialog } from "./CookieSettingsDialog"

function renderBanner() {
  return render(
    <MemoryRouter>
      <CookieBanner />
      <CookieSettingsDialog />
    </MemoryRouter>
  )
}

const stored = () => JSON.parse(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) ?? "null")

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear()
    resetPreferenceMemoryForTests()
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  it("is shown while there is no valid choice and links to the cookie policy", () => {
    renderBanner()
    expect(screen.getByRole("region", { name: "Usamos cookies" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Política de Cookies/ })).toHaveAttribute("href", "/legal/cookies")
  })

  it("is not shown once a choice exists", () => {
    useCookieConsentStore.getState().rejectOptional()
    renderBanner()
    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
  })

  it("accept all hides the banner and stores preferences as allowed", async () => {
    renderBanner()
    await userEvent.click(screen.getByRole("button", { name: "Aceptar todas" }))

    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
    expect(stored().categories.preferences).toBe(true)
  })

  it("reject optional hides the banner and stores only necessary cookies", async () => {
    renderBanner()
    await userEvent.click(screen.getByRole("button", { name: "Rechazar opcionales" }))

    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
    expect(stored().categories.preferences).toBe(false)
  })

  it("configure opens the settings panel with only real categories and saves a custom choice", async () => {
    renderBanner()
    await userEvent.click(screen.getByRole("button", { name: "Configurar" }))

    const dialog = await screen.findByRole("dialog")
    const necessary = screen.getByRole("switch", { name: "Necesarias" })
    const preferences = screen.getByRole("switch", { name: "Preferencias" })
    expect(necessary).toBeChecked()
    expect(necessary).toBeDisabled()
    expect(preferences).not.toBeChecked()
    expect(dialog).not.toHaveTextContent(/Analíticas|Marketing/)

    await userEvent.click(preferences)
    await userEvent.click(screen.getByRole("button", { name: "Guardar preferencias" }))

    expect(stored().categories).toEqual({ necessary: true, preferences: true })
  })
})
