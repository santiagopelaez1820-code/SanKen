<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Push.

namespace Tests\Feature\Push;

// Esta línea sirve para importar el modelo PushDeviceToken.
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo PushSubscription.
use App\Models\PushSubscription;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests PushRegistrationTest.
class PushRegistrationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que registrar un token de Expo es idempotente al reinstalar.
    public function test_registering_an_expo_token_is_idempotent_on_reinstall(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar el token y exigir 201.
        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertCreated();
        // Esta línea sirve para registrarlo otra vez y exigir 201.
        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertCreated();

        // Esta línea sirve para exigir que haya un solo token del usuario.
        $this->assertSame(1, PushDeviceToken::query()->where('user_id', $user->id)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que el token de Expo es obligatorio.
    public function test_expo_token_requires_a_value(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/push/expo-token con los datos enviados.
            ->postJson('/api/v1/push/expo-token', [])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede borrar su token de Expo.
    public function test_a_user_can_unregister_their_own_expo_token(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para registrar el token.
        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]']);

        // Esta línea sirve para borrar el token y exigir 204.
        $client->deleteJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertNoContent();

        // Esta línea sirve para exigir que la tabla push_device_tokens no tenga ese registro.
        $this->assertDatabaseMissing('push_device_tokens', ['user_id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que una suscripción web guarda las claves p256dh y auth.
    public function test_registering_a_web_subscription_stores_the_p256dh_and_auth_keys(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/push/web-subscription como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/push/web-subscription', [
            // Esta línea sirve para asignar 'https://fcm.googleapis.com/fcm/send/abc123' al campo "endpoint".
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
            // Esta línea sirve para enviar las claves.
            'keys' => ['p256dh' => 'public-key-value', 'auth' => 'auth-secret-value'],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ])->assertCreated();

        // Esta línea sirve para exigir que la tabla push_subscriptions tenga un registro con estos datos.
        $this->assertDatabaseHas('push_subscriptions', [
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar 'https://fcm.googleapis.com/fcm/send/abc123' al campo "endpoint".
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
            // Esta línea sirve para asignar 'public-key-value' al campo "public_key".
            'public_key' => 'public-key-value',
            // Esta línea sirve para asignar 'auth-secret-value' al campo "auth_token".
            'auth_token' => 'auth-secret-value',
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que volver a suscribirse con el mismo endpoint actualiza las claves.
    public function test_re_subscribing_with_the_same_endpoint_updates_the_keys_instead_of_duplicating(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para definir el endpoint del navegador.
        $endpoint = 'https://fcm.googleapis.com/fcm/send/abc123';

        // Esta línea sirve para registrar la suscripción con claves viejas.
        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'old', 'auth' => 'old']]);
        // Esta línea sirve para registrar la suscripción con claves nuevas.
        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'new', 'auth' => 'new']]);

        // Esta línea sirve para exigir que haya una sola suscripción con ese endpoint.
        $this->assertSame(1, PushSubscription::query()->where('endpoint', $endpoint)->count());
        // Esta línea sirve para exigir que la tabla push_subscriptions tenga ese registro.
        $this->assertDatabaseHas('push_subscriptions', ['endpoint' => $endpoint, 'public_key' => 'new']);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede borrar su suscripción web.
    public function test_a_user_can_unregister_their_web_subscription(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para definir el endpoint del navegador.
        $endpoint = 'https://fcm.googleapis.com/fcm/send/abc123';
        // Esta línea sirve para registrar la suscripción.
        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'a', 'auth' => 'b']]);

        // Esta línea sirve para borrar la suscripción y exigir 204.
        $client->deleteJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint])->assertNoContent();

        // Esta línea sirve para exigir que la tabla push_subscriptions no tenga ese registro.
        $this->assertDatabaseMissing('push_subscriptions', ['endpoint' => $endpoint]);
    }
}
