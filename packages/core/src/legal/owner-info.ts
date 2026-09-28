import type { LegalLocale } from './types';

export type LegalOwnerField =
  | 'brandName'
  | 'legalName'
  | 'taxId'
  | 'address'
  | 'country'
  | 'jurisdiction'
  | 'privacyEmail'
  | 'supportEmail'
  | 'emailProvider'
  | 'supervisoryAuthority'
  | 'retentionPeriod'
  | 'minimumAge';

/** Un dato puede ser igual en ambos idiomas (string) o traducido. null = sin completar. */
export type LegalOwnerValue = string | Record<LegalLocale, string> | null;

/**
 * Datos del responsable de SanKen que usan los documentos legales, provistos
 * por el propietario del proyecto el 2026-09-28. No agregar ni cambiar datos
 * sin confirmación del responsable: un campo en null se muestra como
 * "[Pendiente: …]" (ver resolveLegalText()), nunca se inventa.
 *
 * Todavía no hay dominio propio ni proveedor de hosting contratado: por eso
 * no hay campos para ellos y los documentos describen la infraestructura
 * real actual (servidor propio expuesto por túneles de ngrok y Cloudflare).
 * Cuando eso cambie, actualizar los documentos y subir su versión.
 */
export const LEGAL_OWNER_INFO: Record<LegalOwnerField, LegalOwnerValue> = {
  brandName: 'SanKen',
  legalName: 'Kenneth Martinez',
  taxId: {
    es: 'cédula de ciudadanía n.º 1045764307',
    en: 'Colombian citizenship ID no. 1045764307',
  },
  address: 'Marinilla, Antioquia',
  country: 'Colombia',
  jurisdiction: 'Colombia',
  privacyEmail: 'kendejesus205@gmail.com',
  supportEmail: 'kendejesus205@gmail.com',
  /** Confirmado en la configuración real del backend (MAIL_HOST=smtp.gmail.com). */
  emailProvider: 'Google (Gmail)',
  supervisoryAuthority: {
    es: 'la Superintendencia de Industria y Comercio (SIC) de Colombia',
    en: 'the Superintendence of Industry and Commerce (SIC) of Colombia',
  },
  retentionPeriod: {
    es: 'tus datos se conservan mientras tu cuenta esté activa y se eliminan cuando eliminas tu cuenta',
    en: 'your data is kept while your account is active and is deleted when you delete your account',
  },
  /**
   * Mayoría de edad en Colombia. La app admite registrarse desde los 13 años
   * (OnboardingRequest: 'age' min:13): entre 13 y 17 se requiere la
   * autorización de madre, padre o representante legal (así lo dicen los
   * documentos).
   */
  minimumAge: { es: '18 años', en: '18 years old' },
};

const FIELD_LABELS: Record<LegalOwnerField, Record<LegalLocale, string>> = {
  brandName: { es: 'nombre comercial', en: 'trade name' },
  legalName: { es: 'nombre legal del responsable del tratamiento', en: 'legal name of the data controller' },
  taxId: { es: 'identificación del responsable', en: 'controller ID' },
  address: { es: 'domicilio del responsable', en: 'controller address' },
  country: { es: 'país del responsable', en: 'controller country' },
  jurisdiction: { es: 'país/jurisdicción y ley aplicable', en: 'country/jurisdiction and governing law' },
  privacyEmail: { es: 'correo para solicitudes de privacidad', en: 'email for privacy requests' },
  supportEmail: { es: 'correo de contacto general', en: 'general contact email' },
  emailProvider: { es: 'proveedor de envío de correos', en: 'email delivery provider' },
  supervisoryAuthority: { es: 'autoridad de protección de datos competente', en: 'competent data protection authority' },
  retentionPeriod: { es: 'plazos de conservación', en: 'retention periods' },
  minimumAge: { es: 'edad mínima legal para registrarse sin autorización de un adulto', en: 'minimum legal age to sign up without adult authorization' },
};

export interface LegalTextSegment {
  text: string;
  /** true = dato del responsable todavía no completado (mostrar resaltado). */
  pending: boolean;
}

function valueFor(value: LegalOwnerValue, locale: LegalLocale): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value[locale];
}

/**
 * Parte un texto con marcadores `{{campo}}` en segmentos, resolviendo cada
 * marcador contra LEGAL_OWNER_INFO en el idioma pedido. Un campo sin
 * completar se devuelve como segmento `pending` con la etiqueta
 * "[Pendiente: …]" — los componentes lo resaltan para que nadie lo confunda
 * con texto definitivo.
 */
export function resolveLegalText(
  text: string,
  locale: LegalLocale,
  info: Record<LegalOwnerField, LegalOwnerValue> = LEGAL_OWNER_INFO,
): LegalTextSegment[] {
  const segments: LegalTextSegment[] = [];
  const pattern = /\{\{(\w+)\}\}/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), pending: false });
    const field = match[1] as LegalOwnerField;
    const value = valueFor(info[field], locale);
    if (value) {
      segments.push({ text: value, pending: false });
    } else {
      const label = FIELD_LABELS[field]?.[locale] ?? field;
      segments.push({ text: locale === 'es' ? `[Pendiente: ${label}]` : `[Pending: ${label}]`, pending: true });
    }
    last = pattern.lastIndex;
  }

  if (last < text.length) segments.push({ text: text.slice(last), pending: false });
  return segments;
}

/** Datos del responsable que todavía faltan (checklist para el propietario). */
export function missingOwnerFields(info: Record<LegalOwnerField, LegalOwnerValue> = LEGAL_OWNER_INFO): LegalOwnerField[] {
  return (Object.keys(info) as LegalOwnerField[]).filter((field) => !info[field]);
}
