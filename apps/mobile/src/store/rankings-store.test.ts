import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { RankingResponse } from '@sanken/core';

import { api } from '@/lib/api';
import { useRankingsStore } from './rankings-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const response: RankingResponse = {
  scope: 'global',
  scope_label: 'Global',
  entries: [{ rank: 1, user_id: 1, user_name: 'Ana', metric_value: 2000, is_viewer: false }],
  viewer: null,
};

beforeEach(() => {
  jest.clearAllMocks();
  useRankingsStore.setState({ scope: 'global', data: null, isLoading: false, error: null });
});

describe('load', () => {
  it('stores the fetched ranking for the current scope', async () => {
    mockedApi.get.mockResolvedValueOnce(response);

    await useRankingsStore.getState().load();

    expect(mockedApi.get).toHaveBeenCalledWith('/rankings?scope=global');
    const state = useRankingsStore.getState();
    expect(state.data).toEqual(response);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useRankingsStore.getState().load();

    const state = useRankingsStore.getState();
    expect(state.error).toBe('network down');
    expect(state.isLoading).toBe(false);
  });
});

describe('setScope', () => {
  it('updates the scope and reloads', async () => {
    mockedApi.get.mockResolvedValueOnce({ ...response, scope: 'city' });

    useRankingsStore.getState().setScope('city');
    expect(useRankingsStore.getState().scope).toBe('city');

    await Promise.resolve();
    expect(mockedApi.get).toHaveBeenCalledWith('/rankings?scope=city');
  });
});
