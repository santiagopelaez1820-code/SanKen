// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';

// Esta línea sirve para declarar «KEY» con el valor «'sanken_auth_token'».
const KEY = 'sanken_auth_token';

/**
 * SecureStore no soporta web; ahí caemos a localStorage (suficiente para
 * desarrollo — el módulo web "real" del entrenador usará cookies de Sanctum
 * más adelante, ver docs/01-arquitectura.md).
 */
// Esta línea sirve para declarar «tokenStorage» con el valor «{».
export const tokenStorage = {
  // Esta línea sirve para declarar el método «get».
  async get(): Promise<string | null> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para leer el token del almacenamiento del navegador si existe.
      return typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
    }
    // Esta línea sirve para devolver «SecureStore.getItemAsync(KEY)».
    return SecureStore.getItemAsync(KEY);
  },

  // Esta línea sirve para declarar el método «set».
  async set(token: string): Promise<void> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para guardar el token en el almacenamiento del navegador.
      localStorage?.setItem(KEY, token);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
    await SecureStore.setItemAsync(KEY, token);
  },

  // Esta línea sirve para declarar el método «clear».
  async clear(): Promise<void> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para borrar el token del almacenamiento del navegador.
      localStorage?.removeItem(KEY);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.deleteItemAsync».
    await SecureStore.deleteItemAsync(KEY);
  },
};
