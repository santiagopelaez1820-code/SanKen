<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NutritionPlanMeal extends Model
{
    protected $fillable = [
        'nutrition_plan_id', 'meal_type', 'order',
        'target_calories', 'target_protein_g', 'target_carbs_g', 'target_fat_g',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(NutritionPlan::class, 'nutrition_plan_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(NutritionPlanMealItem::class);
    }
}
