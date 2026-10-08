/** Emoji por categoría de food_items (mismas claves que config('nutrition.meal_categories') en el backend). Puramente visual, comparte mobile/web para que un mismo alimento se vea igual en ambos. */
// Esta línea sirve para declarar el emoji de cada categoría de alimento.
export const FOOD_CATEGORY_ICONS: Record<string, string> = {
  // Esta línea sirve para asignar el emoji de proteína.
  protein: '🍗',
  // Esta línea sirve para asignar el emoji de carbohidratos.
  carb: '🍚',
  // Esta línea sirve para asignar el emoji de grasas.
  fat: '🥑',
  // Esta línea sirve para asignar el emoji de vegetales.
  vegetable: '🥦',
  // Esta línea sirve para asignar el emoji de frutas.
  fruit: '🍎',
  // Esta línea sirve para asignar el emoji de lácteos.
  dairy: '🥛',
};

// Esta línea sirve para declarar la función que devuelve el emoji de una categoría.
export function foodCategoryIcon(category: string | null): string {
  // Esta línea sirve para devolver el emoji de la categoría o un plato genérico si no existe.
  return (category && FOOD_CATEGORY_ICONS[category]) || '🍽️';
}
