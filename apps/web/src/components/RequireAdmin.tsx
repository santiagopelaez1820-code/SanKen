import type { ReactNode } from "react"
import { RequireRole } from "@/components/RequireRole"

export function RequireAdmin({ children }: { children: ReactNode }) {
  return <RequireRole role="super_admin">{children}</RequireRole>
}
