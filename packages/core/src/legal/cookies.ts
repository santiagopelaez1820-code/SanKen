import { LEGAL_DOCUMENTS } from './versions';

/**
 * Consentimiento de cookies (solo web). Las categorías son únicamente las
 * que existen en SanKen: 'necessary' (sesión, CSRF, token, carrito, la
 * propia elección) y 'preferences' (tema, tutoriales vistos, idioma de los
 * documentos). NO hay analítica ni marketing — no agregar categorías sin
 * una tecnología real detrás (ver la Política de Cookies).
 *
 * El consentimiento es por navegador, no por cuenta: se decide antes de
 * iniciar sesión y aplica a quien use ese navegador. Por eso se guarda en
 * el propio navegador (clave necesaria) y no en el backend.
 */
export type CookieCategory = 'necessary' | 'preferences';

export interface CookieConsent {
  /** Versión de la Política de Cookies vigente al decidir. */
  version: string;
  /** ISO 8601 */
  decidedAt: string;
  categories: { necessary: true; preferences: boolean };
}

export const COOKIE_CONSENT_STORAGE_KEY = 'sanken-cookie-consent';

/** Pasado este plazo se vuelve a preguntar. */
export const COOKIE_CONSENT_MAX_AGE_DAYS = 365;

/** Claves de almacenamiento local de la categoría 'preferences' (se borran al retirar el consentimiento). */
export const PREFERENCE_STORAGE_KEYS = ['sanken-theme', 'sanken-legal-locale'];
export const PREFERENCE_STORAGE_PREFIXES = ['sanken_tutorial_seen_'];

export function isPreferenceStorageKey(key: string): boolean {
  return PREFERENCE_STORAGE_KEYS.includes(key) || PREFERENCE_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export function createCookieConsent(preferences: boolean, now: Date = new Date()): CookieConsent {
  return {
    version: LEGAL_DOCUMENTS.cookies.version,
    decidedAt: now.toISOString(),
    categories: { necessary: true, preferences },
  };
}

/**
 * Lee un consentimiento guardado. Devuelve null (= hay que volver a
 * preguntar) si no existe, está corrupto, es de otra versión de la política
 * o superó COOKIE_CONSENT_MAX_AGE_DAYS.
 */
export function parseCookieConsent(raw: string | null, now: Date = new Date()): CookieConsent | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<CookieConsent>;
    if (
      typeof value !== 'object' ||
      value === null ||
      value.version !== LEGAL_DOCUMENTS.cookies.version ||
      typeof value.decidedAt !== 'string' ||
      typeof value.categories?.preferences !== 'boolean'
    ) {
      return null;
    }

    const decidedAt = Date.parse(value.decidedAt);
    if (Number.isNaN(decidedAt)) return null;
    const ageDays = (now.getTime() - decidedAt) / 86_400_000;
    if (ageDays > COOKIE_CONSENT_MAX_AGE_DAYS) return null;

    return {
      version: value.version,
      decidedAt: value.decidedAt,
      categories: { necessary: true, preferences: value.categories.preferences },
    };
  } catch {
    return null;
  }
}
