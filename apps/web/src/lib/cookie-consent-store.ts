// Esta línea sirve para importar «create» desde «zustand».
import { create } from "zustand"
// Esta línea sirve para importar las utilidades de consentimiento de cookies del núcleo.
import { COOKIE_CONSENT_STORAGE_KEY, createCookieConsent, parseCookieConsent, type CookieConsent } from "@sanken/core"
// Esta línea sirve para importar «flushPreferencesToLocalStorage, purgePreferencesFromLocalStorage» desde «@/lib/preference-storage».
import { flushPreferencesToLocalStorage, purgePreferencesFromLocalStorage } from "@/lib/preference-storage"

/**
 * Elección de cookies de este navegador (ver @sanken/core legal/cookies.ts).
 * No usa `persist` de zustand a propósito: la clave guardada es el propio
 * registro de consentimiento (versión + fecha + categorías) y se valida al
 * leerla — una versión vieja de la política o un registro vencido cuentan
 * como "sin decidir" y vuelven a mostrar el banner.
 */
// Esta línea sirve para declarar la interfaz «CookieConsentState».
interface CookieConsentState {
  // Esta línea sirve para declarar la propiedad «consent» con el valor o tipo «CookieConsent | null».
  consent: CookieConsent | null
  // Esta línea sirve para declarar la propiedad «settingsOpen» con el valor o tipo «boolean».
  settingsOpen: boolean
  // Esta línea sirve para declarar la propiedad «acceptAll» con el valor o tipo «() => void».
  acceptAll: () => void
  // Esta línea sirve para declarar la propiedad «rejectOptional» con el valor o tipo «() => void».
  rejectOptional: () => void
  // Esta línea sirve para declarar la propiedad «save» con el valor o tipo «(preferences: boolean) => void».
  save: (preferences: boolean) => void
  // Esta línea sirve para declarar la propiedad «openSettings» con el valor o tipo «() => void».
  openSettings: () => void
  // Esta línea sirve para declarar la propiedad «closeSettings» con el valor o tipo «() => void».
  closeSettings: () => void
  /** Relee el navegador (p. ej. si otra pestaña cambió la elección). */
  // Esta línea sirve para declarar la propiedad «reload» con el valor o tipo «() => void».
  reload: () => void
}

// Esta línea sirve para declarar la función «readStoredConsent».
function readStoredConsent(): CookieConsent | null {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para devolver el consentimiento guardado si es válido.
    return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver null.
    return null
  }
}

// Esta línea sirve para declarar «useCookieConsentStore» con el valor «create<CookieConsentState>()((set, get) => ({».
export const useCookieConsentStore = create<CookieConsentState>()((set, get) => ({
  // Esta línea sirve para declarar la propiedad «consent» con el valor o tipo «readStoredConsent()».
  consent: readStoredConsent(),
  // Esta línea sirve para declarar la propiedad «settingsOpen» con el valor o tipo «false».
  settingsOpen: false,

  // Esta línea sirve para declarar la propiedad «acceptAll» con el valor o tipo «() => get().save(true)».
  acceptAll: () => get().save(true),
  // Esta línea sirve para declarar la propiedad «rejectOptional» con el valor o tipo «() => get().save(false)».
  rejectOptional: () => get().save(false),

  // Esta línea sirve para declarar la propiedad «save» con el valor o tipo «(preferences) => {».
  save: (preferences) => {
    // Esta línea sirve para extraer «onsen» de «createCookieConsent(preferences)».
    const consent = createCookieConsent(preferences)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar el consentimiento en el almacenamiento local.
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent))
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Si el navegador bloquea el almacenamiento, la elección vale para esta visita.
    }
    // Esta línea sirve para revisar si «preferences».
    if (preferences) {
      // Esta línea sirve para llamar a «flushPreferencesToLocalStorage».
      flushPreferencesToLocalStorage()
    // Esta línea sirve para ejecutar este bloque en el caso contrario.
    } else {
      // Esta línea sirve para llamar a «purgePreferencesFromLocalStorage».
      purgePreferencesFromLocalStorage()
    }
    // Esta línea sirve para llamar a «set» con «{ consent, settingsOpen: false }».
    set({ consent, settingsOpen: false })
  },

  // Esta línea sirve para declarar la propiedad «openSettings» con el valor o tipo «() => set({ settingsOpen: true })».
  openSettings: () => set({ settingsOpen: true }),
  // Esta línea sirve para declarar la propiedad «closeSettings» con el valor o tipo «() => set({ settingsOpen: false })».
  closeSettings: () => set({ settingsOpen: false }),
  // Esta línea sirve para declarar la propiedad «reload» con el valor o tipo «() => set({ consent: readStoredConsent() })».
  reload: () => set({ consent: readStoredConsent() }),
}))

// Esta línea sirve para revisar si «typeof window !== "undefined"».
if (typeof window !== "undefined") {
  // Esta línea sirve para escuchar los cambios de almacenamiento hechos desde otras pestañas.
  window.addEventListener("storage", (event) => {
    // Esta línea sirve para recargar el consentimiento si cambió la clave de cookies.
    if (event.key === COOKIE_CONSENT_STORAGE_KEY) useCookieConsentStore.getState().reload()
  })
}
