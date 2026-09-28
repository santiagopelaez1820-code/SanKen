import { create } from "zustand"
import { COOKIE_CONSENT_STORAGE_KEY, createCookieConsent, parseCookieConsent, type CookieConsent } from "@sanken/core"
import { flushPreferencesToLocalStorage, purgePreferencesFromLocalStorage } from "@/lib/preference-storage"

/**
 * Elección de cookies de este navegador (ver @sanken/core legal/cookies.ts).
 * No usa `persist` de zustand a propósito: la clave guardada es el propio
 * registro de consentimiento (versión + fecha + categorías) y se valida al
 * leerla — una versión vieja de la política o un registro vencido cuentan
 * como "sin decidir" y vuelven a mostrar el banner.
 */
interface CookieConsentState {
  consent: CookieConsent | null
  settingsOpen: boolean
  acceptAll: () => void
  rejectOptional: () => void
  save: (preferences: boolean) => void
  openSettings: () => void
  closeSettings: () => void
  /** Relee el navegador (p. ej. si otra pestaña cambió la elección). */
  reload: () => void
}

function readStoredConsent(): CookieConsent | null {
  try {
    return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

export const useCookieConsentStore = create<CookieConsentState>()((set, get) => ({
  consent: readStoredConsent(),
  settingsOpen: false,

  acceptAll: () => get().save(true),
  rejectOptional: () => get().save(false),

  save: (preferences) => {
    const consent = createCookieConsent(preferences)
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent))
    } catch {
      // Si el navegador bloquea el almacenamiento, la elección vale para esta visita.
    }
    if (preferences) {
      flushPreferencesToLocalStorage()
    } else {
      purgePreferencesFromLocalStorage()
    }
    set({ consent, settingsOpen: false })
  },

  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  reload: () => set({ consent: readStoredConsent() }),
}))

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === COOKIE_CONSENT_STORAGE_KEY) useCookieConsentStore.getState().reload()
  })
}
