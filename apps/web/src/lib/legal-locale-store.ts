// Esta línea sirve para importar «create» desde «zustand».
import { create } from "zustand"
// Esta línea sirve para importar «createJSONStorage, persist» desde «zustand/middleware».
import { createJSONStorage, persist } from "zustand/middleware"
// Esta línea sirve para importar «DEFAULT_LEGAL_LOCALE, LEGAL_STRINGS, type LegalLocale» desde «@sanken/core».
import { DEFAULT_LEGAL_LOCALE, LEGAL_STRINGS, type LegalLocale } from "@sanken/core"
// Esta línea sirve para importar «preferenceStorage» desde «@/lib/preference-storage».
import { preferenceStorage } from "@/lib/preference-storage"

/**
 * Idioma de los documentos legales y de los textos del sistema legal. La
 * app no tiene i18n global (su interfaz es en español); este idioma solo lo
 * cambia el selector de las páginas legales. Es una cookie de
 * "Preferencias": sin consentimiento se recuerda solo durante la visita.
 */
// Esta línea sirve para declarar la interfaz «LegalLocaleState».
interface LegalLocaleState {
  // Esta línea sirve para declarar la propiedad «locale» con el valor o tipo «LegalLocale».
  locale: LegalLocale
  // Esta línea sirve para declarar la propiedad «setLocale» con el valor o tipo «(locale: LegalLocale) => void».
  setLocale: (locale: LegalLocale) => void
}

// Esta línea sirve para declarar «useLegalLocaleStore» con el valor «create<LegalLocaleState>()(».
export const useLegalLocaleStore = create<LegalLocaleState>()(
  // Esta línea sirve para envolver el store con la persistencia.
  persist(
    // Esta línea sirve para declarar el estado inicial y las acciones.
    (set) => ({
      // Esta línea sirve para declarar la propiedad «locale» con el valor o tipo «DEFAULT_LEGAL_LOCALE».
      locale: DEFAULT_LEGAL_LOCALE,
      // Esta línea sirve para declarar la propiedad «setLocale» con el valor o tipo «(locale) => set({ locale })».
      setLocale: (locale) => set({ locale }),
    }),
    // Esta línea sirve para configurar el nombre y el almacenamiento de la preferencia.
    { name: "sanken-legal-locale", storage: createJSONStorage(() => preferenceStorage) }
  )
)

// Esta línea sirve para declarar la función «useLegalStrings».
export function useLegalStrings() {
  // Esta línea sirve para extraer «ocal» de «useLegalLocaleStore((s) => s.locale)».
  const locale = useLegalLocaleStore((s) => s.locale)
  // Esta línea sirve para devolver «{ locale, t: LEGAL_STRINGS[locale] }».
  return { locale, t: LEGAL_STRINGS[locale] }
}
