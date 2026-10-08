<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo NutritionPlanMeal (comida del plan) para tipar el resource.
use App\Models\NutritionPlanMeal;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlanMeal */
// Esta línea sirve para declarar el resource que da formato a una comida del plan.
class NutritionPlanMealResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la comida en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el tipo de comida.
            'meal_type' => $this->meal_type,
            // Esta línea sirve para incluir el orden en el día.
            'order' => $this->order,
            // Esta línea sirve para incluir las calorías objetivo.
            'target_calories' => $this->target_calories,
            // Esta línea sirve para incluir la proteína objetivo.
            'target_protein_g' => $this->target_protein_g,
            // Esta línea sirve para incluir los carbohidratos objetivo.
            'target_carbs_g' => $this->target_carbs_g,
            // Esta línea sirve para incluir la grasa objetivo.
            'target_fat_g' => $this->target_fat_g,
            // Esta línea sirve para incluir los alimentos solo si se cargaron.
            'items' => NutritionPlanMealItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
