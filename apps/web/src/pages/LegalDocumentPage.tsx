// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from "react"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «ArrowLeft, Cookie, TriangleAlert» desde «lucide-react».
import { ArrowLeft, Cookie, TriangleAlert } from "lucide-react"
// Esta línea sirve para importar las utilidades y tipos de documentos legales.
import { formatLegalDate, getLegalDocument, missingOwnerFields, type LegalBlock, type LegalDocumentId, type LegalLocale } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalLocaleStore, useLegalStrings» desde «@/lib/legal-locale-store».
import { useLegalLocaleStore, useLegalStrings } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «LegalLinks» desde «@/components/legal/LegalLinks».
import { LegalLinks } from "@/components/legal/LegalLinks"
// Esta línea sirve para importar «LegalText» desde «@/components/legal/LegalText».
import { LegalText } from "@/components/legal/LegalText"

// Esta línea sirve para declarar la función «Block».
function Block({ block, locale, caption }: { block: LegalBlock; locale: LegalLocale; caption: string }) {
  // Esta línea sirve para elegir qué hacer según «block.type».
  switch (block.type) {
    // Esta línea sirve para tratar el caso «"p"».
    case "p":
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el elemento «p» con las clases «leading-relaxed text-foreground/90».
        <p className="leading-relaxed text-foreground/90">
          {/* Esta línea sirve para abrir el componente «LegalText». */}
          <LegalText text={block.text} locale={locale} />
        </p>
      )
    // Esta línea sirve para tratar el caso «"note"».
    case "note":
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el elemento «p» con las clases «rounded-xl border border-primary/30 bg-p».
        <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 leading-relaxed text-foreground">
          {/* Esta línea sirve para abrir el componente «LegalText». */}
          <LegalText text={block.text} locale={locale} />
        </p>
      )
    // Esta línea sirve para tratar el caso «"list"».
    case "list":
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el elemento «ul» con las clases «flex list-disc flex-col gap-2 pl-5 leadi».
        <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/90">
          {/* Esta línea sirve para recorrer «block.items» y mostrar un bloque por elemento. */}
          {block.items.map((item, i) => (
            // Esta línea sirve para abrir el elemento «li».
            <li key={i}>
              {/* Esta línea sirve para abrir el componente «LegalText». */}
              <LegalText text={item} locale={locale} />
            </li>
          ))}
        </ul>
      )
    // Esta línea sirve para tratar el caso «"table"».
    case "table":
      // En teléfonos cada fila se muestra como tarjeta "encabezado: valor"
      // (una tabla de 3+ columnas con texto largo no entra); desde `sm` se
      // usa la tabla, en un contenedor enfocable con scroll horizontal por si
      // igual no alcanzara el ancho.
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
        {/* Esta línea sirve para abrir el elemento «ul» con las clases «m-0 flex list-none flex-col gap-3 p-0 sm». */}
        <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden" aria-label={caption}>
          {/* Esta línea sirve para recorrer «block.rows» y mostrar un bloque por elemento. */}
          {block.rows.map((row, i) => (
            // Esta línea sirve para abrir el elemento «li».
            <li key={i} className="rounded-xl border border-border bg-card p-4">
              {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 font-semibold text-foreground». */}
              <p className="m-0 font-semibold text-foreground">
                {/* Esta línea sirve para abrir el componente «LegalText». */}
                <LegalText text={row[0]} locale={locale} />
              </p>
              {/* Esta línea sirve para abrir el elemento «dl» con las clases «m-0 mt-2 flex flex-col gap-2». */}
              <dl className="m-0 mt-2 flex flex-col gap-2">
                {/* Esta línea sirve para recorrer «row.slice(1)» y mostrar un bloque por elemento. */}
                {row.slice(1).map((cell, j) => (
                  // Esta línea sirve para abrir el elemento «div».
                  <div key={j}>
                    {/* Esta línea sirve para mostrar el valor «block.headers[j + 1]» dentro de un «dt». */}
                    <dt className="text-xs font-medium text-muted-foreground">{block.headers[j + 1]}</dt>
                    {/* Esta línea sirve para abrir el elemento «dd» con las clases «m-0 text-sm text-foreground/90». */}
                    <dd className="m-0 text-sm text-foreground/90">
                      {/* Esta línea sirve para abrir el componente «LegalText». */}
                      <LegalText text={cell} locale={locale} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div role="region" aria-label={caption} tabIndex={0} className="hidden overflow-x-auto rounded-xl border border-border focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:block">
          {/* Esta línea sirve para abrir el elemento «table» con las clases «w-full min-w-[36rem] border-collapse tex». */}
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            {/* Esta línea sirve para mostrar el valor «caption» dentro de un «caption». */}
            <caption className="sr-only">{caption}</caption>
            {/* Esta línea sirve para abrir el elemento «thead» con las clases «bg-muted/60». */}
            <thead className="bg-muted/60">
              {/* Esta línea sirve para abrir el elemento «tr». */}
              <tr>
                {/* Esta línea sirve para recorrer «block.headers» y mostrar un bloque por elemento. */}
                {block.headers.map((header) => (
                  // Esta línea sirve para abrir el elemento «th».
                  <th key={header} scope="col" className="px-3 py-2 font-semibold text-foreground">
                    {/* Esta línea sirve para mostrar el valor «header». */}
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Esta línea sirve para abrir el elemento «tbody». */}
            <tbody>
              {/* Esta línea sirve para recorrer «block.rows» y mostrar un bloque por elemento. */}
              {block.rows.map((row, i) => (
                // Esta línea sirve para abrir el elemento «tr».
                <tr key={i} className="border-t border-border align-top">
                  {/* Esta línea sirve para recorrer las celdas de la fila. */}
                  {row.map((cell, j) =>
                    // Esta línea sirve para revisar si es la primera celda de la fila.
                    j === 0 ? (
                      // Esta línea sirve para abrir el elemento «th».
                      <th key={j} scope="row" className="px-3 py-2 font-medium text-foreground">
                        {/* Esta línea sirve para abrir el componente «LegalText». */}
                        <LegalText text={cell} locale={locale} />
                      </th>
                    // Esta línea sirve para mostrar el bloque alternativo.
                    ) : (
                      // Esta línea sirve para abrir el elemento «td».
                      <td key={j} className="px-3 py-2 text-foreground/85">
                        {/* Esta línea sirve para abrir el componente «LegalText». */}
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
// Esta línea sirve para declarar la función «LegalDocumentPage».
export function LegalDocumentPage({ documentId }: { documentId: LegalDocumentId }) {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «t, locale» con el hook «useLegalStrings».
  const { t, locale } = useLegalStrings()
  // Esta línea sirve para obtener «setLocale» con el hook «useLegalLocaleStore».
  const setLocale = useLegalLocaleStore((s) => s.setLocale)
  // Esta línea sirve para obtener «openCookieSettings» con el hook «useCookieConsentStore».
  const openCookieSettings = useCookieConsentStore((s) => s.openSettings)
  // Esta línea sirve para obtener «isLoggedIn» con el hook «useAuthStore».
  const isLoggedIn = useAuthStore((s) => !!s.token)
  // Esta línea sirve para extraer «o» de «getLegalDocument(documentId, locale)».
  const doc = getLegalDocument(documentId, locale)

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para extraer «reviou» de «document.title».
    const previous = document.title
    // Esta línea sirve para asignar «`${t.documentNames[documentId]} · SanKen`» a «document.title».
    document.title = `${t.documentNames[documentId]} · SanKen`
    // Esta línea sirve para devolver «() => {».
    return () => {
      // Esta línea sirve para asignar «previous» a «document.title».
      document.title = previous
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «documentId, t».
  }, [documentId, t])

  // Esta línea sirve para extraer «oBac» de «() => {».
  const goBack = () => {
    // Esta línea sirve para volver atrás si hay historial.
    if (window.history.length > 1) navigate(-1)
    // Esta línea sirve para navegar al dashboard o al login según la sesión cuando no hay historial.
    else navigate(isLoggedIn ? "/dashboard" : "/login")
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «min-h-svh bg-background text-foreground».
    <div className="min-h-svh bg-background text-foreground">
      {/* Esta línea sirve para abrir el elemento «header» con las clases «border-b border-border». */}
      <header className="border-b border-border">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl items-center just». */}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Esta línea sirve para abrir el componente «Button». */}
          <Button variant="ghost" size="sm" onClick={goBack}>
            {/* Esta línea sirve para abrir el componente «ArrowLeft». */}
            <ArrowLeft aria-hidden="true" />
            {/* Esta línea sirve para mostrar el valor «t.backToApp». */}
            {t.backToApp}
          </Button>
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to={isLoggedIn ? "/dashboard" : "/login"} aria-label="SanKen">
            {/* Esta línea sirve para abrir el elemento «img». */}
            <img src="/logo-full.png" alt="SanKen" className="h-7 w-auto" />
          </Link>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div role="group" aria-label={t.languageLabel} className="flex rounded-lg border border-border p-0.5">
            {/* Esta línea sirve para recorrer «(["es", "en"] as const)» y mostrar un bloque por elemento. */}
            {(["es", "en"] as const).map((code) => (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para identificar el elemento de la lista con «code}».
                key={code}
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para pasar la propiedad «lang» con el valor «code}».
                lang={code}
                // Esta línea sirve para pasar la propiedad «aria-pressed» con el valor «locale === code}».
                aria-pressed={locale === code}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setLocale(code)}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «».
                className={
                  // Esta línea sirve para incluir el texto o las clases «rounded-md border-0 px-2 py-1 text-xs font-se…».
                  "rounded-md border-0 px-2 py-1 text-xs font-semibold uppercase transition-colors " +
                  // Esta línea sirve para elegir el color del botón de idioma según esté activo.
                  (locale === code ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground")
                }
              >
                {/* Esta línea sirve para mostrar el valor «code» dentro de un «span». */}
                <span aria-hidden="true">{code}</span>
                {/* Esta línea sirve para mostrar el valor «t.languageNames[code]» dentro de un «span». */}
                <span className="sr-only">{t.languageNames[code]}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Esta línea sirve para abrir el elemento «main» con las clases «mx-auto max-w-3xl px-4 py-8 sm:px-6». */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Esta línea sirve para abrir el elemento «article». */}
        <article lang={locale} aria-labelledby="legal-title" className="flex flex-col gap-6">
          {/* Esta línea sirve para abrir el elemento «header» con las clases «flex flex-col gap-2». */}
          <header className="flex flex-col gap-2">
            {/* Esta línea sirve para mostrar el texto «SanKen» dentro de un «p». */}
            <p className="m-0 text-xs font-semibold tracking-widest text-primary uppercase">SanKen</p>
            {/* Esta línea sirve para abrir el elemento «h1». */}
            <h1 id="legal-title" className="fs-2 m-0 font-heading font-bold tracking-tight">
              {/* Esta línea sirve para mostrar el valor «doc.content.title». */}
              {doc.content.title}
            </h1>
            {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
            <p className="m-0 text-sm text-muted-foreground">{t.versionLine(doc.version, formatLegalDate(doc.updatedAt, locale))}</p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 text-base text-foreground/90». */}
            <p className="m-0 text-base text-foreground/90">
              {/* Esta línea sirve para abrir el componente «LegalText». */}
              <LegalText text={doc.content.summary} locale={locale} />
            </p>
          </header>

          {/* Esta línea sirve para mostrar el contenido dinámico «{(doc.status === "draft" || !doc.translationReviewed) && (». */}
          {(doc.status === "draft" || !doc.translationReviewed) && (
            // Esta línea sirve para abrir el elemento «div».
            <div role="note" className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground">
              {/* Esta línea sirve para abrir el componente «TriangleAlert». */}
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-1». */}
              <div className="flex flex-col gap-1">
                {/* Esta línea sirve para mostrar el elemento solo si «doc.status === "draft"». */}
                {doc.status === "draft" && <p className="m-0">{t.draftNotice}</p>}
                {/* Esta línea sirve para mostrar el elemento solo si «!doc.translationReviewed». */}
                {!doc.translationReviewed && <p className="m-0">{t.translationNotice}</p>}
                {/* Esta línea sirve para mostrar el elemento solo si «missingOwnerFields().length > 0». */}
                {missingOwnerFields().length > 0 && <p className="m-0">{t.pendingFieldsNotice}</p>}
              </div>
            </div>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «documentId === "cookies"». */}
          {documentId === "cookies" && (
            // Esta línea sirve para abrir el elemento «div».
            <div>
              {/* Esta línea sirve para abrir el componente «Button». */}
              <Button variant="outline" onClick={openCookieSettings}>
                {/* Esta línea sirve para abrir el componente «Cookie». */}
                <Cookie aria-hidden="true" />
                {/* Esta línea sirve para mostrar el valor «t.cookieSettingsTitle». */}
                {t.cookieSettingsTitle}
              </Button>
            </div>
          )}

          {/* Esta línea sirve para abrir el elemento «nav». */}
          <nav aria-labelledby="legal-toc-title" className="rounded-xl border border-border bg-card p-4">
            {/* Esta línea sirve para abrir el elemento «h2». */}
            <h2 id="legal-toc-title" className="fs-6 m-0 mb-2 font-semibold text-foreground">
              {/* Esta línea sirve para mostrar el valor «t.tableOfContents». */}
              {t.tableOfContents}
            </h2>
            {/* Esta línea sirve para abrir el elemento «ol» con las clases «m-0 flex list-none flex-col gap-1 p-0 te». */}
            <ol className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
              {/* Esta línea sirve para recorrer «doc.content.sections» y mostrar un bloque por elemento. */}
              {doc.content.sections.map((section) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={section.id}>
                  {/* Esta línea sirve para abrir el elemento «a». */}
                  <a href={`#${section.id}`} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    {/* Esta línea sirve para mostrar el valor «section.title». */}
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Esta línea sirve para recorrer «doc.content.sections» y mostrar un bloque por elemento. */}
          {doc.content.sections.map((section) => (
            // Esta línea sirve para abrir el elemento «section».
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-6 flex-col gap-3">
              {/* Esta línea sirve para abrir el elemento «h2». */}
              <h2 id={`${section.id}-title`} className="fs-4 m-0 font-heading font-semibold tracking-tight">
                {/* Esta línea sirve para mostrar el valor «section.title». */}
                {section.title}
              </h2>
              {/* Esta línea sirve para recorrer «section.blocks» y mostrar un bloque por elemento. */}
              {section.blocks.map((block, i) => (
                // Esta línea sirve para abrir el componente «Block».
                <Block key={i} block={block} locale={locale} caption={section.title} />
              ))}
            </section>
          ))}
        </article>
      </main>

      {/* Esta línea sirve para abrir el elemento «footer» con las clases «border-t border-border px-4 py-6». */}
      <footer className="border-t border-border px-4 py-6">
        {/* Esta línea sirve para abrir el componente «LegalLinks». */}
        <LegalLinks />
      </footer>
    </div>
  )
}
