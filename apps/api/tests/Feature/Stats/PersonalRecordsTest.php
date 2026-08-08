<?php

namespace Tests\Feature\Stats;

use App\Models\Exercise;
use App\Models\User;
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
}
