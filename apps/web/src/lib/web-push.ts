import { api } from "@/lib/api"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function isWebPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window
}

export async function getExistingWebPushSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) return null
  const registration = await navigator.serviceWorker.getRegistration("/sw.js")
  return (await registration?.pushManager.getSubscription()) ?? null
}

export async function subscribeToWebPush(vapidPublicKey: string): Promise<void> {
  if (!isWebPushSupported()) {
    throw new Error("Este navegador no soporta notificaciones push.")
  }

  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    throw new Error("Permiso de notificaciones denegado.")
  }

  const registration = await navigator.serviceWorker.register("/sw.js")
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // TS tipa Uint8Array<ArrayBufferLike> por default (no ArrayBuffer puro),
    // que no matchea BufferSource — problema de tipos, no de runtime.
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  })

  await api.post("/push/web-subscription", subscription.toJSON())
}

export async function unsubscribeFromWebPush(): Promise<void> {
  const subscription = await getExistingWebPushSubscription()
  if (!subscription) return

  await api.delete("/push/web-subscription", { endpoint: subscription.endpoint })
  await subscription.unsubscribe()
}
