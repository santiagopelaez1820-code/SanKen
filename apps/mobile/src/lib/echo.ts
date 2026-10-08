// Esta línea sirve para importar «Pusher» desde «pusher-js/react-native».
import Pusher from 'pusher-js/react-native';
// Esta línea sirve para importar «createEcho» desde «@sanken/core».
import { createEcho } from '@sanken/core';

// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/**
 * `pusher-js` normal (el default export del paquete) usa APIs de browser en
 * su propio código de carga y no anda bajo Metro/Hermes — hay que usar el
 * build separado `pusher-js/react-native` que el propio paquete provee para
 * esto, inyectado acá en vez de dejar que @sanken/core lo importe (ver el
 * comentario en createEcho: ese archivo es compartido con la web).
 */
// Esta línea sirve para declarar «instance» con el valor «null».
let instance: ReturnType<typeof createEcho> | null = null;

// Esta línea sirve para declarar la función «getEcho».
export function getEcho() {
  // Esta línea sirve para revisar si «!instance».
  if (!instance) {
    // Esta línea sirve para extraer «oke» de «useAuthStore.getState().token».
    const token = useAuthStore.getState().token;
    // Esta línea sirve para revisar si «!token».
    if (!token) {
      // Esta línea sirve para lanzar un error de tipo «Error».
      throw new Error('getEcho() requiere una sesión autenticada.');
    }

    // Esta línea sirve para asignar «createEcho({» a «instance».
    instance = createEcho({
      // Esta línea sirve para declarar la propiedad «key» con el valor o tipo «process.env.EXPO_PUBLIC_REVERB_APP_KEY ?? ''».
      key: process.env.EXPO_PUBLIC_REVERB_APP_KEY ?? '',
      // Esta línea sirve para definir «host» con «process.env.EXPO_PUBLIC_REVERB_HOST ?? '…».
      host: process.env.EXPO_PUBLIC_REVERB_HOST ?? 'localhost',
      // Esta línea sirve para definir «port» con «Number(process.env.EXPO_PUBLIC_REVERB_PO…».
      port: Number(process.env.EXPO_PUBLIC_REVERB_PORT ?? 8080),
      // Esta línea sirve para definir «scheme» con «(process.env.EXPO_PUBLIC_REVERB_SCHEME ?…».
      scheme: (process.env.EXPO_PUBLIC_REVERB_SCHEME ?? 'http') as 'http' | 'https',
      // Esta línea sirve para definir «apiBaseUrl» con «process.env.EXPO_PUBLIC_API_URL ?? 'http…».
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
      // Esta línea sirve para incluir el valor «token» en la lista.
      token,
      // Esta línea sirve para declarar la propiedad «pusherClient» con el valor o tipo «Pusher».
      pusherClient: Pusher,
    });
  }

  // Esta línea sirve para devolver «instance».
  return instance;
}

// Esta línea sirve para declarar la función «disconnectEcho».
export function disconnectEcho() {
  // Esta línea sirve para desconectar la instancia de Echo si existe.
  instance?.disconnect();
  // Esta línea sirve para asignar «null» a «instance».
  instance = null;
}
