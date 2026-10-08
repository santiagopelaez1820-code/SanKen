// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"

// Esta línea sirve para declarar la función «urlBase64ToUint8Array».
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  // Esta línea sirve para extraer «addin» de «"=".repeat((4 - (base64String.length % 4».
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  // Esta línea sirve para extraer «ase6» de «(base64String + padding).replace(/-/g, "».
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  // Esta línea sirve para extraer «awDat» de «atob(base64)».
  const rawData = atob(base64)
  // Esta línea sirve para convertir el texto en un arreglo de bytes.
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

// Esta línea sirve para declarar la función «isWebPushSupported».
export function isWebPushSupported(): boolean {
  // Esta línea sirve para devolver si el navegador soporta service workers, push y notificaciones.
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
}

/**
 * Por qué push no está disponible acá, o null si sí lo está. Los service
 * workers solo existen en contexto seguro (HTTPS o localhost): abriendo la
 * app por la IP de la LAN (http://192.168…) el switch no podía funcionar y
 * antes solo decía "no soportado", sin explicar el motivo.
 */
// Esta línea sirve para declarar la función «webPushUnavailableReason».
export function webPushUnavailableReason(): string | null {
  // Esta línea sirve para revisar si «!window.isSecureContext».
  if (!window.isSecureContext) {
    // Esta línea sirve para devolver el aviso de que push requiere HTTPS.
    return "Las notificaciones push solo funcionan abriendo SanKen por HTTPS (o localhost)."
  }
  // Esta línea sirve para devolver el aviso de navegador sin soporte si no hay push.
  if (!isWebPushSupported()) return "Este navegador no soporta notificaciones push."
  // Esta línea sirve para devolver null.
  return null
}

// Esta línea sirve para declarar la función «getExistingWebPushSubscription».
export async function getExistingWebPushSubscription(): Promise<PushSubscription | null> {
  // Esta línea sirve para devolver null si «!isWebPushSupported()».
  if (!isWebPushSupported()) return null
  // Esta línea sirve para esperar «navigator.serviceWorker.getRegistration()» y guardar el resultado en «registration».
  const registration = await navigator.serviceWorker.getRegistration()
  // Esta línea sirve para devolver la suscripción actual o null.
  return (await registration?.pushManager.getSubscription()) ?? null
}

// Esta línea sirve para declarar la función «subscribeToWebPush».
export async function subscribeToWebPush(vapidPublicKey: string): Promise<void> {
  // Esta línea sirve para extraer «navailabl» de «webPushUnavailableReason()».
  const unavailable = webPushUnavailableReason()
  // Esta línea sirve para lanzar un error si «unavailable».
  if (unavailable) throw new Error(unavailable)
  // Esta línea sirve para revisar si «!vapidPublicKey».
  if (!vapidPublicKey) {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error("Las notificaciones push no están configuradas en este servidor (falta VITE_VAPID_PUBLIC_KEY).")
  }

  // Un permiso ya bloqueado no vuelve a mostrar el aviso del navegador:
  // requestPermission() devuelve "denied" al instante y parecía que el
  // switch "no hacía nada" (reporte del tester).
  // Esta línea sirve para revisar si «Notification.permission === "denied"».
  if (Notification.permission === "denied") {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error(
      // Esta línea sirve para incluir el texto o las clases «Bloqueaste las notificaciones para este sitio…».
      "Bloqueaste las notificaciones para este sitio. Habilitalas desde el candado de la barra de direcciones y volvé a intentarlo."
    )
  }

  // Esta línea sirve para esperar «Notification.requestPermission()» y guardar el resultado en «permission».
  const permission = await Notification.requestPermission()
  // Esta línea sirve para revisar si «permission !== "granted"».
  if (permission !== "granted") {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error("Necesitamos tu permiso para enviarte notificaciones. Volvé a activar el interruptor y aceptá el aviso.")
  }

  // Esta línea sirve para esperar el resultado de «navigator.serviceWorker.register».
  await navigator.serviceWorker.register("/sw.js")
  // register() resuelve antes de que el worker esté activo, y subscribe()
  // sobre un registro sin worker activo falla ("no active Service Worker")
  // en el primer intento — había que esperar a `ready`.
  // Esta línea sirve para esperar «navigator.serviceWorker.ready» y guardar el resultado en «registration».
  const registration = await navigator.serviceWorker.ready

  // Esta línea sirve para declarar la suscripción: la existente o una nueva.
  const subscription =
    // Esta línea sirve para usar la suscripción existente si la hay.
    (await registration.pushManager.getSubscription()) ??
    // Esta línea sirve para crear una suscripción nueva en caso contrario.
    (await registration.pushManager.subscribe({
      // Esta línea sirve para declarar la propiedad «userVisibleOnly» con el valor o tipo «true».
      userVisibleOnly: true,
      // TS tipa Uint8Array<ArrayBufferLike> por default (no ArrayBuffer puro),
      // que no matchea BufferSource — problema de tipos, no de runtime.
      // Esta línea sirve para enviar la clave pública VAPID del servidor.
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    }))

  // Esta línea sirve para esperar el resultado de «api.post».
  await api.post("/push/web-subscription", subscription.toJSON())
}

// Esta línea sirve para declarar la función «unsubscribeFromWebPush».
export async function unsubscribeFromWebPush(): Promise<void> {
  // Esta línea sirve para esperar «getExistingWebPushSubscription()» y guardar el resultado en «subscription».
  const subscription = await getExistingWebPushSubscription()
  // Esta línea sirve para salir de la función si «!subscription».
  if (!subscription) return

  // Esta línea sirve para esperar el resultado de «api.delete».
  await api.delete("/push/web-subscription", { endpoint: subscription.endpoint })
  // Esta línea sirve para esperar el resultado de «subscription.unsubscribe».
  await subscription.unsubscribe()
}
