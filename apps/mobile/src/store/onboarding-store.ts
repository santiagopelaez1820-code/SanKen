import { create } from 'zustand';
import type { OnboardingAnswers, OnboardingQuestions, OnboardingState } from '@sanken/core';

import { api } from '@/lib/api';

interface OnboardingStoreState {
  questions: OnboardingQuestions | null;
  answers: OnboardingAnswers;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  loadQuestions: () => Promise<void>;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  submit: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  questions: null,
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
