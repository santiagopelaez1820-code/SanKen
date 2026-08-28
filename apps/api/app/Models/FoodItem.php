<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodItem extends Model
{
    protected $fillable = [
        'barcode',
        'name',
        'brand',
        'category',
        'calories_per_100g',
        'protein_per_100g',
        'carbs_per_100g',
        'fat_per_100g',
        'source',
        'source_id',
    ];

    protected function casts(): array
    {
        return [
            'calories_per_100g' => 'decimal:2',
            'protein_per_100g' => 'decimal:2',
            'carbs_per_100g' => 'decimal:2',
            'fat_per_100g' => 'decimal:2',
        ];
    }

    public function mealLogs(): HasMany
    {
        return $this->hasMany(MealLog::class);
    }

    /**
     * Macros para una porción de $quantityGrams, escalados desde los
     * valores por 100g — la misma fórmula (factor = gramos/100) vivía
     * duplicada en MealLogResource, NutritionPlanMealItemResource, y el
     * resumen diario de NutritionController::meals(). Devuelve valores SIN
     * redondear a propósito: los Resources redondean cada ítem para
     * mostrarlo, pero el resumen diario suma los valores crudos de varios
     * ítems y redondea recién al final — redondear acá cambiaría ese total.
     *
     * @return array{calories: float, protein_g: float, carbs_g: float, fat_g: float}
     */
    public function macrosFor(float $quantityGrams): array
    {
        $factor = $quantityGrams / 100;

        return [
            'calories' => (float) $this->calories_per_100g * $factor,
            'protein_g' => (float) $this->protein_per_100g * $factor,
            'carbs_g' => (float) $this->carbs_per_100g * $factor,
            'fat_g' => (float) $this->fat_per_100g * $factor,
        ];
    }
}
