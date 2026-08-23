<?php

namespace Tests\Feature\Stats;

use App\Models\Exercise;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    public function test_metric_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/progress')->assertUnprocessable();
    }

    public function test_exercise_id_is_required_for_the_1rm_metric(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/stats/progress?metric=1rm')
            ->assertUnprocessable();
    }

    public function test_weight_metric_returns_the_body_measurement_history(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 82.4, 'measured_at' => '2026-07-01']);
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 80.1, 'measured_at' => '2026-08-01']);

        $response = $client->getJson('/api/v1/stats/progress?metric=weight');

        $response->assertOk();
        $response->assertJsonPath('data.0.date', '2026-07-01');
        $response->assertJsonPath('data.0.value', 82.4);
        $response->assertJsonPath('data.1.date', '2026-08-01');
        $response->assertJsonPath('data.1.value', 80.1);
    }

    public function test_1rm_metric_returns_estimated_1rm_per_session_for_the_exercise(): void
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
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $response = $client->getJson("/api/v1/stats/progress?metric=1rm&exercise_id={$exerciseId}");

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        // Epley: 100 * (1 + 10/30) = 133.33
        $response->assertJsonPath('data.0.value', 133.33);
    }

    public function test_volume_metric_returns_the_daily_aggregate_history(): void
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
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $response = $client->getJson('/api/v1/stats/progress?metric=volume');

        $response->assertOk();
        $response->assertJsonPath('data.0.date', now()->toDateString());
        $this->assertEquals(1000.0, (float) $response->json('data.0.value'));
    }
}
