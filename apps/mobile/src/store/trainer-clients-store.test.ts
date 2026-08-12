import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { TrainerClient, User } from '@sanken/core';

import { api } from '@/lib/api';
import { useTrainerClientsStore } from './trainer-clients-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const clientUser: User = {
  id: 2,
  name: 'Cliente',
  email: 'cliente@example.com',
  role: 'user',
  two_factor_enabled: false,
  is_public_profile: false,
  trainer_verified_at: null,
  email_verified_at: null,
  onboarding_completed: true,
  created_at: '2024-01-01T00:00:00Z',
};

const trainerClient: TrainerClient = {
  id: 1,
  status: 'active',
  started_at: '2024-01-01T00:00:00Z',
  ended_at: null,
  client: clientUser,
};

beforeEach(() => {
  jest.clearAllMocks();
  useTrainerClientsStore.setState({
    clients: [],
    isLoading: false,
    error: null,
    selectedClient: null,
    activeRoutine: null,
    isLoadingDetail: false,
    detailError: null,
    routineForEdit: null,
    isLoadingRoutine: false,
    isSubmitting: false,
    submitError: null,
  });
});

describe('addClient', () => {
  it('adds the client and reloads the list on success', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([trainerClient]);

    const ok = await useTrainerClientsStore.getState().addClient('cliente@example.com');

    expect(ok).toBe(true);
    expect(mockedApi.post).toHaveBeenCalledWith('/trainer/clients', { email: 'cliente@example.com' });
    expect(useTrainerClientsStore.getState().clients).toEqual([trainerClient]);
    expect(useTrainerClientsStore.getState().submitError).toBeNull();
  });

  it('sets submitError and returns false on failure, without touching clients', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('El cliente no existe.'));

    const ok = await useTrainerClientsStore.getState().addClient('nadie@example.com');

    expect(ok).toBe(false);
    expect(useTrainerClientsStore.getState().submitError).toBe('El cliente no existe.');
    expect(useTrainerClientsStore.getState().clients).toEqual([]);
    expect(mockedApi.get).not.toHaveBeenCalled();
  });
});
