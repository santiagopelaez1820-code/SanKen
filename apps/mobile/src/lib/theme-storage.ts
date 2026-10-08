// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';

// Esta línea sirve para declarar «KEY» con el valor «'sanken_theme_mode'».
const KEY = 'sanken_theme_mode';

// Esta línea sirve para declarar el tipo «ThemeMode» como «'light' | 'dark' | 'system'».
export type ThemeMode = 'light' | 'dark' | 'system';

// Esta línea sirve para declarar la función «isThemeMode».
function isThemeMode(value: string | null): value is ThemeMode {
  // Esta línea sirve para devolver si el valor es un modo de tema válido.
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Mismo patrón que token-storage.ts / tutorial-storage.ts: SecureStore
 * nativo (ya enlazado, sin sumar AsyncStorage como dependencia nueva) con
 * fallback a localStorage en web.
 */
// Esta línea sirve para declarar «themeStorage» con el valor «{».
export const themeStorage = {
  // Esta línea sirve para declarar el método «get».
  async get(): Promise<ThemeMode> {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para leer el modo de tema guardado.
      const value =
        // Esta línea sirve para revisar si la plataforma es web.
        Platform.OS === 'web'
          // Esta línea sirve para revisar si existe el almacenamiento del navegador.
          ? typeof localStorage !== 'undefined'
            // Esta línea sirve para leer del almacenamiento del navegador.
            ? localStorage.getItem(KEY)
            // Esta línea sirve para devolver null si no existe.
            : null
          // Esta línea sirve para leer del almacén seguro en móvil.
          : await SecureStore.getItemAsync(KEY);
      // Esta línea sirve para devolver «isThemeMode(value) ? value : 'system'».
      return isThemeMode(value) ? value : 'system';
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para devolver «'system'».
      return 'system';
    }
  },

  // Esta línea sirve para declarar el método «set».
  async set(mode: ThemeMode): Promise<void> {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para revisar si «Platform.OS === 'web'».
      if (Platform.OS === 'web') {
        // Esta línea sirve para guardar el modo en el almacenamiento del navegador.
        localStorage?.setItem(KEY, mode);
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
        await SecureStore.setItemAsync(KEY, mode);
      }
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // no-op
    }
  },
};
