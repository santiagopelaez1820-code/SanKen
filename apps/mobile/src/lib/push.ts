import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { api } from '@/lib/api';

/**
 * Requiere un build de EAS dev-client con el plugin expo-notifications
 * (ver app.json) — no funciona en Expo Go (SDK 57 no es compatible, ver
 * memoria de testing en dispositivo) ni en el simulador de iOS (push remoto
 * no soportado ahí). Falla en silencio en esos casos: es un opt-in, no algo
 * que deba tumbar la app si no está disponible.
 */
export async function registerForPushNotificationsAsync(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      // Tiene que crearse ANTES de pedir el token/permiso en Android 13+, o
      // el prompt de permiso ni aparece — confirmado en la doc versionada
      // de Expo SDK 57, no es una suposición.
      await Notifications.setNotificationChannelAsync('default', {
        name: 'SanKen',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);

    await api.post('/push/expo-token', { token });
  } catch {
    // Sin device físico/build de dev-client no hay mucho más que hacer acá
    // que no intentarlo de nuevo la próxima vez que se llame.
  }
}
