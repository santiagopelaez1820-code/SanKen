import type { ReactNode } from "react"
import { RequireRole } from "@/components/RequireRole"

export function RequireTrainer({ children }: { children: ReactNode }) {
  return <RequireRole role="trainer">{children}</RequireRole>
}
