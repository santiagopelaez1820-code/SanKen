<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Notifications.

namespace Tests\Unit\Notifications;

// Esta línea sirve para importar el modelo ChatConversation.
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo PushDeviceToken.
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExpoPushChannel.
use App\Notifications\Channels\ExpoPushChannel;
// Esta línea sirve para importar la clase NewChatMessageNotification.
use App\Notifications\NewChatMessageNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Http.
use Illuminate\Support\Facades\Http;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ExpoPushChannelTest.
class ExpoPushChannelTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea una notificación de mensaje de chat.
    private function makeMessageNotification(): array
    {
        // Esta línea sirve para crear un entrenador llamado Coach Ana.
        $trainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Ana']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        // Esta línea sirve para crear el mensaje del entrenador.
        $message = $conversation->messages()->create(['sender_id' => $trainer->id, 'body' => 'Hola']);

        // Esta línea sirve para devolver el cliente y la notificación.
        return [$client, new NewChatMessageNotification($message->load('sender'))];
    }

    // Esta línea sirve para declarar el test que comprueba que envía a Expo una vez por cada token registrado.
    public function test_posts_to_expo_for_every_registered_token(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake(['https://exp.host/*' => Http::response(['data' => []], 200)]);

        // Esta línea sirve para crear la notificación del mensaje.
        [$client, $notification] = $this->makeMessageNotification();
        // Esta línea sirve para registrar el primer token del cliente.
        PushDeviceToken::query()->create(['user_id' => $client->id, 'token' => 'ExponentPushToken[a]', 'platform' => 'expo']);
        // Esta línea sirve para registrar el segundo token del cliente.
        PushDeviceToken::query()->create(['user_id' => $client->id, 'token' => 'ExponentPushToken[b]', 'platform' => 'expo']);

        // Esta línea sirve para enviar la notificación por el canal de Expo.
        (new ExpoPushChannel)->send($client, $notification);

        // Esta línea sirve para exigir que se haya enviado una petición con esta condición.
        Http::assertSent(function ($request) {
            // Esta línea sirve para exigir que vaya a la URL de Expo.
            return $request->url() === 'https://exp.host/--/api/v2/push/send'
                // Esta línea sirve para exigir que lleve dos mensajes.
                && count($request->data()) === 2
                // Esta línea sirve para exigir que el primero sea para el primer token.
                && $request->data()[0]['to'] === 'ExponentPushToken[a]'
                // Esta línea sirve para exigir que el título sea el nombre del entrenador.
                && $request->data()[0]['title'] === 'Coach Ana'
                // Esta línea sirve para exigir que el texto sea el del mensaje.
                && $request->data()[0]['body'] === 'Hola';
        });
    }

    // Esta línea sirve para declarar el test que comprueba que no llama a Expo si el usuario no tiene tokens.
    public function test_does_not_call_expo_when_the_user_has_no_registered_tokens(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake();

        // Esta línea sirve para crear la notificación del mensaje.
        [$client, $notification] = $this->makeMessageNotification();

        // Esta línea sirve para enviar la notificación por el canal de Expo.
        (new ExpoPushChannel)->send($client, $notification);

        // Esta línea sirve para exigir que no se haya enviado nada.
        Http::assertNothingSent();
    }
}
