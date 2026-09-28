import type { LegalDocument, LegalDocumentContent, LegalDocumentId, LegalLocale } from '../types';
import { LEGAL_DOCUMENTS } from '../versions';
import { cookiesEn } from './cookies.en';
import { cookiesEs } from './cookies.es';
import { privacyEn } from './privacy.en';
import { privacyEs } from './privacy.es';
import { termsEn } from './terms.en';
import { termsEs } from './terms.es';

const CONTENT: Record<LegalDocumentId, Record<LegalLocale, LegalDocumentContent>> = {
  terms: { es: termsEs, en: termsEn },
  privacy: { es: privacyEs, en: privacyEn },
  cookies: { es: cookiesEs, en: cookiesEn },
};

/**
 * El español es el texto de referencia. La traducción al inglés NO tiene
 * revisión jurídica — pasar a true solo cuando un profesional la valide.
 */
const TRANSLATION_REVIEWED: Record<LegalLocale, boolean> = { es: true, en: false };

export function getLegalDocument(id: LegalDocumentId, locale: LegalLocale): LegalDocument {
  return {
    ...LEGAL_DOCUMENTS[id],
    locale,
    content: CONTENT[id][locale],
    translationReviewed: TRANSLATION_REVIEWED[locale],
  };
}

export const LEGAL_DOCUMENT_IDS: LegalDocumentId[] = ['terms', 'privacy', 'cookies'];
