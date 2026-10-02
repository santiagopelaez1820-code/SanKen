import { useEffect } from 'react';
import { Platform } from 'react-native';
import { router, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';

/** Ruta a abrir según los datos del push: `link` (soporte, check-in) o el chat. */
export function linkFromNotificationData(data: Record<string, unknown> | undefined | null): string | null {
  if (!data) return null;
  if (typeof data.link === 'string' && data.link.startsWith('/')) return data.link;
  if (typeof data.conversation_id === 'number' || typeof data.conversation_id === 'string') return `/chat/${data.conversation_id}`;
  return null;
}

/**
 * Al tocar una notificación push (app abierta, en segundo plano o cerrada),
 * abre la pantalla que corresponde — mismo `link` que usan el feed y el
 * service worker de la web. Montado una vez en el layout raíz, después de
 * restaurar la sesión: los gates de cada sección se encargan de mandar al
 * login o a la re-aceptación si hace falta.
 */
export function NotificationLinkHandler() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const open = (response: Notifications.NotificationResponse | null) => {
      const link = linkFromNotificationData(response?.notification.request.content.data as Record<string, unknown> | undefined);
      if (link) router.push(link as Href);
    };

    // La app se abrió desde una notificación estando cerrada.
    void Notifications.getLastNotificationResponseAsync().then(open).catch(() => {});
    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    return () => subscription.remove();
  }, []);

  return null;
}
