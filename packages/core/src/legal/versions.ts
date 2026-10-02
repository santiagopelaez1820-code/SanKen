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
export const LEGAL_DOCUMENTS: Record<LegalDocumentId, LegalDocumentMeta> = {
  terms: { id: 'terms', version: '1.0', updatedAt: '2026-09-28', status: 'approved' },
  privacy: { id: 'privacy', version: '1.2', updatedAt: '2026-09-30', status: 'approved' },
  cookies: { id: 'cookies', version: '1.1', updatedAt: '2026-09-30', status: 'approved' },
};

/** Documento que respalda cada consentimiento (espejo de `consents` en config/legal.php). */
export const CONSENT_DOCUMENT: Record<ConsentType, LegalDocumentId> = {
  terms: 'terms',
  privacy: 'privacy',
  health_data: 'privacy',
};

/** Orden en que se muestran las casillas. Todas son obligatorias para crear una cuenta. */
export const REQUIRED_CONSENTS: ConsentType[] = ['terms', 'privacy', 'health_data'];

/** Versión vigente del documento que respalda cada consentimiento — para mandar como `legal_versions`. */
export function currentConsentVersions(types: ConsentType[] = REQUIRED_CONSENTS): Partial<Record<ConsentType, string>> {
  const versions: Partial<Record<ConsentType, string>> = {};
  for (const type of types) {
    versions[type] = LEGAL_DOCUMENTS[CONSENT_DOCUMENT[type]].version;
  }
  return versions;
}

/**
 * Arma los campos `accept_*` + `legal_versions` para registro / login social
 * a partir de las casillas marcadas. Una casilla sin marcar se manda como
 * false (el backend la rechaza en el registro) — nunca se asume aceptada.
 */
export function buildConsentFields(accepted: Partial<Record<ConsentType, boolean>>): ConsentAcceptanceFields {
  const fields: ConsentAcceptanceFields = { legal_versions: currentConsentVersions() };
  for (const type of REQUIRED_CONSENTS) {
    fields[`accept_${type}`] = accepted[type] === true;
  }
  return fields;
}
