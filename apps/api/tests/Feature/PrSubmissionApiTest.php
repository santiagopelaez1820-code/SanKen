<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo MuscleGroup.
use App\Models\MuscleGroup;
// Esta línea sirve para importar el modelo PrSubmission.
use App\Models\PrSubmission;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar UploadedFile para simular archivos subidos.
use Illuminate\Http\UploadedFile;
// Esta línea sirve para importar la fachada Storage.
use Illuminate\Support\Facades\Storage;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests PrSubmissionApiTest.
class PrSubmissionApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un ejercicio.
    private function makeExercise(): Exercise
    {
        // Esta línea sirve para crear un grupo muscular.
        $muscle = MuscleGroup::query()->create(['name' => 'Pecho', 'slug' => 'pecho']);

        // Esta línea sirve para crear y devolver el ejercicio.
        return Exercise::query()->create([
            // Esta línea sirve para asignar el nombre y el músculo principal.
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar el equipamiento, el nivel, el tipo y dejarlo activo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/pr-submissions sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/pr-submissions', [])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede postular un PR para revisión.
    public function test_user_can_submit_a_pr_for_review(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();

        // Esta línea sirve para hacer POST a /api/v1/pr-submissions autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/pr-submissions', [
            // Esta línea sirve para enviar el ejercicio, el peso y las repeticiones.
            'exercise_id' => $exercise->id, 'weight_kg' => 100, 'reps' => 5,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.status" sea 'pending'.
        $response->assertJsonPath('data.status', 'pending');
        // Esta línea sirve para exigir que "data.exercise.id" sea $exercise->id.
        $response->assertJsonPath('data.exercise.id', $exercise->id);
        // Esta línea sirve para exigir que el 1RM estimado sea 116,67.
        $this->assertEquals(116.67, (float) $response->json('data.estimated_1rm'));
        // Esta línea sirve para exigir que la tabla pr_submissions tenga un registro con estos datos.
        $this->assertDatabaseHas('pr_submissions', [
            // Esta línea sirve para exigir que la postulación quede pendiente en la base de datos.
            'user_id' => $user->id, 'exercise_id' => $exercise->id, 'status' => 'pending',
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que una postulación nunca toca el récord automático de gamificación.
    public function test_a_new_pr_never_touches_the_automatic_personal_record_used_for_gamification(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();

        // Esta línea sirve para hacer la petición a /api/v1/pr-submissions como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/pr-submissions', [
            // Esta línea sirve para enviar el ejercicio, el peso y las repeticiones.
            'exercise_id' => $exercise->id, 'weight_kg' => 100, 'reps' => 5,
            // Esta línea sirve para cerrar los datos y exigir 201.
        ])->assertCreated();

        // La postulación es una tabla totalmente separada -- personal_records
        // (la detección automática privada) no se toca por esto.
        // Esta línea sirve para exigir que la tabla personal_records tenga 0 registros.
        $this->assertDatabaseCount('personal_records', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario solo ve sus propias postulaciones.
    public function test_user_sees_only_their_own_submissions(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación del dueño.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $owner->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/pr-submissions autenticado como stranger.
        $response = $this->actingAs($stranger, 'sanctum')->getJson('/api/v1/pr-submissions');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $this->assertCount(0, $response->json('data'));
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede subir el video de su postulación pendiente.
    public function test_user_can_upload_evidence_video_for_their_own_pending_submission(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación pendiente.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);
        // Esta línea sirve para simular un archivo de video mp4.
        $file = UploadedFile::fake()->create('lift.mp4', 5000, 'video/mp4');

        // Esta línea sirve para preparar la petición autenticada como user.
        $response = $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/pr-submissions/{$submission->id}/video con los datos enviados.
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la URL apunte a la carpeta de videos de PR.
        $this->assertStringContainsString('/storage/pr-submission-videos/', $response->json('data.video_url'));
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists('pr-submission-videos/'.$file->hashName());
    }

    // Esta línea sirve para declarar el test que comprueba que la postulación de otro usuario no puede recibir un video.
    public function test_another_users_submission_cannot_receive_a_video(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación del dueño.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $owner->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);
        // Esta línea sirve para simular un archivo de video mp4.
        $file = UploadedFile::fake()->create('lift.mp4', 5000, 'video/mp4');

        // Esta línea sirve para preparar la petición autenticada como stranger.
        $this->actingAs($stranger, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/pr-submissions/{$submission->id}/video con los datos enviados.
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el video no se puede cambiar una vez revisada.
    public function test_video_cannot_be_changed_once_reviewed(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación ya aprobada.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar el video y el estado aprobado.
            'video_url' => '/storage/pr-submission-videos/original.mp4', 'status' => 'approved',
        ]);
        // Esta línea sirve para simular un archivo de video de reemplazo.
        $file = UploadedFile::fake()->create('replacement.mp4', 5000, 'video/mp4');

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/pr-submissions/{$submission->id}/video con los datos enviados.
            ->postJson("/api/v1/pr-submissions/{$submission->id}/video", ['video' => $file])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede aprobar su PR ni llamando directo a la API.
    public function test_a_regular_user_cannot_approve_their_own_pr_even_via_a_direct_api_call(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación pendiente.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar '/storage/pr-submission-videos/proof.mp4' al campo "video_url".
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Ni siquiera con el endpoint de admin manipulado a mano: role:super_admin bloquea antes de llegar al controller.
        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/pr-submissions/{$submission->id}/review con los datos enviados.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved'])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que en la base de datos "status" sea 'pending'.
        $this->assertSame('pending', $submission->fresh()->status);
    }

    // Esta línea sirve para declarar el test que comprueba que el super admin puede aprobar una postulación con video.
    public function test_super_admin_can_approve_a_submission_with_video(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación con video.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar '/storage/pr-submission-videos/proof.mp4' al campo "video_url".
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/pr-submissions/{$submission->id}/review con los datos enviados.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved']);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.status" sea 'approved'.
        $response->assertJsonPath('data.status', 'approved');
        // Esta línea sirve para recargar la postulación.
        $fresh = $submission->fresh();
        // Esta línea sirve para exigir que "reviewed_by" sea exactamente $admin->id.
        $this->assertSame($admin->id, $fresh->reviewed_by);
        // Esta línea sirve para exigir que "reviewed_at" no sea null.
        $this->assertNotNull($fresh->reviewed_at);
    }

    // Esta línea sirve para declarar el test que comprueba que el super admin no puede aprobar una postulación sin video.
    public function test_super_admin_cannot_approve_a_submission_without_a_video(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación sin video.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/pr-submissions/{$submission->id}/review con los datos enviados.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'approved'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);

        // Esta línea sirve para exigir que en la base de datos "status" sea 'pending'.
        $this->assertSame('pending', $submission->fresh()->status);
    }

    // Esta línea sirve para declarar el test que comprueba que el super admin puede rechazar con un motivo y no entra a los rankings.
    public function test_super_admin_can_reject_with_a_reason_and_it_never_reaches_rankings_eligibility(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación pendiente.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar '/storage/pr-submission-videos/proof.mp4' al campo "video_url".
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH para revisar la postulación con estos datos.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", [
                // Esta línea sirve para enviar el estado rechazado y el motivo.
                'status' => 'rejected', 'rejection_reason' => 'El video no muestra el rango completo de movimiento.',
            ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.status" sea 'rejected'.
        $response->assertJsonPath('data.status', 'rejected');
        // Esta línea sirve para exigir que "data.rejection_reason" sea 'El video no muestra el rango completo de movimiento.'.
        $response->assertJsonPath('data.rejection_reason', 'El video no muestra el rango completo de movimiento.');
        // Esta línea sirve para exigir que no haya postulaciones aprobadas.
        $this->assertSame(0, PrSubmission::query()->approved()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que rechazar exige un motivo.
    public function test_rejection_requires_a_reason(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación pendiente.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar '/storage/pr-submission-videos/proof.mp4' al campo "video_url".
            'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/pr-submissions/{$submission->id}/review con los datos enviados.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'rejected'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que una postulación ya revisada no se puede revisar de nuevo.
    public function test_an_already_reviewed_submission_cannot_be_reviewed_again(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación ya aprobada.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones y 1RM estimado.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67,
            // Esta línea sirve para asignar el video y el estado aprobado.
            'video_url' => '/storage/pr-submission-videos/proof.mp4', 'status' => 'approved',
            // Esta línea sirve para asignar quién la revisó y cuándo.
            'reviewed_by' => $admin->id, 'reviewed_at' => now(),
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/pr-submissions/{$submission->id}/review con los datos enviados.
            ->patchJson("/api/v1/admin/pr-submissions/{$submission->id}/review", ['status' => 'rejected', 'rejection_reason' => 'cambio de opinión'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que la cola del admin muestra pendientes por defecto y se filtra por estado.
    public function test_admin_queue_defaults_to_pending_and_can_filter_by_status(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para crear una postulación pendiente.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones, 1RM y estado pendiente.
            'weight_kg' => 100, 'reps' => 5, 'estimated_1rm' => 116.67, 'status' => 'pending',
        ]);
        // Esta línea sirve para crear una postulación aprobada.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exercise->id,
            // Esta línea sirve para asignar peso, repeticiones, 1RM y estado aprobado.
            'weight_kg' => 110, 'reps' => 5, 'estimated_1rm' => 128.33, 'status' => 'approved',
        ]);

        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');

        // Esta línea sirve para pedir la cola sin filtro.
        $pending = $client->getJson('/api/v1/admin/pr-submissions');
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $pending->json('data'));

        // Esta línea sirve para pedir las aprobadas.
        $approved = $client->getJson('/api/v1/admin/pr-submissions?status=approved');
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $approved->json('data'));

        // Esta línea sirve para pedir todas.
        $all = $client->getJson('/api/v1/admin/pr-submissions?status=all');
        // Esta línea sirve para exigir que "data" tenga 2 elementos.
        $this->assertCount(2, $all->json('data'));
    }
}
