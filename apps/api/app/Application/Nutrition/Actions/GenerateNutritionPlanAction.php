<?php

namespace App\Application\Nutrition\Actions;

use App\Domain\Nutrition\Services\NutritionPlanTemplateCatalog;
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
 * comida con alimentos del catálogo curado (food_items source='manual').
 * Solo usa el catálogo curado, nunca productos de Open Food Facts (marcas/
 * porciones no controladas).
 *
 * Qué alimento entra en cada comida sale de NutritionPlanTemplateCatalog
 * (20 planes curados según el objetivo primario del usuario, elegidos de
 * forma estable por usuario) en vez de elegirse al azar — así dos usuarios
 * con datos distintos no terminan viendo la misma combinación de comidas.
 * Las CANTIDADES siguen calculándose exactamente igual que siempre
 * (gramsForMacro/FIXED_PORTION_GRAMS), eso no cambió.
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

        // Mismo criterio que NutritionTargetCalculator: solo la meta
        // primaria (primer elemento) decide qué plan curado se usa.
        $template = NutritionPlanTemplateCatalog::pickForUser($user->id, $onboarding->goals[0] ?? '');

        return DB::transaction(function () use ($user, $targets, $template) {
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

                $this->fillMeal($meal, $mealType, $template['meals'][$mealType] ?? []);
            }

            return $plan->load('meals.items.foodItem');
        });
    }

    /**
     * @param  array<string, string>  $templateFoodNames  categoría -> nombre del FoodItem elegido para esta comida en el plan curado (vacío si no hay plantilla para el objetivo del usuario).
     */
    private function fillMeal(NutritionPlanMeal $meal, string $mealType, array $templateFoodNames): void
    {
        $categories = config("nutrition.meal_categories.{$mealType}", []);

        foreach ($categories as $category) {
            $food = null;

            // Primero el alimento que indica el plan curado para esta
            // categoría; si no existe en el catálogo (no debería pasar,
            // pero un catálogo desactualizado no tiene por qué tumbar la
            // generación) o no hay plantilla para el objetivo del usuario,
            // cae al azar de siempre dentro de la misma categoría.
            if (isset($templateFoodNames[$category])) {
                $food = FoodItem::query()
                    ->where('source', 'manual')
                    ->where('category', $category)
                    ->where('name', $templateFoodNames[$category])
                    ->first();
            }

            $food ??= FoodItem::query()
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
