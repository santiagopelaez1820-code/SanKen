<?php

namespace Tests\Unit\Domain\Nutrition;

use App\Domain\Nutrition\Services\NutritionPlanTemplateCatalog;
use App\Models\FoodItem;
use Database\Seeders\FoodItemSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Extiende Tests\TestCase (no PHPUnit\Framework\TestCase puro) porque
 * verificar los nombres contra el catálogo real necesita el framework
 * arrancado — mismo criterio que NutritionTargetCalculatorTest.
 */
class NutritionPlanTemplateCatalogTest extends TestCase
{
    use RefreshDatabase;

    private const GOALS_WITH_THREE_VARIANTS = ['gain_muscle', 'lose_fat', 'body_recomposition', 'health'];

    private const GOALS_WITH_TWO_VARIANTS = ['strength', 'cardio', 'endurance', 'sport_performance'];

    public function test_there_are_exactly_20_templates(): void
    {
        $this->assertCount(20, NutritionPlanTemplateCatalog::definitions());
    }

    public function test_each_goal_has_the_expected_number_of_variants(): void
    {
        foreach (self::GOALS_WITH_THREE_VARIANTS as $goal) {
            $this->assertCount(3, NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal}");
        }

        foreach (self::GOALS_WITH_TWO_VARIANTS as $goal) {
            $this->assertCount(2, NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal}");
        }
    }

    public function test_every_configured_goal_has_at_least_one_template(): void
    {
        // Mismas claves que config('nutrition.calorie_adjustment_by_goal') —
        // si se agrega un objetivo nuevo ahí sin agregarle plantilla acá,
        // este test lo detecta.
        foreach (array_keys(config('nutrition.calorie_adjustment_by_goal')) as $goal) {
            $this->assertNotSame([], NutritionPlanTemplateCatalog::forGoal($goal), "goal={$goal} sin plantilla");
        }
    }

    public function test_every_template_covers_every_meal_type_and_category_the_config_expects(): void
    {
        $mealCategories = config('nutrition.meal_categories');

        foreach (NutritionPlanTemplateCatalog::definitions() as $template) {
            foreach ($mealCategories as $mealType => $categories) {
                $this->assertArrayHasKey($mealType, $template['meals'], "goal={$template['goal']} sin {$mealType}");

                foreach ($categories as $category) {
                    $this->assertArrayHasKey(
                        $category,
                        $template['meals'][$mealType],
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
    public function test_every_food_name_referenced_by_a_template_exists_in_the_seeded_catalog_with_the_right_category(): void
    {
        $this->seed(FoodItemSeeder::class);

        foreach (NutritionPlanTemplateCatalog::definitions() as $template) {
            foreach ($template['meals'] as $mealType => $categories) {
                foreach ($categories as $category => $foodName) {
                    $exists = FoodItem::query()
                        ->where('name', $foodName)
                        ->where('category', $category)
                        ->where('source', 'manual')
                        ->exists();

                    $this->assertTrue($exists, "goal={$template['goal']} {$mealType}.{$category} = \"{$foodName}\" no existe en el catálogo sembrado");
                }
            }
        }
    }

    public function test_pick_for_user_is_stable_for_the_same_user(): void
    {
        $first = NutritionPlanTemplateCatalog::pickForUser(42, 'gain_muscle');
        $second = NutritionPlanTemplateCatalog::pickForUser(42, 'gain_muscle');

        $this->assertSame($first, $second);
    }

    public function test_pick_for_user_can_differ_between_users_with_the_same_goal(): void
    {
        // gain_muscle tiene 3 variantes -- barrer suficientes IDs de usuario
        // tiene que tocar más de una variante distinta.
        $picked = collect(range(1, 10))
            ->map(fn (int $userId) => NutritionPlanTemplateCatalog::pickForUser($userId, 'gain_muscle'))
            ->unique()
            ->count();

        $this->assertGreaterThan(1, $picked);
    }

    public function test_pick_for_user_returns_null_for_an_unknown_goal(): void
    {
        $this->assertNull(NutritionPlanTemplateCatalog::pickForUser(1, 'not_a_real_goal'));
    }
}
