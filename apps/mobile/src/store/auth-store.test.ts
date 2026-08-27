import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ApiError, type User } from '@sanken/core';

import { api } from '@/lib/api';
import { SocialAuthCancelledError, signInWithGoogle } from '@/lib/social-auth';
import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from './auth-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('@/lib/token-storage', () => ({
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));
jest.mock('@/lib/social-auth', () => ({
  signInWithGoogle: jest.fn(),
  signOutFromGoogle: jest.fn(),
  describeSocialAuthError: () => 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.',
  SocialAuthCancelledError: class SocialAuthCancelledError extends Error {},
  SocialAuthUnavailableError: class SocialAuthUnavailableError extends Error {},
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
const mockedSignInWithGoogle = signInWithGoogle as jest.MockedFunction<typeof signInWithGoogle>;

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
  created_at: '2024-01-01T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({
    user: null,
    token: null,
    isHydrating: false,
    isSubmitting: false,
    isSubmittingGoogle: false,
    error: null,
    pendingChallenge: null,
  });
});

describe('login', () => {
  it('stores the user/token on success', async () => {
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-1' });

    await useAuthStore.getState().login({ email: user.email, password: 'x' });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok-1');
    expect(state.error).toBeNull();
    expect(mockedTokenStorage.set).toHaveBeenCalledWith('tok-1');
  });

  it('sets pendingChallenge without an error when the backend requires 2FA', async () => {
    mockedApi.post.mockResolvedValueOnce({ requires_two_factor: true, challenge_token: 'chal-1' });

    await useAuthStore.getState().login({ email: user.email, password: 'x' });

    const state = useAuthStore.getState();
    expect(state.pendingChallenge).toEqual({ challengeToken: 'chal-1' });
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
    expect(mockedTokenStorage.set).not.toHaveBeenCalled();
  });

  it('populates error and does not set user/token on failure', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    await expect(useAuthStore.getState().login({ email: user.email, password: 'x' })).rejects.toThrow();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBe('Credenciales inválidas');
  });
});

describe('loginWithGoogle', () => {
  it('stores the user/token on success', async () => {
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-google' });

    await useAuthStore.getState().loginWithGoogle();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok-google');
    expect(state.isSubmittingGoogle).toBe(false);
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', { id_token: 'firebase-id-token', provider: 'google' });
    expect(mockedTokenStorage.set).toHaveBeenCalledWith('tok-google');
  });

  it('sets pendingChallenge without an error when the backend requires 2FA', async () => {
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    mockedApi.post.mockResolvedValueOnce({ requires_two_factor: true, challenge_token: 'chal-google' });

    await useAuthStore.getState().loginWithGoogle();

    const state = useAuthStore.getState();
    expect(state.pendingChallenge).toEqual({ challengeToken: 'chal-google' });
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });

  it('clears the loading state without setting an error when the user cancels', async () => {
    mockedSignInWithGoogle.mockRejectedValueOnce(new SocialAuthCancelledError('cancelled'));

    await useAuthStore.getState().loginWithGoogle();

    const state = useAuthStore.getState();
    expect(state.isSubmittingGoogle).toBe(false);
    expect(state.error).toBeNull();
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('surfaces a friendly error message when the backend rejects the token', async () => {
    mockedSignInWithGoogle.mockResolvedValueOnce({ idToken: 'firebase-id-token' });
    mockedApi.post.mockRejectedValueOnce(new ApiError(422, { message: 'Ya existe una cuenta con este correo.' }));

    await expect(useAuthStore.getState().loginWithGoogle()).rejects.toThrow();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isSubmittingGoogle).toBe(false);
    expect(state.error).toBe('Ya existe una cuenta con este correo.');
  });
});

describe('challenge2fa', () => {
  it('clears pendingChallenge and stores the token on success', async () => {
    useAuthStore.setState({ pendingChallenge: { challengeToken: 'chal-1' } });
    mockedApi.post.mockResolvedValueOnce({ user, token: 'tok-2' });

    await useAuthStore.getState().challenge2fa('123456');

    const state = useAuthStore.getState();
    expect(state.pendingChallenge).toBeNull();
    expect(state.token).toBe('tok-2');
    expect(state.user).toEqual(user);
  });

  it('does nothing when there is no pending challenge', async () => {
    await useAuthStore.getState().challenge2fa('123456');

    expect(mockedApi.post).not.toHaveBeenCalled();
  });
});
