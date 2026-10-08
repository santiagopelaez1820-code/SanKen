// Esta línea sirve para importar los tipos «ReactNode» desde «react».
import type { ReactNode } from "react"
// Esta línea sirve para importar «Navigate, useLocation» desde «react-router-dom».
import { Navigate, useLocation } from "react-router-dom"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «LegalConsentGate» desde «@/components/legal/LegalConsentGate».
import { LegalConsentGate } from "@/components/legal/LegalConsentGate"

// Esta línea sirve para declarar el guardia que exige sesión iniciada.
export function RequireAuth({ children }: { children: ReactNode }) {
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((state) => state.token)
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()

  // Esta línea sirve para revisar si no hay token.
  if (!token) {
    // Esta línea sirve para redirigir al login.
    return <Navigate to="/login" replace />
  }

  // La re-aceptación de documentos legales va antes que onboarding/ubicación:
  // ninguna pantalla autenticada se muestra con consentimientos pendientes.
  // Esta línea sirve para partir del contenido solicitado.
  let content: ReactNode = children

  // Esta línea sirve para revisar si falta completar el onboarding.
  if (user && !user.onboarding_completed && location.pathname !== "/onboarding") {
    // Esta línea sirve para redirigir al onboarding.
    content = <Navigate to="/onboarding" replace />
  // Esta línea sirve para revisar si falta registrar la ubicación.
  } else if (user && user.onboarding_completed && !user.has_location && location.pathname !== "/ubicacion") {
    // Esta línea sirve para redirigir a la encuesta de ubicación.
    content = <Navigate to="/ubicacion" replace />
  }

  // Esta línea sirve para envolver el contenido en el control de consentimientos legales.
  return <LegalConsentGate>{content}</LegalConsentGate>
}
