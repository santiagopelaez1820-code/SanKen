import { preferenceStorage } from "@/lib/preference-storage"

const PREFIX = "sanken_tutorial_seen_"

function key(userId: number | string, section: string): string {
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
export const tutorialStorage = {
  hasSeen(userId: number | string, section: string): boolean {
    try {
      return preferenceStorage.getItem(key(userId, section)) === "1"
    } catch {
      return true
    }
  },

  markSeen(userId: number | string, section: string): void {
    try {
      void preferenceStorage.setItem(key(userId, section), "1")
    } catch {
      // no-op
    }
  },
}
