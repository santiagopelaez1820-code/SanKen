// Esta línea sirve para importar «describe, expect, it» desde «vitest».
import { describe, expect, it } from "vitest"
// Esta línea sirve para abrir la importación de utilidades legales del núcleo.
import {
  // Esta línea sirve para incluir el valor «buildConsentFields» en la lista.
  buildConsentFields,
  // Esta línea sirve para incluir el valor «COOKIE_CONSENT_MAX_AGE_DAYS» en la lista.
  COOKIE_CONSENT_MAX_AGE_DAYS,
  // Esta línea sirve para incluir el valor «createCookieConsent» en la lista.
  createCookieConsent,
  // Esta línea sirve para incluir el valor «getLegalDocument» en la lista.
  getLegalDocument,
  // Esta línea sirve para incluir el valor «LEGAL_DOCUMENT_IDS» en la lista.
  LEGAL_DOCUMENT_IDS,
  // Esta línea sirve para incluir el valor «LEGAL_DOCUMENTS» en la lista.
  LEGAL_DOCUMENTS,
  // Esta línea sirve para incluir el valor «LEGAL_OWNER_INFO» en la lista.
  LEGAL_OWNER_INFO,
  // Esta línea sirve para incluir el valor «LEGAL_STRINGS» en la lista.
  LEGAL_STRINGS,
  // Esta línea sirve para incluir el valor «missingOwnerFields» en la lista.
  missingOwnerFields,
  // Esta línea sirve para incluir el valor «parseCookieConsent» en la lista.
  parseCookieConsent,
  // Esta línea sirve para incluir el valor «REQUIRED_CONSENTS» en la lista.
  REQUIRED_CONSENTS,
  // Esta línea sirve para incluir el valor «resolveLegalText» en la lista.
  resolveLegalText,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"

// Esta línea sirve para agrupar las pruebas de «parseCookieConsent».
describe("parseCookieConsent", () => {
  // Esta línea sirve para crear «now» llamando a «Date».
  const now = new Date("2026-10-01T00:00:00Z")

  // Esta línea sirve para declarar la prueba que verifica que «accepts a valid consent for the current policy version».
  it("accepts a valid consent for the current policy version", () => {
    // Esta línea sirve para crear «consent» llamando a «createCookieConsent».
    const consent = createCookieConsent(true, now)
    // Esta línea sirve para verificar que las categorías del consentimiento se leen correctamente.
    expect(parseCookieConsent(JSON.stringify(consent), now)?.categories).toEqual({ necessary: true, preferences: true })
  })

  // Esta línea sirve para declarar la prueba que verifica que «treats a consent for an older policy version as undecided».
  it("treats a consent for an older policy version as undecided", () => {
    // Esta línea sirve para extraer «onsen» de «{ ...createCookieConsent(true, now), ver».
    const consent = { ...createCookieConsent(true, now), version: "0.9" }
    // Esta línea sirve para verificar que «parseCookieConsent(JSON.stringify(consent), now)» cumple «toBeNull».
    expect(parseCookieConsent(JSON.stringify(consent), now)).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «expires after the maximum age».
  it("expires after the maximum age", () => {
    // Esta línea sirve para crear «decided» llamando a «Date».
    const decided = new Date(now.getTime() - (COOKIE_CONSENT_MAX_AGE_DAYS + 1) * 86_400_000)
    // Esta línea sirve para verificar que un consentimiento vencido se descarta.
    expect(parseCookieConsent(JSON.stringify(createCookieConsent(false, decided)), now)).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «ignores missing or corrupted values».
  it("ignores missing or corrupted values", () => {
    // Esta línea sirve para verificar que «parseCookieConsent(null, now)» cumple «toBeNull».
    expect(parseCookieConsent(null, now)).toBeNull()
    // Esta línea sirve para verificar que «parseCookieConsent("{not json", now)» cumple «toBeNull».
    expect(parseCookieConsent("{not json", now)).toBeNull()
    // Esta línea sirve para verificar que un consentimiento sin categorías se descarta.
    expect(parseCookieConsent(JSON.stringify({ version: LEGAL_DOCUMENTS.cookies.version }), now)).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «never lets necessary cookies be stored as disabled».
  it("never lets necessary cookies be stored as disabled", () => {
    // Esta línea sirve para extraer «ampere» de «{ ...createCookieConsent(false, now), ca».
    const tampered = { ...createCookieConsent(false, now), categories: { necessary: false, preferences: false } }
    // Esta línea sirve para verificar que las cookies necesarias siempre quedan activas.
    expect(parseCookieConsent(JSON.stringify(tampered), now)?.categories.necessary).toBe(true)
  })
})

// Esta línea sirve para agrupar las pruebas de «resolveLegalText».
describe("resolveLegalText", () => {
  // Esta línea sirve para declarar la prueba que verifica que «replaces owner fields, per language when the value is translated».
  it("replaces owner fields, per language when the value is translated", () => {
    // Esta línea sirve para verificar que los marcadores se reemplazan por los datos del responsable.
    expect(resolveLegalText("{{brandName}} — {{legalName}}", "es").map((s) => s.text).join("")).toBe("SanKen — Kenneth Martinez")
    // Esta línea sirve para verificar que «resolveLegalText("{{taxId}}", "es")[0].text» cumple «toBe».
    expect(resolveLegalText("{{taxId}}", "es")[0].text).toBe("cédula de ciudadanía n.º 1045764307")
    // Esta línea sirve para verificar que «resolveLegalText("{{taxId}}", "en")[0].text» cumple «toBe».
    expect(resolveLegalText("{{taxId}}", "en")[0].text).toBe("Colombian citizenship ID no. 1045764307")
  })

  // Esta línea sirve para declarar la prueba que verifica que «flags a missing field as pending instead of inventing it».
  it("flags a missing field as pending instead of inventing it", () => {
    // Esta línea sirve para extraer «nf» de «{ ...LEGAL_OWNER_INFO, legalName: null }».
    const info = { ...LEGAL_OWNER_INFO, legalName: null }
    // Esta línea sirve para extraer «segment» de «resolveLegalText("{{legalName}}", "es", ».
    const [segment] = resolveLegalText("{{legalName}}", "es", info)
    // Esta línea sirve para verificar que «segment» cumple «toEqual».
    expect(segment).toEqual({ text: expect.stringMatching(/^\[Pendiente: /), pending: true })
    // Esta línea sirve para verificar que «missingOwnerFields(info)» cumple «toEqual».
    expect(missingOwnerFields(info)).toEqual(["legalName"])
  })

  // Esta línea sirve para declarar la prueba que verifica que «has every owner field completed».
  it("has every owner field completed", () => {
    // Esta línea sirve para verificar que «missingOwnerFields()» cumple «toEqual».
    expect(missingOwnerFields()).toEqual([])
  })

  // Esta línea sirve para generar una prueba por cada documento y cada idioma.
  it.each(LEGAL_DOCUMENT_IDS.flatMap((id) => (["es", "en"] as const).map((locale) => [id, locale] as const)))(
    // Esta línea sirve para incluir el texto o las clases «%s (%s) has no pending markers left…».
    "%s (%s) has no pending markers left",
    // Esta línea sirve para recibir el documento y el idioma de cada caso.
    (id, locale) => {
      // Esta línea sirve para crear «texts» llamando a «getLegalDocument».
      const texts = getLegalDocument(id, locale).content.sections.flatMap((section) =>
        // Esta línea sirve para recorrer los bloques de cada sección.
        section.blocks.flatMap((block) =>
          // Esta línea sirve para obtener los textos según el tipo de bloque.
          block.type === "list" ? block.items : block.type === "table" ? block.rows.flat() : [block.text]
        )
      )
      // Esta línea sirve para recorrer el resumen y los textos del documento.
      for (const text of [getLegalDocument(id, locale).content.summary, ...texts]) {
        // Esta línea sirve para verificar que «resolveLegalText(text, locale» cumple «some».
        expect(resolveLegalText(text, locale).some((segment) => segment.pending), text).toBe(false)
      }
    }
  )
})

// Esta línea sirve para agrupar las pruebas de «legal documents».
describe("legal documents", () => {
  // Esta línea sirve para generar una prueba por cada documento.
  it.each(LEGAL_DOCUMENT_IDS)("%s has the same structure in Spanish and English", (id) => {
    // Esta línea sirve para crear «es» llamando a «getLegalDocument».
    const es = getLegalDocument(id, "es")
    // Esta línea sirve para crear «en» llamando a «getLegalDocument».
    const en = getLegalDocument(id, "en")

    // Esta línea sirve para verificar que «es.version» cumple «toBe».
    expect(es.version).toBe(en.version)
    // Esta línea sirve para verificar que «en.content.sections.map((s) => s.id)» cumple «toEqual».
    expect(en.content.sections.map((s) => s.id)).toEqual(es.content.sections.map((s) => s.id))
    // Esta línea sirve para recorrer las secciones del documento en español.
    es.content.sections.forEach((section, i) => {
      // Esta línea sirve para verificar que «en.content.sections[i].blocks.map((b) => b.type)» cumple «toEqual».
      expect(en.content.sections[i].blocks.map((b) => b.type)).toEqual(section.blocks.map((b) => b.type))
    })
  })

  // Esta línea sirve para declarar la prueba que verifica que «marks every document and translation as reviewed by the owner».
  it("marks every document and translation as reviewed by the owner", () => {
    // Esta línea sirve para recorrer los elementos con «const id of LEGAL_DOCUMENT_IDS».
    for (const id of LEGAL_DOCUMENT_IDS) {
      // Esta línea sirve para verificar que «getLegalDocument(id, "es"» cumple «translationReviewed».
      expect(getLegalDocument(id, "es").translationReviewed).toBe(true)
      // Esta línea sirve para verificar que «getLegalDocument(id, "en"» cumple «translationReviewed».
      expect(getLegalDocument(id, "en").translationReviewed).toBe(true)
      // Esta línea sirve para verificar que «getLegalDocument(id, "es"» cumple «status».
      expect(getLegalDocument(id, "es").status).toBe("approved")
    }
  })

  // Esta línea sirve para declarar la prueba que verifica que «does not declare analytics or marketing cookies».
  it("does not declare analytics or marketing cookies", () => {
    // Esta línea sirve para crear «text» llamando a «JSON.stringify».
    const text = JSON.stringify(getLegalDocument("cookies", "es").content.sections.find((s) => s.id === "inventario"))
    // Esta línea sirve para verificar que «text» no cumple «toMatch».
    expect(text).not.toMatch(/Analítica|Marketing/)
  })
})

// Esta línea sirve para agrupar las pruebas de «buildConsentFields».
describe("buildConsentFields", () => {
  // Esta línea sirve para declarar la prueba que verifica que «sends one explicit field per consent plus the displayed versions».
  it("sends one explicit field per consent plus the displayed versions", () => {
    // Esta línea sirve para crear «fields» llamando a «buildConsentFields».
    const fields = buildConsentFields({ terms: true, privacy: true })
    // Esta línea sirve para verificar que «fields» cumple «toMatchObject».
    expect(fields).toMatchObject({ accept_terms: true, accept_privacy: true, accept_health_data: false })
    // Esta línea sirve para verificar que «fields.legal_versions» cumple «toEqual».
    expect(fields.legal_versions).toEqual({
      // Esta línea sirve para declarar la propiedad «terms» con el valor o tipo «LEGAL_DOCUMENTS.terms.version».
      terms: LEGAL_DOCUMENTS.terms.version,
      // Esta línea sirve para declarar la propiedad «privacy» con el valor o tipo «LEGAL_DOCUMENTS.privacy.version».
      privacy: LEGAL_DOCUMENTS.privacy.version,
      // Esta línea sirve para declarar la propiedad «health_data» con el valor o tipo «LEGAL_DOCUMENTS.privacy.version».
      health_data: LEGAL_DOCUMENTS.privacy.version,
    })
  })

  // Esta línea sirve para declarar la prueba que verifica que «has a label and an error message for every required consent in both la».
  it("has a label and an error message for every required consent in both languages", () => {
    // Esta línea sirve para recorrer los elementos con «const locale of ["es", "en"] as const».
    for (const locale of ["es", "en"] as const) {
      // Esta línea sirve para recorrer los elementos con «const type of REQUIRED_CONSENTS».
      for (const type of REQUIRED_CONSENTS) {
        // Esta línea sirve para verificar que «LEGAL_STRINGS[locale].consentLabels[type].link» no cumple «toBe».
        expect(LEGAL_STRINGS[locale].consentLabels[type].link).not.toBe("")
        // Esta línea sirve para verificar que «LEGAL_STRINGS[locale].consentRequiredErrors[type]» no cumple «toBe».
        expect(LEGAL_STRINGS[locale].consentRequiredErrors[type]).not.toBe("")
      }
    }
  })
})
