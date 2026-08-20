<?php

namespace Tests\Feature\Nutrition;

use App\Models\FoodItem;
use App\Models\NutritionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NutritionPlanApiTest extends TestCase
{
    use RefreshDatabase;

    private function completeProfileFor(User $user, array $goals = ['gain_muscle'], int $frequencyDays = 4): void
    {
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 82]);
        $user->onboardingResponse()->create([
            'goals' => $goals,
            'frequency_days' => $frequencyDays,
            'completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Un alimento curado por categoría -- cubre todas las categorías que
     * config('nutrition.meal_categories') pide para las 4 comidas
     * (breakfast/lunch/snack/dinner), así generate() nunca se queda sin
     * candidato para ninguna.
     */
    private function seedCuratedCatalog(): void
    {
        $foods = [
            ['name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165, 'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6],
            ['name' => 'Arroz blanco cocido', 'category' => 'carb', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7, 'carbs_per_100g' => 28, 'fat_per_100g' => 0.3],
            ['name' => 'Aceite de oliva', 'category' => 'fat', 'calories_per_100g' => 884, 'protein_per_100g' => 0, 'carbs_per_100g' => 0, 'fat_per_100g' => 100],
            ['name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34, 'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4],
            ['name' => 'Banana', 'category' => 'fruit', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3],
            ['name' => 'Yogur natural', 'category' => 'dairy', 'calories_per_100g' => 61, 'protein_per_100g' => 3.5, 'carbs_per_100g' => 4.7, 'fat_per_100g' => 3.3],
        ];

        foreach ($foods as $food) {
            FoodItem::query()->create([...$food, 'source' => 'manual']);
        }
    }

    // --- generar plan ---

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/v1/nutrition/plan')->assertUnauthorized();
        $this->postJson('/api/v1/nutrition/plan')->assertUnauthorized();
        $this->patchJson('/api/v1/nutrition/plan/items/1', ['food_item_id' => 1])->assertUnauthorized();
    }

    public function test_generating_a_plan_requires_a_complete_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan')->assertUnprocessable();
    }

    public function test_generating_a_plan_creates_4_meals_from_the_curated_catalog(): void
    {
        $user = User::factory()->create();
        $this->completeProfileFor($user);
        $this->seedCuratedCatalog();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan');

        $response->assertCreated();
        $response->assertJsonCount(4, 'data.meals');
        $response->assertJsonPath('data.meals.0.meal_type', 'breakfast');
        $response->assertJsonPath('data.meals.1.meal_type', 'lunch');
        $response->assertJsonPath('data.meals.2.meal_type', 'snack');
        $response->assertJsonPath('data.meals.3.meal_type', 'dinner');
        $response->assertJsonCount(3, 'data.meals.0.items'); // protein, carb, fruit
        $response->assertJsonCount(2, 'data.meals.2.items'); // dairy, fruit
        $this->assertDatabaseCount('nutrition_plans', 1);

        // Solo alimentos del catálogo curado (source=manual), nunca de Open
        // Food Facts -- las porciones de ese catálogo no están controladas.
        $usedFoodIds = collect($response->json('data.meals'))
            ->flatMap(fn ($meal) => $meal['items'])
            ->pluck('food_item.id');
        $this->assertTrue(
            FoodItem::query()->whereIn('id', $usedFoodIds)->where('source', '!=', 'manual')->doesntExist()
        );
    }

    public function test_regenerating_a_plan_replaces_the_previous_one_instead_of_stacking(): void
    {
        $user = User::factory()->create();
        $this->completeProfileFor($user);
        $this->seedCuratedCatalog();
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/nutrition/plan')->assertCreated();
        $client->postJson('/api/v1/nutrition/plan')->assertCreated();

        $this->assertDatabaseCount('nutrition_plans', 1);
        $this->assertDatabaseCount('nutrition_plan_meals', 4);
    }

    // --- consultar plan ---

    public function test_show_returns_404_when_the_user_has_no_plan_yet(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/plan')->assertNotFound();
    }

    public function test_show_returns_the_users_plan_with_meals_and_items(): void
    {
        $user = User::factory()->create();
        $this->completeProfileFor($user);
        $this->seedCuratedCatalog();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/plan');

        $response->assertOk();
        $response->assertJsonStructure(['data' => ['id', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'generated_at', 'meals']]);
    }

    // --- sustitución ---

    private function createPlanWithProteinItem(User $user, int $quantityGrams = 200): array
    {
        $proteinFood = FoodItem::query()->create([
            'name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165,
            'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'manual',
        ]);
        $plan = NutritionPlan::query()->create([
            'user_id' => $user->id, 'calories' => 2000, 'protein_g' => 150, 'carbs_g' => 200, 'fat_g' => 60,
        ]);
        $meal = $plan->meals()->create([
            'meal_type' => 'lunch', 'order' => 1,
            'target_calories' => 700, 'target_protein_g' => 50, 'target_carbs_g' => 70, 'target_fat_g' => 20,
        ]);
        $item = $meal->items()->create(['food_item_id' => $proteinFood->id, 'quantity_grams' => $quantityGrams]);

        return [$plan, $item, $proteinFood];
    }

    public function test_substituting_an_item_with_a_same_category_food_preserves_calories(): void
    {
        $user = User::factory()->create();
        [, $item] = $this->createPlanWithProteinItem($user, quantityGrams: 200); // 165 * 2 = 330 kcal
        $newFood = FoodItem::query()->create([
            'name' => 'Carne magra de res', 'category' => 'protein', 'calories_per_100g' => 220,
            'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 10, 'source' => 'manual',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $newFood->id]);

        $response->assertOk();
        $response->assertJsonPath('data.food_item.id', $newFood->id);
        $response->assertJsonPath('data.quantity_grams', 150); // 330 / 220 * 100
        $response->assertJsonPath('data.calories', 330);
        $this->assertDatabaseHas('nutrition_plan_meal_items', [
            'id' => $item->id, 'food_item_id' => $newFood->id, 'quantity_grams' => 150.0,
        ]);
    }

    public function test_substituting_with_a_different_category_food_is_rejected(): void
    {
        $user = User::factory()->create();
        [, $item] = $this->createPlanWithProteinItem($user);
        $vegetable = FoodItem::query()->create([
            'name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34,
            'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4, 'source' => 'manual',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $vegetable->id]);

        $response->assertUnprocessable();
    }

    public function test_a_user_cannot_substitute_an_item_in_someone_elses_plan(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        [, $item] = $this->createPlanWithProteinItem($owner);
        $newFood = FoodItem::query()->create([
            'name' => 'Atún al natural', 'category' => 'protein', 'calories_per_100g' => 116,
            'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'source' => 'manual',
        ]);

        $this->actingAs($intruder, 'sanctum')
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $newFood->id])
            ->assertForbidden();
    }

    public function test_substituting_with_a_nonexistent_food_item_is_rejected(): void
    {
        $user = User::factory()->create();
        [, $item] = $this->createPlanWithProteinItem($user);

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => 999999])
            ->assertUnprocessable();
    }
}
