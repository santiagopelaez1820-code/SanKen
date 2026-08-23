<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuditLogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_audit_logs(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/audit-logs')->assertForbidden();
    }

    public function test_admin_sees_activity_already_logged_by_spatie(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();

        // La propia acción de banear (User::update de is_banned) ya queda
        // registrada por LogsActivity — no hace falta un seed manual.
        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/users/{$user->id}/ban")->assertOk();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/audit-logs');

        $response->assertOk();
        $entries = collect($response->json('data'));
        $this->assertTrue($entries->contains(fn ($entry) => $entry['subject_id'] === $user->id));
    }
}
