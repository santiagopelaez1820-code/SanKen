<?php

namespace Tests\Feature\Push;

use App\Models\PushDeviceToken;
use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PushRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registering_an_expo_token_is_idempotent_on_reinstall(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertCreated();
        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertCreated();

        $this->assertSame(1, PushDeviceToken::query()->where('user_id', $user->id)->count());
    }

    public function test_expo_token_requires_a_value(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/push/expo-token', [])
            ->assertUnprocessable();
    }

    public function test_a_user_can_unregister_their_own_expo_token(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $client->postJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]']);

        $client->deleteJson('/api/v1/push/expo-token', ['token' => 'ExponentPushToken[abc]'])->assertNoContent();

        $this->assertDatabaseMissing('push_device_tokens', ['user_id' => $user->id]);
    }

    public function test_registering_a_web_subscription_stores_the_p256dh_and_auth_keys(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/push/web-subscription', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
            'keys' => ['p256dh' => 'public-key-value', 'auth' => 'auth-secret-value'],
        ])->assertCreated();

        $this->assertDatabaseHas('push_subscriptions', [
            'user_id' => $user->id,
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
            'public_key' => 'public-key-value',
            'auth_token' => 'auth-secret-value',
        ]);
    }

    public function test_re_subscribing_with_the_same_endpoint_updates_the_keys_instead_of_duplicating(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $endpoint = 'https://fcm.googleapis.com/fcm/send/abc123';

        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'old', 'auth' => 'old']]);
        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'new', 'auth' => 'new']]);

        $this->assertSame(1, PushSubscription::query()->where('endpoint', $endpoint)->count());
        $this->assertDatabaseHas('push_subscriptions', ['endpoint' => $endpoint, 'public_key' => 'new']);
    }

    public function test_a_user_can_unregister_their_web_subscription(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $endpoint = 'https://fcm.googleapis.com/fcm/send/abc123';
        $client->postJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint, 'keys' => ['p256dh' => 'a', 'auth' => 'b']]);

        $client->deleteJson('/api/v1/push/web-subscription', ['endpoint' => $endpoint])->assertNoContent();

        $this->assertDatabaseMissing('push_subscriptions', ['endpoint' => $endpoint]);
    }
}
