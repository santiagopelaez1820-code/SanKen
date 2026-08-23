import { create } from 'zustand';
import type { ManualRoutinePayload, Routine, TrainerClient, TrainerClientStatus } from '@sanken/core';

import { api } from '@/lib/api';

interface TrainerClientsStoreState {
  clients: TrainerClient[];
  isLoading: boolean;
  error: string | null;

  selectedClient: TrainerClient | null;
  activeRoutine: Routine | null;
  isLoadingDetail: boolean;
  detailError: string | null;

  routineForEdit: Routine | null;
  isLoadingRoutine: boolean;

  isSubmitting: boolean;
  submitError: string | null;

  load: () => Promise<void>;
  addClient: (email: string) => Promise<boolean>;
  loadDetail: (trainerClientId: number) => Promise<void>;
  updateStatus: (trainerClientId: number, status: TrainerClientStatus) => Promise<boolean>;
  loadRoutineForEdit: (routineId: number) => Promise<void>;
  createRoutine: (trainerClientId: number, payload: ManualRoutinePayload) => Promise<Routine | null>;
  updateRoutine: (routineId: number, payload: ManualRoutinePayload) => Promise<Routine | null>;
}

export const useTrainerClientsStore = create<TrainerClientsStoreState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  selectedClient: null,
  activeRoutine: null,
  isLoadingDetail: false,
  detailError: null,

  routineForEdit: null,
  isLoadingRoutine: false,

  isSubmitting: false,
  submitError: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await api.get<TrainerClient[]>('/trainer/clients');
      set({ clients, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus clientes.' });
    }
  },

  addClient: async (email) => {
    set({ isSubmitting: true, submitError: null });
    try {
      await api.post('/trainer/clients', { email });
      set({ isSubmitting: false });
      await get().load();
      return true;
    } catch (err) {
      set({
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : 'No se pudo agregar al cliente.',
      });
      return false;
    }
  },

  loadDetail: async (trainerClientId) => {
    set({ isLoadingDetail: true, detailError: null });
    try {
      const envelope = await api.getWithMeta<TrainerClient>(`/trainer/clients/${trainerClientId}`);
      set({
        selectedClient: envelope.data,
        activeRoutine: (envelope.meta?.active_routine as Routine | null) ?? null,
        isLoadingDetail: false,
      });
    } catch (err) {
      set({
        isLoadingDetail: false,
        detailError: err instanceof Error ? err.message : 'No se pudo cargar el cliente.',
      });
    }
  },

  updateStatus: async (trainerClientId, status) => {
    set({ isSubmitting: true, submitError: null });
    try {
      await api.patch(`/trainer/clients/${trainerClientId}`, { status });
      set({ isSubmitting: false });
      await Promise.all([get().loadDetail(trainerClientId), get().load()]);
      return true;
    } catch (err) {
      set({
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : 'No se pudo actualizar el estado.',
      });
      return false;
    }
  },

  loadRoutineForEdit: async (routineId) => {
    set({ isLoadingRoutine: true });
    try {
      const routine = await api.get<Routine>(`/trainer/routines/${routineId}`);
      set({ routineForEdit: routine, isLoadingRoutine: false });
    } catch {
      set({ isLoadingRoutine: false });
    }
  },

  createRoutine: async (trainerClientId, payload) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const routine = await api.post<Routine>(`/trainer/clients/${trainerClientId}/routines`, payload);
      set({ isSubmitting: false });
      return routine;
    } catch (err) {
      set({
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : 'No se pudo crear la rutina.',
      });
      return null;
    }
  },

  updateRoutine: async (routineId, payload) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const routine = await api.patch<Routine>(`/trainer/routines/${routineId}`, payload);
      set({ isSubmitting: false });
      return routine;
    } catch (err) {
      set({
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : 'No se pudo guardar la rutina.',
      });
      return null;
    }
  },
}));
