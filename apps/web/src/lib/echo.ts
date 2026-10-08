// Esta línea sirve para importar «Pusher» desde «pusher-js».
import Pusher from "pusher-js"
// Esta línea sirve para importar «createEcho» desde «@sanken/core».
import { createEcho } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «resolveApiBaseUrl» desde «@/lib/api».
import { resolveApiBaseUrl } from "@/lib/api"

/**
 * Instancia perezosa: se crea recién cuando algo la pide (ChallengeLeaderboard),
 * no al cargar la app — así un usuario que nunca abre Retos no paga el
 * costo de la conexión websocket. Si el token cambia (logout/login), el
 * caller debe llamar disconnectEcho() antes de volver a pedir getEcho().
 */
// Esta línea sirve para declarar «instance» con el valor «null».
let instance: ReturnType<typeof createEcho> | null = null

// Esta línea sirve para declarar la función «getEcho».
export function getEcho() {
  // Esta línea sirve para revisar si «!instance».
  if (!instance) {
    // Esta línea sirve para extraer «oke» de «useAuthStore.getState().token».
    const token = useAuthStore.getState().token
    // Esta línea sirve para revisar si «!token».
    if (!token) {
      // Esta línea sirve para lanzar un error de tipo «Error».
      throw new Error("getEcho() requiere una sesión autenticada.")
    }

    // Esta línea sirve para asignar «createEcho({» a «instance».
    instance = createEcho({
      // Esta línea sirve para declarar la propiedad «key» con el valor o tipo «import.meta.env.VITE_REVERB_APP_KEY ?? ""».
      key: import.meta.env.VITE_REVERB_APP_KEY ?? "",
      // Esta línea sirve para leer el host de Reverb del entorno o usar localhost.
      host: import.meta.env.VITE_REVERB_HOST ?? "localhost",
      // Esta línea sirve para leer el puerto de Reverb del entorno o usar 8080.
      port: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      // Esta línea sirve para leer el esquema de Reverb del entorno o usar http.
      scheme: (import.meta.env.VITE_REVERB_SCHEME ?? "http") as "http" | "https",
      // Mismo criterio que apps/web/src/lib/api.ts: derivar del host de la
      // pagina en vez de un VITE_API_URL vacio cayendo a "localhost" fijo,
      // que rompia /broadcasting/auth (NAT hairpin) para quien entra por LAN.
      // Esta línea sirve para declarar la propiedad «apiBaseUrl» con el valor o tipo «resolveApiBaseUrl()».
      apiBaseUrl: resolveApiBaseUrl(),
      // Esta línea sirve para incluir el valor «token» en la lista.
      token,
      // Esta línea sirve para declarar la propiedad «pusherClient» con el valor o tipo «Pusher».
      pusherClient: Pusher,
    })
  }

  // Esta línea sirve para devolver «instance».
  return instance
}

// Esta línea sirve para declarar la función «disconnectEcho».
export function disconnectEcho() {
  // Esta línea sirve para desconectar la instancia de Echo si existe.
  instance?.disconnect()
  // Esta línea sirve para asignar «null» a «instance».
  instance = null
}
