import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import Constants, { ExecutionEnvironment } from 'expo-constants';

import { api } from '@/lib/api';

/**
 * El SO no deja "desactivar" el permiso de notificaciones desde la app (solo
 * el usuario puede desde Ajustes del sistema) — esta preferencia local es lo
 * que distingue "el usuario apagó push desde Configuración" de "nunca se le
 * preguntó todavía", para que el registro automático del boot (ver
 * app/(app)/_layout.tsx) respete un opt-out explícito en vez de volver a
 * pedir/registrar en cada apertura. Se guarda en SecureStore (ya es
 * dependencia del proyecto vía token-storage.ts) en vez de sumar
 * AsyncStorage como dependencia nueva solo para un booleano.
 */
const PREFERENCE_KEY = 'sanken_push_preference';

async function getStoredPreference(): Promise<'enabled' | 'disabled' | null> {
  try {
    const value = await SecureStore.getItemAsync(PREFERENCE_KEY);
    return value === 'enabled' || value === 'disabled' ? value : null;
  } catch {
    return null;
  }
}

async function setStoredPreference(value: 'enabled' | 'disabled'): Promise<void> {
  try {
    await SecureStore.setItemAsync(PREFERENCE_KEY, value);
  } catch {
    // No es crítico — en el peor caso el próximo boot vuelve a preguntar.
  }
}

/**
 * Requiere un build de EAS dev-client con el plugin expo-notifications
 * (ver app.json) — no funciona en Expo Go (SDK 57 no es compatible, ver
 * memoria de testing en dispositivo) ni en el simulador de iOS (push remoto
 * no soportado ahí). Nunca tira: devuelve un PushRegistrationResult para que
 * Configuración pueda explicar por qué no se activó; el boot lo ignora.
 *
 * `silent`: true en el registro automático del boot — ahí se respeta un
 * "disabled" guardado (no vuelve a pedir permiso/registrar). false cuando lo
 * dispara el usuario a mano desde el switch de Configuración, donde sí debe
 * proceder siempre así el usuario pueda prender push de nuevo tras haberlo
 * apagado antes.
 */
export type PushRegistrationResult =
  /** Token registrado en el backend. */
  | 'enabled'
  /** Registro automático del boot omitido porque el usuario lo apagó a mano. */
  | 'skipped'
  /** El usuario rechazó el prompt de permiso recién ahora. */
  | 'denied'
  /** El SO ya no deja volver a preguntar — solo se habilita desde Ajustes del sistema. */
  | 'blocked'
  /** Expo Go, emulador sin Google Play, etc. — push remoto no disponible acá. */
  | 'unavailable'
  /** Falló obtener el token o registrarlo en el backend (red, FCM, etc). */
  | 'error';

export async function registerForPushNotificationsAsync(options?: { silent?: boolean }): Promise<PushRegistrationResult> {
  if (options?.silent && (await getStoredPreference()) === 'disabled') return 'skipped';
  if (Platform.OS === 'web' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return 'unavailable';

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

    const existing = await Notifications.getPermissionsAsync();
    let finalStatus = existing.status;
    if (existing.status !== 'granted') {
      // Antes esto terminaba en un return silencioso: si el permiso había
      // sido rechazado alguna vez, Android ya no muestra el prompt y el
      // switch de Configuración "rebotaba" a apagado sin explicar nada
      // (reporte del tester). Ahora se distingue para poder ofrecer ir a
      // Ajustes del sistema.
      if (!existing.canAskAgain) return 'blocked';
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
      if (finalStatus !== 'granted') return requested.canAskAgain ? 'denied' : 'blocked';
    }
  } catch {
    return 'unavailable';
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);

    await api.post('/push/expo-token', { token });
    await setStoredPreference('enabled');
    return 'enabled';
  } catch (err) {
    console.warn('[push] no se pudo registrar el token:', err);
    return 'error';
  }
}

/**
 * "Desactivar" push acá no puede revocar el permiso del SO desde la app
 * (eso solo lo hace el usuario desde Ajustes del sistema) — lo que sí se
 * puede y se hace es borrar el registro del token en el backend (corta los
 * push reales) y guardar la preferencia para que el boot no lo vuelva a
 * registrar solo. Mismo criterio que unsubscribeFromWebPush() en
 * apps/web/src/lib/web-push.ts.
 */
export async function unregisterFromPushNotifications(): Promise<void> {
  await setStoredPreference('disabled');
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    await api.delete('/push/expo-token', { token });
  } catch {
    // Nada que borrar del lado del server si nunca se llegó a registrar un token.
  }
}

/**
 * Estado a mostrar en el switch de Configuración: requiere permiso del SO
 * concedido Y que el usuario no lo haya apagado a mano — cualquiera de las
 * dos cosas en contra se muestra como desactivado.
 */
export async function isPushNotificationsEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return false;
    return (await getStoredPreference()) !== 'disabled';
  } catch {
    return false;
  }
}
