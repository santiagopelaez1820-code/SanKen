/**
 * Traduce una cantidad en gramos a la unidad natural del alimento (p.ej.
 * "2 huevos") cuando el catálogo la conoce (food_items.serving_size_grams,
 * solo completo para el catálogo curado — ver FoodItemSeeder). Sin esa
 * unidad, cae a mostrar solo el gramaje. Se comparte entre mobile y web
 * porque ambos front muestran cantidades de plan/registro de comidas.
 */
export interface FoodServingInfo {
  serving_size_grams: number | null;
  serving_unit_singular: string | null;
  serving_unit_plural: string | null;
}

export interface FoodQuantityDisplay {
  /** p.ej. "2 huevos" — null si el alimento no tiene unidad natural conocida. */
  servings: string | null;
  /** p.ej. "100 g" — siempre presente. */
  grams: string;
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function formatCount(count: number): string {
  return Number.isInteger(count) ? String(count) : count.toFixed(1).replace('.', ',');
}

export function formatFoodQuantity(food: FoodServingInfo, quantityGrams: number): FoodQuantityDisplay {
  const grams = `${Math.round(quantityGrams)} g`;

  if (
    food.serving_size_grams === null ||
    food.serving_size_grams <= 0 ||
    !food.serving_unit_singular ||
    !food.serving_unit_plural
  ) {
    return { servings: null, grams };
  }

  const count = roundToHalf(quantityGrams / food.serving_size_grams);
  if (count <= 0) {
    return { servings: null, grams };
  }

  const unit = count === 1 ? food.serving_unit_singular : food.serving_unit_plural;
  return { servings: `${formatCount(count)} ${unit}`, grams };
}

/** Línea única para UI compacta: "2 huevos (100 g)", o solo "100 g" sin unidad natural. */
export function formatFoodQuantityLabel(food: FoodServingInfo, quantityGrams: number): string {
  const { servings, grams } = formatFoodQuantity(food, quantityGrams);
  return servings ? `${servings} (${grams})` : grams;
}

/** Gramos resultantes de N porciones de este alimento — para pasos +/- en el selector de cantidad. Null si no tiene unidad natural. */
export function gramsForServingCount(food: FoodServingInfo, count: number): number | null {
  if (food.serving_size_grams === null || food.serving_size_grams <= 0) {
    return null;
  }
  return Math.round(food.serving_size_grams * count * 10) / 10;
}
