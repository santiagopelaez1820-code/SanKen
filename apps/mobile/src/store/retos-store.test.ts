import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Challenge, ChallengeLeaderboardResponse } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useRetosStore } from './retos-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('@/lib/echo', () => ({
  getEcho: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetEcho = getEcho as jest.Mock;

const challenge: Challenge = {
  id: 1,
  title: 'Racha semanal',
  description: 'Completa 5 entrenamientos esta semana.',
  type: 'weekly',
  criteria: { metric: 'workouts_count', target: 5 },
  starts_at: '2026-08-10',
  ends_at: '2026-08-16',
  joined: false,
  progress_value: null,
  completed: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  useRetosStore.setState({ challenges: [], isLoading: false, error: null, activeChallengeId: null, leaderboard: null });
});

describe('load', () => {
  it('stores the fetched challenges', async () => {
    mockedApi.get.mockResolvedValueOnce([challenge]);

    await useRetosStore.getState().load();

    expect(mockedApi.get).toHaveBeenCalledWith('/challenges');
    expect(useRetosStore.getState().challenges).toEqual([challenge]);
    expect(useRetosStore.getState().isLoading).toBe(false);
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useRetosStore.getState().load();

    expect(useRetosStore.getState().error).toBe('network down');
  });
});

describe('join', () => {
  it('posts to the join endpoint and reloads the list', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...challenge, joined: true }]);

    await useRetosStore.getState().join(1);

    expect(mockedApi.post).toHaveBeenCalledWith('/challenges/1/join');
    expect(useRetosStore.getState().challenges[0].joined).toBe(true);
  });
});

describe('openLeaderboard / closeLeaderboard', () => {
  const leaderboardResponse: ChallengeLeaderboardResponse = {
    challenge_id: 1,
    entries: [{ rank: 1, user_id: 9, user_name: 'Ana', progress_value: 3, completed: false, is_viewer: true }],
  };

  it('fetches the initial leaderboard and subscribes to the private channel', async () => {
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    const listen = jest.fn();
    const echo = { private: jest.fn(() => ({ listen })), leave: jest.fn() };
    mockedGetEcho.mockReturnValue(echo);

    await useRetosStore.getState().openLeaderboard(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/challenges/1/leaderboard');
    expect(useRetosStore.getState().leaderboard).toEqual(leaderboardResponse.entries);
    expect(useRetosStore.getState().activeChallengeId).toBe(1);
    expect(echo.private).toHaveBeenCalledWith('challenges.1');
    expect(listen).toHaveBeenCalledWith('.progress.updated', expect.any(Function));
  });

  it('updates the leaderboard when the broadcast callback fires', async () => {
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    let broadcastCallback: ((payload: { leaderboard: typeof leaderboardResponse.entries }) => void) | undefined;
    const echo = {
      private: jest.fn(() => ({
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          broadcastCallback = cb;
        }),
      })),
      leave: jest.fn(),
    };
    mockedGetEcho.mockReturnValue(echo);

    await useRetosStore.getState().openLeaderboard(1);

    const updated = [{ rank: 1, user_id: 9, user_name: 'Ana', progress_value: 4, completed: false, is_viewer: true }];
    broadcastCallback?.({ leaderboard: updated });

    expect(useRetosStore.getState().leaderboard).toEqual(updated);
  });

  it('leaves the channel and clears state on close', async () => {
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    mockedGetEcho.mockReturnValue(echo);

    await useRetosStore.getState().openLeaderboard(1);
    useRetosStore.getState().closeLeaderboard();

    expect(echo.leave).toHaveBeenCalledWith('challenges.1');
    expect(useRetosStore.getState().activeChallengeId).toBeNull();
    expect(useRetosStore.getState().leaderboard).toBeNull();
  });
});
