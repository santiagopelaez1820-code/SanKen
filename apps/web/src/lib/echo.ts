import Pusher from "pusher-js"
import { createEcho } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"

/**
 * Instancia perezosa: se crea recién cuando algo la pide (ChallengeLeaderboard),
 * no al cargar la app — así un usuario que nunca abre Retos no paga el
 * costo de la conexión websocket. Si el token cambia (logout/login), el
 * caller debe llamar disconnectEcho() antes de volver a pedir getEcho().
 */
let instance: ReturnType<typeof createEcho> | null = null

export function getEcho() {
  if (!instance) {
    const token = useAuthStore.getState().token
    if (!token) {
      throw new Error("getEcho() requiere una sesión autenticada.")
    }

    instance = createEcho({
      key: import.meta.env.VITE_REVERB_APP_KEY ?? "",
      host: import.meta.env.VITE_REVERB_HOST ?? "localhost",
      port: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      scheme: (import.meta.env.VITE_REVERB_SCHEME ?? "http") as "http" | "https",
      apiBaseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
      token,
      pusherClient: Pusher,
    })
  }

  return instance
}

export function disconnectEcho() {
  instance?.disconnect()
  instance = null
}
