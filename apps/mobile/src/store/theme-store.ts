import { create } from 'zustand';

import { themeStorage, type ThemeMode } from '@/lib/theme-storage';

interface ThemeStoreState {
  /** Preferencia elegida por el usuario. 'system' sigue el modo del dispositivo (comportamiento previo a este selector). */
  mode: ThemeMode;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  mode: 'system',
  isHydrated: false,

  hydrate: async () => {
    const mode = await themeStorage.get();
    set({ mode, isHydrated: true });
  },

  setMode: (mode) => {
    set({ mode });
    void themeStorage.set(mode);
  },
}));
