import type { ConsentType, LegalDocumentId, LegalLocale } from './types';

/**
 * Textos de interfaz del sistema legal (casillas, banner de cookies,
 * re-aceptación, enlaces). SanKen todavía no tiene un sistema i18n global
 * — la interfaz está en español —, así que estos textos se agrupan acá por
 * idioma para que web y mobile no los hardcodeen en los componentes y para
 * que migrarlos a un i18n futuro sea mover un solo archivo.
 */
export interface ConsentLabel {
  before: string;
  link: string;
  after: string;
  document: LegalDocumentId;
}

export interface LegalStrings {
  documentNames: Record<LegalDocumentId, string>;
  /** Etiqueta corta para enlaces en pie de página. */
  shortNames: Record<LegalDocumentId, string>;
  versionLine: (version: string, date: string) => string;
  acceptedVersionLine: (version: string, date: string) => string;
  draftNotice: string;
  translationNotice: string;
  pendingFieldsNotice: string;
  tableOfContents: string;
  languageLabel: string;
  languageNames: Record<LegalLocale, string>;
  backToApp: string;
  legalSectionTitle: string;
  legalSectionDescription: string;

  consentLabels: Record<ConsentType, ConsentLabel>;
  consentRequiredErrors: Record<ConsentType, string>;
  opensInNewTab: string;

  socialConsentTitle: string;
  socialConsentDescription: string;
  socialConsentConfirm: string;
  cancel: string;

  reacceptTitle: string;
  reacceptDescription: string;
  reacceptNewDocument: (version: string) => string;
  reacceptUpdatedDocument: (from: string, to: string) => string;
  reacceptConfirm: string;
  reacceptLogout: string;
  reacceptError: string;

  cookieBannerTitle: string;
  cookieBannerBody: string;
  cookieBannerMoreInfo: string;
  cookieConfigure: string;
  cookieRejectOptional: string;
  cookieAcceptAll: string;
  cookieSettingsTitle: string;
  cookieSettingsDescription: string;
  cookieNecessaryLabel: string;
  cookieNecessaryDescription: string;
  cookieAlwaysActive: string;
  cookiePreferencesLabel: string;
  cookiePreferencesDescription: string;
  cookieNoTrackingNote: string;
  cookieSave: string;
  cookieCurrentChoice: (preferences: boolean, date: string) => string;

  deleteAccountTitle: string;
  deleteAccountDescription: string;
  deleteAccountOpen: string;
  /** Instrucción; la palabra a escribir es siempre DELETE_ACCOUNT_CONFIRMATION (la valida el backend). */
  deleteAccountConfirmLabel: string;
  deleteAccountPasswordLabel: string;
  deleteAccountSubmit: string;
  deleteAccountError: string;
  deleteAccountAdminNote: string;
  deleteAccountFromReaccept: string;
}

/** Palabra que exige DELETE /auth/me (DeleteAccountRequest::CONFIRMATION_WORD), igual en ambos idiomas. */
export const DELETE_ACCOUNT_CONFIRMATION = 'ELIMINAR';

const es: LegalStrings = {
  documentNames: {
    terms: 'Términos y Condiciones',
    privacy: 'Política de Privacidad',
    cookies: 'Política de Cookies',
  },
  shortNames: { terms: 'Términos', privacy: 'Privacidad', cookies: 'Cookies' },
  versionLine: (version, date) => `Versión ${version} · Actualizado el ${date}`,
  acceptedVersionLine: (version, date) => `Aceptaste la versión ${version} el ${date}`,
  draftNotice:
    'Borrador pendiente de revisión legal. El contenido refleja el funcionamiento actual de la aplicación, pero todavía no fue aprobado por el responsable de SanKen ni por un profesional jurídico.',
  translationNotice: '',
  pendingFieldsNotice: 'Los datos marcados como [Pendiente] deben ser completados por el responsable de SanKen.',
  tableOfContents: 'Contenido',
  languageLabel: 'Idioma del documento',
  languageNames: { es: 'Español', en: 'English' },
  backToApp: 'Volver',
  legalSectionTitle: 'Privacidad y documentos legales',
  legalSectionDescription: 'Consulta los documentos que aceptaste y administra tus preferencias.',

  consentLabels: {
    terms: { before: 'He leído y acepto los ', link: 'Términos y Condiciones', after: '.', document: 'terms' },
    privacy: {
      before: 'He leído la ',
      link: 'Política de Privacidad',
      after: ' y autorizo el tratamiento de mis datos personales conforme a ella.',
      document: 'privacy',
    },
    health_data: {
      before:
        'Autorizo el tratamiento de mis datos de salud y condición física (peso, medidas, sueño, energía y alimentación) para personalizar mi entrenamiento, según la ',
      link: 'Política de Privacidad',
      after: '.',
      document: 'privacy',
    },
  },
  consentRequiredErrors: {
    terms: 'Debes aceptar los Términos y Condiciones.',
    privacy: 'Debes aceptar la Política de Privacidad.',
    health_data: 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
  },
  opensInNewTab: '(se abre en una pestaña nueva)',

  socialConsentTitle: 'Antes de crear tu cuenta',
  socialConsentDescription: 'Para crear tu cuenta de SanKen con Google necesitamos que revises y aceptes lo siguiente:',
  socialConsentConfirm: 'Aceptar y crear cuenta',
  cancel: 'Cancelar',

  reacceptTitle: 'Actualizamos nuestros documentos',
  reacceptDescription: 'Para seguir usando SanKen revisa y acepta la versión vigente de estos documentos.',
  reacceptNewDocument: (version) => `Versión ${version}`,
  reacceptUpdatedDocument: (from, to) => `Aceptaste la versión ${from} · vigente: ${to}`,
  reacceptConfirm: 'Aceptar y continuar',
  reacceptLogout: 'Cerrar sesión',
  reacceptError: 'No se pudo registrar tu aceptación. Inténtalo de nuevo.',

  cookieBannerTitle: 'Usamos cookies',
  cookieBannerBody:
    'Usamos cookies necesarias para que SanKen funcione (sesión, seguridad y carrito). Con tu permiso, también guardamos preferencias como el modo claro u oscuro. No usamos cookies de analítica ni de publicidad.',
  cookieBannerMoreInfo: 'Más información en la Política de Cookies',
  cookieConfigure: 'Configurar',
  cookieRejectOptional: 'Rechazar opcionales',
  cookieAcceptAll: 'Aceptar todas',
  cookieSettingsTitle: 'Configuración de cookies',
  cookieSettingsDescription: 'Elige qué cookies opcionales permites en este navegador. Puedes cambiarlo cuando quieras.',
  cookieNecessaryLabel: 'Necesarias',
  cookieNecessaryDescription: 'Inicio de sesión, seguridad de los formularios, carrito y tu elección sobre cookies.',
  cookieAlwaysActive: 'Siempre activas',
  cookiePreferencesLabel: 'Preferencias',
  cookiePreferencesDescription: 'Recuerdan el modo claro/oscuro, los tutoriales que ya viste y el idioma de los documentos legales.',
  cookieNoTrackingNote: 'SanKen no usa cookies analíticas ni de marketing, por eso no aparecen en esta lista.',
  cookieSave: 'Guardar preferencias',
  cookieCurrentChoice: (preferences, date) =>
    `Tu elección actual (${date}): ${preferences ? 'preferencias permitidas' : 'solo cookies necesarias'}.`,

  deleteAccountTitle: 'Eliminar mi cuenta',
  deleteAccountDescription:
    'Se eliminan de forma permanente tu cuenta y tus datos: perfil, entrenamientos, medidas, nutrición, récords, mensajes, pedidos, fotos, videos y consentimientos. No se puede deshacer.',
  deleteAccountOpen: 'Eliminar mi cuenta',
  deleteAccountConfirmLabel: 'Escribe ELIMINAR para confirmar',
  deleteAccountPasswordLabel: 'Tu contraseña actual',
  deleteAccountSubmit: 'Eliminar definitivamente',
  deleteAccountError: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.',
  deleteAccountAdminNote: 'Una cuenta de Super Admin no se puede eliminar desde la app: pídeselo a otro Super Admin.',
  deleteAccountFromReaccept: 'No acepto: eliminar mi cuenta',
};

const en: LegalStrings = {
  documentNames: {
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
  },
  shortNames: { terms: 'Terms', privacy: 'Privacy', cookies: 'Cookies' },
  versionLine: (version, date) => `Version ${version} · Updated ${date}`,
  acceptedVersionLine: (version, date) => `You accepted version ${version} on ${date}`,
  draftNotice:
    'Draft pending legal review. The content reflects how the app currently works, but it has not yet been approved by the SanKen owner or by a legal professional.',
  translationNotice:
    'This English translation has not been legally reviewed. The Spanish version is the reference text.',
  pendingFieldsNotice: 'Items marked [Pending] must be completed by the SanKen owner.',
  tableOfContents: 'Contents',
  languageLabel: 'Document language',
  languageNames: { es: 'Español', en: 'English' },
  backToApp: 'Back',
  legalSectionTitle: 'Privacy and legal documents',
  legalSectionDescription: 'Review the documents you accepted and manage your preferences.',

  consentLabels: {
    terms: { before: 'I have read and accept the ', link: 'Terms and Conditions', after: '.', document: 'terms' },
    privacy: {
      before: 'I have read the ',
      link: 'Privacy Policy',
      after: ' and authorize the processing of my personal data under it.',
      document: 'privacy',
    },
    health_data: {
      before:
        'I authorize the processing of my health and fitness data (weight, measurements, sleep, energy and diet) to personalize my training, as described in the ',
      link: 'Privacy Policy',
      after: '.',
      document: 'privacy',
    },
  },
  consentRequiredErrors: {
    terms: 'You must accept the Terms and Conditions.',
    privacy: 'You must accept the Privacy Policy.',
    health_data: 'You must authorize the processing of your health and fitness data.',
  },
  opensInNewTab: '(opens in a new tab)',

  socialConsentTitle: 'Before creating your account',
  socialConsentDescription: 'To create your SanKen account with Google, please review and accept the following:',
  socialConsentConfirm: 'Accept and create account',
  cancel: 'Cancel',

  reacceptTitle: 'We updated our documents',
  reacceptDescription: 'To keep using SanKen, please review and accept the current version of these documents.',
  reacceptNewDocument: (version) => `Version ${version}`,
  reacceptUpdatedDocument: (from, to) => `You accepted version ${from} · current: ${to}`,
  reacceptConfirm: 'Accept and continue',
  reacceptLogout: 'Sign out',
  reacceptError: 'We could not record your acceptance. Please try again.',

  cookieBannerTitle: 'We use cookies',
  cookieBannerBody:
    'We use necessary cookies so SanKen works (session, security and cart). With your permission, we also store preferences such as light or dark mode. We do not use analytics or advertising cookies.',
  cookieBannerMoreInfo: 'More information in the Cookie Policy',
  cookieConfigure: 'Settings',
  cookieRejectOptional: 'Reject optional',
  cookieAcceptAll: 'Accept all',
  cookieSettingsTitle: 'Cookie settings',
  cookieSettingsDescription: 'Choose which optional cookies you allow in this browser. You can change this at any time.',
  cookieNecessaryLabel: 'Necessary',
  cookieNecessaryDescription: 'Sign-in, form security, cart and your cookie choice.',
  cookieAlwaysActive: 'Always active',
  cookiePreferencesLabel: 'Preferences',
  cookiePreferencesDescription: 'Remember light/dark mode, the tutorials you have seen and the language of the legal documents.',
  cookieNoTrackingNote: 'SanKen does not use analytics or marketing cookies, so they are not listed here.',
  cookieSave: 'Save preferences',
  cookieCurrentChoice: (preferences, date) =>
    `Your current choice (${date}): ${preferences ? 'preferences allowed' : 'necessary cookies only'}.`,

  deleteAccountTitle: 'Delete my account',
  deleteAccountDescription:
    'Your account and your data are permanently deleted: profile, workouts, measurements, nutrition, records, messages, orders, photos, videos and consents. This cannot be undone.',
  deleteAccountOpen: 'Delete my account',
  deleteAccountConfirmLabel: 'Type ELIMINAR to confirm',
  deleteAccountPasswordLabel: 'Your current password',
  deleteAccountSubmit: 'Delete permanently',
  deleteAccountError: 'We could not delete the account. Please try again.',
  deleteAccountAdminNote: 'A Super Admin account cannot be deleted from the app: ask another Super Admin.',
  deleteAccountFromReaccept: 'I do not accept: delete my account',
};

export const LEGAL_STRINGS: Record<LegalLocale, LegalStrings> = { es, en };

/** Idioma por defecto de la interfaz legal — el de la app. */
export const DEFAULT_LEGAL_LOCALE: LegalLocale = 'es';

/** Formatea una fecha YYYY-MM-DD sin depender de la zona horaria del dispositivo. */
export function formatLegalDate(isoDate: string, locale: LegalLocale): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CO' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
