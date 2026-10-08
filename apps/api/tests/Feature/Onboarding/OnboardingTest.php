<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Onboarding.

namespace Tests\Feature\Onboarding;

// Esta línea sirve para importar el modelo City.
use App\Models\City;
// Esta línea sirve para importar el modelo Country.
use App\Models\Country;
// Esta línea sirve para importar el modelo State.
use App\Models\RoutineTemplate;
// Esta línea sirve para importar el modelo User.
use App\Models\State;
// Esta línea sirve para importar la clase ExerciseSeeder.
use App\Models\User;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase RoutineTemplateSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Database\Seeders\RoutineTemplateSeeder;
// Esta línea sirve para importar la clase base de los tests.
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests OnboardingTest.
class OnboardingTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede acceder al onboarding.
    public function test_guest_cannot_access_onboarding(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/onboarding sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/onboarding')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que las preguntas devuelven países sin ciudades anidadas.
    public function test_questions_endpoint_returns_countries_without_nested_cities(): void
    {
        // Esta línea sirve para crear el país México.
        $country = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        // Esta línea sirve para crear una ciudad de México.
        City::factory()->create(['country_id' => $country->id, 'name' => 'Guadalajara']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/questions autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/onboarding/questions');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.countries.0.name" sea 'México'.
            ->assertJsonPath('data.countries.0.name', 'México')
            // Esta línea sirve para exigir que la respuesta no incluya "data.countries.0.cities".
            ->assertJsonMissingPath('data.countries.0.cities')
            // Esta línea sirve para exigir que la respuesta contenga este fragmento.
            ->assertJsonFragment(['gain_muscle']);
    }

    // Esta línea sirve para declarar el test que comprueba que el endpoint de ciudades devuelve las de un país.
    public function test_cities_endpoint_returns_cities_for_a_given_country(): void
    {
        // Esta línea sirve para crear el país México.
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        // Esta línea sirve para crear el país Colombia.
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        // Esta línea sirve para crear una ciudad de México.
        City::factory()->create(['country_id' => $mx->id, 'name' => 'Guadalajara']);
        // Esta línea sirve para crear una ciudad de Colombia.
        City::factory()->create(['country_id' => $co->id, 'name' => 'Bogotá']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/countries/{$mx->id}/cities autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$mx->id}/cities");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data" tenga 1 elementos.
            ->assertJsonCount(1, 'data')
            // Esta línea sirve para exigir que "data.0.name" sea 'Guadalajara'.
            ->assertJsonPath('data.0.name', 'Guadalajara');
    }

    // Esta línea sirve para declarar el test que comprueba que el endpoint de estados devuelve los de un país.
    public function test_states_endpoint_returns_states_for_a_given_country(): void
    {
        // Esta línea sirve para crear el país Colombia.
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        // Esta línea sirve para crear el país México.
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        // Esta línea sirve para crear el estado Antioquia.
        State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        // Esta línea sirve para crear el estado Cundinamarca.
        State::factory()->create(['country_id' => $co->id, 'name' => 'Cundinamarca']);
        // Esta línea sirve para crear el estado Jalisco.
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Jalisco']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/countries/{$co->id}/states autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$co->id}/states");

        // Esta línea sirve para exigir 200 y 2 estados.
        $response->assertOk()->assertJsonCount(2, 'data');
        // Esta línea sirve para exigir que los nombres coincidan sin importar el orden.
        $this->assertEqualsCanonicalizing(
            // Esta línea sirve para esperar Antioquia y Cundinamarca.
            ['Antioquia', 'Cundinamarca'],
            // Esta línea sirve para obtener los nombres de la respuesta.
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    // Esta línea sirve para declarar el test que comprueba que las ciudades por estado solo son las de ese estado.
    public function test_cities_by_state_endpoint_only_returns_cities_of_that_state(): void
    {
        // Esta línea sirve para crear el país Colombia.
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        // Esta línea sirve para crear el estado Antioquia.
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        // Esta línea sirve para crear el estado Cundinamarca.
        $cundinamarca = State::factory()->create(['country_id' => $co->id, 'name' => 'Cundinamarca']);
        // Esta línea sirve para crear Medellín en Antioquia.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Medellín']);
        // Esta línea sirve para crear Bello en Antioquia.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Bello']);
        // Esta línea sirve para crear Bogotá en Cundinamarca.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $cundinamarca->id, 'name' => 'Bogotá']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/states/{$antioquia->id}/cities autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities");

        // Esta línea sirve para exigir 200 y 2 ciudades.
        $response->assertOk()->assertJsonCount(2, 'data');
        // Esta línea sirve para exigir que los nombres coincidan sin importar el orden.
        $this->assertEqualsCanonicalizing(
            // Esta línea sirve para esperar Medellín y Bello.
            ['Medellín', 'Bello'],
            // Esta línea sirve para obtener los nombres de la respuesta.
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    // Esta línea sirve para declarar el test que comprueba que se oculta el estado "Nacional" si hay estados reales.
    public function test_states_endpoint_hides_leftover_nacional_placeholder_when_real_states_exist(): void
    {
        // Esta línea sirve para crear el país México.
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        // Esta línea sirve para crear el estado "Nacional".
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Nacional']);
        // Esta línea sirve para crear el estado Jalisco.
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Jalisco']);
        // Esta línea sirve para crear el estado Yucatán.
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Yucatán']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/countries/{$mx->id}/states autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$mx->id}/states");

        // Esta línea sirve para exigir 200 y 2 estados.
        $response->assertOk()->assertJsonCount(2, 'data');
        // Esta línea sirve para exigir que los nombres coincidan sin importar el orden.
        $this->assertEqualsCanonicalizing(
            // Esta línea sirve para esperar Jalisco y Yucatán.
            ['Jalisco', 'Yucatán'],
            // Esta línea sirve para obtener los nombres de la respuesta.
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    // Esta línea sirve para declarar el test que comprueba que se conserva "Nacional" si es la única opción.
    public function test_states_endpoint_keeps_nacional_when_it_is_the_only_option(): void
    {
        // Esta línea sirve para crear un país.
        $xx = Country::factory()->create(['name' => 'Territorio X', 'code' => 'XX']);
        // Esta línea sirve para crear el estado "Nacional".
        State::factory()->create(['country_id' => $xx->id, 'name' => 'Nacional']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/countries/{$xx->id}/states autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$xx->id}/states");

        // Esta línea sirve para exigir 200, un estado y que sea "Nacional".
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Nacional');
    }

    // Esta línea sirve para declarar el test que comprueba que la búsqueda de ciudades ignora mayúsculas y minúsculas.
    public function test_cities_by_state_endpoint_filters_by_search_case_insensitively(): void
    {
        // Esta línea sirve para crear el país Colombia.
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        // Esta línea sirve para crear el estado Antioquia.
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        // Esta línea sirve para crear Marinilla.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Marinilla']);
        // Esta línea sirve para crear Medellín.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Medellín']);
        // Esta línea sirve para crear Guatapé.
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Guatapé']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para buscar "mari".
        $response = $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?search=mari");
        // Esta línea sirve para exigir 200 y que solo aparezca Marinilla.
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Marinilla');

        // Case-insensitive.
        // Esta línea sirve para buscar "MEDEL".
        $response = $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?search=MEDEL");
        // Esta línea sirve para exigir 200 y que solo aparezca Medellín.
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Medellín');
    }

    // Esta línea sirve para declarar el test que comprueba que el límite de ciudades se respeta y tiene tope.
    public function test_cities_by_state_endpoint_respects_limit_and_caps_it(): void
    {
        // Esta línea sirve para crear el país Colombia.
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        // Esta línea sirve para crear el estado Antioquia.
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        // Nombres explícitos (no fake()->city()) — el pool de ciudades de
        // Faker es chico y con 120 filas en el mismo estado chocaría con el
        // unique(state_id, name) casi seguro.
        // Esta línea sirve para crear 120 ciudades.
        City::factory()
            // Esta línea sirve para indicar la cantidad.
            ->count(120)
            // Esta línea sirve para nombrar cada ciudad con su número.
            ->sequence(fn ($sequence) => ['name' => 'Ciudad '.$sequence->index])
            // Esta línea sirve para asignarlas al país y al estado.
            ->create(['country_id' => $co->id, 'state_id' => $antioquia->id]);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Default limit is 50.
        // Esta línea sirve para exigir 50 ciudades por defecto.
        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities")->assertOk()->assertJsonCount(50, 'data');

        // A requested limit above 100 is capped at 100, not honored as-is.
        // Esta línea sirve para pedir un límite de 500.
        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?limit=500")
            // Esta línea sirve para exigir que el tope sea 100.
            ->assertOk()->assertJsonCount(100, 'data');

        // Esta línea sirve para pedir un límite de 5.
        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?limit=5")
            // Esta línea sirve para exigir 5 ciudades.
            ->assertOk()->assertJsonCount(5, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que "has_location" es falso hasta guardar una ciudad.
    public function test_has_location_is_false_until_a_city_is_saved_and_true_after(): void
    {
        // Esta línea sirve para crear un país.
        $country = Country::factory()->create();
        // Esta línea sirve para crear un estado.
        $state = State::factory()->create(['country_id' => $country->id]);
        // Esta línea sirve para crear una ciudad.
        $city = City::factory()->create(['country_id' => $country->id, 'state_id' => $state->id]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para exigir que "has_location" sea falso.
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.has_location', false);

        // Esta línea sirve para guardar la ciudad en el onboarding.
        $client->patchJson('/api/v1/onboarding', ['city_id' => $city->id]);

        // actingAs() reutiliza la misma instancia de $user entre llamadas dentro
        // de un test — sin refrescarla, la relación "profile" quedaría cacheada
        // en null desde el primer GET. En una request HTTP real esto no pasa
        // (cada request resuelve el usuario de nuevo), es un artefacto del test.
        // Esta línea sirve para volver a autenticarse con el usuario recargado.
        $this->actingAs($user->refresh(), 'sanctum');
        // Esta línea sirve para exigir que "has_location" sea verdadero.
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.has_location', true);
    }

    // Esta línea sirve para declarar el test que comprueba que el onboarding resuelve estado y país a partir de la ciudad.
    public function test_onboarding_show_resolves_state_and_country_from_city(): void
    {
        // Esta línea sirve para crear un país.
        $country = Country::factory()->create();
        // Esta línea sirve para crear un estado.
        $state = State::factory()->create(['country_id' => $country->id]);
        // Esta línea sirve para crear una ciudad.
        $city = City::factory()->create(['country_id' => $country->id, 'state_id' => $state->id]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para guardar la ciudad en el onboarding.
        $client->patchJson('/api/v1/onboarding', ['city_id' => $city->id]);

        // Esta línea sirve para pedir el onboarding.
        $response = $client->getJson('/api/v1/onboarding');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.city_id" sea $city->id.
            ->assertJsonPath('data.city_id', $city->id)
            // Esta línea sirve para exigir que "data.state_id" sea $state->id.
            ->assertJsonPath('data.state_id', $state->id)
            // Esta línea sirve para exigir que "data.country_id" sea $country->id.
            ->assertJsonPath('data.country_id', $country->id);
    }

    // Esta línea sirve para declarar el test que comprueba que se pueden enviar respuestas parciales.
    public function test_user_can_submit_partial_onboarding_answers(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/onboarding autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar 28 al campo "age".
            'age' => 28,
            // Esta línea sirve para asignar 'male' al campo "sex".
            'sex' => 'male',
            // Esta línea sirve para asignar 178 al campo "height_cm".
            'height_cm' => 178,
            // Esta línea sirve para asignar 82.5 al campo "weight_kg".
            'weight_kg' => 82.5,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.age" sea 28.
            ->assertJsonPath('data.age', 28)
            // Esta línea sirve para exigir que "data.completed" sea false.
            ->assertJsonPath('data.completed', false);

        // Esta línea sirve para exigir que la tabla user_profiles tenga ese registro.
        $this->assertDatabaseHas('user_profiles', ['user_id' => $user->id, 'age' => 28]);
    }

    // Esta línea sirve para declarar el test que comprueba que se pueden actualizar las respuestas de forma incremental.
    public function test_user_can_update_onboarding_answers_incrementally(): void
    {
        // frequency_days ahora se valida contra las plantillas activas
        // (RoutineTemplate::activeFrequencyDays), no un config fijo.
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para enviar solo la edad.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', ['age' => 28]);

        // Esta línea sirve para hacer PATCH a /api/v1/onboarding autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar 'beginner' al campo "level".
            'level' => 'beginner',
            // Esta línea sirve para asignar ['gain_muscle', 'strength'] al campo "goals".
            'goals' => ['gain_muscle', 'strength'],
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.level" sea 'beginner'.
            ->assertJsonPath('data.level', 'beginner')
            // Esta línea sirve para exigir que "data.age" sea 28.
            ->assertJsonPath('data.age', 28);
    }

    // Esta línea sirve para declarar el test que comprueba que se aceptan los límites del rango de edad.
    public function test_age_range_limits_are_accepted(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/onboarding con los datos enviados.
            ->postJson('/api/v1/onboarding', ['age' => 15])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated()
            // Esta línea sirve para exigir que "data.age" sea 15.
            ->assertJsonPath('data.age', 15);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/onboarding con los datos enviados.
            ->patchJson('/api/v1/onboarding', ['age' => 70])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.age" sea 70.
            ->assertJsonPath('data.age', 70);
    }

    // Esta línea sirve para declarar el test que comprueba que una edad fuera de 15 a 70 se rechaza.
    public function test_age_outside_15_to_70_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para recorrer edades inválidas.
        foreach ([14, 71, -5, 0] as $age) {
            // Esta línea sirve para preparar la petición autenticada como user.
            $this->actingAs($user, 'sanctum')
                // Esta línea sirve para hacer POST a /api/v1/onboarding con los datos enviados.
                ->postJson('/api/v1/onboarding', ['age' => $age])
                // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
                ->assertUnprocessable()
                // Esta línea sirve para exigir errores de validación en ['age' => 'La edad debe estar entre 15 y 70 años.'].
                ->assertJsonValidationErrors(['age' => 'La edad debe estar entre 15 y 70 años.']);
        }

        // Esta línea sirve para exigir que la tabla user_profiles no tenga ese registro.
        $this->assertDatabaseMissing('user_profiles', ['user_id' => $user->id, 'age' => 14]);
        // Esta línea sirve para exigir que la tabla user_profiles no tenga ese registro.
        $this->assertDatabaseMissing('user_profiles', ['user_id' => $user->id, 'age' => 71]);
    }

    // Esta línea sirve para declarar el test que comprueba que una edad no numérica o vacía se rechaza.
    public function test_non_numeric_or_empty_age_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para recorrer edades inválidas.
        foreach (['abc', '25.5', '', null] as $age) {
            // Esta línea sirve para preparar la petición autenticada como user.
            $this->actingAs($user, 'sanctum')
                // Esta línea sirve para hacer POST a /api/v1/onboarding con los datos enviados.
                ->postJson('/api/v1/onboarding', ['age' => $age])
                // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
                ->assertUnprocessable()
                // Esta línea sirve para exigir errores de validación en 'age'.
                ->assertJsonValidationErrors('age');
        }
    }

    // Esta línea sirve para declarar el test que comprueba que un objetivo inválido se rechaza.
    public function test_invalid_goal_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/onboarding autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar ['not_a_real_goal'] al campo "goals".
            'goals' => ['not_a_real_goal'],
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "goals.0".
        $response->assertUnprocessable()->assertJsonValidationErrors('goals.0');
    }

    // Esta línea sirve para declarar el test que comprueba que completar el onboarding falla si faltan datos.
    public function test_completing_onboarding_fails_when_required_fields_are_missing(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para enviar solo la edad.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', ['age' => 28]);

        // Esta línea sirve para hacer POST a /api/v1/onboarding/complete autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding/complete');

        // Esta línea sirve para exigir 422 con error de validación en "onboarding".
        $response->assertUnprocessable()->assertJsonValidationErrors('onboarding');
    }

    // Esta línea sirve para declarar el test que comprueba que se puede completar el onboarding con todos los datos.
    public function test_user_can_complete_onboarding_once_all_required_fields_are_present(): void
    {
        // Completar onboarding dispara OnboardingCompleted -> GenerateRoutineAction
        // sincrono (ver GenerateRoutineOnOnboardingCompleted) contra el motor de
        // plantillas — necesita el catalogo de ejercicios + las plantillas sembradas.
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para enviar las respuestas completas.
        $client->postJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar 28 al campo "age".
            'age' => 28,
            // Esta línea sirve para asignar 'male' al campo "sex".
            'sex' => 'male',
            // Esta línea sirve para asignar 178 al campo "height_cm".
            'height_cm' => 178,
            // Esta línea sirve para asignar 82.5 al campo "weight_kg".
            'weight_kg' => 82.5,
            // Esta línea sirve para asignar 'intermediate' al campo "level".
            'level' => 'intermediate',
            // Esta línea sirve para asignar ['gain_muscle'] al campo "goals".
            'goals' => ['gain_muscle'],
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
        ]);

        // Esta línea sirve para completar el onboarding.
        $response = $client->postJson('/api/v1/onboarding/complete');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.completed" sea true.
            ->assertJsonPath('data.completed', true);

        // Esta línea sirve para exigir que la tabla onboarding_responses tenga ese registro.
        $this->assertDatabaseHas('onboarding_responses', ['user_id' => $user->id, 'completed' => true]);

        // /auth/me debe reflejar el onboarding como completado.
        // Esta línea sirve para exigir que /auth/me indique el onboarding completo.
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.onboarding_completed', true);
    }

    // Esta línea sirve para declarar el test que comprueba que completar falla limpiamente si no hay plantilla para la combinación.
    public function test_completing_onboarding_fails_cleanly_when_no_template_matches_the_users_combo(): void
    {
        // RoutineTemplate::activeFrequencyDays() (usado para validar
        // frequency_days) no filtra por sexo/nivel — si la combinación
        // exacta que eligió el usuario no tiene plantilla activa (acá,
        // desactivada a propósito para simular ese hueco), completar el
        // onboarding no debe tirar un 500 sin manejar ni marcar el
        // onboarding como completado a medias.
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);

        // Esta línea sirve para desactivar las plantillas de rutina.
        RoutineTemplate::query()
            // Esta línea sirve para filtrar por sex.
            ->where('sex', 'male')
            // Esta línea sirve para filtrar por frequency_days.
            ->where('frequency_days', 4)
            // Esta línea sirve para filtrar por level.
            ->where('level', 'intermediate')
            // Esta línea sirve para aplicar la desactivación.
            ->update(['is_active' => false]);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para enviar las respuestas completas.
        $client->postJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar 28 al campo "age".
            'age' => 28,
            // Esta línea sirve para asignar 'male' al campo "sex".
            'sex' => 'male',
            // Esta línea sirve para asignar 178 al campo "height_cm".
            'height_cm' => 178,
            // Esta línea sirve para asignar 82.5 al campo "weight_kg".
            'weight_kg' => 82.5,
            // Esta línea sirve para asignar 'intermediate' al campo "level".
            'level' => 'intermediate',
            // Esta línea sirve para asignar ['gain_muscle'] al campo "goals".
            'goals' => ['gain_muscle'],
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
        ]);

        // Esta línea sirve para completar el onboarding.
        $response = $client->postJson('/api/v1/onboarding/complete');

        // Esta línea sirve para exigir que la respuesta sea 422.
        $response->assertStatus(422);
        // Esta línea sirve para exigir que la tabla onboarding_responses tenga ese registro.
        $this->assertDatabaseHas('onboarding_responses', ['user_id' => $user->id, 'completed' => false]);
    }
}
