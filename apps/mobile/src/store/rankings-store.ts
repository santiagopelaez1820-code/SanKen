import { create } from 'zustand';
import type { RankingResponse, RankingScope } from '@sanken/core';

import { api } from '@/lib/api';

interface RankingsStoreState {
  scope: RankingScope;
  data: RankingResponse | null;
  isLoading: boolean;
  error: string | null;

  setScope: (scope: RankingScope) => void;
  load: () => Promise<void>;
}

export const useRankingsStore = create<RankingsStoreState>((set, get) => ({
  scope: 'global',
  data: null,
  isLoading: false,
  error: null,

  setScope: (scope) => {
    set({ scope });
    get().load();
  },

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<RankingResponse>(`/rankings?scope=${get().scope}`);
      set({ data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el ranking.' });
    }
  },
}));
