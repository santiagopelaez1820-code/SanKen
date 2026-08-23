<?php

namespace Tests\Feature\Calendar;

use App\Models\CalendarReminder;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\User;
use App\Models\WorkoutSession;
use Carbon\Carbon;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/calendar?month=2026-08')->assertUnauthorized();
    }

    public function test_month_must_match_the_expected_format(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/calendar?month=2026-08-01')
            ->assertUnprocessable();
    }

    public function test_lists_completed_sessions_in_range_using_the_routine_day_label(): void
    {
        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        WorkoutSession::query()->create([
            'user_id' => $user->id, 'routine_day_id' => $day->id, 'performed_at' => '2026-08-05',
            'completed' => true, 'duration_minutes' => 40,
        ]);
        // Fuera de rango: no debe aparecer.
        WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => '2026-07-31', 'completed' => true,
        ]);
        // Incompleta: no debe aparecer.
        WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => '2026-08-06', 'completed' => false,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $events = collect($response->json('data.events'));
        $completed = $events->firstWhere('type', 'workout_completed');
        $this->assertNotNull($completed);
        $this->assertSame('2026-08-05', $completed['event_date']);
        $this->assertSame('Full Body A', $completed['title']);
        $this->assertSame(1, $events->where('type', 'workout_completed')->count());
    }

    public function test_completed_session_reports_the_real_muscle_groups_worked(): void
    {
        $user = User::factory()->create();
        $chestExerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        $tricepsExerciseId = Exercise::query()->where('name', 'Press francés')->value('id');

        $session = WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => '2026-08-05', 'completed' => true,
        ]);
        $session->exercises()->create(['exercise_id' => $chestExerciseId, 'order' => 1, 'target_sets' => 3]);
        $session->exercises()->create(['exercise_id' => $tricepsExerciseId, 'order' => 2, 'target_sets' => 3]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $completed = collect($response->json('data.events'))->firstWhere('type', 'workout_completed');
        $this->assertNotNull($completed);
        $this->assertEqualsCanonicalizing(['Pecho', 'Tríceps'], $completed['muscle_groups']);
    }

    public function test_planned_workout_reports_the_routine_days_target_muscle_groups(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $routine->days()->create(['day_order' => 1, 'label' => 'Push', 'target_muscle_groups' => ['chest', 'triceps']]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $planned = collect($response->json('data.events'))->firstWhere('type', 'workout_planned');
        $this->assertNotNull($planned);
        $this->assertEqualsCanonicalizing(['Pecho', 'Tríceps'], $planned['muscle_groups']);

        Carbon::setTestNow();
    }

    public function test_a_session_performed_on_the_last_day_of_the_month_is_included(): void
    {
        $user = User::factory()->create();
        WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => '2026-08-31', 'completed' => true,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $events = collect($response->json('data.events'));
        $this->assertSame(1, $events->where('type', 'workout_completed')->where('event_date', '2026-08-31')->count());
    }

    public function test_includes_todays_suggested_workout_only_when_today_falls_in_the_requested_month(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12'));

        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $routine->days()->create(['day_order' => 1, 'label' => 'Push', 'target_muscle_groups' => ['chest']]);

        $client = $this->actingAs($user, 'sanctum');

        $thisMonth = $client->getJson('/api/v1/calendar?month=2026-08');
        $thisMonth->assertOk();
        $planned = collect($thisMonth->json('data.events'))->firstWhere('type', 'workout_planned');
        $this->assertNotNull($planned);
        $this->assertSame('2026-08-12', $planned['event_date']);
        $this->assertSame('Push', $planned['title']);

        $otherMonth = $client->getJson('/api/v1/calendar?month=2026-09');
        $otherMonth->assertOk();
        $this->assertNull(collect($otherMonth->json('data.events'))->firstWhere('type', 'workout_planned'));

        Carbon::setTestNow();
    }

    public function test_user_without_an_active_routine_gets_no_planned_entry(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $this->assertNull(collect($response->json('data.events'))->firstWhere('type', 'workout_planned'));

        Carbon::setTestNow();
    }

    public function test_a_users_calendar_never_includes_another_users_sessions(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        WorkoutSession::query()->create(['user_id' => $other->id, 'performed_at' => '2026-08-05', 'completed' => true]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        $response->assertOk();
        $response->assertJsonCount(0, 'data.events');
    }

    public function test_reminder_can_be_created_and_appears_in_its_month(): void
    {
        $user = User::factory()->create();

        $store = $this->actingAs($user, 'sanctum')->postJson('/api/v1/calendar/reminders', [
            'event_date' => '2026-08-20', 'title' => 'Pesarme', 'notes' => 'En ayunas',
        ]);
        $store->assertCreated();
        $store->assertJsonPath('data.type', 'reminder');

        $response = $this->getJson('/api/v1/calendar?month=2026-08');
        $reminder = collect($response->json('data.events'))->firstWhere('type', 'reminder');
        $this->assertNotNull($reminder);
        $this->assertSame('Pesarme', $reminder['title']);
    }

    public function test_reminder_requires_a_title_and_a_date(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/calendar/reminders', [])
            ->assertUnprocessable();
    }

    public function test_owner_can_delete_their_reminder(): void
    {
        $user = User::factory()->create();
        $reminder = CalendarReminder::query()->create([
            'user_id' => $user->id, 'event_date' => '2026-08-20', 'title' => 'Pesarme',
        ]);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/calendar/reminders/{$reminder->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('calendar_reminders', ['id' => $reminder->id]);
    }

    public function test_a_user_cannot_delete_another_users_reminder(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $reminder = CalendarReminder::query()->create([
            'user_id' => $owner->id, 'event_date' => '2026-08-20', 'title' => 'Pesarme',
        ]);

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/v1/calendar/reminders/{$reminder->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('calendar_reminders', ['id' => $reminder->id]);
    }
}
