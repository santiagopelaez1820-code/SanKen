<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo NutritionPlanMealItem (alimento del plan) para tipar el resource.
use App\Models\NutritionPlanMealItem;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlanMealItem */
// Esta línea sirve para declarar el resource que da formato a un alimento del plan.
class NutritionPlanMealItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el alimento del plan en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para obtener el alimento.
        $foodItem = $this->foodItem;
        // Esta línea sirve para calcular los macros según la cantidad en gramos.
        $macros = $foodItem->macrosFor((float) $this->quantity_grams);

        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el alimento con su formato.
            'food_item' => new FoodItemResource($foodItem),
            // Esta línea sirve para incluir la cantidad en gramos.
            'quantity_grams' => (float) $this->quantity_grams,
            // Esta línea sirve para incluir las calorías con un decimal.
            'calories' => round($macros['calories'], 1),
            // Esta línea sirve para incluir la proteína con un decimal.
            'protein_g' => round($macros['protein_g'], 1),
            // Esta línea sirve para incluir los carbohidratos con un decimal.
            'carbs_g' => round($macros['carbs_g'], 1),
            // Esta línea sirve para incluir la grasa con un decimal.
            'fat_g' => round($macros['fat_g'], 1),
        ];
    }
}
