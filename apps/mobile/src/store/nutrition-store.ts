import { create } from 'zustand';
import type {
  DailyNutritionSummary,
  FoodItem,
  MealLog,
  MealType,
  MealsResponse,
  NutritionPlan,
  NutritionTargets,
} from '@sanken/core';
import { ApiError } from '@sanken/core';

import { api } from '@/lib/api';

interface NutritionStoreState {
  targets: NutritionTargets | null;
  isLoadingTargets: boolean;
  profileIncomplete: boolean;
  targetsError: string | null;

  meals: MealLog[];
  summary: DailyNutritionSummary | null;
  isLoadingMeals: boolean;

  searchResults: FoodItem[];
  isSearching: boolean;
  searchError: string | null;

  plan: NutritionPlan | null;
  planMissing: boolean;
  isLoadingPlan: boolean;
  isGeneratingPlan: boolean;
  substituteResults: FoodItem[];
  isSearchingSubstitutes: boolean;
  isSubstituting: boolean;
  substituteError: string | null;

  loadTargets: () => Promise<void>;
  loadMeals: () => Promise<void>;
  search: (query: string) => Promise<void>;
  findByBarcode: (barcode: string) => Promise<FoodItem | null>;
  logMeal: (foodItemId: number, mealType: MealType, quantityGrams: number) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  clearSearch: () => void;

  loadPlan: () => Promise<void>;
  generatePlan: () => Promise<void>;
  searchSubstitutes: (query: string, category: string | null) => Promise<void>;
  substituteItem: (itemId: number, foodItemId: number) => Promise<void>;
  clearSubstitutes: () => void;
}

export const useNutritionStore = create<NutritionStoreState>((set, get) => ({
  targets: null,
  isLoadingTargets: false,
  profileIncomplete: false,
  targetsError: null,

  meals: [],
  summary: null,
  isLoadingMeals: false,

  searchResults: [],
  isSearching: false,
  searchError: null,

  plan: null,
  planMissing: false,
  isLoadingPlan: false,
  isGeneratingPlan: false,
  substituteResults: [],
  isSearchingSubstitutes: false,
  isSubstituting: false,
  substituteError: null,

  loadTargets: async () => {
    set({ isLoadingTargets: true, targetsError: null, profileIncomplete: false });
    try {
      const targets = await api.get<NutritionTargets>('/nutrition/targets');
      set({ targets, isLoadingTargets: false });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        set({ isLoadingTargets: false, profileIncomplete: true, targets: null });
        return;
      }
      set({ isLoadingTargets: false, targetsError: err instanceof Error ? err.message : 'No se pudieron cargar tus objetivos.' });
    }
  },

  loadMeals: async () => {
    set({ isLoadingMeals: true });
    try {
      const res = await api.getWithMeta<MealLog[]>('/nutrition/meals');
      set({
        meals: res.data,
        summary: (res.meta as MealsResponse['meta'] | undefined)?.summary ?? null,
        isLoadingMeals: false,
      });
    } catch {
      set({ isLoadingMeals: false });
    }
  },

  search: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true, searchError: null });
    try {
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`);
      set({ searchResults: results, isSearching: false });
    } catch (err) {
      set({ isSearching: false, searchError: err instanceof Error ? err.message : 'No se pudo buscar el alimento.' });
    }
  },

  findByBarcode: async (barcode) => {
    try {
      return await api.get<FoodItem>(`/nutrition/foods?barcode=${encodeURIComponent(barcode)}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },

  logMeal: async (foodItemId, mealType, quantityGrams) => {
    await api.post('/nutrition/meals', { food_item_id: foodItemId, meal_type: mealType, quantity_grams: quantityGrams });
    await get().loadMeals();
  },

  deleteMeal: async (id) => {
    await api.delete(`/nutrition/meals/${id}`);
    await get().loadMeals();
  },

  clearSearch: () => set({ searchResults: [], searchError: null }),

  loadPlan: async () => {
    set({ isLoadingPlan: true, planMissing: false });
    try {
      const plan = await api.get<NutritionPlan>('/nutrition/plan');
      set({ plan, isLoadingPlan: false });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        set({ plan: null, planMissing: true, isLoadingPlan: false });
        return;
      }
      set({ isLoadingPlan: false });
    }
  },

  generatePlan: async () => {
    set({ isGeneratingPlan: true });
    try {
      const plan = await api.post<NutritionPlan>('/nutrition/plan');
      set({ plan, planMissing: false, isGeneratingPlan: false });
    } catch (err) {
      set({ isGeneratingPlan: false });
      throw err;
    }
  },

  searchSubstitutes: async (query, category) => {
    if (!query.trim()) {
      set({ substituteResults: [] });
      return;
    }
    set({ isSearchingSubstitutes: true, substituteError: null });
    try {
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`);
      set({ substituteResults: results.filter((food) => food.category === category), isSearchingSubstitutes: false });
    } catch (err) {
      set({
        isSearchingSubstitutes: false,
        substituteError: err instanceof Error ? err.message : 'No se pudo buscar la alternativa.',
      });
    }
  },

  substituteItem: async (itemId, foodItemId) => {
    set({ isSubstituting: true });
    try {
      await api.patch(`/nutrition/plan/items/${itemId}`, { food_item_id: foodItemId });
      set({ isSubstituting: false, substituteResults: [] });
      await get().loadPlan();
    } catch (err) {
      set({ isSubstituting: false });
      throw err;
    }
  },

  clearSubstitutes: () => set({ substituteResults: [], substituteError: null }),
}));
