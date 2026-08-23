import type { MealLog, MealType } from '@sanken/core';

export const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
};

export function groupMealsByType(meals: MealLog[]): Record<MealType, MealLog[]> {
  const groups: Record<MealType, MealLog[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
  for (const meal of meals) {
    groups[meal.meal_type].push(meal);
  }
  return groups;
}
