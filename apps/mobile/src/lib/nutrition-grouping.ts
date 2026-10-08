// Esta línea sirve para importar los tipos «MealLog, MealType» desde «@sanken/core».
import type { MealLog, MealType } from '@sanken/core';

// Esta línea sirve para declarar «MEAL_TYPE_ORDER» con el valor «['breakfast', 'lunch', 'dinner', 'snack']».
export const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

// Esta línea sirve para declarar «MEAL_TYPE_LABELS» con el valor «{».
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  // Esta línea sirve para declarar la propiedad «breakfast» con el valor o tipo «'Desayuno'».
  breakfast: 'Desayuno',
  // Esta línea sirve para declarar la propiedad «lunch» con el valor o tipo «'Almuerzo'».
  lunch: 'Almuerzo',
  // Esta línea sirve para declarar la propiedad «dinner» con el valor o tipo «'Cena'».
  dinner: 'Cena',
  // Esta línea sirve para declarar la propiedad «snack» con el valor o tipo «'Snack'».
  snack: 'Snack',
};

// Esta línea sirve para declarar la función «groupMealsByType».
export function groupMealsByType(meals: MealLog[]): Record<MealType, MealLog[]> {
  // Esta línea sirve para extraer «roups: Record<MealType, MealLog[]» de «{ breakfast: [], lunch: [], dinner: [], ».
  const groups: Record<MealType, MealLog[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
  // Esta línea sirve para recorrer los elementos con «const meal of meals».
  for (const meal of meals) {
    // Esta línea sirve para agregar la comida a su grupo.
    groups[meal.meal_type].push(meal);
  }
  // Esta línea sirve para devolver «groups».
  return groups;
}
