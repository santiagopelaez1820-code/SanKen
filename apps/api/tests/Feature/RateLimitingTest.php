<?php

namespace Tests\Feature;

use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    public function test_writes_limiter_returns_429_after_the_threshold(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);

        $user = User::factory()->create();
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);
        $exercise = WorkoutExercise::query()->create([
            'workout_session_id' => $session->id,
            'exercise_id' => Exercise::query()->first()->id,
            'order' => 1,
        ]);
        $set = WorkoutSet::query()->create([
            'workout_exercise_id' => $exercise->id,
            'set_number' => 1,
            'weight_kg' => 50,
            'reps' => 10,
        ]);

        $client = $this->actingAs($user, 'sanctum');

        for ($i = 0; $i < 30; $i++) {
            $client->patchJson("/api/v1/workout-sets/{$set->id}", ['weight_kg' => 50 + $i])->assertOk();
        }

        $client->patchJson("/api/v1/workout-sets/{$set->id}", ['weight_kg' => 999])->assertStatus(429);
    }

    public function test_read_only_routes_are_not_restricted_by_the_writes_limiter(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        for ($i = 0; $i < 35; $i++) {
            $client->getJson('/api/v1/exercises')->assertOk();
        }
    }
}
