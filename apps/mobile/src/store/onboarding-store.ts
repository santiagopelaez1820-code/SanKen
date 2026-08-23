import { create } from 'zustand';
import type {
  OnboardingAnswers,
  OnboardingCity,
  OnboardingQuestions,
  OnboardingState,
  OnboardingStateOption,
} from '@sanken/core';

import { api } from '@/lib/api';

interface OnboardingStoreState {
  questions: OnboardingQuestions | null;
  states: OnboardingStateOption[];
  isLoadingStates: boolean;
  cities: OnboardingCity[];
  isLoadingCities: boolean;
  answers: OnboardingAnswers;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  loadQuestions: () => Promise<void>;
  loadStates: (countryId: number) => Promise<void>;
  /**
   * Un estado/departamento con datos reales puede tener miles de ciudades
   * (ver ImportLocationData en el backend) — nunca se cargan todas de una.
   * `search` (opcional) se manda tal cual al server; el caller (ubicacion.tsx)
   * es responsable de debouncear las tecleadas del usuario antes de llamar acá.
   */
  loadCities: (stateId: number, search?: string) => Promise<void>;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  submit: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  questions: null,
  states: [],
  isLoadingStates: false,
  cities: [],
  isLoadingCities: false,
  answers: {},
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const questions = await api.get<OnboardingQuestions>('/onboarding/questions');
      set({ questions, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el cuestionario.' });
    }
  },

  loadStates: async (countryId) => {
    set({ isLoadingStates: true, states: [], cities: [] });
    try {
      const states = await api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`);
      set({ states, isLoadingStates: false });
    } catch {
      set({ isLoadingStates: false });
    }
  },

  loadCities: async (stateId, search) => {
    // Solo se limpia la lista visible cuando es una carga "fresca" (recién
    // elegido el estado, sin término de búsqueda todavía) — mientras el
    // usuario tipea, se deja la última tanda de resultados en pantalla
    // hasta que la nueva búsqueda resuelva, para que no parpadee vacío en
    // cada tecla.
    set({ isLoadingCities: true, ...(search ? {} : { cities: [] }) });
    try {
      const trimmed = search?.trim();
      const qs = trimmed ? `?search=${encodeURIComponent(trimmed)}` : '';
      const cities = await api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities${qs}`);
      set({ cities, isLoadingCities: false });
    } catch {
      set({ isLoadingCities: false });
    }
  },

  setAnswer: (key, value) => {
    set((state) => ({ answers: { ...state.answers, [key]: value } }));
  },

  submit: async () => {
    const { answers } = get();
    set({ isSubmitting: true, error: null });
    try {
      await api.post<OnboardingState>('/onboarding', answers);
      set({ isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudieron guardar tus respuestas.' });
      throw err;
    }
  },

  complete: async () => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post<OnboardingState>('/onboarding/complete');
      set({ isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'Faltan respuestas por completar.' });
      throw err;
    }
  },
}));
