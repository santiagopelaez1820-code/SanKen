import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DEFAULT_LEGAL_LOCALE, LEGAL_STRINGS, type LegalLocale } from "@sanken/core"
import { preferenceStorage } from "@/lib/preference-storage"

/**
 * Idioma de los documentos legales y de los textos del sistema legal. La
 * app no tiene i18n global (su interfaz es en español); este idioma solo lo
 * cambia el selector de las páginas legales. Es una cookie de
 * "Preferencias": sin consentimiento se recuerda solo durante la visita.
 */
interface LegalLocaleState {
  locale: LegalLocale
  setLocale: (locale: LegalLocale) => void
}

export const useLegalLocaleStore = create<LegalLocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LEGAL_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    { name: "sanken-legal-locale", storage: createJSONStorage(() => preferenceStorage) }
  )
)

export function useLegalStrings() {
  const locale = useLegalLocaleStore((s) => s.locale)
  return { locale, t: LEGAL_STRINGS[locale] }
}
