<?php

namespace Tests\Feature\Stats;

use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutSession;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonalRecordsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    public function test_lists_the_users_personal_records_with_exercise_name(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        $workoutExercise = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            'exercise_id' => $exerciseId,
        ])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);

        $response = $client->getJson('/api/v1/stats/personal-records');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.exercise_name', 'Press banca con barra');
        $response->assertJsonPath('data.0.record_type', '1rm');
    }

    public function test_returns_an_empty_list_when_the_user_has_no_records(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/personal-records');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }

    public function test_manual_pr_is_created_and_never_touches_workout_sessions(): void
    {
        $user = User::factory()->create();
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/stats/personal-records', [
            'exercise_id' => $exerciseId,
            'weight_kg' => 180,
            'reps' => 1,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('meta.is_new_best', true);
        $response->assertJsonPath('data.record_type', '1rm');
        $this->assertSame(0, WorkoutSession::query()->count());
    }

    public function test_manual_pr_replaces_only_when_it_is_a_genuine_improvement(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 180, 'reps' => 1]);
        $first = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');

        $better = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 200, 'reps' => 1]);
        $better->assertCreated();
        $better->assertJsonPath('meta.is_new_best', true);
        $improved = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');
        $this->assertGreaterThan($first, $improved);

        $worse = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 190, 'reps' => 1]);
        $worse->assertOk();
        $worse->assertJsonPath('meta.is_new_best', false);
        $unchanged = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');
        $this->assertSame($improved, $unchanged);

        $this->assertSame(0, WorkoutSession::query()->count());
    }
}
