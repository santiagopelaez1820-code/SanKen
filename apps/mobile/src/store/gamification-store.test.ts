import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { GamificationSummary } from '@sanken/core';

import { api } from '@/lib/api';
import { useGamificationStore } from './gamification-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const summary: GamificationSummary = {
  total_xp: 150,
  level: 2,
  xp_for_current_level: 100,
  xp_for_next_level: 400,
  progress_pct: 0.1667,
  unlocked_achievements: [],
  locked_achievements: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  useGamificationStore.setState({ summary: null, isLoading: false, error: null });
});

describe('loadSummary', () => {
  it('stores the fetched summary', async () => {
    mockedApi.get.mockResolvedValueOnce(summary);

    await useGamificationStore.getState().loadSummary();

    const state = useGamificationStore.getState();
    expect(state.summary).toEqual(summary);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useGamificationStore.getState().loadSummary();

    const state = useGamificationStore.getState();
    expect(state.error).toBe('network down');
    expect(state.isLoading).toBe(false);
    expect(state.summary).toBeNull();
  });
});
