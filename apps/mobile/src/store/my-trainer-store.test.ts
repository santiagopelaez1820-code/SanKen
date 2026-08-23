import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { MyTrainer } from '@sanken/core';

import { api } from '@/lib/api';
import { useMyTrainerStore } from './my-trainer-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const trainer: MyTrainer = {
  trainer_client_id: 3,
  status: 'active',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trainer: { id: 5, name: 'Coach Ana', email: 'ana@sanken.app' } as any,
};

beforeEach(() => {
  jest.clearAllMocks();
  useMyTrainerStore.setState({ trainers: [], isLoading: false, error: null });
});

describe('load', () => {
  it('stores the fetched trainer relationships', async () => {
    mockedApi.get.mockResolvedValueOnce([trainer]);

    await useMyTrainerStore.getState().load();

    expect(mockedApi.get).toHaveBeenCalledWith('/me/trainers');
    expect(useMyTrainerStore.getState().trainers).toEqual([trainer]);
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useMyTrainerStore.getState().load();

    expect(useMyTrainerStore.getState().error).toBe('network down');
  });
});
