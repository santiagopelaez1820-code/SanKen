<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Support.

namespace Tests\Feature\Support;

// Esta línea sirve para importar el modelo SupportTicket.
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase NewSupportActivityNotification.
use App\Notifications\NewSupportActivityNotification;
// Esta línea sirve para importar la clase SupportReplyMailNotification.
use App\Notifications\SupportReplyMailNotification;
// Esta línea sirve para importar la clase SupportTicketUpdatedNotification.
use App\Notifications\SupportTicketUpdatedNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests SupportTicketTest.
class SupportTicketTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea una solicitud de soporte.
    private function createTicket(User $user, array $overrides = []): SupportTicket
    {
        // Esta línea sirve para enviar la creación de la solicitud mezclando los datos por defecto.
        $response = $this->actingAs($user)->postJson('/api/v1/support/tickets', array_merge([
            // Esta línea sirve para asignar 'question' al campo "type".
            'type' => 'question',
            // Esta línea sirve para asignar 'No entiendo mi rutina de hoy' al campo "subject".
            'subject' => 'No entiendo mi rutina de hoy',
            // Esta línea sirve para asignar '¿Por qué me aparecen estos ejercicios?' al campo "message".
            'message' => '¿Por qué me aparecen estos ejercicios?',
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides));

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();

        // Esta línea sirve para devolver la solicitud creada desde la base de datos.
        return SupportTicket::query()->findOrFail($response->json('data.id'));
    }

    // --- Usuario ------------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que el usuario crea una solicitud con su primer mensaje.
    public function test_user_creates_a_ticket_with_its_first_message(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para crear la solicitud con estos datos.
        $response = $this->actingAs($user)->postJson('/api/v1/support/tickets', [
            // Esta línea sirve para asignar 'question' al campo "type".
            'type' => 'question',
            // Esta línea sirve para asignar '  No entiendo mi rutina de hoy  ' al campo "subject".
            'subject' => '  No entiendo mi rutina de hoy  ',
            // Esta línea sirve para asignar '¿Por qué me aparecen estos ejercicios?' al campo "message".
            'message' => '¿Por qué me aparecen estos ejercicios?',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.status" sea 'open'.
            ->assertJsonPath('data.status', 'open')
            // Esta línea sirve para exigir que "data.subject" sea 'No entiendo mi rutina de hoy'.
            ->assertJsonPath('data.subject', 'No entiendo mi rutina de hoy')
            // Esta línea sirve para exigir que "data.messages.0.body" sea '¿Por qué me aparecen estos ejercicios?'.
            ->assertJsonPath('data.messages.0.body', '¿Por qué me aparecen estos ejercicios?')
            // Esta línea sirve para exigir que "data.messages.0.is_staff" sea false.
            ->assertJsonPath('data.messages.0.is_staff', false)
            // Lo interno del equipo no se expone al usuario.
            // Esta línea sirve para exigir que la respuesta no incluya "data.priority".
            ->assertJsonMissingPath('data.priority')
            // Esta línea sirve para exigir que la respuesta no incluya "data.assignee".
            ->assertJsonMissingPath('data.assignee');
    }

    // Esta línea sirve para declarar el test que comprueba que los reclamos entran con prioridad alta.
    public function test_complaints_enter_with_high_priority(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear una solicitud de tipo reclamo.
        $ticket = $this->createTicket(User::factory()->create(), ['type' => 'complaint']);

        // Esta línea sirve para exigir que "priority" sea exactamente 'high'.
        $this->assertSame('high', $ticket->priority);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario solo ve sus propias solicitudes.
    public function test_user_sees_only_their_own_tickets(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear una solicitud del dueño.
        $ticket = $this->createTicket($owner);

        // Esta línea sirve para exigir que el dueño vea 1 solicitud.
        $this->actingAs($owner)->getJson('/api/v1/support/tickets')->assertOk()->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que el otro usuario vea 0.
        $this->actingAs($other)->getJson('/api/v1/support/tickets')->assertOk()->assertJsonCount(0, 'data');

        // Esta línea sirve para exigir que el dueño pueda ver su solicitud.
        $this->actingAs($owner)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertOk();
        // Esta línea sirve para exigir que el otro usuario reciba 403.
        $this->actingAs($other)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede escribir ni cerrar la solicitud de otro.
    public function test_user_cannot_write_in_or_close_someone_elses_ticket(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear una solicitud de otro usuario.
        $ticket = $this->createTicket(User::factory()->create());
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();

        // Esta línea sirve para intentar escribir en ella y exigir 403.
        $this->actingAs($intruder)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'hola'])->assertForbidden();
        // Esta línea sirve para intentar cerrarla y exigir 403.
        $this->actingAs($intruder)->postJson("/api/v1/support/tickets/{$ticket->id}/close")->assertForbidden();
        // Esta línea sirve para exigir que siga teniendo un solo mensaje.
        $this->assertSame(1, $ticket->messages()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que un entrenador no puede ver las solicitudes de sus clientes.
    public function test_a_trainer_cannot_see_client_tickets(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear una solicitud de otro usuario.
        $ticket = $this->createTicket(User::factory()->create());
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para intentar verla como entrenador y exigir 403.
        $this->actingAs($trainer)->getJson("/api/v1/support/tickets/{$ticket->id}")->assertForbidden();
        // Esta línea sirve para intentar listar las del panel como entrenador y exigir 403.
        $this->actingAs($trainer)->getJson('/api/v1/admin/support/tickets')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que la validación rechaza tipos inválidos y mensajes vacíos.
    public function test_validation_rejects_invalid_types_and_empty_messages(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para intentar crear una solicitud con tipo inválido y mensaje vacío.
        $this->actingAs($user)->postJson('/api/v1/support/tickets', ['type' => 'hack', 'subject' => 'Hola', 'message' => '   '])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en ['type', 'message'].
            ->assertJsonValidationErrors(['type', 'message']);

        // Esta línea sirve para intentar crear una solicitud con un mensaje demasiado largo.
        $this->actingAs($user)->postJson('/api/v1/support/tickets', ['type' => 'question', 'subject' => 'Hola', 'message' => str_repeat('a', 5001)])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'message'.
            ->assertJsonValidationErrors('message');
    }

    // Esta línea sirve para declarar el test que comprueba que crear solicitudes tiene límite de frecuencia.
    public function test_ticket_creation_is_rate_limited(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para repetir 10 veces.
        for ($i = 0; $i < 10; $i++) {
            // Esta línea sirve para crear una solicitud.
            $this->createTicket($user);
        }

        // Esta línea sirve para intentar crear una más.
        $this->actingAs($user)->postJson('/api/v1/support/tickets', [
            // Esta línea sirve para enviar el tipo, el asunto y el mensaje.
            'type' => 'question', 'subject' => 'Otra más', 'message' => 'Spam spam',
            // Esta línea sirve para cerrar los datos y exigir 429.
        ])->assertStatus(429);
    }

    // Esta línea sirve para declarar el test que comprueba que la respuesta del usuario reabre una solicitud respondida y las cerradas son de solo lectura.
    public function test_user_reply_reopens_an_answered_ticket_and_closed_tickets_are_read_only(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una solicitud.
        $ticket = $this->createTicket($user);
        // Esta línea sirve para marcarla como respondida.
        $ticket->update(['status' => 'answered']);

        // Esta línea sirve para responder como usuario.
        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'Sigo con la duda'])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated()
            // Esta línea sirve para exigir que "data.status" sea 'open'.
            ->assertJsonPath('data.status', 'open')
            // Esta línea sirve para exigir que "data.messages" tenga 2 elementos.
            ->assertJsonCount(2, 'data.messages');

        // Esta línea sirve para cerrar la solicitud y exigir 200 con estado "closed".
        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/close")->assertOk()->assertJsonPath('data.status', 'closed');
        // Esta línea sirve para intentar escribir en la cerrada y exigir 403.
        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'otra'])->assertForbidden();
    }

    // --- Equipo ---------------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que el equipo recibe aviso de solicitudes nuevas y respuestas del usuario.
    public function test_staff_is_notified_of_new_tickets_and_user_replies(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para crear una solicitud de tipo reclamo.
        $ticket = $this->createTicket($user, ['type' => 'complaint']);
        // Esta línea sirve para exigir que el admin reciba la notificación de solicitud creada.
        Notification::assertSentTo($admin, NewSupportActivityNotification::class, fn ($n) => $n->event === 'created'
            // Esta línea sirve para exigir que el título indique prioridad alta.
            && str_contains($n->toArray($admin)['title'], 'Prioridad alta')
            // Esta línea sirve para exigir que no incluya el texto del mensaje.
            && ! str_contains(json_encode($n->toArray($admin)), 'ejercicios')); // nunca el texto del mensaje

        // Esta línea sirve para responder como usuario y exigir 201.
        $this->actingAs($user)->postJson("/api/v1/support/tickets/{$ticket->id}/messages", ['body' => 'Más detalles'])->assertCreated();
        // Esta línea sirve para exigir que el admin reciba la notificación de respuesta del usuario.
        Notification::assertSentTo($admin, NewSupportActivityNotification::class, fn ($n) => $n->event === 'user_replied');
        // Esta línea sirve para exigir que el usuario no reciba la notificación del equipo.
        Notification::assertNotSentTo($user, NewSupportActivityNotification::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el equipo responde y el usuario recibe un solo aviso.
    public function test_staff_can_see_reply_and_the_user_is_notified_once(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una solicitud.
        $ticket = $this->createTicket($user);

        // Esta línea sirve para listar las solicitudes como admin.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.0.id" sea $ticket->id.
            ->assertJsonPath('data.0.id', $ticket->id)
            // Esta línea sirve para exigir que "data.0.user.email" sea $user->email.
            ->assertJsonPath('data.0.user.email', $user->email)
            // Esta línea sirve para exigir que "data.0.priority" sea 'normal'.
            ->assertJsonPath('data.0.priority', 'normal');

        // Esta línea sirve para responder como admin.
        $this->actingAs($admin)->postJson("/api/v1/admin/support/tickets/{$ticket->id}/messages", ['body' => 'Claro, ¿qué parte no entiendes?'])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated()
            // Esta línea sirve para exigir que "data.status" sea 'answered'.
            ->assertJsonPath('data.status', 'answered')
            // Esta línea sirve para exigir que "data.messages.1.is_staff" sea true.
            ->assertJsonPath('data.messages.1.is_staff', true);

        // Esta línea sirve para exigir que en la base de datos "first_response_at" no sea null.
        $this->assertNotNull($ticket->fresh()->first_response_at);
        // Esta línea sirve para exigir un solo aviso en la app.
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);
        // Esta línea sirve para exigir un solo correo.
        Notification::assertSentToTimes($user, SupportReplyMailNotification::class, 1);

        // El usuario ve la respuesta como "Equipo SanKen" (sin el nombre del admin).
        // Esta línea sirve para ver la solicitud como usuario.
        $this->actingAs($user)->getJson("/api/v1/support/tickets/{$ticket->id}")
            // Esta línea sirve para exigir que "data.messages.1.author_name" sea null.
            ->assertJsonPath('data.messages.1.author_name', null)
            // Esta línea sirve para exigir que "data.messages.1.is_staff" sea true.
            ->assertJsonPath('data.messages.1.is_staff', true);
    }

    // Esta línea sirve para declarar el test que comprueba que el equipo cambia estado, prioridad y responsable.
    public function test_staff_changes_status_priority_and_assignee(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una solicitud.
        $ticket = $this->createTicket($user);

        // Esta línea sirve para editar la solicitud como admin.
        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", [
            // Esta línea sirve para enviar estado, prioridad y responsable.
            'status' => 'in_review', 'priority' => 'urgent', 'assigned_to' => $admin->id,
            // Esta línea sirve para exigir 200.
        ])->assertOk()
            // Esta línea sirve para exigir que "data.status" sea 'in_review'.
            ->assertJsonPath('data.status', 'in_review')
            // Esta línea sirve para exigir que "data.priority" sea 'urgent'.
            ->assertJsonPath('data.priority', 'urgent')
            // Esta línea sirve para exigir que "data.assignee.id" sea $admin->id.
            ->assertJsonPath('data.assignee.id', $admin->id);

        // "En revisión" no notifica al usuario; "resuelta" sí.
        // Esta línea sirve para exigir que el usuario no reciba aviso por estos cambios.
        Notification::assertNotSentTo($user, SupportTicketUpdatedNotification::class);

        // Esta línea sirve para marcarla como resuelta como admin y exigir 200.
        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['status' => 'resolved'])->assertOk();
        // Esta línea sirve para exigir que en la base de datos "resolved_at" no sea null.
        $this->assertNotNull($ticket->fresh()->resolved_at);
        // Esta línea sirve para exigir que el usuario reciba un solo aviso.
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);

        // Mismo estado otra vez → sin notificación duplicada.
        // Esta línea sirve para marcarla como resuelta otra vez y exigir 200.
        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['status' => 'resolved'])->assertOk();
        // Esta línea sirve para exigir que el usuario siga con un solo aviso.
        Notification::assertSentToTimes($user, SupportTicketUpdatedNotification::class, 1);
    }

    // Esta línea sirve para declarar el test que comprueba que las solicitudes solo se asignan al equipo.
    public function test_tickets_can_only_be_assigned_to_staff(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una solicitud.
        $ticket = $this->createTicket(User::factory()->create());
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para intentar asignarla a un entrenador.
        $this->actingAs($admin)->patchJson("/api/v1/admin/support/tickets/{$ticket->id}", ['assigned_to' => $trainer->id])
            // Esta línea sirve para exigir 422 con error en el responsable.
            ->assertUnprocessable()->assertJsonValidationErrors('assigned_to');
    }

    // Esta línea sirve para declarar el test que comprueba los filtros y la búsqueda del admin.
    public function test_admin_filters_and_search(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear la usuaria Ana.
        $ana = User::factory()->create(['name' => 'Ana Gómez']);
        // Esta línea sirve para crear el usuario Luis.
        $luis = User::factory()->create(['name' => 'Luis']);
        // Esta línea sirve para crear un reclamo de Ana.
        $this->createTicket($ana, ['type' => 'complaint', 'subject' => 'Cobro repetido']);
        // Esta línea sirve para crear una sugerencia de Luis.
        $this->createTicket($luis, ['type' => 'suggestion', 'subject' => 'Modo oscuro', 'message' => 'Agreguen más ejercicios de core']);

        // Esta línea sirve para filtrar por tipo reclamo.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?type=complaint')->assertJsonCount(1, 'data')->assertJsonPath('data.0.subject', 'Cobro repetido');
        // Esta línea sirve para filtrar por usuario Ana.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?user=Ana')->assertJsonCount(1, 'data');
        // Esta línea sirve para buscar por la palabra "core".
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?q=core')->assertJsonCount(1, 'data')->assertJsonPath('data.0.subject', 'Modo oscuro');
        // Esta línea sirve para filtrar las que esperan respuesta.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?status=awaiting')->assertJsonCount(2, 'data');
        // Esta línea sirve para filtrar por un rango de fechas sin solicitudes.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/tickets?from=2000-01-01&to=2000-01-02')->assertJsonCount(0, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que los endpoints del admin están protegidos.
    public function test_admin_endpoints_are_protected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Sin sesión (antes de actingAs, que persiste en el resto del test).
        // Esta línea sirve para hacer la petición a /api/v1/admin/support/tickets sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/admin/support/tickets')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/support/tickets sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/support/tickets')->assertUnauthorized();

        // Esta línea sirve para intentar listar las solicitudes y exigir 403.
        $this->actingAs($user)->getJson('/api/v1/admin/support/tickets')->assertForbidden();
        // Esta línea sirve para intentar ver las métricas y exigir 403.
        $this->actingAs($user)->getJson('/api/v1/admin/support/stats')->assertForbidden();
        // Esta línea sirve para intentar ver el equipo y exigir 403.
        $this->actingAs($user)->getJson('/api/v1/admin/support/staff')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que las métricas reflejan datos reales.
    public function test_stats_reflect_real_data(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir las métricas.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/stats')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.tickets.total" sea 0.
            ->assertJsonPath('data.tickets.total', 0)
            // Esta línea sirve para exigir que "data.tickets.avg_first_response_hours" sea null.
            ->assertJsonPath('data.tickets.avg_first_response_hours', null);

        // Esta línea sirve para crear una solicitud.
        $a = $this->createTicket($user);
        // Esta línea sirve para crear un reclamo.
        $this->createTicket($user, ['type' => 'complaint']);
        // Esta línea sirve para responder la primera como admin y exigir 201.
        $this->actingAs($admin)->postJson("/api/v1/admin/support/tickets/{$a->id}/messages", ['body' => 'Respuesta'])->assertCreated();

        // Esta línea sirve para pedir las métricas otra vez.
        $this->actingAs($admin)->getJson('/api/v1/admin/support/stats')
            // Esta línea sirve para exigir que "data.tickets.total" sea 2.
            ->assertJsonPath('data.tickets.total', 2)
            // Esta línea sirve para exigir que "data.tickets.open" sea 1.
            ->assertJsonPath('data.tickets.open', 1)
            // Esta línea sirve para exigir que "data.tickets.answered" sea 1.
            ->assertJsonPath('data.tickets.answered', 1)
            // Esta línea sirve para exigir que "data.tickets.awaiting_staff" sea 1.
            ->assertJsonPath('data.tickets.awaiting_staff', 1)
            // Esta línea sirve para exigir que "data.tickets.this_week" sea 2.
            ->assertJsonPath('data.tickets.this_week', 2)
            // Esta línea sirve para exigir que "data.tickets.by_type.complaint" sea 1.
            ->assertJsonPath('data.tickets.by_type.complaint', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que borrar la cuenta borra sus solicitudes.
    public function test_deleting_the_account_deletes_its_tickets(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de correo y contraseña.
        $user = User::factory()->create(['password' => 'Password!234', 'auth_provider' => null]);
        // Esta línea sirve para crear una solicitud.
        $ticket = $this->createTicket($user);

        // Esta línea sirve para eliminar la cuenta y exigir 200.
        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])->assertOk();

        // Esta línea sirve para exigir que la tabla support_tickets no tenga ese registro.
        $this->assertDatabaseMissing('support_tickets', ['id' => $ticket->id]);
        // Esta línea sirve para exigir que la tabla support_ticket_messages no tenga ese registro.
        $this->assertDatabaseMissing('support_ticket_messages', ['support_ticket_id' => $ticket->id]);
    }
}
