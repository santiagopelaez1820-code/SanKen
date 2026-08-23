<?php

namespace Tests\Feature\Trainer;

use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyTrainersTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/me/trainers')->assertUnauthorized();
    }

    public function test_lists_only_active_trainer_relationships(): void
    {
        $client = User::factory()->create();
        $activeTrainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Activo']);
        $endedTrainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Viejo']);

        TrainerClient::query()->create([
            'trainer_id' => $activeTrainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        TrainerClient::query()->create([
            'trainer_id' => $endedTrainer->id, 'client_id' => $client->id, 'status' => 'ended', 'started_at' => now(), 'ended_at' => now(),
        ]);

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/me/trainers');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.trainer.name', 'Coach Activo');
    }

    public function test_a_user_with_no_trainer_gets_an_empty_list(): void
    {
        $client = User::factory()->create();

        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/me/trainers');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }
}
