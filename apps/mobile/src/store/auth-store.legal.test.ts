// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar «currentConsentVersions, type User» desde «@sanken/core».
import { currentConsentVersions, type User } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «./auth-store».
import { useAuthStore } from './auth-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «post: jest.fn(), get: jest.fn(), delete: jest.fn()…».
  api: { post: jest.fn(), get: jest.fn(), delete: jest.fn() },
}));

// Esta línea sirve para simular el módulo «@/lib/token-storage» en la prueba.
jest.mock('@/lib/token-storage', () => ({
  // Esta línea sirve para definir el estilo «tokenStorage» con «get: jest.fn(), set: jest.fn(), clear: jest.fn() }…».
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

// Esta línea sirve para simular el módulo «@/lib/social-auth» en la prueba.
jest.mock('@/lib/social-auth', () => ({
  // Esta línea sirve para definir «signInWithGoogle» con «jest.fn(async () => ({ idToken: 'google-…».
  signInWithGoogle: jest.fn(async () => ({ idToken: 'google-id-token' })),
  // Esta línea sirve para declarar la propiedad «signOutFromGoogle» con el valor o tipo «jest.fn(async () => {})».
  signOutFromGoogle: jest.fn(async () => {}),
  // Esta línea sirve para declarar la propiedad «describeSocialAuthError» con el valor o tipo «() => 'error'».
  describeSocialAuthError: () => 'error',
  // Esta línea sirve para declarar la propiedad «SocialAuthCancelledError» con el valor o tipo «class extends Error {}».
  SocialAuthCancelledError: class extends Error {},
}));

// Esta línea sirve para declarar «mockedPost» con el valor «api.post as jest.MockedFunction<typeof api.post>».
const mockedPost = api.post as jest.MockedFunction<typeof api.post>;
// Esta línea sirve para extraer «ockedDelet» de «api.delete as jest.MockedFunction<typeof».
const mockedDelete = api.delete as jest.MockedFunction<typeof api.delete>;

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
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-01-01T00:00:00Z'».
  created_at: '2026-01-01T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «pending_consents» con el valor o tipo «[]».
  pending_consents: [],
};

// Esta línea sirve para extraer «L» de «{ terms: true, privacy: true, health_dat».
const ALL = { terms: true, privacy: true, health_data: true } as const;

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
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «null».
    pendingChallenge: null,
    // Esta línea sirve para declarar la propiedad «pendingSocialConsent» con el valor o tipo «null».
    pendingSocialConsent: null,
    // Esta línea sirve para declarar la propiedad «isSubmittingGoogle» con el valor o tipo «false».
    isSubmittingGoogle: false,
    // Esta línea sirve para declarar la propiedad «isAcceptingConsents» con el valor o tipo «false».
    isAcceptingConsents: false,
  });
});

// Esta línea sirve para agrupar las pruebas de «Google sign-up consent».
describe('Google sign-up consent', () => {
  // Esta línea sirve para declarar la prueba que verifica que «keeps the id token and does not sign in when the backend requires cons».
  it('keeps the id token and does not sign in when the backend requires consent for a new account', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({
      // Esta línea sirve para declarar la propiedad «requires_consent» con el valor o tipo «true».
      requires_consent: true,
      // Esta línea sirve para definir «consents» con «[{ type: 'terms', document: 'terms', ver…».
      consents: [{ type: 'terms', document: 'terms', version: '1.0', accepted_version: null }],
    });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().loginWithGoogle();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState();
    // Esta línea sirve para verificar que «state.token» cumple «toBeNull».
    expect(state.token).toBeNull();
    // Esta línea sirve para verificar que «state.pendingSocialConsent?.idToken» cumple «toBe».
    expect(state.pendingSocialConsent?.idToken).toBe('google-id-token');
    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/auth/social', { id_token: 'google-id-token', provider: 'google' });
  });

  // Esta línea sirve para declarar la prueba que verifica que «resends the same id token with every consent once the user accepts».
  it('resends the same id token with every consent once the user accepts', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ pendingSocialConsent: { idToken: 'google-id-token', consents: [] } });
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().confirmGoogleConsent(ALL);

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith(
      // Esta línea sirve para incluir el texto o las clases «/auth/social…».
      '/auth/social',
      // Esta línea sirve para verificar que se envía un objeto con las aceptaciones.
      expect.objectContaining({
        // Esta línea sirve para declarar la propiedad «id_token» con el valor o tipo «'google-id-token'».
        id_token: 'google-id-token',
        // Esta línea sirve para declarar la propiedad «accept_terms» con el valor o tipo «true».
        accept_terms: true,
        // Esta línea sirve para declarar la propiedad «accept_privacy» con el valor o tipo «true».
        accept_privacy: true,
        // Esta línea sirve para declarar la propiedad «accept_health_data» con el valor o tipo «true».
        accept_health_data: true,
        // Esta línea sirve para declarar la propiedad «legal_versions» con el valor o tipo «currentConsentVersions()».
        legal_versions: currentConsentVersions(),
      })
    );
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «token».
    expect(useAuthStore.getState().token).toBe('tok');
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «pendingSocialConsent».
    expect(useAuthStore.getState().pendingSocialConsent).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «sends the consents on the first attempt when the register form already».
  it('sends the consents on the first attempt when the register form already has them checked', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().loginWithGoogle(ALL);

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/auth/social', expect.objectContaining({ accept_terms: true, accept_health_data: true }));
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «token».
    expect(useAuthStore.getState().token).toBe('tok');
  });

  // Esta línea sirve para declarar la prueba que verifica que «cancelling clears the pending consent without creating anything».
  it('cancelling clears the pending consent without creating anything', () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ pendingSocialConsent: { idToken: 'x', consents: [] } });
    // Esta línea sirve para invocar la acción «cancelGoogleConsent» del store de «Auth».
    useAuthStore.getState().cancelGoogleConsent();
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «pendingSocialConsent».
    expect(useAuthStore.getState().pendingSocialConsent).toBeNull();
    // Esta línea sirve para verificar que «mockedPost» no cumple «toHaveBeenCalled».
    expect(mockedPost).not.toHaveBeenCalled();
  });
});

// Esta línea sirve para agrupar las pruebas de «re-acceptance».
describe('re-acceptance', () => {
  // Esta línea sirve para declarar la prueba que verifica que «records the pending consents and clears them from the user».
  it('records the pending consents and clears them from the user', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: { ...user, pending_consents: ['privacy', 'health_data'] }, token: 'tok' });
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ pending: [], user: { ...user, pending_consents: [] } });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().acceptPendingConsents(['privacy', 'health_data']);

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/legal/consents', {
      // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «['privacy', 'health_data']».
      consents: ['privacy', 'health_data'],
      // Esta línea sirve para definir «legal_versions» con «currentConsentVersions(['privacy', 'heal…».
      legal_versions: currentConsentVersions(['privacy', 'health_data']),
    });
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user?.pending_consents).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «backend consent block (403 consent_required)».
describe('backend consent block (403 consent_required)', () => {
  // Esta línea sirve para declarar la prueba que verifica que «marks the pending consents on the current user so the guard redirects».
  it('marks the pending consents on the current user so the guard redirects', () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user, token: 'tok' });
    // Esta línea sirve para invocar la acción «markPendingConsents» del store de «Auth».
    useAuthStore.getState().markPendingConsents(['terms']);
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user?.pending_consents).toEqual(['terms']);
  });

  // Esta línea sirve para declarar la prueba que verifica que «does nothing without a signed-in user».
  it('does nothing without a signed-in user', () => {
    // Esta línea sirve para invocar la acción «markPendingConsents» del store de «Auth».
    useAuthStore.getState().markPendingConsents(['terms']);
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user).toBeNull();
  });
});

// Esta línea sirve para agrupar las pruebas de «deleteAccount».
describe('deleteAccount', () => {
  // Esta línea sirve para declarar la prueba que verifica que «calls DELETE /auth/me and clears the local session».
  it('calls DELETE /auth/me and clears the local session', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user, token: 'tok' });
    // Esta línea sirve para definir lo que devuelve el espía «mockedDelete».
    mockedDelete.mockResolvedValueOnce({ message: 'ok' } as never);

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().deleteAccount({ confirmation: 'ELIMINAR', password: 'Password!234' });

    // Esta línea sirve para verificar que «mockedDelete» cumple «toHaveBeenCalledWith».
    expect(mockedDelete).toHaveBeenCalledWith('/auth/me', { confirmation: 'ELIMINAR', password: 'Password!234' });
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «token».
    expect(useAuthStore.getState().token).toBeNull();
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «keeps the session and exposes the error when the backend rejects it».
  it('keeps the session and exposes the error when the backend rejects it', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user, token: 'tok' });
    // Esta línea sirve para extraer «ApiError» de «jest.requireActual<typeof import('@sanke».
    const { ApiError } = jest.requireActual<typeof import('@sanken/core')>('@sanken/core');
    // Esta línea sirve para definir lo que devuelve el espía «mockedDelete».
    mockedDelete.mockRejectedValueOnce(
      // Esta línea sirve para simular un error 422 de la API con el mensaje de contraseña.
      new ApiError(422, { message: 'x', errors: { password: ['La contraseña no es correcta.'] } }) as never
    );

    // Esta línea sirve para esperar y verificar «useAuthStore.getState(».
    await expect(useAuthStore.getState().deleteAccount({ confirmation: 'ELIMINAR', password: 'bad' })).rejects.toBeTruthy();

    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «token».
    expect(useAuthStore.getState().token).toBe('tok');
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «error».
    expect(useAuthStore.getState().error).toBe('La contraseña no es correcta.');
  });
});

// Esta línea sirve para agrupar las pruebas de «register».
describe('register', () => {
  // Esta línea sirve para declarar la prueba que verifica que «forwards the consent fields to the API».
  it('forwards the consent fields to the API', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
    await useAuthStore.getState().register({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Ana'».
      name: 'Ana',
      // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «'ana@example.com'».
      email: 'ana@example.com',
      // Esta línea sirve para declarar la propiedad «password» con el valor o tipo «'Password!234'».
      password: 'Password!234',
      // Esta línea sirve para declarar la propiedad «password_confirmation» con el valor o tipo «'Password!234'».
      password_confirmation: 'Password!234',
      // Esta línea sirve para declarar la propiedad «accept_terms» con el valor o tipo «true».
      accept_terms: true,
      // Esta línea sirve para declarar la propiedad «accept_privacy» con el valor o tipo «true».
      accept_privacy: true,
      // Esta línea sirve para declarar la propiedad «accept_health_data» con el valor o tipo «true».
      accept_health_data: true,
    });

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ accept_terms: true }));
  });
});
