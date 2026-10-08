// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';
// Esta línea sirve para importar «ONBOARDING_AGE_MESSAGES, validateOnboardingAge» desde «@sanken/core».
import { ONBOARDING_AGE_MESSAGES, validateOnboardingAge } from '@sanken/core';

// Esta línea sirve para agrupar las pruebas de «validateOnboardingAge (regla 15–70 del onboarding)».
describe('validateOnboardingAge (regla 15–70 del onboarding)', () => {
  // Esta línea sirve para probar cada edad válida.
  it.each(['15', '70', '30', ' 42 '])('acepta %p', (input) => {
    // Esta línea sirve para verificar que «validateOnboardingAge(input)» cumple «toEqual».
    expect(validateOnboardingAge(input)).toEqual({ valid: true, age: Number(input.trim()) });
  });

  // Esta línea sirve para probar cada edad fuera de rango.
  it.each(['14', '71', '0', '-5', '-20', '150'])('rechaza %p por estar fuera de rango', (input) => {
    // Esta línea sirve para verificar que «validateOnboardingAge(input)» cumple «toEqual».
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.outOfRange });
  });

  // Esta línea sirve para declarar la prueba que verifica que «el mensaje de rango es claro».
  it('el mensaje de rango es claro', () => {
    // Esta línea sirve para verificar que «ONBOARDING_AGE_MESSAGES.outOfRange» cumple «toBe».
    expect(ONBOARDING_AGE_MESSAGES.outOfRange).toBe('La edad debe estar entre 15 y 70 años.');
  });

  // Esta línea sirve para probar los textos vacíos.
  it.each(['', '   '])('rechaza vacío %p', (input) => {
    // Esta línea sirve para verificar que «validateOnboardingAge(input)» cumple «toEqual».
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.required });
  });

  // Esta línea sirve para probar los textos no numéricos.
  it.each(['abc', '2a', '25.5', '25,5', '1e2'])('rechaza texto no numérico %p', (input) => {
    // Esta línea sirve para verificar que «validateOnboardingAge(input)» cumple «toEqual».
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.notInteger });
  });
});
