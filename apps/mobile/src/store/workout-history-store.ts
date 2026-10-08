// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «WorkoutSession» desde «@sanken/core».
import type { WorkoutSession } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';

// Esta línea sirve para declarar la interfaz «PageMeta».
interface PageMeta {
  // Esta línea sirve para declarar la propiedad «current_page» con el valor o tipo «number».
  current_page: number;
  // Esta línea sirve para declarar la propiedad «last_page» con el valor o tipo «number».
  last_page: number;
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «number».
  total: number;
}

// Esta línea sirve para declarar la interfaz «WorkoutHistoryStoreState».
interface WorkoutHistoryStoreState {
  // Esta línea sirve para declarar la propiedad «sessions» con el valor o tipo «WorkoutSession[]».
  sessions: WorkoutSession[];
  // Esta línea sirve para declarar la propiedad «meta» con el valor o tipo «PageMeta | null».
  meta: PageMeta | null;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «isLoadingMore» con el valor o tipo «boolean».
  isLoadingMore: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadMore» con el valor o tipo «() => Promise<void>».
  loadMore: () => Promise<void>;
}

// Esta línea sirve para declarar «useWorkoutHistoryStore» con el valor «create<WorkoutHistoryStoreState>((set, get) => ({».
export const useWorkoutHistoryStore = create<WorkoutHistoryStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «sessions» con el valor o tipo «[]».
  sessions: [],
  // Esta línea sirve para declarar la propiedad «meta» con el valor o tipo «null».
  meta: null,
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «isLoadingMore» con el valor o tipo «false».
  isLoadingMore: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para extraer «adSession» de «get().sessions.length > 0».
    const hadSessions = get().sessions.length > 0;
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<WorkoutSession[]>('/workout-sessio» y guardar el resultado en «envelope».
      const envelope = await api.getWithMeta<WorkoutSession[]>('/workout-sessions');
      // Esta línea sirve para guardar en el store: «sessions: envelope.data, meta: (envelope.meta as unknown as …».
      set({ sessions: envelope.data, meta: (envelope.meta as unknown as PageMeta) ?? null, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para extraer «essag» de «err instanceof Error ? err.message : 'No».
      const message = err instanceof Error ? err.message : 'No se pudo cargar tu historial.';
      // Si ya había sesiones cargadas, la pantalla de Historial no muestra el
      // ErrorState (solo aparece cuando la lista está vacía) — sin este toast,
      // una recarga fallida (por ejemplo el refreshHistory() al completar un
      // entrenamiento) quedaba sin ningún aviso, mostrando la lista vieja
      // como si la recarga hubiera funcionado.
      // Esta línea sirve para revisar si «hadSessions».
      if (hadSessions) {
        // Esta línea sirve para llamar a «useToastStore.getState» con «).show(message».
        useToastStore.getState().show(message);
      }
      // Esta línea sirve para guardar en el store: «isLoading: false, error: message })…».
      set({ isLoading: false, error: message });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadMore» con el valor o tipo «async () => {».
  loadMore: async () => {
    // Esta línea sirve para extraer «meta, isLoadingMore, sessions» de «get()».
    const { meta, isLoadingMore, sessions } = get();
    // Esta línea sirve para salir si ya se está cargando más o no quedan páginas.
    if (isLoadingMore || !meta || meta.current_page >= meta.last_page) return;

    // Esta línea sirve para guardar en el store: «isLoadingMore: true })…».
    set({ isLoadingMore: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «extPag» de «meta.current_page + 1».
      const nextPage = meta.current_page + 1;
      // Esta línea sirve para esperar «api.getWithMeta<WorkoutSession[]>(`/workout-sessio» y guardar el resultado en «envelope».
      const envelope = await api.getWithMeta<WorkoutSession[]>(`/workout-sessions?page=${nextPage}`);
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «sessions» con el valor o tipo «[...sessions, ...envelope.data]».
        sessions: [...sessions, ...envelope.data],
        // Esta línea sirve para definir «meta» con «(envelope.meta as unknown as PageMeta) ?…».
        meta: (envelope.meta as unknown as PageMeta) ?? meta,
        // Esta línea sirve para declarar la propiedad «isLoadingMore» con el valor o tipo «false».
        isLoadingMore: false,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isLoadingMore: false })…».
      set({ isLoadingMore: false });
    }
  },
}));
