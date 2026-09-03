import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from '@sanken/core';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from './settings-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

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
  useSettingsStore.setState({
    enrollment: null,
    recoveryCodes: null,
    isSubmitting: false,
    submitError: null,
    isUpdatingPrivacy: false,
  });
  useAuthStore.setState({ user, token: 'tok-1' });
});

describe('setPublicProfile', () => {
  it('opts in and refreshes the user from /auth/me', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce({ ...user, is_public_profile: true });

    await useSettingsStore.getState().setPublicProfile(true);

    expect(mockedApi.post).toHaveBeenCalledWith('/rankings/opt-in');
    expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
    expect(useAuthStore.getState().user?.is_public_profile).toBe(true);
    expect(useSettingsStore.getState().isUpdatingPrivacy).toBe(false);
  });

  it('opts out', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce({ ...user, is_public_profile: false });

    await useSettingsStore.getState().setPublicProfile(false);

    expect(mockedApi.post).toHaveBeenCalledWith('/rankings/opt-out');
  });

  it('clears isUpdatingPrivacy even if the request fails', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    await expect(useSettingsStore.getState().setPublicProfile(true)).rejects.toThrow();

    expect(useSettingsStore.getState().isUpdatingPrivacy).toBe(false);
  });
});
