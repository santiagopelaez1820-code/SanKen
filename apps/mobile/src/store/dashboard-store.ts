import { create } from 'zustand';
import type { DashboardStats, MuscleVolume, ProgressMetric, ProgressPoint, VolumeRange } from '@sanken/core';

import { api } from '@/lib/api';

interface DashboardStoreState {
  stats: DashboardStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  volumeRange: VolumeRange;
  volume: MuscleVolume[];
  isLoadingVolume: boolean;
  volumeError: string | null;

  progressMetric: ProgressMetric;
  progress: ProgressPoint[];
  isLoadingProgress: boolean;
  progressError: string | null;

  loadStats: () => Promise<void>;
  loadVolume: (range?: VolumeRange) => Promise<void>;
  loadProgress: (metric?: ProgressMetric) => Promise<void>;
}

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  stats: null,
  isLoadingStats: false,
  statsError: null,

  volumeRange: 'weekly',
  volume: [],
  isLoadingVolume: false,
  volumeError: null,

  progressMetric: 'weight',
  progress: [],
  isLoadingProgress: false,
  progressError: null,

  loadStats: async () => {
    set({ isLoadingStats: true, statsError: null });
    try {
      const stats = await api.get<DashboardStats>('/stats/dashboard');
      set({ stats, isLoadingStats: false });
    } catch (err) {
      set({ isLoadingStats: false, statsError: err instanceof Error ? err.message : 'No se pudieron cargar tus estadísticas.' });
    }
  },

  loadVolume: async (range) => {
    const volumeRange = range ?? get().volumeRange;
    set({ isLoadingVolume: true, volumeError: null, volumeRange });
    try {
      const volume = await api.get<MuscleVolume[]>(`/stats/volume?range=${volumeRange}`);
      set({ volume, isLoadingVolume: false });
    } catch (err) {
      set({ isLoadingVolume: false, volumeError: err instanceof Error ? err.message : 'No se pudo cargar el volumen por músculo.' });
    }
  },

  loadProgress: async (metric) => {
    const progressMetric = metric ?? get().progressMetric;
    set({ isLoadingProgress: true, progressError: null, progressMetric });
    try {
      const progress = await api.get<ProgressPoint[]>(`/stats/progress?metric=${progressMetric}`);
      set({ progress, isLoadingProgress: false });
    } catch (err) {
      set({ isLoadingProgress: false, progressError: err instanceof Error ? err.message : 'No se pudo cargar tu progreso.' });
    }
  },
}));
