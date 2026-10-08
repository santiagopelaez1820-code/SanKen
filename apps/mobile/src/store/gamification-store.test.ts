// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «GamificationSummary» desde «@sanken/core».
import type { GamificationSummary } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useGamificationStore» desde «./gamification-store».
import { useGamificationStore } from './gamification-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{ get: jest.fn() }».
  api: { get: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «summary» de tipo «GamificationSummary».
const summary: GamificationSummary = {
  // Esta línea sirve para declarar la propiedad «total_xp» con el valor o tipo «150».
  total_xp: 150,
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «2».
  level: 2,
  // Esta línea sirve para declarar la propiedad «xp_for_current_level» con el valor o tipo «100».
  xp_for_current_level: 100,
  // Esta línea sirve para declarar la propiedad «xp_for_next_level» con el valor o tipo «400».
  xp_for_next_level: 400,
  // Esta línea sirve para declarar la propiedad «progress_pct» con el valor o tipo «0.1667».
  progress_pct: 0.1667,
  // Esta línea sirve para declarar la propiedad «unlocked_achievements» con el valor o tipo «[]».
  unlocked_achievements: [],
  // Esta línea sirve para declarar la propiedad «locked_achievements» con el valor o tipo «[]».
  locked_achievements: [],
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useGamificationStore.setState({ summary: null, isLoading: false, error: null });
});

// Esta línea sirve para agrupar las pruebas de «loadSummary».
describe('loadSummary', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched summary».
  it('stores the fetched summary', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(summary);

    // Esta línea sirve para esperar el resultado de «useGamificationStore.getState».
    await useGamificationStore.getState().loadSummary();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useGamificationStore.getState();
    // Esta línea sirve para verificar que «state.summary» cumple «toEqual».
    expect(state.summary).toEqual(summary);
    // Esta línea sirve para verificar que «state.isLoading» cumple «toBe».
    expect(state.isLoading).toBe(false);
    // Esta línea sirve para verificar que «state.error» cumple «toBeNull».
    expect(state.error).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para esperar el resultado de «useGamificationStore.getState».
    await useGamificationStore.getState().loadSummary();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useGamificationStore.getState();
    // Esta línea sirve para verificar que «state.error» cumple «toBe».
    expect(state.error).toBe('network down');
    // Esta línea sirve para verificar que «state.isLoading» cumple «toBe».
    expect(state.isLoading).toBe(false);
    // Esta línea sirve para verificar que «state.summary» cumple «toBeNull».
    expect(state.summary).toBeNull();
  });
});
