<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    private UserPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new UserPolicy;
    }

    public function test_user_can_view_and_update_their_own_profile(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->view($user, $user));
        $this->assertTrue($this->policy->update($user, $user));
    }

    public function test_user_cannot_view_or_update_another_users_profile(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->assertFalse($this->policy->view($user, $other));
        $this->assertFalse($this->policy->update($user, $other));
    }

    public function test_admin_can_view_and_update_any_profile(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $other = User::factory()->create();

        $this->assertTrue($this->policy->view($admin, $other));
        $this->assertTrue($this->policy->update($admin, $other));
    }

    public function test_only_admin_can_ban_and_never_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();

        $this->assertTrue($this->policy->ban($admin, $user));
        $this->assertFalse($this->policy->ban($admin, $admin));
        $this->assertFalse($this->policy->ban($user, $admin));
    }
}
