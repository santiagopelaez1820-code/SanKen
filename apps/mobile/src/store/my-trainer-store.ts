import { create } from 'zustand';
import type { MyTrainer } from '@sanken/core';

import { api } from '@/lib/api';

interface MyTrainerStoreState {
  trainers: MyTrainer[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
}

export const useMyTrainerStore = create<MyTrainerStoreState>((set) => ({
  trainers: [],
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const trainers = await api.get<MyTrainer[]>('/me/trainers');
      set({ trainers, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'No se pudieron cargar tus entrenadores.',
      });
    }
  },
}));
