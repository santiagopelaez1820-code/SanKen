<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de las comidas de un plan alimenticio.
class NutritionPlanMeal extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el plan, el tipo de comida y el orden.
        'nutrition_plan_id', 'meal_type', 'order',
        // Esta línea sirve para permitir los objetivos de calorías y macros.
        'target_calories', 'target_protein_g', 'target_carbs_g', 'target_fat_g',
    ];

    // Esta línea sirve para declarar la relación con el plan.
    public function plan(): BelongsTo
    {
        // Esta línea sirve para definir que la comida pertenece a un plan (columna nutrition_plan_id).
        return $this->belongsTo(NutritionPlan::class, 'nutrition_plan_id');
    }

    // Esta línea sirve para declarar la relación con los alimentos de la comida.
    public function items(): HasMany
    {
        // Esta línea sirve para definir que la comida tiene muchos alimentos.
        return $this->hasMany(NutritionPlanMealItem::class);
    }
}
