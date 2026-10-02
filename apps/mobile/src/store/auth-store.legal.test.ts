import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { currentConsentVersions, type User } from '@sanken/core';

import { api } from '@/lib/api';
import { useAuthStore } from './auth-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/lib/token-storage', () => ({
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

jest.mock('@/lib/social-auth', () => ({
  signInWithGoogle: jest.fn(async () => ({ idToken: 'google-id-token' })),
  signOutFromGoogle: jest.fn(async () => {}),
  describeSocialAuthError: () => 'error',
  SocialAuthCancelledError: class extends Error {},
}));

const mockedPost = api.post as jest.MockedFunction<typeof api.post>;
const mockedDelete = api.delete as jest.MockedFunction<typeof api.delete>;

const user: User = {
  id: 1,
  name: 'Test',
  email: 'test@example.com',
  avatar_url: null,
  role: 'user',
  two_factor_enabled: false,
  is_public_profile: false,
  trainer_verified_at: null,
  email_verified_at: null,
  onboarding_completed: true,
  has_location: true,
  created_at: '2026-01-01T00:00:00Z',
  pending_consents: [],
};

const ALL = { terms: true, privacy: true, health_data: true } as const;

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({
    user: null,
    token: null,
    error: null,
    pendingChallenge: null,
    pendingSocialConsent: null,
    isSubmittingGoogle: false,
    isAcceptingConsents: false,
  });
});

describe('Google sign-up consent', () => {
  it('keeps the id token and does not sign in when the backend requires consent for a new account', async () => {
    mockedPost.mockResolvedValueOnce({
      requires_consent: true,
      consents: [{ type: 'terms', document: 'terms', version: '1.0', accepted_version: null }],
    });

    await useAuthStore.getState().loginWithGoogle();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.pendingSocialConsent?.idToken).toBe('google-id-token');
    expect(mockedPost).toHaveBeenCalledWith('/auth/social', { id_token: 'google-id-token', provider: 'google' });
  });

  it('resends the same id token with every consent once the user accepts', async () => {
    useAuthStore.setState({ pendingSocialConsent: { idToken: 'google-id-token', consents: [] } });
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    await useAuthStore.getState().confirmGoogleConsent(ALL);

    expect(mockedPost).toHaveBeenCalledWith(
      '/auth/social',
      expect.objectContaining({
        id_token: 'google-id-token',
        accept_terms: true,
        accept_privacy: true,
        accept_health_data: true,
        legal_versions: currentConsentVersions(),
      })
    );
    expect(useAuthStore.getState().token).toBe('tok');
    expect(useAuthStore.getState().pendingSocialConsent).toBeNull();
  });

  it('sends the consents on the first attempt when the register form already has them checked', async () => {
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    await useAuthStore.getState().loginWithGoogle(ALL);

    expect(mockedPost).toHaveBeenCalledWith('/auth/social', expect.objectContaining({ accept_terms: true, accept_health_data: true }));
    expect(useAuthStore.getState().token).toBe('tok');
  });

  it('cancelling clears the pending consent without creating anything', () => {
    useAuthStore.setState({ pendingSocialConsent: { idToken: 'x', consents: [] } });
    useAuthStore.getState().cancelGoogleConsent();
    expect(useAuthStore.getState().pendingSocialConsent).toBeNull();
    expect(mockedPost).not.toHaveBeenCalled();
  });
});

describe('re-acceptance', () => {
  it('records the pending consents and clears them from the user', async () => {
    useAuthStore.setState({ user: { ...user, pending_consents: ['privacy', 'health_data'] }, token: 'tok' });
    mockedPost.mockResolvedValueOnce({ pending: [], user: { ...user, pending_consents: [] } });

    await useAuthStore.getState().acceptPendingConsents(['privacy', 'health_data']);

    expect(mockedPost).toHaveBeenCalledWith('/legal/consents', {
      consents: ['privacy', 'health_data'],
      legal_versions: currentConsentVersions(['privacy', 'health_data']),
    });
    expect(useAuthStore.getState().user?.pending_consents).toEqual([]);
  });
});

describe('backend consent block (403 consent_required)', () => {
  it('marks the pending consents on the current user so the guard redirects', () => {
    useAuthStore.setState({ user, token: 'tok' });
    useAuthStore.getState().markPendingConsents(['terms']);
    expect(useAuthStore.getState().user?.pending_consents).toEqual(['terms']);
  });

  it('does nothing without a signed-in user', () => {
    useAuthStore.getState().markPendingConsents(['terms']);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('deleteAccount', () => {
  it('calls DELETE /auth/me and clears the local session', async () => {
    useAuthStore.setState({ user, token: 'tok' });
    mockedDelete.mockResolvedValueOnce({ message: 'ok' } as never);

    await useAuthStore.getState().deleteAccount({ confirmation: 'ELIMINAR', password: 'Password!234' });

    expect(mockedDelete).toHaveBeenCalledWith('/auth/me', { confirmation: 'ELIMINAR', password: 'Password!234' });
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('keeps the session and exposes the error when the backend rejects it', async () => {
    useAuthStore.setState({ user, token: 'tok' });
    const { ApiError } = jest.requireActual<typeof import('@sanken/core')>('@sanken/core');
    mockedDelete.mockRejectedValueOnce(
      new ApiError(422, { message: 'x', errors: { password: ['La contraseña no es correcta.'] } }) as never
    );

    await expect(useAuthStore.getState().deleteAccount({ confirmation: 'ELIMINAR', password: 'bad' })).rejects.toBeTruthy();

    expect(useAuthStore.getState().token).toBe('tok');
    expect(useAuthStore.getState().error).toBe('La contraseña no es correcta.');
  });
});

describe('register', () => {
  it('forwards the consent fields to the API', async () => {
    mockedPost.mockResolvedValueOnce({ user, token: 'tok' });

    await useAuthStore.getState().register({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'Password!234',
      password_confirmation: 'Password!234',
      accept_terms: true,
      accept_privacy: true,
      accept_health_data: true,
    });

    expect(mockedPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ accept_terms: true }));
  });
});
