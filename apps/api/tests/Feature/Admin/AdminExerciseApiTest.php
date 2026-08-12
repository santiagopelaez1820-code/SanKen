<?php

namespace Tests\Feature\Admin;

use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminExerciseApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeMuscleGroup(): MuscleGroup
    {
        return MuscleGroup::query()->create(['name' => 'Pecho', 'slug' => 'pecho']);
    }

    public function test_non_admin_cannot_manage_exercises(): void
    {
        $user = User::factory()->create();
        $muscle = $this->makeMuscleGroup();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/exercises', [
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound',
        ])->assertForbidden();
    }

    public function test_admin_can_create_an_exercise(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $muscle = $this->makeMuscleGroup();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/exercises', [
            'name' => 'Press banca',
            'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell',
            'level' => 'beginner',
            'type' => 'compound',
        ]);

        $response->assertCreated();
        $this->assertTrue($response->json('data.is_active'));
        $this->assertDatabaseHas('exercises', ['name' => 'Press banca']);
    }

    public function test_admin_can_update_an_exercise(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $muscle = $this->makeMuscleGroup();
        $exercise = Exercise::query()->create([
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/exercises/{$exercise->id}", ['name' => 'Press banca inclinado']);

        $response->assertOk();
        $this->assertSame('Press banca inclinado', $response->json('data.name'));
    }

    public function test_destroy_deactivates_instead_of_deleting_the_row(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $muscle = $this->makeMuscleGroup();
        $exercise = Exercise::query()->create([
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/exercises/{$exercise->id}");

        $response->assertOk();
        $this->assertFalse($response->json('data.is_active'));
        $this->assertDatabaseHas('exercises', ['id' => $exercise->id, 'is_active' => false]);
    }

    public function test_admin_exercises_index_includes_inactive_ones(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $muscle = $this->makeMuscleGroup();
        Exercise::query()->create([
            'name' => 'Inactivo', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/exercises');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }
}
