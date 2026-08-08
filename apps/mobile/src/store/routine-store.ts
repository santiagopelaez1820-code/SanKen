import { create } from 'zustand';
import type { Routine } from '@sanken/core';
import { ApiError } from '@sanken/core';

import { api } from '@/lib/api';

export { findNextDay } from '@sanken/core';

interface RoutineStoreState {
  routine: Routine | null;
  nextDayId: number | null;
  isLoading: boolean;
  error: string | null;
  hasNoRoutine: boolean;

  load: () => Promise<void>;
}

export const useRoutineStore = create<RoutineStoreState>((set) => ({
  routine: null,
  nextDayId: null,
  isLoading: false,
  error: null,
  hasNoRoutine: false,

  load: async () => {
    set({ isLoading: true, error: null, hasNoRoutine: false });
    try {
      const envelope = await api.getWithMeta<Routine>('/routines/active');
      set({
        routine: envelope.data,
        nextDayId: (envelope.meta?.next_day_id as number | null) ?? null,
        isLoading: false,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        set({ isLoading: false, hasNoRoutine: true, routine: null, nextDayId: null });
        return;
      }
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar tu rutina.' });
    }
  },
}));
