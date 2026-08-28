<?php

namespace App\Http\Resources;

use App\Models\MealLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin MealLog */
class MealLogResource extends JsonResource
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
            'meal_type' => $this->meal_type,
            'quantity_grams' => (float) $this->quantity_grams,
            'logged_at' => $this->logged_at->toDateString(),
            'calories' => round($macros['calories'], 1),
            'protein_g' => round($macros['protein_g'], 1),
            'carbs_g' => round($macros['carbs_g'], 1),
            'fat_g' => round($macros['fat_g'], 1),
        ];
    }
}
