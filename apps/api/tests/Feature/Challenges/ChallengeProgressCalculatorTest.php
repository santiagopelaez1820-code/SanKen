<?php

namespace Tests\Feature\Challenges;

use App\Domain\Challenges\Services\ChallengeCatalog;
use App\Domain\Challenges\Services\ChallengeProgressCalculator;
use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use Carbon\Carbon;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChallengeProgressCalculatorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function logCompletedSession(User $user, string $date, ?float $weightKg = null, ?int $reps = null): WorkoutSession
    {
        $session = WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => $date, 'completed' => true,
        ]);

        if ($weightKg !== null) {
            $exercise = WorkoutExercise::query()->create([
                'workout_session_id' => $session->id, 'exercise_id' => Exercise::query()->value('id'), 'order' => 1, 'all_sets_completed' => true,
            ]);
            WorkoutSet::query()->create([
                'workout_exercise_id' => $exercise->id, 'set_number' => 1,
                'weight_kg' => $weightKg, 'reps' => $reps, 'is_warmup' => false, 'completed' => true,
            ]);
        }

        return $session;
    }

    public function test_workouts_count_only_counts_completed_sessions_within_the_range(): void
    {
        $user = User::factory()->create();
        $this->logCompletedSession($user, '2026-08-03');
        $this->logCompletedSession($user, '2026-08-05');
        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => '2026-08-06', 'completed' => false]);
        $this->logCompletedSession($user, '2026-08-20');

        $value = (new ChallengeProgressCalculator)->calculate(
            $user->id, ChallengeCatalog::METRIC_WORKOUTS_COUNT,
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        $this->assertSame(2.0, $value);
    }

    public function test_total_volume_kg_sums_weight_times_reps_for_working_sets_only(): void
    {
        $user = User::factory()->create();
        $this->logCompletedSession($user, '2026-08-03', weightKg: 100, reps: 10);
        $this->logCompletedSession($user, '2026-08-04', weightKg: 50, reps: 8);
        // Fuera de rango: no debe sumar.
        $this->logCompletedSession($user, '2026-08-20', weightKg: 999, reps: 99);

        $value = (new ChallengeProgressCalculator)->calculate(
            $user->id, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        $this->assertSame(1400.0, $value);
    }

    public function test_total_volume_kg_ignores_warmup_and_incomplete_sets(): void
    {
        $user = User::factory()->create();
        $session = $this->logCompletedSession($user, '2026-08-03');
        $exercise = WorkoutExercise::query()->create([
            'workout_session_id' => $session->id, 'exercise_id' => Exercise::query()->value('id'), 'order' => 1, 'all_sets_completed' => true,
        ]);
        WorkoutSet::query()->create([
            'workout_exercise_id' => $exercise->id, 'set_number' => 1,
            'weight_kg' => 100, 'reps' => 10, 'is_warmup' => true, 'completed' => true,
        ]);
        WorkoutSet::query()->create([
            'workout_exercise_id' => $exercise->id, 'set_number' => 2,
            'weight_kg' => 100, 'reps' => 10, 'is_warmup' => false, 'completed' => false,
        ]);

        $value = (new ChallengeProgressCalculator)->calculate(
            $user->id, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        $this->assertSame(0.0, $value);
    }
}
