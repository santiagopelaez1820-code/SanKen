// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para abrir la importación de utilidades del núcleo.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «buildConsentFields» en la lista.
  buildConsentFields,
  // Esta línea sirve para incluir el valor «isSocialConsentRequired» en la lista.
  isSocialConsentRequired,
  // Esta línea sirve para incluir el valor «isTwoFactorChallenge» en la lista.
  isTwoFactorChallenge,
  // Esta línea sirve para importar el tipo de consentimiento.
  type ConsentType,
  // Esta línea sirve para importar el tipo de consentimiento pendiente.
  type PendingConsent,
  // Esta línea sirve para importar el tipo de la petición de login social.
  type SocialLoginPayload,
  // Esta línea sirve para importar el tipo de la respuesta de login social.
  type SocialLoginResponse,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «describeSocialAuthError, signInWithGoogle, SocialAuthCancelledError» desde «@/lib/social-auth».
import { describeSocialAuthError, signInWithGoogle, SocialAuthCancelledError } from "@/lib/social-auth"

// Esta línea sirve para declarar la interfaz «PendingSocialConsent».
interface PendingSocialConsent {
  // Esta línea sirve para declarar la propiedad «idToken» con el valor o tipo «string».
  idToken: string
  // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «PendingConsent[]».
  consents: PendingConsent[]
}

/**
 * "Continuar con Google" compartido por login y registro. Si la cuenta de
 * Google es nueva y todavía no se aceptaron los consentimientos, el backend
 * responde requires_consent SIN crear la cuenta: se guarda el id_token,
 * `pendingConsent` abre el diálogo de casillas y `confirmConsent()` reenvía
 * el mismo token con los accept_* marcados.
 *
 * `preAccepted`: casillas ya marcadas en el formulario de registro — si
 * están todas, se mandan en el primer intento y no hace falta el diálogo.
 */
// Esta línea sirve para declarar el hook que gestiona el inicio de sesión con Google.
export function useGoogleAuth(preAccepted?: Partial<Record<ConsentType, boolean>>) {
  // Esta línea sirve para declarar «navigate» con el valor «useNavigate()».
  const navigate = useNavigate()
  // Esta línea sirve para declarar «setSession» con el valor «useAuthStore((state) => state.setSession)».
  const setSession = useAuthStore((state) => state.setSession)
  // Esta línea sirve para declarar «setPendingChallenge» con el valor «useAuthStore((state) => state.setPendingChallenge)».
  const setPendingChallenge = useAuthStore((state) => state.setPendingChallenge)
  // Esta línea sirve para guardar si se está enviando la petición.
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Esta línea sirve para guardar el mensaje de error.
  const [error, setError] = useState<string | null>(null)
  // Esta línea sirve para guardar los consentimientos pendientes del registro social.
  const [pendingConsent, setPendingConsent] = useState<PendingSocialConsent | null>(null)

  // Esta línea sirve para declarar la función que envía el token de Google a la API.
  const submit = async (idToken: string, accepted?: Partial<Record<ConsentType, boolean>>) => {
    // Esta línea sirve para declarar «payload» con el valor «{».
    const payload: SocialLoginPayload = {
      // Esta línea sirve para declarar la propiedad «id_token» con el valor o tipo «idToken».
      id_token: idToken,
      // Esta línea sirve para declarar la propiedad «provider» con el valor o tipo «"google"».
      provider: "google",
      // Esta línea sirve para incluir los campos de consentimiento si ya se aceptaron.
      ...(accepted ? buildConsentFields(accepted) : {}),
    }
    // Esta línea sirve para esperar el resultado de «api.bootstrapCsrf».
    await api.bootstrapCsrf()
    // Esta línea sirve para esperar «api.post<SocialLoginResponse>("/auth/social", payl» y guardar el resultado en «response».
    const response = await api.post<SocialLoginResponse>("/auth/social", payload)

    // Esta línea sirve para revisar si «isSocialConsentRequired(response)».
    if (isSocialConsentRequired(response)) {
      // Esta línea sirve para llamar a «setPendingConsent» con «{ idToken, consents: response.consents }».
      setPendingConsent({ idToken, consents: response.consents })
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para llamar a «setPendingConsent» con «null».
    setPendingConsent(null)

    // Esta línea sirve para revisar si «isTwoFactorChallenge(response)».
    if (isTwoFactorChallenge(response)) {
      // Esta línea sirve para llamar a «setPendingChallenge» con «response.challenge_token».
      setPendingChallenge(response.challenge_token)
      // Esta línea sirve para llamar a «navigate» con «"/login/verify"».
      navigate("/login/verify")
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para llamar a «setSession» con «response.token, response.user».
    setSession(response.token, response.user)
    // Esta línea sirve para navegar al panel del entrenador o al dashboard según el rol, sin dejar historial.
    navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
  }

  // Esta línea sirve para declarar «handleError» con el valor «(err: unknown) => {».
  const handleError = (err: unknown) => {
    // Esta línea sirve para salir de la función si «err instanceof SocialAuthCancelledError».
    if (err instanceof SocialAuthCancelledError) return
    // Esta línea sirve para revisar si «err instanceof ApiError».
    if (err instanceof ApiError) {
      // Esta línea sirve para declarar «firstFieldError» con el valor «Object.values(err.body.errors ?? {})[0]?.[0]».
      const firstFieldError = Object.values(err.body.errors ?? {})[0]?.[0]
      // Esta línea sirve para llamar a «setError» con «firstFieldError ?? err.body.message».
      setError(firstFieldError ?? err.body.message)
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }
    // Esta línea sirve para llamar a «setError» con «describeSocialAuthError(err)».
    setError(describeSocialAuthError(err))
  }

  // Esta línea sirve para declarar «start» con el valor «async () => {».
  const start = async () => {
    // Esta línea sirve para llamar a «setError» con «null».
    setError(null)
    // Esta línea sirve para llamar a «setIsSubmitting» con «true».
    setIsSubmitting(true)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «signInWithGoogle()» y obtener «idToken».
      const { idToken } = await signInWithGoogle()
      // Esta línea sirve para calcular si todos los consentimientos ya estaban aceptados.
      const allPreAccepted = preAccepted && Object.values(preAccepted).length > 0 && Object.values(preAccepted).every(Boolean)
      // Esta línea sirve para esperar el resultado de «submit».
      await submit(idToken, allPreAccepted ? preAccepted : undefined)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para llamar a «handleError» con «err».
      handleError(err)
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para llamar a «setIsSubmitting» con «false».
      setIsSubmitting(false)
    }
  }

  // Esta línea sirve para declarar la función que confirma los consentimientos y reintenta el login.
  const confirmConsent = async (accepted: Partial<Record<ConsentType, boolean>>) => {
    // Esta línea sirve para salir de la función si «!pendingConsent».
    if (!pendingConsent) return
    // Esta línea sirve para llamar a «setError» con «null».
    setError(null)
    // Esta línea sirve para llamar a «setIsSubmitting» con «true».
    setIsSubmitting(true)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «submit».
      await submit(pendingConsent.idToken, accepted)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para llamar a «handleError» con «err».
      handleError(err)
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para llamar a «setIsSubmitting» con «false».
      setIsSubmitting(false)
    }
  }

  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para incluir el valor «start» en la lista.
    start,
    // Esta línea sirve para incluir el valor «isSubmitting» en la lista.
    isSubmitting,
    // Esta línea sirve para incluir el valor «error» en la lista.
    error,
    // Esta línea sirve para incluir el valor «pendingConsent» en la lista.
    pendingConsent,
    // Esta línea sirve para incluir el valor «confirmConsent» en la lista.
    confirmConsent,
    // Esta línea sirve para declarar la propiedad «cancelConsent» con el valor o tipo «() => setPendingConsent(null)».
    cancelConsent: () => setPendingConsent(null),
  }
}
