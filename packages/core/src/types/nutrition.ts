// Esta línea sirve para declarar el tipo «MealType» como «'breakfast' | 'lunch' | 'dinner' | 'snack'».
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Esta línea sirve para declarar la interfaz «NutritionTargets».
export interface NutritionTargets {
  // Esta línea sirve para declarar el campo «calories» de tipo «number».
  calories: number;
  // Esta línea sirve para declarar el campo «protein_g» de tipo «number».
  protein_g: number;
  // Esta línea sirve para declarar el campo «carbs_g» de tipo «number».
  carbs_g: number;
  // Esta línea sirve para declarar el campo «fat_g» de tipo «number».
  fat_g: number;
  // Esta línea sirve para declarar el campo «water_ml» de tipo «number».
  water_ml: number;
}

// Esta línea sirve para declarar la interfaz «FoodItem».
export interface FoodItem {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «barcode» de tipo «string | null».
  barcode: string | null;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «brand» de tipo «string | null».
  brand: string | null;
  // Esta línea sirve para declarar el campo «category» de tipo «string | null».
  category: string | null;
  // Esta línea sirve para declarar el campo «calories_per_100g» de tipo «number».
  calories_per_100g: number;
  // Esta línea sirve para declarar el campo «protein_per_100g» de tipo «number».
  protein_per_100g: number;
  // Esta línea sirve para declarar el campo «carbs_per_100g» de tipo «number».
  carbs_per_100g: number;
  // Esta línea sirve para declarar el campo «fat_per_100g» de tipo «number».
  fat_per_100g: number;
  /** Peso típico de una unidad natural de este alimento (p.ej. 1 huevo = 50g). Null si no aplica (productos de Open Food Facts). */
  // Esta línea sirve para declarar el campo «serving_size_grams» de tipo «number | null».
  serving_size_grams: number | null;
  /** p.ej. "huevo" */
  // Esta línea sirve para declarar el campo «serving_unit_singular» de tipo «string | null».
  serving_unit_singular: string | null;
  /** p.ej. "huevos" */
  // Esta línea sirve para declarar el campo «serving_unit_plural» de tipo «string | null».
  serving_unit_plural: string | null;
}

// Esta línea sirve para declarar la interfaz «MealLog».
export interface MealLog {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «food_item» de tipo «FoodItem».
  food_item: FoodItem;
  // Esta línea sirve para declarar el campo «meal_type» de tipo «MealType».
  meal_type: MealType;
  // Esta línea sirve para declarar el campo «quantity_grams» de tipo «number».
  quantity_grams: number;
  // Esta línea sirve para declarar el campo «logged_at» de tipo «string».
  logged_at: string;
  // Esta línea sirve para declarar el campo «calories» de tipo «number».
  calories: number;
  // Esta línea sirve para declarar el campo «protein_g» de tipo «number».
  protein_g: number;
  // Esta línea sirve para declarar el campo «carbs_g» de tipo «number».
  carbs_g: number;
  // Esta línea sirve para declarar el campo «fat_g» de tipo «number».
  fat_g: number;
}

// Esta línea sirve para declarar la interfaz «DailyNutritionSummary».
export interface DailyNutritionSummary {
  // Esta línea sirve para declarar el campo «calories» de tipo «number».
  calories: number;
  // Esta línea sirve para declarar el campo «protein_g» de tipo «number».
  protein_g: number;
  // Esta línea sirve para declarar el campo «carbs_g» de tipo «number».
  carbs_g: number;
  // Esta línea sirve para declarar el campo «fat_g» de tipo «number».
  fat_g: number;
}

/** GET /nutrition/meals?date= */
// Esta línea sirve para declarar la interfaz «MealsResponse».
export interface MealsResponse {
  // Esta línea sirve para declarar el campo «data» de tipo «MealLog[]».
  data: MealLog[];
  // Esta línea sirve para declarar el campo «meta» de tipo «{».
  meta: {
    // Esta línea sirve para declarar el campo «date» de tipo «string».
    date: string;
    // Esta línea sirve para declarar el campo «summary» de tipo «DailyNutritionSummary».
    summary: DailyNutritionSummary;
  };
}

// Esta línea sirve para declarar la interfaz «LogMealPayload».
export interface LogMealPayload {
  // Esta línea sirve para declarar el campo «food_item_id» de tipo «number».
  food_item_id: number;
  // Esta línea sirve para declarar el campo «meal_type» de tipo «MealType».
  meal_type: MealType;
  // Esta línea sirve para declarar el campo «quantity_grams» de tipo «number».
  quantity_grams: number;
  // Esta línea sirve para declarar el campo opcional «logged_at» de tipo «string».
  logged_at?: string;
}

// Esta línea sirve para declarar la interfaz «NutritionPlanMealItem».
export interface NutritionPlanMealItem {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «food_item» de tipo «FoodItem».
  food_item: FoodItem;
  // Esta línea sirve para declarar el campo «quantity_grams» de tipo «number».
  quantity_grams: number;
  // Esta línea sirve para declarar el campo «calories» de tipo «number».
  calories: number;
  // Esta línea sirve para declarar el campo «protein_g» de tipo «number».
  protein_g: number;
  // Esta línea sirve para declarar el campo «carbs_g» de tipo «number».
  carbs_g: number;
  // Esta línea sirve para declarar el campo «fat_g» de tipo «number».
  fat_g: number;
}

// Esta línea sirve para declarar la interfaz «NutritionPlanMeal».
export interface NutritionPlanMeal {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «meal_type» de tipo «MealType».
  meal_type: MealType;
  // Esta línea sirve para declarar el campo «order» de tipo «number».
  order: number;
  // Esta línea sirve para declarar el campo «target_calories» de tipo «number».
  target_calories: number;
  // Esta línea sirve para declarar el campo «target_protein_g» de tipo «number».
  target_protein_g: number;
  // Esta línea sirve para declarar el campo «target_carbs_g» de tipo «number».
  target_carbs_g: number;
  // Esta línea sirve para declarar el campo «target_fat_g» de tipo «number».
  target_fat_g: number;
  // Esta línea sirve para declarar el campo «items» de tipo «NutritionPlanMealItem[]».
  items: NutritionPlanMealItem[];
}

/** GET/POST /nutrition/plan */
// Esta línea sirve para declarar la interfaz «NutritionPlan».
export interface NutritionPlan {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «calories» de tipo «number».
  calories: number;
  // Esta línea sirve para declarar el campo «protein_g» de tipo «number».
  protein_g: number;
  // Esta línea sirve para declarar el campo «carbs_g» de tipo «number».
  carbs_g: number;
  // Esta línea sirve para declarar el campo «fat_g» de tipo «number».
  fat_g: number;
  // Esta línea sirve para declarar el campo «generated_at» de tipo «string».
  generated_at: string;
  // Esta línea sirve para declarar el campo «meals» de tipo «NutritionPlanMeal[]».
  meals: NutritionPlanMeal[];
}

/** PATCH /nutrition/plan/items/:id */
// Esta línea sirve para declarar la interfaz «SubstituteMealItemPayload».
export interface SubstituteMealItemPayload {
  // Esta línea sirve para declarar el campo «food_item_id» de tipo «number».
  food_item_id: number;
}
