<?php

namespace Tests\Unit\Notifications;

use App\Models\ChatConversation;
use App\Models\PushDeviceToken;
use App\Models\TrainerClient;
use App\Models\User;
use App\Notifications\Channels\ExpoPushChannel;
use App\Notifications\NewChatMessageNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExpoPushChannelTest extends TestCase
{
    use RefreshDatabase;

    private function makeMessageNotification(): array
    {
        $trainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Ana']);
        $client = User::factory()->create();
        $relation = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        $message = $conversation->messages()->create(['sender_id' => $trainer->id, 'body' => 'Hola']);

        return [$client, new NewChatMessageNotification($message->load('sender'))];
    }

    public function test_posts_to_expo_for_every_registered_token(): void
    {
        Http::fake(['https://exp.host/*' => Http::response(['data' => []], 200)]);

        [$client, $notification] = $this->makeMessageNotification();
        PushDeviceToken::query()->create(['user_id' => $client->id, 'token' => 'ExponentPushToken[a]', 'platform' => 'expo']);
        PushDeviceToken::query()->create(['user_id' => $client->id, 'token' => 'ExponentPushToken[b]', 'platform' => 'expo']);

        (new ExpoPushChannel)->send($client, $notification);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://exp.host/--/api/v2/push/send'
                && count($request->data()) === 2
                && $request->data()[0]['to'] === 'ExponentPushToken[a]'
                && $request->data()[0]['title'] === 'Coach Ana'
                && $request->data()[0]['body'] === 'Hola';
        });
    }

    public function test_does_not_call_expo_when_the_user_has_no_registered_tokens(): void
    {
        Http::fake();

        [$client, $notification] = $this->makeMessageNotification();

        (new ExpoPushChannel)->send($client, $notification);

        Http::assertNothingSent();
    }
}
