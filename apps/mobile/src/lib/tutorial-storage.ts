// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';

// Esta línea sirve para declarar «PREFIX» con el valor «'sanken_tutorial_seen_'».
const PREFIX = 'sanken_tutorial_seen_';

// Esta línea sirve para declarar la función «key».
function key(userId: number | string, section: string): string {
  // Esta línea sirve para devolver «`${PREFIX}${userId}_${section}`».
  return `${PREFIX}${userId}_${section}`;
}

/**
 * Reusa SecureStore (ya enlazado para el token de auth, ver token-storage.ts)
 * en vez de sumar @react-native-async-storage/async-storage como dependencia
 * nueva solo para esto: si el APK/dev client ya instalado en el teléfono no
 * tiene ese módulo nativo linkeado, cualquier pantalla con tutorial
 * crashearía hasta el próximo build. SecureStore ya está disponible ahora.
 * En web cae a localStorage, igual que token-storage.ts.
 *
 * La clave incluye el userId (no solo la sección): un tutorial "visto" en
 * este dispositivo con una cuenta no debe silenciarlo para una cuenta nueva
 * que se loguea en el mismo dispositivo/navegador.
 */
// Esta línea sirve para declarar «tutorialStorage» con el valor «{».
export const tutorialStorage = {
  // Esta línea sirve para declarar el método «hasSeen».
  async hasSeen(userId: number | string, section: string): Promise<boolean> {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para leer el tutorial visto.
      const value =
        // Esta línea sirve para revisar si la plataforma es web.
        Platform.OS === 'web'
          // Esta línea sirve para revisar si existe el almacenamiento del navegador.
          ? typeof localStorage !== 'undefined'
            // Esta línea sirve para leer del almacenamiento del navegador.
            ? localStorage.getItem(key(userId, section))
            // Esta línea sirve para devolver null si no existe.
            : null
          // Esta línea sirve para leer del almacén seguro en móvil.
          : await SecureStore.getItemAsync(key(userId, section));
      // Esta línea sirve para devolver «value === '1'».
      return value === '1';
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Si el storage falla por lo que sea, mejor no insistir con el
      // tutorial en cada apertura de pantalla.
      // Esta línea sirve para devolver «true».
      return true;
    }
  },

  // Esta línea sirve para declarar el método «markSeen».
  async markSeen(userId: number | string, section: string): Promise<void> {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para revisar si «Platform.OS === 'web'».
      if (Platform.OS === 'web') {
        // Esta línea sirve para marcar el tutorial como visto en el navegador.
        localStorage?.setItem(key(userId, section), '1');
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
        await SecureStore.setItemAsync(key(userId, section), '1');
      }
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // no-op
    }
  },
};
