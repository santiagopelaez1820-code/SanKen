<?php

namespace Tests\Unit\Notifications;

use App\Models\ChatConversation;
use App\Models\PushDeviceToken;
use App\Models\PushSubscription;
use App\Models\TrainerClient;
use App\Models\User;
use App\Notifications\Channels\ExpoPushChannel;
use App\Notifications\Channels\WebPushChannel;
use App\Notifications\NewChatMessageNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewChatMessageNotificationViaTest extends TestCase
{
    use RefreshDatabase;

    private function makeNotification(User $sender): NewChatMessageNotification
    {
        $relation = TrainerClient::query()->create([
            'trainer_id' => $sender->id, 'client_id' => User::factory()->create()->id, 'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        $message = $conversation->messages()->create(['sender_id' => $sender->id, 'body' => 'Hola']);

        return new NewChatMessageNotification($message->load('sender'));
    }

    public function test_always_includes_database_and_broadcast(): void
    {
        $sender = User::factory()->create(['role' => 'trainer']);
        $recipient = User::factory()->create();

        $channels = $this->makeNotification($sender)->via($recipient);

        $this->assertContains('database', $channels);
        $this->assertContains('broadcast', $channels);
        $this->assertNotContains(ExpoPushChannel::class, $channels);
        $this->assertNotContains(WebPushChannel::class, $channels);
    }

    public function test_includes_expo_push_only_when_the_recipient_has_a_registered_token(): void
    {
        $sender = User::factory()->create(['role' => 'trainer']);
        $recipient = User::factory()->create();
        PushDeviceToken::query()->create(['user_id' => $recipient->id, 'token' => 'ExponentPushToken[x]', 'platform' => 'expo']);

        $channels = $this->makeNotification($sender)->via($recipient);

        $this->assertContains(ExpoPushChannel::class, $channels);
        $this->assertNotContains(WebPushChannel::class, $channels);
    }

    public function test_includes_web_push_only_when_the_recipient_has_a_subscription(): void
    {
        $sender = User::factory()->create(['role' => 'trainer']);
        $recipient = User::factory()->create();
        PushSubscription::query()->create([
            'user_id' => $recipient->id, 'endpoint' => 'https://fcm.googleapis.com/fcm/send/x',
            'public_key' => 'pub', 'auth_token' => 'auth',
        ]);

        $channels = $this->makeNotification($sender)->via($recipient);

        $this->assertContains(WebPushChannel::class, $channels);
        $this->assertNotContains(ExpoPushChannel::class, $channels);
    }
}
