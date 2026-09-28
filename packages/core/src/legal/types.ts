/** Documentos legales publicados. Deben coincidir con `documents` en apps/api/config/legal.php. */
export type LegalDocumentId = 'terms' | 'privacy' | 'cookies';

/**
 * Consentimientos que se otorgan por cuenta (registro / re-aceptación).
 * Deben coincidir con `consents` en apps/api/config/legal.php. Las cookies
 * NO están acá: su consentimiento es por navegador (ver ./cookies.ts).
 */
export type ConsentType = 'terms' | 'privacy' | 'health_data';

export type LegalLocale = 'es' | 'en';

/**
 * 'draft' = contenido técnico listo pero SIN revisión jurídica. Las páginas
 * lo muestran con un aviso visible — no pasarlo a 'approved' hasta que el
 * responsable de SanKen (y, cuando corresponda, un profesional jurídico) lo
 * apruebe.
 */
export type LegalDocumentStatus = 'draft' | 'approved';

export interface LegalDocumentMeta {
  id: LegalDocumentId;
  version: string;
  /** YYYY-MM-DD */
  updatedAt: string;
  status: LegalDocumentStatus;
}

/**
 * Bloques de contenido. El texto puede contener marcadores `{{campo}}` que se
 * resuelven contra LEGAL_OWNER_INFO (ver ./owner-info.ts) — si el dato
 * todavía no fue completado, se muestra como pendiente, nunca inventado.
 */
export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'note'; text: string };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocumentContent {
  title: string;
  /** Resumen corto bajo el título. */
  summary: string;
  sections: LegalSection[];
}

export interface LegalDocument extends LegalDocumentMeta {
  locale: LegalLocale;
  content: LegalDocumentContent;
  /**
   * false = traducción no revisada jurídicamente (aplica a 'en': el español
   * es el texto de referencia). Las páginas lo avisan.
   */
  translationReviewed: boolean;
}

/** Elemento de `pending` en GET/POST /legal/consents. */
export interface PendingConsent {
  type: ConsentType;
  document: LegalDocumentId;
  version: string;
  accepted_version: string | null;
}

export interface ConsentRecord {
  id: number;
  consent_type: ConsentType;
  document_version: string;
  status: 'accepted';
  source: 'registration' | 'social_registration' | 'reacceptance';
  recorded_at: string;
}

export interface LegalConsentsResponse {
  pending: PendingConsent[];
  history: ConsentRecord[];
}

/** Respuesta de POST /auth/social cuando crearía una cuenta nueva sin los consentimientos obligatorios. */
export interface SocialConsentRequiredResponse {
  requires_consent: true;
  consents: PendingConsent[];
}

/** Campos accept_<tipo> que exigen POST /auth/register y POST /auth/social (cuenta nueva). */
export type ConsentAcceptanceFields = {
  [K in ConsentType as `accept_${K}`]?: boolean;
} & {
  /** Versión del texto que se le mostró al usuario — el backend la rechaza si ya no es la vigente. */
  legal_versions?: Partial<Record<ConsentType, string>>;
};
