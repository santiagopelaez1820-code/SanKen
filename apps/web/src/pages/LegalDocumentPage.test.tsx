import { beforeEach, describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { LEGAL_DOCUMENTS } from "@sanken/core"
import { useCookieConsentStore } from "@/lib/cookie-consent-store"
import { useLegalLocaleStore } from "@/lib/legal-locale-store"
import { LegalDocumentPage } from "./LegalDocumentPage"

function renderDoc(documentId: "terms" | "privacy" | "cookies") {
  return render(
    <MemoryRouter>
      <LegalDocumentPage documentId={documentId} />
    </MemoryRouter>
  )
}

describe("LegalDocumentPage", () => {
  beforeEach(() => {
    localStorage.clear()
    useLegalLocaleStore.setState({ locale: "es" })
    useCookieConsentStore.setState({ consent: null, settingsOpen: false })
  })

  it.each([
    ["terms", "Términos y Condiciones"],
    ["privacy", "Política de Privacidad"],
    ["cookies", "Política de Cookies"],
  ] as const)("renders %s in Spanish with its version, review status and structured sections", (id, title) => {
    renderDoc(id)
    const meta = LEGAL_DOCUMENTS[id]

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`Versión ${meta.version.replace(".", "\\.")} · Actualizado el`))).toBeInTheDocument()
    // El aviso de borrador aparece solo mientras la versión no fue aprobada.
    if (meta.status === "approved") {
      expect(screen.queryByText(/Borrador pendiente de revisión legal/)).not.toBeInTheDocument()
    } else {
      expect(screen.getByText(/Borrador pendiente de revisión legal/)).toBeInTheDocument()
    }
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3)
    expect(screen.getByRole("article")).toHaveAttribute("lang", "es")
  })

  it("switches to English without review notices", async () => {
    renderDoc("privacy")
    await userEvent.click(screen.getByRole("button", { name: "English" }))

    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument()
    expect(screen.queryByText(/has not been legally reviewed/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Draft pending legal review/)).not.toBeInTheDocument()
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en")
  })

  it("shows the real controller data and no pending markers", () => {
    renderDoc("privacy")
    expect(document.querySelectorAll("mark")).toHaveLength(0)
    expect(screen.queryByText(/\[Pendiente/)).not.toBeInTheDocument()
    expect(screen.queryByText(/deben ser completados por el responsable/)).not.toBeInTheDocument()
    // Cada dato del responsable es un <span> aparte: se compara el texto completo.
    const text = document.body.textContent ?? ""
    expect(text).toContain(
      "es Kenneth Martinez, identificado con cédula de ciudadanía n.º 1045764307, con domicilio en Marinilla, Antioquia (Colombia)."
    )
    expect(text).toContain("kendejesus205@gmail.com")
    expect(text).toContain("Superintendencia de Industria y Comercio (SIC)")
  })

  it("table of contents links point to each section", () => {
    renderDoc("terms")
    const toc = screen.getByRole("navigation", { name: "Contenido" })
    const links = within(toc).getAllByRole("link")
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1)
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  it("the cookie policy lets the user reopen the cookie settings", async () => {
    renderDoc("cookies")
    await userEvent.click(screen.getAllByRole("button", { name: "Configuración de cookies" })[0])
    expect(useCookieConsentStore.getState().settingsOpen).toBe(true)
  })

  it("footer links reach the three documents", () => {
    renderDoc("terms")
    const footer = screen.getByRole("navigation", { name: "Privacidad y documentos legales" })
    expect(within(footer).getByRole("link", { name: "Política de Privacidad" })).toHaveAttribute("href", "/legal/privacidad")
    expect(within(footer).getByRole("link", { name: "Política de Cookies" })).toHaveAttribute("href", "/legal/cookies")
    expect(within(footer).getByRole("link", { name: "Términos y Condiciones" })).toHaveAttribute("href", "/legal/terminos")
  })
})
