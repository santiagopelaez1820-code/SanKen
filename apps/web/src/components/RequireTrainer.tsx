import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"

export function RequireTrainer({ children }: { children: ReactNode }) {
  const role = useAuthStore((state) => state.user?.role)

  if (role !== "trainer") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
