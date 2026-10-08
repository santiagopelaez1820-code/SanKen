<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de nutrición.

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
// Esta línea sirve para declarar el catálogo de planes de comidas curados.
final class NutritionPlanTemplateCatalog
{
    /**
     * @return array<int, array{goal: string, meals: array<string, array<string, string>>}>
     */
    // Esta línea sirve para declarar el método que devuelve todos los planes curados.
    public static function definitions(): array
    {
        // Esta línea sirve para devolver la lista de planes.
        return [
            // ---- gain_muscle (3) ----
            // Esta línea sirve para definir el plan 1 para ganar músculo.
            ['goal' => 'gain_muscle', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y banana.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, arroz blanco y brócoli.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Brócoli'],
                // Esta línea sirve para definir la merienda: yogur natural y mango.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Mango'],
                // Esta línea sirve para definir la cena: carne magra de res, papa y zanahoria.
                'dinner' => ['protein' => 'Carne magra de res', 'carb' => 'Papa', 'vegetable' => 'Zanahoria'],
            ]],
            // Esta línea sirve para definir el plan 2 para ganar músculo.
            ['goal' => 'gain_muscle', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, arepa de maíz y papaya.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Papaya'],
                // Esta línea sirve para definir el almuerzo: carne molida, plátano verde y habichuela.
                'lunch' => ['protein' => 'Carne molida de res', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Habichuela'],
                // Esta línea sirve para definir la merienda: queso campesino y piña.
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Piña'],
                // Esta línea sirve para definir la cena: pechuga de pavo, yuca cocida y pimentón.
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Yuca cocida', 'vegetable' => 'Pimentón'],
            ]],
            // Esta línea sirve para definir el plan 3 para ganar músculo.
            ['goal' => 'gain_muscle', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, pan integral y mora.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Mora'],
                // Esta línea sirve para definir el almuerzo: lomo de cerdo, papa criolla y tomate.
                'lunch' => ['protein' => 'Lomo de cerdo', 'carb' => 'Papa criolla', 'vegetable' => 'Tomate'],
                // Esta línea sirve para definir la merienda: leche descremada y guayaba.
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Guayaba'],
                // Esta línea sirve para definir la cena: atún al natural, arroz blanco y ahuyama.
                'dinner' => ['protein' => 'Atún al natural', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- lose_fat (3) ----
            // Esta línea sirve para definir el plan 1 para perder grasa.
            ['goal' => 'lose_fat', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, avena y manzana.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, batata y espinaca.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Batata', 'vegetable' => 'Espinaca'],
                // Esta línea sirve para definir la merienda: yogur natural y naranja.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Naranja'],
                // Esta línea sirve para definir la cena: pescado blanco, papa y brócoli.
                'dinner' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Papa', 'vegetable' => 'Brócoli'],
            ]],
            // Esta línea sirve para definir el plan 2 para perder grasa.
            ['goal' => 'lose_fat', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, pan integral y papaya.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Papaya'],
                // Esta línea sirve para definir el almuerzo: tilapia, arroz blanco y pepino cohombro.
                'lunch' => ['protein' => 'Tilapia', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Pepino cohombro'],
                // Esta línea sirve para definir la merienda: queso fresco y patilla.
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Patilla'],
                // Esta línea sirve para definir la cena: pechuga de pavo, ñame cocido y lechuga.
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Ñame cocido', 'vegetable' => 'Lechuga'],
            ]],
            // Esta línea sirve para definir el plan 3 para perder grasa.
            ['goal' => 'lose_fat', 'meals' => [
                // Esta línea sirve para definir el desayuno: atún al natural, avena y mora.
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Avena', 'fruit' => 'Mora'],
                // Esta línea sirve para definir el almuerzo: lentejas cocidas, papa criolla y zanahoria.
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Papa criolla', 'vegetable' => 'Zanahoria'],
                // Esta línea sirve para definir la merienda: leche descremada y manzana.
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Manzana'],
                // Esta línea sirve para definir la cena: camarones, yuca cocida y habichuela.
                'dinner' => ['protein' => 'Camarones', 'carb' => 'Yuca cocida', 'vegetable' => 'Habichuela'],
            ]],

            // ---- body_recomposition (3) ----
            // Esta línea sirve para definir el plan 1 para recomposición corporal.
            ['goal' => 'body_recomposition', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y banana.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, arroz blanco y zanahoria.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
                // Esta línea sirve para definir la merienda: yogur natural y piña.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Piña'],
                // Esta línea sirve para definir la cena: carne magra de res, batata y brócoli.
                'dinner' => ['protein' => 'Carne magra de res', 'carb' => 'Batata', 'vegetable' => 'Brócoli'],
            ]],
            // Esta línea sirve para definir el plan 2 para recomposición corporal.
            ['goal' => 'body_recomposition', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, arepa de maíz y naranja.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Naranja'],
                // Esta línea sirve para definir el almuerzo: pescado blanco, papa y espinaca.
                'lunch' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Papa', 'vegetable' => 'Espinaca'],
                // Esta línea sirve para definir la merienda: queso campesino y mango.
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Mango'],
                // Esta línea sirve para definir la cena: pechuga de pavo, plátano verde y pimentón.
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Pimentón'],
            ]],
            // Esta línea sirve para definir el plan 3 para recomposición corporal.
            ['goal' => 'body_recomposition', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, pan integral y guayaba.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Guayaba'],
                // Esta línea sirve para definir el almuerzo: garbanzos cocidos, papa criolla y tomate.
                'lunch' => ['protein' => 'Garbanzos cocidos', 'carb' => 'Papa criolla', 'vegetable' => 'Tomate'],
                // Esta línea sirve para definir la merienda: kumis y mora.
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Mora'],
                // Esta línea sirve para definir la cena: tilapia, yuca cocida y ahuyama.
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Yuca cocida', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- health (3) ----
            // Esta línea sirve para definir el plan 1 para salud general.
            ['goal' => 'health', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y manzana.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, papa y lechuga.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa', 'vegetable' => 'Lechuga'],
                // Esta línea sirve para definir la merienda: yogur natural y naranja.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Naranja'],
                // Esta línea sirve para definir la cena: frijoles rojos, arroz blanco y zanahoria.
                'dinner' => ['protein' => 'Frijoles rojos cocidos', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
            ]],
            // Esta línea sirve para definir el plan 2 para salud general.
            ['goal' => 'health', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, pan integral y papaya.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Pan integral', 'fruit' => 'Papaya'],
                // Esta línea sirve para definir el almuerzo: lentejas cocidas, papa criolla y brócoli.
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Papa criolla', 'vegetable' => 'Brócoli'],
                // Esta línea sirve para definir la merienda: queso fresco y banana.
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Banana'],
                // Esta línea sirve para definir la cena: pescado blanco, yuca cocida y habichuela.
                'dinner' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Yuca cocida', 'vegetable' => 'Habichuela'],
            ]],
            // Esta línea sirve para definir el plan 3 para salud general.
            ['goal' => 'health', 'meals' => [
                // Esta línea sirve para definir el desayuno: atún al natural, arepa de maíz y mango.
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Arepa de maíz', 'fruit' => 'Mango'],
                // Esta línea sirve para definir el almuerzo: pechuga de pavo, batata y pepino cohombro.
                'lunch' => ['protein' => 'Pechuga de pavo', 'carb' => 'Batata', 'vegetable' => 'Pepino cohombro'],
                // Esta línea sirve para definir la merienda: kumis y piña.
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Piña'],
                // Esta línea sirve para definir la cena: garbanzos cocidos, ñame cocido y espinaca.
                'dinner' => ['protein' => 'Garbanzos cocidos', 'carb' => 'Ñame cocido', 'vegetable' => 'Espinaca'],
            ]],

            // ---- strength (2) ----
            // Esta línea sirve para definir el plan 1 para fuerza.
            ['goal' => 'strength', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y banana.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                // Esta línea sirve para definir el almuerzo: carne magra de res, arroz blanco y brócoli.
                'lunch' => ['protein' => 'Carne magra de res', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Brócoli'],
                // Esta línea sirve para definir la merienda: queso campesino y mora.
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Mora'],
                // Esta línea sirve para definir la cena: lomo de cerdo, papa y zanahoria.
                'dinner' => ['protein' => 'Lomo de cerdo', 'carb' => 'Papa', 'vegetable' => 'Zanahoria'],
            ]],
            // Esta línea sirve para definir el plan 2 para fuerza.
            ['goal' => 'strength', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, arepa de maíz y mango.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Mango'],
                // Esta línea sirve para definir el almuerzo: carne molida, plátano verde y habichuela.
                'lunch' => ['protein' => 'Carne molida de res', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Habichuela'],
                // Esta línea sirve para definir la merienda: leche descremada y guayaba.
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Guayaba'],
                // Esta línea sirve para definir la cena: pechuga de pollo, papa criolla y pimentón.
                'dinner' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa criolla', 'vegetable' => 'Pimentón'],
            ]],

            // ---- cardio (2) ----
            // Esta línea sirve para definir el plan 1 para cardio.
            ['goal' => 'cardio', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, avena y manzana.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Avena', 'fruit' => 'Manzana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, batata y espinaca.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Batata', 'vegetable' => 'Espinaca'],
                // Esta línea sirve para definir la merienda: yogur natural y patilla.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Patilla'],
                // Esta línea sirve para definir la cena: tilapia, papa y tomate.
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Papa', 'vegetable' => 'Tomate'],
            ]],
            // Esta línea sirve para definir el plan 2 para cardio.
            ['goal' => 'cardio', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, pan integral y piña.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Pan integral', 'fruit' => 'Piña'],
                // Esta línea sirve para definir el almuerzo: pescado blanco, arroz blanco y pepino cohombro.
                'lunch' => ['protein' => 'Pescado blanco (merluza)', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Pepino cohombro'],
                // Esta línea sirve para definir la merienda: queso fresco y naranja.
                'snack' => ['dairy' => 'Queso fresco', 'fruit' => 'Naranja'],
                // Esta línea sirve para definir la cena: pechuga de pavo, yuca cocida y lechuga.
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Yuca cocida', 'vegetable' => 'Lechuga'],
            ]],

            // ---- endurance (2) ----
            // Esta línea sirve para definir el plan 1 para resistencia.
            ['goal' => 'endurance', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y banana.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Banana'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, arroz blanco y zanahoria.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Zanahoria'],
                // Esta línea sirve para definir la merienda: yogur natural y mango.
                'snack' => ['dairy' => 'Yogur natural', 'fruit' => 'Mango'],
                // Esta línea sirve para definir la cena: atún al natural, papa criolla y habichuela.
                'dinner' => ['protein' => 'Atún al natural', 'carb' => 'Papa criolla', 'vegetable' => 'Habichuela'],
            ]],
            // Esta línea sirve para definir el plan 2 para resistencia.
            ['goal' => 'endurance', 'meals' => [
                // Esta línea sirve para definir el desayuno: claras de huevo, arepa de maíz y mora.
                'breakfast' => ['protein' => 'Claras de huevo', 'carb' => 'Arepa de maíz', 'fruit' => 'Mora'],
                // Esta línea sirve para definir el almuerzo: lentejas cocidas, plátano verde y brócoli.
                'lunch' => ['protein' => 'Lentejas cocidas', 'carb' => 'Plátano verde cocido', 'vegetable' => 'Brócoli'],
                // Esta línea sirve para definir la merienda: kumis y papaya.
                'snack' => ['dairy' => 'Kumis', 'fruit' => 'Papaya'],
                // Esta línea sirve para definir la cena: pechuga de pavo, ñame cocido y ahuyama.
                'dinner' => ['protein' => 'Pechuga de pavo', 'carb' => 'Ñame cocido', 'vegetable' => 'Ahuyama'],
            ]],

            // ---- sport_performance (2) ----
            // Esta línea sirve para definir el plan 1 para rendimiento deportivo.
            ['goal' => 'sport_performance', 'meals' => [
                // Esta línea sirve para definir el desayuno: huevo entero, avena y guayaba.
                'breakfast' => ['protein' => 'Huevo entero', 'carb' => 'Avena', 'fruit' => 'Guayaba'],
                // Esta línea sirve para definir el almuerzo: carne magra de res, arroz blanco y espinaca.
                'lunch' => ['protein' => 'Carne magra de res', 'carb' => 'Arroz blanco cocido', 'vegetable' => 'Espinaca'],
                // Esta línea sirve para definir la merienda: queso campesino y piña.
                'snack' => ['dairy' => 'Queso campesino', 'fruit' => 'Piña'],
                // Esta línea sirve para definir la cena: tilapia, batata y pimentón.
                'dinner' => ['protein' => 'Tilapia', 'carb' => 'Batata', 'vegetable' => 'Pimentón'],
            ]],
            // Esta línea sirve para definir el plan 2 para rendimiento deportivo.
            ['goal' => 'sport_performance', 'meals' => [
                // Esta línea sirve para definir el desayuno: atún al natural, pan integral y naranja.
                'breakfast' => ['protein' => 'Atún al natural', 'carb' => 'Pan integral', 'fruit' => 'Naranja'],
                // Esta línea sirve para definir el almuerzo: pechuga de pollo, papa y tomate.
                'lunch' => ['protein' => 'Pechuga de pollo', 'carb' => 'Papa', 'vegetable' => 'Tomate'],
                // Esta línea sirve para definir la merienda: leche descremada y mango.
                'snack' => ['dairy' => 'Leche descremada', 'fruit' => 'Mango'],
                // Esta línea sirve para definir la cena: garbanzos cocidos, yuca cocida y cebolla.
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
    // Esta línea sirve para declarar el método que devuelve los planes de un objetivo.
    public static function forGoal(string $goal): array
    {
        // Esta línea sirve para devolver la lista filtrada y reindexada.
        return array_values(array_filter(
            // Esta línea sirve para partir de todos los planes.
            self::definitions(),
            // Esta línea sirve para quedarse solo con los del objetivo pedido.
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
    // Esta línea sirve para declarar el método que elige un plan de forma estable para un usuario.
    public static function pickForUser(int $userId, string $goal): ?array
    {
        // Esta línea sirve para obtener los planes del objetivo.
        $candidates = self::forGoal($goal);

        // Esta línea sirve para revisar si no hay planes para ese objetivo.
        if ($candidates === []) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para elegir el plan usando el resto de dividir el id del usuario por la cantidad de planes.
        return $candidates[$userId % count($candidates)];
    }
}
