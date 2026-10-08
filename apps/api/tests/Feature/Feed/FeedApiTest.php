<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Feed.

namespace Tests\Feature\Feed;

// Esta línea sirve para importar el modelo ChatConversation.
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo NewsPromotion.
use App\Models\NewsPromotion;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests FeedApiTest.
class FeedApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que envía un mensaje de chat y devuelve al cliente.
    private function sendOneChatMessage(): User
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);

        // Esta línea sirve para devolver al cliente.
        return $client;
    }

    // Esta línea sirve para declarar el test que comprueba que las peticiones sin sesión se rechazan.
    public function test_unauthenticated_requests_are_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/feed sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/feed')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/feed/news/1/read sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/feed/news/1/read')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/feed/read-all sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/feed/read-all')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el feed une las novedades publicadas y las notificaciones del usuario.
    public function test_feed_merges_published_news_and_the_users_own_notifications(): void
    {
        // Esta línea sirve para enviar un mensaje de chat (genera una notificación).
        $client = $this->sendOneChatMessage();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una novedad en borrador.
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null]);
        // Esta línea sirve para crear una novedad publicada.
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Publicada', 'body' => 'x', 'published_at' => now()]);

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como client.
        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir 2 elementos: la novedad publicada y la notificación (no el borrador).
        $response->assertJsonCount(2, 'data'); // la novedad publicada + la notificacion de chat, no el borrador
        // Esta línea sirve para exigir que "meta.unread_count" sea 2.
        $response->assertJsonPath('meta.unread_count', 2);
        // Esta línea sirve para obtener los tipos de los elementos ordenados.
        $types = collect($response->json('data'))->pluck('feed_type')->sort()->values();
        // Esta línea sirve para exigir que sean una novedad y una notificación.
        $this->assertSame(['news', 'notification'], $types->all());
    }

    // Esta línea sirve para declarar el test que comprueba que el feed ordena por fecha descendente.
    public function test_feed_items_are_sorted_by_date_descending(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una novedad vieja (hace 3 días).
        NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Vieja', 'body' => 'x', 'published_at' => now()->subDays(3)]);
        // Esta línea sirve para crear una novedad nueva.
        NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Nueva', 'body' => 'x', 'published_at' => now()]);

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/feed');

        // Esta línea sirve para exigir que "data.0.title" sea 'Nueva'.
        $response->assertJsonPath('data.0.title', 'Nueva');
        // Esta línea sirve para exigir que "data.1.title" sea 'Vieja'.
        $response->assertJsonPath('data.1.title', 'Vieja');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario solo ve sus propias notificaciones.
    public function test_a_user_only_sees_their_own_notifications_in_the_feed(): void
    {
        // Esta línea sirve para enviar un mensaje de chat al cliente.
        $client = $this->sendOneChatMessage();
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como stranger.
        $response = $this->actingAs($stranger, 'sanctum')->getJson('/api/v1/feed');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $response->assertJsonCount(0, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que marcar una novedad como leída actualiza su fecha y el contador.
    public function test_marking_a_news_item_read_updates_its_read_at_and_the_unread_count(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una novedad publicada.
        $news = NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para marcarla como leída y exigir 204.
        $client->postJson("/api/v1/feed/news/{$news->id}/read")->assertNoContent();

        // Esta línea sirve para pedir el feed.
        $response = $client->getJson('/api/v1/feed');
        // Esta línea sirve para exigir que "meta.unread_count" sea 0.
        $response->assertJsonPath('meta.unread_count', 0);
        // Esta línea sirve para exigir que "data.0.read_at" sea fn ($value) => $value !== null.
        $response->assertJsonPath('data.0.read_at', fn ($value) => $value !== null);
    }

    // Esta línea sirve para declarar el test que comprueba que marcar como leída es por usuario.
    public function test_marking_a_news_item_read_is_scoped_per_user(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una novedad publicada.
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);
        // Esta línea sirve para crear un usuario de prueba.
        $reader = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/feed/news/{$news->id}/read como reader y exigir que responda 204.
        $this->actingAs($reader, 'sanctum')->postJson("/api/v1/feed/news/{$news->id}/read")->assertNoContent();

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como other.
        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/feed');
        // Esta línea sirve para exigir que "meta.unread_count" sea 1.
        $response->assertJsonPath('meta.unread_count', 1);
        // Esta línea sirve para exigir que "data.0.read_at" sea null.
        $this->assertNull($response->json('data.0.read_at'));
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede marcar como leída una novedad sin publicar.
    public function test_marking_an_unpublished_news_item_read_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una novedad en borrador.
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para intentar marcarla como leída y exigir 404.
        $this->actingAs($user, 'sanctum')->postJson("/api/v1/feed/news/{$news->id}/read")->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que marcar una notificación como leída actualiza su fecha.
    public function test_marking_a_notification_read_updates_read_at(): void
    {
        // Esta línea sirve para enviar un mensaje de chat al cliente.
        $client = $this->sendOneChatMessage();
        // Esta línea sirve para obtener el id de su notificación.
        $notificationId = $client->notifications()->first()->id;

        // Esta línea sirve para preparar la petición autenticada como client.
        $this->actingAs($client, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/feed/notification/{$notificationId}/read.
            ->postJson("/api/v1/feed/notification/{$notificationId}/read")
            // Esta línea sirve para exigir que la respuesta sea 204 (sin contenido).
            ->assertNoContent();

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como client.
        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');
        // Esta línea sirve para exigir que "meta.unread_count" sea 0.
        $response->assertJsonPath('meta.unread_count', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede marcar la notificación de otro.
    public function test_a_user_cannot_mark_someone_elses_notification_read(): void
    {
        // Esta línea sirve para enviar un mensaje de chat al cliente.
        $client = $this->sendOneChatMessage();
        // Esta línea sirve para obtener el id de su notificación.
        $notificationId = $client->notifications()->first()->id;
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como stranger.
        $this->actingAs($stranger, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/feed/notification/{$notificationId}/read.
            ->postJson("/api/v1/feed/notification/{$notificationId}/read")
            // Esta línea sirve para exigir que la respuesta sea 404 (no encontrado).
            ->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que un tipo de feed desconocido se rechaza.
    public function test_an_unknown_feed_type_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para intentar marcar como leído un tipo inexistente y exigir 404.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/feed/bogus/1/read')->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que marcar todo como leído limpia novedades y notificaciones.
    public function test_mark_all_read_clears_unread_news_and_notifications(): void
    {
        // Esta línea sirve para enviar un mensaje de chat al cliente.
        $client = $this->sendOneChatMessage();
        // Esta línea sirve para crear una novedad publicada.
        NewsPromotion::query()->create(['admin_id' => $client->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);

        // Esta línea sirve para hacer la petición a /api/v1/feed/read-all como client y exigir que responda 204.
        $this->actingAs($client, 'sanctum')->postJson('/api/v1/feed/read-all')->assertNoContent();

        // Esta línea sirve para hacer GET a /api/v1/feed autenticado como client.
        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');
        // Esta línea sirve para exigir que "meta.unread_count" sea 0.
        $response->assertJsonPath('meta.unread_count', 0);
    }
}
