<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los alimentos.
class FoodItem extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el código de barras.
        'barcode',
        // Esta línea sirve para permitir el nombre.
        'name',
        // Esta línea sirve para permitir la marca.
        'brand',
        // Esta línea sirve para permitir la categoría.
        'category',
        // Esta línea sirve para permitir las calorías por 100 g.
        'calories_per_100g',
        // Esta línea sirve para permitir la proteína por 100 g.
        'protein_per_100g',
        // Esta línea sirve para permitir los carbohidratos por 100 g.
        'carbs_per_100g',
        // Esta línea sirve para permitir la grasa por 100 g.
        'fat_per_100g',
        // Esta línea sirve para permitir el tamaño de la porción en gramos.
        'serving_size_grams',
        // Esta línea sirve para permitir la unidad de porción en singular.
        'serving_unit_singular',
        // Esta línea sirve para permitir la unidad de porción en plural.
        'serving_unit_plural',
        // Esta línea sirve para permitir el origen del dato.
        'source',
        // Esta línea sirve para permitir el id del alimento en su origen.
        'source_id',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir las calorías a decimal con 2 decimales.
            'calories_per_100g' => 'decimal:2',
            // Esta línea sirve para convertir la proteína a decimal con 2 decimales.
            'protein_per_100g' => 'decimal:2',
            // Esta línea sirve para convertir los carbohidratos a decimal con 2 decimales.
            'carbs_per_100g' => 'decimal:2',
            // Esta línea sirve para convertir la grasa a decimal con 2 decimales.
            'fat_per_100g' => 'decimal:2',
            // Esta línea sirve para convertir la porción a decimal con 2 decimales.
            'serving_size_grams' => 'decimal:2',
        ];
    }

    // Esta línea sirve para declarar la relación con las comidas registradas.
    public function mealLogs(): HasMany
    {
        // Esta línea sirve para definir que el alimento tiene muchas comidas registradas.
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
    // Esta línea sirve para declarar el método que calcula los macros de una porción.
    public function macrosFor(float $quantityGrams): array
    {
        // Esta línea sirve para calcular el factor (gramos / 100).
        $factor = $quantityGrams / 100;

        // Esta línea sirve para devolver los macros escalados.
        return [
            // Esta línea sirve para calcular las calorías.
            'calories' => (float) $this->calories_per_100g * $factor,
            // Esta línea sirve para calcular la proteína.
            'protein_g' => (float) $this->protein_per_100g * $factor,
            // Esta línea sirve para calcular los carbohidratos.
            'carbs_g' => (float) $this->carbs_per_100g * $factor,
            // Esta línea sirve para calcular la grasa.
            'fat_g' => (float) $this->fat_per_100g * $factor,
        ];
    }
}
