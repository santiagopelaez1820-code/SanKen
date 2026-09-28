import type { StateStorage } from "zustand/middleware"
import { COOKIE_CONSENT_STORAGE_KEY, isPreferenceStorageKey, parseCookieConsent } from "@sanken/core"

/**
 * Almacenamiento para la categoría "Preferencias" de la Política de Cookies
 * (tema, tutoriales vistos, idioma de los documentos legales). Solo escribe
 * en localStorage si el usuario permitió esa categoría; si no (o si todavía
 * no decidió), guarda en memoria: la preferencia funciona durante la visita
 * y se olvida al recargar — exactamente lo que dice la política.
 *
 * Leer sí se permite siempre: leer no crea nada en el navegador, y así un
 * valor guardado antes de existir el banner (o con el consentimiento dado)
 * se sigue respetando.
 */
const memory = new Map<string, string>()

function hasPreferenceConsent(): boolean {
  try {
    return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))?.categories.preferences === true
  } catch {
    return false
  }
}

export const preferenceStorage: StateStorage = {
  getItem(key) {
    if (memory.has(key)) return memory.get(key) ?? null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key, value) {
    memory.set(key, value)
    if (!hasPreferenceConsent()) return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Storage lleno o bloqueado: la preferencia queda en memoria.
    }
  },
  removeItem(key) {
    memory.delete(key)
    try {
      localStorage.removeItem(key)
    } catch {
      // no-op
    }
  },
}

/** Consentimiento otorgado: persiste lo que se venía guardando solo en memoria durante esta visita. */
export function flushPreferencesToLocalStorage(): void {
  try {
    for (const [key, value] of memory) localStorage.setItem(key, value)
  } catch {
    // no-op
  }
}

/**
 * Consentimiento retirado/rechazado: borra del navegador toda clave de
 * preferencias. Los valores actuales siguen en memoria para no cambiarle la
 * interfaz de golpe al usuario en mitad de la visita.
 */
export function purgePreferencesFromLocalStorage(): void {
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && isPreferenceStorageKey(key)) keys.push(key)
    }
    for (const key of keys) {
      const value = localStorage.getItem(key)
      if (value !== null && !memory.has(key)) memory.set(key, value)
      localStorage.removeItem(key)
    }
  } catch {
    // no-op
  }
}

/** Solo para tests. */
export function resetPreferenceMemoryForTests(): void {
  memory.clear()
}
