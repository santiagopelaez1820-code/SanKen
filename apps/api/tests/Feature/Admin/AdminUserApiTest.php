<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_user_routes(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
    }

    public function test_admin_can_list_users_with_filters(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['name' => 'Carlos Trainer', 'role' => 'trainer']);
        User::factory()->create(['name' => 'Ana Cliente', 'role' => 'user']);
        User::factory()->create(['name' => 'Beto Baneado', 'is_banned' => true]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?role=trainer');
        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Carlos Trainer', $response->json('data.0.name'));

        $banned = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?is_banned=1');
        $this->assertCount(1, $banned->json('data'));

        $search = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?q=ana');
        $this->assertCount(1, $search->json('data'));
    }

    public function test_admin_can_ban_a_user_and_it_revokes_their_active_tokens(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        $user->createToken('device');

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        $response->assertOk();
        $this->assertTrue($response->json('data.is_banned'));
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_banned' => true]);
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_admin_can_unban_a_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['is_banned' => true]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        $response->assertOk();
        $this->assertFalse($response->json('data.is_banned'));
    }

    public function test_admin_cannot_ban_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$admin->id}/ban")
            ->assertForbidden();
    }

    public function test_admin_can_toggle_trainer_verification(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $trainer = User::factory()->create(['role' => 'trainer']);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");

        $response->assertOk();
        $this->assertNotNull($response->json('data.trainer_verified_at'));

        $toggledOff = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");
        $this->assertNull($toggledOff->json('data.trainer_verified_at'));
    }

    public function test_verifying_a_non_trainer_fails(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $regular = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$regular->id}/verify-trainer")
            ->assertStatus(422);
    }
}
