// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «OnboardingAnswers» en la lista.
  OnboardingAnswers,
  // Esta línea sirve para incluir el valor «OnboardingCity» en la lista.
  OnboardingCity,
  // Esta línea sirve para incluir el valor «OnboardingQuestions» en la lista.
  OnboardingQuestions,
  // Esta línea sirve para incluir el valor «OnboardingState» en la lista.
  OnboardingState,
  // Esta línea sirve para incluir el valor «OnboardingStateOption» en la lista.
  OnboardingStateOption,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «OnboardingStoreState».
interface OnboardingStoreState {
  // Esta línea sirve para declarar la propiedad «questions» con el valor o tipo «OnboardingQuestions | null».
  questions: OnboardingQuestions | null;
  // Esta línea sirve para declarar la propiedad «states» con el valor o tipo «OnboardingStateOption[]».
  states: OnboardingStateOption[];
  // Esta línea sirve para declarar la propiedad «isLoadingStates» con el valor o tipo «boolean».
  isLoadingStates: boolean;
  // Esta línea sirve para declarar la propiedad «cities» con el valor o tipo «OnboardingCity[]».
  cities: OnboardingCity[];
  // Esta línea sirve para declarar la propiedad «isLoadingCities» con el valor o tipo «boolean».
  isLoadingCities: boolean;
  // Esta línea sirve para declarar la propiedad «answers» con el valor o tipo «OnboardingAnswers».
  answers: OnboardingAnswers;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «loadQuestions» con el valor o tipo «() => Promise<void>».
  loadQuestions: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadStates» con el valor o tipo «(countryId: number) => Promise<void>».
  loadStates: (countryId: number) => Promise<void>;
  /**
   * Un estado/departamento con datos reales puede tener miles de ciudades
   * (ver ImportLocationData en el backend) — nunca se cargan todas de una.
   * `search` (opcional) se manda tal cual al server; el caller (ubicacion.tsx)
   * es responsable de debouncear las tecleadas del usuario antes de llamar acá.
   */
  // Esta línea sirve para definir «loadCities» con «(stateId: number, search?: string) => Pr…».
  loadCities: (stateId: number, search?: string) => Promise<void>;
  // Esta línea sirve para definir «setAnswer» con «<K extends keyof OnboardingAnswers>(key:…».
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  // Esta línea sirve para declarar la propiedad «submit» con el valor o tipo «() => Promise<void>».
  submit: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «complete» con el valor o tipo «() => Promise<void>».
  complete: () => Promise<void>;
}

// Esta línea sirve para declarar «useOnboardingStore» con el valor «create<OnboardingStoreState>((set, get) => ({».
export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «questions» con el valor o tipo «null».
  questions: null,
  // Esta línea sirve para declarar la propiedad «states» con el valor o tipo «[]».
  states: [],
  // Esta línea sirve para declarar la propiedad «isLoadingStates» con el valor o tipo «false».
  isLoadingStates: false,
  // Esta línea sirve para declarar la propiedad «cities» con el valor o tipo «[]».
  cities: [],
  // Esta línea sirve para declarar la propiedad «isLoadingCities» con el valor o tipo «false».
  isLoadingCities: false,
  // Esta línea sirve para declarar la propiedad «answers» con el valor o tipo «{}».
  answers: {},
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «loadQuestions» con el valor o tipo «async () => {».
  loadQuestions: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<OnboardingQuestions>('/onboarding/question» y guardar el resultado en «questions».
      const questions = await api.get<OnboardingQuestions>('/onboarding/questions');
      // Esta línea sirve para guardar en el store: «questions, isLoading: false })…».
      set({ questions, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el cuestionario.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadStates» con el valor o tipo «async (countryId) => {».
  loadStates: async (countryId) => {
    // Esta línea sirve para guardar en el store: «isLoadingStates: true, states: [], cities: [] })…».
    set({ isLoadingStates: true, states: [], cities: [] });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<OnboardingStateOption[]>(`/onboarding/coun» y guardar el resultado en «states».
      const states = await api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`);
      // Esta línea sirve para guardar en el store: «states, isLoadingStates: false })…».
      set({ states, isLoadingStates: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isLoadingStates: false })…».
      set({ isLoadingStates: false });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadCities» con el valor o tipo «async (stateId, search) => {».
  loadCities: async (stateId, search) => {
    // Solo se limpia la lista visible cuando es una carga "fresca" (recién
    // elegido el estado, sin término de búsqueda todavía) — mientras el
    // usuario tipea, se deja la última tanda de resultados en pantalla
    // hasta que la nueva búsqueda resuelva, para que no parpadee vacío en
    // cada tecla.
    // Esta línea sirve para guardar en el store: «isLoadingCities: true, ...(search ? {} : { cities: [] }) })…».
    set({ isLoadingCities: true, ...(search ? {} : { cities: [] }) });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «rimme» de «search?.trim()».
      const trimmed = search?.trim();
      // Esta línea sirve para extraer «» de «trimmed ? `?search=${encodeURIComponent(».
      const qs = trimmed ? `?search=${encodeURIComponent(trimmed)}` : '';
      // Esta línea sirve para esperar «api.get<OnboardingCity[]>(`/onboarding/states/${st» y guardar el resultado en «cities».
      const cities = await api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities${qs}`);
      // Esta línea sirve para guardar en el store: «cities, isLoadingCities: false })…».
      set({ cities, isLoadingCities: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isLoadingCities: false })…».
      set({ isLoadingCities: false });
    }
  },

  // Esta línea sirve para declarar la propiedad «setAnswer» con el valor o tipo «(key, value) => {».
  setAnswer: (key, value) => {
    // Esta línea sirve para guardar en el store a partir del estado anterior: «answers: { ...state.answers, [key]: value } }))…».
    set((state) => ({ answers: { ...state.answers, [key]: value } }));
  },

  // Esta línea sirve para declarar la propiedad «submit» con el valor o tipo «async () => {».
  submit: async () => {
    // Esta línea sirve para extraer «answers» de «get()».
    const { answers } = get();
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para enviar las respuestas del cuestionario a la API.
      await api.post<OnboardingState>('/onboarding', answers);
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudieron guardar tus respuestas.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «complete» con el valor o tipo «async () => {».
  complete: async () => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para marcar el onboarding como completado en la API.
      await api.post<OnboardingState>('/onboarding/complete');
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'Faltan respuestas por completar.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },
}));
