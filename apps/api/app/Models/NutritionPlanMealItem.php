<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionPlanMealItem extends Model
{
    protected $fillable = ['nutrition_plan_meal_id', 'food_item_id', 'quantity_grams'];

    protected function casts(): array
    {
        return [
            'quantity_grams' => 'decimal:2',
        ];
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(NutritionPlanMeal::class, 'nutrition_plan_meal_id');
    }

    public function foodItem(): BelongsTo
    {
        return $this->belongsTo(FoodItem::class);
    }
}
