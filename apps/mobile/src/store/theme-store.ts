// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';

// Esta línea sirve para importar «themeStorage, type ThemeMode» desde «@/lib/theme-storage».
import { themeStorage, type ThemeMode } from '@/lib/theme-storage';

// Esta línea sirve para declarar la interfaz «ThemeStoreState».
interface ThemeStoreState {
  /** Preferencia elegida por el usuario. 'system' sigue el modo del dispositivo (comportamiento previo a este selector). */
  // Esta línea sirve para declarar la propiedad «mode» con el valor o tipo «ThemeMode».
  mode: ThemeMode;
  // Esta línea sirve para declarar la propiedad «isHydrated» con el valor o tipo «boolean».
  isHydrated: boolean;
  // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «() => Promise<void>».
  hydrate: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «setMode» con el valor o tipo «(mode: ThemeMode) => void».
  setMode: (mode: ThemeMode) => void;
}

// Esta línea sirve para declarar «useThemeStore» con el valor «create<ThemeStoreState>((set) => ({».
export const useThemeStore = create<ThemeStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «mode» con el valor o tipo «'system'».
  mode: 'system',
  // Esta línea sirve para declarar la propiedad «isHydrated» con el valor o tipo «false».
  isHydrated: false,

  // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «async () => {».
  hydrate: async () => {
    // Esta línea sirve para esperar «themeStorage.get()» y guardar el resultado en «mode».
    const mode = await themeStorage.get();
    // Esta línea sirve para guardar en el store: «mode, isHydrated: true })…».
    set({ mode, isHydrated: true });
  },

  // Esta línea sirve para declarar la propiedad «setMode» con el valor o tipo «(mode) => {».
  setMode: (mode) => {
    // Esta línea sirve para guardar en el store: «mode })…».
    set({ mode });
    // Esta línea sirve para ejecutar «themeStorage.set» sin esperar su resultado.
    void themeStorage.set(mode);
  },
}));
