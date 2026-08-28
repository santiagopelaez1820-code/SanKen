import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { disconnectEcho } from "@/lib/echo"

/**
 * Logout centralizado — antes MoreSheet e IconRail reimplementaban esto
 * cada uno por su lado, y ninguno llamaba a disconnectEcho(), a pesar de
 * que su propio comentario en echo.ts dice que hay que hacerlo antes de
 * volver a pedir getEcho() (si no, la conexión de Reverb del usuario
 * anterior queda viva tras el logout).
 */
export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()

  return () => {
    disconnectEcho()
    clearSession()
    navigate("/login")
  }
}
