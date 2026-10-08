<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los alimentos de una comida del plan.
class NutritionPlanMealItem extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['nutrition_plan_meal_id', 'food_item_id', 'quantity_grams'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la cantidad a decimal con 2 decimales.
            'quantity_grams' => 'decimal:2',
        ];
    }

    // Esta línea sirve para declarar la relación con la comida del plan.
    public function meal(): BelongsTo
    {
        // Esta línea sirve para definir que el alimento pertenece a una comida (columna nutrition_plan_meal_id).
        return $this->belongsTo(NutritionPlanMeal::class, 'nutrition_plan_meal_id');
    }

    // Esta línea sirve para declarar la relación con el alimento del catálogo.
    public function foodItem(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un alimento del catálogo.
        return $this->belongsTo(FoodItem::class);
    }
}
