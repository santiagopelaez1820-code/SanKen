<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el modelo FoodItem (alimento).
use App\Models\FoodItem;
// Esta línea sirve para importar la clase base de los seeders.
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
// Esta línea sirve para declarar el seeder que carga el catálogo curado de alimentos.
class FoodItemSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para definir la lista de alimentos a cargar.
        $foods = [
            // protein — todas fáciles de conseguir en cualquier tienda/plaza de mercado en Colombia.
            // Esta línea sirve para agregar "Pechuga de pollo" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165, 'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'serving_size_grams' => 150, 'serving_unit_singular' => 'pechuga', 'serving_unit_plural' => 'pechugas'],
            // Esta línea sirve para agregar "Carne magra de res" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Carne magra de res', 'category' => 'protein', 'calories_per_100g' => 172, 'protein_per_100g' => 21, 'carbs_per_100g' => 0, 'fat_per_100g' => 10, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Pescado blanco (merluza)" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Pescado blanco (merluza)', 'category' => 'protein', 'calories_per_100g' => 90, 'protein_per_100g' => 18, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'filete', 'serving_unit_plural' => 'filetes'],
            // Esta línea sirve para agregar "Pechuga de pavo" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Pechuga de pavo', 'category' => 'protein', 'calories_per_100g' => 135, 'protein_per_100g' => 30, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Huevo entero" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Huevo entero', 'category' => 'protein', 'calories_per_100g' => 155, 'protein_per_100g' => 13, 'carbs_per_100g' => 1.1, 'fat_per_100g' => 11, 'serving_size_grams' => 50, 'serving_unit_singular' => 'huevo', 'serving_unit_plural' => 'huevos'],
            // Esta línea sirve para agregar "Atún al natural" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Atún al natural', 'category' => 'protein', 'calories_per_100g' => 116, 'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'serving_size_grams' => 80, 'serving_unit_singular' => 'lata', 'serving_unit_plural' => 'latas'],
            // Esta línea sirve para agregar "Claras de huevo" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Claras de huevo', 'category' => 'protein', 'calories_per_100g' => 52, 'protein_per_100g' => 11, 'carbs_per_100g' => 0.7, 'fat_per_100g' => 0.2, 'serving_size_grams' => 33, 'serving_unit_singular' => 'clara', 'serving_unit_plural' => 'claras'],
            // Esta línea sirve para agregar "Tilapia" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Tilapia', 'category' => 'protein', 'calories_per_100g' => 96, 'protein_per_100g' => 20, 'carbs_per_100g' => 0, 'fat_per_100g' => 1.7, 'serving_size_grams' => 150, 'serving_unit_singular' => 'filete', 'serving_unit_plural' => 'filetes'],
            // Esta línea sirve para agregar "Carne molida de res" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Carne molida de res', 'category' => 'protein', 'calories_per_100g' => 137, 'protein_per_100g' => 21, 'carbs_per_100g' => 0, 'fat_per_100g' => 5, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Lomo de cerdo" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Lomo de cerdo', 'category' => 'protein', 'calories_per_100g' => 143, 'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.5, 'serving_size_grams' => 150, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Frijoles rojos cocidos" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Frijoles rojos cocidos', 'category' => 'protein', 'calories_per_100g' => 127, 'protein_per_100g' => 8.7, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.5, 'serving_size_grams' => 165, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Lentejas cocidas" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Lentejas cocidas', 'category' => 'protein', 'calories_per_100g' => 116, 'protein_per_100g' => 9, 'carbs_per_100g' => 20, 'fat_per_100g' => 0.4, 'serving_size_grams' => 200, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Garbanzos cocidos" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Garbanzos cocidos', 'category' => 'protein', 'calories_per_100g' => 164, 'protein_per_100g' => 8.9, 'carbs_per_100g' => 27, 'fat_per_100g' => 2.6, 'serving_size_grams' => 164, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Camarones" (categoría protein) con sus valores por 100 g y su porción.
            ['name' => 'Camarones', 'category' => 'protein', 'calories_per_100g' => 99, 'protein_per_100g' => 24, 'carbs_per_100g' => 0.2, 'fat_per_100g' => 0.3, 'serving_size_grams' => 85, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],

            // carb
            // Esta línea sirve para agregar "Arroz blanco cocido" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Arroz blanco cocido', 'category' => 'carb', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7, 'carbs_per_100g' => 28, 'fat_per_100g' => 0.3, 'serving_size_grams' => 158, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Avena" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Avena', 'category' => 'carb', 'calories_per_100g' => 389, 'protein_per_100g' => 16.9, 'carbs_per_100g' => 66, 'fat_per_100g' => 6.9, 'serving_size_grams' => 40, 'serving_unit_singular' => 'media taza', 'serving_unit_plural' => 'medias tazas'],
            // Esta línea sirve para agregar "Papa" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Papa', 'category' => 'carb', 'calories_per_100g' => 77, 'protein_per_100g' => 2, 'carbs_per_100g' => 17, 'fat_per_100g' => 0.1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'papa', 'serving_unit_plural' => 'papas'],
            // Esta línea sirve para agregar "Batata" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Batata', 'category' => 'carb', 'calories_per_100g' => 86, 'protein_per_100g' => 1.6, 'carbs_per_100g' => 20, 'fat_per_100g' => 0.1, 'serving_size_grams' => 150, 'serving_unit_singular' => 'batata', 'serving_unit_plural' => 'batatas'],
            // Esta línea sirve para agregar "Pan integral" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Pan integral', 'category' => 'carb', 'calories_per_100g' => 247, 'protein_per_100g' => 13, 'carbs_per_100g' => 41, 'fat_per_100g' => 4.2, 'serving_size_grams' => 30, 'serving_unit_singular' => 'rebanada', 'serving_unit_plural' => 'rebanadas'],
            // Esta línea sirve para agregar "Pasta cocida" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Pasta cocida', 'category' => 'carb', 'calories_per_100g' => 131, 'protein_per_100g' => 5, 'carbs_per_100g' => 25, 'fat_per_100g' => 1.1, 'serving_size_grams' => 140, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Arepa de maíz" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Arepa de maíz', 'category' => 'carb', 'calories_per_100g' => 216, 'protein_per_100g' => 5.9, 'carbs_per_100g' => 44, 'fat_per_100g' => 2.5, 'serving_size_grams' => 80, 'serving_unit_singular' => 'arepa', 'serving_unit_plural' => 'arepas'],
            // Esta línea sirve para agregar "Plátano verde cocido" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Plátano verde cocido', 'category' => 'carb', 'calories_per_100g' => 122, 'protein_per_100g' => 1.3, 'carbs_per_100g' => 32, 'fat_per_100g' => 0.4, 'serving_size_grams' => 100, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            // Esta línea sirve para agregar "Yuca cocida" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Yuca cocida', 'category' => 'carb', 'calories_per_100g' => 160, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 38, 'fat_per_100g' => 0.3, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Papa criolla" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Papa criolla', 'category' => 'carb', 'calories_per_100g' => 85, 'protein_per_100g' => 2, 'carbs_per_100g' => 19, 'fat_per_100g' => 0.1, 'serving_size_grams' => 15, 'serving_unit_singular' => 'papa criolla', 'serving_unit_plural' => 'papas criollas'],
            // Esta línea sirve para agregar "Ñame cocido" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Ñame cocido', 'category' => 'carb', 'calories_per_100g' => 118, 'protein_per_100g' => 1.5, 'carbs_per_100g' => 27.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
            // Esta línea sirve para agregar "Maíz (mazorca)" (categoría carb) con sus valores por 100 g y su porción.
            ['name' => 'Maíz (mazorca)', 'category' => 'carb', 'calories_per_100g' => 96, 'protein_per_100g' => 3.4, 'carbs_per_100g' => 21, 'fat_per_100g' => 1.5, 'serving_size_grams' => 90, 'serving_unit_singular' => 'mazorca', 'serving_unit_plural' => 'mazorcas'],

            // fat
            // Esta línea sirve para agregar "Aceite de oliva" (categoría fat) con sus valores por 100 g y su porción.
            ['name' => 'Aceite de oliva', 'category' => 'fat', 'calories_per_100g' => 884, 'protein_per_100g' => 0, 'carbs_per_100g' => 0, 'fat_per_100g' => 100, 'serving_size_grams' => 15, 'serving_unit_singular' => 'cucharada', 'serving_unit_plural' => 'cucharadas'],
            // Esta línea sirve para agregar "Palta" (categoría fat) con sus valores por 100 g y su porción.
            ['name' => 'Palta', 'category' => 'fat', 'calories_per_100g' => 160, 'protein_per_100g' => 2, 'carbs_per_100g' => 9, 'fat_per_100g' => 15, 'serving_size_grams' => 70, 'serving_unit_singular' => 'media palta', 'serving_unit_plural' => 'medias paltas'],
            // Esta línea sirve para agregar "Almendras" (categoría fat) con sus valores por 100 g y su porción.
            ['name' => 'Almendras', 'category' => 'fat', 'calories_per_100g' => 579, 'protein_per_100g' => 21, 'carbs_per_100g' => 22, 'fat_per_100g' => 50, 'serving_size_grams' => 15, 'serving_unit_singular' => 'puñado', 'serving_unit_plural' => 'puñados'],
            // Esta línea sirve para agregar "Maní" (categoría fat) con sus valores por 100 g y su porción.
            ['name' => 'Maní', 'category' => 'fat', 'calories_per_100g' => 567, 'protein_per_100g' => 26, 'carbs_per_100g' => 16, 'fat_per_100g' => 49, 'serving_size_grams' => 15, 'serving_unit_singular' => 'puñado', 'serving_unit_plural' => 'puñados'],

            // vegetable
            // Esta línea sirve para agregar "Brócoli" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34, 'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4, 'serving_size_grams' => 90, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Espinaca" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Espinaca', 'category' => 'vegetable', 'calories_per_100g' => 23, 'protein_per_100g' => 2.9, 'carbs_per_100g' => 3.6, 'fat_per_100g' => 0.4, 'serving_size_grams' => 30, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Zanahoria" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Zanahoria', 'category' => 'vegetable', 'calories_per_100g' => 41, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 10, 'fat_per_100g' => 0.2, 'serving_size_grams' => 60, 'serving_unit_singular' => 'zanahoria', 'serving_unit_plural' => 'zanahorias'],
            // Esta línea sirve para agregar "Tomate" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Tomate', 'category' => 'vegetable', 'calories_per_100g' => 18, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 3.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 120, 'serving_unit_singular' => 'tomate', 'serving_unit_plural' => 'tomates'],
            // Esta línea sirve para agregar "Lechuga" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Lechuga', 'category' => 'vegetable', 'calories_per_100g' => 15, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 2.9, 'fat_per_100g' => 0.2, 'serving_size_grams' => 50, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Habichuela" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Habichuela', 'category' => 'vegetable', 'calories_per_100g' => 31, 'protein_per_100g' => 1.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.2, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Pepino cohombro" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Pepino cohombro', 'category' => 'vegetable', 'calories_per_100g' => 15, 'protein_per_100g' => 0.7, 'carbs_per_100g' => 3.6, 'fat_per_100g' => 0.1, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Pimentón" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Pimentón', 'category' => 'vegetable', 'calories_per_100g' => 31, 'protein_per_100g' => 1, 'carbs_per_100g' => 6, 'fat_per_100g' => 0.3, 'serving_size_grams' => 120, 'serving_unit_singular' => 'pimentón', 'serving_unit_plural' => 'pimentones'],
            // Esta línea sirve para agregar "Cebolla" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Cebolla', 'category' => 'vegetable', 'calories_per_100g' => 40, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 9.3, 'fat_per_100g' => 0.1, 'serving_size_grams' => 110, 'serving_unit_singular' => 'cebolla', 'serving_unit_plural' => 'cebollas'],
            // Esta línea sirve para agregar "Ahuyama" (categoría vegetable) con sus valores por 100 g y su porción.
            ['name' => 'Ahuyama', 'category' => 'vegetable', 'calories_per_100g' => 26, 'protein_per_100g' => 1, 'carbs_per_100g' => 6.5, 'fat_per_100g' => 0.1, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],

            // fruit
            // Esta línea sirve para agregar "Banana" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Banana', 'category' => 'fruit', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3, 'serving_size_grams' => 120, 'serving_unit_singular' => 'banana', 'serving_unit_plural' => 'bananas'],
            // Esta línea sirve para agregar "Manzana" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Manzana', 'category' => 'fruit', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3, 'carbs_per_100g' => 13.8, 'fat_per_100g' => 0.2, 'serving_size_grams' => 120, 'serving_unit_singular' => 'manzana', 'serving_unit_plural' => 'manzanas'],
            // Esta línea sirve para agregar "Naranja" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Naranja', 'category' => 'fruit', 'calories_per_100g' => 47, 'protein_per_100g' => 0.9, 'carbs_per_100g' => 11.8, 'fat_per_100g' => 0.1, 'serving_size_grams' => 130, 'serving_unit_singular' => 'naranja', 'serving_unit_plural' => 'naranjas'],
            // Esta línea sirve para agregar "Papaya" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Papaya', 'category' => 'fruit', 'calories_per_100g' => 43, 'protein_per_100g' => 0.5, 'carbs_per_100g' => 11, 'fat_per_100g' => 0.3, 'serving_size_grams' => 150, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            // Esta línea sirve para agregar "Mango" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Mango', 'category' => 'fruit', 'calories_per_100g' => 60, 'protein_per_100g' => 0.8, 'carbs_per_100g' => 15, 'fat_per_100g' => 0.4, 'serving_size_grams' => 150, 'serving_unit_singular' => 'mango', 'serving_unit_plural' => 'mangos'],
            // Esta línea sirve para agregar "Piña" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Piña', 'category' => 'fruit', 'calories_per_100g' => 50, 'protein_per_100g' => 0.5, 'carbs_per_100g' => 13, 'fat_per_100g' => 0.1, 'serving_size_grams' => 80, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            // Esta línea sirve para agregar "Guayaba" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Guayaba', 'category' => 'fruit', 'calories_per_100g' => 68, 'protein_per_100g' => 2.6, 'carbs_per_100g' => 14, 'fat_per_100g' => 1, 'serving_size_grams' => 90, 'serving_unit_singular' => 'guayaba', 'serving_unit_plural' => 'guayabas'],
            // Esta línea sirve para agregar "Mora" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Mora', 'category' => 'fruit', 'calories_per_100g' => 43, 'protein_per_100g' => 1.4, 'carbs_per_100g' => 9.6, 'fat_per_100g' => 0.5, 'serving_size_grams' => 100, 'serving_unit_singular' => 'taza', 'serving_unit_plural' => 'tazas'],
            // Esta línea sirve para agregar "Patilla" (categoría fruit) con sus valores por 100 g y su porción.
            ['name' => 'Patilla', 'category' => 'fruit', 'calories_per_100g' => 30, 'protein_per_100g' => 0.6, 'carbs_per_100g' => 7.6, 'fat_per_100g' => 0.2, 'serving_size_grams' => 150, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],

            // dairy
            // Esta línea sirve para agregar "Yogur natural" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Yogur natural', 'category' => 'dairy', 'calories_per_100g' => 61, 'protein_per_100g' => 3.5, 'carbs_per_100g' => 4.7, 'fat_per_100g' => 3.3, 'serving_size_grams' => 150, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            // Esta línea sirve para agregar "Queso fresco" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Queso fresco', 'category' => 'dairy', 'calories_per_100g' => 264, 'protein_per_100g' => 18, 'carbs_per_100g' => 3, 'fat_per_100g' => 20, 'serving_size_grams' => 30, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            // Esta línea sirve para agregar "Leche descremada" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Leche descremada', 'category' => 'dairy', 'calories_per_100g' => 34, 'protein_per_100g' => 3.4, 'carbs_per_100g' => 5, 'fat_per_100g' => 0.1, 'serving_size_grams' => 200, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            // Esta línea sirve para agregar "Kumis" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Kumis', 'category' => 'dairy', 'calories_per_100g' => 56, 'protein_per_100g' => 3.3, 'carbs_per_100g' => 4.5, 'fat_per_100g' => 2.5, 'serving_size_grams' => 200, 'serving_unit_singular' => 'vaso', 'serving_unit_plural' => 'vasos'],
            // Esta línea sirve para agregar "Queso campesino" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Queso campesino', 'category' => 'dairy', 'calories_per_100g' => 300, 'protein_per_100g' => 18, 'carbs_per_100g' => 2, 'fat_per_100g' => 24, 'serving_size_grams' => 30, 'serving_unit_singular' => 'tajada', 'serving_unit_plural' => 'tajadas'],
            // Esta línea sirve para agregar "Cuajada" (categoría dairy) con sus valores por 100 g y su porción.
            ['name' => 'Cuajada', 'category' => 'dairy', 'calories_per_100g' => 98, 'protein_per_100g' => 13, 'carbs_per_100g' => 3, 'fat_per_100g' => 4, 'serving_size_grams' => 100, 'serving_unit_singular' => 'porción', 'serving_unit_plural' => 'porciones'],
        ];

        // Esta línea sirve para recorrer cada alimento de la lista.
        foreach ($foods as $food) {
            // Esta línea sirve para crear el alimento, o actualizarlo si ya existía.
            FoodItem::query()->updateOrCreate(
                // Esta línea sirve para buscarlo por nombre entre los alimentos del catálogo manual.
                ['name' => $food['name'], 'source' => 'manual'],
                // Esta línea sirve para guardar sus datos marcándolo como del catálogo manual.
                $food + ['source' => 'manual'],
            );
        }
    }
}
