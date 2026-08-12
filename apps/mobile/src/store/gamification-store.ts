import { create } from 'zustand';
import type { GamificationSummary } from '@sanken/core';

import { api } from '@/lib/api';

interface GamificationStoreState {
  summary: GamificationSummary | null;
  isLoading: boolean;
  error: string | null;
  loadSummary: () => Promise<void>;
}

export const useGamificationStore = create<GamificationStoreState>((set) => ({
  summary: null,
  isLoading: false,
  error: null,

  loadSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const summary = await api.get<GamificationSummary>('/gamification');
      set({ summary, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar tu progreso.' });
    }
  },
}));
