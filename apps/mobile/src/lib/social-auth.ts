import { Platform } from 'react-native';
import { GoogleSignin, isCancelledResponse, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

import { firebaseAuth } from '@/lib/firebase';

export interface SocialAuthResult {
  idToken: string;
}

/** El usuario cerró el popup/diálogo o canceló el flujo a propósito — no es un error real. */
export class SocialAuthCancelledError extends Error {}

/** La plataforma actual todavía no tiene el proveedor cableado. */
export class SocialAuthUnavailableError extends Error {}

const CANCELLED_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

let googleSigninConfigured = false;

/** GoogleSignin.configure() solo hace falta llamarlo una vez por vida de la app. */
function ensureGoogleSigninConfigured() {
  if (googleSigninConfigured) return;
  GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
  googleSigninConfigured = true;
}

async function signInWithGoogleNative(): Promise<SocialAuthResult> {
  ensureGoogleSigninConfigured();

  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isCancelledResponse(response)) {
      throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
    }
    if (!isSuccessResponse(response) || !response.data.idToken) {
      throw new Error('Google no devolvió un ID token.');
    }

    // El idToken de @react-native-google-signin es de Google, no de Firebase
    // todavía — signInWithCredential lo intercambia por la sesión de
    // Firebase y de ahí sale el ID Token que sí puede verificar el backend.
    const credential = GoogleAuthProvider.credential(response.data.idToken);
    const firebaseUser = await signInWithCredential(firebaseAuth, credential);
    const idToken = await firebaseUser.user.getIdToken();
    return { idToken };
  } catch (err) {
    if (err instanceof SocialAuthCancelledError) throw err;

    if (isErrorWithCode(err)) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new SocialAuthUnavailableError('Este dispositivo no tiene Google Play Services disponible.');
      }
    }
    throw err;
  }
}

async function signInWithGoogleWeb(): Promise<SocialAuthResult> {
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

export async function signInWithGoogle(): Promise<SocialAuthResult> {
  return Platform.OS === 'web' ? signInWithGoogleWeb() : signInWithGoogleNative();
}

/**
 * GoogleSignin guarda la cuenta elegida en un estado nativo propio,
 * separado de la sesión de SanKen — si no se limpia acá, la próxima vez
 * que el usuario toca "Continuar con Google" el SDK nativo resuelve
 * directo con la última cuenta usada sin volver a mostrar el selector.
 * Se llama desde logout() incluso si el usuario nunca usó Google (por eso
 * todo va en try/catch: son no-ops seguros en ese caso, nunca deben
 * bloquear el logout de SanKen).
 */
export async function signOutFromGoogle(): Promise<void> {
  if (Platform.OS !== 'web') {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Nunca se usó Google en este dispositivo, o Play Services no está — no es un error real acá.
    }
  }
  try {
    await firebaseSignOut(firebaseAuth);
  } catch {
    // Firebase nunca tuvo una sesión activa (login tradicional) — nada que cerrar.
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
