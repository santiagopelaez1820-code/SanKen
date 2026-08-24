import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { firebaseAuth } from '@/lib/firebase';

export interface SocialAuthResult {
  idToken: string;
}

/** El usuario cerró el popup o canceló el flujo a propósito — no es un error real. */
export class SocialAuthCancelledError extends Error {}

/** La plataforma actual todavía no tiene el proveedor cableado (ver README). */
export class SocialAuthUnavailableError extends Error {}

const CANCELLED_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

/**
 * Android/iOS necesitan @react-native-google-signin/google-signin (requiere
 * google-services.json de Firebase, todavía pendiente) — hasta que esté esa
 * pieza, el botón de Google solo funciona en Web, con un error claro en el
 * resto de las plataformas en vez de fallar en silencio o crashear.
 */
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  if (Platform.OS !== 'web') {
    throw new SocialAuthUnavailableError(
      'El inicio de sesión con Google todavía no está disponible en esta versión de la app.',
    );
  }

  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);
    const idToken = await credential.user.getIdToken();
    return { idToken };
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code && CANCELLED_CODES.has(code)) {
      throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
    }
    throw err;
  }
}

/** Traduce códigos técnicos de Firebase/red a mensajes que un usuario puede entender. */
export function describeSocialAuthError(err: unknown): string {
  if (err instanceof SocialAuthCancelledError) {
    return 'Inicio de sesión cancelado.';
  }
  if (err instanceof SocialAuthUnavailableError) {
    return err.message;
  }

  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/popup-blocked':
      return 'El navegador bloqueó la ventana de inicio de sesión. Habilitá los popups e intentá de nuevo.';
    case 'auth/network-request-failed':
      return 'No hay conexión. Revisá tu internet e intentá de nuevo.';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con este correo usando otro método de inicio de sesión.';
    default:
      return 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.';
  }
}
