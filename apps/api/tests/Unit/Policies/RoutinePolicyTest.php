<?php

namespace Tests\Unit\Policies;

use App\Models\Routine;
use App\Models\User;
use App\Policies\RoutinePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoutinePolicyTest extends TestCase
{
    use RefreshDatabase;

    private RoutinePolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new RoutinePolicy;
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeRoutine(User $owner, array $overrides = []): Routine
    {
        return Routine::query()->create(array_merge([
            'user_id' => $owner->id,
            'source' => 'engine',
            'goal' => 'gain_muscle',
            'split_type' => 'full_body',
            'frequency_days' => 3,
            'duration_weeks' => 6,
            'is_active' => true,
        ], $overrides));
    }

    public function test_owner_can_view_their_routine(): void
    {
        $user = User::factory()->create();
        $routine = $this->makeRoutine($user);

        $this->assertTrue($this->policy->view($user, $routine));
    }

    public function test_another_user_cannot_view_the_routine(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $routine = $this->makeRoutine($user);

        $this->assertFalse($this->policy->view($other, $routine));
    }

    public function test_trainer_can_manage_a_routine_they_created(): void
    {
        $client = User::factory()->create();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $routine = $this->makeRoutine($client, ['source' => 'trainer', 'created_by_trainer_id' => $trainer->id]);

        $this->assertTrue($this->policy->manage($trainer, $routine));
    }

    public function test_trainer_cannot_manage_a_routine_created_by_another_trainer(): void
    {
        $client = User::factory()->create();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $routine = $this->makeRoutine($client, ['source' => 'trainer', 'created_by_trainer_id' => $trainer->id]);

        $this->assertFalse($this->policy->manage($otherTrainer, $routine));
    }

    public function test_trainer_cannot_manage_an_engine_generated_routine(): void
    {
        $client = User::factory()->create();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $routine = $this->makeRoutine($client, ['source' => 'engine']);

        $this->assertFalse($this->policy->manage($trainer, $routine));
    }
}
