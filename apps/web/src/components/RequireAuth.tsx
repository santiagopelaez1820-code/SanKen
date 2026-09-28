import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { LegalConsentGate } from "@/components/legal/LegalConsentGate"

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // La re-aceptación de documentos legales va antes que onboarding/ubicación:
  // ninguna pantalla autenticada se muestra con consentimientos pendientes.
  let content: ReactNode = children

  if (user && !user.onboarding_completed && location.pathname !== "/onboarding") {
    content = <Navigate to="/onboarding" replace />
  } else if (user && user.onboarding_completed && !user.has_location && location.pathname !== "/ubicacion") {
    content = <Navigate to="/ubicacion" replace />
  }

  return <LegalConsentGate>{content}</LegalConsentGate>
}
