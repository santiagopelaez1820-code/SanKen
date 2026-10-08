// Esta línea sirve para importar «beforeEach, describe, expect, it» desde «vitest».
import { beforeEach, describe, expect, it } from "vitest"
// Esta línea sirve para importar «render, screen, within» desde «@testing-library/react».
import { render, screen, within } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «MemoryRouter» desde «react-router-dom».
import { MemoryRouter } from "react-router-dom"
// Esta línea sirve para importar «LEGAL_DOCUMENTS» desde «@sanken/core».
import { LEGAL_DOCUMENTS } from "@sanken/core"
// Esta línea sirve para importar «useCookieConsentStore» desde «@/lib/cookie-consent-store».
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
// Esta línea sirve para importar «useLegalLocaleStore» desde «@/lib/legal-locale-store».
import { useLegalLocaleStore } from "@/lib/legal-locale-store"
// Esta línea sirve para importar «LegalDocumentPage» desde «./LegalDocumentPage».
import { LegalDocumentPage } from "./LegalDocumentPage"

// Esta línea sirve para declarar la función «renderDoc».
function renderDoc(documentId: "terms" | "privacy" | "cookies") {
  // Esta línea sirve para devolver «render(».
  return render(
    // Esta línea sirve para abrir el componente «MemoryRouter».
    <MemoryRouter>
      {/* Esta línea sirve para abrir el componente «LegalDocumentPage». */}
      <LegalDocumentPage documentId={documentId} />
    </MemoryRouter>
  )
}

// Esta línea sirve para agrupar las pruebas de «LegalDocumentPage».
describe("LegalDocumentPage", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useLegalLocaleStore.setState({ locale: "es" })
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  // Esta línea sirve para generar una prueba por cada documento legal.
  it.each([
    // Esta línea sirve para incluir el caso de términos y su título.
    ["terms", "Términos y Condiciones"],
    // Esta línea sirve para incluir el caso de privacidad y su título.
    ["privacy", "Política de Privacidad"],
    // Esta línea sirve para incluir el caso de cookies y su título.
    ["cookies", "Política de Cookies"],
  // Esta línea sirve para declarar la prueba que verifica que cada documento se muestra en español con versión, estado y secciones.
  ] as const)("renders %s in Spanish with its version, review status and structured sections", (id, title) => {
    // Esta línea sirve para llamar a «renderDoc» con «id».
    renderDoc(id)
    // Esta línea sirve para extraer «et» de «LEGAL_DOCUMENTS[id]».
    const meta = LEGAL_DOCUMENTS[id]

    // Esta línea sirve para verificar que aparece el título como encabezado principal.
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument()
    // Esta línea sirve para verificar que se muestra la versión y la fecha de actualización.
    expect(screen.getByText(new RegExp(`Versión ${meta.version.replace(".", "\\.")} · Actualizado el`))).toBeInTheDocument()
    // El aviso de borrador aparece solo mientras la versión no fue aprobada.
    // Esta línea sirve para revisar si «meta.status === "approved"».
    if (meta.status === "approved") {
      // Esta línea sirve para verificar que no aparece el aviso de borrador.
      expect(screen.queryByText(/Borrador pendiente de revisión legal/)).not.toBeInTheDocument()
    // Esta línea sirve para ejecutar este bloque en el caso contrario.
    } else {
      // Esta línea sirve para verificar que aparece el aviso de borrador.
      expect(screen.getByText(/Borrador pendiente de revisión legal/)).toBeInTheDocument()
    }
    // Esta línea sirve para verificar que «screen.getAllByRole("heading", { level: 2 }» cumple «length».
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3)
    // Esta línea sirve para verificar que «screen.getByRole("article")» cumple «toHaveAttribute».
    expect(screen.getByRole("article")).toHaveAttribute("lang", "es")
  })

  // Esta línea sirve para declarar la prueba que verifica que «switches to English without review notices».
  it("switches to English without review notices", async () => {
    // Esta línea sirve para llamar a «renderDoc» con «"privacy"».
    renderDoc("privacy")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "English" }))

    // Esta línea sirve para verificar que el título aparece en inglés.
    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument()
    // Esta línea sirve para verificar que no aparece el aviso de traducción sin revisar.
    expect(screen.queryByText(/has not been legally reviewed/)).not.toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByText(/Draft pending legal review/)» no cumple «toBeInTheDocument».
    expect(screen.queryByText(/Draft pending legal review/)).not.toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByRole("article")» cumple «toHaveAttribute».
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en")
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows the real controller data and no pending markers».
  it("shows the real controller data and no pending markers", () => {
    // Esta línea sirve para llamar a «renderDoc» con «"privacy"».
    renderDoc("privacy")
    // Esta línea sirve para verificar que «document.querySelectorAll("mark")» cumple «toHaveLength».
    expect(document.querySelectorAll("mark")).toHaveLength(0)
    // Esta línea sirve para verificar que «screen.queryByText(/\[Pendiente/)» no cumple «toBeInTheDocument».
    expect(screen.queryByText(/\[Pendiente/)).not.toBeInTheDocument()
    // Esta línea sirve para verificar que no aparece el aviso de datos pendientes.
    expect(screen.queryByText(/deben ser completados por el responsable/)).not.toBeInTheDocument()
    // Cada dato del responsable es un <span> aparte: se compara el texto completo.
    // Esta línea sirve para extraer «ex» de «document.body.textContent ?? ""».
    const text = document.body.textContent ?? ""
    // Esta línea sirve para verificar que «text» cumple «toContain».
    expect(text).toContain(
      // Esta línea sirve para incluir el texto o las clases «es Kenneth Martinez, identificado con cédula …».
      "es Kenneth Martinez, identificado con cédula de ciudadanía n.º 1045764307, con domicilio en Marinilla, Antioquia (Colombia)."
    )
    // Esta línea sirve para verificar que «text» cumple «toContain».
    expect(text).toContain("kendejesus205@gmail.com")
    // Esta línea sirve para verificar que «text» cumple «toContain».
    expect(text).toContain("Superintendencia de Industria y Comercio (SIC)")
  })

  // Esta línea sirve para declarar la prueba que verifica que «table of contents links point to each section».
  it("table of contents links point to each section", () => {
    // Esta línea sirve para llamar a «renderDoc» con «"terms"».
    renderDoc("terms")
    // Esta línea sirve para crear «toc» llamando a «screen.getByRole».
    const toc = screen.getByRole("navigation", { name: "Contenido" })
    // Esta línea sirve para crear «links» llamando a «within».
    const links = within(toc).getAllByRole("link")
    // Esta línea sirve para recorrer los elementos con «const link of links».
    for (const link of links) {
      // Esta línea sirve para crear «id» llamando a «link.getAttribute».
      const id = link.getAttribute("href")!.slice(1)
      // Esta línea sirve para verificar que «document.getElementById(id)» no cumple «toBeNull».
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  // Esta línea sirve para declarar la prueba que verifica que «the cookie policy lets the user reopen the cookie settings».
  it("the cookie policy lets the user reopen the cookie settings", async () => {
    // Esta línea sirve para llamar a «renderDoc» con «"cookies"».
    renderDoc("cookies")
    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getAllByRole("button", { name: "Configuración de cookies" })[0])
    // Esta línea sirve para verificar que «useCookieConsentStore.getState(» cumple «settingsOpen».
    expect(useCookieConsentStore.getState().settingsOpen).toBe(true)
  })

  // Esta línea sirve para declarar la prueba que verifica que «footer links reach the three documents».
  it("footer links reach the three documents", () => {
    // Esta línea sirve para llamar a «renderDoc» con «"terms"».
    renderDoc("terms")
    // Esta línea sirve para crear «footer» llamando a «screen.getByRole».
    const footer = screen.getByRole("navigation", { name: "Privacidad y documentos legales" })
    // Esta línea sirve para verificar que «within(footer» cumple «getByRole».
    expect(within(footer).getByRole("link", { name: "Política de Privacidad" })).toHaveAttribute("href", "/legal/privacidad")
    // Esta línea sirve para verificar que «within(footer» cumple «getByRole».
    expect(within(footer).getByRole("link", { name: "Política de Cookies" })).toHaveAttribute("href", "/legal/cookies")
    // Esta línea sirve para verificar que «within(footer» cumple «getByRole».
    expect(within(footer).getByRole("link", { name: "Términos y Condiciones" })).toHaveAttribute("href", "/legal/terminos")
  })
})
