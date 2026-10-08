// Esta línea sirve para importar los tipos «ReactNode» desde «react».
import type { ReactNode } from "react"
// Esta línea sirve para importar «RequireRole» desde «@/components/RequireRole».
import { RequireRole } from "@/components/RequireRole"

// Esta línea sirve para declarar el guardia que exige rol de super administrador.
export function RequireAdmin({ children }: { children: ReactNode }) {
  // Esta línea sirve para delegar en el guardia de rol con el rol super_admin.
  return <RequireRole role="super_admin">{children}</RequireRole>
}
