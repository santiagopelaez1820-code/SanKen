import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { FoodItem, MealLog, NutritionTargets } from '@sanken/core';
import { ApiError } from '@sanken/core';

import { api } from '@/lib/api';
import { useNutritionStore } from './nutrition-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const targets: NutritionTargets = { calories: 3000, protein_g: 160, carbs_g: 400, fat_g: 85, water_ml: 2800 };

const food: FoodItem = {
  id: 1,
  barcode: '3017620422003',
  name: 'Nutella',
  brand: 'Ferrero',
  calories_per_100g: 539,
  protein_per_100g: 6.3,
  carbs_per_100g: 57.5,
  fat_per_100g: 30.9,
};

const meal: MealLog = {
  id: 1,
  food_item: food,
  meal_type: 'lunch',
  quantity_grams: 100,
  logged_at: '2026-08-13',
  calories: 539,
  protein_g: 6.3,
  carbs_g: 57.5,
  fat_g: 30.9,
};

beforeEach(() => {
  jest.clearAllMocks();
  useNutritionStore.setState({
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
  });
});

describe('loadTargets', () => {
  it('stores the fetched targets', async () => {
    mockedApi.get.mockResolvedValueOnce(targets);

    await useNutritionStore.getState().loadTargets();

    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/targets');
    expect(useNutritionStore.getState().targets).toEqual(targets);
    expect(useNutritionStore.getState().profileIncomplete).toBe(false);
  });

  it('flags an incomplete profile on 404 instead of setting a generic error', async () => {
    mockedApi.get.mockRejectedValueOnce(new ApiError(404, { message: 'Completá tu perfil.' }));

    await useNutritionStore.getState().loadTargets();

    expect(useNutritionStore.getState().profileIncomplete).toBe(true);
    expect(useNutritionStore.getState().targets).toBeNull();
    expect(useNutritionStore.getState().targetsError).toBeNull();
  });
});

describe('loadMeals', () => {
  it('stores the meals and the daily summary from meta', async () => {
    const summary = { calories: 539, protein_g: 6.3, carbs_g: 57.5, fat_g: 30.9 };
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [meal], meta: { date: '2026-08-13', summary } });

    await useNutritionStore.getState().loadMeals();

    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
    expect(useNutritionStore.getState().meals).toEqual([meal]);
    expect(useNutritionStore.getState().summary).toEqual(summary);
  });
});

describe('search', () => {
  it('fetches matching foods for a non-empty query', async () => {
    mockedApi.get.mockResolvedValueOnce([food]);

    await useNutritionStore.getState().search('nutella');

    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/foods?q=nutella');
    expect(useNutritionStore.getState().searchResults).toEqual([food]);
  });

  it('clears results without calling the API for a blank query', async () => {
    useNutritionStore.setState({ searchResults: [food] });

    await useNutritionStore.getState().search('   ');

    expect(mockedApi.get).not.toHaveBeenCalled();
    expect(useNutritionStore.getState().searchResults).toEqual([]);
  });
});

describe('findByBarcode', () => {
  it('returns the matching food item', async () => {
    mockedApi.get.mockResolvedValueOnce(food);

    const result = await useNutritionStore.getState().findByBarcode('3017620422003');

    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/foods?barcode=3017620422003');
    expect(result).toEqual(food);
  });

  it('returns null when the barcode is not found', async () => {
    mockedApi.get.mockRejectedValueOnce(new ApiError(404, { message: 'not found' }));

    const result = await useNutritionStore.getState().findByBarcode('0000000000000');

    expect(result).toBeNull();
  });
});

describe('logMeal / deleteMeal', () => {
  it('posts a new meal log and reloads the meals list', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [meal], meta: { date: '2026-08-13', summary: {} } });

    await useNutritionStore.getState().logMeal(food.id, 'lunch', 100);

    expect(mockedApi.post).toHaveBeenCalledWith('/nutrition/meals', {
      food_item_id: food.id,
      meal_type: 'lunch',
      quantity_grams: 100,
    });
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
  });

  it('deletes a meal log and reloads the meals list', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { date: '2026-08-13', summary: {} } });

    await useNutritionStore.getState().deleteMeal(meal.id);

    expect(mockedApi.delete).toHaveBeenCalledWith(`/nutrition/meals/${meal.id}`);
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
  });
});
