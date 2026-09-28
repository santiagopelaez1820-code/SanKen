import { describe, expect, it } from "vitest"
import {
  buildConsentFields,
  COOKIE_CONSENT_MAX_AGE_DAYS,
  createCookieConsent,
  getLegalDocument,
  LEGAL_DOCUMENT_IDS,
  LEGAL_DOCUMENTS,
  LEGAL_OWNER_INFO,
  LEGAL_STRINGS,
  missingOwnerFields,
  parseCookieConsent,
  REQUIRED_CONSENTS,
  resolveLegalText,
} from "@sanken/core"

describe("parseCookieConsent", () => {
  const now = new Date("2026-10-01T00:00:00Z")

  it("accepts a valid consent for the current policy version", () => {
    const consent = createCookieConsent(true, now)
    expect(parseCookieConsent(JSON.stringify(consent), now)?.categories).toEqual({ necessary: true, preferences: true })
  })

  it("treats a consent for an older policy version as undecided", () => {
    const consent = { ...createCookieConsent(true, now), version: "0.9" }
    expect(parseCookieConsent(JSON.stringify(consent), now)).toBeNull()
  })

  it("expires after the maximum age", () => {
    const decided = new Date(now.getTime() - (COOKIE_CONSENT_MAX_AGE_DAYS + 1) * 86_400_000)
    expect(parseCookieConsent(JSON.stringify(createCookieConsent(false, decided)), now)).toBeNull()
  })

  it("ignores missing or corrupted values", () => {
    expect(parseCookieConsent(null, now)).toBeNull()
    expect(parseCookieConsent("{not json", now)).toBeNull()
    expect(parseCookieConsent(JSON.stringify({ version: LEGAL_DOCUMENTS.cookies.version }), now)).toBeNull()
  })

  it("never lets necessary cookies be stored as disabled", () => {
    const tampered = { ...createCookieConsent(false, now), categories: { necessary: false, preferences: false } }
    expect(parseCookieConsent(JSON.stringify(tampered), now)?.categories.necessary).toBe(true)
  })
})

describe("resolveLegalText", () => {
  it("replaces owner fields, per language when the value is translated", () => {
    expect(resolveLegalText("{{brandName}} — {{legalName}}", "es").map((s) => s.text).join("")).toBe("SanKen — Kenneth Martinez")
    expect(resolveLegalText("{{taxId}}", "es")[0].text).toBe("cédula de ciudadanía n.º 1045764307")
    expect(resolveLegalText("{{taxId}}", "en")[0].text).toBe("Colombian citizenship ID no. 1045764307")
  })

  it("flags a missing field as pending instead of inventing it", () => {
    const info = { ...LEGAL_OWNER_INFO, legalName: null }
    const [segment] = resolveLegalText("{{legalName}}", "es", info)
    expect(segment).toEqual({ text: expect.stringMatching(/^\[Pendiente: /), pending: true })
    expect(missingOwnerFields(info)).toEqual(["legalName"])
  })

  it("has every owner field completed", () => {
    expect(missingOwnerFields()).toEqual([])
  })

  it.each(LEGAL_DOCUMENT_IDS.flatMap((id) => (["es", "en"] as const).map((locale) => [id, locale] as const)))(
    "%s (%s) has no pending markers left",
    (id, locale) => {
      const texts = getLegalDocument(id, locale).content.sections.flatMap((section) =>
        section.blocks.flatMap((block) =>
          block.type === "list" ? block.items : block.type === "table" ? block.rows.flat() : [block.text]
        )
      )
      for (const text of [getLegalDocument(id, locale).content.summary, ...texts]) {
        expect(resolveLegalText(text, locale).some((segment) => segment.pending), text).toBe(false)
      }
    }
  )
})

describe("legal documents", () => {
  it.each(LEGAL_DOCUMENT_IDS)("%s has the same structure in Spanish and English", (id) => {
    const es = getLegalDocument(id, "es")
    const en = getLegalDocument(id, "en")

    expect(es.version).toBe(en.version)
    expect(en.content.sections.map((s) => s.id)).toEqual(es.content.sections.map((s) => s.id))
    es.content.sections.forEach((section, i) => {
      expect(en.content.sections[i].blocks.map((b) => b.type)).toEqual(section.blocks.map((b) => b.type))
    })
  })

  it("keeps the English translation flagged as not legally reviewed; documents are approved by the owner", () => {
    for (const id of LEGAL_DOCUMENT_IDS) {
      expect(getLegalDocument(id, "es").translationReviewed).toBe(true)
      expect(getLegalDocument(id, "en").translationReviewed).toBe(false)
      expect(getLegalDocument(id, "es").status).toBe("approved")
    }
  })

  it("does not declare analytics or marketing cookies", () => {
    const text = JSON.stringify(getLegalDocument("cookies", "es").content.sections.find((s) => s.id === "inventario"))
    expect(text).not.toMatch(/Analítica|Marketing/)
  })
})

describe("buildConsentFields", () => {
  it("sends one explicit field per consent plus the displayed versions", () => {
    const fields = buildConsentFields({ terms: true, privacy: true })
    expect(fields).toMatchObject({ accept_terms: true, accept_privacy: true, accept_health_data: false })
    expect(fields.legal_versions).toEqual({
      terms: LEGAL_DOCUMENTS.terms.version,
      privacy: LEGAL_DOCUMENTS.privacy.version,
      health_data: LEGAL_DOCUMENTS.privacy.version,
    })
  })

  it("has a label and an error message for every required consent in both languages", () => {
    for (const locale of ["es", "en"] as const) {
      for (const type of REQUIRED_CONSENTS) {
        expect(LEGAL_STRINGS[locale].consentLabels[type].link).not.toBe("")
        expect(LEGAL_STRINGS[locale].consentRequiredErrors[type]).not.toBe("")
      }
    }
  })
})
