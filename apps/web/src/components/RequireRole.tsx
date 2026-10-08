// Esta línea sirve para importar los tipos «ReactNode» desde «react».
import type { ReactNode } from "react"
// Esta línea sirve para importar «Navigate» desde «react-router-dom».
import { Navigate } from "react-router-dom"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"

/** Guard genérico por rol — RequireAdmin/RequireTrainer son wrappers de esto, antes eran dos copias idénticas salvo el rol comparado. */
// Esta línea sirve para declarar el guardia que exige un rol concreto.
export function RequireRole({ role, children }: { role: User["role"]; children: ReactNode }) {
  // Esta línea sirve para obtener «currentRole» con el hook «useAuthStore».
  const currentRole = useAuthStore((state) => state.user?.role)

  // Esta línea sirve para revisar si el rol del usuario no coincide.
  if (currentRole !== role) {
    // Esta línea sirve para redirigir al dashboard.
    return <Navigate to="/dashboard" replace />
  }

  // Esta línea sirve para mostrar el contenido protegido.
  return children
}
