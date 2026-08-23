<?php

namespace Tests\Feature\Challenges;

use App\Events\ChallengeProgressUpdated;
use App\Models\Challenge;
use App\Models\ChallengeParticipant;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChallengeProgressBroadcastTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(AchievementSeeder::class);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
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

    public function test_completing_a_session_updates_progress_and_broadcasts_the_new_leaderboard(): void
    {
        Event::fake([ChallengeProgressUpdated::class]);

        $challenge = Challenge::query()->create([
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

        $user = User::factory()->create();
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 0]);

        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        $this->assertDatabaseHas('challenge_participants', [
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 1,
        ]);

        Event::assertDispatched(ChallengeProgressUpdated::class, function (ChallengeProgressUpdated $event) use ($challenge, $user) {
            return $event->challenge->is($challenge)
                && collect($event->leaderboard)->contains(fn ($entry) => $entry['user_id'] === $user->id && $entry['progress_value'] === 1.0);
        });
    }

    public function test_completing_a_session_does_not_touch_challenges_the_user_has_not_joined(): void
    {
        Event::fake([ChallengeProgressUpdated::class]);

        Challenge::query()->create([
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

        $user = User::factory()->create();
        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        $this->assertDatabaseCount('challenge_participants', 0);
        Event::assertNotDispatched(ChallengeProgressUpdated::class);
    }

    public function test_reaching_the_target_marks_the_participant_completed(): void
    {
        Event::fake([ChallengeProgressUpdated::class]);

        $challenge = Challenge::query()->create([
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 1],
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

        $user = User::factory()->create();
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 0]);

        $day = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        $this->assertDatabaseHas('challenge_participants', [
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'completed' => true,
        ]);
    }
}
