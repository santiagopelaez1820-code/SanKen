<?php

namespace Tests\Feature\Gamification;

use App\Application\Stats\Actions\AggregateDailyStatsAction;
use App\Models\Exercise;
use App\Models\PersonalRecord;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrAndStreakAchievementsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(AchievementSeeder::class);
    }

    public function test_pr_achievements_unlock_at_1_10_and_25_records_and_never_duplicate(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now(), 'completed' => false]);
        $exerciseIds = Exercise::query()->orderBy('id')->limit(25)->pluck('id');

        $unlockedCodesInOrder = [];
        foreach ($exerciseIds as $exerciseId) {
            $workoutExercise = WorkoutExercise::query()->create([
                'workout_session_id' => $session->id, 'exercise_id' => $exerciseId, 'order' => 1,
            ]);

            $response = $client->postJson(
                "/api/v1/workout-sessions/{$session->id}/exercises/{$workoutExercise->id}/sets",
                ['weight_kg' => 100, 'reps' => 10],
            );
            $response->assertCreated();
        }

        $this->assertDatabaseHas('personal_records', ['user_id' => $user->id]);
        $this->assertSame(25, PersonalRecord::query()->where('user_id', $user->id)->count());

        foreach (['pr_first', 'pr_10', 'pr_25'] as $code) {
            $this->assertSame(
                1,
                UserAchievement::query()
                    ->whereHas('achievement', fn ($q) => $q->where('code', $code))
                    ->where('user_id', $user->id)
                    ->count(),
                "El logro {$code} debería haberse otorgado exactamente una vez.",
            );
        }
    }

    public function test_streak_achievements_unlock_at_7_30_and_100_days(): void
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 100; $i++) {
            $date = now()->subDays(99 - $i)->toDateString();
            WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $date, 'completed' => true]);
            AggregateDailyStatsAction::dispatchSync($user, $date);
        }

        foreach (['streak_7', 'streak_30', 'streak_100'] as $code) {
            $this->assertSame(
                1,
                UserAchievement::query()
                    ->whereHas('achievement', fn ($q) => $q->where('code', $code))
                    ->where('user_id', $user->id)
                    ->count(),
                "El logro {$code} debería haberse otorgado exactamente una vez.",
            );
        }
    }
}
