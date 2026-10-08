// Esta línea sirve para importar «GoogleAuthProvider, signInWithPopup, signOut» desde «firebase/auth».
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
// Esta línea sirve para importar «firebaseAuth» desde «@/lib/firebase».
import { firebaseAuth } from "@/lib/firebase"

// Esta línea sirve para declarar la interfaz «SocialAuthResult».
export interface SocialAuthResult {
  // Esta línea sirve para declarar la propiedad «idToken» con el valor o tipo «string».
  idToken: string
}

/** El usuario cerró el popup a propósito — no es un error real para mostrarle. */
// Esta línea sirve para declarar la clase «SocialAuthCancelledError».
export class SocialAuthCancelledError extends Error {}

// Esta línea sirve para extraer «ANCELLED_CODE» de «new Set(["auth/popup-closed-by-user", "a».
const CANCELLED_CODES = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"])

// Esta línea sirve para declarar la función «signInWithGoogle».
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para extraer «rovide» de «new GoogleAuthProvider()».
    const provider = new GoogleAuthProvider()
    // Esta línea sirve para esperar «signInWithPopup(firebaseAuth, provider)» y guardar el resultado en «credential».
    const credential = await signInWithPopup(firebaseAuth, provider)
    // Esta línea sirve para esperar «credential.user.getIdToken()» y guardar el resultado en «idToken».
    const idToken = await credential.user.getIdToken()
    // La sesión real es la de Sanctum: la de Firebase solo sirve para
    // obtener este ID Token. Cerrarla evita dejar el usuario de Firebase
    // guardado en IndexedDB (firebaseLocalStorageDb) — ver Política de Cookies.
    // El token ya emitido sigue siendo válido para reenviarlo (p. ej. tras
    // aceptar los consentimientos de una cuenta nueva).
    // Esta línea sirve para esperar el resultado de «signOut».
    await signOut(firebaseAuth).catch(() => {})
    // Esta línea sirve para devolver «{ idToken }».
    return { idToken }
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch (err) {
    // Esta línea sirve para extraer «od» de «(err as { code?: string })?.code».
    const code = (err as { code?: string })?.code
    // Esta línea sirve para revisar si «code && CANCELLED_CODES.has(code)».
    if (code && CANCELLED_CODES.has(code)) {
      // Esta línea sirve para lanzar un error de tipo «SocialAuthCancelledError».
      throw new SocialAuthCancelledError("Inicio de sesión cancelado.")
    }
    // Esta línea sirve para relanzar el error original.
    throw err
  }
}

/** Traduce códigos técnicos de Firebase/red a mensajes que un usuario puede entender. */
// Esta línea sirve para declarar la función «describeSocialAuthError».
export function describeSocialAuthError(err: unknown): string {
  // Esta línea sirve para revisar si «err instanceof SocialAuthCancelledError».
  if (err instanceof SocialAuthCancelledError) {
    // Esta línea sirve para devolver «"Inicio de sesión cancelado."».
    return "Inicio de sesión cancelado."
  }

  // Esta línea sirve para extraer «od» de «(err as { code?: string })?.code».
  const code = (err as { code?: string })?.code
  // Esta línea sirve para elegir qué hacer según «code».
  switch (code) {
    // Esta línea sirve para tratar el caso «"auth/popup-blocked"».
    case "auth/popup-blocked":
      // Esta línea sirve para devolver el aviso de ventana emergente bloqueada.
      return "El navegador bloqueó la ventana de inicio de sesión. Habilitá los popups e intentá de nuevo."
    // Esta línea sirve para tratar el caso «"auth/network-request-failed"».
    case "auth/network-request-failed":
      // Esta línea sirve para devolver el aviso de falta de conexión.
      return "No hay conexión. Revisá tu internet e intentá de nuevo."
    // Esta línea sirve para tratar el caso «"auth/account-exists-with-different-credential"».
    case "auth/account-exists-with-different-credential":
      // Esta línea sirve para devolver el aviso de cuenta existente con otro método.
      return "Ya existe una cuenta con este correo usando otro método de inicio de sesión."
    // Esta línea sirve para tratar el caso por defecto.
    default:
      // Esta línea sirve para devolver el aviso genérico de error con Google.
      return "No se pudo iniciar sesión con Google. Inténtalo nuevamente."
  }
}
