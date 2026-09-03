import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import type { User } from "@sanken/core"

/** Guard genérico por rol — RequireAdmin/RequireTrainer son wrappers de esto, antes eran dos copias idénticas salvo el rol comparado. */
export function RequireRole({ role, children }: { role: User["role"]; children: ReactNode }) {
  const currentRole = useAuthStore((state) => state.user?.role)

  if (currentRole !== role) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
