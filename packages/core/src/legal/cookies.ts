// Esta línea sirve para importar los documentos legales para conocer la versión vigente de la política de cookies.
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
// Esta línea sirve para declarar las categorías de cookies que existen en SanKen.
export type CookieCategory = 'necessary' | 'preferences';

// Esta línea sirve para declarar la forma del consentimiento de cookies guardado.
export interface CookieConsent {
  /** Versión de la Política de Cookies vigente al decidir. */
  // Esta línea sirve para guardar la versión de la política vigente al decidir.
  version: string;
  /** ISO 8601 */
  // Esta línea sirve para guardar la fecha de la decisión en formato ISO 8601.
  decidedAt: string;
  // Esta línea sirve para guardar las categorías (las necesarias siempre activas, las de preferencias opcionales).
  categories: { necessary: true; preferences: boolean };
}

// Esta línea sirve para definir la clave con la que se guarda el consentimiento en el navegador.
export const COOKIE_CONSENT_STORAGE_KEY = 'sanken-cookie-consent';

/** Pasado este plazo se vuelve a preguntar. */
// Esta línea sirve para definir que el consentimiento vale 365 días.
export const COOKIE_CONSENT_MAX_AGE_DAYS = 365;

/** Claves de almacenamiento local de la categoría 'preferences' (se borran al retirar el consentimiento). */
// Esta línea sirve para definir las claves de preferencias que se borran al retirar el consentimiento.
export const PREFERENCE_STORAGE_KEYS = ['sanken-theme', 'sanken-legal-locale'];
// Esta línea sirve para definir los prefijos de claves de preferencias (tutoriales vistos).
export const PREFERENCE_STORAGE_PREFIXES = ['sanken_tutorial_seen_'];

// Esta línea sirve para declarar la función que indica si una clave pertenece a las preferencias.
export function isPreferenceStorageKey(key: string): boolean {
  // Esta línea sirve para devolver verdadero si coincide con una clave o empieza por un prefijo de preferencias.
  return PREFERENCE_STORAGE_KEYS.includes(key) || PREFERENCE_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
}

// Esta línea sirve para declarar la función que crea un consentimiento nuevo.
export function createCookieConsent(preferences: boolean, now: Date = new Date()): CookieConsent {
  // Esta línea sirve para devolver el consentimiento.
  return {
    // Esta línea sirve para guardar la versión vigente de la política de cookies.
    version: LEGAL_DOCUMENTS.cookies.version,
    // Esta línea sirve para guardar la fecha actual en formato ISO.
    decidedAt: now.toISOString(),
    // Esta línea sirve para guardar las categorías con las necesarias activas y las preferencias según la decisión.
    categories: { necessary: true, preferences },
  };
}

/**
 * Lee un consentimiento guardado. Devuelve null (= hay que volver a
 * preguntar) si no existe, está corrupto, es de otra versión de la política
 * o superó COOKIE_CONSENT_MAX_AGE_DAYS.
 */
// Esta línea sirve para declarar la función que lee un consentimiento guardado.
export function parseCookieConsent(raw: string | null, now: Date = new Date()): CookieConsent | null {
  // Esta línea sirve para devolver null si no hay texto guardado.
  if (!raw) return null;

  // Esta línea sirve para intentar leer el consentimiento.
  try {
    // Esta línea sirve para convertir el texto JSON en objeto.
    const value = JSON.parse(raw) as Partial<CookieConsent>;
    // Esta línea sirve para revisar si el objeto no es válido.
    if (
      // Esta línea sirve para revisar si el valor no es un objeto.
      typeof value !== 'object' ||
      // Esta línea sirve para revisar si es null.
      value === null ||
      // Esta línea sirve para revisar si es de otra versión de la política.
      value.version !== LEGAL_DOCUMENTS.cookies.version ||
      // Esta línea sirve para revisar si la fecha no es texto.
      typeof value.decidedAt !== 'string' ||
      // Esta línea sirve para revisar si la preferencia no es booleana.
      typeof value.categories?.preferences !== 'boolean'
    // Esta línea sirve para cerrar las condiciones.
    ) {
      // Esta línea sirve para devolver null para volver a preguntar.
      return null;
    }

    // Esta línea sirve para convertir la fecha de la decisión en milisegundos.
    const decidedAt = Date.parse(value.decidedAt);
    // Esta línea sirve para devolver null si la fecha no es válida.
    if (Number.isNaN(decidedAt)) return null;
    // Esta línea sirve para calcular cuántos días pasaron desde la decisión.
    const ageDays = (now.getTime() - decidedAt) / 86_400_000;
    // Esta línea sirve para devolver null si ya pasó el plazo de 365 días.
    if (ageDays > COOKIE_CONSENT_MAX_AGE_DAYS) return null;

    // Esta línea sirve para devolver el consentimiento válido.
    return {
      // Esta línea sirve para incluir la versión.
      version: value.version,
      // Esta línea sirve para incluir la fecha de la decisión.
      decidedAt: value.decidedAt,
      // Esta línea sirve para incluir las categorías con las necesarias activas y la preferencia guardada.
      categories: { necessary: true, preferences: value.categories.preferences },
    };
  // Esta línea sirve para capturar cualquier error al leer el texto.
  } catch {
    // Esta línea sirve para devolver null para volver a preguntar.
    return null;
  }
}
