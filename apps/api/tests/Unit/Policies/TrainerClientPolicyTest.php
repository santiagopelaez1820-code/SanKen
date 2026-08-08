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
}
