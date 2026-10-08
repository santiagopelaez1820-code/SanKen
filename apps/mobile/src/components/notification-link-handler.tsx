// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar «router, type Href» desde «expo-router».
import { router, type Href } from 'expo-router';
// Esta línea sirve para importar todo el módulo como «Notifications» desde «expo-notifications».
import * as Notifications from 'expo-notifications';

/** Ruta a abrir según los datos del push: `link` (soporte, check-in) o el chat. */
// Esta línea sirve para declarar la función «linkFromNotificationData».
export function linkFromNotificationData(data: Record<string, unknown> | undefined | null): string | null {
  // Esta línea sirve para devolver null si «!data».
  if (!data) return null;
  // Esta línea sirve para devolver la ruta del enlace si empieza con barra.
  if (typeof data.link === 'string' && data.link.startsWith('/')) return data.link;
  // Esta línea sirve para devolver la ruta del chat si la notificación trae una conversación.
  if (typeof data.conversation_id === 'number' || typeof data.conversation_id === 'string') return `/chat/${data.conversation_id}`;
  // Esta línea sirve para devolver null.
  return null;
}

/**
 * Al tocar una notificación push (app abierta, en segundo plano o cerrada),
 * abre la pantalla que corresponde — mismo `link` que usan el feed y el
 * service worker de la web. Montado una vez en el layout raíz, después de
 * restaurar la sesión: los gates de cada sección se encargan de mandar al
 * login o a la re-aceptación si hace falta.
 */
// Esta línea sirve para declarar la función «NotificationLinkHandler».
export function NotificationLinkHandler() {
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «Platform.OS === 'web'».
    if (Platform.OS === 'web') return;

    // Esta línea sirve para extraer «pe» de «(response: Notifications.NotificationRes».
    const open = (response: Notifications.NotificationResponse | null) => {
      // Esta línea sirve para extraer «in» de «linkFromNotificationData(response?.notif».
      const link = linkFromNotificationData(response?.notification.request.content.data as Record<string, unknown> | undefined);
      // Esta línea sirve para llamar a «router.push» si «link».
      if (link) router.push(link as Href);
    };

    // La app se abrió desde una notificación estando cerrada.
    // Esta línea sirve para ejecutar «Notifications.getLastNotificationResponseAsync» sin esperar su resultado.
    void Notifications.getLastNotificationResponseAsync().then(open).catch(() => {});
    // Esta línea sirve para extraer «ubscriptio» de «Notifications.addNotificationResponseRec».
    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    // Esta línea sirve para devolver «() => subscription.remove()».
    return () => subscription.remove();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para devolver null.
  return null;
}
