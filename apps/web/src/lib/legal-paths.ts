// Esta línea sirve para importar los tipos «LegalDocumentId» desde «@sanken/core».
import type { LegalDocumentId } from "@sanken/core"

/** Rutas públicas de los documentos legales (ver App.tsx). */
// Esta línea sirve para declarar «LEGAL_PATHS» con el valor «{».
export const LEGAL_PATHS: Record<LegalDocumentId, string> = {
  // Esta línea sirve para declarar la propiedad «terms» con el valor o tipo «"/legal/terminos"».
  terms: "/legal/terminos",
  // Esta línea sirve para declarar la propiedad «privacy» con el valor o tipo «"/legal/privacidad"».
  privacy: "/legal/privacidad",
  // Esta línea sirve para declarar la propiedad «cookies» con el valor o tipo «"/legal/cookies"».
  cookies: "/legal/cookies",
}

/** Prefijo de caché de GET /legal/consents (se completa con el id del usuario). */
// Esta línea sirve para declarar «LEGAL_CONSENTS_QUERY_KEY» con el valor «["legal", "consents"] as const».
export const LEGAL_CONSENTS_QUERY_KEY = ["legal", "consents"] as const
