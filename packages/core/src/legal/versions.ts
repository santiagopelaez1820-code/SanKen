// Esta línea sirve para importar los tipos que usan las versiones.
import type { ConsentAcceptanceFields, ConsentType, LegalDocumentId, LegalDocumentMeta } from './types';

/**
 * Versión vigente de cada documento. DEBE coincidir con
 * apps/api/config/legal.php (el backend es quien registra la versión
 * aceptada; si el texto mostrado acá quedara desfasado, el backend rechaza
 * la aceptación con "el documento fue actualizado").
 *
 * Para publicar una versión nueva: editar el texto en ./documents/, subir la
 * versión y la fecha acá Y en config/legal.php. Los usuarios que aceptaron
 * la versión anterior verán la pantalla de re-aceptación.
 */
// Esta línea sirve para declarar la versión vigente de cada documento legal.
export const LEGAL_DOCUMENTS: Record<LegalDocumentId, LegalDocumentMeta> = {
  // Esta línea sirve para definir la versión de los términos y condiciones.
  terms: { id: 'terms', version: '1.0', updatedAt: '2026-09-28', status: 'approved' },
  // Esta línea sirve para definir la versión de la política de privacidad.
  privacy: { id: 'privacy', version: '1.2', updatedAt: '2026-09-30', status: 'approved' },
  // Esta línea sirve para definir la versión de la política de cookies.
  cookies: { id: 'cookies', version: '1.1', updatedAt: '2026-09-30', status: 'approved' },
};

/** Documento que respalda cada consentimiento (espejo de `consents` en config/legal.php). */
// Esta línea sirve para declarar qué documento respalda cada tipo de consentimiento.
export const CONSENT_DOCUMENT: Record<ConsentType, LegalDocumentId> = {
  // Esta línea sirve para asociar el consentimiento de términos con los términos.
  terms: 'terms',
  // Esta línea sirve para asociar el consentimiento de privacidad con la política de privacidad.
  privacy: 'privacy',
  // Esta línea sirve para asociar el consentimiento de datos de salud con la política de privacidad.
  health_data: 'privacy',
};

/** Orden en que se muestran las casillas. Todas son obligatorias para crear una cuenta. */
// Esta línea sirve para declarar los consentimientos obligatorios al registrarse.
export const REQUIRED_CONSENTS: ConsentType[] = ['terms', 'privacy', 'health_data'];

/** Versión vigente del documento que respalda cada consentimiento — para mandar como `legal_versions`. */
// Esta línea sirve para declarar la función que devuelve la versión vigente de cada consentimiento.
export function currentConsentVersions(types: ConsentType[] = REQUIRED_CONSENTS): Partial<Record<ConsentType, string>> {
  // Esta línea sirve para crear el objeto vacío de versiones.
  const versions: Partial<Record<ConsentType, string>> = {};
  // Esta línea sirve para recorrer cada tipo de consentimiento.
  for (const type of types) {
    // Esta línea sirve para guardar la versión vigente del documento asociado.
    versions[type] = LEGAL_DOCUMENTS[CONSENT_DOCUMENT[type]].version;
  }
  // Esta línea sirve para devolver las versiones.
  return versions;
}

/**
 * Arma los campos `accept_*` + `legal_versions` para registro / login social
 * a partir de las casillas marcadas. Una casilla sin marcar se manda como
 * false (el backend la rechaza en el registro) — nunca se asume aceptada.
 */
// Esta línea sirve para declarar la función que arma los campos de aceptación para la API.
export function buildConsentFields(accepted: Partial<Record<ConsentType, boolean>>): ConsentAcceptanceFields {
  // Esta línea sirve para crear los campos con las versiones vigentes.
  const fields: ConsentAcceptanceFields = { legal_versions: currentConsentVersions() };
  // Esta línea sirve para recorrer cada consentimiento obligatorio.
  for (const type of REQUIRED_CONSENTS) {
    // Esta línea sirve para marcar el campo como aceptado solo si el valor es verdadero.
    fields[`accept_${type}`] = accepted[type] === true;
  }
  // Esta línea sirve para devolver los campos.
  return fields;
}
