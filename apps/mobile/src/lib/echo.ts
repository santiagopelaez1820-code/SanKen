import Pusher from 'pusher-js/react-native';
import { createEcho } from '@sanken/core';

import { useAuthStore } from '@/store/auth-store';

/**
 * `pusher-js` normal (el default export del paquete) usa APIs de browser en
 * su propio código de carga y no anda bajo Metro/Hermes — hay que usar el
 * build separado `pusher-js/react-native` que el propio paquete provee para
 * esto, inyectado acá en vez de dejar que @sanken/core lo importe (ver el
 * comentario en createEcho: ese archivo es compartido con la web).
 */
let instance: ReturnType<typeof createEcho> | null = null;

export function getEcho() {
  if (!instance) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('getEcho() requiere una sesión autenticada.');
    }

    instance = createEcho({
      key: process.env.EXPO_PUBLIC_REVERB_APP_KEY ?? '',
      host: process.env.EXPO_PUBLIC_REVERB_HOST ?? 'localhost',
      port: Number(process.env.EXPO_PUBLIC_REVERB_PORT ?? 8080),
      scheme: (process.env.EXPO_PUBLIC_REVERB_SCHEME ?? 'http') as 'http' | 'https',
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
      token,
      pusherClient: Pusher,
    });
  }

  return instance;
}

export function disconnectEcho() {
  instance?.disconnect();
  instance = null;
}
