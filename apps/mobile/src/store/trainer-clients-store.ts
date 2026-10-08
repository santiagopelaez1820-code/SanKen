// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «ManualRoutinePayload, Routine, TrainerClient, TrainerClientStatus» desde «@sanken/core».
import type { ManualRoutinePayload, Routine, TrainerClient, TrainerClientStatus } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «TrainerClientsStoreState».
interface TrainerClientsStoreState {
  // Esta línea sirve para declarar la propiedad «clients» con el valor o tipo «TrainerClient[]».
  clients: TrainerClient[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «selectedClient» con el valor o tipo «TrainerClient | null».
  selectedClient: TrainerClient | null;
  // Esta línea sirve para declarar la propiedad «activeRoutine» con el valor o tipo «Routine | null».
  activeRoutine: Routine | null;
  // Esta línea sirve para declarar la propiedad «isLoadingDetail» con el valor o tipo «boolean».
  isLoadingDetail: boolean;
  // Esta línea sirve para declarar la propiedad «detailError» con el valor o tipo «string | null».
  detailError: string | null;

  // Esta línea sirve para declarar la propiedad «routineForEdit» con el valor o tipo «Routine | null».
  routineForEdit: Routine | null;
  // Esta línea sirve para declarar la propiedad «isLoadingRoutine» con el valor o tipo «boolean».
  isLoadingRoutine: boolean;

  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «string | null».
  submitError: string | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «addClient» con el valor o tipo «(email: string) => Promise<boolean>».
  addClient: (email: string) => Promise<boolean>;
  // Esta línea sirve para declarar la propiedad «loadDetail» con el valor o tipo «(trainerClientId: number) => Promise<void>».
  loadDetail: (trainerClientId: number) => Promise<void>;
  // Esta línea sirve para definir «updateStatus» con «(trainerClientId: number, status: Traine…».
  updateStatus: (trainerClientId: number, status: TrainerClientStatus) => Promise<boolean>;
  // Esta línea sirve para declarar la propiedad «loadRoutineForEdit» con el valor o tipo «(routineId: number) => Promise<void>».
  loadRoutineForEdit: (routineId: number) => Promise<void>;
  // Esta línea sirve para definir «createRoutine» con «(trainerClientId: number, payload: Manua…».
  createRoutine: (trainerClientId: number, payload: ManualRoutinePayload) => Promise<Routine | null>;
  // Esta línea sirve para definir «updateRoutine» con «(routineId: number, payload: ManualRouti…».
  updateRoutine: (routineId: number, payload: ManualRoutinePayload) => Promise<Routine | null>;
}

// Esta línea sirve para declarar «useTrainerClientsStore» con el valor «create<TrainerClientsStoreState>((set, get) => ({».
export const useTrainerClientsStore = create<TrainerClientsStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «clients» con el valor o tipo «[]».
  clients: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «selectedClient» con el valor o tipo «null».
  selectedClient: null,
  // Esta línea sirve para declarar la propiedad «activeRoutine» con el valor o tipo «null».
  activeRoutine: null,
  // Esta línea sirve para declarar la propiedad «isLoadingDetail» con el valor o tipo «false».
  isLoadingDetail: false,
  // Esta línea sirve para declarar la propiedad «detailError» con el valor o tipo «null».
  detailError: null,

  // Esta línea sirve para declarar la propiedad «routineForEdit» con el valor o tipo «null».
  routineForEdit: null,
  // Esta línea sirve para declarar la propiedad «isLoadingRoutine» con el valor o tipo «false».
  isLoadingRoutine: false,

  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
  submitError: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<TrainerClient[]>('/trainer/clients')» y guardar el resultado en «clients».
      const clients = await api.get<TrainerClient[]>('/trainer/clients');
      // Esta línea sirve para guardar en el store: «clients, isLoading: false })…».
      set({ clients, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus clientes.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «addClient» con el valor o tipo «async (email) => {».
  addClient: async (email) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/trainer/clients', { email });
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para definir «submitError» con «err instanceof Error ? err.message : 'No…».
        submitError: err instanceof Error ? err.message : 'No se pudo agregar al cliente.',
      });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «loadDetail» con el valor o tipo «async (trainerClientId) => {».
  loadDetail: async (trainerClientId) => {
    // Esta línea sirve para guardar en el store: «isLoadingDetail: true, detailError: null })…».
    set({ isLoadingDetail: true, detailError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<TrainerClient>(`/trainer/clients/$» y guardar el resultado en «envelope».
      const envelope = await api.getWithMeta<TrainerClient>(`/trainer/clients/${trainerClientId}`);
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «selectedClient» con el valor o tipo «envelope.data».
        selectedClient: envelope.data,
        // Esta línea sirve para definir «activeRoutine» con «(envelope.meta?.active_routine as Routin…».
        activeRoutine: (envelope.meta?.active_routine as Routine | null) ?? null,
        // Esta línea sirve para declarar la propiedad «isLoadingDetail» con el valor o tipo «false».
        isLoadingDetail: false,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingDetail» con el valor o tipo «false».
        isLoadingDetail: false,
        // Esta línea sirve para definir «detailError» con «err instanceof Error ? err.message : 'No…».
        detailError: err instanceof Error ? err.message : 'No se pudo cargar el cliente.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «updateStatus» con el valor o tipo «async (trainerClientId, status) => {».
  updateStatus: async (trainerClientId, status) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch(`/trainer/clients/${trainerClientId}`, { status });
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para esperar el resultado de «Promise.all».
      await Promise.all([get().loadDetail(trainerClientId), get().load()]);
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para definir «submitError» con «err instanceof Error ? err.message : 'No…».
        submitError: err instanceof Error ? err.message : 'No se pudo actualizar el estado.',
      });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «loadRoutineForEdit» con el valor o tipo «async (routineId) => {».
  loadRoutineForEdit: async (routineId) => {
    // Esta línea sirve para guardar en el store: «isLoadingRoutine: true })…».
    set({ isLoadingRoutine: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Routine>(`/trainer/routines/${routineId}`)» y guardar el resultado en «routine».
      const routine = await api.get<Routine>(`/trainer/routines/${routineId}`);
      // Esta línea sirve para guardar en el store: «routineForEdit: routine, isLoadingRoutine: false })…».
      set({ routineForEdit: routine, isLoadingRoutine: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isLoadingRoutine: false })…».
      set({ isLoadingRoutine: false });
    }
  },

  // Esta línea sirve para declarar la propiedad «createRoutine» con el valor o tipo «async (trainerClientId, payload) => {».
  createRoutine: async (trainerClientId, payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<Routine>(`/trainer/clients/${trainerClien» y guardar el resultado en «routine».
      const routine = await api.post<Routine>(`/trainer/clients/${trainerClientId}/routines`, payload);
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para devolver «routine».
      return routine;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para definir «submitError» con «err instanceof Error ? err.message : 'No…».
        submitError: err instanceof Error ? err.message : 'No se pudo crear la rutina.',
      });
      // Esta línea sirve para devolver null.
      return null;
    }
  },

  // Esta línea sirve para declarar la propiedad «updateRoutine» con el valor o tipo «async (routineId, payload) => {».
  updateRoutine: async (routineId, payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.patch<Routine>(`/trainer/routines/${routineId}» y guardar el resultado en «routine».
      const routine = await api.patch<Routine>(`/trainer/routines/${routineId}`, payload);
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para devolver «routine».
      return routine;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para definir «submitError» con «err instanceof Error ? err.message : 'No…».
        submitError: err instanceof Error ? err.message : 'No se pudo guardar la rutina.',
      });
      // Esta línea sirve para devolver null.
      return null;
    }
  },
}));
