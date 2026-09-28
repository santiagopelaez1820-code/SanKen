import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ApiError,
  buildConsentFields,
  isSocialConsentRequired,
  isTwoFactorChallenge,
  type ConsentType,
  type PendingConsent,
  type SocialLoginPayload,
  type SocialLoginResponse,
} from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { describeSocialAuthError, signInWithGoogle, SocialAuthCancelledError } from "@/lib/social-auth"

interface PendingSocialConsent {
  idToken: string
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
export function useGoogleAuth(preAccepted?: Partial<Record<ConsentType, boolean>>) {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const setPendingChallenge = useAuthStore((state) => state.setPendingChallenge)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingConsent, setPendingConsent] = useState<PendingSocialConsent | null>(null)

  const submit = async (idToken: string, accepted?: Partial<Record<ConsentType, boolean>>) => {
    const payload: SocialLoginPayload = {
      id_token: idToken,
      provider: "google",
      ...(accepted ? buildConsentFields(accepted) : {}),
    }
    await api.bootstrapCsrf()
    const response = await api.post<SocialLoginResponse>("/auth/social", payload)

    if (isSocialConsentRequired(response)) {
      setPendingConsent({ idToken, consents: response.consents })
      return
    }

    setPendingConsent(null)

    if (isTwoFactorChallenge(response)) {
      setPendingChallenge(response.challenge_token)
      navigate("/login/verify")
      return
    }

    setSession(response.token, response.user)
    navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
  }

  const handleError = (err: unknown) => {
    if (err instanceof SocialAuthCancelledError) return
    if (err instanceof ApiError) {
      const firstFieldError = Object.values(err.body.errors ?? {})[0]?.[0]
      setError(firstFieldError ?? err.body.message)
      return
    }
    setError(describeSocialAuthError(err))
  }

  const start = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const { idToken } = await signInWithGoogle()
      const allPreAccepted = preAccepted && Object.values(preAccepted).length > 0 && Object.values(preAccepted).every(Boolean)
      await submit(idToken, allPreAccepted ? preAccepted : undefined)
    } catch (err) {
      handleError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmConsent = async (accepted: Partial<Record<ConsentType, boolean>>) => {
    if (!pendingConsent) return
    setError(null)
    setIsSubmitting(true)
    try {
      await submit(pendingConsent.idToken, accepted)
    } catch (err) {
      handleError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    start,
    isSubmitting,
    error,
    pendingConsent,
    confirmConsent,
    cancelConsent: () => setPendingConsent(null),
  }
}
