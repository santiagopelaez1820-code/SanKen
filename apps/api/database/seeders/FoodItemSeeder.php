<?php

namespace Database\Seeders;

use App\Models\FoodItem;
use Illuminate\Database\Seeder;

/**
 * Catálogo curado de alimentos reales en español (no productos de marca de
 * Open Food Facts) — es la base sobre la que GenerateNutritionPlanAction
 * arma comidas y sobre la que se ofrecen alternativas de sustitución
 * (misma `category`). Valores nutricionales por 100g, fuentes estándar
 * (USDA/tablas de composición de alimentos), redondeados.
 */
class FoodItemSeeder extends Seeder
{
    public function run(): void
    {
        $foods = [
            // protein
            ['name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165, 'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6],
            ['name' => 'Carne magra de res', 'category' => 'protein', 'calories_per_100g' => 172, 'protein_per_100g' => 21, 'carbs_per_100g' => 0, 'fat_per_100g' => 10],
            ['name' => 'Pescado blanco (merluza)', 'category' => 'protein', 'calories_per_100g' => 90, 'protein_per_100g' => 18, 'carbs_per_100g' => 0, 'fat_per_100g' => 1],
            ['name' => 'Pechuga de pavo', 'category' => 'protein', 'calories_per_100g' => 135, 'protein_per_100g' => 30, 'carbs_per_100g' => 0, 'fat_per_100g' => 1],
            ['name' => 'Huevo entero', 'category' => 'protein', 'calories_per_100g' => 155, 'protein_per_100g' => 13, 'carbs_per_100g' => 1.1, 'fat_per_100g' => 11],
            ['name' => 'Atún al natural', 'category' => 'protein', 'calories_per_100g' => 116, 'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 1],

            // carb
            ['name' => 'Arroz blanco cocido', 'category' => 'carb', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7, 'carbs_per_100g' => 28, 'fat_per_100g' => 0.3],
            ['name' => 'Avena', 'category' => 'carb', 'calories_per_100g' => 389, 'protein_per_100g' => 16.9, 'carbs_per_100g' => 66, 'fat_per_100g' => 6.9],
            ['name' => 'Papa', 'category' => 'carb', 'calories_per_100g' => 77, 'protein_per_100g' => 2, 'carbs_per_100g' => 17, 'fat_per_100g' => 0.1],
            ['name' => 'Batata', 'category' => 'carb', 'calories_per_100g' => 86, 'protein_per_100g' => 1.6, 'carbs_per_100g' => 20, 'fat_per_100g' => 0.1],
            ['name' => 'Pan integral', 'category' => 'carb', 'calories_per_100g' => 247, 'protein_per_100g' => 13, 'carbs_per_100g' => 41, 'fat_per_100g' => 4.2],
            ['name' => 'Pasta cocida', 'category' => 'carb', 'calories_per_100g' => 131, 'protein_per_100g' => 5, 'carbs_per_100g' => 25, 'fat_per_100g' => 1.1],

            // fat
            ['name' => 'Aceite de oliva', 'category' => 'fat', 'calories_per_100g' => 884, 'protein_per_100g' => 0, 'carbs_per_100g' => 0, 'fat_per_100g' => 100],
            ['name' => 'Palta', 'category' => 'fat', 'calories_per_100g' => 160, 'protein_per_100g' => 2, 'carbs_per_100g' => 9, 'fat_per_100g' => 15],
            ['name' => 'Almendras', 'category' => 'fat', 'calories_per_100g' => 579, 'protein_per_100g' => 21, 'carbs_per_100g' => 22, 'fat_per_100g' => 50],
            ['name' => 'Maní', 'category' => 'fat', 'calories_per_100g' => 567, 'protein_per_100g' => 26, 'carbs_per_100g' => 16, 'fat_per_100g' => 49],

            // vegetable
            ['name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34, 'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4],
            ['name' => 'Espinaca', 'category' => 'vegetable', 'calories_per_100g' => 23, 'protein_per_100g' => 2.9, 'carbs_per_100g' => 3.6, 'fat_per_100g' => 0.4],
            ['name' => 'Zanahoria', 'category' => 'vegetable', 'calories_per_100g' => 41, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 10, 'fat_per_100g' => 0.2],
            ['name' => 'Tomate', 'category' => 'vegetable', 'calories_per_100g' => 18, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 3.9, 'fat_per_100g' => 0.2],
            ['name' => 'Lechuga', 'category' => 'vegetable', 'calories_per_100g' => 15, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 2.9, 'fat_per_100g' => 0.2],

            // fruit
            ['name' => 'Banana', 'category' => 'fruit', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3],
            ['name' => 'Manzana', 'category' => 'fruit', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3, 'carbs_per_100g' => 13.8, 'fat_per_100g' => 0.2],
            ['name' => 'Naranja', 'category' => 'fruit', 'calories_per_100g' => 47, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 11.8, 'fat_per_100g' => 0.1],

            // dairy
            ['name' => 'Yogur natural', 'category' => 'dairy', 'calories_per_100g' => 61, 'protein_per_100g' => 3.5, 'carbs_per_100g' => 4.7, 'fat_per_100g' => 3.3],
            ['name' => 'Queso fresco', 'category' => 'dairy', 'calories_per_100g' => 264, 'protein_per_100g' => 18, 'carbs_per_100g' => 3, 'fat_per_100g' => 20],
            ['name' => 'Leche descremada', 'category' => 'dairy', 'calories_per_100g' => 34, 'protein_per_100g' => 3.4, 'carbs_per_100g' => 5, 'fat_per_100g' => 0.1],
        ];

        foreach ($foods as $food) {
            FoodItem::query()->updateOrCreate(
                ['name' => $food['name'], 'source' => 'manual'],
                $food + ['source' => 'manual'],
            );
        }
    }
}
