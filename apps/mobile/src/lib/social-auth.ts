// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar «GoogleSignin, isCancelledResponse, isErrorWithCode, isSuccessResponse, statusCodes» desde «@react-native-google-signin/google-signin».
import { GoogleSignin, isCancelledResponse, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
// Esta línea sirve para importar «GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut as firebaseSignOut» desde «firebase/auth».
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Esta línea sirve para importar «firebaseAuth» desde «@/lib/firebase».
import { firebaseAuth } from '@/lib/firebase';

// Esta línea sirve para declarar la interfaz «SocialAuthResult».
export interface SocialAuthResult {
  // Esta línea sirve para declarar la propiedad «idToken» con el valor o tipo «string».
  idToken: string;
}

/** El usuario cerró el popup/diálogo o canceló el flujo a propósito — no es un error real. */
// Esta línea sirve para declarar la clase «SocialAuthCancelledError».
export class SocialAuthCancelledError extends Error {}

/** La plataforma actual todavía no tiene el proveedor cableado. */
// Esta línea sirve para declarar la clase «SocialAuthUnavailableError».
export class SocialAuthUnavailableError extends Error {}

// Esta línea sirve para declarar «CANCELLED_CODES» con el valor «new Set([».
const CANCELLED_CODES = new Set([
  // Esta línea sirve para incluir el texto o las clases «auth/popup-closed-by-user…».
  'auth/popup-closed-by-user',
  // Esta línea sirve para incluir el texto o las clases «auth/cancelled-popup-request…».
  'auth/cancelled-popup-request',
  // Esta línea sirve para incluir el texto o las clases «auth/user-cancelled…».
  'auth/user-cancelled',
]);

// Esta línea sirve para extraer «oogleSigninConfigure» de «false».
let googleSigninConfigured = false;

/** GoogleSignin.configure() solo hace falta llamarlo una vez por vida de la app. */
// Esta línea sirve para declarar la función «ensureGoogleSigninConfigured».
function ensureGoogleSigninConfigured() {
  // Esta línea sirve para salir de la función si «googleSigninConfigured».
  if (googleSigninConfigured) return;
  // Esta línea sirve para configurar Google Sign-In con el cliente web del entorno.
  GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
  // Esta línea sirve para asignar «true» a «googleSigninConfigured».
  googleSigninConfigured = true;
}

// Esta línea sirve para declarar la función «signInWithGoogleNative».
async function signInWithGoogleNative(): Promise<SocialAuthResult> {
  // Esta línea sirve para llamar a «ensureGoogleSigninConfigured».
  ensureGoogleSigninConfigured();

  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar el resultado de «GoogleSignin.hasPlayServices».
    await GoogleSignin.hasPlayServices();
    // Esta línea sirve para esperar «GoogleSignin.signIn()» y guardar el resultado en «response».
    const response = await GoogleSignin.signIn();

    // Esta línea sirve para revisar si «isCancelledResponse(response)».
    if (isCancelledResponse(response)) {
      // Esta línea sirve para lanzar un error de tipo «SocialAuthCancelledError».
      throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
    }
    // Esta línea sirve para revisar si «!isSuccessResponse(response) || !response.data.idToken».
    if (!isSuccessResponse(response) || !response.data.idToken) {
      // Esta línea sirve para lanzar un error de tipo «Error».
      throw new Error('Google no devolvió un ID token.');
    }

    // El idToken de @react-native-google-signin es de Google, no de Firebase
    // todavía — signInWithCredential lo intercambia por la sesión de
    // Firebase y de ahí sale el ID Token que sí puede verificar el backend.
    // Esta línea sirve para extraer «redentia» de «GoogleAuthProvider.credential(response.d».
    const credential = GoogleAuthProvider.credential(response.data.idToken);
    // Esta línea sirve para esperar «signInWithCredential(firebaseAuth, credential)» y guardar el resultado en «firebaseUser».
    const firebaseUser = await signInWithCredential(firebaseAuth, credential);
    // Esta línea sirve para esperar «firebaseUser.user.getIdToken()» y guardar el resultado en «idToken».
    const idToken = await firebaseUser.user.getIdToken();
    // Esta línea sirve para devolver «{ idToken }».
    return { idToken };
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch (err) {
    // Esta línea sirve para lanzar un error si «err instanceof SocialAuthCancelledError».
    if (err instanceof SocialAuthCancelledError) throw err;

    // Esta línea sirve para revisar si «isErrorWithCode(err)».
    if (isErrorWithCode(err)) {
      // Esta línea sirve para revisar si «err.code === statusCodes.SIGN_IN_CANCELLED».
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        // Esta línea sirve para lanzar un error de tipo «SocialAuthCancelledError».
        throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
      }
      // Esta línea sirve para revisar si «err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE».
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Esta línea sirve para lanzar un error de tipo «SocialAuthUnavailableError».
        throw new SocialAuthUnavailableError('Este dispositivo no tiene Google Play Services disponible.');
      }
    }
    // Esta línea sirve para relanzar el error original.
    throw err;
  }
}

// Esta línea sirve para declarar la función «signInWithGoogleWeb».
async function signInWithGoogleWeb(): Promise<SocialAuthResult> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para extraer «rovide» de «new GoogleAuthProvider()».
    const provider = new GoogleAuthProvider();
    // Esta línea sirve para esperar «signInWithPopup(firebaseAuth, provider)» y guardar el resultado en «credential».
    const credential = await signInWithPopup(firebaseAuth, provider);
    // Esta línea sirve para esperar «credential.user.getIdToken()» y guardar el resultado en «idToken».
    const idToken = await credential.user.getIdToken();
    // Esta línea sirve para devolver «{ idToken }».
    return { idToken };
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch (err) {
    // Esta línea sirve para extraer «od» de «(err as { code?: string })?.code».
    const code = (err as { code?: string })?.code;
    // Esta línea sirve para revisar si «code && CANCELLED_CODES.has(code)».
    if (code && CANCELLED_CODES.has(code)) {
      // Esta línea sirve para lanzar un error de tipo «SocialAuthCancelledError».
      throw new SocialAuthCancelledError('Inicio de sesión cancelado.');
    }
    // Esta línea sirve para relanzar el error original.
    throw err;
  }
}

// Esta línea sirve para declarar la función «signInWithGoogle».
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  // Esta línea sirve para iniciar sesión con Google según la plataforma.
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
// Esta línea sirve para declarar la función «signOutFromGoogle».
export async function signOutFromGoogle(): Promise<void> {
  // Esta línea sirve para revisar si «Platform.OS !== 'web'».
  if (Platform.OS !== 'web') {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «GoogleSignin.signOut».
      await GoogleSignin.signOut();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Nunca se usó Google en este dispositivo, o Play Services no está — no es un error real acá.
    }
  }
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar el resultado de «firebaseSignOut».
    await firebaseSignOut(firebaseAuth);
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Firebase nunca tuvo una sesión activa (login tradicional) — nada que cerrar.
  }
}

/** Traduce códigos técnicos de Firebase/red a mensajes que un usuario puede entender. */
// Esta línea sirve para declarar la función «describeSocialAuthError».
export function describeSocialAuthError(err: unknown): string {
  // Esta línea sirve para revisar si «err instanceof SocialAuthCancelledError».
  if (err instanceof SocialAuthCancelledError) {
    // Esta línea sirve para devolver «'Inicio de sesión cancelado.'».
    return 'Inicio de sesión cancelado.';
  }
  // Esta línea sirve para revisar si «err instanceof SocialAuthUnavailableError».
  if (err instanceof SocialAuthUnavailableError) {
    // Esta línea sirve para devolver «err.message».
    return err.message;
  }

  // Esta línea sirve para extraer «od» de «(err as { code?: string })?.code».
  const code = (err as { code?: string })?.code;
  // Esta línea sirve para elegir qué hacer según «code».
  switch (code) {
    // Esta línea sirve para tratar el caso «'auth/popup-blocked'».
    case 'auth/popup-blocked':
      // Esta línea sirve para devolver el aviso de ventana emergente bloqueada.
      return 'El navegador bloqueó la ventana de inicio de sesión. Habilitá los popups e intentá de nuevo.';
    // Esta línea sirve para tratar el caso «'auth/network-request-failed'».
    case 'auth/network-request-failed':
      // Esta línea sirve para devolver el aviso de falta de conexión.
      return 'No hay conexión. Revisá tu internet e intentá de nuevo.';
    // Esta línea sirve para tratar el caso «'auth/account-exists-with-different-credential'».
    case 'auth/account-exists-with-different-credential':
      // Esta línea sirve para devolver el aviso de cuenta existente con otro método.
      return 'Ya existe una cuenta con este correo usando otro método de inicio de sesión.';
    // Esta línea sirve para tratar el caso por defecto.
    default:
      // Esta línea sirve para devolver el aviso genérico de error con Google.
      return 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.';
  }
}
