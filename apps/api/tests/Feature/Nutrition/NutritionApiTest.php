<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Nutrition.

namespace Tests\Feature\Nutrition;

// Esta línea sirve para importar el modelo FoodItem.
use App\Models\FoodItem;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Http.
use Illuminate\Support\Facades\Http;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests NutritionApiTest.
class NutritionApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que completa el perfil y el onboarding de un usuario.
    private function completeProfileFor(User $user, array $goals = ['gain_muscle'], int $frequencyDays = 4): void
    {
        // Esta línea sirve para crear el perfil con edad, sexo, altura y peso.
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 82]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $user->onboardingResponse()->create([
            // Esta línea sirve para asignar $goals al campo "goals".
            'goals' => $goals,
            // Esta línea sirve para asignar $frequencyDays al campo "frequency_days".
            'frequency_days' => $frequencyDays,
            // Esta línea sirve para asignar true al campo "completed".
            'completed' => true,
            // Esta línea sirve para asignar now() al campo "completed_at".
            'completed_at' => now(),
        ]);
    }

    // --- targets ---

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/nutrition/targets sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/nutrition/targets')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que los objetivos exigen un perfil completo.
    public function test_targets_requires_a_complete_profile(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir los objetivos sin perfil y exigir 404.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que con el perfil completo se devuelven calorías, macros y agua.
    public function test_targets_returns_calories_macros_and_water_once_profile_is_complete(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil del usuario.
        $this->completeProfileFor($user);

        // Esta línea sirve para hacer GET a /api/v1/nutrition/targets autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta tenga esta estructura.
        $response->assertJsonStructure(['data' => ['calories', 'protein_g', 'carbs_g', 'fat_g', 'water_ml']]);
        // Esta línea sirve para exigir que las calorías sean mayores a 0.
        $this->assertGreaterThan(0, $response->json('data.calories'));
    }

    // Esta línea sirve para declarar el test que comprueba que se suma agua extra los días de entrenamiento.
    public function test_targets_add_extra_water_on_a_day_with_a_completed_workout(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil del usuario.
        $this->completeProfileFor($user);

        // Esta línea sirve para pedir el agua de un día sin entrenamiento.
        $restWater = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->json('data.water_ml');

        // Esta línea sirve para registrar un entrenamiento completado hoy.
        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()->toDateString(), 'completed' => true]);

        // Esta línea sirve para pedir el agua de un día con entrenamiento.
        $trainingWater = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/targets')->json('data.water_ml');

        // Esta línea sirve para exigir que la diferencia sea 500 ml.
        $this->assertSame(500, $trainingWater - $restWater);
    }

    // --- meals ---

    // Esta línea sirve para declarar el test que comprueba que registrar una comida y listar el día incluye un resumen.
    public function test_logging_a_meal_and_listing_the_day_includes_a_summary(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un alimento.
        $food = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, las calorías y la proteína.
            'name' => 'Pechuga de pollo', 'calories_per_100g' => 165, 'protein_per_100g' => 31,
            // Esta línea sirve para asignar los carbohidratos, la grasa y el origen.
            'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'manual',
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar una comida de 200 g.
        $store = $client->postJson('/api/v1/nutrition/meals', [
            // Esta línea sirve para enviar el alimento, el tipo de comida y la cantidad.
            'food_item_id' => $food->id, 'meal_type' => 'lunch', 'quantity_grams' => 200,
        ]);
        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $store->assertCreated();
        // Esta línea sirve para exigir que las calorías sean 330.
        $store->assertJsonPath('data.calories', 330); // 165 * 2

        // Esta línea sirve para pedir las comidas del día.
        $index = $client->getJson('/api/v1/nutrition/meals');
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $index->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $index->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "meta.summary.calories" sea 330.
        $index->assertJsonPath('meta.summary.calories', 330);
        // Esta línea sirve para exigir que "meta.summary.protein_g" sea 62.
        $index->assertJsonPath('meta.summary.protein_g', 62);
    }

    // Esta línea sirve para declarar el test que comprueba que el listado solo trae la fecha pedida.
    public function test_listing_meals_only_returns_the_requested_date(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un alimento.
        $food = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, las calorías y la proteína.
            'name' => 'Arroz', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7,
            // Esta línea sirve para asignar los carbohidratos, la grasa y el origen.
            'carbs_per_100g' => 28, 'fat_per_100g' => 0.3, 'source' => 'manual',
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar un almuerzo del día 1.
        $client->postJson('/api/v1/nutrition/meals', [
            // Esta línea sirve para enviar el alimento, el tipo, la cantidad y la fecha.
            'food_item_id' => $food->id, 'meal_type' => 'lunch', 'quantity_grams' => 100, 'logged_at' => '2026-08-01',
        ]);
        // Esta línea sirve para registrar una cena del día 2.
        $client->postJson('/api/v1/nutrition/meals', [
            // Esta línea sirve para enviar el alimento, el tipo, la cantidad y la fecha.
            'food_item_id' => $food->id, 'meal_type' => 'dinner', 'quantity_grams' => 100, 'logged_at' => '2026-08-02',
        ]);

        // Esta línea sirve para pedir las comidas del día 1.
        $response = $client->getJson('/api/v1/nutrition/meals?date=2026-08-01');

        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.meal_type" sea 'lunch'.
        $response->assertJsonPath('data.0.meal_type', 'lunch');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede borrar su propio registro de comida.
    public function test_a_user_can_delete_their_own_meal_log(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un alimento.
        $food = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, las calorías y la proteína.
            'name' => 'Manzana', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3,
            // Esta línea sirve para asignar los carbohidratos, la grasa y el origen.
            'carbs_per_100g' => 14, 'fat_per_100g' => 0.2, 'source' => 'manual',
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para registrar una comida y guardar su id.
        $mealId = $client->postJson('/api/v1/nutrition/meals', [
            // Esta línea sirve para enviar el alimento, el tipo y la cantidad.
            'food_item_id' => $food->id, 'meal_type' => 'snack', 'quantity_grams' => 100,
            // Esta línea sirve para obtener el id de la comida creada.
        ])->json('data.id');

        // Esta línea sirve para borrar la comida y exigir 204.
        $client->deleteJson("/api/v1/nutrition/meals/{$mealId}")->assertNoContent();

        // Esta línea sirve para exigir que la tabla meal_logs no tenga ese registro.
        $this->assertDatabaseMissing('meal_logs', ['id' => $mealId]);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede borrar la comida de otro.
    public function test_a_user_cannot_delete_someone_elses_meal_log(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear un alimento.
        $food = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, las calorías y la proteína.
            'name' => 'Manzana', 'calories_per_100g' => 52, 'protein_per_100g' => 0.3,
            // Esta línea sirve para asignar los carbohidratos, la grasa y el origen.
            'carbs_per_100g' => 14, 'fat_per_100g' => 0.2, 'source' => 'manual',
        ]);
        // Esta línea sirve para hacer POST a /api/v1/nutrition/meals autenticado como owner con estos datos.
        $mealId = $this->actingAs($owner, 'sanctum')->postJson('/api/v1/nutrition/meals', [
            // Esta línea sirve para enviar el alimento, el tipo y la cantidad.
            'food_item_id' => $food->id, 'meal_type' => 'snack', 'quantity_grams' => 100,
            // Esta línea sirve para obtener el id de la comida creada.
        ])->json('data.id');

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/nutrition/meals/{$mealId}.
            ->deleteJson("/api/v1/nutrition/meals/{$mealId}")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que la tabla meal_logs tenga ese registro.
        $this->assertDatabaseHas('meal_logs', ['id' => $mealId]);
    }

    // --- food search ---

    // Esta línea sirve para declarar el test que comprueba que el código de barras se atiende desde la caché sin consultar Open Food Facts.
    public function test_barcode_lookup_is_served_from_cache_without_hitting_open_food_facts(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el alimento en la caché local.
        FoodItem::query()->create([
            // Esta línea sirve para asignar el código de barras, el nombre y las calorías.
            'barcode' => '3017620422003', 'name' => 'Nutella', 'calories_per_100g' => 539,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 6.3, 'carbs_per_100g' => 57.5, 'fat_per_100g' => 30.9, 'source' => 'open_food_facts',
        ]);

        // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?barcode=3017620422003 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.name" sea 'Nutella'.
        $response->assertJsonPath('data.name', 'Nutella');
        // Esta línea sirve para exigir que no se haya enviado ninguna petición a Open Food Facts.
        Http::assertNothingSent();
    }

    // Esta línea sirve para declarar el test que comprueba que un código no guardado se consulta en Open Food Facts y se guarda.
    public function test_barcode_lookup_on_a_cache_miss_fetches_from_open_food_facts_and_caches_it(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake([
            // Esta línea sirve para simular la respuesta de Open Food Facts.
            'world.openfoodfacts.org/api/v2/product/*' => Http::response([
                // Esta línea sirve para asignar 1 al campo "status".
                'status' => 1,
                // Esta línea sirve para incluir el producto.
                'product' => [
                    // Esta línea sirve para asignar 'Nutella' al campo "product_name".
                    'product_name' => 'Nutella',
                    // Esta línea sirve para asignar 'Ferrero' al campo "brands".
                    'brands' => 'Ferrero',
                    // Esta línea sirve para asignar '3017620422003' al campo "code".
                    'code' => '3017620422003',
                    // Esta línea sirve para incluir los nutrientes.
                    'nutriments' => [
                        // Esta línea sirve para incluir calorías y proteína.
                        'energy-kcal_100g' => 539, 'proteins_100g' => 6.3,
                        // Esta línea sirve para incluir carbohidratos y grasa.
                        'carbohydrates_100g' => 57.5, 'fat_100g' => 30.9,
                    ],
                ],
                // Esta línea sirve para cerrar la respuesta con código 200.
            ], 200),
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?barcode=3017620422003 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.name" sea 'Nutella'.
        $response->assertJsonPath('data.name', 'Nutella');
        // Esta línea sirve para exigir que "data.calories_per_100g" sea 539.
        $response->assertJsonPath('data.calories_per_100g', 539);
        // Esta línea sirve para exigir que la tabla food_items tenga ese registro.
        $this->assertDatabaseHas('food_items', ['barcode' => '3017620422003', 'name' => 'Nutella']);
    }

    // Esta línea sirve para declarar el test que comprueba que un código inexistente en Open Food Facts devuelve 404.
    public function test_barcode_not_found_on_open_food_facts_returns_404(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake(['world.openfoodfacts.org/*' => Http::response(['status' => 0], 200)]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?barcode=0000000000000.
            ->getJson('/api/v1/nutrition/foods?barcode=0000000000000')
            // Esta línea sirve para exigir que la respuesta sea 404 (no encontrado).
            ->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que la búsqueda por texto consulta y guarda los resultados si no hay caché.
    public function test_text_search_on_a_cache_miss_fetches_and_caches_results(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake([
            // Esta línea sirve para simular la respuesta de la búsqueda.
            'world.openfoodfacts.org/cgi/search.pl*' => Http::response([
                // Esta línea sirve para incluir los productos.
                'products' => [
                    [
                        // Esta línea sirve para definir el nombre, la marca y el código del producto.
                        'product_name' => 'Banana Chips', 'brands' => 'Acme', 'code' => '111',
                        // Esta línea sirve para definir sus nutrientes.
                        'nutriments' => ['energy-kcal_100g' => 500, 'proteins_100g' => 3, 'carbohydrates_100g' => 60, 'fat_100g' => 28],
                    ],
                ],
                // Esta línea sirve para cerrar la respuesta con código 200.
            ], 200),
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?q=banana autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=banana');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.name" sea 'Banana Chips'.
        $response->assertJsonPath('data.0.name', 'Banana Chips');
        // Esta línea sirve para exigir que la tabla food_items tenga ese registro.
        $this->assertDatabaseHas('food_items', ['name' => 'Banana Chips']);
    }

    // Esta línea sirve para declarar el test que comprueba que la búsqueda y el código de barras piden nombres en español.
    public function test_search_and_barcode_lookup_request_spanish_localized_names_from_open_food_facts(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para buscar por texto.
        $client->getJson('/api/v1/nutrition/foods?q=pollo');
        // Esta línea sirve para buscar por código de barras.
        $client->getJson('/api/v1/nutrition/foods?barcode=3017620422003');

        // Esta línea sirve para exigir que la búsqueda se haya pedido con idioma español.
        Http::assertSent(fn ($request) => str_contains((string) $request->url(), 'search.pl') && $request['lc'] === 'es');
        // Esta línea sirve para exigir que la consulta por código se haya pedido con idioma español.
        Http::assertSent(fn ($request) => str_contains((string) $request->url(), '/product/') && $request['lc'] === 'es');
    }

    // Esta línea sirve para declarar el test que comprueba que un producto viejo en caché actualiza su nombre al aparecer en una búsqueda.
    public function test_a_stale_cached_product_gets_its_name_refreshed_on_the_next_search_hit(): void
    {
        // Simula un producto cacheado ANTES de que se empezara a pedir
        // lc=es -- quedó con el nombre genérico en inglés.
        // Esta línea sirve para guardar un producto en caché con nombre en inglés.
        FoodItem::query()->create([
            // Esta línea sirve para asignar el código de barras, el nombre y las calorías.
            'barcode' => '7501234567890', 'name' => 'Chicken Breast', 'calories_per_100g' => 165,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'open_food_facts',
        ]);
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake([
            // Esta línea sirve para simular la respuesta de la búsqueda.
            'world.openfoodfacts.org/cgi/search.pl*' => Http::response([
                // Esta línea sirve para incluir los productos.
                'products' => [[
                    // Esta línea sirve para definir el nombre en español, la marca y el código.
                    'product_name' => 'Pechuga de Pollo', 'brands' => 'Marca', 'code' => '7501234567890',
                    // Esta línea sirve para definir sus nutrientes.
                    'nutriments' => ['energy-kcal_100g' => 165, 'proteins_100g' => 31, 'carbohydrates_100g' => 0, 'fat_100g' => 3.6],
                ]],
                // Esta línea sirve para cerrar la respuesta con código 200.
            ], 200),
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // "pollo" no matchea "Chicken Breast" por LIKE -- cae a buscar en vivo, y el resultado (mismo barcode) debe ACTUALIZAR el registro viejo, no dejarlo como estaba.
        // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?q=pollo autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=pollo');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.0.name" sea 'Pechuga de Pollo'.
        $response->assertJsonPath('data.0.name', 'Pechuga de Pollo');
        // Esta línea sirve para exigir que la tabla food_items tenga ese registro.
        $this->assertDatabaseHas('food_items', ['barcode' => '7501234567890', 'name' => 'Pechuga de Pollo']);
        // Esta línea sirve para exigir que la tabla food_items tenga 1 registros.
        $this->assertDatabaseCount('food_items', 1); // actualizó la fila existente, no creó una duplicada
    }

    // Esta línea sirve para declarar el test que comprueba que la búsqueda por texto prefiere la caché local.
    public function test_text_search_prefers_the_local_cache_over_open_food_facts(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar un alimento en la caché local.
        FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, las calorías y la proteína.
            'name' => 'Banana', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1,
            // Esta línea sirve para asignar carbohidratos, grasa y origen.
            'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3, 'source' => 'manual',
        ]);

        // Esta línea sirve para hacer GET a /api/v1/nutrition/foods?q=banana autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods?q=banana');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que no se haya enviado ninguna petición a Open Food Facts.
        Http::assertNothingSent();
    }

    // Esta línea sirve para declarar el test que comprueba que la búsqueda exige código de barras o texto.
    public function test_search_requires_either_barcode_or_q(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para buscar sin datos y exigir 422.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/foods')->assertUnprocessable();
    }
}
