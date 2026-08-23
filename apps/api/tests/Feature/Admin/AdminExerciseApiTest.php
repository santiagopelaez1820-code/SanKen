<?php

namespace Tests\Feature\Admin;

use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
        $admin = User::factory()->create(['role' => 'super_admin']);
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
        $admin = User::factory()->create(['role' => 'super_admin']);
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
        $admin = User::factory()->create(['role' => 'super_admin']);
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
        $admin = User::factory()->create(['role' => 'super_admin']);
        $muscle = $this->makeMuscleGroup();
        Exercise::query()->create([
            'name' => 'Inactivo', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/exercises');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    private function makeExercise(): Exercise
    {
        $muscle = $this->makeMuscleGroup();

        return Exercise::query()->create([
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);
    }

    public function test_admin_can_upload_a_video_for_an_exercise(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $exercise = $this->makeExercise();
        $file = UploadedFile::fake()->create('squat.mp4', 5000, 'video/mp4');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file]);

        $response->assertOk();
        $this->assertNotNull($response->json('data.video_url'));
        $this->assertStringContainsString('/storage/exercise-videos/', $response->json('data.video_url'));
        Storage::disk('public')->assertExists('exercise-videos/'.$file->hashName());
    }

    public function test_non_video_file_is_rejected(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $exercise = $this->makeExercise();
        $file = UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf');

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file])
            ->assertStatus(422);
    }

    public function test_replacing_a_video_deletes_the_old_file_after_the_new_one_is_saved(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $exercise = $this->makeExercise();
        $client = $this->actingAs($admin, 'sanctum');

        $first = UploadedFile::fake()->create('v1.mp4', 1000, 'video/mp4');
        $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $first]);
        $firstPath = 'exercise-videos/'.$first->hashName();
        Storage::disk('public')->assertExists($firstPath);

        $second = UploadedFile::fake()->create('v2.mp4', 1000, 'video/mp4');
        $response = $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $second]);

        $response->assertOk();
        Storage::disk('public')->assertExists('exercise-videos/'.$second->hashName());
        Storage::disk('public')->assertMissing($firstPath);
    }

    public function test_admin_can_delete_a_video_and_the_exercise_keeps_working(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $exercise = $this->makeExercise();
        $client = $this->actingAs($admin, 'sanctum');

        $file = UploadedFile::fake()->create('squat.mp4', 1000, 'video/mp4');
        $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file]);
        $path = 'exercise-videos/'.$file->hashName();

        $response = $client->deleteJson("/api/v1/admin/exercises/{$exercise->id}/video");

        $response->assertOk();
        $this->assertNull($response->json('data.video_url'));
        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseHas('exercises', ['id' => $exercise->id, 'is_active' => true, 'video_url' => null]);
    }

    public function test_non_admin_cannot_upload_exercise_videos(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $file = UploadedFile::fake()->create('squat.mp4', 1000, 'video/mp4');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file])
            ->assertForbidden();
    }
}
