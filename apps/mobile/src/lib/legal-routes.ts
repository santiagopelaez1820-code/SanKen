// Esta línea sirve para importar los tipos «Href» desde «expo-router».
import type { Href } from 'expo-router';
// Esta línea sirve para importar los tipos «LegalDocumentId» desde «@sanken/core».
import type { LegalDocumentId } from '@sanken/core';

/** Mismos slugs que la web (apps/web/src/lib/legal-paths.ts): /legal/terminos, /legal/privacidad, /legal/cookies. */
// Esta línea sirve para declarar «LEGAL_SLUGS» con el valor «{».
export const LEGAL_SLUGS: Record<LegalDocumentId, string> = {
  // Esta línea sirve para declarar la propiedad «terms» con el valor o tipo «'terminos'».
  terms: 'terminos',
  // Esta línea sirve para declarar la propiedad «privacy» con el valor o tipo «'privacidad'».
  privacy: 'privacidad',
  // Esta línea sirve para declarar la propiedad «cookies» con el valor o tipo «'cookies'».
  cookies: 'cookies',
};

// Esta línea sirve para declarar «LEGAL_ROUTES» con el valor «{».
export const LEGAL_ROUTES: Record<LegalDocumentId, Href> = {
  // Esta línea sirve para definir el estilo «terms» con «pathname: '/legal/[doc]', params: { doc: 'terminos…».
  terms: { pathname: '/legal/[doc]', params: { doc: 'terminos' } },
  // Esta línea sirve para definir el estilo «privacy» con «pathname: '/legal/[doc]', params: { doc: 'privacid…».
  privacy: { pathname: '/legal/[doc]', params: { doc: 'privacidad' } },
  // Esta línea sirve para definir el estilo «cookies» con «pathname: '/legal/[doc]', params: { doc: 'cookies'…».
  cookies: { pathname: '/legal/[doc]', params: { doc: 'cookies' } },
};

// Esta línea sirve para declarar la función «legalDocumentFromSlug».
export function legalDocumentFromSlug(slug: string | undefined): LegalDocumentId | null {
  // Esta línea sirve para extraer «atc» de «(Object.keys(LEGAL_SLUGS) as LegalDocume».
  const match = (Object.keys(LEGAL_SLUGS) as LegalDocumentId[]).find((id) => LEGAL_SLUGS[id] === slug);
  // Esta línea sirve para devolver «match ?? null».
  return match ?? null;
}
