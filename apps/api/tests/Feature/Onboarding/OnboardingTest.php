<?php

namespace Tests\Feature\Onboarding;

use App\Models\City;
use App\Models\Country;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_onboarding(): void
    {
        $this->getJson('/api/v1/onboarding')->assertUnauthorized();
    }

    public function test_questions_endpoint_returns_catalog_with_countries_and_cities(): void
    {
        $country = Country::factory()->create(['name' => 'México', 'code' => 'MX']);
        City::factory()->create(['country_id' => $country->id, 'name' => 'Guadalajara']);

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/onboarding/questions');

        $response->assertOk()
            ->assertJsonPath('data.countries.0.name', 'México')
            ->assertJsonPath('data.countries.0.cities.0.name', 'Guadalajara')
            ->assertJsonFragment(['gain_muscle'])
            ->assertJson(fn ($json) => $json->has('data', fn ($data) => $data
                ->where('places', ['home', 'gym'])
                ->etc()
            ));
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
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', ['age' => 28]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/v1/onboarding', [
            'level' => 'beginner',
            'goals' => ['gain_muscle', 'strength'],
            'frequency_days' => 4,
            'session_minutes' => 60,
            'place' => 'gym',
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
            'session_minutes' => 60,
            'place' => 'gym',
        ]);

        $response = $client->postJson('/api/v1/onboarding/complete');

        $response->assertOk()
            ->assertJsonPath('data.completed', true);

        $this->assertDatabaseHas('onboarding_responses', ['user_id' => $user->id, 'completed' => true]);

        // /auth/me debe reflejar el onboarding como completado.
        $client->getJson('/api/v1/auth/me')->assertJsonPath('data.onboarding_completed', true);
    }
}
