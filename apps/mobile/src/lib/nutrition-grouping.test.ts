// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';
// Esta línea sirve para importar los tipos «FoodItem, MealLog» desde «@sanken/core».
import type { FoodItem, MealLog } from '@sanken/core';
// Esta línea sirve para importar «groupMealsByType» desde «./nutrition-grouping».
import { groupMealsByType } from './nutrition-grouping';

// Esta línea sirve para declarar el dato de ejemplo «food» de tipo «FoodItem».
const food: FoodItem = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «barcode» con el valor o tipo «null».
  barcode: null,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Manzana'».
  name: 'Manzana',
  // Esta línea sirve para declarar la propiedad «brand» con el valor o tipo «null».
  brand: null,
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «'fruit'».
  category: 'fruit',
  // Esta línea sirve para declarar la propiedad «calories_per_100g» con el valor o tipo «52».
  calories_per_100g: 52,
  // Esta línea sirve para declarar la propiedad «protein_per_100g» con el valor o tipo «0.3».
  protein_per_100g: 0.3,
  // Esta línea sirve para declarar la propiedad «carbs_per_100g» con el valor o tipo «14».
  carbs_per_100g: 14,
  // Esta línea sirve para declarar la propiedad «fat_per_100g» con el valor o tipo «0.2».
  fat_per_100g: 0.2,
  // Esta línea sirve para declarar la propiedad «serving_size_grams» con el valor o tipo «null».
  serving_size_grams: null,
  // Esta línea sirve para declarar la propiedad «serving_unit_singular» con el valor o tipo «null».
  serving_unit_singular: null,
  // Esta línea sirve para declarar la propiedad «serving_unit_plural» con el valor o tipo «null».
  serving_unit_plural: null,
};

// Esta línea sirve para declarar la función «makeMeal».
function makeMeal(overrides: Partial<MealLog>): MealLog {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
    id: 1,
    // Esta línea sirve para declarar la propiedad «food_item» con el valor o tipo «food».
    food_item: food,
    // Esta línea sirve para declarar la propiedad «meal_type» con el valor o tipo «'snack'».
    meal_type: 'snack',
    // Esta línea sirve para declarar la propiedad «quantity_grams» con el valor o tipo «100».
    quantity_grams: 100,
    // Esta línea sirve para declarar la propiedad «logged_at» con el valor o tipo «'2026-08-13'».
    logged_at: '2026-08-13',
    // Esta línea sirve para declarar la propiedad «calories» con el valor o tipo «52».
    calories: 52,
    // Esta línea sirve para declarar la propiedad «protein_g» con el valor o tipo «0.3».
    protein_g: 0.3,
    // Esta línea sirve para declarar la propiedad «carbs_g» con el valor o tipo «14».
    carbs_g: 14,
    // Esta línea sirve para declarar la propiedad «fat_g» con el valor o tipo «0.2».
    fat_g: 0.2,
    // Esta línea sirve para copiar las propiedades de «overrides».
    ...overrides,
  };
}

// Esta línea sirve para agrupar las pruebas de «groupMealsByType».
describe('groupMealsByType', () => {
  // Esta línea sirve para declarar la prueba que verifica que «buckets meals under every meal type, even when empty».
  it('buckets meals under every meal type, even when empty', () => {
    // Esta línea sirve para crear «groups» llamando a «groupMealsByType».
    const groups = groupMealsByType([]);
    // Esta línea sirve para verificar que «Object.keys(groups)» cumple «toEqual».
    expect(Object.keys(groups)).toEqual(['breakfast', 'lunch', 'dinner', 'snack']);
    // Esta línea sirve para verificar que «groups.breakfast» cumple «toEqual».
    expect(groups.breakfast).toEqual([]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «groups each meal under its own meal_type».
  it('groups each meal under its own meal_type', () => {
    // Esta línea sirve para crear «breakfast» llamando a «makeMeal».
    const breakfast = makeMeal({ id: 1, meal_type: 'breakfast' });
    // Esta línea sirve para crear «lunchA» llamando a «makeMeal».
    const lunchA = makeMeal({ id: 2, meal_type: 'lunch' });
    // Esta línea sirve para crear «lunchB» llamando a «makeMeal».
    const lunchB = makeMeal({ id: 3, meal_type: 'lunch' });

    // Esta línea sirve para crear «groups» llamando a «groupMealsByType».
    const groups = groupMealsByType([breakfast, lunchA, lunchB]);

    // Esta línea sirve para verificar que «groups.breakfast» cumple «toEqual».
    expect(groups.breakfast).toEqual([breakfast]);
    // Esta línea sirve para verificar que «groups.lunch» cumple «toEqual».
    expect(groups.lunch).toEqual([lunchA, lunchB]);
    // Esta línea sirve para verificar que «groups.dinner» cumple «toEqual».
    expect(groups.dinner).toEqual([]);
  });
});
