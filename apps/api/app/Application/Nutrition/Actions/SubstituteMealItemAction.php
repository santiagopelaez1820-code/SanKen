<?php

namespace App\Application\Nutrition\Actions;

use App\Models\FoodItem;
use App\Models\NutritionPlanMealItem;
use InvalidArgumentException;

/**
 * Sustituye un ítem del plan por otro alimento de la MISMA categoría (misma
 * regla que arma el plan, ver GenerateNutritionPlanAction), recalculando la
 * cantidad para preservar las calorías del ítem reemplazado -- así el
 * usuario puede variar sin descuadrar el objetivo de esa comida.
 */
class SubstituteMealItemAction
{
    public function substitute(NutritionPlanMealItem $item, int $newFoodItemId): NutritionPlanMealItem
    {
        $currentFood = $item->foodItem;

        $newFood = FoodItem::query()
            ->where('source', 'manual')
            ->findOrFail($newFoodItemId);

        if ($newFood->category === null || $newFood->category !== $currentFood->category) {
            throw new InvalidArgumentException('category_mismatch');
        }

        $currentCalories = (float) $currentFood->calories_per_100g * ((float) $item->quantity_grams / 100);
        $newPer100g = (float) $newFood->calories_per_100g;

        $newGrams = $newPer100g > 0
            ? round(($currentCalories / $newPer100g) * 100, 1)
            : (float) $item->quantity_grams;

        $item->update([
            'food_item_id' => $newFood->id,
            'quantity_grams' => max(20.0, min($newGrams, 500.0)),
        ]);

        return $item->fresh('foodItem');
    }
}
