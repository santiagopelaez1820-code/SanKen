import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'sanken_theme_mode';

export type ThemeMode = 'light' | 'dark' | 'system';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Mismo patrón que token-storage.ts / tutorial-storage.ts: SecureStore
 * nativo (ya enlazado, sin sumar AsyncStorage como dependencia nueva) con
 * fallback a localStorage en web.
 */
export const themeStorage = {
  async get(): Promise<ThemeMode> {
    try {
      const value =
        Platform.OS === 'web'
          ? typeof localStorage !== 'undefined'
            ? localStorage.getItem(KEY)
            : null
          : await SecureStore.getItemAsync(KEY);
      return isThemeMode(value) ? value : 'system';
    } catch {
      return 'system';
    }
  },

  async set(mode: ThemeMode): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage?.setItem(KEY, mode);
      } else {
        await SecureStore.setItemAsync(KEY, mode);
      }
    } catch {
      // no-op
    }
  },
};
