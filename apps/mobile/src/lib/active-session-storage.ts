// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';

// Esta línea sirve para declarar «KEY» con el valor «'sanken_active_workout_session_id'».
const KEY = 'sanken_active_workout_session_id';

/**
 * Guarda solo el ID de la sesión de entrenamiento en curso — el resto del
 * estado (ejercicio actual, series completadas) se recalcula siempre desde
 * GET /workout-sessions/:id al reabrir la app (fuente de verdad = servidor,
 * no una copia local que se pueda desincronizar). Mismo patrón que
 * token-storage.ts.
 */
// Esta línea sirve para declarar «activeSessionStorage» con el valor «{».
export const activeSessionStorage = {
  // Esta línea sirve para declarar el método «get».
  async get(): Promise<number | null> {
    // Esta línea sirve para leer la sesión guardada.
    const raw =
      // Esta línea sirve para revisar si la plataforma es web.
      Platform.OS === 'web'
        // Esta línea sirve para usar el almacenamiento del navegador si existe.
        ? (typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null)
        // Esta línea sirve para usar el almacén seguro del dispositivo en móvil.
        : await SecureStore.getItemAsync(KEY);
    // Esta línea sirve para devolver «raw ? Number(raw) : null».
    return raw ? Number(raw) : null;
  },

  // Esta línea sirve para declarar el método «set».
  async set(sessionId: number): Promise<void> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para guardar el id de la sesión en el almacenamiento del navegador.
      localStorage?.setItem(KEY, String(sessionId));
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
    await SecureStore.setItemAsync(KEY, String(sessionId));
  },

  // Esta línea sirve para declarar el método «clear».
  async clear(): Promise<void> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para borrar la sesión del almacenamiento del navegador.
      localStorage?.removeItem(KEY);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.deleteItemAsync».
    await SecureStore.deleteItemAsync(KEY);
  },
};
