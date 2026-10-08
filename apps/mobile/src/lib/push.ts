// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «Notifications» desde «expo-notifications».
import * as Notifications from 'expo-notifications';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';
// Esta línea sirve para importar «Constants» y «ExecutionEnvironment» desde «expo-constants».
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Esta línea sirve para importar «api» desde «@/lib/api».
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
// Esta línea sirve para declarar «PREFERENCE_KEY» con el valor «'sanken_push_preference'».
const PREFERENCE_KEY = 'sanken_push_preference';

// Esta línea sirve para declarar la función «getStoredPreference».
async function getStoredPreference(): Promise<'enabled' | 'disabled' | null> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar «SecureStore.getItemAsync(PREFERENCE_KEY)» y guardar el resultado en «value».
    const value = await SecureStore.getItemAsync(PREFERENCE_KEY);
    // Esta línea sirve para devolver la preferencia solo si es válida.
    return value === 'enabled' || value === 'disabled' ? value : null;
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver null.
    return null;
  }
}

// Esta línea sirve para declarar la función «setStoredPreference».
async function setStoredPreference(value: 'enabled' | 'disabled'): Promise<void> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
    await SecureStore.setItemAsync(PREFERENCE_KEY, value);
  // Esta línea sirve para capturar cualquier error del bloque anterior.
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
// Esta línea sirve para declarar los resultados posibles del registro de notificaciones.
export type PushRegistrationResult =
  /** Token registrado en el backend. */
  // Esta línea sirve para incluir el resultado «enabled».
  | 'enabled'
  /** Registro automático del boot omitido porque el usuario lo apagó a mano. */
  // Esta línea sirve para incluir el resultado «skipped».
  | 'skipped'
  /** El usuario rechazó el prompt de permiso recién ahora. */
  // Esta línea sirve para incluir el resultado «denied».
  | 'denied'
  /** El SO ya no deja volver a preguntar — solo se habilita desde Ajustes del sistema. */
  // Esta línea sirve para incluir el resultado «blocked».
  | 'blocked'
  /** Expo Go, emulador sin Google Play, etc. — push remoto no disponible acá. */
  // Esta línea sirve para incluir el resultado «unavailable».
  | 'unavailable'
  /** Falló obtener el token o registrarlo en el backend (red, FCM, etc). */
  // Esta línea sirve para incluir el resultado «error».
  | 'error';

// Esta línea sirve para declarar la función «registerForPushNotificationsAsync».
export async function registerForPushNotificationsAsync(options?: { silent?: boolean }): Promise<PushRegistrationResult> {
  // Esta línea sirve para omitir el registro si el usuario lo desactivó y se pidió modo silencioso.
  if (options?.silent && (await getStoredPreference()) === 'disabled') return 'skipped';
  // Esta línea sirve para omitir el registro en web y en Expo Go.
  if (Platform.OS === 'web' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return 'unavailable';

  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para revisar si «Platform.OS === 'android'».
    if (Platform.OS === 'android') {
      // Tiene que crearse ANTES de pedir el token/permiso en Android 13+, o
      // el prompt de permiso ni aparece — confirmado en la doc versionada
      // de Expo SDK 57, no es una suposición.
      // Esta línea sirve para esperar el resultado de «Notifications.setNotificationChannelAsync».
      await Notifications.setNotificationChannelAsync('default', {
        // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'SanKen'».
        name: 'SanKen',
        // Esta línea sirve para declarar la propiedad «importance» con el valor o tipo «Notifications.AndroidImportance.MAX».
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // Esta línea sirve para esperar «Notifications.getPermissionsAsync()» y guardar el resultado en «existing».
    const existing = await Notifications.getPermissionsAsync();
    // Esta línea sirve para extraer «inalStatu» de «existing.status».
    let finalStatus = existing.status;
    // Esta línea sirve para revisar si «existing.status !== 'granted'».
    if (existing.status !== 'granted') {
      // Antes esto terminaba en un return silencioso: si el permiso había
      // sido rechazado alguna vez, Android ya no muestra el prompt y el
      // switch de Configuración "rebotaba" a apagado sin explicar nada
      // (reporte del tester). Ahora se distingue para poder ofrecer ir a
      // Ajustes del sistema.
      // Esta línea sirve para devolver «'blocked'» si «!existing.canAskAgain».
      if (!existing.canAskAgain) return 'blocked';
      // Esta línea sirve para esperar «Notifications.requestPermissionsAsync()» y guardar el resultado en «requested».
      const requested = await Notifications.requestPermissionsAsync();
      // Esta línea sirve para asignar «requested.status» a «finalStatus».
      finalStatus = requested.status;
      // Esta línea sirve para devolver «denied» o «blocked» si no se concedió el permiso.
      if (finalStatus !== 'granted') return requested.canAskAgain ? 'denied' : 'blocked';
    }
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver «'unavailable'».
    return 'unavailable';
  }

  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para extraer «rojectI» de «Constants.expoConfig?.extra?.eas?.projec».
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    // Esta línea sirve para esperar «Notifications.getExpoPushTokenAsync(proj» y obtener «data: token».
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);

    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/push/expo-token', { token });
    // Esta línea sirve para esperar el resultado de «setStoredPreference».
    await setStoredPreference('enabled');
    // Esta línea sirve para devolver «'enabled'».
    return 'enabled';
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch (err) {
    // Esta línea sirve para avisar que no se pudo registrar el token.
    console.warn('[push] no se pudo registrar el token:', err);
    // Esta línea sirve para devolver «'error'».
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
// Esta línea sirve para declarar la función «unregisterFromPushNotifications».
export async function unregisterFromPushNotifications(): Promise<void> {
  // Esta línea sirve para esperar el resultado de «setStoredPreference».
  await setStoredPreference('disabled');
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar «Notifications.getPermissionsAsync()» y obtener «status».
    const { status } = await Notifications.getPermissionsAsync();
    // Esta línea sirve para salir de la función si «status !== 'granted'».
    if (status !== 'granted') return;

    // Esta línea sirve para extraer «rojectI» de «Constants.expoConfig?.extra?.eas?.projec».
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    // Esta línea sirve para esperar «Notifications.getExpoPushTokenAsync(proj» y obtener «data: token».
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete('/push/expo-token', { token });
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Nada que borrar del lado del server si nunca se llegó a registrar un token.
  }
}

/**
 * Estado a mostrar en el switch de Configuración: requiere permiso del SO
 * concedido Y que el usuario no lo haya apagado a mano — cualquiera de las
 * dos cosas en contra se muestra como desactivado.
 */
// Esta línea sirve para declarar la función «isPushNotificationsEnabled».
export async function isPushNotificationsEnabled(): Promise<boolean> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar «Notifications.getPermissionsAsync()» y obtener «status».
    const { status } = await Notifications.getPermissionsAsync();
    // Esta línea sirve para devolver «false» si «status !== 'granted'».
    if (status !== 'granted') return false;
    // Esta línea sirve para devolver «(await getStoredPreference()) !== 'disabled'».
    return (await getStoredPreference()) !== 'disabled';
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver «false».
    return false;
  }
}
