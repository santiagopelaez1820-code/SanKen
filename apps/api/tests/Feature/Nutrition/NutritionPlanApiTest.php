<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Nutrition.

namespace Tests\Feature\Nutrition;

// Esta línea sirve para importar la clase NutritionPlanTemplateCatalog.
use App\Domain\Nutrition\Services\NutritionPlanTemplateCatalog;
// Esta línea sirve para importar el modelo FoodItem.
use App\Models\FoodItem;
// Esta línea sirve para importar el modelo NutritionPlan.
use App\Models\NutritionPlan;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase FoodItemSeeder.
use Database\Seeders\FoodItemSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests NutritionPlanApiTest.
class NutritionPlanApiTest extends TestCase
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

    /**
     * Un alimento curado por categoría -- cubre todas las categorías que
     * config('nutrition.meal_categories') pide para las 4 comidas
     * (breakfast/lunch/snack/dinner), así generate() nunca se queda sin
     * candidato para ninguna.
     */
    // Esta línea sirve para declarar el método auxiliar que carga el catálogo curado de alimentos.
    private function seedCuratedCatalog(): void
    {
        // Esta línea sirve para definir los alimentos de ejemplo.
        $foods = [
            // Esta línea sirve para definir pechuga de pollo (proteína).
            ['name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165, 'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6],
            // Esta línea sirve para definir arroz blanco (carbohidrato).
            ['name' => 'Arroz blanco cocido', 'category' => 'carb', 'calories_per_100g' => 130, 'protein_per_100g' => 2.7, 'carbs_per_100g' => 28, 'fat_per_100g' => 0.3],
            // Esta línea sirve para definir aceite de oliva (grasa).
            ['name' => 'Aceite de oliva', 'category' => 'fat', 'calories_per_100g' => 884, 'protein_per_100g' => 0, 'carbs_per_100g' => 0, 'fat_per_100g' => 100],
            // Esta línea sirve para definir brócoli (vegetal).
            ['name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34, 'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4],
            // Esta línea sirve para definir banana (fruta).
            ['name' => 'Banana', 'category' => 'fruit', 'calories_per_100g' => 89, 'protein_per_100g' => 1.1, 'carbs_per_100g' => 22.8, 'fat_per_100g' => 0.3],
            // Esta línea sirve para definir yogur natural (lácteo).
            ['name' => 'Yogur natural', 'category' => 'dairy', 'calories_per_100g' => 61, 'protein_per_100g' => 3.5, 'carbs_per_100g' => 4.7, 'fat_per_100g' => 3.3],
        ];

        // Esta línea sirve para recorrer cada alimento.
        foreach ($foods as $food) {
            // Esta línea sirve para crearlo marcándolo como del catálogo manual.
            FoodItem::query()->create([...$food, 'source' => 'manual']);
        }
    }

    // --- generar plan ---

    // Esta línea sirve para declarar el test que comprueba que las peticiones sin sesión se rechazan.
    public function test_unauthenticated_requests_are_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/nutrition/plan sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/nutrition/plan')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/nutrition/plan sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/nutrition/plan')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/nutrition/plan/items/1 sin sesión y exigir que responda 401.
        $this->patchJson('/api/v1/nutrition/plan/items/1', ['food_item_id' => 1])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que generar un plan exige un perfil completo.
    public function test_generating_a_plan_requires_a_complete_profile(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para intentar generar el plan sin perfil y exigir 422.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan')->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que generar un plan crea 4 comidas del catálogo curado.
    public function test_generating_a_plan_creates_4_meals_from_the_curated_catalog(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil del usuario.
        $this->completeProfileFor($user);
        // Esta línea sirve para cargar el catálogo curado.
        $this->seedCuratedCatalog();

        // Esta línea sirve para hacer POST a /api/v1/nutrition/plan autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan');

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.meals" tenga 4 elementos.
        $response->assertJsonCount(4, 'data.meals');
        // Esta línea sirve para exigir que "data.meals.0.meal_type" sea 'breakfast'.
        $response->assertJsonPath('data.meals.0.meal_type', 'breakfast');
        // Esta línea sirve para exigir que "data.meals.1.meal_type" sea 'lunch'.
        $response->assertJsonPath('data.meals.1.meal_type', 'lunch');
        // Esta línea sirve para exigir que "data.meals.2.meal_type" sea 'snack'.
        $response->assertJsonPath('data.meals.2.meal_type', 'snack');
        // Esta línea sirve para exigir que "data.meals.3.meal_type" sea 'dinner'.
        $response->assertJsonPath('data.meals.3.meal_type', 'dinner');
        // Esta línea sirve para exigir 3 alimentos en el desayuno (proteína, carbohidrato y fruta).
        $response->assertJsonCount(3, 'data.meals.0.items'); // protein, carb, fruit
        // Esta línea sirve para exigir 2 alimentos en el snack (lácteo y fruta).
        $response->assertJsonCount(2, 'data.meals.2.items'); // dairy, fruit
        // Esta línea sirve para exigir que la tabla nutrition_plans tenga 1 registros.
        $this->assertDatabaseCount('nutrition_plans', 1);

        // Solo alimentos del catálogo curado (source=manual), nunca de Open
        // Food Facts -- las porciones de ese catálogo no están controladas.
        // Esta línea sirve para obtener los ids de los alimentos usados.
        $usedFoodIds = collect($response->json('data.meals'))
            // Esta línea sirve para juntar los alimentos de todas las comidas.
            ->flatMap(fn ($meal) => $meal['items'])
            // Esta línea sirve para quedarse con el id de cada alimento.
            ->pluck('food_item.id');
        // Esta línea sirve para exigir que se cumpla la condición siguiente.
        $this->assertTrue(
            // Esta línea sirve para comprobar que no hay alimentos usados que no sean del catálogo manual.
            FoodItem::query()->whereIn('id', $usedFoodIds)->where('source', '!=', 'manual')->doesntExist()
        );
    }

    // Esta línea sirve para declarar el test que comprueba que regenerar el plan reemplaza al anterior.
    public function test_regenerating_a_plan_replaces_the_previous_one_instead_of_stacking(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil del usuario.
        $this->completeProfileFor($user);
        // Esta línea sirve para cargar el catálogo curado.
        $this->seedCuratedCatalog();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para generar el plan y exigir 201.
        $client->postJson('/api/v1/nutrition/plan')->assertCreated();
        // Esta línea sirve para generarlo otra vez y exigir 201.
        $client->postJson('/api/v1/nutrition/plan')->assertCreated();

        // Esta línea sirve para exigir que la tabla nutrition_plans tenga 1 registros.
        $this->assertDatabaseCount('nutrition_plans', 1);
        // Esta línea sirve para exigir que la tabla nutrition_plan_meals tenga 4 registros.
        $this->assertDatabaseCount('nutrition_plan_meals', 4);
    }

    /**
     * Con el catálogo real sembrado (no el mínimo de seedCuratedCatalog), el
     * plan generado tiene que usar los alimentos del plan curado que le
     * corresponde a este usuario+objetivo (NutritionPlanTemplateCatalog),
     * no una elección al azar -- esto es lo que hace que dos usuarios con
     * datos distintos dejen de ver la misma combinación de comidas.
     */
    // Esta línea sirve para declarar el test que comprueba que el plan usa la plantilla curada del objetivo del usuario.
    public function test_generating_a_plan_uses_the_curated_template_for_the_users_goal(): void
    {
        // Esta línea sirve para sembrar los datos de FoodItemSeeder.
        $this->seed(FoodItemSeeder::class);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil con el objetivo de perder grasa.
        $this->completeProfileFor($user, goals: ['lose_fat']);

        // Esta línea sirve para obtener la plantilla esperada para ese usuario.
        $expectedTemplate = NutritionPlanTemplateCatalog::pickForUser($user->id, 'lose_fat');

        // Esta línea sirve para hacer POST a /api/v1/nutrition/plan autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan');

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para indexar las comidas por tipo.
        $meals = collect($response->json('data.meals'))->keyBy('meal_type');

        // Esta línea sirve para recorrer las comidas de la plantilla.
        foreach ($expectedTemplate['meals'] as $mealType => $categories) {
            // Esta línea sirve para obtener los nombres de los alimentos de esa comida.
            $itemNames = collect($meals[$mealType]['items'])->pluck('food_item.name')->all();

            // Esta línea sirve para recorrer los alimentos esperados.
            foreach ($categories as $expectedFoodName) {
                // Esta línea sirve para exigir que la comida contenga el alimento esperado.
                $this->assertContains(
                    // Esta línea sirve para indicar el alimento esperado.
                    $expectedFoodName,
                    // Esta línea sirve para indicar los alimentos de la comida.
                    $itemNames,
                    // Esta línea sirve para mostrar este mensaje si falla.
                    "meal={$mealType} no tiene \"{$expectedFoodName}\" (plan curado de lose_fat)",
                );
            }
        }
    }

    // --- consultar plan ---

    // Esta línea sirve para declarar el test que comprueba que ver el plan devuelve 404 si el usuario no tiene uno.
    public function test_show_returns_404_when_the_user_has_no_plan_yet(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir el plan y exigir 404.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/plan')->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que ver el plan devuelve las comidas y alimentos del usuario.
    public function test_show_returns_the_users_plan_with_meals_and_items(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el perfil del usuario.
        $this->completeProfileFor($user);
        // Esta línea sirve para cargar el catálogo curado.
        $this->seedCuratedCatalog();
        // Esta línea sirve para generar el plan.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/nutrition/plan');

        // Esta línea sirve para hacer GET a /api/v1/nutrition/plan autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/nutrition/plan');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta tenga esta estructura.
        $response->assertJsonStructure(['data' => ['id', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'generated_at', 'meals']]);
    }

    // --- sustitución ---

    // Esta línea sirve para declarar el método auxiliar que crea un plan con un alimento de proteína.
    private function createPlanWithProteinItem(User $user, int $quantityGrams = 200): array
    {
        // Esta línea sirve para crear el alimento de proteína.
        $proteinFood = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, la categoría y las calorías.
            'name' => 'Pechuga de pollo', 'category' => 'protein', 'calories_per_100g' => 165,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 31, 'carbs_per_100g' => 0, 'fat_per_100g' => 3.6, 'source' => 'manual',
        ]);
        // Esta línea sirve para crear el plan del usuario.
        $plan = NutritionPlan::query()->create([
            // Esta línea sirve para asignar el usuario y los objetivos diarios.
            'user_id' => $user->id, 'calories' => 2000, 'protein_g' => 150, 'carbs_g' => 200, 'fat_g' => 60,
        ]);
        // Esta línea sirve para crear la comida del plan.
        $meal = $plan->meals()->create([
            // Esta línea sirve para asignar el tipo, el orden y los objetivos.
            'meal_type' => 'lunch', 'order' => 1,
            // Esta línea sirve para asignar calorías, proteína, carbohidratos y grasa objetivo.
            'target_calories' => 700, 'target_protein_g' => 50, 'target_carbs_g' => 70, 'target_fat_g' => 20,
        ]);
        // Esta línea sirve para agregar el alimento a la comida.
        $item = $meal->items()->create(['food_item_id' => $proteinFood->id, 'quantity_grams' => $quantityGrams]);

        // Esta línea sirve para devolver el plan, el alimento del plan y el alimento base.
        return [$plan, $item, $proteinFood];
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar por un alimento de la misma categoría conserva las calorías.
    public function test_substituting_an_item_with_a_same_category_food_preserves_calories(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un plan con un alimento de proteína de 200 g.
        [, $item] = $this->createPlanWithProteinItem($user, quantityGrams: 200); // 165 * 2 = 330 kcal
        // Esta línea sirve para crear el alimento nuevo.
        $newFood = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, la categoría y las calorías.
            'name' => 'Carne magra de res', 'category' => 'protein', 'calories_per_100g' => 220,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 10, 'source' => 'manual',
        ]);

        // Esta línea sirve para preparar la petición autenticada como user.
        $response = $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/nutrition/plan/items/{$item->id} con los datos enviados.
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $newFood->id]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.food_item.id" sea $newFood->id.
        $response->assertJsonPath('data.food_item.id', $newFood->id);
        // Esta línea sirve para exigir que la cantidad nueva sea 150 g.
        $response->assertJsonPath('data.quantity_grams', 150); // 330 / 220 * 100
        // Esta línea sirve para exigir que "data.calories" sea 330.
        $response->assertJsonPath('data.calories', 330);
        // Esta línea sirve para exigir que la tabla nutrition_plan_meal_items tenga un registro con estos datos.
        $this->assertDatabaseHas('nutrition_plan_meal_items', [
            // Esta línea sirve para exigir que el alimento y la cantidad queden guardados.
            'id' => $item->id, 'food_item_id' => $newFood->id, 'quantity_grams' => 150.0,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar por un alimento de otra categoría se rechaza.
    public function test_substituting_with_a_different_category_food_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un plan con un alimento de proteína.
        [, $item] = $this->createPlanWithProteinItem($user);
        // Esta línea sirve para crear un alimento vegetal.
        $vegetable = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, la categoría y las calorías.
            'name' => 'Brócoli', 'category' => 'vegetable', 'calories_per_100g' => 34,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 2.8, 'carbs_per_100g' => 7, 'fat_per_100g' => 0.4, 'source' => 'manual',
        ]);

        // Esta línea sirve para preparar la petición autenticada como user.
        $response = $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/nutrition/plan/items/{$item->id} con los datos enviados.
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $vegetable->id]);

        // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
        $response->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede reemplazar un alimento del plan de otro.
    public function test_a_user_cannot_substitute_an_item_in_someone_elses_plan(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear un plan del dueño.
        [, $item] = $this->createPlanWithProteinItem($owner);
        // Esta línea sirve para crear un alimento nuevo.
        $newFood = FoodItem::query()->create([
            // Esta línea sirve para asignar el nombre, la categoría y las calorías.
            'name' => 'Atún al natural', 'category' => 'protein', 'calories_per_100g' => 116,
            // Esta línea sirve para asignar proteína, carbohidratos, grasa y origen.
            'protein_per_100g' => 26, 'carbs_per_100g' => 0, 'fat_per_100g' => 1, 'source' => 'manual',
        ]);

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/nutrition/plan/items/{$item->id} con los datos enviados.
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => $newFood->id])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar por un alimento inexistente se rechaza.
    public function test_substituting_with_a_nonexistent_food_item_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un plan con un alimento de proteína.
        [, $item] = $this->createPlanWithProteinItem($user);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/nutrition/plan/items/{$item->id} con los datos enviados.
            ->patchJson("/api/v1/nutrition/plan/items/{$item->id}", ['food_item_id' => 999999])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }
}
