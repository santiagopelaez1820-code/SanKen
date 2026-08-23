<?php

namespace Tests\Feature\Nutrition;

use App\Models\FoodItem;
use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NutritionApiTest extends TestCase
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

    // --- targets ---

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/nutrition/targets')->assertUnauthorized();
    }

    public function test_targets_requires_a_complete_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->assertNotFound();
    }

    public function test_targets_returns_calories_macros_and_water_once_profile_is_complete(): void
    {
        $user = User::factory()->create();
        $this->completeProfileFor($user);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets');

        $response->assertOk();
        $response->assertJsonStructure(['data' => ['calories', 'protein_g', 'carbs_g', 'fat_g', 'water_ml']]);
        $this->assertGreaterThan(0, $response->json('data.calories'));
    }

    public function test_targets_add_extra_water_on_a_day_with_a_completed_workout(): void
    {
        $user = User::factory()->create();
        $this->completeProfileFor($user);

        $restWater = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->json('data.water_ml');

        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()->toDateString(), 'completed' => true]);

        $trainingWater = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->json('data.water_ml');

        $this->assertSame(500, $trainingWater - $restWater);
    }

    // --- meals ---

    public function test_logging_a_meal_and_listing_the_day_includes_a_summary(): void
    {
        $user = User::factory()->create();
        $food = FoodItem::query()->create([
            'name' => 'Pechuga de pollo', 'calories_per_100g' => 165, 'protein_per_100g' => 31,
            'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'manual',
        ]);
        $client = $this->actingAs($user, 'sanctum');

        $store = $client->postJson('/api/v1/nutrition/meals', [
            'food_item_id' => $food->id, 'meal_type' => 'lunch', 'quantity_grams' => 200,
        ]);
        $store->assertCreated();
        $store->assertJsonPath('data.calories', 330); // 165 * 2

        $index = $client->getJson('/api/v1/nutrition/meals');
        $index->assertOk();
        $index->assertJsonCount(1, 'data');
        $index->assertJsonPath('meta.summary.calories', 330);
        $index->assertJsonPath('meta.summary.protein_g', 62);
    }

    public function test_listing_meals_only_returns_the_requested_date(): void
    {
        $user = User::factory()->create();
        $food = FoodItem::query()->create([
            'name' => 'Arroz', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7,
            'carbs_per_100g' => 28, 'fat_per_100g' => 0.3, 'source' => 'manual',
        ]);
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/nutrition/meals', [
            'food_item_id' => $food->id, 'meal_type' => 'lunch', 'quantity_grams' => 100, 'logged_at' => '2026-08-01',
        ]);
        $client->postJson('/api/v1/nutrition/meals', [
            'food_item_id' => $food->id, 'meal_type' => 'dinner', 'quantity_grams' => 100, 'logged_at' => '2026-08-02',
        ]);

        $response = $client->getJson('/api/v1/nutrition/meals?date=2026-08-01');

        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.meal_type', 'lunch');
    }

    public function test_a_user_can_delete_their_own_meal_log(): void
    {
        $user = User::factory()->create();
        $food = FoodItem::query()->create([
            'name' => 'Manzana', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3,
            'carbs_per_100g' => 14, 'fat_per_100g' => 0.2, 'source' => 'manual',
        ]);
        $client = $this->actingAs($user, 'sanctum');
        $mealId = $client->postJson('/api/v1/nutrition/meals', [
            'food_item_id' => $food->id, 'meal_type' => 'snack', 'quantity_grams' => 100,
        ])->json('data.id');

        $client->deleteJson("/api/v1/nutrition/meals/{$mealId}")->assertNoContent();

        $this->assertDatabaseMissing('meal_logs', ['id' => $mealId]);
    }

    public function test_a_user_cannot_delete_someone_elses_meal_log(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $food = FoodItem::query()->create([
            'name' => 'Manzana', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3,
            'carbs_per_100g' => 14, 'fat_per_100g' => 0.2, 'source' => 'manual',
        ]);
        $mealId = $this->actingAs($owner, 'sanctum')->postJson('/api/v1/nutrition/meals', [
            'food_item_id' => $food->id, 'meal_type' => 'snack', 'quantity_grams' => 100,
        ])->json('data.id');

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/v1/nutrition/meals/{$mealId}")
            ->assertForbidden();

        $this->assertDatabaseHas('meal_logs', ['id' => $mealId]);
    }

    // --- food search ---

    public function test_barcode_lookup_is_served_from_cache_without_hitting_open_food_facts(): void
    {
        Http::fake();
        $user = User::factory()->create();
        FoodItem::query()->create([
            'barcode' => '3017620422003', 'name' => 'Nutella', 'calories_per_100g' => 539,
            'protein_per_100g' => 6.3, 'carbs_per_100g' => 57.5, 'fat_per_100g' => 30.9, 'source' => 'open_food_facts',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        $response->assertOk();
        $response->assertJsonPath('data.name', 'Nutella');
        Http::assertNothingSent();
    }

    public function test_barcode_lookup_on_a_cache_miss_fetches_from_open_food_facts_and_caches_it(): void
    {
        Http::fake([
            'world.openfoodfacts.org/api/v2/product/*' => Http::response([
                'status' => 1,
                'product' => [
                    'product_name' => 'Nutella',
                    'brands' => 'Ferrero',
                    'code' => '3017620422003',
                    'nutriments' => [
                        'energy-kcal_100g' => 539, 'proteins_100g' => 6.3,
                        'carbohydrates_100g' => 57.5, 'fat_100g' => 30.9,
                    ],
                ],
            ], 200),
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        $response->assertOk();
        $response->assertJsonPath('data.name', 'Nutella');
        $response->assertJsonPath('data.calories_per_100g', 539);
        $this->assertDatabaseHas('food_items', ['barcode' => '3017620422003', 'name' => 'Nutella']);
    }

    public function test_barcode_not_found_on_open_food_facts_returns_404(): void
    {
        Http::fake(['world.openfoodfacts.org/*' => Http::response(['status' => 0], 200)]);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/nutrition/foods?barcode=0000000000000')
            ->assertNotFound();
    }

    public function test_text_search_on_a_cache_miss_fetches_and_caches_results(): void
    {
        Http::fake([
            'world.openfoodfacts.org/cgi/search.pl*' => Http::response([
                'products' => [
                    [
                        'product_name' => 'Banana Chips', 'brands' => 'Acme', 'code' => '111',
                        'nutriments' => ['energy-kcal_100g' => 500, 'proteins_100g' => 3, 'carbohydrates_100g' => 60, 'fat_100g' => 28],
                    ],
                ],
            ], 200),
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=banana');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Banana Chips');
        $this->assertDatabaseHas('food_items', ['name' => 'Banana Chips']);
    }

    public function test_search_and_barcode_lookup_request_spanish_localized_names_from_open_food_facts(): void
    {
        Http::fake();
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->getJson('/api/v1/nutrition/foods?q=pollo');
        $client->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        Http::assertSent(fn ($request) => str_contains((string) $request->url(), 'search.pl') && $request['lc'] === 'es');
        Http::assertSent(fn ($request) => str_contains((string) $request->url(), '/product/') && $request['lc'] === 'es');
    }

    public function test_a_stale_cached_product_gets_its_name_refreshed_on_the_next_search_hit(): void
    {
        // Simula un producto cacheado ANTES de que se empezara a pedir
        // lc=es -- quedó con el nombre genérico en inglés.
        FoodItem::query()->create([
            'barcode' => '7501234567890', 'name' => 'Chicken Breast', 'calories_per_100g' => 165,
            'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'open_food_facts',
        ]);
        Http::fake([
            'world.openfoodfacts.org/cgi/search.pl*' => Http::response([
                'products' => [[
                    'product_name' => 'Pechuga de Pollo', 'brands' => 'Marca', 'code' => '7501234567890',
                    'nutriments' => ['energy-kcal_100g' => 165, 'proteins_100g' => 31, 'carbohydrates_100g' => 0, 'fat_100g' => 3.6],
                ]],
            ], 200),
        ]);
        $user = User::factory()->create();

        // "pollo" no matchea "Chicken Breast" por LIKE -- cae a buscar en vivo, y el resultado (mismo barcode) debe ACTUALIZAR el registro viejo, no dejarlo como estaba.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=pollo');

        $response->assertOk();
        $response->assertJsonPath('data.0.name', 'Pechuga de Pollo');
        $this->assertDatabaseHas('food_items', ['barcode' => '7501234567890', 'name' => 'Pechuga de Pollo']);
        $this->assertDatabaseCount('food_items', 1); // actualizó la fila existente, no creó una duplicada
    }

    public function test_text_search_prefers_the_local_cache_over_open_food_facts(): void
    {
        Http::fake();
        $user = User::factory()->create();
        FoodItem::query()->create([
            'name' => 'Banana', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1,
            'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3, 'source' => 'manual',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=banana');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        Http::assertNothingSent();
    }

    public function test_search_requires_either_barcode_or_q(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods')->assertUnprocessable();
    }
}
