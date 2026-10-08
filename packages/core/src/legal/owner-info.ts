// Esta línea sirve para importar el tipo de idioma legal.
import type { LegalLocale } from './types';

// Esta línea sirve para declarar los campos de datos del responsable que los documentos pueden usar.
export type LegalOwnerField =
  // Esta línea sirve para permitir el campo del nombre comercial.
  | 'brandName'
  // Esta línea sirve para permitir el campo del nombre legal.
  | 'legalName'
  // Esta línea sirve para permitir el campo de la identificación.
  | 'taxId'
  // Esta línea sirve para permitir el campo del domicilio.
  | 'address'
  // Esta línea sirve para permitir el campo del país.
  | 'country'
  // Esta línea sirve para permitir el campo de la jurisdicción.
  | 'jurisdiction'
  // Esta línea sirve para permitir el campo del correo de privacidad.
  | 'privacyEmail'
  // Esta línea sirve para permitir el campo del correo de soporte.
  | 'supportEmail'
  // Esta línea sirve para permitir el campo del proveedor de correo.
  | 'emailProvider'
  // Esta línea sirve para permitir el campo de la autoridad de control.
  | 'supervisoryAuthority'
  // Esta línea sirve para permitir el campo del plazo de conservación.
  | 'retentionPeriod'
  // Esta línea sirve para permitir el campo de la edad mínima.
  | 'minimumAge';

/** Un dato puede ser igual en ambos idiomas (string) o traducido. null = sin completar. */
// Esta línea sirve para declarar que un valor puede ser texto único, texto por idioma o nulo si falta.
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
// Esta línea sirve para declarar los datos reales del responsable de la plataforma.
export const LEGAL_OWNER_INFO: Record<LegalOwnerField, LegalOwnerValue> = {
  // Esta línea sirve para definir el nombre comercial.
  brandName: 'SanKen',
  // Esta línea sirve para definir el nombre legal del responsable.
  legalName: 'Kenneth Martinez',
  // Esta línea sirve para definir la identificación del responsable por idioma.
  taxId: {
    // Esta línea sirve para escribir la identificación en español.
    es: 'cédula de ciudadanía n.º 1045764307',
    // Esta línea sirve para escribir la identificación en inglés.
    en: 'Colombian citizenship ID no. 1045764307',
  },
  // Esta línea sirve para definir el domicilio del responsable.
  address: 'Marinilla, Antioquia',
  // Esta línea sirve para definir el país del responsable.
  country: 'Colombia',
  // Esta línea sirve para definir la jurisdicción aplicable.
  jurisdiction: 'Colombia',
  // Esta línea sirve para definir el correo para solicitudes de privacidad.
  privacyEmail: 'kendejesus205@gmail.com',
  // Esta línea sirve para definir el correo de contacto general.
  supportEmail: 'kendejesus205@gmail.com',
  /** Confirmado en la configuración real del backend (MAIL_HOST=smtp.gmail.com). */
  // Esta línea sirve para definir el proveedor de envío de correos.
  emailProvider: 'Google (Gmail)',
  // Esta línea sirve para definir la autoridad de protección de datos por idioma.
  supervisoryAuthority: {
    // Esta línea sirve para escribir la autoridad en español.
    es: 'la Superintendencia de Industria y Comercio (SIC) de Colombia',
    // Esta línea sirve para escribir la autoridad en inglés.
    en: 'the Superintendence of Industry and Commerce (SIC) of Colombia',
  },
  // Esta línea sirve para definir el plazo de conservación de datos por idioma.
  retentionPeriod: {
    // Esta línea sirve para escribir el plazo en español.
    es: 'tus datos se conservan mientras tu cuenta esté activa y se eliminan cuando eliminas tu cuenta',
    // Esta línea sirve para escribir el plazo en inglés.
    en: 'your data is kept while your account is active and is deleted when you delete your account',
  },
  /**
   * Mayoría de edad en Colombia. La app admite usuarios de 15 a 70 años
   * (OnboardingRequest::MIN_AGE/MAX_AGE): entre 15 y 17 se requiere la
   * autorización de madre, padre o representante legal (así lo dicen los
   * documentos).
   */
  // Esta línea sirve para definir la edad mínima por idioma.
  minimumAge: { es: '18 años', en: '18 years old' },
};

// Esta línea sirve para declarar las etiquetas legibles de cada campo, usadas cuando falta un dato.
const FIELD_LABELS: Record<LegalOwnerField, Record<LegalLocale, string>> = {
  // Esta línea sirve para definir la etiqueta del nombre comercial.
  brandName: { es: 'nombre comercial', en: 'trade name' },
  // Esta línea sirve para definir la etiqueta del nombre legal.
  legalName: { es: 'nombre legal del responsable del tratamiento', en: 'legal name of the data controller' },
  // Esta línea sirve para definir la etiqueta de la identificación.
  taxId: { es: 'identificación del responsable', en: 'controller ID' },
  // Esta línea sirve para definir la etiqueta del domicilio.
  address: { es: 'domicilio del responsable', en: 'controller address' },
  // Esta línea sirve para definir la etiqueta del país.
  country: { es: 'país del responsable', en: 'controller country' },
  // Esta línea sirve para definir la etiqueta de la jurisdicción.
  jurisdiction: { es: 'país/jurisdicción y ley aplicable', en: 'country/jurisdiction and governing law' },
  // Esta línea sirve para definir la etiqueta del correo de privacidad.
  privacyEmail: { es: 'correo para solicitudes de privacidad', en: 'email for privacy requests' },
  // Esta línea sirve para definir la etiqueta del correo de contacto.
  supportEmail: { es: 'correo de contacto general', en: 'general contact email' },
  // Esta línea sirve para definir la etiqueta del proveedor de correo.
  emailProvider: { es: 'proveedor de envío de correos', en: 'email delivery provider' },
  // Esta línea sirve para definir la etiqueta de la autoridad de control.
  supervisoryAuthority: { es: 'autoridad de protección de datos competente', en: 'competent data protection authority' },
  // Esta línea sirve para definir la etiqueta de los plazos de conservación.
  retentionPeriod: { es: 'plazos de conservación', en: 'retention periods' },
  // Esta línea sirve para definir la etiqueta de la edad mínima.
  minimumAge: { es: 'edad mínima legal para registrarse sin autorización de un adulto', en: 'minimum legal age to sign up without adult authorization' },
};

// Esta línea sirve para declarar un fragmento de texto legal ya resuelto.
export interface LegalTextSegment {
  // Esta línea sirve para guardar el texto del fragmento.
  text: string;
  /** true = dato del responsable todavía no completado (mostrar resaltado). */
  // Esta línea sirve para indicar si el fragmento es un dato pendiente de completar.
  pending: boolean;
}

// Esta línea sirve para declarar la función que obtiene el valor de un campo en un idioma.
function valueFor(value: LegalOwnerValue, locale: LegalLocale): string | null {
  // Esta línea sirve para devolver null si no hay valor.
  if (!value) return null;
  // Esta línea sirve para devolver el texto directo o el texto del idioma pedido.
  return typeof value === 'string' ? value : value[locale];
}

/**
 * Parte un texto con marcadores `{{campo}}` en segmentos, resolviendo cada
 * marcador contra LEGAL_OWNER_INFO en el idioma pedido. Un campo sin
 * completar se devuelve como segmento `pending` con la etiqueta
 * "[Pendiente: …]" — los componentes lo resaltan para que nadie lo confunda
 * con texto definitivo.
 */
// Esta línea sirve para declarar la función que reemplaza los marcadores {{campo}} por los datos reales.
export function resolveLegalText(
  // Esta línea sirve para recibir el texto con marcadores.
  text: string,
  // Esta línea sirve para recibir el idioma.
  locale: LegalLocale,
  // Esta línea sirve para recibir los datos del responsable, por defecto los reales.
  info: Record<LegalOwnerField, LegalOwnerValue> = LEGAL_OWNER_INFO,
// Esta línea sirve para devolver la lista de fragmentos resultantes.
): LegalTextSegment[] {
  // Esta línea sirve para crear la lista de fragmentos.
  const segments: LegalTextSegment[] = [];
  // Esta línea sirve para definir el patrón que detecta los marcadores {{campo}}.
  const pattern = /\{\{(\w+)\}\}/g;
  // Esta línea sirve para guardar la posición donde terminó el último marcador.
  let last = 0;
  // Esta línea sirve para declarar la variable de la coincidencia actual.
  let match: RegExpExecArray | null;

  // Esta línea sirve para recorrer cada marcador encontrado.
  while ((match = pattern.exec(text)) !== null) {
    // Esta línea sirve para agregar el texto normal que hay antes del marcador.
    if (match.index > last) segments.push({ text: text.slice(last, match.index), pending: false });
    // Esta línea sirve para obtener el nombre del campo del marcador.
    const field = match[1] as LegalOwnerField;
    // Esta línea sirve para obtener el valor del campo en el idioma.
    const value = valueFor(info[field], locale);
    // Esta línea sirve para revisar si el dato existe.
    if (value) {
      // Esta línea sirve para agregar el dato real al resultado.
      segments.push({ text: value, pending: false });
    // Esta línea sirve para tratar el caso de que el dato falte.
    } else {
      // Esta línea sirve para obtener la etiqueta legible del campo.
      const label = FIELD_LABELS[field]?.[locale] ?? field;
      // Esta línea sirve para agregar un aviso de dato pendiente en el idioma correspondiente.
      segments.push({ text: locale === 'es' ? `[Pendiente: ${label}]` : `[Pending: ${label}]`, pending: true });
    }
    // Esta línea sirve para recordar dónde terminó este marcador.
    last = pattern.lastIndex;
  }

  // Esta línea sirve para agregar el texto restante después del último marcador.
  if (last < text.length) segments.push({ text: text.slice(last), pending: false });
  // Esta línea sirve para devolver los fragmentos.
  return segments;
}

/** Datos del responsable que todavía faltan (checklist para el propietario). */
// Esta línea sirve para declarar la función que lista los campos del responsable que faltan.
export function missingOwnerFields(info: Record<LegalOwnerField, LegalOwnerValue> = LEGAL_OWNER_INFO): LegalOwnerField[] {
  // Esta línea sirve para devolver los campos cuyo valor está vacío.
  return (Object.keys(info) as LegalOwnerField[]).filter((field) => !info[field]);
}
