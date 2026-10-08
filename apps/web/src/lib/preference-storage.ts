// Esta línea sirve para importar los tipos «StateStorage» desde «zustand/middleware».
import type { StateStorage } from "zustand/middleware"
// Esta línea sirve para importar «COOKIE_CONSENT_STORAGE_KEY, isPreferenceStorageKey, parseCookieConsent» desde «@sanken/core».
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
// Esta línea sirve para declarar «memory» con el valor «new Map<string, string>()».
const memory = new Map<string, string>()

// Esta línea sirve para declarar la función «hasPreferenceConsent».
function hasPreferenceConsent(): boolean {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para devolver si el usuario aceptó las cookies de preferencias.
    return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))?.categories.preferences === true
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver «false».
    return false
  }
}

// Esta línea sirve para declarar «preferenceStorage» con el valor «{».
export const preferenceStorage: StateStorage = {
  // Esta línea sirve para declarar el método «getItem».
  getItem(key) {
    // Esta línea sirve para devolver «memory.get(key) ?? null» si «memory.has(key)».
    if (memory.has(key)) return memory.get(key) ?? null
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para devolver «localStorage.getItem(key)».
      return localStorage.getItem(key)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para devolver null.
      return null
    }
  },
  // Esta línea sirve para declarar el método «setItem».
  setItem(key, value) {
    // Esta línea sirve para llamar a «memory.set» con «key, value».
    memory.set(key, value)
    // Esta línea sirve para salir de la función si «!hasPreferenceConsent()».
    if (!hasPreferenceConsent()) return
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para llamar a «localStorage.setItem» con «key, value».
      localStorage.setItem(key, value)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Storage lleno o bloqueado: la preferencia queda en memoria.
    }
  },
  // Esta línea sirve para declarar el método «removeItem».
  removeItem(key) {
    // Esta línea sirve para llamar a «memory.delete» con «key».
    memory.delete(key)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para llamar a «localStorage.removeItem» con «key».
      localStorage.removeItem(key)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // no-op
    }
  },
}

/** Consentimiento otorgado: persiste lo que se venía guardando solo en memoria durante esta visita. */
// Esta línea sirve para declarar la función «flushPreferencesToLocalStorage».
export function flushPreferencesToLocalStorage(): void {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para recorrer las preferencias en memoria y guardarlas en el almacenamiento local.
    for (const [key, value] of memory) localStorage.setItem(key, value)
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // no-op
  }
}

/**
 * Consentimiento retirado/rechazado: borra del navegador toda clave de
 * preferencias. Los valores actuales siguen en memoria para no cambiarle la
 * interfaz de golpe al usuario en mitad de la visita.
 */
// Esta línea sirve para declarar la función «purgePreferencesFromLocalStorage».
export function purgePreferencesFromLocalStorage(): void {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para extraer «eys: string[» de «[]».
    const keys: string[] = []
    // Esta línea sirve para recorrer los elementos con «let i = 0; i < localStorage.length; i++».
    for (let i = 0; i < localStorage.length; i++) {
      // Esta línea sirve para extraer «e» de «localStorage.key(i)».
      const key = localStorage.key(i)
      // Esta línea sirve para agregar la clave a la lista si es una preferencia.
      if (key && isPreferenceStorageKey(key)) keys.push(key)
    }
    // Esta línea sirve para recorrer los elementos con «const key of keys».
    for (const key of keys) {
      // Esta línea sirve para extraer «alu» de «localStorage.getItem(key)».
      const value = localStorage.getItem(key)
      // Esta línea sirve para copiar a memoria el valor si no estaba ya.
      if (value !== null && !memory.has(key)) memory.set(key, value)
      // Esta línea sirve para llamar a «localStorage.removeItem» con «key».
      localStorage.removeItem(key)
    }
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // no-op
  }
}

/** Solo para tests. */
// Esta línea sirve para declarar la función «resetPreferenceMemoryForTests».
export function resetPreferenceMemoryForTests(): void {
  // Esta línea sirve para llamar a «memory.clear».
  memory.clear()
}
