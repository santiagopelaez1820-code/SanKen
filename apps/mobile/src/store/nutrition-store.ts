// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «DailyNutritionSummary» en la lista.
  DailyNutritionSummary,
  // Esta línea sirve para incluir el valor «FoodItem» en la lista.
  FoodItem,
  // Esta línea sirve para incluir el valor «MealLog» en la lista.
  MealLog,
  // Esta línea sirve para incluir el valor «MealType» en la lista.
  MealType,
  // Esta línea sirve para incluir el valor «MealsResponse» en la lista.
  MealsResponse,
  // Esta línea sirve para incluir el valor «NutritionPlan» en la lista.
  NutritionPlan,
  // Esta línea sirve para incluir el valor «NutritionTargets» en la lista.
  NutritionTargets,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «NutritionStoreState».
interface NutritionStoreState {
  // Esta línea sirve para declarar la propiedad «targets» con el valor o tipo «NutritionTargets | null».
  targets: NutritionTargets | null;
  // Esta línea sirve para declarar la propiedad «isLoadingTargets» con el valor o tipo «boolean».
  isLoadingTargets: boolean;
  // Esta línea sirve para declarar la propiedad «profileIncomplete» con el valor o tipo «boolean».
  profileIncomplete: boolean;
  // Esta línea sirve para declarar la propiedad «targetsError» con el valor o tipo «string | null».
  targetsError: string | null;

  // Esta línea sirve para declarar la propiedad «meals» con el valor o tipo «MealLog[]».
  meals: MealLog[];
  // Esta línea sirve para declarar la propiedad «summary» con el valor o tipo «DailyNutritionSummary | null».
  summary: DailyNutritionSummary | null;
  // Esta línea sirve para declarar la propiedad «isLoadingMeals» con el valor o tipo «boolean».
  isLoadingMeals: boolean;

  // Esta línea sirve para declarar la propiedad «searchResults» con el valor o tipo «FoodItem[]».
  searchResults: FoodItem[];
  // Esta línea sirve para declarar la propiedad «isSearching» con el valor o tipo «boolean».
  isSearching: boolean;
  // Esta línea sirve para declarar la propiedad «searchError» con el valor o tipo «string | null».
  searchError: string | null;

  // Esta línea sirve para declarar la propiedad «plan» con el valor o tipo «NutritionPlan | null».
  plan: NutritionPlan | null;
  // Esta línea sirve para declarar la propiedad «planMissing» con el valor o tipo «boolean».
  planMissing: boolean;
  // Esta línea sirve para declarar la propiedad «isLoadingPlan» con el valor o tipo «boolean».
  isLoadingPlan: boolean;
  // Esta línea sirve para declarar la propiedad «isGeneratingPlan» con el valor o tipo «boolean».
  isGeneratingPlan: boolean;
  // Esta línea sirve para declarar la propiedad «planError» con el valor o tipo «string | null».
  planError: string | null;
  // Esta línea sirve para declarar la propiedad «substituteResults» con el valor o tipo «FoodItem[]».
  substituteResults: FoodItem[];
  // Esta línea sirve para declarar la propiedad «isSearchingSubstitutes» con el valor o tipo «boolean».
  isSearchingSubstitutes: boolean;
  // Esta línea sirve para declarar la propiedad «isSubstituting» con el valor o tipo «boolean».
  isSubstituting: boolean;
  // Esta línea sirve para declarar la propiedad «substituteError» con el valor o tipo «string | null».
  substituteError: string | null;

  // Esta línea sirve para declarar la propiedad «loadTargets» con el valor o tipo «() => Promise<void>».
  loadTargets: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadMeals» con el valor o tipo «() => Promise<void>».
  loadMeals: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «search» con el valor o tipo «(query: string) => Promise<void>».
  search: (query: string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «findByBarcode» con el valor o tipo «(barcode: string) => Promise<FoodItem | null>».
  findByBarcode: (barcode: string) => Promise<FoodItem | null>;
  // Esta línea sirve para definir «logMeal» con «(foodItemId: number, mealType: MealType,…».
  logMeal: (foodItemId: number, mealType: MealType, quantityGrams: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteMeal» con el valor o tipo «(id: number) => Promise<void>».
  deleteMeal: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «clearSearch» con el valor o tipo «() => void».
  clearSearch: () => void;

  // Esta línea sirve para declarar la propiedad «loadPlan» con el valor o tipo «() => Promise<void>».
  loadPlan: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «generatePlan» con el valor o tipo «() => Promise<void>».
  generatePlan: () => Promise<void>;
  // Esta línea sirve para definir «searchSubstitutes» con «(query: string, category: string | null)…».
  searchSubstitutes: (query: string, category: string | null) => Promise<void>;
  // Esta línea sirve para definir «substituteItem» con «(itemId: number, foodItemId: number) => …».
  substituteItem: (itemId: number, foodItemId: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «clearSubstitutes» con el valor o tipo «() => void».
  clearSubstitutes: () => void;
}

// Esta línea sirve para declarar «useNutritionStore» con el valor «create<NutritionStoreState>((set, get) => ({».
export const useNutritionStore = create<NutritionStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «targets» con el valor o tipo «null».
  targets: null,
  // Esta línea sirve para declarar la propiedad «isLoadingTargets» con el valor o tipo «false».
  isLoadingTargets: false,
  // Esta línea sirve para declarar la propiedad «profileIncomplete» con el valor o tipo «false».
  profileIncomplete: false,
  // Esta línea sirve para declarar la propiedad «targetsError» con el valor o tipo «null».
  targetsError: null,

  // Esta línea sirve para declarar la propiedad «meals» con el valor o tipo «[]».
  meals: [],
  // Esta línea sirve para declarar la propiedad «summary» con el valor o tipo «null».
  summary: null,
  // Esta línea sirve para declarar la propiedad «isLoadingMeals» con el valor o tipo «false».
  isLoadingMeals: false,

  // Esta línea sirve para declarar la propiedad «searchResults» con el valor o tipo «[]».
  searchResults: [],
  // Esta línea sirve para declarar la propiedad «isSearching» con el valor o tipo «false».
  isSearching: false,
  // Esta línea sirve para declarar la propiedad «searchError» con el valor o tipo «null».
  searchError: null,

  // Esta línea sirve para declarar la propiedad «plan» con el valor o tipo «null».
  plan: null,
  // Esta línea sirve para declarar la propiedad «planMissing» con el valor o tipo «false».
  planMissing: false,
  // Esta línea sirve para declarar la propiedad «isLoadingPlan» con el valor o tipo «false».
  isLoadingPlan: false,
  // Esta línea sirve para declarar la propiedad «isGeneratingPlan» con el valor o tipo «false».
  isGeneratingPlan: false,
  // Esta línea sirve para declarar la propiedad «planError» con el valor o tipo «null».
  planError: null,
  // Esta línea sirve para declarar la propiedad «substituteResults» con el valor o tipo «[]».
  substituteResults: [],
  // Esta línea sirve para declarar la propiedad «isSearchingSubstitutes» con el valor o tipo «false».
  isSearchingSubstitutes: false,
  // Esta línea sirve para declarar la propiedad «isSubstituting» con el valor o tipo «false».
  isSubstituting: false,
  // Esta línea sirve para declarar la propiedad «substituteError» con el valor o tipo «null».
  substituteError: null,

  // Esta línea sirve para declarar la propiedad «loadTargets» con el valor o tipo «async () => {».
  loadTargets: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingTargets: true, targetsError: null, profileIncomplet…».
    set({ isLoadingTargets: true, targetsError: null, profileIncomplete: false });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<NutritionTargets>('/nutrition/targets')» y guardar el resultado en «targets».
      const targets = await api.get<NutritionTargets>('/nutrition/targets');
      // Esta línea sirve para guardar en el store: «targets, isLoadingTargets: false })…».
      set({ targets, isLoadingTargets: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para revisar si «err instanceof ApiError && err.status === 404».
      if (err instanceof ApiError && err.status === 404) {
        // Esta línea sirve para guardar en el store: «isLoadingTargets: false, profileIncomplete: true, targets: n…».
        set({ isLoadingTargets: false, profileIncomplete: true, targets: null });
        // Esta línea sirve para terminar la función sin devolver nada.
        return;
      }
      // Esta línea sirve para guardar en el store: «isLoadingTargets: false, targetsError: err instanceof Error …».
      set({ isLoadingTargets: false, targetsError: err instanceof Error ? err.message : 'No se pudieron cargar tus objetivos.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadMeals» con el valor o tipo «async () => {».
  loadMeals: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingMeals: true })…».
    set({ isLoadingMeals: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<MealLog[]>('/nutrition/meals')» y guardar el resultado en «res».
      const res = await api.getWithMeta<MealLog[]>('/nutrition/meals');
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «meals» con el valor o tipo «res.data».
        meals: res.data,
        // Esta línea sirve para definir «summary» con «(res.meta as MealsResponse['meta'] | und…».
        summary: (res.meta as MealsResponse['meta'] | undefined)?.summary ?? null,
        // Esta línea sirve para declarar la propiedad «isLoadingMeals» con el valor o tipo «false».
        isLoadingMeals: false,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isLoadingMeals: false })…».
      set({ isLoadingMeals: false });
    }
  },

  // Esta línea sirve para declarar la propiedad «search» con el valor o tipo «async (query) => {».
  search: async (query) => {
    // Esta línea sirve para revisar si «!query.trim()».
    if (!query.trim()) {
      // Esta línea sirve para guardar en el store: «searchResults: [] })…».
      set({ searchResults: [] });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el store: «isSearching: true, searchError: null })…».
    set({ isSearching: true, searchError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<FoodItem[]>(`/nutrition/foods?q=${encodeUR» y guardar el resultado en «results».
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`);
      // Esta línea sirve para guardar en el store: «searchResults: results, isSearching: false })…».
      set({ searchResults: results, isSearching: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSearching: false, searchError: err instanceof Error ? err.…».
      set({ isSearching: false, searchError: err instanceof Error ? err.message : 'No se pudo buscar el alimento.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «findByBarcode» con el valor o tipo «async (barcode) => {».
  findByBarcode: async (barcode) => {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para buscar el alimento por código de barras en la API.
      return await api.get<FoodItem>(`/nutrition/foods?barcode=${encodeURIComponent(barcode)}`);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para devolver null si «err instanceof ApiError && err.status === 404».
      if (err instanceof ApiError && err.status === 404) return null;
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para definir «logMeal» con «async (foodItemId, mealType, quantityGra…».
  logMeal: async (foodItemId, mealType, quantityGrams) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/nutrition/meals', { food_item_id: foodItemId, meal_type: mealType, quantity_grams: quantityGrams });
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadMeals();
  },

  // Esta línea sirve para declarar la propiedad «deleteMeal» con el valor o tipo «async (id) => {».
  deleteMeal: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/nutrition/meals/${id}`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadMeals();
  },

  // Esta línea sirve para definir «clearSearch» con «() => set({ searchResults: [], searchErr…».
  clearSearch: () => set({ searchResults: [], searchError: null }),

  // Esta línea sirve para declarar la propiedad «loadPlan» con el valor o tipo «async () => {».
  loadPlan: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingPlan: true, planMissing: false, planError: null })…».
    set({ isLoadingPlan: true, planMissing: false, planError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<NutritionPlan>('/nutrition/plan')» y guardar el resultado en «plan».
      const plan = await api.get<NutritionPlan>('/nutrition/plan');
      // Esta línea sirve para guardar en el store: «plan, isLoadingPlan: false })…».
      set({ plan, isLoadingPlan: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para revisar si «err instanceof ApiError && err.status === 404».
      if (err instanceof ApiError && err.status === 404) {
        // Esta línea sirve para guardar en el store: «plan: null, planMissing: true, isLoadingPlan: false })…».
        set({ plan: null, planMissing: true, isLoadingPlan: false });
        // Esta línea sirve para terminar la función sin devolver nada.
        return;
      }
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingPlan» con el valor o tipo «false».
        isLoadingPlan: false,
        // Esta línea sirve para definir «planError» con «err instanceof Error ? err.message : 'No…».
        planError: err instanceof Error ? err.message : 'No se pudo cargar tu plan alimenticio.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «generatePlan» con el valor o tipo «async () => {».
  generatePlan: async () => {
    // Esta línea sirve para guardar en el store: «isGeneratingPlan: true, planError: null })…».
    set({ isGeneratingPlan: true, planError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<NutritionPlan>('/nutrition/plan')» y guardar el resultado en «plan».
      const plan = await api.post<NutritionPlan>('/nutrition/plan');
      // Esta línea sirve para guardar en el store: «plan, planMissing: false, isGeneratingPlan: false })…».
      set({ plan, planMissing: false, isGeneratingPlan: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isGeneratingPlan» con el valor o tipo «false».
        isGeneratingPlan: false,
        // Esta línea sirve para definir «planError» con «err instanceof Error ? err.message : 'No…».
        planError: err instanceof Error ? err.message : 'No se pudo generar tu plan alimenticio.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «searchSubstitutes» con el valor o tipo «async (query, category) => {».
  searchSubstitutes: async (query, category) => {
    // Esta línea sirve para revisar si «!query.trim()».
    if (!query.trim()) {
      // Esta línea sirve para guardar en el store: «substituteResults: [] })…».
      set({ substituteResults: [] });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el store: «isSearchingSubstitutes: true, substituteError: null })…».
    set({ isSearchingSubstitutes: true, substituteError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<FoodItem[]>(`/nutrition/foods?q=${encodeUR» y guardar el resultado en «results».
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`);
      // Esta línea sirve para guardar en el store: «substituteResults: results.filter((food) => food.category ==…».
      set({ substituteResults: results.filter((food) => food.category === category), isSearchingSubstitutes: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSearchingSubstitutes» con el valor o tipo «false».
        isSearchingSubstitutes: false,
        // Esta línea sirve para definir «substituteError» con «err instanceof Error ? err.message : 'No…».
        substituteError: err instanceof Error ? err.message : 'No se pudo buscar la alternativa.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «substituteItem» con el valor o tipo «async (itemId, foodItemId) => {».
  substituteItem: async (itemId, foodItemId) => {
    // Esta línea sirve para guardar en el store: «isSubstituting: true })…».
    set({ isSubstituting: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch(`/nutrition/plan/items/${itemId}`, { food_item_id: foodItemId });
      // Esta línea sirve para guardar en el store: «isSubstituting: false, substituteResults: [] })…».
      set({ isSubstituting: false, substituteResults: [] });
      // Esta línea sirve para esperar el resultado de «get».
      await get().loadPlan();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubstituting: false })…».
      set({ isSubstituting: false });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para definir «clearSubstitutes» con «() => set({ substituteResults: [], subst…».
  clearSubstitutes: () => set({ substituteResults: [], substituteError: null }),
}));
