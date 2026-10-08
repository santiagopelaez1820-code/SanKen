// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «disconnectEcho» desde «@/lib/echo».
import { disconnectEcho } from "@/lib/echo"

/**
 * Logout centralizado — antes MoreSheet e IconRail reimplementaban esto
 * cada uno por su lado, y ninguno llamaba a disconnectEcho(), a pesar de
 * que su propio comentario en echo.ts dice que hay que hacerlo antes de
 * volver a pedir getEcho() (si no, la conexión de Reverb del usuario
 * anterior queda viva tras el logout).
 */
// Esta línea sirve para declarar el hook que devuelve la función para cerrar sesión.
export function useLogout() {
  // Esta línea sirve para declarar «clearSession» con el valor «useAuthStore((state) => state.clearSession)».
  const clearSession = useAuthStore((state) => state.clearSession)
  // Esta línea sirve para declarar «navigate» con el valor «useNavigate()».
  const navigate = useNavigate()

  // Esta línea sirve para devolver «() => {».
  return () => {
    // Esta línea sirve para llamar a «disconnectEcho».
    disconnectEcho()
    // Esta línea sirve para llamar a «clearSession».
    clearSession()
    // Esta línea sirve para llamar a «navigate» con «"/login"».
    navigate("/login")
  }
}
