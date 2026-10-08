// Service worker mínimo para web push (Sprint 11) — sin cache/offline, solo
// recibir pushes y mostrarlos. No usa vite-plugin-pwa: un solo archivo de
// mano alcanza para lo que se necesita acá.

// Esta línea sirve para escuchar los mensajes push que llegan al service worker.
self.addEventListener("push", (event) => {
  // Esta línea sirve para salir de la función si «!event.data».
  if (!event.data) return

  // Esta línea sirve para extraer «ayloa» de «event.data.json()».
  const payload = event.data.json()

  // Esta línea sirve para mantener vivo el service worker hasta mostrar la notificación.
  event.waitUntil(
    // Esta línea sirve para mostrar la notificación con el título recibido o «SanKen».
    self.registration.showNotification(payload.title ?? "SanKen", {
      // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «payload.body ?? ""».
      body: payload.body ?? "",
      // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «"/favicon.svg"».
      icon: "/favicon.svg",
      // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «payload.data ?? {}».
      data: payload.data ?? {},
    })
  )
})

// Esta línea sirve para escuchar el clic sobre una notificación.
self.addEventListener("notificationclick", (event) => {
  // Esta línea sirve para llamar a «event.notification.close».
  event.notification.close()

  // Notificaciones nuevas (soporte, check-in semanal) traen `link` propio;
  // las de chat siguen usando conversation_id.
  // Esta línea sirve para extraer «at» de «event.notification.data ?? {}».
  const data = event.notification.data ?? {}
  // Esta línea sirve para extraer «r» de «data.link ? data.link : data.conversatio».
  const url = data.link ? data.link : data.conversation_id ? `/chat/${data.conversation_id}` : "/dashboard"

  // Esta línea sirve para mantener vivo el service worker hasta terminar de abrir la ventana.
  event.waitUntil(
    // Esta línea sirve para buscar las ventanas abiertas de la app.
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Esta línea sirve para extraer «xistin» de «clients.find((client) => "focus" in clie».
      const existing = clients.find((client) => "focus" in client)
      // Esta línea sirve para revisar si «existing».
      if (existing) {
        // Esta línea sirve para llamar a «existing.navigate» con «url».
        existing.navigate(url)
        // Esta línea sirve para devolver «existing.focus()».
        return existing.focus()
      }
      // Esta línea sirve para devolver «self.clients.openWindow(url)».
      return self.clients.openWindow(url)
    })
  )
})
