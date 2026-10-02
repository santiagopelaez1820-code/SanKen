<?php

namespace Tests\Feature\Support;

use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\NewSupportActivityNotification;
use App\Notifications\SupportReplyMailNotification;
use App\Notifications\SupportTicketUpdatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SupportTicketTest extends TestCase
{
    use RefreshDatabase;

    private function createTicket(User $user, array $overrides = []): SupportTicket
    {
        $response = $this->actingAs($user)->postJson('/api/v1/support/tickets', array_merge([
            'type' => 'question',
            'subject' => 'No entiendo mi rutina de hoy',
            'message' => '¿Por qué me aparecen estos ejercicios?',
        ], $overrides));

        $response->assertCreated();

        return SupportTicket::query()->findOrFail($response->json('data.id'));
    }

    // --- Usuario ------------------------------------------------------------

    public function test_user_creates_a_ticket_with_its_first_message(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/support/tickets', [
            'type' => 'question',
            'subject' => '  No entiendo mi rutina de hoy  ',
            'message' => '¿Por qué me aparecen estos ejercicios?',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'open')
            ->assertJsonPath('data.subject', 'No entiendo mi rutina de hoy')
            ->assertJsonPath('data.messages.0.body', '¿Por qué me aparecen estos ejercicios?')
            ->assertJsonPath('data.messages.0.is_staff', false)
            // Lo interno del equipo no se expone al usuario.
            ->assertJsonMissingPath('data.priority')
            ->assertJsonMissingPath('data.assignee');
    }

    public function test_complaints_enter_with_high_priority(): void
    {
        Notification::fake();
        $ticket = $this->createTicket(User::factory()->create(), ['type' => 'complaint']);

        $this->assertSame('high', $ticket->priority);
    }

    public function test_user_sees_only_their_own_tickets(): void
    {
        Notification::fake();
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $ticket = $this->createTicket($owner);

        $this->actingAs($owner)->getJson('/api/v1/support/tickets')->assertOk()->assertJsonCount(1, 'data');
        $this->actingAs($other)->getJson('/api/v1/support/tickets')->assertOk()->assertJsonCount(0, 'data');

        $this->actingAs($owner)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertOk();
        $this->actingAs($other)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertForbidden();
    }

    public function test_user_cannot_write_in_or_close_someone_elses_ticket(): void
    {
        Notification::fake();
        $ticket = $this->createTicket(User::factory()->create());
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'hola'])->assertForbidden();
        $this->actingAs($intruder)->postJson("/api/v1/support/tickets/{$ticket->id}/close")->assertForbidden();
        $this->assertSame(1, $ticket->messages()->count());
    }

    public function test_a_trainer_cannot_see_client_tickets(): void
    {
        Notification::fake();
        $ticket = $this->createTicket(User::factory()->create());
        $trainer = User::factory()->create(['role' => 'trainer']);

        $this->actingAs($trainer)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertForbidden();
        $this->actingAs($trainer)->getJson('/api/v1/admin/support/tickets')->assertForbidden();
    }

    public function test_validation_rejects_invalid_types_and_empty_messages(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/support/tickets', ['type' => 'hack', 'subject' => 'Hola', 'message' => '   '])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type', 'message']);

        $this->actingAs($user)->postJson('/api/v1/support/tickets', ['type' => 'question', 'subject' => 'Hola', 'message' => str_repeat('a', 5001)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('message');
    }

    public function test_ticket_creation_is_rate_limited(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        for ($i = 0; $i < 10; $i++) {
            $this->createTicket($user);
        }

        $this->actingAs($user)->postJson('/api/v1/support/tickets', [
            'type' => 'question', 'subject' => 'Otra más', 'message' => 'Spam spam',
        ])->assertStatus(429);
    }

    public function test_user_reply_reopens_an_answered_ticket_and_closed_tickets_are_read_only(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $ticket = $this->createTicket($user);
        $ticket->update(['status' => 'answered']);

        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'Sigo con la duda'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'open')
            ->assertJsonCount(2, 'data.messages');

        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/close")->assertOk()->assertJsonPath('data.status', 'closed');
        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'otra'])->assertForbidden();
    }

    // --- Equipo ---------------------------------------------------------------

    public function test_staff_is_notified_of_new_tickets_and_user_replies(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();

        $ticket = $this->createTicket($user, ['type' => 'complaint']);
        Notification::assertSentTo($admin, NewSupportActivityNotification::class, fn ($n) => $n->event === 'created'
            && str_contains($n->toArray($admin)['title'], 'Prioridad alta')
            && ! str_contains(json_encode($n->toArray($admin)), 'ejercicios')); // nunca el texto del mensaje

        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'Más detalles'])->assertCreated();
        Notification::assertSentTo($admin, NewSupportActivityNotification::class, fn ($n) => $n->event === 'user_replied');
        Notification::assertNotSentTo($user, NewSupportActivityNotification::class);
    }

    public function test_staff_can_see_reply_and_the_user_is_notified_once(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $ticket = $this->createTicket($user);

        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets')
            ->assertOk()
            ->assertJsonPath('data.0.id', $ticket->id)
            ->assertJsonPath('data.0.user.email', $user->email)
            ->assertJsonPath('data.0.priority', 'normal');

        $this->actingAs($admin)->postJson("/api/v1/admin/support/tickets/{$ticket->id}/messages", ['body' => 'Claro, ¿qué parte no entiendes?'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'answered')
            ->assertJsonPath('data.messages.1.is_staff', true);

        $this->assertNotNull($ticket->fresh()->first_response_at);
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);
        Notification::assertSentToTimes($user, SupportReplyMailNotification::class, 1);

        // El usuario ve la respuesta como "Equipo SanKen" (sin el nombre del admin).
        $this->actingAs($user)->getJson("/api/v1/support/tickets/{$ticket->id}")
            ->assertJsonPath('data.messages.1.author_name', null)
            ->assertJsonPath('data.messages.1.is_staff', true);
    }

    public function test_staff_changes_status_priority_and_assignee(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $ticket = $this->createTicket($user);

        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", [
            'status' => 'in_review', 'priority' => 'urgent', 'assigned_to' => $admin->id,
        ])->assertOk()
            ->assertJsonPath('data.status', 'in_review')
            ->assertJsonPath('data.priority', 'urgent')
            ->assertJsonPath('data.assignee.id', $admin->id);

        // "En revisión" no notifica al usuario; "resuelta" sí.
        Notification::assertNotSentTo($user, SupportTicketUpdatedNotification::class);

        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['status' => 'resolved'])->assertOk();
        $this->assertNotNull($ticket->fresh()->resolved_at);
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);

        // Mismo estado otra vez → sin notificación duplicada.
        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['status' => 'resolved'])->assertOk();
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);
    }

    public function test_tickets_can_only_be_assigned_to_staff(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $ticket = $this->createTicket(User::factory()->create());
        $trainer = User::factory()->create(['role' => 'trainer']);

        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['assigned_to' => $trainer->id])
            ->assertUnprocessable()->assertJsonValidationErrors('assigned_to');
    }

    public function test_admin_filters_and_search(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $ana = User::factory()->create(['name' => 'Ana Gómez']);
        $luis = User::factory()->create(['name' => 'Luis']);
        $this->createTicket($ana, ['type' => 'complaint', 'subject' => 'Cobro repetido']);
        $this->createTicket($luis, ['type' => 'suggestion', 'subject' => 'Modo oscuro', 'message' => 'Agreguen más ejercicios de core']);

        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?type=complaint')->assertJsonCount(1, 'data')->assertJsonPath('data.0.subject', 'Cobro repetido');
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?user=Ana')->assertJsonCount(1, 'data');
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?q=core')->assertJsonCount(1, 'data')->assertJsonPath('data.0.subject', 'Modo oscuro');
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?status=awaiting')->assertJsonCount(2, 'data');
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?from=2000-01-01&to=2000-01-02')->assertJsonCount(0, 'data');
    }

    public function test_admin_endpoints_are_protected(): void
    {
        $user = User::factory()->create();

        // Sin sesión (antes de actingAs, que persiste en el resto del test).
        $this->getJson('/api/v1/admin/support/tickets')->assertUnauthorized();
        $this->getJson('/api/v1/support/tickets')->assertUnauthorized();

        $this->actingAs($user)->getJson('/api/v1/admin/support/tickets')->assertForbidden();
        $this->actingAs($user)->getJson('/api/v1/admin/support/stats')->assertForbidden();
        $this->actingAs($user)->getJson('/api/v1/admin/support/staff')->assertForbidden();
    }

    public function test_stats_reflect_real_data(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();

        $this->actingAs($admin)->getJson('/api/v1/admin/support/stats')
            ->assertOk()
            ->assertJsonPath('data.tickets.total', 0)
            ->assertJsonPath('data.tickets.avg_first_response_hours', null);

        $a = $this->createTicket($user);
        $this->createTicket($user, ['type' => 'complaint']);
        $this->actingAs($admin)->postJson("/api/v1/admin/support/tickets/{$a->id}/messages", ['body' => 'Respuesta'])->assertCreated();

        $this->actingAs($admin)->getJson('/api/v1/admin/support/stats')
            ->assertJsonPath('data.tickets.total', 2)
            ->assertJsonPath('data.tickets.open', 1)
            ->assertJsonPath('data.tickets.answered', 1)
            ->assertJsonPath('data.tickets.awaiting_staff', 1)
            ->assertJsonPath('data.tickets.this_week', 2)
            ->assertJsonPath('data.tickets.by_type.complaint', 1);
    }

    public function test_deleting_the_account_deletes_its_tickets(): void
    {
        Notification::fake();
        $user = User::factory()->create(['password' => 'Password!234', 'auth_provider' => null]);
        $ticket = $this->createTicket($user);

        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])->assertOk();

        $this->assertDatabaseMissing('support_tickets', ['id' => $ticket->id]);
        $this->assertDatabaseMissing('support_ticket_messages', ['support_ticket_id' => $ticket->id]);
    }
}
