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
        $foodItem = $this->foodItem;
        $macros = $foodItem->macrosFor((float) $this->quantity_grams);

        return [
            'id' => $this->id,
            'food_item' => new FoodItemResource($foodItem),
            'quantity_grams' => (float) $this->quantity_grams,
            'calories' => round($macros['calories'], 1),
            'protein_g' => round($macros['protein_g'], 1),
            'carbs_g' => round($macros['carbs_g'], 1),
            'fat_g' => round($macros['fat_g'], 1),
        ];
    }
}
