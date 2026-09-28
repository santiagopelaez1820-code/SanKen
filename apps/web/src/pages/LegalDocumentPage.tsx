import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Cookie, TriangleAlert } from "lucide-react"
import { formatLegalDate, getLegalDocument, missingOwnerFields, type LegalBlock, type LegalDocumentId, type LegalLocale } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalLocaleStore, useLegalStrings } from "@/lib/legal-locale-store"
import { Button } from "@/components/ui/button"
import { LegalLinks } from "@/components/legal/LegalLinks"
import { LegalText } from "@/components/legal/LegalText"

function Block({ block, locale, caption }: { block: LegalBlock; locale: LegalLocale; caption: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-relaxed text-foreground/90">
          <LegalText text={block.text} locale={locale} />
        </p>
      )
    case "note":
      return (
        <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 leading-relaxed text-foreground">
          <LegalText text={block.text} locale={locale} />
        </p>
      )
    case "list":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/90">
          {block.items.map((item, i) => (
            <li key={i}>
              <LegalText text={item} locale={locale} />
            </li>
          ))}
        </ul>
      )
    case "table":
      // En teléfonos cada fila se muestra como tarjeta "encabezado: valor"
      // (una tabla de 3+ columnas con texto largo no entra); desde `sm` se
      // usa la tabla, en un contenedor enfocable con scroll horizontal por si
      // igual no alcanzara el ancho.
      return (
        <>
        <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden" aria-label={caption}>
          {block.rows.map((row, i) => (
            <li key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="m-0 font-semibold text-foreground">
                <LegalText text={row[0]} locale={locale} />
              </p>
              <dl className="m-0 mt-2 flex flex-col gap-2">
                {row.slice(1).map((cell, j) => (
                  <div key={j}>
                    <dt className="text-xs font-medium text-muted-foreground">{block.headers[j + 1]}</dt>
                    <dd className="m-0 text-sm text-foreground/90">
                      <LegalText text={cell} locale={locale} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <div role="region" aria-label={caption} tabIndex={0} className="hidden overflow-x-auto rounded-xl border border-border focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:block">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col" className="px-3 py-2 font-semibold text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border align-top">
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-3 py-2 font-medium text-foreground">
                        <LegalText text={cell} locale={locale} />
                      </th>
                    ) : (
                      <td key={j} className="px-3 py-2 text-foreground/85">
                        <LegalText text={cell} locale={locale} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )
  }
}

/**
 * Página pública (no requiere sesión) de un documento legal. El texto viene
 * de @sanken/core (mismo contenido que mobile) en el idioma elegido; el
 * español es la versión de referencia.
 */
export function LegalDocumentPage({ documentId }: { documentId: LegalDocumentId }) {
  const navigate = useNavigate()
  const { t, locale } = useLegalStrings()
  const setLocale = useLegalLocaleStore((s) => s.setLocale)
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)
  const isLoggedIn = useAuthStore((s) => !!s.token)
  const doc = getLegalDocument(documentId, locale)

  useEffect(() => {
    const previous = document.title
    document.title = `${t.documentNames[documentId]} · SanKen`
    return () => {
      document.title = previous
    }
  }, [documentId, t])

  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(isLoggedIn ? "/dashboard" : "/login")
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft aria-hidden="true" />
            {t.backToApp}
          </Button>
          <Link to={isLoggedIn ? "/dashboard" : "/login"} aria-label="SanKen">
            <img src="/logo-full.png" alt="SanKen" className="h-7 w-auto" />
          </Link>
          <div role="group" aria-label={t.languageLabel} className="flex rounded-lg border border-border p-0.5">
            {(["es", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                lang={code}
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
                className={
                  "rounded-md border-0 px-2 py-1 text-xs font-semibold uppercase transition-colors " +
                  (locale === code ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground")
                }
              >
                <span aria-hidden="true">{code}</span>
                <span className="sr-only">{t.languageNames[code]}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <article lang={locale} aria-labelledby="legal-title" className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <p className="m-0 text-xs font-semibold tracking-widest text-primary uppercase">SanKen</p>
            <h1 id="legal-title" className="fs-2 m-0 font-heading font-bold tracking-tight">
              {doc.content.title}
            </h1>
            <p className="m-0 text-sm text-muted-foreground">{t.versionLine(doc.version, formatLegalDate(doc.updatedAt, locale))}</p>
            <p className="m-0 text-base text-foreground/90">
              <LegalText text={doc.content.summary} locale={locale} />
            </p>
          </header>

          {(doc.status === "draft" || !doc.translationReviewed) && (
            <div role="note" className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                {doc.status === "draft" && <p className="m-0">{t.draftNotice}</p>}
                {!doc.translationReviewed && <p className="m-0">{t.translationNotice}</p>}
                {missingOwnerFields().length > 0 && <p className="m-0">{t.pendingFieldsNotice}</p>}
              </div>
            </div>
          )}

          {documentId === "cookies" && (
            <div>
              <Button variant="outline" onClick={openCookieSettings}>
                <Cookie aria-hidden="true" />
                {t.cookieSettingsTitle}
              </Button>
            </div>
          )}

          <nav aria-labelledby="legal-toc-title" className="rounded-xl border border-border bg-card p-4">
            <h2 id="legal-toc-title" className="fs-6 m-0 mb-2 font-semibold text-foreground">
              {t.tableOfContents}
            </h2>
            <ol className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
              {doc.content.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.content.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-6 flex-col gap-3">
              <h2 id={`${section.id}-title`} className="fs-4 m-0 font-heading font-semibold tracking-tight">
                {section.title}
              </h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} locale={locale} caption={section.title} />
              ))}
            </section>
          ))}
        </article>
      </main>

      <footer className="border-t border-border px-4 py-6">
        <LegalLinks />
      </footer>
    </div>
  )
}
