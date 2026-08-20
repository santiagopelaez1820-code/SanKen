import { create } from 'zustand';
import type { ExerciseRankingResponse, ExerciseRankingScope, ExerciseRankingSex } from '@sanken/core';

import { api } from '@/lib/api';

interface ExerciseRankingsStoreState {
  exerciseId: number | null;
  scope: ExerciseRankingScope;
  sex: ExerciseRankingSex;
  data: ExerciseRankingResponse | null;
  isLoading: boolean;
  error: string | null;

  setExercise: (exerciseId: number) => void;
  setScope: (scope: ExerciseRankingScope) => void;
  setSex: (sex: ExerciseRankingSex) => void;
  load: () => Promise<void>;
}

export const useExerciseRankingsStore = create<ExerciseRankingsStoreState>((set, get) => ({
  exerciseId: null,
  scope: 'global',
  sex: 'male',
  data: null,
  isLoading: false,
  error: null,

  setExercise: (exerciseId) => {
    set({ exerciseId, data: null });
    get().load();
  },

  setScope: (scope) => {
    set({ scope });
    get().load();
  },

  setSex: (sex) => {
    set({ sex });
    get().load();
  },

  load: async () => {
    const { exerciseId, scope, sex } = get();
    if (!exerciseId) return;
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<ExerciseRankingResponse>(`/exercises/${exerciseId}/rankings?scope=${scope}&sex=${sex}`);
      set({ data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el ranking.' });
    }
  },
}));
