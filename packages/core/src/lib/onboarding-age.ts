/**
 * Rango de edad admitido en el onboarding (inclusive en ambos extremos).
 * Debe coincidir con OnboardingRequest::MIN_AGE / MAX_AGE en la API — el
 * backend es la autoridad final; esto es solo para dar feedback inmediato
 * y no dejar avanzar el wizard con un valor que igual se rechazaría.
 */
export const ONBOARDING_MIN_AGE = 15;
export const ONBOARDING_MAX_AGE = 70;

export const ONBOARDING_AGE_MESSAGES = {
  required: 'Ingresa tu edad.',
  notInteger: 'La edad debe ser un número entero.',
  outOfRange: `La edad debe estar entre ${ONBOARDING_MIN_AGE} y ${ONBOARDING_MAX_AGE} años.`,
} as const;

export type OnboardingAgeValidation = { valid: true; age: number } | { valid: false; error: string };

/**
 * Valida lo que el usuario escribió en el campo edad: vacío, texto no
 * numérico, decimales, negativos y valores fuera de 15–70 son inválidos.
 */
export function validateOnboardingAge(input: string): OnboardingAgeValidation {
  const trimmed = input.trim();
  if (trimmed === '') return { valid: false, error: ONBOARDING_AGE_MESSAGES.required };
  if (!/^-?\d+$/.test(trimmed)) return { valid: false, error: ONBOARDING_AGE_MESSAGES.notInteger };

  const age = Number(trimmed);
  if (age < ONBOARDING_MIN_AGE || age > ONBOARDING_MAX_AGE) {
    return { valid: false, error: ONBOARDING_AGE_MESSAGES.outOfRange };
  }
  return { valid: true, age };
}
