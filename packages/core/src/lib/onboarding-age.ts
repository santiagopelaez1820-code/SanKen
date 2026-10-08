/**
 * Rango de edad admitido en el onboarding (inclusive en ambos extremos).
 * Debe coincidir con OnboardingRequest::MIN_AGE / MAX_AGE en la API — el
 * backend es la autoridad final; esto es solo para dar feedback inmediato
 * y no dejar avanzar el wizard con un valor que igual se rechazaría.
 */
// Esta línea sirve para definir la edad mínima permitida en el onboarding.
export const ONBOARDING_MIN_AGE = 15;
// Esta línea sirve para definir la edad máxima permitida en el onboarding.
export const ONBOARDING_MAX_AGE = 70;

// Esta línea sirve para declarar los mensajes de error de la edad.
export const ONBOARDING_AGE_MESSAGES = {
  // Esta línea sirve para definir el mensaje cuando la edad está vacía.
  required: 'Ingresa tu edad.',
  // Esta línea sirve para definir el mensaje cuando no es un entero.
  notInteger: 'La edad debe ser un número entero.',
  // Esta línea sirve para definir el mensaje cuando está fuera del rango permitido.
  outOfRange: `La edad debe estar entre ${ONBOARDING_MIN_AGE} y ${ONBOARDING_MAX_AGE} años.`,
// Esta línea sirve para marcar el objeto como inmutable.
} as const;

// Esta línea sirve para declarar el resultado de validar la edad.
export type OnboardingAgeValidation = { valid: true; age: number } | { valid: false; error: string };

/**
 * Valida lo que el usuario escribió en el campo edad: vacío, texto no
 * numérico, decimales, negativos y valores fuera de 15–70 son inválidos.
 */
// Esta línea sirve para declarar la función que valida la edad escrita.
export function validateOnboardingAge(input: string): OnboardingAgeValidation {
  // Esta línea sirve para quitar los espacios sobrantes.
  const trimmed = input.trim();
  // Esta línea sirve para devolver error si está vacía.
  if (trimmed === '') return { valid: false, error: ONBOARDING_AGE_MESSAGES.required };
  // Esta línea sirve para devolver error si no es un número entero.
  if (!/^-?\d+$/.test(trimmed)) return { valid: false, error: ONBOARDING_AGE_MESSAGES.notInteger };

  // Esta línea sirve para convertir el texto a número.
  const age = Number(trimmed);
  // Esta línea sirve para revisar si está fuera del rango.
  if (age < ONBOARDING_MIN_AGE || age > ONBOARDING_MAX_AGE) {
    // Esta línea sirve para devolver error de rango.
    return { valid: false, error: ONBOARDING_AGE_MESSAGES.outOfRange };
  }
  // Esta línea sirve para devolver la edad válida.
  return { valid: true, age };
}
