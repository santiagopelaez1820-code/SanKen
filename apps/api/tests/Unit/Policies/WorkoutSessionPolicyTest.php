<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Models\WorkoutSession;
use App\Policies\WorkoutSessionPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutSessionPolicyTest extends TestCase
{
    use RefreshDatabase;

    private WorkoutSessionPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new WorkoutSessionPolicy;
    }

    public function test_owner_can_view_their_session(): void
    {
        $user = User::factory()->create();
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);

        $this->assertTrue($this->policy->view($user, $session));
    }

    public function test_another_user_cannot_view_the_session(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);

        $this->assertFalse($this->policy->view($other, $session));
    }
}
