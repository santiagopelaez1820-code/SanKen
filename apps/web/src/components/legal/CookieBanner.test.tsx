// Esta línea sirve para importar «beforeEach, describe, expect, it» desde «vitest».
import { beforeEach, describe, expect, it } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter» desde «react-router-dom».
import { MemoryRouter } from "react-router-dom"
// Esta línea sirve para importar «COOKIE_CONSENT_STORAGE_KEY» desde «@sanken/core».
import { COOKIE_CONSENT_STORAGE_KEY } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «resetPreferenceMemoryForTests» desde «@/lib/preference-storage».
import { resetPreferenceMemoryForTests } from "@/lib/preference-storage"
// Esta línea sirve para importar «CookieBanner» desde «./CookieBanner».
import { CookieBanner } from "./CookieBanner"
// Esta línea sirve para importar «CookieSettingsDialog» desde «./CookieSettingsDialog».
import { CookieSettingsDialog } from "./CookieSettingsDialog"

// Esta línea sirve para declarar la función que dibuja el aviso de cookies.
function renderBanner() {
  // Esta línea sirve para devolver el componente dibujado.
  return render(
    // Esta línea sirve para abrir el componente «MemoryRouter».
    <MemoryRouter>
      {/* Esta línea sirve para abrir el componente «CookieBanner». */}
      <CookieBanner />
      {/* Esta línea sirve para abrir el componente «CookieSettingsDialog». */}
      <CookieSettingsDialog />
    </MemoryRouter>
  )
}

// Esta línea sirve para declarar la función que lee el consentimiento guardado.
const stored = () => JSON.parse(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) ?? "null")

// Esta línea sirve para agrupar las pruebas de «CookieBanner».
describe("CookieBanner", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
    // Esta línea sirve para reiniciar la memoria de preferencias.
    resetPreferenceMemoryForTests()
    // Esta línea sirve para reiniciar el estado del store de cookies.
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  // Esta línea sirve para declarar la prueba que verifica que «is shown while there is no valid choice and links to the cookie policy».
  it("is shown while there is no valid choice and links to the cookie policy", () => {
    // Esta línea sirve para dibujar el aviso.
    renderBanner()
    // Esta línea sirve para verificar que el aviso se muestra.
    expect(screen.getByRole("region", { name: "Usamos cookies" })).toBeInTheDocument()
    // Esta línea sirve para verificar que el enlace apunta a la política de cookies.
    expect(screen.getByRole("link", { name: /Política de Cookies/ })).toHaveAttribute("href", "/legal/cookies")
  })

  // Esta línea sirve para declarar la prueba que verifica que «is not shown once a choice exists».
  it("is not shown once a choice exists", () => {
    // Esta línea sirve para simular que el usuario rechaza las cookies opcionales.
    useCookieConsentStore.getState().rejectOptional()
    // Esta línea sirve para dibujar el aviso.
    renderBanner()
    // Esta línea sirve para verificar que el aviso ya no se muestra.
    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «accept all hides the banner and stores preferences as allowed».
  it("accept all hides the banner and stores preferences as allowed", async () => {
    // Esta línea sirve para dibujar el aviso.
    renderBanner()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Aceptar todas" }))

    // Esta línea sirve para verificar que el aviso ya no se muestra.
    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
    // Esta línea sirve para verificar que «stored(» cumple «categories.preferences».
    expect(stored().categories.preferences).toBe(true)
  })

  // Esta línea sirve para declarar la prueba que verifica que «reject optional hides the banner and stores only necessary cookies».
  it("reject optional hides the banner and stores only necessary cookies", async () => {
    // Esta línea sirve para dibujar el aviso.
    renderBanner()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Rechazar opcionales" }))

    // Esta línea sirve para verificar que el aviso ya no se muestra.
    expect(screen.queryByRole("region", { name: "Usamos cookies" })).not.toBeInTheDocument()
    // Esta línea sirve para verificar que «stored(» cumple «categories.preferences».
    expect(stored().categories.preferences).toBe(false)
  })

  // Esta línea sirve para declarar la prueba que verifica que «configure opens the settings panel with only real categories and saves».
  it("configure opens the settings panel with only real categories and saves a custom choice", async () => {
    // Esta línea sirve para dibujar el aviso.
    renderBanner()
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Configurar" }))

    // Esta línea sirve para esperar el diálogo de configuración.
    const dialog = await screen.findByRole("dialog")
    // Esta línea sirve para obtener el interruptor de cookies necesarias.
    const necessary = screen.getByRole("switch", { name: "Necesarias" })
    // Esta línea sirve para obtener el interruptor de preferencias.
    const preferences = screen.getByRole("switch", { name: "Preferencias" })
    // Esta línea sirve para verificar que «necessary» cumple «toBeChecked».
    expect(necessary).toBeChecked()
    // Esta línea sirve para verificar que «necessary» cumple «toBeDisabled».
    expect(necessary).toBeDisabled()
    // Esta línea sirve para verificar que «preferences» cumple «not.toBeChecked».
    expect(preferences).not.toBeChecked()
    // Esta línea sirve para verificar que «dialog» cumple «not.toHaveTextContent».
    expect(dialog).not.toHaveTextContent(/Analíticas|Marketing/)

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(preferences)
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Guardar preferencias" }))

    // Esta línea sirve para verificar que «stored(» cumple «categories».
    expect(stored().categories).toEqual({ necessary: true, preferences: true })
  })
})
