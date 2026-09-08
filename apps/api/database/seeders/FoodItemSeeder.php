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
 *
 * serving_size_grams + serving_unit_singular/plural son la unidad natural
 * de cada alimento (p.ej. 1 huevo ≈ 50g) — el front las usa para mostrar
 * "2 huevos" además de los gramos crudos. Son aproximaciones de sentido
 * común (porción típica), no una medición exacta.
 */
class FoodItemSeeder extends Seeder
{
    public function run(): void
    {
        $foods = [
            // protein — todas fáciles de conseguir en cualquier tienda/plaza de mercado en Colombia.
            ['name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165, 'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'serving_size_grams' => 150, 'serving_unit_singular' => 'pechuga', 'serving_unit_plural' => 'pechugas'],
            ['name' => 'Carne magra de res', 'category' => 'protein', 'calories_per_100g' => 172, 'protein_per_100g' => 21, 'carbs_per_100g' => 0, 'fat_per_100g' => 10, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Pescado blanco (merluza)', 'category' => 'protein', 'calories_per_100g' => 90, 'protein_per_100g' => 18, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'filete', 'serving_unit_plural' => 'filetes'],
            ['name' => 'Pechuga de pavo', 'category' => 'protein', 'calories_per_100g' => 135, 'protein_per_100g' => 30, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Huevo entero', 'category' => 'protein', 'calories_per_100g' => 155, 'protein_per_100g' => 13, 'carbs_per_100g' => 1.1, 'fat_per_100g' => 11, 'serving_size_grams' => 50, 'serving_unit_singular' => 'huevo', 'serving_unit_plural' => 'huevos'],
            ['name' => 'Atún al natural', 'category' => 'protein', 'calories_per_100g' => 116, 'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 80, 'serving_unit_singular' => 'lata', 'serving_unit_plural' => 'latas'],
            ['name' => 'Claras de huevo', 'category' => 'protein', 'calories_per_100g' => 52, 'protein_per_100g' => 11, 'carbs_per_100g' => 0.7, 'fat_per_100g' => 0.2, 'serving_size_grams' => 33, 'serving_unit_singular' => 'clara', 'serving_unit_plural' => 'claras'],
            ['name' => 'Tilapia', 'category' => 'protein', 'calories_per_100g' => 96, 'protein_per_100g' => 20, 'carbs_per_100g' => 0, 'fat_per_100g' => 1.7, 'serving_size_grams' => 150, 'serving_unit_singular' => 'filete', 'serving_unit_plural' => 'filetes'],
            ['name' => 'Carne molida de res', 'category' => 'protein', 'calories_per_100g' => 137, 'protein_per_100g' => 21, 'carbs_per_100g' => 0, 'fat_per_100g' => 5, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Lomo de cerdo', 'category' => 'protein', 'calories_per_100g' => 143, 'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.5, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Frijoles rojos cocidos', 'category' => 'protein', 'calories_per_100g' => 127, 'protein_per_100g' => 8.7, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.5, 'serving_size_grams' => 165, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Lentejas cocidas', 'category' => 'protein', 'calories_per_100g' => 116, 'protein_per_100g' => 9, 'carbs_per_100g' => 20, 'fat_per_100g' => 0.4, 'serving_size_grams' => 200, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Garbanzos cocidos', 'category' => 'protein', 'calories_per_100g' => 164, 'protein_per_100g' => 8.9, 'carbs_per_100g' => 27, 'fat_per_100g' => 2.6, 'serving_size_grams' => 164, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Camarones', 'category' => 'protein', 'calories_per_100g' => 99, 'protein_per_100g' => 24, 'carbs_per_100g' => 0.2, 'fat_per_100g' => 0.3, 'serving_size_grams' => 85, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],

            // carb
            ['name' => 'Arroz blanco cocido', 'category' => 'carb', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7, 'carbs_per_100g' => 28, 'fat_per_100g' => 0.3, 'serving_size_grams' => 158, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Avena', 'category' => 'carb', 'calories_per_100g' => 389, 'protein_per_100g' => 16.9, 'carbs_per_100g' => 66, 'fat_per_100g' => 6.9, 'serving_size_grams' => 40, 'serving_unit_singular' => 'media taza', 'serving_unit_plural' => 'medias tazas'],
            ['name' => 'Papa', 'category' => 'carb', 'calories_per_100g' => 77, 'protein_per_100g' => 2, 'carbs_per_100g' => 17, 'fat_per_100g' => 0.1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'papa', 'serving_unit_plural' => 'papas'],
            ['name' => 'Batata', 'category' => 'carb', 'calories_per_100g' => 86, 'protein_per_100g' => 1.6, 'carbs_per_100g' => 20, 'fat_per_100g' => 0.1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'batata', 'serving_unit_plural' => 'batatas'],
            ['name' => 'Pan integral', 'category' => 'carb', 'calories_per_100g' => 247, 'protein_per_100g' => 13, 'carbs_per_100g' => 41, 'fat_per_100g' => 4.2, 'serving_size_grams' => 30, 'serving_unit_singular' => 'rebanada', 'serving_unit_plural' => 'rebanadas'],
            ['name' => 'Pasta cocida', 'category' => 'carb', 'calories_per_100g' => 131, 'protein_per_100g' => 5, 'carbs_per_100g' => 25, 'fat_per_100g' => 1.1, 'serving_size_grams' => 140, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Arepa de maíz', 'category' => 'carb', 'calories_per_100g' => 216, 'protein_per_100g' => 5.9, 'carbs_per_100g' => 44, 'fat_per_100g' => 2.5, 'serving_size_grams' => 80, 'serving_unit_singular' => 'arepa', 'serving_unit_plural' => 'arepas'],
            ['name' => 'Plátano verde cocido', 'category' => 'carb', 'calories_per_100g' => 122, 'protein_per_100g' => 1.3, 'carbs_per_100g' => 32, 'fat_per_100g' => 0.4, 'serving_size_grams' => 100, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            ['name' => 'Yuca cocida', 'category' => 'carb', 'calories_per_100g' => 160, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 38, 'fat_per_100g' => 0.3, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Papa criolla', 'category' => 'carb', 'calories_per_100g' => 85, 'protein_per_100g' => 2, 'carbs_per_100g' => 19, 'fat_per_100g' => 0.1, 'serving_size_grams' => 15, 'serving_unit_singular' => 'papa criolla', 'serving_unit_plural' => 'papas criollas'],
            ['name' => 'Ñame cocido', 'category' => 'carb', 'calories_per_100g' => 118, 'protein_per_100g' => 1.5, 'carbs_per_100g' => 27.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            ['name' => 'Maíz (mazorca)', 'category' => 'carb', 'calories_per_100g' => 96, 'protein_per_100g' => 3.4, 'carbs_per_100g' => 21, 'fat_per_100g' => 1.5, 'serving_size_grams' => 90, 'serving_unit_singular' => 'mazorca', 'serving_unit_plural' => 'mazorcas'],

            // fat
            ['name' => 'Aceite de oliva', 'category' => 'fat', 'calories_per_100g' => 884, 'protein_per_100g' => 0, 'carbs_per_100g' => 0, 'fat_per_100g' => 100, 'serving_size_grams' => 15, 'serving_unit_singular' => 'cucharada', 'serving_unit_plural' => 'cucharadas'],
            ['name' => 'Palta', 'category' => 'fat', 'calories_per_100g' => 160, 'protein_per_100g' => 2, 'carbs_per_100g' => 9, 'fat_per_100g' => 15, 'serving_size_grams' => 70, 'serving_unit_singular' => 'media palta', 'serving_unit_plural' => 'medias paltas'],
            ['name' => 'Almendras', 'category' => 'fat', 'calories_per_100g' => 579, 'protein_per_100g' => 21, 'carbs_per_100g' => 22, 'fat_per_100g' => 50, 'serving_size_grams' => 15, 'serving_unit_singular' => 'puñado', 'serving_unit_plural' => 'puñados'],
            ['name' => 'Maní', 'category' => 'fat', 'calories_per_100g' => 567, 'protein_per_100g' => 26, 'carbs_per_100g' => 16, 'fat_per_100g' => 49, 'serving_size_grams' => 15, 'serving_unit_singular' => 'puñado', 'serving_unit_plural' => 'puñados'],

            // vegetable
            ['name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34, 'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4, 'serving_size_grams' => 90, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Espinaca', 'category' => 'vegetable', 'calories_per_100g' => 23, 'protein_per_100g' => 2.9, 'carbs_per_100g' => 3.6, 'fat_per_100g' => 0.4, 'serving_size_grams' => 30, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Zanahoria', 'category' => 'vegetable', 'calories_per_100g' => 41, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 10, 'fat_per_100g' => 0.2, 'serving_size_grams' => 60, 'serving_unit_singular' => 'zanahoria', 'serving_unit_plural' => 'zanahorias'],
            ['name' => 'Tomate', 'category' => 'vegetable', 'calories_per_100g' => 18, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 3.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 120, 'serving_unit_singular' => 'tomate', 'serving_unit_plural' => 'tomates'],
            ['name' => 'Lechuga', 'category' => 'vegetable', 'calories_per_100g' => 15, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 2.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 50, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Habichuela', 'category' => 'vegetable', 'calories_per_100g' => 31, 'protein_per_100g' => 1.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.2, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Pepino cohombro', 'category' => 'vegetable', 'calories_per_100g' => 15, 'protein_per_100g' => 0.7, 'carbs_per_100g' => 3.6, 'fat_per_100g' => 0.1, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Pimentón', 'category' => 'vegetable', 'calories_per_100g' => 31, 'protein_per_100g' => 1, 'carbs_per_100g' => 6, 'fat_per_100g' => 0.3, 'serving_size_grams' => 120, 'serving_unit_singular' => 'pimentón', 'serving_unit_plural' => 'pimentones'],
            ['name' => 'Cebolla', 'category' => 'vegetable', 'calories_per_100g' => 40, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 9.3, 'fat_per_100g' => 0.1, 'serving_size_grams' => 110, 'serving_unit_singular' => 'cebolla', 'serving_unit_plural' => 'cebollas'],
            ['name' => 'Ahuyama', 'category' => 'vegetable', 'calories_per_100g' => 26, 'protein_per_100g' => 1, 'carbs_per_100g' => 6.5, 'fat_per_100g' => 0.1, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],

            // fruit
            ['name' => 'Banana', 'category' => 'fruit', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3, 'serving_size_grams' => 120, 'serving_unit_singular' => 'banana', 'serving_unit_plural' => 'bananas'],
            ['name' => 'Manzana', 'category' => 'fruit', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3, 'carbs_per_100g' => 13.8, 'fat_per_100g' => 0.2, 'serving_size_grams' => 120, 'serving_unit_singular' => 'manzana', 'serving_unit_plural' => 'manzanas'],
            ['name' => 'Naranja', 'category' => 'fruit', 'calories_per_100g' => 47, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 11.8, 'fat_per_100g' => 0.1, 'serving_size_grams' => 130, 'serving_unit_singular' => 'naranja', 'serving_unit_plural' => 'naranjas'],
            ['name' => 'Papaya', 'category' => 'fruit', 'calories_per_100g' => 43, 'protein_per_100g' => 0.5, 'carbs_per_100g' => 11, 'fat_per_100g' => 0.3, 'serving_size_grams' => 150, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            ['name' => 'Mango', 'category' => 'fruit', 'calories_per_100g' => 60, 'protein_per_100g' => 0.8, 'carbs_per_100g' => 15, 'fat_per_100g' => 0.4, 'serving_size_grams' => 150, 'serving_unit_singular' => 'mango', 'serving_unit_plural' => 'mangos'],
            ['name' => 'Piña', 'category' => 'fruit', 'calories_per_100g' => 50, 'protein_per_100g' => 0.5, 'carbs_per_100g' => 13, 'fat_per_100g' => 0.1, 'serving_size_grams' => 80, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            ['name' => 'Guayaba', 'category' => 'fruit', 'calories_per_100g' => 68, 'protein_per_100g' => 2.6, 'carbs_per_100g' => 14, 'fat_per_100g' => 1, 'serving_size_grams' => 90, 'serving_unit_singular' => 'guayaba', 'serving_unit_plural' => 'guayabas'],
            ['name' => 'Mora', 'category' => 'fruit', 'calories_per_100g' => 43, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 9.6, 'fat_per_100g' => 0.5, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            ['name' => 'Patilla', 'category' => 'fruit', 'calories_per_100g' => 30, 'protein_per_100g' => 0.6, 'carbs_per_100g' => 7.6, 'fat_per_100g' => 0.2, 'serving_size_grams' => 150, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],

            // dairy
            ['name' => 'Yogur natural', 'category' => 'dairy', 'calories_per_100g' => 61, 'protein_per_100g' => 3.5, 'carbs_per_100g' => 4.7, 'fat_per_100g' => 3.3, 'serving_size_grams' => 150, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            ['name' => 'Queso fresco', 'category' => 'dairy', 'calories_per_100g' => 264, 'protein_per_100g' => 18, 'carbs_per_100g' => 3, 'fat_per_100g' => 20, 'serving_size_grams' => 30, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            ['name' => 'Leche descremada', 'category' => 'dairy', 'calories_per_100g' => 34, 'protein_per_100g' => 3.4, 'carbs_per_100g' => 5, 'fat_per_100g' => 0.1, 'serving_size_grams' => 200, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            ['name' => 'Kumis', 'category' => 'dairy', 'calories_per_100g' => 56, 'protein_per_100g' => 3.3, 'carbs_per_100g' => 4.5, 'fat_per_100g' => 2.5, 'serving_size_grams' => 200, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            ['name' => 'Queso campesino', 'category' => 'dairy', 'calories_per_100g' => 300, 'protein_per_100g' => 18, 'carbs_per_100g' => 2, 'fat_per_100g' => 24, 'serving_size_grams' => 30, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            ['name' => 'Cuajada', 'category' => 'dairy', 'calories_per_100g' => 98, 'protein_per_100g' => 13, 'carbs_per_100g' => 3, 'fat_per_100g' => 4, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
        ];

        foreach ($foods as $food) {
            FoodItem::query()->updateOrCreate(
                ['name' => $food['name'], 'source' => 'manual'],
                $food + ['source' => 'manual'],
            );
        }
    }
}
