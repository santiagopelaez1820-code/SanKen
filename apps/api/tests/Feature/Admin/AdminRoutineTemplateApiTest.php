<?php

namespace Tests\Feature\Admin;

use App\Models\Exercise;
use App\Models\RoutineTemplate;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRoutineTemplateApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function exerciseId(string $name): int
    {
        return Exercise::query()->where('name', $name)->value('id');
    }

    private function samplePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Rutina 3 días de prueba',
            'sex' => 'male',
            'frequency_days' => 3,
            'split_type' => 'full_body',
            'days' => [
                [
                    'day_order' => 1,
                    'label' => 'Día 1',
                    'exercises' => [
                        [
                            'exercise_id' => $this->exerciseId('Press banca con barra'),
                            'order' => 1,
                            'default_sets' => 3,
                            'default_reps' => '10',
                            'rest_seconds' => 90,
                        ],
                    ],
                ],
            ],
        ], $overrides);
    }

    public function test_non_admin_cannot_manage_routine_templates(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/admin/routine-templates', $this->samplePayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_a_routine_template_and_it_starts_inactive(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/routine-templates', $this->samplePayload());

        $response->assertCreated();
        $response->assertJsonPath('data.is_active', false);
        $response->assertJsonPath('data.name', 'Rutina 3 días de prueba');
        $response->assertJsonCount(1, 'data.days');
        $response->assertJsonCount(1, 'data.days.0.exercises');
        $this->assertDatabaseHas('routine_templates', ['name' => 'Rutina 3 días de prueba', 'is_active' => false]);
    }

    public function test_admin_can_update_a_template_replacing_its_days(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');

        $response = $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}", [
            'name' => 'Rutina 3 días — editada',
            'days' => [
                [
                    'day_order' => 1,
                    'label' => 'Día 1 editado',
                    'exercises' => [
                        [
                            'exercise_id' => $this->exerciseId('Press militar con barra'),
                            'order' => 1,
                            'default_sets' => 4,
                            'default_reps' => '8',
                            'rest_seconds' => 120,
                        ],
                    ],
                ],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.name', 'Rutina 3 días — editada');
        $response->assertJsonPath('data.days.0.label', 'Día 1 editado');
        $response->assertJsonPath('data.days.0.exercises.0.default_sets', 4);
        $this->assertDatabaseCount('routine_template_exercises', 1);
    }

    public function test_generic_update_cannot_change_is_active(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');

        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}", ['is_active' => true]);

        $this->assertFalse(RoutineTemplate::find($template['id'])->is_active);
    }

    public function test_admin_can_duplicate_a_template_and_the_copy_is_inactive(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        $response = $client->postJson("/api/v1/admin/routine-templates/{$template['id']}/duplicate");

        $response->assertCreated();
        $response->assertJsonPath('data.is_active', false);
        $response->assertJsonPath('data.name', 'Rutina 3 días de prueba (copia)');
        $response->assertJsonCount(1, 'data.days.0.exercises');
        $this->assertNotEquals($template['id'], $response->json('data.id'));
        // El original sigue activo — duplicar no lo toca.
        $this->assertTrue(RoutineTemplate::find($template['id'])->is_active);
    }

    public function test_activating_a_template_deactivates_siblings_with_the_same_sex_and_frequency(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $original = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $client->patchJson("/api/v1/admin/routine-templates/{$original['id']}/activate");
        $duplicate = $client->postJson("/api/v1/admin/routine-templates/{$original['id']}/duplicate")->json('data');

        $response = $client->patchJson("/api/v1/admin/routine-templates/{$duplicate['id']}/activate");

        $response->assertOk();
        $response->assertJsonPath('data.is_active', true);
        $this->assertFalse(RoutineTemplate::find($original['id'])->is_active);
        $this->assertSame(
            1,
            RoutineTemplate::where('sex', 'male')->where('frequency_days', 3)->where('is_active', true)->count(),
        );
    }

    public function test_cannot_deactivate_the_only_active_template_for_a_sex_and_frequency(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        $response = $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/deactivate");

        $response->assertStatus(422);
        $this->assertTrue(RoutineTemplate::find($template['id'])->is_active);
    }

    public function test_can_deactivate_when_another_template_is_still_active_for_that_sex_and_frequency(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $first = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $client->patchJson("/api/v1/admin/routine-templates/{$first['id']}/activate");
        $second = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $client->patchJson("/api/v1/admin/routine-templates/{$second['id']}/activate");
        // Activar $second desactivó a $first — reactivamos $first para que ambos coexistan
        // momentáneamente y probar el guard de "no sos la única activa".
        RoutineTemplate::find($first['id'])->update(['is_active' => true]);

        $response = $client->patchJson("/api/v1/admin/routine-templates/{$first['id']}/deactivate");

        $response->assertOk();
        $this->assertFalse(RoutineTemplate::find($first['id'])->is_active);
        $this->assertTrue(RoutineTemplate::find($second['id'])->is_active);
    }

    public function test_index_includes_inactive_templates(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $client = $this->actingAs($admin, 'sanctum');
        $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload());

        $response = $client->getJson('/api/v1/admin/routine-templates');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertFalse($response->json('data.0.is_active'));
    }

    public function test_activating_a_new_template_makes_its_frequency_available_in_onboarding_questions(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $regular = User::factory()->create();

        $before = $this->actingAs($regular, 'sanctum')->getJson('/api/v1/onboarding/questions');
        $this->assertNotContains(3, $before->json('data.frequency_days'));

        $this->actingAs($admin, 'sanctum');
        $template = $this->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        $this->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        $after = $this->actingAs($regular, 'sanctum')->getJson('/api/v1/onboarding/questions');
        $this->assertContains(3, $after->json('data.frequency_days'));
    }
}
