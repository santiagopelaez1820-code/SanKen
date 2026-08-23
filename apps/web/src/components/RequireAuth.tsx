import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user && !user.onboarding_completed && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  if (user && user.onboarding_completed && !user.has_location && location.pathname !== "/ubicacion") {
    return <Navigate to="/ubicacion" replace />
  }

  return children
}
