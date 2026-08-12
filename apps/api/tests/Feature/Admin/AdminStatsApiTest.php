<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminStatsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_stats(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/stats')->assertForbidden();
    }

    public function test_admin_gets_global_metrics_shape(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'last_active_at' => now()]);
        User::factory()->create(['role' => 'trainer', 'last_active_at' => now()]);
        User::factory()->create(['is_banned' => true]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/stats');

        $response->assertOk();
        $response->assertJsonStructure(['data' => [
            'total_users', 'new_users_7d', 'trainers_count', 'banned_users_count',
            'pending_reports_count', 'dau', 'wau', 'mau', 'retention_pct',
        ]]);
        $this->assertSame(3, $response->json('data.total_users'));
        $this->assertSame(1, $response->json('data.trainers_count'));
        $this->assertSame(1, $response->json('data.banned_users_count'));
        $this->assertSame(2, $response->json('data.dau'));
    }
}
