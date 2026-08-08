import { create } from 'zustand';
import type { WorkoutSession } from '@sanken/core';

import { api } from '@/lib/api';

interface PageMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface WorkoutHistoryStoreState {
  sessions: WorkoutSession[];
  meta: PageMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  load: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useWorkoutHistoryStore = create<WorkoutHistoryStoreState>((set, get) => ({
  sessions: [],
  meta: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const envelope = await api.getWithMeta<WorkoutSession[]>('/workout-sessions');
      set({ sessions: envelope.data, meta: (envelope.meta as unknown as PageMeta) ?? null, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar tu historial.' });
    }
  },

  loadMore: async () => {
    const { meta, isLoadingMore, sessions } = get();
    if (isLoadingMore || !meta || meta.current_page >= meta.last_page) return;

    set({ isLoadingMore: true });
    try {
      const nextPage = meta.current_page + 1;
      const envelope = await api.getWithMeta<WorkoutSession[]>(`/workout-sessions?page=${nextPage}`);
      set({
        sessions: [...sessions, ...envelope.data],
        meta: (envelope.meta as unknown as PageMeta) ?? meta,
        isLoadingMore: false,
      });
    } catch {
      set({ isLoadingMore: false });
    }
  },
}));
