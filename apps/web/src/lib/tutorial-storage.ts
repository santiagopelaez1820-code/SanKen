// Esta línea sirve para importar «preferenceStorage» desde «@/lib/preference-storage».
import { preferenceStorage } from "@/lib/preference-storage"

// Esta línea sirve para declarar «PREFIX» con el valor «"sanken_tutorial_seen_"».
const PREFIX = "sanken_tutorial_seen_"

// Esta línea sirve para declarar la función «key».
function key(userId: number | string, section: string): string {
  // Esta línea sirve para devolver «`${PREFIX}${userId}_${section}`».
  return `${PREFIX}${userId}_${section}`
}

/**
 * Espejo de apps/mobile/src/lib/tutorial-storage.ts. La clave incluye el
 * userId (no solo la sección): un tutorial "visto" en este navegador con
 * una cuenta no debe silenciarlo para una cuenta nueva que se loguea en el
 * mismo navegador.
 *
 * Es una cookie de "Preferencias" (ver Política de Cookies): sin
 * consentimiento se recuerda solo durante la visita (preferenceStorage).
 */
// Esta línea sirve para declarar «tutorialStorage» con el valor «{».
export const tutorialStorage = {
  // Esta línea sirve para declarar el método «hasSeen».
  hasSeen(userId: number | string, section: string): boolean {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para devolver si el tutorial de la sección ya fue visto.
      return preferenceStorage.getItem(key(userId, section)) === "1"
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para devolver «true».
      return true
    }
  },

  // Esta línea sirve para declarar el método «markSeen».
  markSeen(userId: number | string, section: string): void {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para ejecutar «preferenceStorage.setItem» sin esperar su resultado.
      void preferenceStorage.setItem(key(userId, section), "1")
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // no-op
    }
  },
}
