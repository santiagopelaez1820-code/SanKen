// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar «DEFAULT_LEGAL_LOCALE, type LegalLocale» desde «@sanken/core».
import { DEFAULT_LEGAL_LOCALE, type LegalLocale } from '@sanken/core';

/**
 * Idioma de los documentos legales. La app no tiene i18n global (su
 * interfaz es en español); solo lo cambia el selector de las pantallas
 * legales. No se persiste: al abrir la app vuelve al español, que es el
 * texto de referencia.
 */
// Esta línea sirve para declarar la interfaz «LegalLocaleState».
interface LegalLocaleState {
  // Esta línea sirve para declarar la propiedad «locale» con el valor o tipo «LegalLocale».
  locale: LegalLocale;
  // Esta línea sirve para declarar la propiedad «setLocale» con el valor o tipo «(locale: LegalLocale) => void».
  setLocale: (locale: LegalLocale) => void;
}

// Esta línea sirve para declarar «useLegalLocaleStore» con el valor «create<LegalLocaleState>((set) => ({».
export const useLegalLocaleStore = create<LegalLocaleState>((set) => ({
  // Esta línea sirve para declarar la propiedad «locale» con el valor o tipo «DEFAULT_LEGAL_LOCALE».
  locale: DEFAULT_LEGAL_LOCALE,
  // Esta línea sirve para declarar la propiedad «setLocale» con el valor o tipo «(locale) => set({ locale })».
  setLocale: (locale) => set({ locale }),
}));
