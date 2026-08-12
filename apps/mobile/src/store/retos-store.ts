import { create } from 'zustand';
import type { Challenge, ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';

interface RetosStoreState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  activeChallengeId: number | null;
  leaderboard: ChallengeLeaderboardEntry[] | null;

  load: () => Promise<void>;
  join: (challengeId: number) => Promise<void>;
  openLeaderboard: (challengeId: number) => Promise<void>;
  closeLeaderboard: () => void;
}

// Fuera del store: no es estado de UI, es el handle de limpieza del canal de
// Reverb — vive mientras haya un leaderboard abierto, sin importar qué
// componente lo pidió.
let leaveChannel: (() => void) | null = null;

export const useRetosStore = create<RetosStoreState>((set, get) => ({
  challenges: [],
  isLoading: false,
  error: null,
  activeChallengeId: null,
  leaderboard: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const challenges = await api.get<Challenge[]>('/challenges');
      set({ challenges, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar los retos.' });
    }
  },

  join: async (challengeId) => {
    await api.post(`/challenges/${challengeId}/join`);
    await get().load();
  },

  openLeaderboard: async (challengeId) => {
    get().closeLeaderboard();
    set({ activeChallengeId: challengeId, leaderboard: null });

    const res = await api.get<ChallengeLeaderboardResponse>(`/challenges/${challengeId}/leaderboard`);
    if (get().activeChallengeId !== challengeId) return; // se cerró mientras cargaba
    set({ leaderboard: res.entries });

    const echo = getEcho();
    const channel = echo.private(`challenges.${challengeId}`);
    channel.listen('.progress.updated', (payload: ChallengeProgressBroadcast) => {
      set({ leaderboard: payload.leaderboard });
    });
    leaveChannel = () => echo.leave(`challenges.${challengeId}`);
  },

  closeLeaderboard: () => {
    leaveChannel?.();
    leaveChannel = null;
    set({ activeChallengeId: null, leaderboard: null });
  },
}));
