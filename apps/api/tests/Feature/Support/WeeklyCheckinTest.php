<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Support.

namespace Tests\Feature\Support;

// Esta línea sirve para importar el modelo OnboardingResponse.
use App\Models\OnboardingResponse;
// Esta línea sirve para importar el modelo PushDeviceToken.
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo SupportTicket.
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WeeklyCheckin.
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase ExpoPushChannel.
use App\Notifications\Channels\ExpoPushChannel;
// Esta línea sirve para importar la clase NewSupportActivityNotification.
use App\Notifications\NewSupportActivityNotification;
// Esta línea sirve para importar la clase WeeklyCheckinAvailableNotification.
use App\Notifications\WeeklyCheckinAvailableNotification;
// Esta línea sirve para importar la clase CarbonImmutable.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Fechas de referencia (hora de Colombia, UTC-5):
 * - lunes 2026-09-28 … domingo 2026-10-04 = semana 2026-W40.
 * - viernes 2027-01-01 cae en la semana ISO 2026-W53 (cambio de año).
 */
// Esta línea sirve para declarar la clase de tests WeeklyCheckinTest.
class WeeklyCheckinTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que fija la hora en zona de Bogotá.
    private function at(string $bogotaDateTime): void
    {
        // Esta línea sirve para viajar a la fecha indicada en hora de Bogotá.
        $this->travelTo(CarbonImmutable::parse($bogotaDateTime, 'America/Bogota'));
    }

    // Esta línea sirve para declarar el método auxiliar que crea un usuario elegible.
    private function trainee(array $attributes = []): User
    {
        // Esta línea sirve para crear un usuario de hace un mes.
        $user = User::factory()->create(['created_at' => now()->subMonth(), ...$attributes]);
        // Esta línea sirve para crear sus respuestas de onboarding completas.
        OnboardingResponse::query()->create(['user_id' => $user->id, 'completed' => true, 'completed_at' => now()->subMonth()]);

        // Esta línea sirve para devolver el usuario.
        return $user;
    }

    // Esta línea sirve para declarar el método auxiliar que pide el check-in actual.
    private function current(User $user)
    {
        // Esta línea sirve para pedir el check-in actual y exigir 200.
        return $this->actingAs($user)->getJson('/api/v1/support/check-ins/current')->assertOk();
    }

    // --- Cuándo se ofrece ----------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que no se ofrece antes del viernes.
    public function test_it_is_not_offered_before_friday(): void
    {
        // Esta línea sirve para fijar la fecha en un jueves.
        $this->at('2026-10-01 20:00'); // jueves
        // Esta línea sirve para exigir que no haya check-in ni aviso.
        $this->current($this->trainee())->assertJsonPath('data.checkin', null)->assertJsonPath('data.should_prompt', false);
        // Esta línea sirve para exigir que la tabla weekly_checkins tenga 0 registros.
        $this->assertDatabaseCount('weekly_checkins', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que se genera el viernes una sola vez por semana.
    public function test_it_is_generated_on_friday_once_per_week_no_matter_how_often_the_app_opens(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00'); // viernes
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();

        // Esta línea sirve para exigir que se genere el check-in de la semana y se pida mostrarlo.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40')->assertJsonPath('data.should_prompt', true);
        // Esta línea sirve para pedirlo otra vez y exigir la misma semana.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40');
        // Esta línea sirve para fijar la fecha en el domingo de la misma semana.
        $this->at('2026-10-04 21:00'); // domingo, misma semana
        // Esta línea sirve para pedirlo otra vez y exigir la misma semana.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W40');

        // Esta línea sirve para exigir que exista un solo check-in.
        $this->assertSame(1, WeeklyCheckin::query()->where('user_id', $user->id)->count());
        // Esta línea sirve para exigir que se haya registrado cuándo se mostró.
        $this->assertNotNull(WeeklyCheckin::query()->first()->shown_at);
    }

    // Esta línea sirve para declarar el test que comprueba que la semana se calcula en hora colombiana.
    public function test_week_is_computed_in_colombian_time(): void
    {
        // Lunes 03:00 UTC = domingo 22:00 en Bogotá: sigue siendo la semana W40.
        // Esta línea sirve para fijar la fecha en UTC a las 03:00 del lunes.
        $this->travelTo(CarbonImmutable::parse('2026-10-05 03:00', 'UTC'));
        // Esta línea sirve para exigir que aún sea la semana anterior en Colombia.
        $this->current($this->trainee())->assertJsonPath('data.checkin.week', '2026-W40');
    }

    // Esta línea sirve para declarar el test que comprueba que no se pregunta a cuentas nuevas ni sin onboarding.
    public function test_new_accounts_and_accounts_without_onboarding_are_not_asked(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario con cuenta de un día.
        $brandNew = $this->trainee(['created_at' => now()->subDay()]);
        // Esta línea sirve para crear un usuario sin onboarding.
        $noOnboarding = User::factory()->create(['created_at' => now()->subMonth()]);

        // Esta línea sirve para exigir que no haya check-in para la cuenta nueva.
        $this->current($brandNew)->assertJsonPath('data.checkin', null);
        // Esta línea sirve para exigir que no haya check-in para quien no tiene onboarding.
        $this->current($noOnboarding)->assertJsonPath('data.checkin', null);
    }

    // Esta línea sirve para declarar el test que comprueba que el equipo de soporte no es consultado pero los entrenadores sí.
    public function test_the_support_team_is_not_asked_but_trainers_are(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');

        // Esta línea sirve para exigir que el super admin no tenga check-in.
        $this->current($this->trainee(['role' => 'super_admin']))->assertJsonPath('data.checkin', null);
        // Esta línea sirve para exigir que el entrenador sí tenga check-in.
        $this->current($this->trainee(['role' => 'trainer']))->assertJsonPath('data.checkin.week', '2026-W40');
    }

    // Esta línea sirve para declarar el test que comprueba que se guarda el contexto de entrenamiento de la semana.
    public function test_it_stores_the_weeks_training_context_including_users_who_did_not_train(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario activo.
        $active = $this->trainee();
        // Esta línea sirve para crear un usuario inactivo.
        $idle = $this->trainee();
        // Esta línea sirve para recorrer tres fechas de esta semana.
        foreach (['2026-09-28', '2026-09-30', '2026-10-01'] as $date) {
            // Esta línea sirve para registrar una sesión completada en esa fecha.
            WorkoutSession::query()->create(['user_id' => $active->id, 'performed_at' => $date, 'completed' => true]);
        }
        // Sesión de la semana anterior: no cuenta.
        // Esta línea sirve para registrar una sesión de la semana anterior.
        WorkoutSession::query()->create(['user_id' => $active->id, 'performed_at' => '2026-09-27', 'completed' => true]);

        // Esta línea sirve para pedir el check-in del usuario activo.
        $this->current($active);
        // Esta línea sirve para pedir el check-in del usuario inactivo.
        $this->current($idle);

        // Esta línea sirve para exigir que el activo tenga 3 sesiones esta semana.
        $this->assertSame(3, WeeklyCheckin::query()->where('user_id', $active->id)->first()->context['sessions_completed_this_week']);
        // Esta línea sirve para exigir que el inactivo tenga 0.
        $this->assertSame(0, WeeklyCheckin::query()->where('user_id', $idle->id)->first()->context['sessions_completed_this_week']);
    }

    // --- Responder -----------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que responder "todo bien" guarda la respuesta sin crear solicitud.
    public function test_answering_all_good_stores_the_answer_without_creating_a_ticket(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para pedir el check-in y guardar su id.
        $id = $this->current($user)->json('data.checkin.id');

        // Esta línea sirve para responder con ánimo "great" y tema "none".
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'great', 'topic' => 'none'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.checkin.status" sea 'answered'.
            ->assertJsonPath('data.checkin.status', 'answered')
            // Esta línea sirve para exigir que "data.ticket" sea null.
            ->assertJsonPath('data.ticket', null);

        // Esta línea sirve para exigir que ya no se pida mostrarlo.
        $this->current($user)->assertJsonPath('data.should_prompt', false);
        // Esta línea sirve para exigir que la tabla support_tickets tenga 0 registros.
        $this->assertDatabaseCount('support_tickets', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que un comentario se convierte en solicitud con el contexto de la semana.
    public function test_a_comment_becomes_a_support_ticket_with_the_weeks_context(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para pedir el check-in y guardar su id.
        $id = $this->current($user)->json('data.checkin.id');

        // Esta línea sirve para responder con un comentario.
        $response = $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", [
            // Esta línea sirve para asignar 'not_good' al campo "mood".
            'mood' => 'not_good',
            // Esta línea sirve para asignar 'observation' al campo "topic".
            'topic' => 'observation',
            // Esta línea sirve para asignar 'Siento que las rutinas están demasiado pesadas para mí.' al campo "comment".
            'comment' => 'Siento que las rutinas están demasiado pesadas para mí.',
            // Esta línea sirve para cerrar los datos y exigir 200.
        ])->assertOk();

        // Esta línea sirve para buscar la solicitud creada.
        $ticket = SupportTicket::query()->findOrFail($response->json('data.ticket.id'));
        // Esta línea sirve para exigir que "type" sea exactamente 'observation'.
        $this->assertSame('observation', $ticket->type);
        // Esta línea sirve para exigir que "source" sea exactamente 'weekly_checkin'.
        $this->assertSame('weekly_checkin', $ticket->source);
        // Esta línea sirve para exigir que "weekly_checkin_id" sea exactamente $id.
        $this->assertSame($id, $ticket->weekly_checkin_id);
        // Esta línea sirve para exigir que el contexto de la solicitud sea el esperado.
        $this->assertSame(['week' => '2026-W40', 'mood' => 'not_good', 'topic' => 'observation', 'routine_id' => null, 'sessions_completed_this_week' => 0], $ticket->context);
        // Esta línea sirve para exigir que el primer mensaje sea el comentario.
        $this->assertSame('Siento que las rutinas están demasiado pesadas para mí.', $ticket->messages()->first()->body);
        // Esta línea sirve para exigir que se le haya enviado la notificación NewSupportActivityNotification.
        Notification::assertSentTo($admin, NewSupportActivityNotification::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el comentario es obligatorio si el usuario quiere contar algo.
    public function test_a_comment_is_required_when_the_user_wants_to_tell_something(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para pedir el check-in y guardar su id.
        $id = $this->current($user)->json('data.checkin.id');

        // Esta línea sirve para responder con un tema sin comentario.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'bad', 'topic' => 'complaint'])
            // Esta línea sirve para exigir 422 con error en el comentario.
            ->assertUnprocessable()->assertJsonValidationErrors('comment');
        // Esta línea sirve para responder con un ánimo inválido.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'sad', 'topic' => 'none'])
            // Esta línea sirve para exigir 422 con error en el ánimo.
            ->assertUnprocessable()->assertJsonValidationErrors('mood');
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede responder dos veces, ni otra persona, ni tras terminar la semana.
    public function test_it_cannot_be_answered_twice_by_someone_else_or_after_the_week_ends(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para pedir el check-in y guardar su id.
        $id = $this->current($user)->json('data.checkin.id');

        // Esta línea sirve para intentar responder como otro usuario y exigir 404.
        $this->actingAs($this->trainee())->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'good', 'topic' => 'none'])->assertNotFound();

        // Esta línea sirve para fijar la fecha en el lunes siguiente.
        $this->at('2026-10-05 09:00'); // lunes siguiente
        // Esta línea sirve para intentar responder fuera de la semana.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'good', 'topic' => 'none'])
            // Esta línea sirve para exigir 422 con error en el check-in.
            ->assertUnprocessable()->assertJsonValidationErrors('checkin');

        // Esta línea sirve para fijar la fecha en el viernes siguiente.
        $this->at('2026-10-09 09:00'); // viernes siguiente: check-in nuevo
        // Esta línea sirve para pedir el check-in nuevo y guardar su id.
        $newId = $this->current($user)->assertJsonPath('data.checkin.week', '2026-W41')->json('data.checkin.id');
        // Esta línea sirve para responderlo y exigir 200.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$newId}/answer", ['mood' => 'good', 'topic' => 'none'])->assertOk();
        // Esta línea sirve para intentar responderlo otra vez.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$newId}/answer", ['mood' => 'bad', 'topic' => 'none'])
            // Esta línea sirve para exigir 422 con error en el check-in.
            ->assertUnprocessable()->assertJsonValidationErrors('checkin');
    }

    // --- "Ahora no" ------------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que posponer lo oculta un rato y se rinde al llegar al límite.
    public function test_postponing_hides_it_for_a_while_and_gives_up_after_the_limit(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 09:00');
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para pedir el check-in y guardar su id.
        $id = $this->current($user)->json('data.checkin.id');

        // Esta línea sirve para posponerlo y exigir estado "postponed".
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/postpone")->assertOk()->assertJsonPath('data.checkin.status', 'postponed');
        // Esta línea sirve para exigir que no se pida mostrarlo.
        $this->current($user)->assertJsonPath('data.should_prompt', false);

        // Esta línea sirve para fijar la fecha 24 horas después.
        $this->at('2026-10-03 10:00'); // pasaron 24 h
        // Esta línea sirve para exigir que se pida mostrarlo otra vez.
        $this->current($user)->assertJsonPath('data.should_prompt', true);

        // Esta línea sirve para posponerlo otra vez y exigir estado "dismissed".
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/postpone")->assertOk()->assertJsonPath('data.checkin.status', 'dismissed');
        // Esta línea sirve para fijar la fecha en el domingo.
        $this->at('2026-10-04 20:00');
        // Esta línea sirve para exigir que no se pida mostrarlo.
        $this->current($user)->assertJsonPath('data.should_prompt', false);

        // Aunque lo haya pospuesto, puede responderlo después desde Soporte.
        // Esta línea sirve para exigir que aún se pueda responder.
        $this->actingAs($user)->postJson("/api/v1/support/check-ins/{$id}/answer", ['mood' => 'neutral', 'topic' => 'none'])->assertOk();
    }

    // --- Cambio de mes y de año ------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que los cambios de mes y de año usan semanas ISO.
    public function test_month_and_year_changes_use_iso_weeks(): void
    {
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();

        // Esta línea sirve para fijar la fecha al final de octubre.
        $this->at('2026-10-30 09:00');
        // Esta línea sirve para exigir la semana 44.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W44');
        // Esta línea sirve para fijar la fecha a principios de noviembre.
        $this->at('2026-11-06 09:00');
        // Esta línea sirve para exigir la semana 45.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W45');
        // Esta línea sirve para fijar la fecha al 1 de enero de 2027.
        $this->at('2027-01-01 09:00');
        // Esta línea sirve para exigir la semana 53 de 2026.
        $this->current($user)->assertJsonPath('data.checkin.week', '2026-W53');
        // Esta línea sirve para fijar la fecha a la semana siguiente.
        $this->at('2027-01-08 09:00');
        // Esta línea sirve para exigir la semana 1 de 2027.
        $this->current($user)->assertJsonPath('data.checkin.week', '2027-W01');

        // Esta línea sirve para exigir que haya 4 check-ins del usuario.
        $this->assertSame(4, WeeklyCheckin::query()->where('user_id', $user->id)->count());
    }

    // --- Avisos -------------------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que el comando de recordatorios avisa una vez por semana a cada usuario elegible.
    public function test_reminder_command_notifies_each_eligible_user_once_per_week(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para fijar la fecha en un viernes a las 17:00.
        $this->at('2026-10-02 17:00');
        // Esta línea sirve para crear un usuario elegible.
        $user = $this->trainee();
        // Esta línea sirve para crear un usuario que ya respondió.
        $answered = $this->trainee();
        // Esta línea sirve para crear un usuario con cuenta nueva.
        $newUser = $this->trainee(['created_at' => now()]);
        // Esta línea sirve para crear un usuario baneado.
        $banned = $this->trainee(['is_banned' => true]);
        // Esta línea sirve para registrar el check-in respondido.
        WeeklyCheckin::query()->create(['user_id' => $answered->id, 'week' => '2026-W40', 'status' => 'answered', 'answered_at' => now()]);

        // Esta línea sirve para ejecutar el comando y exigir que termine bien.
        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();
        // Esta línea sirve para ejecutarlo otra vez y exigir que termine bien.
        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();

        // Esta línea sirve para exigir que el usuario elegible reciba un solo aviso.
        Notification::assertSentToTimes($user, WeeklyCheckinAvailableNotification::class, 1);
        // Esta línea sirve para exigir que los demás no reciban aviso.
        Notification::assertNotSentTo([$answered, $newUser, $banned], WeeklyCheckinAvailableNotification::class);
        // Esta línea sirve para exigir que el check-in quede marcado como notificado.
        $this->assertNotNull(WeeklyCheckin::query()->where('user_id', $user->id)->first()->notified_at);
    }

    // Esta línea sirve para declarar el test que comprueba que el comando no hace nada antes del viernes.
    public function test_reminder_command_does_nothing_before_friday(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para fijar la fecha en un miércoles.
        $this->at('2026-09-30 17:00');
        // Esta línea sirve para crear un usuario elegible.
        $this->trainee();

        // Esta línea sirve para ejecutar el comando y exigir que termine bien.
        $this->artisan('support:weekly-checkin-reminders')->assertSuccessful();

        // Esta línea sirve para exigir que no se haya enviado ninguna notificación.
        Notification::assertNothingSent();
        // Esta línea sirve para exigir que la tabla weekly_checkins tenga 0 registros.
        $this->assertDatabaseCount('weekly_checkins', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que sin push igual se recibe en el feed pero sin push.
    public function test_users_without_push_still_get_it_in_the_feed_but_no_push(): void
    {
        // Esta línea sirve para fijar la fecha en un viernes.
        $this->at('2026-10-02 17:00');
        // Esta línea sirve para crear un usuario sin push.
        $withoutPush = $this->trainee();
        // Esta línea sirve para crear un usuario con push.
        $withPush = $this->trainee();
        // Esta línea sirve para registrar un token de Expo para el segundo.
        PushDeviceToken::query()->create(['user_id' => $withPush->id, 'token' => 'ExponentPushToken[x]']);

        // Esta línea sirve para crear un check-in pendiente.
        $checkin = WeeklyCheckin::query()->create(['user_id' => $withoutPush->id, 'week' => '2026-W40', 'status' => 'pending']);
        // Esta línea sirve para crear la notificación.
        $notification = new WeeklyCheckinAvailableNotification($checkin);

        // Esta línea sirve para exigir que sin push no se use el canal de Expo.
        $this->assertNotContains(ExpoPushChannel::class, $notification->via($withoutPush));
        // Esta línea sirve para exigir que sí se use la base de datos.
        $this->assertContains('database', $notification->via($withoutPush));
        // Esta línea sirve para exigir que con push sí se use el canal de Expo.
        $this->assertContains(ExpoPushChannel::class, $notification->via($withPush));
        // Esta línea sirve para exigir que el enlace apunte al check-in.
        $this->assertSame('/soporte/check-in', $notification->toArray($withoutPush)['link']);
    }

    // Esta línea sirve para declarar el test que comprueba que los endpoints de check-in exigen sesión.
    public function test_check_in_endpoints_require_authentication(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/support/check-ins/current sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/support/check-ins/current')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/support/check-ins/1/answer sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/support/check-ins/1/answer')->assertUnauthorized();
    }
}
