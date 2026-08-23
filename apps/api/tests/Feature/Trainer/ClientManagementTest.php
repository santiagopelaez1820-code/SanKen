<?php

namespace Tests\Feature\Trainer;

use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_regular_user_cannot_access_trainer_endpoints(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/trainer/clients')
            ->assertForbidden();
    }

    public function test_trainer_can_add_an_existing_user_as_a_client(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($trainer, 'sanctum')
            ->postJson('/api/v1/trainer/clients', ['email' => $client->email]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.client.id', $client->id);

        $this->assertDatabaseHas('trainer_clients', [
            'trainer_id' => $trainer->id,
            'client_id' => $client->id,
            'status' => 'active',
        ]);
    }

    public function test_trainer_cannot_add_a_client_by_a_nonexistent_email(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);

        $this->actingAs($trainer, 'sanctum')
            ->postJson('/api/v1/trainer/clients', ['email' => 'nadie@example.com'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_trainer_cannot_add_another_trainer_as_a_client(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);

        $this->actingAs($trainer, 'sanctum')
            ->postJson('/api/v1/trainer/clients', ['email' => $otherTrainer->email])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_trainer_cannot_add_the_same_client_twice_while_the_relationship_is_active(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create(['role' => 'user']);
        $this->actingAs($trainer, 'sanctum')->postJson('/api/v1/trainer/clients', ['email' => $client->email]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson('/api/v1/trainer/clients', ['email' => $client->email])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_trainer_only_sees_their_own_clients(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $myClient = User::factory()->create(['role' => 'user']);
        $theirClient = User::factory()->create(['role' => 'user']);

        TrainerClient::query()->create(['trainer_id' => $trainer->id, 'client_id' => $myClient->id, 'status' => 'active', 'started_at' => now()]);
        TrainerClient::query()->create(['trainer_id' => $otherTrainer->id, 'client_id' => $theirClient->id, 'status' => 'active', 'started_at' => now()]);

        $response = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/trainer/clients');

        $response->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.client.id', $myClient->id);
    }

    public function test_trainer_cannot_view_or_update_another_trainers_client(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create(['role' => 'user']);

        $trainerClient = TrainerClient::query()->create([
            'trainer_id' => $otherTrainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);

        $actingTrainer = $this->actingAs($trainer, 'sanctum');
        $actingTrainer->getJson("/api/v1/trainer/clients/{$trainerClient->id}")->assertForbidden();
        $actingTrainer->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended'])->assertForbidden();
    }

    public function test_trainer_can_end_a_client_relationship(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create(['role' => 'user']);
        $trainerClient = TrainerClient::query()->create([
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);

        $response = $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended']);

        $response->assertOk()->assertJsonPath('data.status', 'ended');
        $this->assertDatabaseHas('trainer_clients', ['id' => $trainerClient->id, 'status' => 'ended']);
        $this->assertNotNull($trainerClient->fresh()->ended_at);
    }
}
