import { describe, expect, it } from '@jest/globals';
import { ONBOARDING_AGE_MESSAGES, validateOnboardingAge } from '@sanken/core';

describe('validateOnboardingAge (regla 15–70 del onboarding)', () => {
  it.each(['15', '70', '30', ' 42 '])('acepta %p', (input) => {
    expect(validateOnboardingAge(input)).toEqual({ valid: true, age: Number(input.trim()) });
  });

  it.each(['14', '71', '0', '-5', '-20', '150'])('rechaza %p por estar fuera de rango', (input) => {
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.outOfRange });
  });

  it('el mensaje de rango es claro', () => {
    expect(ONBOARDING_AGE_MESSAGES.outOfRange).toBe('La edad debe estar entre 15 y 70 años.');
  });

  it.each(['', '   '])('rechaza vacío %p', (input) => {
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.required });
  });

  it.each(['abc', '2a', '25.5', '25,5', '1e2'])('rechaza texto no numérico %p', (input) => {
    expect(validateOnboardingAge(input)).toEqual({ valid: false, error: ONBOARDING_AGE_MESSAGES.notInteger });
  });
});
