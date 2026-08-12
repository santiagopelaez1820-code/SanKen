// Service worker mínimo para web push (Sprint 11) — sin cache/offline, solo
// recibir pushes y mostrarlos. No usa vite-plugin-pwa: un solo archivo de
// mano alcanza para lo que se necesita acá.

self.addEventListener("push", (event) => {
  if (!event.data) return

  const payload = event.data.json()

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "SanKen", {
      body: payload.body ?? "",
      icon: "/favicon.svg",
      data: payload.data ?? {},
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const conversationId = event.notification.data?.conversation_id
  const url = conversationId ? `/chat/${conversationId}` : "/dashboard"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client)
      if (existing) {
        existing.navigate(url)
        return existing.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
