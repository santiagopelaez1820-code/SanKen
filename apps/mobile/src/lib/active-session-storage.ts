import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'sanken_active_workout_session_id';

/**
 * Guarda solo el ID de la sesión de entrenamiento en curso — el resto del
 * estado (ejercicio actual, series completadas) se recalcula siempre desde
 * GET /workout-sessions/:id al reabrir la app (fuente de verdad = servidor,
 * no una copia local que se pueda desincronizar). Mismo patrón que
 * token-storage.ts.
 */
export const activeSessionStorage = {
  async get(): Promise<number | null> {
    const raw =
      Platform.OS === 'web'
        ? (typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null)
        : await SecureStore.getItemAsync(KEY);
    return raw ? Number(raw) : null;
  },

  async set(sessionId: number): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage?.setItem(KEY, String(sessionId));
      return;
    }
    await SecureStore.setItemAsync(KEY, String(sessionId));
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage?.removeItem(KEY);
      return;
    }
    await SecureStore.deleteItemAsync(KEY);
  },
};
