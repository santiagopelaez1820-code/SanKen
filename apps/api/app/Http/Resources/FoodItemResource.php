<?php

namespace App\Http\Resources;

use App\Models\FoodItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FoodItem */
class FoodItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'barcode' => $this->barcode,
            'name' => $this->name,
            'brand' => $this->brand,
            'category' => $this->category,
            'calories_per_100g' => (float) $this->calories_per_100g,
            'protein_per_100g' => (float) $this->protein_per_100g,
            'carbs_per_100g' => (float) $this->carbs_per_100g,
            'fat_per_100g' => (float) $this->fat_per_100g,
        ];
    }
}
