<?php

namespace App\Domain\Nutrition\Services;

/**
 * 20 planes de comidas curados a mano — reemplaza la elección al azar de
 * GenerateNutritionPlanAction por una selección explícita según el objetivo
 * primario del usuario (OnboardingResponse.goals[0], mismo criterio que ya
 * usa NutritionTargetCalculator para las calorías/macros). Las cantidades
 * de cada alimento siguen calculándose igual que siempre (ver
 * GenerateNutritionPlanAction::gramsForMacro/FIXED_PORTION_GRAMS) — lo único
 * que cambia es QUÉ alimento entra en cada casillero de cada comida, no
 * cuánto de ese alimento.
 *
 * Cada entrada indica, por tipo de comida, el nombre del FoodItem (`source`
 * = 'manual', ver FoodItemSeeder) que ocupa cada categoría de
 * config('nutrition.meal_categories') — así una comida sigue necesitando
 * exactamente esas categorías, solo que el alimento ya no es aleatorio.
 * Todos los alimentos referenciados son fáciles de conseguir en cualquier
 * tienda/plaza de mercado en Colombia (sin productos importados ni de
 * nicho).
 *
 * 8 objetivos posibles (mismas claves que config('nutrition.calorie_adjustment_by_goal')):
 * los 4 más comunes en una app de fitness general (gain_muscle, lose_fat,
 * body_recomposition, health) tienen 3 variantes cada uno; los 4 más
 * específicos (strength, cardio, endurance, sport_performance) tienen 2 —
 * total 20. La variante se elige de forma estable por usuario (ver
 * `pickForUser`), así dos personas con el mismo objetivo no ven
 * necesariamente el mismo plan, pero la misma persona no ve un plan
 * distinto cada vez que lo regenera.
 */
final class NutritionPlanTemplateCatalog
{
    /**
     * @return array<int, array{goal: string, meals: array<string, array<string, string>>}>
     */
    public static function definitions(): array
    {
        return [
            // ---- gain_muscle (3) ----
            ['goal' => 'gain_muscle', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Brócoli'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Mango'],
                'dinner' => ['protein' => 'Carne magra de res', 'carb' => 'Papa', 'vegetable' => 'Zanahoria'],
            ]],
            ['goal' => 'gain_muscle', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Papaya'],
                'lunch' => ['protein' => 'Carne molida de res', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Habichuela'],
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Piña'],
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Yuca cocida', 'vegetable' => 'Pimentón'],
            ]],
            ['goal' => 'gain_muscle', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Mora'],
                'lunch' => ['protein' => 'Lomo de cerdo', 'carb' => 'Papa criolla', 'vegetable' => 'Tomate'],
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Guayaba'],
                'dinner' => ['protein' => 'Atún al natural', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- lose_fat (3) ----
            ['goal' => 'lose_fat', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Batata', 'vegetable' => 'Espinaca'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Naranja'],
                'dinner' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Papa', 'vegetable' => 'Brócoli'],
            ]],
            ['goal' => 'lose_fat', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Papaya'],
                'lunch' => ['protein' => 'Tilapia', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Pepino cohombro'],
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Patilla'],
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Ñame cocido', 'vegetable' => 'Lechuga'],
            ]],
            ['goal' => 'lose_fat', 'meals' => [
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Avena', 'fruit' => 'Mora'],
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Papa criolla', 'vegetable' => 'Zanahoria'],
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Manzana'],
                'dinner' => ['protein' => 'Camarones', 'carb' => 'Yuca cocida', 'vegetable' => 'Habichuela'],
            ]],

            // ---- body_recomposition (3) ----
            ['goal' => 'body_recomposition', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Piña'],
                'dinner' => ['protein' => 'Carne magra de res', 'carb' => 'Batata', 'vegetable' => 'Brócoli'],
            ]],
            ['goal' => 'body_recomposition', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Naranja'],
                'lunch' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Papa', 'vegetable' => 'Espinaca'],
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Mango'],
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Pimentón'],
            ]],
            ['goal' => 'body_recomposition', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Guayaba'],
                'lunch' => ['protein' => 'Garbanzos cocidos', 'carb' => 'Papa criolla', 'vegetable' => 'Tomate'],
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Mora'],
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Yuca cocida', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- health (3) ----
            ['goal' => 'health', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa', 'vegetable' => 'Lechuga'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Naranja'],
                'dinner' => ['protein' => 'Frijoles rojos cocidos', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
            ]],
            ['goal' => 'health', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Pan integral', 'fruit' => 'Papaya'],
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Papa criolla', 'vegetable' => 'Brócoli'],
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Banana'],
                'dinner' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Yuca cocida', 'vegetable' => 'Habichuela'],
            ]],
            ['goal' => 'health', 'meals' => [
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Arepa de maíz', 'fruit' => 'Mango'],
                'lunch' => ['protein' => 'Pechuga de pavo', 'carb' => 'Batata', 'vegetable' => 'Pepino cohombro'],
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Piña'],
                'dinner' => ['protein' => 'Garbanzos cocidos', 'carb' => 'Ñame cocido', 'vegetable' => 'Espinaca'],
            ]],

            // ---- strength (2) ----
            ['goal' => 'strength', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                'lunch' => ['protein' => 'Carne magra de res', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Brócoli'],
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Mora'],
                'dinner' => ['protein' => 'Lomo de cerdo', 'carb' => 'Papa', 'vegetable' => 'Zanahoria'],
            ]],
            ['goal' => 'strength', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Mango'],
                'lunch' => ['protein' => 'Carne molida de res', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Habichuela'],
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Guayaba'],
                'dinner' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa criolla', 'vegetable' => 'Pimentón'],
            ]],

            // ---- cardio (2) ----
            ['goal' => 'cardio', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Batata', 'vegetable' => 'Espinaca'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Patilla'],
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Papa', 'vegetable' => 'Tomate'],
            ]],
            ['goal' => 'cardio', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Piña'],
                'lunch' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Pepino cohombro'],
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Naranja'],
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Yuca cocida', 'vegetable' => 'Lechuga'],
            ]],

            // ---- endurance (2) ----
            ['goal' => 'endurance', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Mango'],
                'dinner' => ['protein' => 'Atún al natural', 'carb' => 'Papa criolla', 'vegetable' => 'Habichuela'],
            ]],
            ['goal' => 'endurance', 'meals' => [
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Mora'],
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Brócoli'],
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Papaya'],
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Ñame cocido', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- sport_performance (2) ----
            ['goal' => 'sport_performance', 'meals' => [
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Guayaba'],
                'lunch' => ['protein' => 'Carne magra de res', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Espinaca'],
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Piña'],
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Batata', 'vegetable' => 'Pimentón'],
            ]],
            ['goal' => 'sport_performance', 'meals' => [
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Pan integral', 'fruit' => 'Naranja'],
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa', 'vegetable' => 'Tomate'],
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Mango'],
                'dinner' => ['protein' => 'Garbanzos cocidos', 'carb' => 'Yuca cocida', 'vegetable' => 'Cebolla'],
            ]],
        ];
    }

    /**
     * Todas las variantes disponibles para un objetivo — vacío si el
     * objetivo no coincide con ninguna (no debería pasar, los 8 objetivos de
     * config('nutrition.calorie_adjustment_by_goal') están todos cubiertos).
     *
     * @return array<int, array{goal: string, meals: array<string, array<string, string>>}>
     */
    public static function forGoal(string $goal): array
    {
        return array_values(array_filter(
            self::definitions(),
            fn (array $template) => $template['goal'] === $goal,
        ));
    }

    /**
     * Elige una variante de forma estable por usuario: el mismo usuario
     * siempre cae en la misma variante (no cambia con cada regeneración del
     * plan), pero dos usuarios distintos con el mismo objetivo no
     * necesariamente ven la misma — así se resuelve "misma nutrición para
     * todos" sin perder la consistencia de plan para una misma persona.
     *
     * @return array{goal: string, meals: array<string, array<string, string>>}|null null si el objetivo no tiene ninguna plantilla (no debería pasar).
     */
    public static function pickForUser(int $userId, string $goal): ?array
    {
        $candidates = self::forGoal($goal);

        if ($candidates === []) {
            return null;
        }

        return $candidates[$userId % count($candidates)];
    }
}
