import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'sanken_auth_token';

/**
 * SecureStore no soporta web; ahí caemos a localStorage (suficiente para
 * desarrollo — el módulo web "real" del entrenador usará cookies de Sanctum
 * más adelante, ver docs/01-arquitectura.md).
 */
export const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
    }
    return SecureStore.getItemAsync(KEY);
  },

  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage?.setItem(KEY, token);
      return;
    }
    await SecureStore.setItemAsync(KEY, token);
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage?.removeItem(KEY);
      return;
    }
    await SecureStore.deleteItemAsync(KEY);
  },
};
