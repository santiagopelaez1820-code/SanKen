// Esta línea sirve para importar «useLayoutEffect, useRef» desde «react».
import { useLayoutEffect, useRef } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «Cookie» desde «lucide-react».
import { Cookie } from "lucide-react"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LEGAL_PATHS» desde «@/lib/legal-paths».
import { LEGAL_PATHS } from "@/lib/legal-paths"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"

/**
 * Aviso de cookies no bloqueante: una tarjeta fija abajo, sin overlay ni
 * trampa de foco — la app se puede seguir usando mientras tanto (solo las
 * cookies necesarias están activas hasta que el usuario decide). Aparece
 * mientras no haya una elección válida para la versión vigente de la
 * Política de Cookies. Los tres botones tienen el mismo peso visual:
 * rechazar no es más difícil que aceptar.
 */
// Esta línea sirve para declarar el componente del aviso de cookies.
export function CookieBanner() {
  // Esta línea sirve para obtener «t» con el hook «useLegalStrings».
  const { t } = useLegalStrings()
  // Esta línea sirve para obtener «consent» con el hook «useCookieConsentStore».
  const consent = useCookieConsentStore((s) => s.consent)
  // Esta línea sirve para obtener «settingsOpen» con el hook «useCookieConsentStore».
  const settingsOpen = useCookieConsentStore((s) => s.settingsOpen)
  // Esta línea sirve para obtener «acceptAll» con el hook «useCookieConsentStore».
  const acceptAll = useCookieConsentStore((s) => s.acceptAll)
  // Esta línea sirve para obtener «rejectOptional» con el hook «useCookieConsentStore».
  const rejectOptional = useCookieConsentStore((s) => s.rejectOptional)
  // Esta línea sirve para obtener «openSettings» con el hook «useCookieConsentStore».
  const openSettings = useCookieConsentStore((s) => s.openSettings)
  // Esta línea sirve para crear la referencia «ref».
  const ref = useRef<HTMLElement>(null)
  // Esta línea sirve para calcular si el aviso debe mostrarse.
  const visible = !consent && !settingsOpen

  // Reserva al final de la página el alto del aviso: así nada queda tapado
  // (p. ej. los enlaces legales del pie) — se puede hacer scroll hasta verlo.
  // Esta línea sirve para declarar el efecto que reserva espacio al final de la página.
  useLayoutEffect(() => {
    // Esta línea sirve para obtener el elemento del aviso.
    const element = ref.current
    // Esta línea sirve para salir si el aviso no se muestra.
    if (!visible || !element) return
    // Esta línea sirve para obtener el body del documento.
    const body = document.body
    // Esta línea sirve para guardar el relleno inferior original.
    const previous = body.style.paddingBottom
    // Esta línea sirve para declarar la función que ajusta el relleno.
    const apply = () => {
      // Esta línea sirve para agregar al body un relleno igual al alto del aviso.
      body.style.paddingBottom = `${element.offsetHeight + 24}px`
    }
    // Esta línea sirve para aplicar el relleno de inmediato.
    apply()
    // Esta línea sirve para observar cambios de tamaño del aviso si el navegador lo soporta.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null
    // Esta línea sirve para empezar a observar el aviso.
    observer?.observe(element)
    // Esta línea sirve para devolver la función de limpieza.
    return () => {
      // Esta línea sirve para dejar de observar el aviso.
      observer?.disconnect()
      // Esta línea sirve para restaurar el relleno original.
      body.style.paddingBottom = previous
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia la visibilidad.
  }, [visible])

  // Esta línea sirve para evitar mostrar el aviso si el usuario ya decidió.
  if (!visible) return null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «section» con sus atributos en varias líneas.
    <section
      // Esta línea sirve para conectar la referencia «ref}» con el elemento.
      ref={ref}
      // Esta línea sirve para definir el atributo «role» con el valor «region».
      role="region"
      // Esta línea sirve para definir el atributo «aria-labelledby» con el valor «cookie-banner-title».
      aria-labelledby="cookie-banner-title"
      // Esta línea sirve para definir el atributo «aria-describedby» con el valor «cookie-banner-body».
      aria-describedby="cookie-banner-body"
      // Esta línea sirve para aplicar las clases de estilo «sank-cookie-banner fixed inset-x-3 z-[1040] m».
      className="sank-cookie-banner fixed inset-x-3 z-[1040] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] sm:p-5"
    >
      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-start gap-3». */}
      <div className="flex items-start gap-3">
        {/* Esta línea sirve para abrir el componente «Cookie». */}
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1». */}
        <div className="min-w-0 flex-1">
          {/* Esta línea sirve para abrir el elemento «h2». */}
          <h2 id="cookie-banner-title" className="fs-6 m-0 font-heading font-semibold text-foreground">
            {/* Esta línea sirve para mostrar el valor «t.cookieBannerTitle». */}
            {t.cookieBannerTitle}
          </h2>
          {/* Esta línea sirve para abrir el elemento «p». */}
          <p id="cookie-banner-body" className="mt-1 mb-0 text-sm text-muted-foreground">
            {/* Esta línea sirve para mostrar el texto del aviso. */}
            {t.cookieBannerBody}{" "}
            {/* Esta línea sirve para abrir el componente «Link». */}
            <Link to={LEGAL_PATHS.cookies} className="font-medium text-primary underline-offset-4 hover:underline">
              {/* Esta línea sirve para mostrar el valor «t.cookieBannerMoreInfo». */}
              {t.cookieBannerMoreInfo}
            </Link>
            {/* Esta línea sirve para cerrar la frase con un punto. */}
            .
          </p>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-2 sm:flex-row sm:». */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button variant="ghost" onClick={openSettings}>
              {/* Esta línea sirve para mostrar el valor «t.cookieConfigure». */}
              {t.cookieConfigure}
            </Button>
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button variant="outline" onClick={rejectOptional}>
              {/* Esta línea sirve para mostrar el valor «t.cookieRejectOptional». */}
              {t.cookieRejectOptional}
            </Button>
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button variant="outline" onClick={acceptAll}>
              {/* Esta línea sirve para mostrar el valor «t.cookieAcceptAll». */}
              {t.cookieAcceptAll}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
