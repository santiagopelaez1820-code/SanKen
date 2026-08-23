<?php

namespace App\Http\Resources;

use App\Models\NutritionPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlan */
class NutritionPlanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'calories' => $this->calories,
            'protein_g' => $this->protein_g,
            'carbs_g' => $this->carbs_g,
            'fat_g' => $this->fat_g,
            'generated_at' => $this->created_at->toIso8601String(),
            'meals' => NutritionPlanMealResource::collection($this->whenLoaded('meals')),
        ];
    }
}
