<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Nutrition.

namespace Tests\Unit\Domain\Nutrition;

// Esta línea sirve para importar la clase NutritionPlanTemplateCatalog.
use App\Domain\Nutrition\Services\NutritionPlanTemplateCatalog;
// Esta línea sirve para importar el modelo FoodItem.
use App\Models\FoodItem;
// Esta línea sirve para importar la clase FoodItemSeeder.
use Database\Seeders\FoodItemSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Extiende Tests\TestCase (no PHPUnit\Framework\TestCase puro) porque
 * verificar los nombres contra el catálogo real necesita el framework
 * arrancado — mismo criterio que NutritionTargetCalculatorTest.
 */
// Esta línea sirve para declarar la clase de tests NutritionPlanTemplateCatalogTest.
class NutritionPlanTemplateCatalogTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para definir los objetivos que tienen tres variantes de plantilla.
    private const GOALS_WITH_THREE_VARIANTS = ['gain_muscle', 'lose_fat', 'body_recomposition', 'health'];

    // Esta línea sirve para definir los objetivos que tienen dos variantes de plantilla.
    private const GOALS_WITH_TWO_VARIANTS = ['strength', 'cardio', 'endurance', 'sport_performance'];

    // Esta línea sirve para declarar el test que comprueba que hay exactamente 20 plantillas.
    public function test_there_are_exactly_20_templates(): void
    {
        // Esta línea sirve para exigir que el catálogo tenga 20 plantillas.
        $this->assertCount(20, NutritionPlanTemplateCatalog::definitions());
    }

    // Esta línea sirve para declarar el test que comprueba que cada objetivo tiene el número esperado de variantes.
    public function test_each_goal_has_the_expected_number_of_variants(): void
    {
        // Esta línea sirve para recorrer los objetivos con tres variantes.
        foreach (self::GOALS_WITH_THREE_VARIANTS as $goal) {
            // Esta línea sirve para exigir que tengan 3 plantillas.
            $this->assertCount(3, NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal}");
        }

        // Esta línea sirve para recorrer los objetivos con dos variantes.
        foreach (self::GOALS_WITH_TWO_VARIANTS as $goal) {
            // Esta línea sirve para exigir que tengan 2 plantillas.
            $this->assertCount(2, NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal}");
        }
    }

    // Esta línea sirve para declarar el test que comprueba que cada objetivo configurado tiene al menos una plantilla.
    public function test_every_configured_goal_has_at_least_one_template(): void
    {
        // Mismas claves que config('nutrition.calorie_adjustment_by_goal') —
        // si se agrega un objetivo nuevo ahí sin agregarle plantilla acá,
        // este test lo detecta.
        // Esta línea sirve para recorrer los objetivos de la configuración de nutrición.
        foreach (array_keys(config('nutrition.calorie_adjustment_by_goal')) as $goal) {
            // Esta línea sirve para exigir que el objetivo tenga plantillas.
            $this->assertNotSame([], NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal} sin plantilla");
        }
    }

    // Esta línea sirve para declarar el test que comprueba que cada plantilla cubre todos los tipos de comida y categorías que pide la configuración.
    public function test_every_template_covers_every_meal_type_and_category_the_config_expects(): void
    {
        // Esta línea sirve para obtener las categorías de cada comida de la configuración.
        $mealCategories = config('nutrition.meal_categories');

        // Esta línea sirve para recorrer cada plantilla del catálogo.
        foreach (NutritionPlanTemplateCatalog::definitions() as $template) {
            // Esta línea sirve para recorrer cada tipo de comida configurado.
            foreach ($mealCategories as $mealType => $categories) {
                // Esta línea sirve para exigir que la plantilla incluya ese tipo de comida.
                $this->assertArrayHasKey($mealType, $template['meals'], "goal={$template['goal']} sin {$mealType}");

                // Esta línea sirve para recorrer las categorías de esa comida.
                foreach ($categories as $category) {
                    // Esta línea sirve para exigir que la plantilla incluya.
                    $this->assertArrayHasKey(
                        // Esta línea sirve para indicar la categoría esperada.
                        $category,
                        // Esta línea sirve para indicar la comida donde debe estar.
                        $template['meals'][$mealType],
                        // Esta línea sirve para mostrar este mensaje si falla.
                        "goal={$template['goal']} {$mealType} sin categoría {$category}",
                    );
                }
            }
        }
    }

    /**
     * El bug real que esto evita: un nombre en el catálogo de plantillas que
     * no coincide EXACTO (tilde, categoría) con ningún FoodItem sembrado —
     * GenerateNutritionPlanAction lo tolera (cae al azar), pero eso
     * silenciosamente rompería la personalización sin que ningún test lo
     * note si no se verifica acá.
     */
    // Esta línea sirve para declarar el test que comprueba que cada alimento de las plantillas existe en el catálogo sembrado con su categoría.
    public function test_every_food_name_referenced_by_a_template_exists_in_the_seeded_catalog_with_the_right_category(): void
    {
        // Esta línea sirve para sembrar los datos de FoodItemSeeder.
        $this->seed(FoodItemSeeder::class);

        // Esta línea sirve para recorrer cada plantilla.
        foreach (NutritionPlanTemplateCatalog::definitions() as $template) {
            // Esta línea sirve para recorrer cada comida de la plantilla.
            foreach ($template['meals'] as $mealType => $categories) {
                // Esta línea sirve para recorrer cada categoría con su alimento.
                foreach ($categories as $category => $foodName) {
                    // Esta línea sirve para consultar si el alimento existe en el catálogo.
                    $exists = FoodItem::query()
                        // Esta línea sirve para filtrar por name.
                        ->where('name', $foodName)
                        // Esta línea sirve para filtrar por category.
                        ->where('category', $category)
                        // Esta línea sirve para filtrar por source.
                        ->where('source', 'manual')
                        // Esta línea sirve para comprobar que existe.
                        ->exists();

                    // Esta línea sirve para exigir que exista y mostrar el detalle si falla.
                    $this->assertTrue($exists, "goal={$template['goal']} {$mealType}.{$category} = \"{$foodName}\" no existe en el catálogo sembrado");
                }
            }
        }
    }

    // Esta línea sirve para declarar el test que comprueba que la elección de plantilla es estable para el mismo usuario.
    public function test_pick_for_user_is_stable_for_the_same_user(): void
    {
        // Esta línea sirve para elegir la plantilla del usuario 42.
        $first = NutritionPlanTemplateCatalog::pickForUser(42, 'gain_muscle');
        // Esta línea sirve para elegirla otra vez.
        $second = NutritionPlanTemplateCatalog::pickForUser(42, 'gain_muscle');

        // Esta línea sirve para exigir que sea la misma.
        $this->assertSame($first, $second);
    }

    // Esta línea sirve para declarar el test que comprueba que la elección puede variar entre usuarios con el mismo objetivo.
    public function test_pick_for_user_can_differ_between_users_with_the_same_goal(): void
    {
        // gain_muscle tiene 3 variantes -- barrer suficientes IDs de usuario
        // tiene que tocar más de una variante distinta.
        // Esta línea sirve para contar cuántas plantillas distintas se eligen para 10 usuarios.
        $picked = collect(range(1, 10))
            // Esta línea sirve para elegir la plantilla de cada usuario.
            ->map(fn (int $userId) => NutritionPlanTemplateCatalog::pickForUser($userId, 'gain_muscle'))
            // Esta línea sirve para quitar las repetidas.
            ->unique()
            // Esta línea sirve para contarlas.
            ->count();

        // Esta línea sirve para exigir que haya más de una.
        $this->assertGreaterThan(1, $picked);
    }

    // Esta línea sirve para declarar el test que comprueba que un objetivo desconocido no devuelve plantilla.
    public function test_pick_for_user_returns_null_for_an_unknown_goal(): void
    {
        // Esta línea sirve para exigir null para un objetivo inexistente.
        $this->assertNull(NutritionPlanTemplateCatalog::pickForUser(1, 'not_a_real_goal'));
    }
}
