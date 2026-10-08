// Esta línea sirve para importar «beforeEach, describe, expect, it» desde «vitest».
import { beforeEach, describe, expect, it } from "vitest"
// Esta línea sirve para importar «COOKIE_CONSENT_STORAGE_KEY» desde «@sanken/core».
import { COOKIE_CONSENT_STORAGE_KEY } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «./cookie-consent-store».
import { useCookieConsentStore } from "./cookie-consent-store"
// Esta línea sirve para importar «preferenceStorage, resetPreferenceMemoryForTests» desde «./preference-storage».
import { preferenceStorage, resetPreferenceMemoryForTests } from "./preference-storage"
// Esta línea sirve para importar «useThemeStore» desde «./theme-store».
import { useThemeStore } from "./theme-store"
// Esta línea sirve para importar «tutorialStorage» desde «./tutorial-storage».
import { tutorialStorage } from "./tutorial-storage"

// Esta línea sirve para declarar la función que lee el consentimiento guardado.
function storedConsent() {
  // Esta línea sirve para crear «raw» llamando a «localStorage.getItem».
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  // Esta línea sirve para devolver «raw ? JSON.parse(raw) : null».
  return raw ? JSON.parse(raw) : null
}

// Esta línea sirve para agrupar las pruebas de «cookie consent».
describe("cookie consent", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
    // Esta línea sirve para llamar a «resetPreferenceMemoryForTests».
    resetPreferenceMemoryForTests()
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  // Esta línea sirve para declarar la prueba que verifica que «starts undecided so the banner is shown».
  it("starts undecided so the banner is shown", () => {
    // Esta línea sirve para invocar la acción «reload» del store de «CookieConsent».
    useCookieConsentStore.getState().reload()
    // Esta línea sirve para verificar que «useCookieConsentStore.getState(» cumple «consent».
    expect(useCookieConsentStore.getState().consent).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not write preference keys to the browser before consent».
  it("does not write preference keys to the browser before consent", () => {
    // Esta línea sirve para invocar la acción «setMode» del store de «Theme».
    useThemeStore.getState().setMode("light")
    // Esta línea sirve para llamar a «tutorialStorage.markSeen» con «1, "dashboard"».
    tutorialStorage.markSeen(1, "dashboard")

    // Esta línea sirve para verificar que «localStorage.getItem("sanken-theme")» cumple «toBeNull».
    expect(localStorage.getItem("sanken-theme")).toBeNull()
    // Esta línea sirve para verificar que la clave del tutorial tampoco se guardó.
    expect(localStorage.getItem("sanken_tutorial_seen_1_dashboard")).toBeNull()
    // …pero la preferencia funciona durante la visita.
    // Esta línea sirve para verificar que «tutorialStorage.hasSeen(1, "dashboard")» cumple «toBe».
    expect(tutorialStorage.hasSeen(1, "dashboard")).toBe(true)
  })

  // Esta línea sirve para declarar la prueba que verifica que «accept all stores the choice and persists preferences chosen before de».
  it("accept all stores the choice and persists preferences chosen before deciding", () => {
    // Esta línea sirve para invocar la acción «setMode» del store de «Theme».
    useThemeStore.getState().setMode("light")
    // Esta línea sirve para invocar la acción «acceptAll» del store de «CookieConsent».
    useCookieConsentStore.getState().acceptAll()

    // Esta línea sirve para verificar que «storedConsent()?.categories» cumple «toEqual».
    expect(storedConsent()?.categories).toEqual({ necessary: true, preferences: true })
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-theme")» cumple «toContain».
    expect(localStorage.getItem("sanken-theme")).toContain('"light"')

    // Esta línea sirve para invocar la acción «setMode» del store de «Theme».
    useThemeStore.getState().setMode("dark")
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-theme")» cumple «toContain».
    expect(localStorage.getItem("sanken-theme")).toContain('"dark"')
  })

  // Esta línea sirve para declarar la prueba que verifica que «reject optional stores the choice and deletes existing preference keys».
  it("reject optional stores the choice and deletes existing preference keys", () => {
    // Esta línea sirve para guardar un valor en el almacenamiento local.
    localStorage.setItem("sanken-theme", JSON.stringify({ state: { mode: "light" }, version: 0 }))
    // Esta línea sirve para guardar un valor en el almacenamiento local.
    localStorage.setItem("sanken_tutorial_seen_7_progress", "1")
    // Esta línea sirve para guardar un valor en el almacenamiento local.
    localStorage.setItem("sanken-auth", "keep-me")

    // Esta línea sirve para invocar la acción «rejectOptional» del store de «CookieConsent».
    useCookieConsentStore.getState().rejectOptional()

    // Esta línea sirve para verificar que «storedConsent()?.categories» cumple «toEqual».
    expect(storedConsent()?.categories).toEqual({ necessary: true, preferences: false })
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-theme")» cumple «toBeNull».
    expect(localStorage.getItem("sanken-theme")).toBeNull()
    // Esta línea sirve para verificar que la clave del tutorial fue eliminada.
    expect(localStorage.getItem("sanken_tutorial_seen_7_progress")).toBeNull()
    // Las necesarias no se tocan.
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-auth")» cumple «toBe».
    expect(localStorage.getItem("sanken-auth")).toBe("keep-me")
    // La visita actual no cambia de golpe.
    // Esta línea sirve para verificar que «tutorialStorage.hasSeen(7, "progress")» cumple «toBe».
    expect(tutorialStorage.hasSeen(7, "progress")).toBe(true)
  })

  // Esta línea sirve para declarar la prueba que verifica que «custom settings are saved and survive a reload».
  it("custom settings are saved and survive a reload", () => {
    // Esta línea sirve para invocar la acción «save» del store de «CookieConsent».
    useCookieConsentStore.getState().save(true)
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useCookieConsentStore.setState({ consent: null })

    // Esta línea sirve para invocar la acción «reload» del store de «CookieConsent».
    useCookieConsentStore.getState().reload()
    // Esta línea sirve para verificar que «useCookieConsentStore.getState(» cumple «consent».
    expect(useCookieConsentStore.getState().consent?.categories.preferences).toBe(true)
  })

  // Esta línea sirve para declarar la prueba que verifica que «the user can change the choice later».
  it("the user can change the choice later", () => {
    // Esta línea sirve para invocar la acción «acceptAll» del store de «CookieConsent».
    useCookieConsentStore.getState().acceptAll()
    // Esta línea sirve para ejecutar «preferenceStorage.setItem» sin esperar su resultado.
    void preferenceStorage.setItem("sanken-legal-locale", "x")
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-legal-locale")» cumple «toBe».
    expect(localStorage.getItem("sanken-legal-locale")).toBe("x")

    // Esta línea sirve para invocar la acción «openSettings» del store de «CookieConsent».
    useCookieConsentStore.getState().openSettings()
    // Esta línea sirve para invocar la acción «save» del store de «CookieConsent».
    useCookieConsentStore.getState().save(false)

    // Esta línea sirve para verificar que «useCookieConsentStore.getState(» cumple «settingsOpen».
    expect(useCookieConsentStore.getState().settingsOpen).toBe(false)
    // Esta línea sirve para verificar que «storedConsent()?.categories.preferences» cumple «toBe».
    expect(storedConsent()?.categories.preferences).toBe(false)
    // Esta línea sirve para verificar que «localStorage.getItem("sanken-legal-locale")» cumple «toBeNull».
    expect(localStorage.getItem("sanken-legal-locale")).toBeNull()
  })
})
