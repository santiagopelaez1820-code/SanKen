import { beforeEach, describe, expect, it } from "vitest"
import { COOKIE_CONSENT_STORAGE_KEY } from "@sanken/core"
import { useCookieConsentStore } from "./cookie-consent-store"
import { preferenceStorage, resetPreferenceMemoryForTests } from "./preference-storage"
import { useThemeStore } from "./theme-store"
import { tutorialStorage } from "./tutorial-storage"

function storedConsent() {
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

describe("cookie consent", () => {
  beforeEach(() => {
    localStorage.clear()
    resetPreferenceMemoryForTests()
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  it("starts undecided so the banner is shown", () => {
    useCookieConsentStore.getState().reload()
    expect(useCookieConsentStore.getState().consent).toBeNull()
  })

  it("does not write preference keys to the browser before consent", () => {
    useThemeStore.getState().setMode("light")
    tutorialStorage.markSeen(1, "dashboard")

    expect(localStorage.getItem("sanken-theme")).toBeNull()
    expect(localStorage.getItem("sanken_tutorial_seen_1_dashboard")).toBeNull()
    // …pero la preferencia funciona durante la visita.
    expect(tutorialStorage.hasSeen(1, "dashboard")).toBe(true)
  })

  it("accept all stores the choice and persists preferences chosen before deciding", () => {
    useThemeStore.getState().setMode("light")
    useCookieConsentStore.getState().acceptAll()

    expect(storedConsent()?.categories).toEqual({ necessary: true, preferences: true })
    expect(localStorage.getItem("sanken-theme")).toContain('"light"')

    useThemeStore.getState().setMode("dark")
    expect(localStorage.getItem("sanken-theme")).toContain('"dark"')
  })

  it("reject optional stores the choice and deletes existing preference keys", () => {
    localStorage.setItem("sanken-theme", JSON.stringify({ state: { mode: "light" }, version: 0 }))
    localStorage.setItem("sanken_tutorial_seen_7_progress", "1")
    localStorage.setItem("sanken-auth", "keep-me")

    useCookieConsentStore.getState().rejectOptional()

    expect(storedConsent()?.categories).toEqual({ necessary: true, preferences: false })
    expect(localStorage.getItem("sanken-theme")).toBeNull()
    expect(localStorage.getItem("sanken_tutorial_seen_7_progress")).toBeNull()
    // Las necesarias no se tocan.
    expect(localStorage.getItem("sanken-auth")).toBe("keep-me")
    // La visita actual no cambia de golpe.
    expect(tutorialStorage.hasSeen(7, "progress")).toBe(true)
  })

  it("custom settings are saved and survive a reload", () => {
    useCookieConsentStore.getState().save(true)
    useCookieConsentStore.setState({ consent: null })

    useCookieConsentStore.getState().reload()
    expect(useCookieConsentStore.getState().consent?.categories.preferences).toBe(true)
  })

  it("the user can change the choice later", () => {
    useCookieConsentStore.getState().acceptAll()
    void preferenceStorage.setItem("sanken-legal-locale", "x")
    expect(localStorage.getItem("sanken-legal-locale")).toBe("x")

    useCookieConsentStore.getState().openSettings()
    useCookieConsentStore.getState().save(false)

    expect(useCookieConsentStore.getState().settingsOpen).toBe(false)
    expect(storedConsent()?.categories.preferences).toBe(false)
    expect(localStorage.getItem("sanken-legal-locale")).toBeNull()
  })
})
