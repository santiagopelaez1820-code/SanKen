<?php

namespace App\Application\Nutrition\Actions;

use App\Domain\Nutrition\Services\NutritionTargetCalculator;
use App\Models\FoodItem;
use App\Models\NutritionPlan;
use App\Models\NutritionPlanMeal;
use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Genera (o regenera, reemplazando el anterior) el plan alimenticio opt-in
 * de un usuario: reparte sus objetivos diarios (NutritionTargetCalculator)
 * entre 4 comidas según config('nutrition.meal_split_ratio'), y arma cada
 * comida con alimentos del catálogo curado (food_items source='manual')
 * según config('nutrition.meal_categories'). Solo usa el catálogo curado,
 * nunca productos de Open Food Facts (marcas/porciones no controladas).
 */
class GenerateNutritionPlanAction
{
    // Porción fija para categorías que no se dimensionan contra un macro
    // objetivo puntual del ítem (a diferencia de protein/carb, ver
    // gramsForMacro). Valores de sentido común para una porción de comida.
    private const FIXED_PORTION_GRAMS = [
        'fat' => 15,
        'vegetable' => 100,
        'fruit' => 120,
        'dairy' => 150,
    ];

    public function __construct(
        private readonly NutritionTargetCalculator $calculator,
    ) {}

    public function generate(User $user): NutritionPlan
    {
        $user->loadMissing('profile', 'onboardingResponse');
        $profile = $user->profile;
        $onboarding = $user->onboardingResponse;

        // Mismo chequeo que NutritionController::targets() -- si no se
        // pueden calcular los objetivos diarios, tampoco se puede generar
        // un plan a partir de ellos.
        if (! $profile?->age || ! $profile->sex || ! $profile->weight_kg || ! $profile->height_cm
            || ! $onboarding?->frequency_days || empty($onboarding->goals)) {
            throw new RuntimeException('profile_incomplete');
        }

        $trainedToday = WorkoutSession::query()
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->whereDate('performed_at', now()->toDateString())
            ->exists();

        $targets = $this->calculator->calculate(
            $profile->age,
            $profile->sex,
            (float) $profile->weight_kg,
            (float) $profile->height_cm,
            $onboarding->frequency_days,
            $onboarding->goals,
            $trainedToday,
        );

        return DB::transaction(function () use ($user, $targets) {
            // Un usuario tiene a lo sumo un plan (unique en user_id):
            // regenerar reemplaza el anterior por completo, cascade borra
            // sus meals/items.
            NutritionPlan::query()->where('user_id', $user->id)->delete();

            $plan = NutritionPlan::query()->create([
                'user_id' => $user->id,
                'calories' => $targets['calories'],
                'protein_g' => $targets['protein_g'],
                'carbs_g' => $targets['carbs_g'],
                'fat_g' => $targets['fat_g'],
            ]);

            $order = 0;
            foreach (config('nutrition.meal_split_ratio') as $mealType => $ratio) {
                $order++;

                $meal = $plan->meals()->create([
                    'meal_type' => $mealType,
                    'order' => $order,
                    'target_calories' => (int) round($targets['calories'] * $ratio),
                    'target_protein_g' => (int) round($targets['protein_g'] * $ratio),
                    'target_carbs_g' => (int) round($targets['carbs_g'] * $ratio),
                    'target_fat_g' => (int) round($targets['fat_g'] * $ratio),
                ]);

                $this->fillMeal($meal, $mealType);
            }

            return $plan->load('meals.items.foodItem');
        });
    }

    private function fillMeal(NutritionPlanMeal $meal, string $mealType): void
    {
        $categories = config("nutrition.meal_categories.{$mealType}", []);

        foreach ($categories as $category) {
            $food = FoodItem::query()
                ->where('source', 'manual')
                ->where('category', $category)
                ->inRandomOrder()
                ->first();

            if (! $food) {
                // El catálogo curado no tiene ningún alimento de esta
                // categoría todavía -- no debería pasar con el seeder
                // actual, pero no tiene sentido reventar la generación
                // entera del plan por una categoría faltante.
                continue;
            }

            $grams = match ($category) {
                'protein' => $this->gramsForMacro($meal->target_protein_g, (float) $food->protein_per_100g),
                'carb' => $this->gramsForMacro($meal->target_carbs_g, (float) $food->carbs_per_100g),
                default => self::FIXED_PORTION_GRAMS[$category] ?? 100,
            };

            $meal->items()->create([
                'food_item_id' => $food->id,
                'quantity_grams' => $grams,
            ]);
        }
    }

    private function gramsForMacro(int $targetGrams, float $per100g): float
    {
        if ($per100g <= 0) {
            return 100.0;
        }

        $grams = ($targetGrams / $per100g) * 100;

        // Clamp a una porción físicamente razonable (20g-500g) para que un
        // objetivo muy chico/grande no genere una cantidad absurda.
        return round(max(20.0, min($grams, 500.0)), 1);
    }
}
