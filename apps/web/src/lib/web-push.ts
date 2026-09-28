import { api } from "@/lib/api"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function isWebPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
}

/**
 * Por qué push no está disponible acá, o null si sí lo está. Los service
 * workers solo existen en contexto seguro (HTTPS o localhost): abriendo la
 * app por la IP de la LAN (http://192.168…) el switch no podía funcionar y
 * antes solo decía "no soportado", sin explicar el motivo.
 */
export function webPushUnavailableReason(): string | null {
  if (!window.isSecureContext) {
    return "Las notificaciones push solo funcionan abriendo SanKen por HTTPS (o localhost)."
  }
  if (!isWebPushSupported()) return "Este navegador no soporta notificaciones push."
  return null
}

export async function getExistingWebPushSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) return null
  const registration = await navigator.serviceWorker.getRegistration()
  return (await registration?.pushManager.getSubscription()) ?? null
}

export async function subscribeToWebPush(vapidPublicKey: string): Promise<void> {
  const unavailable = webPushUnavailableReason()
  if (unavailable) throw new Error(unavailable)
  if (!vapidPublicKey) {
    throw new Error("Las notificaciones push no están configuradas en este servidor (falta VITE_VAPID_PUBLIC_KEY).")
  }

  // Un permiso ya bloqueado no vuelve a mostrar el aviso del navegador:
  // requestPermission() devuelve "denied" al instante y parecía que el
  // switch "no hacía nada" (reporte del tester).
  if (Notification.permission === "denied") {
    throw new Error(
      "Bloqueaste las notificaciones para este sitio. Habilitalas desde el candado de la barra de direcciones y volvé a intentarlo."
    )
  }

  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    throw new Error("Necesitamos tu permiso para enviarte notificaciones. Volvé a activar el interruptor y aceptá el aviso.")
  }

  await navigator.serviceWorker.register("/sw.js")
  // register() resuelve antes de que el worker esté activo, y subscribe()
  // sobre un registro sin worker activo falla ("no active Service Worker")
  // en el primer intento — había que esperar a `ready`.
  const registration = await navigator.serviceWorker.ready

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // TS tipa Uint8Array<ArrayBufferLike> por default (no ArrayBuffer puro),
      // que no matchea BufferSource — problema de tipos, no de runtime.
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    }))

  await api.post("/push/web-subscription", subscription.toJSON())
}

export async function unsubscribeFromWebPush(): Promise<void> {
  const subscription = await getExistingWebPushSubscription()
  if (!subscription) return

  await api.delete("/push/web-subscription", { endpoint: subscription.endpoint })
  await subscription.unsubscribe()
}
