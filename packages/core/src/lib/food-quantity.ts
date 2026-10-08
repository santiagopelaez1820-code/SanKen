/**
 * Traduce una cantidad en gramos a la unidad natural del alimento (p.ej.
 * "2 huevos") cuando el catálogo la conoce (food_items.serving_size_grams,
 * solo completo para el catálogo curado — ver FoodItemSeeder). Sin esa
 * unidad, cae a mostrar solo el gramaje. Se comparte entre mobile y web
 * porque ambos front muestran cantidades de plan/registro de comidas.
 */
// Esta línea sirve para declarar la información de porción de un alimento.
export interface FoodServingInfo {
  // Esta línea sirve para guardar el tamaño de la porción en gramos.
  serving_size_grams: number | null;
  // Esta línea sirve para guardar el nombre de la unidad en singular.
  serving_unit_singular: string | null;
  // Esta línea sirve para guardar el nombre de la unidad en plural.
  serving_unit_plural: string | null;
}

// Esta línea sirve para declarar cómo se muestra la cantidad de un alimento.
export interface FoodQuantityDisplay {
  /** p.ej. "2 huevos" — null si el alimento no tiene unidad natural conocida. */
  // Esta línea sirve para guardar el texto en porciones, o null si no aplica.
  servings: string | null;
  /** p.ej. "100 g" — siempre presente. */
  // Esta línea sirve para guardar el texto en gramos.
  grams: string;
}

// Esta línea sirve para declarar la función que redondea al medio más cercano.
function roundToHalf(value: number): number {
  // Esta línea sirve para devolver el valor redondeado a 0,5.
  return Math.round(value * 2) / 2;
}

// Esta línea sirve para declarar la función que formatea el número de porciones.
function formatCount(count: number): string {
  // Esta línea sirve para devolver entero sin decimales o con una coma decimal.
  return Number.isInteger(count) ? String(count) : count.toFixed(1).replace('.', ',');
}

// Esta línea sirve para declarar la función que calcula la cantidad a mostrar de un alimento.
export function formatFoodQuantity(food: FoodServingInfo, quantityGrams: number): FoodQuantityDisplay {
  // Esta línea sirve para crear el texto de gramos redondeado.
  const grams = `${Math.round(quantityGrams)} g`;

  // Esta línea sirve para revisar si faltan datos de la porción.
  if (
    // Esta línea sirve para revisar si no hay tamaño de porción.
    food.serving_size_grams === null ||
    // Esta línea sirve para revisar si el tamaño no es positivo.
    food.serving_size_grams <= 0 ||
    // Esta línea sirve para revisar si falta la unidad en singular.
    !food.serving_unit_singular ||
    // Esta línea sirve para revisar si falta la unidad en plural.
    !food.serving_unit_plural
  // Esta línea sirve para cerrar las condiciones.
  ) {
    // Esta línea sirve para devolver solo los gramos.
    return { servings: null, grams };
  }

  // Esta línea sirve para calcular cuántas porciones son, redondeadas a medio.
  const count = roundToHalf(quantityGrams / food.serving_size_grams);
  // Esta línea sirve para revisar si la cantidad no es positiva.
  if (count <= 0) {
    // Esta línea sirve para devolver solo los gramos.
    return { servings: null, grams };
  }

  // Esta línea sirve para elegir la unidad en singular o plural.
  const unit = count === 1 ? food.serving_unit_singular : food.serving_unit_plural;
  // Esta línea sirve para devolver las porciones con su unidad y los gramos.
  return { servings: `${formatCount(count)} ${unit}`, grams };
}

/** Línea única para UI compacta: "2 huevos (100 g)", o solo "100 g" sin unidad natural. */
// Esta línea sirve para declarar la función que arma una etiqueta compacta de cantidad.
export function formatFoodQuantityLabel(food: FoodServingInfo, quantityGrams: number): string {
  // Esta línea sirve para obtener las porciones y los gramos.
  const { servings, grams } = formatFoodQuantity(food, quantityGrams);
  // Esta línea sirve para devolver las porciones con los gramos entre paréntesis, o solo los gramos.
  return servings ? `${servings} (${grams})` : grams;
}

/** Gramos resultantes de N porciones de este alimento — para pasos +/- en el selector de cantidad. Null si no tiene unidad natural. */
// Esta línea sirve para declarar la función que convierte un número de porciones en gramos.
export function gramsForServingCount(food: FoodServingInfo, count: number): number | null {
  // Esta línea sirve para revisar si no hay tamaño de porción válido.
  if (food.serving_size_grams === null || food.serving_size_grams <= 0) {
    // Esta línea sirve para devolver null si no hay unidad natural.
    return null;
  }
  // Esta línea sirve para devolver los gramos redondeados a un decimal.
  return Math.round(food.serving_size_grams * count * 10) / 10;
}
