import type { Href } from 'expo-router';
import type { LegalDocumentId } from '@sanken/core';

/** Mismos slugs que la web (apps/web/src/lib/legal-paths.ts): /legal/terminos, /legal/privacidad, /legal/cookies. */
export const LEGAL_SLUGS: Record<LegalDocumentId, string> = {
  terms: 'terminos',
  privacy: 'privacidad',
  cookies: 'cookies',
};

export const LEGAL_ROUTES: Record<LegalDocumentId, Href> = {
  terms: { pathname: '/legal/[doc]', params: { doc: 'terminos' } },
  privacy: { pathname: '/legal/[doc]', params: { doc: 'privacidad' } },
  cookies: { pathname: '/legal/[doc]', params: { doc: 'cookies' } },
};

export function legalDocumentFromSlug(slug: string | undefined): LegalDocumentId | null {
  const match = (Object.keys(LEGAL_SLUGS) as LegalDocumentId[]).find((id) => LEGAL_SLUGS[id] === slug);
  return match ?? null;
}
