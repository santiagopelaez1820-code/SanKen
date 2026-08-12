export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_ml: number;
}

export interface FoodItem {
  id: number;
  barcode: string | null;
  name: string;
  brand: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

export interface MealLog {
  id: number;
  food_item: FoodItem;
  meal_type: MealType;
  quantity_grams: number;
  logged_at: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface DailyNutritionSummary {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

/** GET /nutrition/meals?date= */
export interface MealsResponse {
  data: MealLog[];
  meta: {
    date: string;
    summary: DailyNutritionSummary;
  };
}

export interface LogMealPayload {
  food_item_id: number;
  meal_type: MealType;
  quantity_grams: number;
  logged_at?: string;
}
