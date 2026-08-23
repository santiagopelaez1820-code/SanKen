<?php

namespace Tests\Feature;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->postJson('/api/v1/reports', [])->assertUnauthorized();
    }

    public function test_user_can_report_a_chat_message(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id,
            'status' => 'active', 'started_at' => now(),
        ]);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        $message = ChatMessage::query()->create([
            'conversation_id' => $conversation->id, 'sender_id' => $trainer->id, 'body' => 'contenido inapropiado',
        ]);

        $response = $this->actingAs($client, 'sanctum')->postJson('/api/v1/reports', [
            'reportable_type' => 'chat_message',
            'reportable_id' => $message->id,
            'reason' => 'inappropriate_content',
            'details' => 'Me hizo sentir incómodo.',
        ]);

        $response->assertCreated();
        $this->assertSame('pending', $response->json('data.status'));
        $this->assertDatabaseHas('reports', [
            'reporter_id' => $client->id,
            'reportable_type' => 'chat_message',
            'reportable_id' => $message->id,
            'status' => 'pending',
        ]);
    }

    public function test_reason_must_be_a_known_value(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/reports', [
            'reportable_type' => 'chat_message', 'reportable_id' => 1, 'reason' => 'not-a-real-reason',
        ])->assertStatus(422);
    }

    public function test_reportable_type_outside_the_allow_list_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/reports', [
            'reportable_type' => 'user', 'reportable_id' => 1, 'reason' => 'abuse',
        ])->assertStatus(422);
    }
}
