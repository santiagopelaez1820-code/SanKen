<?php

namespace Tests\Feature\Admin;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReportApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeReport(User $reporter, string $status = 'pending'): Report
    {
        return Report::query()->create([
            'reporter_id' => $reporter->id,
            'reportable_type' => 'chat_message',
            'reportable_id' => 1,
            'reason' => 'abuse',
            'status' => $status,
        ]);
    }

    public function test_non_admin_cannot_access_reports(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/reports')->assertForbidden();
    }

    public function test_index_defaults_to_pending_only(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $reporter = User::factory()->create();
        $this->makeReport($reporter, 'pending');
        $this->makeReport($reporter, 'resolved');

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/reports');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('pending', $response->json('data.0.status'));
    }

    public function test_index_with_status_all_returns_everything(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $reporter = User::factory()->create();
        $this->makeReport($reporter, 'pending');
        $this->makeReport($reporter, 'resolved');

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/reports?status=all');

        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_can_resolve_a_report(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $reporter = User::factory()->create();
        $report = $this->makeReport($reporter);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/reports/{$report->id}/resolve", [
                'status' => 'resolved',
                'resolution_notes' => 'Advertencia enviada.',
            ]);

        $response->assertOk();
        $this->assertSame('resolved', $response->json('data.status'));
        $this->assertSame($admin->id, $response->json('data.resolved_by.id'));
        $this->assertNotNull($response->json('data.resolved_at'));
    }

    public function test_resolve_rejects_an_invalid_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $reporter = User::factory()->create();
        $report = $this->makeReport($reporter);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/reports/{$report->id}/resolve", ['status' => 'pending'])
            ->assertStatus(422);
    }
}
