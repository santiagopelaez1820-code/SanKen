<?php

namespace Tests\Feature\Gamification;

use App\Application\Stats\Actions\AggregateDailyStatsAction;
use App\Events\PRBroken;
use App\Events\StreakMilestone;
use App\Events\WorkoutCompleted;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use App\Models\WorkoutSession;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class EventDispatchTest extends TestCase
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

    public function test_completing_a_session_dispatches_workout_completed(): void
    {
        Event::fake([WorkoutCompleted::class]);
        $user = User::factory()->create();
        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        Event::assertDispatched(WorkoutCompleted::class, fn ($event) => $event->user->is($user));
    }

    public function test_a_new_personal_record_dispatches_pr_broken(): void
    {
        Event::fake([PRBroken::class]);
        $user = User::factory()->create();
        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        Event::assertDispatched(PRBroken::class, fn ($event) => $event->user->is($user));
    }

    public function test_crossing_a_streak_threshold_dispatches_streak_milestone_exactly_once(): void
    {
        Event::fake([StreakMilestone::class]);
        $user = User::factory()->create();

        for ($i = 0; $i < 7; $i++) {
            $date = now()->subDays(6 - $i)->toDateString();
            WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $date, 'completed' => true]);
            AggregateDailyStatsAction::dispatchSync($user, $date);
        }

        Event::assertDispatchedTimes(StreakMilestone::class, 1);
        Event::assertDispatched(StreakMilestone::class, fn ($event) => $event->user->is($user) && $event->streakDays === 7);

        // Un día más con la racha viva (8) no vuelve a cruzar el umbral de 7.
        $eighthDate = now()->toDateString();
        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $eighthDate, 'completed' => true]);
        AggregateDailyStatsAction::dispatchSync($user, $eighthDate);

        Event::assertDispatchedTimes(StreakMilestone::class, 1);
    }
}
