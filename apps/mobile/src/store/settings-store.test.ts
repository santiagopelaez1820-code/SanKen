// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useSettingsStore» desde «./settings-store».
import { useSettingsStore } from './settings-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «post: jest.fn(), get: jest.fn(), patch: jest.fn() …».
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «user» de tipo «User».
const user: User = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Test'».
  name: 'Test',
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «'test@example.com'».
  email: 'test@example.com',
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

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useSettingsStore.setState({
    // Esta línea sirve para declarar la propiedad «enrollment» con el valor o tipo «null».
    enrollment: null,
    // Esta línea sirve para declarar la propiedad «recoveryCodes» con el valor o tipo «null».
    recoveryCodes: null,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
    isSubmitting: false,
    // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
    submitError: null,
    // Esta línea sirve para declarar la propiedad «isUpdatingPrivacy» con el valor o tipo «false».
    isUpdatingPrivacy: false,
  });
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useAuthStore.setState({ user, token: 'tok-1' });
});

// Esta línea sirve para agrupar las pruebas de «setPublicProfile».
describe('setPublicProfile', () => {
  // Esta línea sirve para declarar la prueba que verifica que «opts in and refreshes the user from /auth/me».
  it('opts in and refreshes the user from /auth/me', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...user, is_public_profile: true });

    // Esta línea sirve para esperar el resultado de «useSettingsStore.getState».
    await useSettingsStore.getState().setPublicProfile(true);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/rankings/opt-in');
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user?.is_public_profile).toBe(true);
    // Esta línea sirve para verificar que «useSettingsStore.getState(» cumple «isUpdatingPrivacy».
    expect(useSettingsStore.getState().isUpdatingPrivacy).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «opts out».
  it('opts out', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...user, is_public_profile: false });

    // Esta línea sirve para esperar el resultado de «useSettingsStore.getState».
    await useSettingsStore.getState().setPublicProfile(false);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/rankings/opt-out');
  });

  // Esta línea sirve para declarar la prueba que verifica que «clears isUpdatingPrivacy even if the request fails».
  it('clears isUpdatingPrivacy even if the request fails', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para verificar que «useSettingsStore.getState().setPublicProfile(true)» falla como se espera.
    await expect(useSettingsStore.getState().setPublicProfile(true)).rejects.toThrow();

    // Esta línea sirve para verificar que «useSettingsStore.getState(» cumple «isUpdatingPrivacy».
    expect(useSettingsStore.getState().isUpdatingPrivacy).toBe(false);
  });
});
