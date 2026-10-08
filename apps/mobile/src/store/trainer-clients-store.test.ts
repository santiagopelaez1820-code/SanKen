// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «TrainerClient, User» desde «@sanken/core».
import type { TrainerClient, User } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useTrainerClientsStore» desde «./trainer-clients-store».
import { useTrainerClientsStore } from './trainer-clients-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «post: jest.fn(), get: jest.fn(), patch: jest.fn(),…».
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn(), getWithMeta: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «clientUser» de tipo «User».
const clientUser: User = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «2».
  id: 2,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Cliente'».
  name: 'Cliente',
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «'cliente@example.com'».
  email: 'cliente@example.com',
  // Esta línea sirve para declarar la propiedad «avatar_url» con el valor o tipo «null».
  avatar_url: null,
  // Esta línea sirve para declarar la propiedad «role» con el valor o tipo «'user'».
  role: 'user',
  // Esta línea sirve para declarar la propiedad «two_factor_enabled» con el valor o tipo «false».
  two_factor_enabled: false,
  // Esta línea sirve para declarar la propiedad «is_public_profile» con el valor o tipo «false».
  is_public_profile: false,
  // Esta línea sirve para declarar la propiedad «trainer_verified_at» con el valor o tipo «null».
  trainer_verified_at: null,
  // Esta línea sirve para declarar la propiedad «email_verified_at» con el valor o tipo «null».
  email_verified_at: null,
  // Esta línea sirve para declarar la propiedad «onboarding_completed» con el valor o tipo «true».
  onboarding_completed: true,
  // Esta línea sirve para declarar la propiedad «has_location» con el valor o tipo «true».
  has_location: true,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2024-01-01T00:00:00Z'».
  created_at: '2024-01-01T00:00:00Z',
};

// Esta línea sirve para declarar el dato de ejemplo «trainerClient» de tipo «TrainerClient».
const trainerClient: TrainerClient = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «'active'».
  status: 'active',
  // Esta línea sirve para declarar la propiedad «started_at» con el valor o tipo «'2024-01-01T00:00:00Z'».
  started_at: '2024-01-01T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «ended_at» con el valor o tipo «null».
  ended_at: null,
  // Esta línea sirve para declarar la propiedad «client» con el valor o tipo «clientUser».
  client: clientUser,
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useTrainerClientsStore.setState({
    // Esta línea sirve para declarar la propiedad «clients» con el valor o tipo «[]».
    clients: [],
    // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
    isLoading: false,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «selectedClient» con el valor o tipo «null».
    selectedClient: null,
    // Esta línea sirve para declarar la propiedad «activeRoutine» con el valor o tipo «null».
    activeRoutine: null,
    // Esta línea sirve para declarar la propiedad «isLoadingDetail» con el valor o tipo «false».
    isLoadingDetail: false,
    // Esta línea sirve para declarar la propiedad «detailError» con el valor o tipo «null».
    detailError: null,
    // Esta línea sirve para declarar la propiedad «routineForEdit» con el valor o tipo «null».
    routineForEdit: null,
    // Esta línea sirve para declarar la propiedad «isLoadingRoutine» con el valor o tipo «false».
    isLoadingRoutine: false,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
    isSubmitting: false,
    // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
    submitError: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «addClient».
describe('addClient', () => {
  // Esta línea sirve para declarar la prueba que verifica que «adds the client and reloads the list on success».
  it('adds the client and reloads the list on success', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([trainerClient]);

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «ok».
    const ok = await useTrainerClientsStore.getState().addClient('cliente@example.com');

    // Esta línea sirve para verificar que «ok» cumple «toBe».
    expect(ok).toBe(true);
    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/trainer/clients', { email: 'cliente@example.com' });
    // Esta línea sirve para verificar que «useTrainerClientsStore.getState(» cumple «clients».
    expect(useTrainerClientsStore.getState().clients).toEqual([trainerClient]);
    // Esta línea sirve para verificar que «useTrainerClientsStore.getState(» cumple «submitError».
    expect(useTrainerClientsStore.getState().submitError).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets submitError and returns false on failure, without touching client».
  it('sets submitError and returns false on failure, without touching clients', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('El cliente no existe.'));

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «ok».
    const ok = await useTrainerClientsStore.getState().addClient('nadie@example.com');

    // Esta línea sirve para verificar que «ok» cumple «toBe».
    expect(ok).toBe(false);
    // Esta línea sirve para verificar que «useTrainerClientsStore.getState(» cumple «submitError».
    expect(useTrainerClientsStore.getState().submitError).toBe('El cliente no existe.');
    // Esta línea sirve para verificar que «useTrainerClientsStore.getState(» cumple «clients».
    expect(useTrainerClientsStore.getState().clients).toEqual([]);
    // Esta línea sirve para verificar que «mockedApi.get» no cumple «toHaveBeenCalled».
    expect(mockedApi.get).not.toHaveBeenCalled();
  });
});
