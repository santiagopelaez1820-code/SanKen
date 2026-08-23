<?php

namespace Tests\Feature\Gamification;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineExercise;
use App\Models\User;
use App\Models\UserXp;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LevelUpResponseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(AchievementSeeder::class);
    }

    public function test_completing_a_workout_that_crosses_a_level_boundary_reports_leveled_up(): void
    {
        $user = User::factory()->create();
        UserXp::query()->create(['user_id' => $user->id, 'total_xp' => 90]);

        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        RoutineExercise::query()->create([
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $response->assertOk();
        $this->assertTrue($response->json('meta.gamification.leveled_up'));
        $this->assertSame(2, $response->json('meta.gamification.new_level'));
        // 90 previo + 20 base + 50 (first_workout).
        $this->assertDatabaseHas('user_xp', ['user_id' => $user->id, 'total_xp' => 160]);
    }

    public function test_completing_a_workout_that_does_not_cross_a_level_boundary_reports_no_level_up(): void
    {
        $user = User::factory()->create();
        UserXp::query()->create(['user_id' => $user->id, 'total_xp' => 500]);

        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $response->assertOk();
        $this->assertFalse($response->json('meta.gamification.leveled_up'));
    }
}
