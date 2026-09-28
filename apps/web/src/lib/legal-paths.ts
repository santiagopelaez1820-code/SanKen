import type { LegalDocumentId } from "@sanken/core"

/** Rutas públicas de los documentos legales (ver App.tsx). */
export const LEGAL_PATHS: Record<LegalDocumentId, string> = {
  terms: "/legal/terminos",
  privacy: "/legal/privacidad",
  cookies: "/legal/cookies",
}

/** Prefijo de caché de GET /legal/consents (se completa con el id del usuario). */
export const LEGAL_CONSENTS_QUERY_KEY = ["legal", "consents"] as const
