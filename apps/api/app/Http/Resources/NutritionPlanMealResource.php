<?php

namespace App\Http\Resources;

use App\Models\NutritionPlanMeal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlanMeal */
class NutritionPlanMealResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meal_type' => $this->meal_type,
            'order' => $this->order,
            'target_calories' => $this->target_calories,
            'target_protein_g' => $this->target_protein_g,
            'target_carbs_g' => $this->target_carbs_g,
            'target_fat_g' => $this->target_fat_g,
            'items' => NutritionPlanMealItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
