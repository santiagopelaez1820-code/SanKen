<?php

namespace Tests\Feature\Gamification;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineExercise;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GamificationEndpointTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(AchievementSeeder::class);
    }

    public function test_new_user_gamification_summary_is_zeroed_and_all_achievements_locked(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/gamification');

        $response->assertOk();
        $response->assertJsonPath('data.total_xp', 0);
        $response->assertJsonPath('data.level', 1);
        $response->assertJsonCount(0, 'data.unlocked_achievements');
        $response->assertJsonCount(10, 'data.locked_achievements');
    }

    public function test_endpoint_moves_an_achievement_to_unlocked_after_completing_a_workout(): void
    {
        $user = User::factory()->create();
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
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        $response = $client->getJson('/api/v1/gamification');

        $response->assertOk();
        $response->assertJsonCount(1, 'data.unlocked_achievements');
        $response->assertJsonCount(9, 'data.locked_achievements');
        $response->assertJsonPath('data.unlocked_achievements.0.code', 'first_workout');
        $this->assertNotNull($response->json('data.unlocked_achievements.0.achieved_at'));
        $this->assertNull($response->json('data.locked_achievements.0.achieved_at'));
    }
}
