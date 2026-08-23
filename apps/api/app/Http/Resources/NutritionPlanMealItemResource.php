<?php

namespace App\Http\Resources;

use App\Models\NutritionPlanMealItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlanMealItem */
class NutritionPlanMealItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $factor = (float) $this->quantity_grams / 100;
        $foodItem = $this->foodItem;

        return [
            'id' => $this->id,
            'food_item' => new FoodItemResource($foodItem),
            'quantity_grams' => (float) $this->quantity_grams,
            'calories' => round((float) $foodItem->calories_per_100g * $factor, 1),
            'protein_g' => round((float) $foodItem->protein_per_100g * $factor, 1),
            'carbs_g' => round((float) $foodItem->carbs_per_100g * $factor, 1),
            'fat_g' => round((float) $foodItem->fat_per_100g * $factor, 1),
        ];
    }
}
