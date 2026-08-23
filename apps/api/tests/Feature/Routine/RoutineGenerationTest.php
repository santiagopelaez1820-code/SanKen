<?php

namespace Tests\Feature\Routine;

use App\Events\OnboardingCompleted;
use App\Models\Routine;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RoutineGenerationTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        // El motor activo es TemplateRoutineGenerator (ver AppServiceProvider) —
        // sin las plantillas, generar una rutina para male/4d (fixture de este
        // archivo) no encuentra combinacion sexo+frecuencia y tira excepcion.
        $this->seed(RoutineTemplateSeeder::class);
    }

    private function completeOnboardingFor(User $user): void
    {
        $user->profile()->create([
            'age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 82,
        ]);
        $user->onboardingResponse()->create([
            'level' => 'intermediate',
            'goals' => ['gain_muscle'],
            'frequency_days' => 4,
            'session_minutes' => 60,
            'place' => 'gym',
            'equipment_available' => ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            'injuries' => [],
            'completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * GenerateRoutineOnOnboardingCompleted usa dispatchSync (no dispatch) a
     * proposito — con el motor de plantillas, generar es una sola query, ya
     * no hace falta cola. Por eso esto ya no se puede probar con Queue::fake()
     * + assertPushed (dispatchSync nunca pasa por la cola): se verifica el
     * efecto real, que la rutina exista apenas termina de dispararse el evento.
     */
    public function test_completing_onboarding_generates_a_routine_synchronously(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);

        event(new OnboardingCompleted($user->fresh()));

        $this->assertDatabaseHas('routines', ['user_id' => $user->id, 'source' => 'engine', 'is_active' => true]);
    }

    public function test_active_routine_returns_404_when_none_exists(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/routines/active')
            ->assertNotFound();
    }

    public function test_user_can_generate_a_routine_after_completing_onboarding(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        $response->assertCreated()
            ->assertJsonPath('data.source', 'engine')
            ->assertJsonPath('data.goal', 'gain_muscle')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(4, 'data.days');

        $this->assertDatabaseHas('routines', ['user_id' => $user->id, 'is_active' => true]);
    }

    public function test_generating_without_completed_onboarding_fails(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/routines/generate')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('onboarding');
    }

    public function test_active_routine_endpoint_returns_the_generated_plan(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/routines/active');

        $response->assertOk()->assertJsonPath('data.is_active', true);
    }

    public function test_regenerating_deactivates_the_previous_engine_routine(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $client = $this->actingAs($user, 'sanctum');

        $first = $client->postJson('/api/v1/routines/generate')->json('data.id');
        $client->postJson('/api/v1/routines/generate');

        $this->assertDatabaseHas('routines', ['id' => $first, 'is_active' => false]);
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->where('is_active', true)->count());
    }

    public function test_engine_never_overwrites_a_trainer_authored_active_routine(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $trainer = User::factory()->create(['role' => 'trainer']);

        $trainerRoutine = Routine::query()->create([
            'user_id' => $user->id,
            'created_by_trainer_id' => $trainer->id,
            'source' => 'trainer',
            'goal' => 'strength',
            'split_type' => 'upper_lower',
            'frequency_days' => 4,
            'duration_weeks' => 6,
            'is_active' => true,
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        $this->assertDatabaseHas('routines', ['id' => $trainerRoutine->id, 'is_active' => true]);
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->count());
    }

    public function test_a_second_request_for_the_active_routine_does_not_requery_its_exercises(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $client = $this->actingAs($user, 'sanctum');
        $client->postJson('/api/v1/routines/generate');
        $client->getJson('/api/v1/routines/active')->assertOk();

        DB::enableQueryLog();
        $client->getJson('/api/v1/routines/active')->assertOk();
        $queries = collect(DB::getQueryLog())->pluck('query')->implode(' | ');
        DB::disableQueryLog();

        $this->assertStringNotContainsString('routine_exercises', $queries);
        $this->assertStringNotContainsString('"exercises"', $queries);
    }

    public function test_regenerating_a_routine_busts_the_active_routine_cache(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/routines/generate');
        $client->getJson('/api/v1/routines/active')->assertOk();

        $second = $client->postJson('/api/v1/routines/generate')->json('data.id');

        $response = $client->getJson('/api/v1/routines/active');
        $response->assertOk()->assertJsonPath('data.id', $second);
    }

    public function test_next_day_id_still_updates_after_completing_a_session_even_though_the_routine_payload_is_cached(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user);
        $client = $this->actingAs($user, 'sanctum');
        $client->postJson('/api/v1/routines/generate');

        $first = $client->getJson('/api/v1/routines/active')->assertOk();
        $firstNextDayId = $first->json('meta.next_day_id');
        $firstDaysPayload = $first->json('data.days');

        $dayId = collect($first->json('data.days'))->firstWhere('id', $firstNextDayId)['id'];
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayId])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $second = $client->getJson('/api/v1/routines/active')->assertOk();

        $this->assertNotSame($firstNextDayId, $second->json('meta.next_day_id'));
        $this->assertSame($firstDaysPayload, $second->json('data.days'));
    }
}
