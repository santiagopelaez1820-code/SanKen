<?php

namespace Tests\Feature\Chat;

use App\Events\MessageSent;
use App\Models\ChatConversation;
use App\Models\TrainerClient;
use App\Models\User;
use App\Notifications\NewChatMessageNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MessageBroadcastTest extends TestCase
{
    use RefreshDatabase;

    public function test_sending_a_message_dispatches_message_sent_with_the_right_payload(): void
    {
        Event::fake([MessageSent::class]);

        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola'])
            ->assertCreated();

        Event::assertDispatched(MessageSent::class, function (MessageSent $event) use ($conversation, $trainer) {
            return $event->message->conversation_id === $conversation->id
                && $event->message->sender_id === $trainer->id
                && $event->message->body === 'Hola';
        });
    }

    public function test_sending_a_message_notifies_only_the_other_party(): void
    {
        Notification::fake();

        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);

        Notification::assertSentTo($client, NewChatMessageNotification::class);
        Notification::assertNotSentTo($trainer, NewChatMessageNotification::class);
    }
}
