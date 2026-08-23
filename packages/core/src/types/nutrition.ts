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
  category: string | null;
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

export interface NutritionPlanMealItem {
  id: number;
  food_item: FoodItem;
  quantity_grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface NutritionPlanMeal {
  id: number;
  meal_type: MealType;
  order: number;
  target_calories: number;
  target_protein_g: number;
  target_carbs_g: number;
  target_fat_g: number;
  items: NutritionPlanMealItem[];
}

/** GET/POST /nutrition/plan */
export interface NutritionPlan {
  id: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  generated_at: string;
  meals: NutritionPlanMeal[];
}

/** PATCH /nutrition/plan/items/:id */
export interface SubstituteMealItemPayload {
  food_item_id: number;
}
