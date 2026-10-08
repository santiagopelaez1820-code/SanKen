// Esta línea sirve para importar los tipos legales que usan los textos.
import type { ConsentType, LegalDocumentId, LegalLocale } from './types';

/**
 * Textos de interfaz del sistema legal (casillas, banner de cookies,
 * re-aceptación, enlaces). SanKen todavía no tiene un sistema i18n global
 * — la interfaz está en español —, así que estos textos se agrupan acá por
 * idioma para que web y mobile no los hardcodeen en los componentes y para
 * que migrarlos a un i18n futuro sea mover un solo archivo.
 */
// Esta línea sirve para declarar la interfaz «ConsentLabel».
export interface ConsentLabel {
  // Esta línea sirve para declarar el texto «before».
  before: string;
  // Esta línea sirve para declarar el texto «link».
  link: string;
  // Esta línea sirve para declarar el texto «after».
  after: string;
  // Esta línea sirve para declarar a qué documento legal enlaza el texto.
  document: LegalDocumentId;
}

// Esta línea sirve para declarar la interfaz «LegalStrings».
export interface LegalStrings {
  // Esta línea sirve para declarar el mapa de textos «documentNames» por clave.
  documentNames: Record<LegalDocumentId, string>;
  /** Etiqueta corta para enlaces en pie de página. */
  // Esta línea sirve para declarar el mapa de textos «shortNames» por clave.
  shortNames: Record<LegalDocumentId, string>;
  // Esta línea sirve para declarar la función que genera el texto «versionLine».
  versionLine: (version: string, date: string) => string;
  // Esta línea sirve para declarar la función que genera el texto «acceptedVersionLine».
  acceptedVersionLine: (version: string, date: string) => string;
  // Esta línea sirve para declarar el texto «draftNotice».
  draftNotice: string;
  // Esta línea sirve para declarar el texto «translationNotice».
  translationNotice: string;
  // Esta línea sirve para declarar el texto «pendingFieldsNotice».
  pendingFieldsNotice: string;
  // Esta línea sirve para declarar el texto «tableOfContents».
  tableOfContents: string;
  // Esta línea sirve para declarar el texto «languageLabel».
  languageLabel: string;
  // Esta línea sirve para declarar el mapa de textos «languageNames» por clave.
  languageNames: Record<LegalLocale, string>;
  // Esta línea sirve para declarar el texto «backToApp».
  backToApp: string;
  // Esta línea sirve para declarar el texto «legalSectionTitle».
  legalSectionTitle: string;
  // Esta línea sirve para declarar el texto «legalSectionDescription».
  legalSectionDescription: string;

  // Esta línea sirve para declarar el mapa de textos «consentLabels» por clave.
  consentLabels: Record<ConsentType, ConsentLabel>;
  // Esta línea sirve para declarar el mapa de textos «consentRequiredErrors» por clave.
  consentRequiredErrors: Record<ConsentType, string>;
  // Esta línea sirve para declarar el texto «opensInNewTab».
  opensInNewTab: string;

  // Esta línea sirve para declarar el texto «socialConsentTitle».
  socialConsentTitle: string;
  // Esta línea sirve para declarar el texto «socialConsentDescription».
  socialConsentDescription: string;
  // Esta línea sirve para declarar el texto «socialConsentConfirm».
  socialConsentConfirm: string;
  // Esta línea sirve para declarar el texto «cancel».
  cancel: string;

  // Esta línea sirve para declarar el texto «reacceptTitle».
  reacceptTitle: string;
  // Esta línea sirve para declarar el texto «reacceptDescription».
  reacceptDescription: string;
  // Esta línea sirve para declarar la función que genera el texto «reacceptNewDocument».
  reacceptNewDocument: (version: string) => string;
  // Esta línea sirve para declarar la función que genera el texto «reacceptUpdatedDocument».
  reacceptUpdatedDocument: (from: string, to: string) => string;
  // Esta línea sirve para declarar el texto «reacceptConfirm».
  reacceptConfirm: string;
  // Esta línea sirve para declarar el texto «reacceptLogout».
  reacceptLogout: string;
  // Esta línea sirve para declarar el texto «reacceptError».
  reacceptError: string;

  // Esta línea sirve para declarar el texto «cookieBannerTitle».
  cookieBannerTitle: string;
  // Esta línea sirve para declarar el texto «cookieBannerBody».
  cookieBannerBody: string;
  // Esta línea sirve para declarar el texto «cookieBannerMoreInfo».
  cookieBannerMoreInfo: string;
  // Esta línea sirve para declarar el texto «cookieConfigure».
  cookieConfigure: string;
  // Esta línea sirve para declarar el texto «cookieRejectOptional».
  cookieRejectOptional: string;
  // Esta línea sirve para declarar el texto «cookieAcceptAll».
  cookieAcceptAll: string;
  // Esta línea sirve para declarar el texto «cookieSettingsTitle».
  cookieSettingsTitle: string;
  // Esta línea sirve para declarar el texto «cookieSettingsDescription».
  cookieSettingsDescription: string;
  // Esta línea sirve para declarar el texto «cookieNecessaryLabel».
  cookieNecessaryLabel: string;
  // Esta línea sirve para declarar el texto «cookieNecessaryDescription».
  cookieNecessaryDescription: string;
  // Esta línea sirve para declarar el texto «cookieAlwaysActive».
  cookieAlwaysActive: string;
  // Esta línea sirve para declarar el texto «cookiePreferencesLabel».
  cookiePreferencesLabel: string;
  // Esta línea sirve para declarar el texto «cookiePreferencesDescription».
  cookiePreferencesDescription: string;
  // Esta línea sirve para declarar el texto «cookieNoTrackingNote».
  cookieNoTrackingNote: string;
  // Esta línea sirve para declarar el texto «cookieSave».
  cookieSave: string;
  // Esta línea sirve para declarar la función que genera el texto «cookieCurrentChoice».
  cookieCurrentChoice: (preferences: boolean, date: string) => string;

  // Esta línea sirve para declarar el texto «deleteAccountTitle».
  deleteAccountTitle: string;
  // Esta línea sirve para declarar el texto «deleteAccountDescription».
  deleteAccountDescription: string;
  // Esta línea sirve para declarar el texto «deleteAccountOpen».
  deleteAccountOpen: string;
  /** Instrucción; la palabra a escribir es siempre DELETE_ACCOUNT_CONFIRMATION (la valida el backend). */
  // Esta línea sirve para declarar el texto «deleteAccountConfirmLabel».
  deleteAccountConfirmLabel: string;
  // Esta línea sirve para declarar el texto «deleteAccountPasswordLabel».
  deleteAccountPasswordLabel: string;
  // Esta línea sirve para declarar el texto «deleteAccountSubmit».
  deleteAccountSubmit: string;
  // Esta línea sirve para declarar el texto «deleteAccountError».
  deleteAccountError: string;
  // Esta línea sirve para declarar el texto «deleteAccountAdminNote».
  deleteAccountAdminNote: string;
  // Esta línea sirve para declarar el texto «deleteAccountFromReaccept».
  deleteAccountFromReaccept: string;
}

/** Palabra que exige DELETE /auth/me (DeleteAccountRequest::CONFIRMATION_WORD), igual en ambos idiomas. */
// Esta línea sirve para definir la palabra que el usuario debe escribir para confirmar el borrado de la cuenta.
export const DELETE_ACCOUNT_CONFIRMATION = 'ELIMINAR';

// Esta línea sirve para declarar los textos de la interfaz legal en el idioma «es».
const es: LegalStrings = {
  // Esta línea sirve para abrir el grupo de textos «documentNames».
  documentNames: {
    // Esta línea sirve para definir el texto «terms»: «Términos y Condiciones',».
    terms: 'Términos y Condiciones',
    // Esta línea sirve para definir el texto «privacy»: «Política de Privacidad',».
    privacy: 'Política de Privacidad',
    // Esta línea sirve para definir el texto «cookies»: «Política de Cookies',».
    cookies: 'Política de Cookies',
  },
  // Esta línea sirve para definir los textos cortos «shortNames» en una sola línea.
  shortNames: { terms: 'Términos', privacy: 'Privacidad', cookies: 'Cookies' },
  // Esta línea sirve para definir la función que genera el texto «versionLine»: «Versión ${version} · Actualizado el ${da…».
  versionLine: (version, date) => `Versión ${version} · Actualizado el ${date}`,
  // Esta línea sirve para definir la función que genera el texto «acceptedVersionLine»: «Aceptaste la versión ${version} el ${dat…».
  acceptedVersionLine: (version, date) => `Aceptaste la versión ${version} el ${date}`,
  // Esta línea sirve para definir el texto «draftNotice» (valor en la línea siguiente).
  draftNotice:
    // Esta línea sirve para incluir el texto: «Borrador pendiente de revisión legal. El contenido…».
    'Borrador pendiente de revisión legal. El contenido refleja el funcionamiento actual de la aplicación, pero todavía no fue aprobado por el responsable de SanKen ni por un profesional jurídico.',
  // Esta línea sirve para definir el texto «translationNotice»: «».
  translationNotice: '',
  // Esta línea sirve para definir el texto «pendingFieldsNotice»: «Los datos marcados como [Pendiente] deben ser comp».
  pendingFieldsNotice: 'Los datos marcados como [Pendiente] deben ser completados por el responsable de SanKen.',
  // Esta línea sirve para definir el texto «tableOfContents»: «Contenido».
  tableOfContents: 'Contenido',
  // Esta línea sirve para definir el texto «languageLabel»: «Idioma del documento».
  languageLabel: 'Idioma del documento',
  // Esta línea sirve para definir los textos cortos «languageNames» en una sola línea.
  languageNames: { es: 'Español', en: 'English' },
  // Esta línea sirve para definir el texto «backToApp»: «Volver».
  backToApp: 'Volver',
  // Esta línea sirve para definir el texto «legalSectionTitle»: «Privacidad y documentos legales».
  legalSectionTitle: 'Privacidad y documentos legales',
  // Esta línea sirve para definir el texto «legalSectionDescription»: «Consulta los documentos que aceptaste y administra».
  legalSectionDescription: 'Consulta los documentos que aceptaste y administra tus preferencias.',

  // Esta línea sirve para abrir el grupo de textos «consentLabels».
  consentLabels: {
    // Esta línea sirve para definir el texto del consentimiento «terms» en una sola línea.
    terms: { before: 'He leído y acepto los ', link: 'Términos y Condiciones', after: '.', document: 'terms' },
    // Esta línea sirve para abrir el consentimiento «privacy».
    privacy: {
      // Esta línea sirve para definir la parte «before» del consentimiento: «He leído la ',».
      before: 'He leído la ',
      // Esta línea sirve para definir la parte «link» del consentimiento: «Política de Privacidad',».
      link: 'Política de Privacidad',
      // Esta línea sirve para definir la parte «after» del consentimiento: « y autorizo el tratamiento de mis datos ».
      after: ' y autorizo el tratamiento de mis datos personales conforme a ella.',
      // Esta línea sirve para definir la parte «document» del consentimiento: «privacy',».
      document: 'privacy',
    },
    // Esta línea sirve para abrir el consentimiento «health_data».
    health_data: {
      // Esta línea sirve para definir el texto previo al enlace (valor en la línea siguiente).
      before:
        // Esta línea sirve para incluir el texto: «Autorizo el tratamiento de mis datos de salud y co…».
        'Autorizo el tratamiento de mis datos de salud y condición física (peso, medidas, sueño, energía y alimentación) para personalizar mi entrenamiento, según la ',
      // Esta línea sirve para definir la parte «link» del consentimiento: «Política de Privacidad',».
      link: 'Política de Privacidad',
      // Esta línea sirve para definir la parte «after» del consentimiento: «.',».
      after: '.',
      // Esta línea sirve para definir la parte «document» del consentimiento: «privacy',».
      document: 'privacy',
    },
  },
  // Esta línea sirve para abrir el grupo de textos «consentRequiredErrors».
  consentRequiredErrors: {
    // Esta línea sirve para definir el texto «terms»: «Debes aceptar los Términos y Condiciones.',».
    terms: 'Debes aceptar los Términos y Condiciones.',
    // Esta línea sirve para definir el texto «privacy»: «Debes aceptar la Política de Privacidad.',».
    privacy: 'Debes aceptar la Política de Privacidad.',
    // Esta línea sirve para definir el texto «health_data»: «Debes autorizar el tratamiento de tus datos de sal».
    health_data: 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
  },
  // Esta línea sirve para definir el texto «opensInNewTab»: «(se abre en una pestaña nueva)».
  opensInNewTab: '(se abre en una pestaña nueva)',

  // Esta línea sirve para definir el texto «socialConsentTitle»: «Antes de crear tu cuenta».
  socialConsentTitle: 'Antes de crear tu cuenta',
  // Esta línea sirve para definir el texto «socialConsentDescription»: «Para crear tu cuenta de SanKen con Google necesita».
  socialConsentDescription: 'Para crear tu cuenta de SanKen con Google necesitamos que revises y aceptes lo siguiente:',
  // Esta línea sirve para definir el texto «socialConsentConfirm»: «Aceptar y crear cuenta».
  socialConsentConfirm: 'Aceptar y crear cuenta',
  // Esta línea sirve para definir el texto «cancel»: «Cancelar».
  cancel: 'Cancelar',

  // Esta línea sirve para definir el texto «reacceptTitle»: «Actualizamos nuestros documentos».
  reacceptTitle: 'Actualizamos nuestros documentos',
  // Esta línea sirve para definir el texto «reacceptDescription»: «Para seguir usando SanKen revisa y acepta la versi».
  reacceptDescription: 'Para seguir usando SanKen revisa y acepta la versión vigente de estos documentos.',
  // Esta línea sirve para definir la función que genera el texto «reacceptNewDocument»: «Versión ${version}`,…».
  reacceptNewDocument: (version) => `Versión ${version}`,
  // Esta línea sirve para definir la función que genera el texto «reacceptUpdatedDocument»: «Aceptaste la versión ${from} · vigente: …».
  reacceptUpdatedDocument: (from, to) => `Aceptaste la versión ${from} · vigente: ${to}`,
  // Esta línea sirve para definir el texto «reacceptConfirm»: «Aceptar y continuar».
  reacceptConfirm: 'Aceptar y continuar',
  // Esta línea sirve para definir el texto «reacceptLogout»: «Cerrar sesión».
  reacceptLogout: 'Cerrar sesión',
  // Esta línea sirve para definir el texto «reacceptError»: «No se pudo registrar tu aceptación. Inténtalo de n».
  reacceptError: 'No se pudo registrar tu aceptación. Inténtalo de nuevo.',

  // Esta línea sirve para definir el texto «cookieBannerTitle»: «Usamos cookies».
  cookieBannerTitle: 'Usamos cookies',
  // Esta línea sirve para definir el texto «cookieBannerBody» (valor en la línea siguiente).
  cookieBannerBody:
    // Esta línea sirve para incluir el texto: «Usamos cookies necesarias para que SanKen funcione…».
    'Usamos cookies necesarias para que SanKen funcione (sesión, seguridad y carrito). Con tu permiso, también guardamos preferencias como el modo claro u oscuro. No usamos cookies de analítica ni de publicidad.',
  // Esta línea sirve para definir el texto «cookieBannerMoreInfo»: «Más información en la Política de Cookies».
  cookieBannerMoreInfo: 'Más información en la Política de Cookies',
  // Esta línea sirve para definir el texto «cookieConfigure»: «Configurar».
  cookieConfigure: 'Configurar',
  // Esta línea sirve para definir el texto «cookieRejectOptional»: «Rechazar opcionales».
  cookieRejectOptional: 'Rechazar opcionales',
  // Esta línea sirve para definir el texto «cookieAcceptAll»: «Aceptar todas».
  cookieAcceptAll: 'Aceptar todas',
  // Esta línea sirve para definir el texto «cookieSettingsTitle»: «Configuración de cookies».
  cookieSettingsTitle: 'Configuración de cookies',
  // Esta línea sirve para definir el texto «cookieSettingsDescription»: «Elige qué cookies opcionales permites en este nave».
  cookieSettingsDescription: 'Elige qué cookies opcionales permites en este navegador. Puedes cambiarlo cuando quieras.',
  // Esta línea sirve para definir el texto «cookieNecessaryLabel»: «Necesarias».
  cookieNecessaryLabel: 'Necesarias',
  // Esta línea sirve para definir el texto «cookieNecessaryDescription»: «Inicio de sesión, seguridad de los formularios, ca».
  cookieNecessaryDescription: 'Inicio de sesión, seguridad de los formularios, carrito y tu elección sobre cookies.',
  // Esta línea sirve para definir el texto «cookieAlwaysActive»: «Siempre activas».
  cookieAlwaysActive: 'Siempre activas',
  // Esta línea sirve para definir el texto «cookiePreferencesLabel»: «Preferencias».
  cookiePreferencesLabel: 'Preferencias',
  // Esta línea sirve para definir el texto «cookiePreferencesDescription»: «Recuerdan el modo claro/oscuro, los tutoriales que».
  cookiePreferencesDescription: 'Recuerdan el modo claro/oscuro, los tutoriales que ya viste y el idioma de los documentos legales.',
  // Esta línea sirve para definir el texto «cookieNoTrackingNote»: «SanKen no usa cookies analíticas ni de marketing, ».
  cookieNoTrackingNote: 'SanKen no usa cookies analíticas ni de marketing, por eso no aparecen en esta lista.',
  // Esta línea sirve para definir el texto «cookieSave»: «Guardar preferencias».
  cookieSave: 'Guardar preferencias',
  // Esta línea sirve para definir la función que genera el texto «cookieCurrentChoice» (cuerpo en la línea siguiente).
  cookieCurrentChoice: (preferences, date) =>
    // Esta línea sirve para incluir el texto: «Tu elección actual (${date}): ${preferences ? 'pre…».
    `Tu elección actual (${date}): ${preferences ? 'preferencias permitidas' : 'solo cookies necesarias'}.`,

  // Esta línea sirve para definir el texto «deleteAccountTitle»: «Eliminar mi cuenta».
  deleteAccountTitle: 'Eliminar mi cuenta',
  // Esta línea sirve para definir el texto «deleteAccountDescription» (valor en la línea siguiente).
  deleteAccountDescription:
    // Esta línea sirve para incluir el texto: «Se eliminan de forma permanente tu cuenta y tus da…».
    'Se eliminan de forma permanente tu cuenta y tus datos: perfil, entrenamientos, medidas, nutrición, récords, mensajes, pedidos, fotos, videos y consentimientos. No se puede deshacer.',
  // Esta línea sirve para definir el texto «deleteAccountOpen»: «Eliminar mi cuenta».
  deleteAccountOpen: 'Eliminar mi cuenta',
  // Esta línea sirve para definir el texto «deleteAccountConfirmLabel»: «Escribe ELIMINAR para confirmar».
  deleteAccountConfirmLabel: 'Escribe ELIMINAR para confirmar',
  // Esta línea sirve para definir el texto «deleteAccountPasswordLabel»: «Tu contraseña actual».
  deleteAccountPasswordLabel: 'Tu contraseña actual',
  // Esta línea sirve para definir el texto «deleteAccountSubmit»: «Eliminar definitivamente».
  deleteAccountSubmit: 'Eliminar definitivamente',
  // Esta línea sirve para definir el texto «deleteAccountError»: «No se pudo eliminar la cuenta. Inténtalo de nuevo.».
  deleteAccountError: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.',
  // Esta línea sirve para definir el texto «deleteAccountAdminNote»: «Una cuenta de Super Admin no se puede eliminar des».
  deleteAccountAdminNote: 'Una cuenta de Super Admin no se puede eliminar desde la app: pídeselo a otro Super Admin.',
  // Esta línea sirve para definir el texto «deleteAccountFromReaccept»: «No acepto: eliminar mi cuenta».
  deleteAccountFromReaccept: 'No acepto: eliminar mi cuenta',
};

// Esta línea sirve para declarar los textos de la interfaz legal en el idioma «en».
const en: LegalStrings = {
  // Esta línea sirve para abrir el grupo de textos «documentNames».
  documentNames: {
    // Esta línea sirve para definir el texto «terms»: «Terms and Conditions',».
    terms: 'Terms and Conditions',
    // Esta línea sirve para definir el texto «privacy»: «Privacy Policy',».
    privacy: 'Privacy Policy',
    // Esta línea sirve para definir el texto «cookies»: «Cookie Policy',».
    cookies: 'Cookie Policy',
  },
  // Esta línea sirve para definir los textos cortos «shortNames» en una sola línea.
  shortNames: { terms: 'Terms', privacy: 'Privacy', cookies: 'Cookies' },
  // Esta línea sirve para definir la función que genera el texto «versionLine»: «Version ${version} · Updated ${date}`,…».
  versionLine: (version, date) => `Version ${version} · Updated ${date}`,
  // Esta línea sirve para definir la función que genera el texto «acceptedVersionLine»: «You accepted version ${version} on ${dat…».
  acceptedVersionLine: (version, date) => `You accepted version ${version} on ${date}`,
  // Esta línea sirve para definir el texto «draftNotice» (valor en la línea siguiente).
  draftNotice:
    // Esta línea sirve para incluir el texto: «Draft pending legal review. The content reflects h…».
    'Draft pending legal review. The content reflects how the app currently works, but it has not yet been approved by the SanKen owner or by a legal professional.',
  // Esta línea sirve para definir el texto «translationNotice» (valor en la línea siguiente).
  translationNotice:
    // Esta línea sirve para incluir el texto: «This English translation has not been legally revi…».
    'This English translation has not been legally reviewed. The Spanish version is the reference text.',
  // Esta línea sirve para definir el texto «pendingFieldsNotice»: «Items marked [Pending] must be completed by the Sa».
  pendingFieldsNotice: 'Items marked [Pending] must be completed by the SanKen owner.',
  // Esta línea sirve para definir el texto «tableOfContents»: «Contents».
  tableOfContents: 'Contents',
  // Esta línea sirve para definir el texto «languageLabel»: «Document language».
  languageLabel: 'Document language',
  // Esta línea sirve para definir los textos cortos «languageNames» en una sola línea.
  languageNames: { es: 'Español', en: 'English' },
  // Esta línea sirve para definir el texto «backToApp»: «Back».
  backToApp: 'Back',
  // Esta línea sirve para definir el texto «legalSectionTitle»: «Privacy and legal documents».
  legalSectionTitle: 'Privacy and legal documents',
  // Esta línea sirve para definir el texto «legalSectionDescription»: «Review the documents you accepted and manage your ».
  legalSectionDescription: 'Review the documents you accepted and manage your preferences.',

  // Esta línea sirve para abrir el grupo de textos «consentLabels».
  consentLabels: {
    // Esta línea sirve para definir el texto del consentimiento «terms» en una sola línea.
    terms: { before: 'I have read and accept the ', link: 'Terms and Conditions', after: '.', document: 'terms' },
    // Esta línea sirve para abrir el consentimiento «privacy».
    privacy: {
      // Esta línea sirve para definir la parte «before» del consentimiento: «I have read the ',».
      before: 'I have read the ',
      // Esta línea sirve para definir la parte «link» del consentimiento: «Privacy Policy',».
      link: 'Privacy Policy',
      // Esta línea sirve para definir la parte «after» del consentimiento: « and authorize the processing of my pers».
      after: ' and authorize the processing of my personal data under it.',
      // Esta línea sirve para definir la parte «document» del consentimiento: «privacy',».
      document: 'privacy',
    },
    // Esta línea sirve para abrir el consentimiento «health_data».
    health_data: {
      // Esta línea sirve para definir el texto previo al enlace (valor en la línea siguiente).
      before:
        // Esta línea sirve para incluir el texto: «I authorize the processing of my health and fitnes…».
        'I authorize the processing of my health and fitness data (weight, measurements, sleep, energy and diet) to personalize my training, as described in the ',
      // Esta línea sirve para definir la parte «link» del consentimiento: «Privacy Policy',».
      link: 'Privacy Policy',
      // Esta línea sirve para definir la parte «after» del consentimiento: «.',».
      after: '.',
      // Esta línea sirve para definir la parte «document» del consentimiento: «privacy',».
      document: 'privacy',
    },
  },
  // Esta línea sirve para abrir el grupo de textos «consentRequiredErrors».
  consentRequiredErrors: {
    // Esta línea sirve para definir el texto «terms»: «You must accept the Terms and Conditions.',».
    terms: 'You must accept the Terms and Conditions.',
    // Esta línea sirve para definir el texto «privacy»: «You must accept the Privacy Policy.',».
    privacy: 'You must accept the Privacy Policy.',
    // Esta línea sirve para definir el texto «health_data»: «You must authorize the processing of your health a».
    health_data: 'You must authorize the processing of your health and fitness data.',
  },
  // Esta línea sirve para definir el texto «opensInNewTab»: «(opens in a new tab)».
  opensInNewTab: '(opens in a new tab)',

  // Esta línea sirve para definir el texto «socialConsentTitle»: «Before creating your account».
  socialConsentTitle: 'Before creating your account',
  // Esta línea sirve para definir el texto «socialConsentDescription»: «To create your SanKen account with Google, please ».
  socialConsentDescription: 'To create your SanKen account with Google, please review and accept the following:',
  // Esta línea sirve para definir el texto «socialConsentConfirm»: «Accept and create account».
  socialConsentConfirm: 'Accept and create account',
  // Esta línea sirve para definir el texto «cancel»: «Cancel».
  cancel: 'Cancel',

  // Esta línea sirve para definir el texto «reacceptTitle»: «We updated our documents».
  reacceptTitle: 'We updated our documents',
  // Esta línea sirve para definir el texto «reacceptDescription»: «To keep using SanKen, please review and accept the».
  reacceptDescription: 'To keep using SanKen, please review and accept the current version of these documents.',
  // Esta línea sirve para definir la función que genera el texto «reacceptNewDocument»: «Version ${version}`,…».
  reacceptNewDocument: (version) => `Version ${version}`,
  // Esta línea sirve para definir la función que genera el texto «reacceptUpdatedDocument»: «You accepted version ${from} · current: …».
  reacceptUpdatedDocument: (from, to) => `You accepted version ${from} · current: ${to}`,
  // Esta línea sirve para definir el texto «reacceptConfirm»: «Accept and continue».
  reacceptConfirm: 'Accept and continue',
  // Esta línea sirve para definir el texto «reacceptLogout»: «Sign out».
  reacceptLogout: 'Sign out',
  // Esta línea sirve para definir el texto «reacceptError»: «We could not record your acceptance. Please try ag».
  reacceptError: 'We could not record your acceptance. Please try again.',

  // Esta línea sirve para definir el texto «cookieBannerTitle»: «We use cookies».
  cookieBannerTitle: 'We use cookies',
  // Esta línea sirve para definir el texto «cookieBannerBody» (valor en la línea siguiente).
  cookieBannerBody:
    // Esta línea sirve para incluir el texto: «We use necessary cookies so SanKen works (session,…».
    'We use necessary cookies so SanKen works (session, security and cart). With your permission, we also store preferences such as light or dark mode. We do not use analytics or advertising cookies.',
  // Esta línea sirve para definir el texto «cookieBannerMoreInfo»: «More information in the Cookie Policy».
  cookieBannerMoreInfo: 'More information in the Cookie Policy',
  // Esta línea sirve para definir el texto «cookieConfigure»: «Settings».
  cookieConfigure: 'Settings',
  // Esta línea sirve para definir el texto «cookieRejectOptional»: «Reject optional».
  cookieRejectOptional: 'Reject optional',
  // Esta línea sirve para definir el texto «cookieAcceptAll»: «Accept all».
  cookieAcceptAll: 'Accept all',
  // Esta línea sirve para definir el texto «cookieSettingsTitle»: «Cookie settings».
  cookieSettingsTitle: 'Cookie settings',
  // Esta línea sirve para definir el texto «cookieSettingsDescription»: «Choose which optional cookies you allow in this br».
  cookieSettingsDescription: 'Choose which optional cookies you allow in this browser. You can change this at any time.',
  // Esta línea sirve para definir el texto «cookieNecessaryLabel»: «Necessary».
  cookieNecessaryLabel: 'Necessary',
  // Esta línea sirve para definir el texto «cookieNecessaryDescription»: «Sign-in, form security, cart and your cookie choic».
  cookieNecessaryDescription: 'Sign-in, form security, cart and your cookie choice.',
  // Esta línea sirve para definir el texto «cookieAlwaysActive»: «Always active».
  cookieAlwaysActive: 'Always active',
  // Esta línea sirve para definir el texto «cookiePreferencesLabel»: «Preferences».
  cookiePreferencesLabel: 'Preferences',
  // Esta línea sirve para definir el texto «cookiePreferencesDescription»: «Remember light/dark mode, the tutorials you have s».
  cookiePreferencesDescription: 'Remember light/dark mode, the tutorials you have seen and the language of the legal documents.',
  // Esta línea sirve para definir el texto «cookieNoTrackingNote»: «SanKen does not use analytics or marketing cookies».
  cookieNoTrackingNote: 'SanKen does not use analytics or marketing cookies, so they are not listed here.',
  // Esta línea sirve para definir el texto «cookieSave»: «Save preferences».
  cookieSave: 'Save preferences',
  // Esta línea sirve para definir la función que genera el texto «cookieCurrentChoice» (cuerpo en la línea siguiente).
  cookieCurrentChoice: (preferences, date) =>
    // Esta línea sirve para incluir el texto: «Your current choice (${date}): ${preferences ? 'pr…».
    `Your current choice (${date}): ${preferences ? 'preferences allowed' : 'necessary cookies only'}.`,

  // Esta línea sirve para definir el texto «deleteAccountTitle»: «Delete my account».
  deleteAccountTitle: 'Delete my account',
  // Esta línea sirve para definir el texto «deleteAccountDescription» (valor en la línea siguiente).
  deleteAccountDescription:
    // Esta línea sirve para incluir el texto: «Your account and your data are permanently deleted…».
    'Your account and your data are permanently deleted: profile, workouts, measurements, nutrition, records, messages, orders, photos, videos and consents. This cannot be undone.',
  // Esta línea sirve para definir el texto «deleteAccountOpen»: «Delete my account».
  deleteAccountOpen: 'Delete my account',
  // Esta línea sirve para definir el texto «deleteAccountConfirmLabel»: «Type ELIMINAR to confirm».
  deleteAccountConfirmLabel: 'Type ELIMINAR to confirm',
  // Esta línea sirve para definir el texto «deleteAccountPasswordLabel»: «Your current password».
  deleteAccountPasswordLabel: 'Your current password',
  // Esta línea sirve para definir el texto «deleteAccountSubmit»: «Delete permanently».
  deleteAccountSubmit: 'Delete permanently',
  // Esta línea sirve para definir el texto «deleteAccountError»: «We could not delete the account. Please try again.».
  deleteAccountError: 'We could not delete the account. Please try again.',
  // Esta línea sirve para definir el texto «deleteAccountAdminNote»: «A Super Admin account cannot be deleted from the a».
  deleteAccountAdminNote: 'A Super Admin account cannot be deleted from the app: ask another Super Admin.',
  // Esta línea sirve para definir el texto «deleteAccountFromReaccept»: «I do not accept: delete my account».
  deleteAccountFromReaccept: 'I do not accept: delete my account',
};

// Esta línea sirve para exportar los textos legales indexados por idioma.
export const LEGAL_STRINGS: Record<LegalLocale, LegalStrings> = { es, en };

/** Idioma por defecto de la interfaz legal — el de la app. */
// Esta línea sirve para definir el idioma legal por defecto.
export const DEFAULT_LEGAL_LOCALE: LegalLocale = 'es';

/** Formatea una fecha YYYY-MM-DD sin depender de la zona horaria del dispositivo. */
// Esta línea sirve para declarar la función que da formato a una fecha legal según el idioma.
export function formatLegalDate(isoDate: string, locale: LegalLocale): string {
  // Esta línea sirve para separar año, mes y día de la fecha ISO.
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  // Esta línea sirve para crear la fecha en UTC para evitar desfases de zona horaria.
  const date = new Date(Date.UTC(year, month - 1, day));
  // Esta línea sirve para devolver la fecha formateada con el locale de Colombia o de Estados Unidos.
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CO' : 'en-US', {
    // Esta línea sirve para mostrar el día como número.
    day: 'numeric',
    // Esta línea sirve para mostrar el mes con su nombre completo.
    month: 'long',
    // Esta línea sirve para mostrar el año completo.
    year: 'numeric',
    // Esta línea sirve para formatear siempre en UTC.
    timeZone: 'UTC',
  // Esta línea sirve para aplicar el formato a la fecha.
  }).format(date);
}
