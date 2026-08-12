import { describe, expect, it } from '@jest/globals';
import type { FoodItem, MealLog } from '@sanken/core';
import { groupMealsByType } from './nutrition-grouping';

const food: FoodItem = {
  id: 1,
  barcode: null,
  name: 'Manzana',
  brand: null,
  calories_per_100g: 52,
  protein_per_100g: 0.3,
  carbs_per_100g: 14,
  fat_per_100g: 0.2,
};

function makeMeal(overrides: Partial<MealLog>): MealLog {
  return {
    id: 1,
    food_item: food,
    meal_type: 'snack',
    quantity_grams: 100,
    logged_at: '2026-08-13',
    calories: 52,
    protein_g: 0.3,
    carbs_g: 14,
    fat_g: 0.2,
    ...overrides,
  };
}

describe('groupMealsByType', () => {
  it('buckets meals under every meal type, even when empty', () => {
    const groups = groupMealsByType([]);
    expect(Object.keys(groups)).toEqual(['breakfast', 'lunch', 'dinner', 'snack']);
    expect(groups.breakfast).toEqual([]);
  });

  it('groups each meal under its own meal_type', () => {
    const breakfast = makeMeal({ id: 1, meal_type: 'breakfast' });
    const lunchA = makeMeal({ id: 2, meal_type: 'lunch' });
    const lunchB = makeMeal({ id: 3, meal_type: 'lunch' });

    const groups = groupMealsByType([breakfast, lunchA, lunchB]);

    expect(groups.breakfast).toEqual([breakfast]);
    expect(groups.lunch).toEqual([lunchA, lunchB]);
    expect(groups.dinner).toEqual([]);
  });
});
