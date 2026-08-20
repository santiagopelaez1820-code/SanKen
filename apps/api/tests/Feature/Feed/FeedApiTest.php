<?php

namespace Tests\Feature\Feed;

use App\Models\ChatConversation;
use App\Models\NewsPromotion;
use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedApiTest extends TestCase
{
    use RefreshDatabase;

    private function sendOneChatMessage(): User
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);

        return $client;
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/v1/feed')->assertUnauthorized();
        $this->postJson('/api/v1/feed/news/1/read')->assertUnauthorized();
        $this->postJson('/api/v1/feed/read-all')->assertUnauthorized();
    }

    public function test_feed_merges_published_news_and_the_users_own_notifications(): void
    {
        $client = $this->sendOneChatMessage();
        $admin = User::factory()->create(['role' => 'super_admin']);
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null]);
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Publicada', 'body' => 'x', 'published_at' => now()]);

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');

        $response->assertOk();
        $response->assertJsonCount(2, 'data'); // la novedad publicada + la notificacion de chat, no el borrador
        $response->assertJsonPath('meta.unread_count', 2);
        $types = collect($response->json('data'))->pluck('feed_type')->sort()->values();
        $this->assertSame(['news', 'notification'], $types->all());
    }

    public function test_feed_items_are_sorted_by_date_descending(): void
    {
        $user = User::factory()->create();
        NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Vieja', 'body' => 'x', 'published_at' => now()->subDays(3)]);
        NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Nueva', 'body' => 'x', 'published_at' => now()]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/feed');

        $response->assertJsonPath('data.0.title', 'Nueva');
        $response->assertJsonPath('data.1.title', 'Vieja');
    }

    public function test_a_user_only_sees_their_own_notifications_in_the_feed(): void
    {
        $client = $this->sendOneChatMessage();
        $stranger = User::factory()->create();

        $response = $this->actingAs($stranger, 'sanctum')->getJson('/api/v1/feed');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }

    public function test_marking_a_news_item_read_updates_its_read_at_and_the_unread_count(): void
    {
        $user = User::factory()->create();
        $news = NewsPromotion::query()->create(['admin_id' => $user->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson("/api/v1/feed/news/{$news->id}/read")->assertNoContent();

        $response = $client->getJson('/api/v1/feed');
        $response->assertJsonPath('meta.unread_count', 0);
        $response->assertJsonPath('data.0.read_at', fn ($value) => $value !== null);
    }

    public function test_marking_a_news_item_read_is_scoped_per_user(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);
        $reader = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($reader, 'sanctum')->postJson("/api/v1/feed/news/{$news->id}/read")->assertNoContent();

        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/feed');
        $response->assertJsonPath('meta.unread_count', 1);
        $this->assertNull($response->json('data.0.read_at'));
    }

    public function test_marking_an_unpublished_news_item_read_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null]);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson("/api/v1/feed/news/{$news->id}/read")->assertNotFound();
    }

    public function test_marking_a_notification_read_updates_read_at(): void
    {
        $client = $this->sendOneChatMessage();
        $notificationId = $client->notifications()->first()->id;

        $this->actingAs($client, 'sanctum')
            ->postJson("/api/v1/feed/notification/{$notificationId}/read")
            ->assertNoContent();

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');
        $response->assertJsonPath('meta.unread_count', 0);
    }

    public function test_a_user_cannot_mark_someone_elses_notification_read(): void
    {
        $client = $this->sendOneChatMessage();
        $notificationId = $client->notifications()->first()->id;
        $stranger = User::factory()->create();

        $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/v1/feed/notification/{$notificationId}/read")
            ->assertNotFound();
    }

    public function test_an_unknown_feed_type_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/feed/bogus/1/read')->assertNotFound();
    }

    public function test_mark_all_read_clears_unread_news_and_notifications(): void
    {
        $client = $this->sendOneChatMessage();
        NewsPromotion::query()->create(['admin_id' => $client->id, 'title' => 'Novedad', 'body' => 'x', 'published_at' => now()]);

        $this->actingAs($client, 'sanctum')->postJson('/api/v1/feed/read-all')->assertNoContent();

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/feed');
        $response->assertJsonPath('meta.unread_count', 0);
    }
}
