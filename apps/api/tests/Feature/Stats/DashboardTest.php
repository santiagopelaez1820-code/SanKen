<?php

namespace Tests\Feature\Stats;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    /**
     * @return array{0: RoutineDay, 1: RoutineExercise}
     */
    private function makeRoutineDayWithOneExercise(User $user): array
    {
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        $routineExercise = RoutineExercise::query()->create([
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        return [$day->load('exercises'), $routineExercise];
    }

    public function test_dashboard_is_zeroed_out_for_a_new_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/dashboard');

        $response->assertOk();
        $response->assertJson([
            'data' => [
                'total_hours' => 0,
                'total_sets' => 0,
                'total_volume_kg' => 0,
                'current_streak_days' => 0,
                'recent_personal_records' => [],
            ],
        ]);
    }

    public function test_completing_a_session_updates_the_dashboard_totals(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            'weight_kg' => 50, 'reps' => 5, 'is_warmup' => true,
        ]);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", ['duration_minutes' => 45]);

        $response = $client->getJson('/api/v1/stats/dashboard');

        $response->assertOk();
        // 2 series de trabajo (la warmup no cuenta), 100kg x 10 reps x 2 = 2000kg de volumen.
        $response->assertJsonPath('data.total_sets', 2);
        $this->assertEquals(2000.0, (float) $response->json('data.total_volume_kg'));
        $this->assertEquals(0.8, (float) $response->json('data.total_hours'));
        $response->assertJsonPath('data.current_streak_days', 1);
        $response->assertJsonCount(1, 'data.recent_personal_records');
    }

    public function test_completing_a_second_session_the_same_day_updates_the_same_stats_row_instead_of_duplicating_it(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId1 = $session1['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/exercises/{$weId1}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/complete", [])->assertOk();

        $session2 = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session2['id']}/complete", [])->assertOk();

        $this->assertDatabaseCount('user_stats_daily', 1);
        $response = $client->getJson('/api/v1/stats/dashboard');
        $response->assertJsonPath('data.total_sets', 1);
    }

    public function test_dashboard_only_reflects_the_authenticated_users_data(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($owner);
        $ownerClient = $this->actingAs($owner, 'sanctum');

        $session = $ownerClient->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/stats/dashboard');

        $response->assertOk();
        $response->assertJsonPath('data.total_sets', 0);
    }

    public function test_a_second_dashboard_request_does_not_requery_the_underlying_tables(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $client->getJson('/api/v1/stats/dashboard')->assertOk();

        DB::enableQueryLog();
        $client->getJson('/api/v1/stats/dashboard')->assertOk();
        $queries = collect(DB::getQueryLog())->pluck('query')->implode(' | ');
        DB::disableQueryLog();

        $this->assertStringNotContainsString('user_stats_daily', $queries);
        $this->assertStringNotContainsString('workout_sessions', $queries);
        $this->assertStringNotContainsString('personal_records', $queries);
    }

    public function test_completing_a_session_busts_the_dashboard_cache(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $client->getJson('/api/v1/stats/dashboard')->assertOk()->assertJsonPath('data.total_sets', 0);

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", ['duration_minutes' => 45]);

        $response = $client->getJson('/api/v1/stats/dashboard');
        $response->assertOk()->assertJsonPath('data.total_sets', 1);
    }

    public function test_logging_a_new_personal_record_busts_the_dashboard_cache(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $client->getJson('/api/v1/stats/dashboard')->assertOk()->assertJsonCount(0, 'data.recent_personal_records');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        $response = $client->getJson('/api/v1/stats/dashboard');
        $response->assertOk()->assertJsonCount(1, 'data.recent_personal_records');
    }
}
