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
        $factor = (float) $this->quantity_grams / 100;
        $foodItem = $this->foodItem;

        return [
            'id' => $this->id,
            'food_item' => new FoodItemResource($foodItem),
            'meal_type' => $this->meal_type,
            'quantity_grams' => (float) $this->quantity_grams,
            'logged_at' => $this->logged_at->toDateString(),
            'calories' => round((float) $foodItem->calories_per_100g * $factor, 1),
            'protein_g' => round((float) $foodItem->protein_per_100g * $factor, 1),
            'carbs_g' => round((float) $foodItem->carbs_per_100g * $factor, 1),
            'fat_g' => round((float) $foodItem->fat_per_100g * $factor, 1),
        ];
    }
}
