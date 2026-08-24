import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from '@sanken/core';

import { api } from '@/lib/api';
import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from './auth-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/lib/token-storage', () => ({
  tokenStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

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
