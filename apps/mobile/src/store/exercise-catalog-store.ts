import { create } from 'zustand';
import type { ExerciseCatalogItem } from '@sanken/core';

import { api } from '@/lib/api';

interface ExerciseCatalogStoreState {
  exercises: ExerciseCatalogItem[];
  isLoading: boolean;
  error: string | null;
  loaded: boolean;

  load: () => Promise<void>;
}

export const useExerciseCatalogStore = create<ExerciseCatalogStoreState>((set, get) => ({
  exercises: [],
  isLoading: false,
  error: null,
  loaded: false,

  load: async () => {
    if (get().loaded || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const exercises = await api.get<ExerciseCatalogItem[]>('/exercises');
      set({ exercises, isLoading: false, loaded: true });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el catálogo.' });
    }
  },
}));
