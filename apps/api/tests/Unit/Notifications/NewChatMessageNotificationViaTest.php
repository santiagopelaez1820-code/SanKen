<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Notifications.

namespace Tests\Unit\Notifications;

// Esta línea sirve para importar el modelo ChatConversation.
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo PushDeviceToken.
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo PushSubscription.
use App\Models\PushSubscription;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExpoPushChannel.
use App\Notifications\Channels\ExpoPushChannel;
// Esta línea sirve para importar la clase WebPushChannel.
use App\Notifications\Channels\WebPushChannel;
// Esta línea sirve para importar la clase NewChatMessageNotification.
use App\Notifications\NewChatMessageNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests NewChatMessageNotificationViaTest.
class NewChatMessageNotificationViaTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea la notificación de un mensaje.
    private function makeNotification(User $sender): NewChatMessageNotification
    {
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, un cliente nuevo, el estado activo y la fecha de inicio.
            'trainer_id' => $sender->id, 'client_id' => User::factory()->create()->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        // Esta línea sirve para crear el mensaje.
        $message = $conversation->messages()->create(['sender_id' => $sender->id, 'body' => 'Hola']);

        // Esta línea sirve para devolver la notificación.
        return new NewChatMessageNotification($message->load('sender'));
    }

    // Esta línea sirve para declarar el test que comprueba que siempre incluye base de datos y tiempo real.
    public function test_always_includes_database_and_broadcast(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $sender = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $recipient = User::factory()->create();

        // Esta línea sirve para obtener los canales de la notificación.
        $channels = $this->makeNotification($sender)->via($recipient);

        // Esta línea sirve para exigir el canal de base de datos.
        $this->assertContains('database', $channels);
        // Esta línea sirve para exigir el canal de tiempo real.
        $this->assertContains('broadcast', $channels);
        // Esta línea sirve para exigir que no incluya Expo.
        $this->assertNotContains(ExpoPushChannel::class, $channels);
        // Esta línea sirve para exigir que no incluya Web Push.
        $this->assertNotContains(WebPushChannel::class, $channels);
    }

    // Esta línea sirve para declarar el test que comprueba que Expo se incluye solo si el destinatario tiene un token registrado.
    public function test_includes_expo_push_only_when_the_recipient_has_a_registered_token(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $sender = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $recipient = User::factory()->create();
        // Esta línea sirve para registrar un token de Expo del destinatario.
        PushDeviceToken::query()->create(['user_id' => $recipient->id, 'token' => 'ExponentPushToken[x]', 'platform' => 'expo']);

        // Esta línea sirve para obtener los canales de la notificación.
        $channels = $this->makeNotification($sender)->via($recipient);

        // Esta línea sirve para exigir el canal de Expo.
        $this->assertContains(ExpoPushChannel::class, $channels);
        // Esta línea sirve para exigir que no incluya Web Push.
        $this->assertNotContains(WebPushChannel::class, $channels);
    }

    // Esta línea sirve para declarar el test que comprueba que Web Push se incluye solo si el destinatario tiene una suscripción.
    public function test_includes_web_push_only_when_the_recipient_has_a_subscription(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $sender = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $recipient = User::factory()->create();
        // Esta línea sirve para registrar una suscripción del destinatario.
        PushSubscription::query()->create([
            // Esta línea sirve para asignar el usuario y el endpoint.
            'user_id' => $recipient->id, 'endpoint' => 'https://fcm.googleapis.com/fcm/send/x',
            // Esta línea sirve para asignar la clave pública y el token de autenticación.
            'public_key' => 'pub', 'auth_token' => 'auth',
        ]);

        // Esta línea sirve para obtener los canales de la notificación.
        $channels = $this->makeNotification($sender)->via($recipient);

        // Esta línea sirve para exigir el canal de Web Push.
        $this->assertContains(WebPushChannel::class, $channels);
        // Esta línea sirve para exigir que no incluya Expo.
        $this->assertNotContains(ExpoPushChannel::class, $channels);
    }
}
