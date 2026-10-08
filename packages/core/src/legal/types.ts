/** Documentos legales publicados. Deben coincidir con `documents` en apps/api/config/legal.php. */
// Esta línea sirve para declarar los ids de los documentos legales.
export type LegalDocumentId = 'terms' | 'privacy' | 'cookies';

/**
 * Consentimientos que se otorgan por cuenta (registro / re-aceptación).
 * Deben coincidir con `consents` en apps/api/config/legal.php. Las cookies
 * NO están acá: su consentimiento es por navegador (ver ./cookies.ts).
 */
// Esta línea sirve para declarar los tipos de consentimiento que se pueden aceptar.
export type ConsentType = 'terms' | 'privacy' | 'health_data';

// Esta línea sirve para declarar los idiomas disponibles de los documentos.
export type LegalLocale = 'es' | 'en';

/**
 * 'draft' = contenido técnico listo pero SIN revisión jurídica. Las páginas
 * lo muestran con un aviso visible — no pasarlo a 'approved' hasta que el
 * responsable de SanKen (y, cuando corresponda, un profesional jurídico) lo
 * apruebe.
 */
// Esta línea sirve para declarar los estados posibles de un documento.
export type LegalDocumentStatus = 'draft' | 'approved';

// Esta línea sirve para declarar los metadatos de un documento legal.
export interface LegalDocumentMeta {
  // Esta línea sirve para guardar el id del documento.
  id: LegalDocumentId;
  // Esta línea sirve para guardar la versión vigente.
  version: string;
  /** YYYY-MM-DD */
  // Esta línea sirve para guardar la fecha de última actualización.
  updatedAt: string;
  // Esta línea sirve para guardar el estado del documento.
  status: LegalDocumentStatus;
}

/**
 * Bloques de contenido. El texto puede contener marcadores `{{campo}}` que se
 * resuelven contra LEGAL_OWNER_INFO (ver ./owner-info.ts) — si el dato
 * todavía no fue completado, se muestra como pendiente, nunca inventado.
 */
// Esta línea sirve para declarar los tipos de bloque de contenido.
export type LegalBlock =
  // Esta línea sirve para permitir un párrafo con texto.
  | { type: 'p'; text: string }
  // Esta línea sirve para permitir una lista de ítems.
  | { type: 'list'; items: string[] }
  // Esta línea sirve para permitir una tabla con encabezados y filas.
  | { type: 'table'; headers: string[]; rows: string[][] }
  // Esta línea sirve para permitir una nota destacada.
  | { type: 'note'; text: string };

// Esta línea sirve para declarar una sección del documento.
export interface LegalSection {
  // Esta línea sirve para guardar el id de la sección.
  id: string;
  // Esta línea sirve para guardar el título de la sección.
  title: string;
  // Esta línea sirve para guardar los bloques de la sección.
  blocks: LegalBlock[];
}

// Esta línea sirve para declarar el contenido de un documento en un idioma.
export interface LegalDocumentContent {
  // Esta línea sirve para guardar el título.
  title: string;
  /** Resumen corto bajo el título. */
  // Esta línea sirve para guardar el resumen.
  summary: string;
  // Esta línea sirve para guardar las secciones.
  sections: LegalSection[];
}

// Esta línea sirve para declarar un documento legal completo.
export interface LegalDocument extends LegalDocumentMeta {
  // Esta línea sirve para guardar el idioma.
  locale: LegalLocale;
  // Esta línea sirve para guardar el contenido.
  content: LegalDocumentContent;
  /**
   * false = traducción no revisada jurídicamente (aplica a 'en': el español
   * es el texto de referencia). Las páginas lo avisan.
   */
  // Esta línea sirve para indicar si la traducción fue revisada.
  translationReviewed: boolean;
}

/** Elemento de `pending` en GET/POST /legal/consents. */
// Esta línea sirve para declarar un consentimiento pendiente de aceptar.
export interface PendingConsent {
  // Esta línea sirve para guardar el tipo de consentimiento.
  type: ConsentType;
  // Esta línea sirve para guardar el documento al que pertenece.
  document: LegalDocumentId;
  // Esta línea sirve para guardar la versión vigente.
  version: string;
  // Esta línea sirve para guardar la versión aceptada antes, o null si nunca aceptó.
  accepted_version: string | null;
}

// Esta línea sirve para declarar un registro de consentimiento aceptado.
export interface ConsentRecord {
  // Esta línea sirve para guardar el id del registro.
  id: number;
  // Esta línea sirve para guardar el tipo de consentimiento.
  consent_type: ConsentType;
  // Esta línea sirve para guardar la versión del documento aceptada.
  document_version: string;
  // Esta línea sirve para guardar el estado aceptado.
  status: 'accepted';
  // Esta línea sirve para guardar el origen de la aceptación.
  source: 'registration' | 'social_registration' | 'reacceptance';
  // Esta línea sirve para guardar la fecha de registro.
  recorded_at: string;
}

// Esta línea sirve para declarar la respuesta del endpoint de consentimientos.
export interface LegalConsentsResponse {
  // Esta línea sirve para guardar los consentimientos pendientes.
  pending: PendingConsent[];
  // Esta línea sirve para guardar el historial de consentimientos.
  history: ConsentRecord[];
}

/** Respuesta de POST /auth/social cuando crearía una cuenta nueva sin los consentimientos obligatorios. */
// Esta línea sirve para declarar la respuesta cuando un login social requiere consentimiento.
export interface SocialConsentRequiredResponse {
  // Esta línea sirve para indicar que se requiere consentimiento.
  requires_consent: true;
  // Esta línea sirve para guardar los consentimientos a aceptar.
  consents: PendingConsent[];
}

/** Campos accept_<tipo> que exigen POST /auth/register y POST /auth/social (cuenta nueva). */
// Esta línea sirve para declarar los campos de aceptación que se envían a la API.
export type ConsentAcceptanceFields = {
  // Esta línea sirve para generar un campo opcional accept_<tipo> por cada tipo de consentimiento.
  [K in ConsentType as `accept_${K}`]?: boolean;
// Esta línea sirve para combinar con los campos adicionales.
} & {
  /** Versión del texto que se le mostró al usuario — el backend la rechaza si ya no es la vigente. */
  // Esta línea sirve para guardar las versiones legales aceptadas por tipo.
  legal_versions?: Partial<Record<ConsentType, string>>;
};
