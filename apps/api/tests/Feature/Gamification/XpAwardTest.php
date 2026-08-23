<?php

namespace Tests\Feature\Gamification;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class XpAwardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(AchievementSeeder::class);
    }

    private function makeRoutineDayWithOneExercise(User $user): RoutineDay
    {
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

        return $day->load('exercises');
    }

    private function completeASession(TestCase $client, RoutineDay $day): TestResponse
    {
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        return $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);
    }

    public function test_completing_the_first_workout_awards_base_xp_and_unlocks_first_workout_achievement(): void
    {
        $user = User::factory()->create();
        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $response = $this->completeASession($client, $day);

        $response->assertOk();
        $this->assertSame(20 + 50, $response->json('meta.gamification.xp_awarded'));
        $this->assertSame(['first_workout'], array_column($response->json('meta.gamification.achievements_unlocked'), 'code'));
        $this->assertDatabaseHas('user_xp', ['user_id' => $user->id, 'total_xp' => 70]);
        $this->assertDatabaseHas('user_achievements', ['user_id' => $user->id]);
    }

    public function test_completing_the_tenth_session_unlocks_consistent_achievement(): void
    {
        $user = User::factory()->create();
        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        for ($i = 0; $i < 9; $i++) {
            $this->completeASession($client, $day)->assertOk();
        }

        $response = $this->completeASession($client, $day);

        $response->assertOk();
        $this->assertSame(20 + 100, $response->json('meta.gamification.xp_awarded'));
        $this->assertSame(['consistent'], array_column($response->json('meta.gamification.achievements_unlocked'), 'code'));
        // 10 sesiones x 20 base + 50 (first_workout) + 100 (consistent).
        $this->assertDatabaseHas('user_xp', ['user_id' => $user->id, 'total_xp' => 200 + 50 + 100]);
    }
}
