<?php

namespace Tests\Unit\Policies;

use App\Models\TrainerClient;
use App\Models\User;
use App\Policies\TrainerClientPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainerClientPolicyTest extends TestCase
{
    use RefreshDatabase;

    private TrainerClientPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new TrainerClientPolicy;
    }

    private function makeRelation(User $trainer, User $client): TrainerClient
    {
        return TrainerClient::query()->create([
            'trainer_id' => $trainer->id,
            'client_id' => $client->id,
            'status' => 'active',
            'started_at' => now(),
        ]);
    }

    public function test_trainer_can_view_and_update_their_own_client(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $this->assertTrue($this->policy->view($trainer, $relation));
        $this->assertTrue($this->policy->update($trainer, $relation));
    }

    public function test_another_trainer_cannot_view_or_update_the_client(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $this->assertFalse($this->policy->view($otherTrainer, $relation));
        $this->assertFalse($this->policy->update($otherTrainer, $relation));
    }

    public function test_both_trainer_and_client_can_converse_while_active(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $this->assertTrue($this->policy->converse($trainer, $relation));
        $this->assertTrue($this->policy->converse($client, $relation));
    }

    public function test_a_stranger_cannot_converse(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $stranger = User::factory()->create();
        $relation = $this->makeRelation($trainer, $client);

        $this->assertFalse($this->policy->converse($stranger, $relation));
    }

    public function test_neither_party_can_converse_once_the_relationship_is_paused_or_ended(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create();
        $paused = $this->makeRelation($trainer, $client);
        $paused->update(['status' => 'paused']);

        $this->assertFalse($this->policy->converse($trainer, $paused));
        $this->assertFalse($this->policy->converse($client, $paused));
    }
}
