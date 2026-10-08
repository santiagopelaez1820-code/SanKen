// Esta línea sirve para importar los tipos «ReactNode» desde «react».
import type { ReactNode } from "react"
// Esta línea sirve para importar «RequireRole» desde «@/components/RequireRole».
import { RequireRole } from "@/components/RequireRole"

// Esta línea sirve para declarar el guardia que exige rol de entrenador.
export function RequireTrainer({ children }: { children: ReactNode }) {
  // Esta línea sirve para delegar en el guardia de rol con el rol trainer.
  return <RequireRole role="trainer">{children}</RequireRole>
}
