<?php

namespace Tests\Feature\Admin;

use App\Application\Challenges\Actions\GenerateChallengesAction;
use App\Models\ChallengeTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminChallengeTemplateApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeTemplate(array $overrides = []): ChallengeTemplate
    {
        return ChallengeTemplate::query()->create(array_merge([
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal',
            'description' => 'Completa 5 entrenamientos esta semana.',
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 5,
        ], $overrides));
    }

    public function test_non_admin_cannot_manage_challenge_templates(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/challenge-templates')->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [])->assertForbidden();
    }

    public function test_admin_can_list_all_templates_including_inactive_ones(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->makeTemplate(['code' => 'a', 'is_active' => true]);
        $this->makeTemplate(['code' => 'b', 'is_active' => false]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/challenge-templates');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_a_template(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            'code' => 'weekly_new_pr', 'title' => 'Nuevo PR', 'description' => 'Consigue un PR esta semana.',
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.code', 'weekly_new_pr');
        $response->assertJsonPath('data.is_active', true);
        $this->assertDatabaseHas('challenge_templates', ['code' => 'weekly_new_pr']);
    }

    public function test_code_must_be_unique(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->makeTemplate(['code' => 'weekly_5_sessions']);

        $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            'code' => 'weekly_5_sessions', 'title' => 'Otra', 'description' => 'x',
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
        ])->assertStatus(422);
    }

    public function test_metric_must_be_a_known_value(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            'code' => 'weekly_made_up', 'title' => 'x', 'description' => 'x',
            'type' => 'weekly', 'metric' => 'made_up_metric', 'target' => 1,
        ])->assertStatus(422);
    }

    public function test_admin_can_update_a_template(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $template = $this->makeTemplate();

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/challenge-templates/{$template->id}", [
            'target' => 10,
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.target', '10.00');
    }

    public function test_admin_can_activate_and_deactivate_a_template(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $template = $this->makeTemplate(['is_active' => true]);
        $client = $this->actingAs($admin, 'sanctum');

        $client->patchJson("/api/v1/admin/challenge-templates/{$template->id}/deactivate")
            ->assertJsonPath('data.is_active', false);
        $this->assertFalse($template->fresh()->is_active);

        $client->patchJson("/api/v1/admin/challenge-templates/{$template->id}/activate")
            ->assertJsonPath('data.is_active', true);
        $this->assertTrue($template->fresh()->is_active);
    }

    public function test_deactivating_a_template_does_not_delete_challenges_already_generated_from_it(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $template = $this->makeTemplate();

        GenerateChallengesAction::dispatchSync();
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/challenge-templates/{$template->id}/deactivate")
            ->assertOk();

        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);
    }
}
