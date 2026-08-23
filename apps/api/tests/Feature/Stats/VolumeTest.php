<?php

namespace Tests\Feature\Stats;

use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutSession;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VolumeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function logCompletedSetFor(mixed $client, string $exerciseName, float $weight, int $reps): int
    {
        $exerciseId = Exercise::query()->where('name', $exerciseName)->value('id');
        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        $workoutExercise = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            'exercise_id' => $exerciseId,
        ])->json('data');

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets", [
            'weight_kg' => $weight, 'reps' => $reps,
        ]);
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        return $session['id'];
    }

    public function test_volume_is_grouped_by_muscle_group(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        $this->logCompletedSetFor($client, 'Remo con barra', 50, 10);

        $response = $client->getJson('/api/v1/stats/volume');

        $response->assertOk();
        $response->assertJsonFragment(['muscle_group' => 'Pecho', 'volume_kg' => 1000.0]);
        $response->assertJsonFragment(['muscle_group' => 'Espalda', 'volume_kg' => 500.0]);
    }

    public function test_weekly_range_excludes_sessions_older_than_seven_days(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $sessionId = $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        WorkoutSession::query()->where('id', $sessionId)->update(['performed_at' => now()->subDays(10)]);

        $response = $client->getJson('/api/v1/stats/volume?range=weekly');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }

    public function test_monthly_range_includes_a_ten_day_old_session(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $sessionId = $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        WorkoutSession::query()->where('id', $sessionId)->update(['performed_at' => now()->subDays(10)]);

        $response = $client->getJson('/api/v1/stats/volume?range=monthly');

        $response->assertOk();
        $response->assertJsonFragment(['muscle_group' => 'Pecho', 'volume_kg' => 1000.0]);
    }

    public function test_invalid_range_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/stats/volume?range=yearly')
            ->assertUnprocessable();
    }
}
