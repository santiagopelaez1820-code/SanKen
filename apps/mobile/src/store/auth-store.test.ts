// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar «ApiError, type User» desde «@sanken/core».
import { ApiError, type User } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «SocialAuthCancelledError, signInWithGoogle» desde «@/lib/social-auth».
import { SocialAuthCancelledError, signInWithGoogle } from '@/lib/social-auth';
// Esta línea sirve para importar «tokenStorage» desde «@/lib/token-storage».
import { tokenStorage } from '@/lib/token-storage';
// Esta línea sirve para importar «useAuthStore» desde «./auth-store».
import { useAuthStore } from './auth-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «post: jest.fn(), get: jest.fn(), patch: jest.fn(),…».
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
// Esta línea sirve para simular el módulo «@/lib/token-storage» en la prueba.
jest.mock('@/lib/token-storage', () => ({
  // Esta línea sirve para definir el estilo «tokenStorage» con «get: jest.fn(), set: jest.fn(), clear: jest.fn() }…».
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));
// Esta línea sirve para simular el módulo «@/lib/social-auth» en la prueba.
jest.mock('@/lib/social-auth', () => ({
  // Esta línea sirve para declarar la propiedad «signInWithGoogle» con el valor o tipo «jest.fn()».
  signInWithGoogle: jest.fn(),
  // Esta línea sirve para declarar la propiedad «signOutFromGoogle» con el valor o tipo «jest.fn()».
  signOutFromGoogle: jest.fn(),
  // Esta línea sirve para definir «describeSocialAuthError» con «() => 'No se pudo iniciar sesión con Goo…».
  describeSocialAuthError: () => 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.',
  // Esta línea sirve para definir «SocialAuthCancelledError» con «class SocialAuthCancelledError extends E…».
  SocialAuthCancelledError: class SocialAuthCancelledError extends Error {},
  // Esta línea sirve para definir «SocialAuthUnavailableError» con «class SocialAuthUnavailableError extends…».
  SocialAuthUnavailableError: class SocialAuthUnavailableError extends Error {},
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;
// Esta línea sirve para declarar «mockedTokenStorage» con el valor «tokenStorage as jest.Mocked<typeof tokenStorage>».
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
// Esta línea sirve para extraer «ockedSignInWithGoogl» de «signInWithGoogle as jest.MockedFunction<».
const mockedSignInWithGoogle = signInWithGoogle as jest.MockedFunction<typeof signInWithGoogle>;

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
  useAuthStore.setState({
    // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «null».
    user: null,
    // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «null».
    token: null,
    // Esta línea sirve para declarar la propiedad «isHydrating» con el valor o tipo «false».
    isHydrating: false,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
    isSubmitting: false,
    // Esta línea sirve para declarar la propiedad «isSubmittingGoogle» con el valor o tipo «false».
    isSubmittingGoogle: false,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «null».
    pendingChallenge: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «login».
describe('login', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the user/token on success».
  it('stores the user/token on success', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-1' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().login({ email: user.email, password: 'x' });

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.user» cumple «toEqual».
    expect(state.user).toEqual(user);
    // Esta línea sirve para verificar que «state.token» cumple «toBe».
    expect(state.token).toBe('tok-1');
    // Esta línea sirve para verificar que «state.error» cumple «toBeNull».
    expect(state.error).toBeNull();
    // Esta línea sirve para verificar que «mockedTokenStorage.set» cumple «toHaveBeenCalledWith».
    expect(mockedTokenStorage.set).toHaveBeenCalledWith('tok-1');
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets pendingChallenge without an error when the backend requires 2FA».
  it('sets pendingChallenge without an error when the backend requires 2FA', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ requires_two_factor: true, challenge_token: 'chal-1' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().login({ email: user.email, password: 'x' });

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.pendingChallenge» cumple «toEqual».
    expect(state.pendingChallenge).toEqual({ challengeToken: 'chal-1' });
    // Esta línea sirve para verificar que «state.token» cumple «toBeNull».
    expect(state.token).toBeNull();
    // Esta línea sirve para verificar que «state.user» cumple «toBeNull».
    expect(state.user).toBeNull();
    // Esta línea sirve para verificar que «state.error» cumple «toBeNull».
    expect(state.error).toBeNull();
    // Esta línea sirve para verificar que «mockedTokenStorage.set» no cumple «toHaveBeenCalled».
    expect(mockedTokenStorage.set).not.toHaveBeenCalled();
  });

  // Esta línea sirve para declarar la prueba que verifica que «populates error and does not set user/token on failure».
  it('populates error and does not set user/token on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    // Esta línea sirve para esperar y verificar «useAuthStore.getState(».
    await expect(useAuthStore.getState().login({ email: user.email, password: 'x' })).rejects.toThrow();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.user» cumple «toBeNull».
    expect(state.user).toBeNull();
    // Esta línea sirve para verificar que «state.token» cumple «toBeNull».
    expect(state.token).toBeNull();
    // Esta línea sirve para verificar que «state.error» cumple «toBe».
    expect(state.error).toBe('Credenciales inválidas');
  });
});

// Esta línea sirve para agrupar las pruebas de «loginWithGoogle».
describe('loginWithGoogle', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the user/token on success».
  it('stores the user/token on success', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedSignInWithGoogle».
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-google' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().loginWithGoogle();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.user» cumple «toEqual».
    expect(state.user).toEqual(user);
    // Esta línea sirve para verificar que «state.token» cumple «toBe».
    expect(state.token).toBe('tok-google');
    // Esta línea sirve para verificar que «state.isSubmittingGoogle» cumple «toBe».
    expect(state.isSubmittingGoogle).toBe(false);
    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', { id_token: 'firebase-id-token', provider: 'google' });
    // Esta línea sirve para verificar que «mockedTokenStorage.set» cumple «toHaveBeenCalledWith».
    expect(mockedTokenStorage.set).toHaveBeenCalledWith('tok-google');
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets pendingChallenge without an error when the backend requires 2FA».
  it('sets pendingChallenge without an error when the backend requires 2FA', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedSignInWithGoogle».
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ requires_two_factor: true, challenge_token: 'chal-google' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().loginWithGoogle();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.pendingChallenge» cumple «toEqual».
    expect(state.pendingChallenge).toEqual({ challengeToken: 'chal-google' });
    // Esta línea sirve para verificar que «state.token» cumple «toBeNull».
    expect(state.token).toBeNull();
    // Esta línea sirve para verificar que «state.error» cumple «toBeNull».
    expect(state.error).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «clears the loading state without setting an error when the user cancel».
  it('clears the loading state without setting an error when the user cancels', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedSignInWithGoogle».
    mockedSignInWithGoogle.mockRejectedValueOnce(new SocialAuthCancelledError('cancelled'));

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().loginWithGoogle();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.isSubmittingGoogle» cumple «toBe».
    expect(state.isSubmittingGoogle).toBe(false);
    // Esta línea sirve para verificar que «state.error» cumple «toBeNull».
    expect(state.error).toBeNull();
    // Esta línea sirve para verificar que «mockedApi.post» no cumple «toHaveBeenCalled».
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  // Esta línea sirve para declarar la prueba que verifica que «surfaces a friendly error message when the backend rejects the token».
  it('surfaces a friendly error message when the backend rejects the token', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedSignInWithGoogle».
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new ApiError(422, { message: 'Ya existe una cuenta con este correo.' }));

    // Esta línea sirve para verificar que «useAuthStore.getState().loginWithGoogle()» falla como se espera.
    await expect(useAuthStore.getState().loginWithGoogle()).rejects.toThrow();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.user» cumple «toBeNull».
    expect(state.user).toBeNull();
    // Esta línea sirve para verificar que «state.isSubmittingGoogle» cumple «toBe».
    expect(state.isSubmittingGoogle).toBe(false);
    // Esta línea sirve para verificar que «state.error» cumple «toBe».
    expect(state.error).toBe('Ya existe una cuenta con este correo.');
  });
});

// Esta línea sirve para agrupar las pruebas de «challenge2fa».
describe('challenge2fa', () => {
  // Esta línea sirve para declarar la prueba que verifica que «clears pendingChallenge and stores the token on success».
  it('clears pendingChallenge and stores the token on success', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ pendingChallenge: { challengeToken: 'chal-1' } });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-2' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().challenge2fa('123456');

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.pendingChallenge» cumple «toBeNull».
    expect(state.pendingChallenge).toBeNull();
    // Esta línea sirve para verificar que «state.token» cumple «toBe».
    expect(state.token).toBe('tok-2');
    // Esta línea sirve para verificar que «state.user» cumple «toEqual».
    expect(state.user).toEqual(user);
  });

  // Esta línea sirve para declarar la prueba que verifica que «does nothing when there is no pending challenge».
  it('does nothing when there is no pending challenge', async () => {
    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().challenge2fa('123456');

    // Esta línea sirve para verificar que «mockedApi.post» no cumple «toHaveBeenCalled».
    expect(mockedApi.post).not.toHaveBeenCalled();
  });
});
