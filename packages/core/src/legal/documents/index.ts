// Esta línea sirve para importar los tipos de documentos legales.
import type { LegalDocument, LegalDocumentContent, LegalDocumentId, LegalLocale } from '../types';
// Esta línea sirve para importar la constante con los documentos legales.
import { LEGAL_DOCUMENTS } from '../versions';
// Esta línea sirve para importar el texto de la política de cookies en inglés.
import { cookiesEn } from './cookies.en';
// Esta línea sirve para importar el texto de la política de cookies en español.
import { cookiesEs } from './cookies.es';
// Esta línea sirve para importar el texto de la política de privacidad en inglés.
import { privacyEn } from './privacy.en';
// Esta línea sirve para importar el texto de la política de privacidad en español.
import { privacyEs } from './privacy.es';
// Esta línea sirve para importar los términos y condiciones en inglés.
import { termsEn } from './terms.en';
// Esta línea sirve para importar los términos y condiciones en español.
import { termsEs } from './terms.es';

// Esta línea sirve para declarar el contenido de cada documento por idioma.
const CONTENT: Record<LegalDocumentId, Record<LegalLocale, LegalDocumentContent>> = {
  // Esta línea sirve para incluir los términos y condiciones en español e inglés.
  terms: { es: termsEs, en: termsEn },
  // Esta línea sirve para incluir la política de privacidad en español e inglés.
  privacy: { es: privacyEs, en: privacyEn },
  // Esta línea sirve para incluir la política de cookies en español e inglés.
  cookies: { es: cookiesEs, en: cookiesEn },
};

/**
 * El español es el texto de referencia. La traducción al inglés fue revisada
 * por el responsable; si se agrega un idioma nuevo, arranca en false hasta
 * que alguien lo revise (se muestra un aviso en la página del documento).
 */
// Esta línea sirve para declarar si cada traducción fue revisada por el responsable.
const TRANSLATION_REVIEWED: Record<LegalLocale, boolean> = { es: true, en: true };

// Esta línea sirve para declarar la función que devuelve un documento legal completo en un idioma.
export function getLegalDocument(id: LegalDocumentId, locale: LegalLocale): LegalDocument {
  // Esta línea sirve para devolver el documento.
  return {
    // Esta línea sirve para copiar los datos del documento (versión y estado).
    ...LEGAL_DOCUMENTS[id],
    // Esta línea sirve para incluir el idioma.
    locale,
    // Esta línea sirve para incluir el texto del documento en ese idioma.
    content: CONTENT[id][locale],
    // Esta línea sirve para indicar si la traducción fue revisada.
    translationReviewed: TRANSLATION_REVIEWED[locale],
  };
}

// Esta línea sirve para declarar la lista de los ids de los documentos legales.
export const LEGAL_DOCUMENT_IDS: LegalDocumentId[] = ['terms', 'privacy', 'cookies'];
