/** Emoji por categoría de food_items (mismas claves que config('nutrition.meal_categories') en el backend). Puramente visual, comparte mobile/web para que un mismo alimento se vea igual en ambos. */
export const FOOD_CATEGORY_ICONS: Record<string, string> = {
  protein: '🍗',
  carb: '🍚',
  fat: '🥑',
  vegetable: '🥦',
  fruit: '🍎',
  dairy: '🥛',
};

export function foodCategoryIcon(category: string | null): string {
  return (category && FOOD_CATEGORY_ICONS[category]) || '🍽️';
}
