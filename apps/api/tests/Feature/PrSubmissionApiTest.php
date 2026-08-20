<?php

namespace Tests\Feature;

use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Models\PrSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PrSubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeExercise(): Exercise
    {
        $muscle = MuscleGroup::query()->create(['name' => 'Pecho', 'slug' => 'pecho']);

        return Exercise::query()->create([
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->postJson('/api/v1/pr-submissions', [])->assertUnauthorized();
    }

    public function test_user_can_submit_a_pr_for_review(): void
    {
        $user = User::factory()->create();
        $exercise = $this->makeExercise();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/pr-submissions', [
            'exercise_id' => $exercise->id, 'weight_kg' => 100, 'reps' => 5,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonPath('data.exercise.id', $exercise->id);
        $this->assertEquals(116.67, (float) $response->json('data.estimated_1rm'));
        $this->assertDatabaseHas('pr_submissions', [
            'user_id' => $user->id, 'exercise_id' => $exercise->id, 'status' => 'pending',
        ]);
    }

    public function test_a_new_pr_never_touches_the_automatic_personal_record_used_for_gamification(): void
    {
        $user = User::factory()->create();
        $exercise = $this->makeExercise();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/pr-submissions', [
            'exercise_id' => $exercise->id, 'weight_kg' => 100, 'reps' => 5,
        ])->assertCreated();

        // La postulación es una tabla totalmente separada -- personal_records
        // (la detección automática privada) no se toca por esto.
        $this->assertDatabaseCount('personal_records', 0);
    }

    public function test_user_sees_only_their_own_submissions(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $exercise = $this->makeExercise();
        PrSubmission::query()->create([
            'user_id' => $owner->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);

        $response = $this->actingAs($stranger, 'sanctum')->getJson('/api/v1/pr-submissions');

        $response->assertOk();
        $this->assertCount(0, $response->json('data'));
    }

    public function test_user_can_upload_evidence_video_for_their_own_pending_submission(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);
        $file = UploadedFile::fake()->create('lift.mp4', 5000, 'video/mp4');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file]);

        $response->assertOk();
        $this->assertStringContainsString('/storage/pr-submission-videos/', $response->json('data.video_url'));
        Storage::disk('public')->assertExists('pr-submission-videos/'.$file->hashName());
    }

    public function test_another_users_submission_cannot_receive_a_video(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $owner->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);
        $file = UploadedFile::fake()->create('lift.mp4', 5000, 'video/mp4');

        $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file])
            ->assertForbidden();
    }

    public function test_video_cannot_be_changed_once_reviewed(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/original.mp4', 'status' => 'approved',
        ]);
        $file = UploadedFile::fake()->create('replacement.mp4', 5000, 'video/mp4');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file])
            ->assertStatus(422);
    }

    public function test_a_regular_user_cannot_approve_their_own_pr_even_via_a_direct_api_call(): void
    {
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Ni siquiera con el endpoint de admin manipulado a mano: role:super_admin bloquea antes de llegar al controller.
        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved'])
            ->assertForbidden();

        $this->assertSame('pending', $submission->fresh()->status);
    }

    public function test_super_admin_can_approve_a_submission_with_video(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved']);

        $response->assertOk();
        $response->assertJsonPath('data.status', 'approved');
        $fresh = $submission->fresh();
        $this->assertSame($admin->id, $fresh->reviewed_by);
        $this->assertNotNull($fresh->reviewed_at);
    }

    public function test_super_admin_cannot_approve_a_submission_without_a_video(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved'])
            ->assertStatus(422);

        $this->assertSame('pending', $submission->fresh()->status);
    }

    public function test_super_admin_can_reject_with_a_reason_and_it_never_reaches_rankings_eligibility(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", [
                'status' => 'rejected', 'rejection_reason' => 'El video no muestra el rango completo de movimiento.',
            ]);

        $response->assertOk();
        $response->assertJsonPath('data.status', 'rejected');
        $response->assertJsonPath('data.rejection_reason', 'El video no muestra el rango completo de movimiento.');
        $this->assertSame(0, PrSubmission::query()->approved()->count());
    }

    public function test_rejection_requires_a_reason(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'rejected'])
            ->assertStatus(422);
    }

    public function test_an_already_reviewed_submission_cannot_be_reviewed_again(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        $submission = PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            'video_url' => '/storage/pr-submission-videos/proof.mp4', 'status' => 'approved',
            'reviewed_by' => $admin->id, 'reviewed_at' => now(),
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'rejected', 'rejection_reason' => 'cambio de opinión'])
            ->assertStatus(422);
    }

    public function test_admin_queue_defaults_to_pending_and_can_filter_by_status(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $exercise = $this->makeExercise();
        PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67, 'status' => 'pending',
        ]);
        PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            'weight_kg' => 110, 'reps' => 5, 'estimated_1rm' => 128.33, 'status' => 'approved',
        ]);

        $client = $this->actingAs($admin, 'sanctum');

        $pending = $client->getJson('/api/v1/admin/pr-submissions');
        $this->assertCount(1, $pending->json('data'));

        $approved = $client->getJson('/api/v1/admin/pr-submissions?status=approved');
        $this->assertCount(1, $approved->json('data'));

        $all = $client->getJson('/api/v1/admin/pr-submissions?status=all');
        $this->assertCount(2, $all->json('data'));
    }
}
