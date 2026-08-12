<?php

namespace Tests\Feature\Chat;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeRelation(User $trainer, User $client, string $status = 'active'): TrainerClient
    {
        return TrainerClient::query()->create([
            'trainer_id' => $trainer->id,
            'client_id' => $client->id,
            'status' => $status,
            'started_at' => now(),
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/conversations')->assertUnauthorized();
    }

    public function test_either_party_can_get_or_create_the_conversation_for_their_relationship(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $asTrainer = $this->actingAs($trainer, 'sanctum')
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation");
        $asTrainer->assertOk();
        $conversationId = $asTrainer->json('data.conversation_id');

        $asClient = $this->actingAs($client, 'sanctum')
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation");
        $asClient->assertOk();

        // Misma conversación para ambos, creada una sola vez.
        $this->assertSame($conversationId, $asClient->json('data.conversation_id'));
        $this->assertSame(1, ChatConversation::query()->where('trainer_client_id', $relation->id)->count());
    }

    public function test_a_stranger_cannot_open_the_conversation(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $stranger = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation")
            ->assertForbidden();
    }

    public function test_paused_relationship_blocks_opening_the_conversation(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client, 'paused');

        $this->actingAs($trainer, 'sanctum')
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation")
            ->assertForbidden();
    }

    public function test_sending_a_message_appears_in_the_thread_and_notifies_the_recipient(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $response = $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola, ¿cómo va la rodilla?']);

        $response->assertCreated();
        $response->assertJsonPath('data.body', 'Hola, ¿cómo va la rodilla?');
        $response->assertJsonPath('data.sender_id', $trainer->id);
        $response->assertJsonPath('data.is_mine', true);

        $this->assertDatabaseHas('chat_messages', [
            'conversation_id' => $conversation->id, 'sender_id' => $trainer->id, 'body' => 'Hola, ¿cómo va la rodilla?',
        ]);
        $this->assertSame(1, $client->fresh()->notifications()->count());
    }

    public function test_sending_a_message_to_someone_elses_conversation_is_forbidden(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $intruder = User::factory()->create();

        $this->actingAs($intruder, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola'])
            ->assertForbidden();
    }

    public function test_message_body_is_required(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [])
            ->assertUnprocessable();
    }

    public function test_inbox_lists_conversations_with_last_message_and_unread_count_from_the_viewers_perspective(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Primero']);
        $this->actingAs($client, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Segundo']);

        $inbox = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');

        $inbox->assertOk();
        $inbox->assertJsonCount(1, 'data');
        $inbox->assertJsonPath('data.0.last_message.body', 'Segundo');
        $inbox->assertJsonPath('data.0.other_party.id', $client->id);
        $inbox->assertJsonPath('data.0.unread_count', 1); // el de "Segundo", enviado por el cliente, sin leer todavía
    }

    public function test_fetching_messages_marks_the_other_partys_messages_as_read(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($client, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola coach']);

        $before = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');
        $before->assertJsonPath('data.0.unread_count', 1);

        $this->actingAs($trainer, 'sanctum')->getJson("/api/v1/conversations/{$conversation->id}/messages")->assertOk();

        $after = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');
        $after->assertJsonPath('data.0.unread_count', 0);

        $this->assertDatabaseHas('chat_messages', ['conversation_id' => $conversation->id, 'sender_id' => $client->id]);
        $this->assertNotNull(ChatMessage::query()->where('conversation_id', $conversation->id)->first()->read_at);
    }

    public function test_reading_a_thread_does_not_mark_my_own_messages_as_read_by_someone_else(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        $this->actingAs($trainer, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);
        // El propio entrenador vuelve a pedir el hilo — no debería "leer" su propio mensaje.
        $this->actingAs($trainer, 'sanctum')->getJson("/api/v1/conversations/{$conversation->id}/messages");

        $this->assertNull(ChatMessage::query()->where('conversation_id', $conversation->id)->first()->read_at);
    }

    public function test_messages_can_be_paginated_with_before(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        $client_ = $this->actingAs($trainer, 'sanctum');

        $first = $client_->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'uno'])->json('data.id');
        $client_->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'dos']);

        $response = $client_->getJson("/api/v1/conversations/{$conversation->id}/messages?before={$first}");

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }
}
