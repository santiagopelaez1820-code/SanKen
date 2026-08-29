import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseAuth } from "@/lib/firebase"

export interface SocialAuthResult {
  idToken: string
}

/** El usuario cerró el popup a propósito — no es un error real para mostrarle. */
export class SocialAuthCancelledError extends Error {}

const CANCELLED_CODES = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"])

export async function signInWithGoogle(): Promise<SocialAuthResult> {
  try {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(firebaseAuth, provider)
    const idToken = await credential.user.getIdToken()
    return { idToken }
  } catch (err) {
    const code = (err as { code?: string })?.code
    if (code && CANCELLED_CODES.has(code)) {
      throw new SocialAuthCancelledError("Inicio de sesión cancelado.")
    }
    throw err
  }
}

/** Traduce códigos técnicos de Firebase/red a mensajes que un usuario puede entender. */
export function describeSocialAuthError(err: unknown): string {
  if (err instanceof SocialAuthCancelledError) {
    return "Inicio de sesión cancelado."
  }

  const code = (err as { code?: string })?.code
  switch (code) {
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana de inicio de sesión. Habilitá los popups e intentá de nuevo."
    case "auth/network-request-failed":
      return "No hay conexión. Revisá tu internet e intentá de nuevo."
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con este correo usando otro método de inicio de sesión."
    default:
      return "No se pudo iniciar sesión con Google. Inténtalo nuevamente."
  }
}
