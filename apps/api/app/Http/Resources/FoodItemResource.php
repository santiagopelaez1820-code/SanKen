<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo FoodItem (alimento) para tipar el resource.
use App\Models\FoodItem;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FoodItem */
// Esta línea sirve para declarar el resource que da formato a un alimento.
class FoodItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el alimento en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el código de barras.
            'barcode' => $this->barcode,
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir la marca.
            'brand' => $this->brand,
            // Esta línea sirve para incluir la categoría.
            'category' => $this->category,
            // Esta línea sirve para incluir las calorías por 100 g.
            'calories_per_100g' => (float) $this->calories_per_100g,
            // Esta línea sirve para incluir la proteína por 100 g.
            'protein_per_100g' => (float) $this->protein_per_100g,
            // Esta línea sirve para incluir los carbohidratos por 100 g.
            'carbs_per_100g' => (float) $this->carbs_per_100g,
            // Esta línea sirve para incluir la grasa por 100 g.
            'fat_per_100g' => (float) $this->fat_per_100g,
            // Esta línea sirve para incluir el tamaño de la porción en gramos (o null).
            'serving_size_grams' => $this->serving_size_grams !== null ? (float) $this->serving_size_grams : null,
            // Esta línea sirve para incluir el nombre de la unidad de porción en singular.
            'serving_unit_singular' => $this->serving_unit_singular,
            // Esta línea sirve para incluir el nombre de la unidad de porción en plural.
            'serving_unit_plural' => $this->serving_unit_plural,
        ];
    }
}
