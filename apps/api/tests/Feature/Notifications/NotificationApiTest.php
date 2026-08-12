<?php

namespace Tests\Feature\Notifications;

use App\Models\ChatConversation;
use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
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

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/notifications')->assertUnauthorized();
    }

    public function test_lists_the_users_own_notifications_with_unread_count(): void
    {
        $client = $this->sendOneChatMessage();

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/notifications');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('meta.unread_count', 1);
        $response->assertJsonPath('data.0.data.body', 'Hola');
        $this->assertNull($response->json('data.0.read_at'));
    }

    public function test_a_user_only_sees_their_own_notifications(): void
    {
        $client = $this->sendOneChatMessage();
        $stranger = User::factory()->create();

        $response = $this->actingAs($stranger, 'sanctum')->getJson('/api/v1/notifications');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }

    public function test_marking_one_notification_read_updates_read_at_and_the_unread_count(): void
    {
        $client = $this->sendOneChatMessage();
        $notificationId = $client->notifications()->first()->id;

        $this->actingAs($client, 'sanctum')
            ->postJson("/api/v1/notifications/{$notificationId}/read")
            ->assertOk()
            ->assertJsonPath('data.read_at', fn ($value) => $value !== null);

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/notifications');
        $response->assertJsonPath('meta.unread_count', 0);
    }

    public function test_a_user_cannot_mark_someone_elses_notification_read(): void
    {
        $client = $this->sendOneChatMessage();
        $notificationId = $client->notifications()->first()->id;
        $stranger = User::factory()->create();

        $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/v1/notifications/{$notificationId}/read")
            ->assertNotFound();
    }

    public function test_mark_all_read_clears_the_unread_count(): void
    {
        $client = $this->sendOneChatMessage();

        $this->actingAs($client, 'sanctum')->postJson('/api/v1/notifications/read-all')->assertOk();

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/notifications');
        $response->assertJsonPath('meta.unread_count', 0);
    }
}
