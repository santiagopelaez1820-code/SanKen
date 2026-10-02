<?php

namespace Tests\Feature\Support;

use App\Models\OnboardingResponse;
use App\Models\PushDeviceToken;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\WeeklyCheckin;
use App\Models\WorkoutSession;
use App\Notifications\Channels\ExpoPushChannel;
use App\Notifications\NewSupportActivityNotification;
use App\Notifications\WeeklyCheckinAvailableNotification;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

/**
 * Fechas de referencia (hora de Colombia, UTC-5):
 * - lunes 2026-09-28 … domingo 2026-10-04 = semana 2026-W40.
 * - viernes 2027-01-01 cae en la semana ISO 2026-W53 (cambio de año).
 */
class WeeklyCheckinTest extends TestCase
{
    use RefreshDatabase;

    private function at(string $bogotaDateTime): void
    {
        $this->travelTo(CarbonImmutable::parse($bogotaDateTime, 'America/Bogota'));
    }

    private function trainee(array $attributes = []): User
    {
        $user = User::factory()->create(['created_at' => now()->subMonth(), ...$attributes]);
        OnboardingResponse::query()->create(['user_id' => $user->id, 'completed' => true, 'completed_at' => now()->subMonth()]);

        return $user;
    }

    private function current(User $user)
    {
        return $this->actingAs($user)->getJson('/api/v1/support/check-ins/current')->assertOk();
    }

    // --- Cuándo se ofrece ----------------------------------------------------

    public function test_it_is_not_offered_before_friday(): void
    {
        $this->at('2026-10-01 20:00'); // jueves
        $this->current($this->trainee())->assertJsonPath('data.checkin', null)->assertJsonPath('data.should_prompt', false);
        $this->assertDatabaseCount('weekly_checkins', 0);
    }

    public function test_it_is_generated_on_friday_once_per_week_no_matter_how_often_the_app_opens(): void
    {
        $this->at('2026-10-02 09:00'); // viernes
        $user = $this->trainee();

        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40')->assertJsonPath('data.should_prompt', true);
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40');
        $this->at('2026-10-04 21:00'); // domingo, misma semana
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40');

        $this->assertSame(1, WeeklyCheckin::query()->where('user_id', $user->id)->count());
        $this->assertNotNull(WeeklyCheckin::query()->first()->shown_at);
    }

    public function test_week_is_computed_in_colombian_time(): void
    {
        // Lunes 03:00 UTC = domingo 22:00 en Bogotá: sigue siendo la semana W40.
        $this->travelTo(CarbonImmutable::parse('2026-10-05 03:00', 'UTC'));
        $this->current($this->trainee())->assertJsonPath('data.checkin.week', '2026-W40');
    }

    public function test_new_accounts_and_accounts_without_onboarding_are_not_asked(): void
    {
        $this->at('2026-10-02 09:00');
        $brandNew = $this->trainee(['created_at' => now()->subDay()]);
        $noOnboarding = User::factory()->create(['created_at' => now()->subMonth()]);

        $this->current($brandNew)->assertJsonPath('data.checkin', null);
        $this->current($noOnboarding)->assertJsonPath('data.checkin', null);
    }

    public function test_the_support_team_is_not_asked_but_trainers_are(): void
    {
        $this->at('2026-10-02 09:00');

        $this->current($this->trainee(['role' => 'super_admin']))->assertJsonPath('data.checkin', null);
        $this->current($this->trainee(['role' => 'trainer']))->assertJsonPath('data.checkin.week', '2026-W40');
    }

    public function test_it_stores_the_weeks_training_context_including_users_who_did_not_train(): void
    {
        $this->at('2026-10-02 09:00');
        $active = $this->trainee();
        $idle = $this->trainee();
        foreach (['2026-09-28', '2026-09-30', '2026-10-01'] as $date) {
            WorkoutSession::query()->create(['user_id' => $active->id, 'performed_at' => $date, 'completed' => true]);
        }
        // Sesión de la semana anterior: no cuenta.
        WorkoutSession::query()->create(['user_id' => $active->id, 'performed_at' => '2026-09-27', 'completed' => true]);

        $this->current($active);
        $this->current($idle);

        $this->assertSame(3, WeeklyCheckin::query()->where('user_id', $active->id)->first()->context['sessions_completed_this_week']);
        $this->assertSame(0, WeeklyCheckin::query()->where('user_id', $idle->id)->first()->context['sessions_completed_this_week']);
    }

    // --- Responder -----------------------------------------------------------

    public function test_answering_all_good_stores_the_answer_without_creating_a_ticket(): void
    {
        $this->at('2026-10-02 09:00');
        $user = $this->trainee();
        $id = $this->current($user)->json('data.checkin.id');

        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'great', 'topic' => 'none'])
            ->assertOk()
            ->assertJsonPath('data.checkin.status', 'answered')
            ->assertJsonPath('data.ticket', null);

        $this->current($user)->assertJsonPath('data.should_prompt', false);
        $this->assertDatabaseCount('support_tickets', 0);
    }

    public function test_a_comment_becomes_a_support_ticket_with_the_weeks_context(): void
    {
        Notification::fake();
        $this->at('2026-10-02 09:00');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = $this->trainee();
        $id = $this->current($user)->json('data.checkin.id');

        $response = $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", [
            'mood' => 'not_good',
            'topic' => 'observation',
            'comment' => 'Siento que las rutinas están demasiado pesadas para mí.',
        ])->assertOk();

        $ticket = SupportTicket::query()->findOrFail($response->json('data.ticket.id'));
        $this->assertSame('observation', $ticket->type);
        $this->assertSame('weekly_checkin', $ticket->source);
        $this->assertSame($id, $ticket->weekly_checkin_id);
        $this->assertSame(['week' => '2026-W40', 'mood' => 'not_good', 'topic' => 'observation', 'routine_id' => null, 'sessions_completed_this_week' => 0], $ticket->context);
        $this->assertSame('Siento que las rutinas están demasiado pesadas para mí.', $ticket->messages()->first()->body);
        Notification::assertSentTo($admin, NewSupportActivityNotification::class);
    }

    public function test_a_comment_is_required_when_the_user_wants_to_tell_something(): void
    {
        $this->at('2026-10-02 09:00');
        $user = $this->trainee();
        $id = $this->current($user)->json('data.checkin.id');

        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'bad', 'topic' => 'complaint'])
            ->assertUnprocessable()->assertJsonValidationErrors('comment');
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'sad', 'topic' => 'none'])
            ->assertUnprocessable()->assertJsonValidationErrors('mood');
    }

    public function test_it_cannot_be_answered_twice_by_someone_else_or_after_the_week_ends(): void
    {
        $this->at('2026-10-02 09:00');
        $user = $this->trainee();
        $id = $this->current($user)->json('data.checkin.id');

        $this->actingAs($this->trainee())->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'good', 'topic' => 'none'])->assertNotFound();

        $this->at('2026-10-05 09:00'); // lunes siguiente
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'good', 'topic' => 'none'])
            ->assertUnprocessable()->assertJsonValidationErrors('checkin');

        $this->at('2026-10-09 09:00'); // viernes siguiente: check-in nuevo
        $newId = $this->current($user)->assertJsonPath('data.checkin.week', '2026-W41')->json('data.checkin.id');
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$newId}/answer", ['mood' => 'good', 'topic' => 'none'])->assertOk();
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$newId}/answer", ['mood' => 'bad', 'topic' => 'none'])
            ->assertUnprocessable()->assertJsonValidationErrors('checkin');
    }

    // --- "Ahora no" ------------------------------------------------------------

    public function test_postponing_hides_it_for_a_while_and_gives_up_after_the_limit(): void
    {
        $this->at('2026-10-02 09:00');
        $user = $this->trainee();
        $id = $this->current($user)->json('data.checkin.id');

        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/postpone")->assertOk()->assertJsonPath('data.checkin.status', 'postponed');
        $this->current($user)->assertJsonPath('data.should_prompt', false);

        $this->at('2026-10-03 10:00'); // pasaron 24 h
        $this->current($user)->assertJsonPath('data.should_prompt', true);

        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/postpone")->assertOk()->assertJsonPath('data.checkin.status', 'dismissed');
        $this->at('2026-10-04 20:00');
        $this->current($user)->assertJsonPath('data.should_prompt', false);

        // Aunque lo haya pospuesto, puede responderlo después desde Soporte.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'neutral', 'topic' => 'none'])->assertOk();
    }

    // --- Cambio de mes y de año ------------------------------------------------

    public function test_month_and_year_changes_use_iso_weeks(): void
    {
        $user = $this->trainee();

        $this->at('2026-10-30 09:00');
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W44');
        $this->at('2026-11-06 09:00');
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W45');
        $this->at('2027-01-01 09:00');
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W53');
        $this->at('2027-01-08 09:00');
        $this->current($user)->assertJsonPath('data.checkin.week', '2027-W01');

        $this->assertSame(4, WeeklyCheckin::query()->where('user_id', $user->id)->count());
    }

    // --- Avisos -------------------------------------------------------------------

    public function test_reminder_command_notifies_each_eligible_user_once_per_week(): void
    {
        Notification::fake();
        $this->at('2026-10-02 17:00');
        $user = $this->trainee();
        $answered = $this->trainee();
        $newUser = $this->trainee(['created_at' => now()]);
        $banned = $this->trainee(['is_banned' => true]);
        WeeklyCheckin::query()->create(['user_id' => $answered->id, 'week' => '2026-W40', 'status' => 'answered', 'answered_at' => now()]);

        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();
        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();

        Notification::assertSentToTimes($user, WeeklyCheckinAvailableNotification::class, 1);
        Notification::assertNotSentTo([$answered, $newUser, $banned], WeeklyCheckinAvailableNotification::class);
        $this->assertNotNull(WeeklyCheckin::query()->where('user_id', $user->id)->first()->notified_at);
    }

    public function test_reminder_command_does_nothing_before_friday(): void
    {
        Notification::fake();
        $this->at('2026-09-30 17:00');
        $this->trainee();

        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();

        Notification::assertNothingSent();
        $this->assertDatabaseCount('weekly_checkins', 0);
    }

    public function test_users_without_push_still_get_it_in_the_feed_but_no_push(): void
    {
        $this->at('2026-10-02 17:00');
        $withoutPush = $this->trainee();
        $withPush = $this->trainee();
        PushDeviceToken::query()->create(['user_id' => $withPush->id, 'token' => 'ExponentPushToken[x]']);

        $checkin = WeeklyCheckin::query()->create(['user_id' => $withoutPush->id, 'week' => '2026-W40', 'status' => 'pending']);
        $notification = new WeeklyCheckinAvailableNotification($checkin);

        $this->assertNotContains(ExpoPushChannel::class, $notification->via($withoutPush));
        $this->assertContains('database', $notification->via($withoutPush));
        $this->assertContains(ExpoPushChannel::class, $notification->via($withPush));
        $this->assertSame('/soporte/check-in', $notification->toArray($withoutPush)['link']);
    }

    public function test_check_in_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/support/check-ins/current')->assertUnauthorized();
        $this->postJson('/api/v1/support/check-ins/1/answer')->assertUnauthorized();
    }
}
