import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Cookie } from "lucide-react"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalStrings } from "@/lib/legal-locale-store"
import { LEGAL_PATHS } from "@/lib/legal-paths"
import { Button } from "@/components/ui/button"

/**
 * Aviso de cookies no bloqueante: una tarjeta fija abajo, sin overlay ni
 * trampa de foco — la app se puede seguir usando mientras tanto (solo las
 * cookies necesarias están activas hasta que el usuario decide). Aparece
 * mientras no haya una elección válida para la versión vigente de la
 * Política de Cookies. Los tres botones tienen el mismo peso visual:
 * rechazar no es más difícil que aceptar.
 */
export function CookieBanner() {
  const { t } = useLegalStrings()
  const consent = useCookieConsentStore((s) => s.consent)
  const settingsOpen = useCookieConsentStore((s) => s.settingsOpen)
  const acceptAll = useCookieConsentStore((s) => s.acceptAll)
  const rejectOptional = useCookieConsentStore((s) => s.rejectOptional)
  const openSettings = useCookieConsentStore((s) => s.openSettings)
  const ref = useRef<HTMLElement>(null)
  const visible = !consent && !settingsOpen

  // Reserva al final de la página el alto del aviso: así nada queda tapado
  // (p. ej. los enlaces legales del pie) — se puede hacer scroll hasta verlo.
  useLayoutEffect(() => {
    const element = ref.current
    if (!visible || !element) return
    const body = document.body
    const previous = body.style.paddingBottom
    const apply = () => {
      body.style.paddingBottom = `${element.offsetHeight + 24}px`
    }
    apply()
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null
    observer?.observe(element)
    return () => {
      observer?.disconnect()
      body.style.paddingBottom = previous
    }
  }, [visible])

  if (!visible) return null

  return (
    <section
      ref={ref}
      role="region"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="sank-cookie-banner fixed inset-x-3 z-[1040] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="cookie-banner-title" className="fs-6 m-0 font-heading font-semibold text-foreground">
            {t.cookieBannerTitle}
          </h2>
          <p id="cookie-banner-body" className="mt-1 mb-0 text-sm text-muted-foreground">
            {t.cookieBannerBody}{" "}
            <Link to={LEGAL_PATHS.cookies} className="font-medium text-primary underline-offset-4 hover:underline">
              {t.cookieBannerMoreInfo}
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={openSettings}>
              {t.cookieConfigure}
            </Button>
            <Button variant="outline" onClick={rejectOptional}>
              {t.cookieRejectOptional}
            </Button>
            <Button variant="outline" onClick={acceptAll}>
              {t.cookieAcceptAll}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
