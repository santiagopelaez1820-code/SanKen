import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const PREFIX = 'sanken_tutorial_seen_';

function key(userId: number | string, section: string): string {
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
export const tutorialStorage = {
  async hasSeen(userId: number | string, section: string): Promise<boolean> {
    try {
      const value =
        Platform.OS === 'web'
          ? typeof localStorage !== 'undefined'
            ? localStorage.getItem(key(userId, section))
            : null
          : await SecureStore.getItemAsync(key(userId, section));
      return value === '1';
    } catch {
      // Si el storage falla por lo que sea, mejor no insistir con el
      // tutorial en cada apertura de pantalla.
      return true;
    }
  },

  async markSeen(userId: number | string, section: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage?.setItem(key(userId, section), '1');
      } else {
        await SecureStore.setItemAsync(key(userId, section), '1');
      }
    } catch {
      // no-op
    }
  },
};
