import { create } from 'zustand';
import { DEFAULT_LEGAL_LOCALE, type LegalLocale } from '@sanken/core';

/**
 * Idioma de los documentos legales. La app no tiene i18n global (su
 * interfaz es en español); solo lo cambia el selector de las pantallas
 * legales. No se persiste: al abrir la app vuelve al español, que es el
 * texto de referencia.
 */
interface LegalLocaleState {
  locale: LegalLocale;
  setLocale: (locale: LegalLocale) => void;
}

export const useLegalLocaleStore = create<LegalLocaleState>((set) => ({
  locale: DEFAULT_LEGAL_LOCALE,
  setLocale: (locale) => set({ locale }),
}));
