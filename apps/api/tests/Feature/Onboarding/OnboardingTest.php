<?php

namespace Tests\Feature\Onboarding;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_onboarding(): void
    {
        $this->getJson('/api/v1/onboarding')->assertUnauthorized();
    }

    public function test_questions_endpoint_returns_countries_without_nested_cities(): void
    {
        $country = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        City::factory()->create(['country_id' => $country->id, 'name' => 'Guadalajara']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/onboarding/questions');

        $response->assertOk()
            ->assertJsonPath('data.countries.0.name', 'México')
            ->assertJsonMissingPath('data.countries.0.cities')
            ->assertJsonFragment(['gain_muscle']);
    }

    public function test_cities_endpoint_returns_cities_for_a_given_country(): void
    {
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        City::factory()->create(['country_id' => $mx->id, 'name' => 'Guadalajara']);
        City::factory()->create(['country_id' => $co->id, 'name' => 'Bogotá']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$mx->id}/cities");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Guadalajara');
    }

    public function test_states_endpoint_returns_states_for_a_given_country(): void
    {
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        State::factory()->create(['country_id' => $co->id, 'name' => 'Cundinamarca']);
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Jalisco']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$co->id}/states");

        $response->assertOk()->assertJsonCount(2, 'data');
        $this->assertEqualsCanonicalizing(
            ['Antioquia', 'Cundinamarca'],
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    public function test_cities_by_state_endpoint_only_returns_cities_of_that_state(): void
    {
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        $cundinamarca = State::factory()->create(['country_id' => $co->id, 'name' => 'Cundinamarca']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Medellín']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Bello']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $cundinamarca->id, 'name' => 'Bogotá']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities");

        $response->assertOk()->assertJsonCount(2, 'data');
        $this->assertEqualsCanonicalizing(
            ['Medellín', 'Bello'],
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    public function test_states_endpoint_hides_leftover_nacional_placeholder_when_real_states_exist(): void
    {
        $mx = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Nacional']);
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Jalisco']);
        State::factory()->create(['country_id' => $mx->id, 'name' => 'Yucatán']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$mx->id}/states");

        $response->assertOk()->assertJsonCount(2, 'data');
        $this->assertEqualsCanonicalizing(
            ['Jalisco', 'Yucatán'],
            collect($response->json('data'))->pluck('name')->all(),
        );
    }

    public function test_states_endpoint_keeps_nacional_when_it_is_the_only_option(): void
    {
        $xx = Country::factory()->create(['name' => 'Territorio X', 'code' => 'XX']);
        State::factory()->create(['country_id' => $xx->id, 'name' => 'Nacional']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/onboarding/countries/{$xx->id}/states");

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Nacional');
    }

    public function test_cities_by_state_endpoint_filters_by_search_case_insensitively(): void
    {
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Marinilla']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Medellín']);
        City::factory()->create(['country_id' => $co->id, 'state_id' => $antioquia->id, 'name' => 'Guatapé']);

        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $response = $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?search=mari");
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Marinilla');

        // Case-insensitive.
        $response = $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?search=MEDEL");
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Medellín');
    }

    public function test_cities_by_state_endpoint_respects_limit_and_caps_it(): void
    {
        $co = Country::factory()->create(['name' => 'Colombia', 'code' => 'CO']);
        $antioquia = State::factory()->create(['country_id' => $co->id, 'name' => 'Antioquia']);
        // Nombres explícitos (no fake()->city()) — el pool de ciudades de
        // Faker es chico y con 120 filas en el mismo estado chocaría con el
        // unique(state_id, name) casi seguro.
        City::factory()
            ->count(120)
            ->sequence(fn ($sequence) => ['name' => 'Ciudad '.$sequence->index])
            ->create(['country_id' => $co->id, 'state_id' => $antioquia->id]);

        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        // Default limit is 50.
        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities")->assertOk()->assertJsonCount(50, 'data');

        // A requested limit above 100 is capped at 100, not honored as-is.
        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?limit=500")
            ->assertOk()->assertJsonCount(100, 'data');

        $client->getJson("/api/v1/onboarding/states/{$antioquia->id}/cities?limit=5")
            ->assertOk()->assertJsonCount(5, 'data');
    }

    public function test_has_location_is_false_until_a_city_is_saved_and_true_after(): void
    {
        $country = Country::factory()->create();
        $state = State::factory()->create(['country_id' => $country->id]);
        $city = City::factory()->create(['country_id' => $country->id, 'state_id' => $state->id]);
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.has_location', false);

        $client->patchJson('/api/v1/onboarding', ['city_id' => $city->id]);

        // actingAs() reutiliza la misma instancia de $user entre llamadas dentro
        // de un test — sin refrescarla, la relación "profile" quedaría cacheada
        // en null desde el primer GET. En una request HTTP real esto no pasa
        // (cada request resuelve el usuario de nuevo), es un artefacto del test.
        $this->actingAs($user->refresh(), 'sanctum');
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.has_location', true);
    }

    public function test_onboarding_show_resolves_state_and_country_from_city(): void
    {
        $country = Country::factory()->create();
        $state = State::factory()->create(['country_id' => $country->id]);
        $city = City::factory()->create(['country_id' => $country->id, 'state_id' => $state->id]);
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->patchJson('/api/v1/onboarding', ['city_id' => $city->id]);

        $response = $client->getJson('/api/v1/onboarding');

        $response->assertOk()
            ->assertJsonPath('data.city_id', $city->id)
            ->assertJsonPath('data.state_id', $state->id)
            ->assertJsonPath('data.country_id', $country->id);
    }

    public function test_user_can_submit_partial_onboarding_answers(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            'age' => 28,
            'sex' => 'male',
            'height_cm' => 178,
            'weight_kg' => 82.5,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.age', 28)
            ->assertJsonPath('data.completed', false);

        $this->assertDatabaseHas('user_profiles', ['user_id' => $user->id, 'age' => 28]);
    }

    public function test_user_can_update_onboarding_answers_incrementally(): void
    {
        // frequency_days ahora se valida contra las plantillas activas
        // (RoutineTemplate::activeFrequencyDays), no un config fijo.
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(RoutineTemplateSeeder::class);

        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', ['age' => 28]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/v1/onboarding', [
            'level' => 'beginner',
            'goals' => ['gain_muscle', 'strength'],
            'frequency_days' => 4,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.level', 'beginner')
            ->assertJsonPath('data.age', 28);
    }

    public function test_invalid_goal_is_rejected(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            'goals' => ['not_a_real_goal'],
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('goals.0');
    }

    public function test_completing_onboarding_fails_when_required_fields_are_missing(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', ['age' => 28]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding/complete');

        $response->assertUnprocessable()->assertJsonValidationErrors('onboarding');
    }

    public function test_user_can_complete_onboarding_once_all_required_fields_are_present(): void
    {
        // Completar onboarding dispara OnboardingCompleted -> GenerateRoutineAction
        // sincrono (ver GenerateRoutineOnOnboardingCompleted) contra el motor de
        // plantillas — necesita el catalogo de ejercicios + las plantillas sembradas.
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(RoutineTemplateSeeder::class);

        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/onboarding', [
            'age' => 28,
            'sex' => 'male',
            'height_cm' => 178,
            'weight_kg' => 82.5,
            'level' => 'intermediate',
            'goals' => ['gain_muscle'],
            'frequency_days' => 4,
        ]);

        $response = $client->postJson('/api/v1/onboarding/complete');

        $response->assertOk()
            ->assertJsonPath('data.completed', true);

        $this->assertDatabaseHas('onboarding_responses', ['user_id' => $user->id, 'completed' => true]);

        // /auth/me debe reflejar el onboarding como completado.
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.onboarding_completed', true);
    }
}
