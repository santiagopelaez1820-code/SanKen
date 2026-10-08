// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «MyTrainer» desde «@sanken/core».
import type { MyTrainer } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useMyTrainerStore» desde «./my-trainer-store».
import { useMyTrainerStore } from './my-trainer-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{ get: jest.fn() }».
  api: { get: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «trainer» de tipo «MyTrainer».
const trainer: MyTrainer = {
  // Esta línea sirve para declarar la propiedad «trainer_client_id» con el valor o tipo «3».
  trainer_client_id: 3,
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «'active'».
  status: 'active',
  // Esta línea sirve para definir el estilo «trainer» con «id: 5, name: 'Coach Ana', email: 'ana@sanken.app' …».
  trainer: { id: 5, name: 'Coach Ana', email: 'ana@sanken.app' } as any,
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useMyTrainerStore.setState({ trainers: [], isLoading: false, error: null });
});

// Esta línea sirve para agrupar las pruebas de «load».
describe('load', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched trainer relationships».
  it('stores the fetched trainer relationships', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([trainer]);

    // Esta línea sirve para esperar el resultado de «useMyTrainerStore.getState».
    await useMyTrainerStore.getState().load();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/me/trainers');
    // Esta línea sirve para verificar que «useMyTrainerStore.getState(» cumple «trainers».
    expect(useMyTrainerStore.getState().trainers).toEqual([trainer]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para esperar el resultado de «useMyTrainerStore.getState».
    await useMyTrainerStore.getState().load();

    // Esta línea sirve para verificar que «useMyTrainerStore.getState(» cumple «error».
    expect(useMyTrainerStore.getState().error).toBe('network down');
  });
});
