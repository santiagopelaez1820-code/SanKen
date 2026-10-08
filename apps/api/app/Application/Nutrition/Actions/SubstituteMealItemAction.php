<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de nutrición.

namespace App\Application\Nutrition\Actions;

// Esta línea sirve para importar el modelo FoodItem (alimento).
use App\Models\FoodItem;
// Esta línea sirve para importar el modelo NutritionPlanMealItem (alimento dentro de una comida del plan).
use App\Models\NutritionPlanMealItem;
// Esta línea sirve para importar la excepción que se lanza si la categoría no coincide.
use InvalidArgumentException;

/**
 * Sustituye un ítem del plan por otro alimento de la MISMA categoría (misma
 * regla que arma el plan, ver GenerateNutritionPlanAction), recalculando la
 * cantidad para preservar las calorías del ítem reemplazado -- así el
 * usuario puede variar sin descuadrar el objetivo de esa comida.
 */
// Esta línea sirve para declarar la acción que reemplaza un alimento del plan por otro.
class SubstituteMealItemAction
{
    // Esta línea sirve para declarar el método que recibe el ítem y el id del alimento nuevo.
    public function substitute(NutritionPlanMealItem $item, int $newFoodItemId): NutritionPlanMealItem
    {
        // Esta línea sirve para obtener el alimento actual del ítem.
        $currentFood = $item->foodItem;

        // Esta línea sirve para buscar el alimento nuevo.
        $newFood = FoodItem::query()
            // Esta línea sirve para filtrar solo dentro del catálogo curado.
            ->where('source', 'manual')
            // Esta línea sirve para buscar por su id, o responder 404 si no existe.
            ->findOrFail($newFoodItemId);

        // Esta línea sirve para revisar si el alimento nuevo no tiene categoría o es de otra categoría.
        if ($newFood->category === null || $newFood->category !== $currentFood->category) {
            // Esta línea sirve para lanzar una excepción porque la categoría no coincide.
            throw new InvalidArgumentException('category_mismatch');
        }

        // Esta línea sirve para calcular las calorías que aportaba el ítem actual.
        $currentCalories = (float) $currentFood->calories_per_100g * ((float) $item->quantity_grams / 100);
        // Esta línea sirve para obtener las calorías por 100 gramos del alimento nuevo.
        $newPer100g = (float) $newFood->calories_per_100g;

        // Esta línea sirve para calcular los gramos del alimento nuevo para mantener las mismas calorías.
        $newGrams = $newPer100g > 0
            // Esta línea sirve para aplicar una regla de tres si el alimento nuevo tiene calorías.
            ? round(($currentCalories / $newPer100g) * 100, 1)
            // Esta línea sirve para conservar la misma cantidad en gramos en caso contrario.
            : (float) $item->quantity_grams;

        // Esta línea sirve para actualizar el ítem.
        $item->update([
            // Esta línea sirve para guardar el id del alimento nuevo.
            'food_item_id' => $newFood->id,
            // Esta línea sirve para guardar la cantidad, limitada entre 20 y 500 gramos.
            'quantity_grams' => max(20.0, min($newGrams, 500.0)),
        ]);

        // Esta línea sirve para devolver el ítem actualizado con su alimento cargado.
        return $item->fresh('foodItem');
    }
}
