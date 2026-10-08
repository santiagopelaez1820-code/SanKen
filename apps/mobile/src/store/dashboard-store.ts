// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «DashboardStats, MuscleVolume, ProgressMetric, ProgressPoint, VolumeRange» desde «@sanken/core».
import type { DashboardStats, MuscleVolume, ProgressMetric, ProgressPoint, VolumeRange } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «DashboardStoreState».
interface DashboardStoreState {
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «DashboardStats | null».
  stats: DashboardStats | null;
  // Esta línea sirve para declarar la propiedad «isLoadingStats» con el valor o tipo «boolean».
  isLoadingStats: boolean;
  // Esta línea sirve para declarar la propiedad «statsError» con el valor o tipo «string | null».
  statsError: string | null;

  // Esta línea sirve para declarar la propiedad «volumeRange» con el valor o tipo «VolumeRange».
  volumeRange: VolumeRange;
  // Esta línea sirve para declarar la propiedad «volume» con el valor o tipo «MuscleVolume[]».
  volume: MuscleVolume[];
  // Esta línea sirve para declarar la propiedad «isLoadingVolume» con el valor o tipo «boolean».
  isLoadingVolume: boolean;
  // Esta línea sirve para declarar la propiedad «volumeError» con el valor o tipo «string | null».
  volumeError: string | null;

  // Esta línea sirve para declarar la propiedad «progressMetric» con el valor o tipo «ProgressMetric».
  progressMetric: ProgressMetric;
  // Esta línea sirve para declarar la propiedad «progress» con el valor o tipo «ProgressPoint[]».
  progress: ProgressPoint[];
  // Esta línea sirve para declarar la propiedad «isLoadingProgress» con el valor o tipo «boolean».
  isLoadingProgress: boolean;
  // Esta línea sirve para declarar la propiedad «progressError» con el valor o tipo «string | null».
  progressError: string | null;

  // Esta línea sirve para declarar la propiedad «loadStats» con el valor o tipo «() => Promise<void>».
  loadStats: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadVolume» con el valor o tipo «(range?: VolumeRange) => Promise<void>».
  loadVolume: (range?: VolumeRange) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadProgress» con el valor o tipo «(metric?: ProgressMetric) => Promise<void>».
  loadProgress: (metric?: ProgressMetric) => Promise<void>;
}

// Esta línea sirve para declarar «useDashboardStore» con el valor «create<DashboardStoreState>((set, get) => ({».
export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «null».
  stats: null,
  // Esta línea sirve para declarar la propiedad «isLoadingStats» con el valor o tipo «false».
  isLoadingStats: false,
  // Esta línea sirve para declarar la propiedad «statsError» con el valor o tipo «null».
  statsError: null,

  // Esta línea sirve para declarar la propiedad «volumeRange» con el valor o tipo «'weekly'».
  volumeRange: 'weekly',
  // Esta línea sirve para declarar la propiedad «volume» con el valor o tipo «[]».
  volume: [],
  // Esta línea sirve para declarar la propiedad «isLoadingVolume» con el valor o tipo «false».
  isLoadingVolume: false,
  // Esta línea sirve para declarar la propiedad «volumeError» con el valor o tipo «null».
  volumeError: null,

  // Esta línea sirve para declarar la propiedad «progressMetric» con el valor o tipo «'weight'».
  progressMetric: 'weight',
  // Esta línea sirve para declarar la propiedad «progress» con el valor o tipo «[]».
  progress: [],
  // Esta línea sirve para declarar la propiedad «isLoadingProgress» con el valor o tipo «false».
  isLoadingProgress: false,
  // Esta línea sirve para declarar la propiedad «progressError» con el valor o tipo «null».
  progressError: null,

  // Esta línea sirve para declarar la propiedad «loadStats» con el valor o tipo «async () => {».
  loadStats: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingStats: true, statsError: null })…».
    set({ isLoadingStats: true, statsError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<DashboardStats>('/stats/dashboard')» y guardar el resultado en «stats».
      const stats = await api.get<DashboardStats>('/stats/dashboard');
      // Esta línea sirve para guardar en el store: «stats, isLoadingStats: false })…».
      set({ stats, isLoadingStats: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingStats: false, statsError: err instanceof Error ? er…».
      set({ isLoadingStats: false, statsError: err instanceof Error ? err.message : 'No se pudieron cargar tus estadísticas.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadVolume» con el valor o tipo «async (range) => {».
  loadVolume: async (range) => {
    // Esta línea sirve para extraer «olumeRang» de «range ?? get().volumeRange».
    const volumeRange = range ?? get().volumeRange;
    // Esta línea sirve para guardar en el store: «isLoadingVolume: true, volumeError: null, volumeRange })…».
    set({ isLoadingVolume: true, volumeError: null, volumeRange });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<MuscleVolume[]>(`/stats/volume?range=${vol» y guardar el resultado en «volume».
      const volume = await api.get<MuscleVolume[]>(`/stats/volume?range=${volumeRange}`);
      // Esta línea sirve para guardar en el store: «volume, isLoadingVolume: false })…».
      set({ volume, isLoadingVolume: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingVolume: false, volumeError: err instanceof Error ? …».
      set({ isLoadingVolume: false, volumeError: err instanceof Error ? err.message : 'No se pudo cargar el volumen por músculo.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadProgress» con el valor o tipo «async (metric) => {».
  loadProgress: async (metric) => {
    // Esta línea sirve para extraer «rogressMetri» de «metric ?? get().progressMetric».
    const progressMetric = metric ?? get().progressMetric;
    // Esta línea sirve para guardar en el store: «isLoadingProgress: true, progressError: null, progressMetric…».
    set({ isLoadingProgress: true, progressError: null, progressMetric });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<ProgressPoint[]>(`/stats/progress?metric=$» y guardar el resultado en «progress».
      const progress = await api.get<ProgressPoint[]>(`/stats/progress?metric=${progressMetric}`);
      // Esta línea sirve para guardar en el store: «progress, isLoadingProgress: false })…».
      set({ progress, isLoadingProgress: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingProgress: false, progressError: err instanceof Erro…».
      set({ isLoadingProgress: false, progressError: err instanceof Error ? err.message : 'No se pudo cargar tu progreso.' });
    }
  },
}));
