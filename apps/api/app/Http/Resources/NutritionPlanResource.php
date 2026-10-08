<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo NutritionPlan (plan alimenticio) para tipar el resource.
use App\Models\NutritionPlan;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NutritionPlan */
// Esta línea sirve para declarar el resource que da formato a un plan alimenticio.
class NutritionPlanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el plan en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir las calorías diarias.
            'calories' => $this->calories,
            // Esta línea sirve para incluir la proteína diaria.
            'protein_g' => $this->protein_g,
            // Esta línea sirve para incluir los carbohidratos diarios.
            'carbs_g' => $this->carbs_g,
            // Esta línea sirve para incluir la grasa diaria.
            'fat_g' => $this->fat_g,
            // Esta línea sirve para incluir cuándo se generó, en formato ISO 8601.
            'generated_at' => $this->created_at->toIso8601String(),
            // Esta línea sirve para incluir las comidas solo si se cargaron.
            'meals' => NutritionPlanMealResource::collection($this->whenLoaded('meals')),
        ];
    }
}
