<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo MuscleGroup.
use App\Models\MuscleGroup;
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

// Esta línea sirve para declarar la clase de tests AdminExerciseApiTest.
class AdminExerciseApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un grupo muscular.
    private function makeMuscleGroup(): MuscleGroup
    {
        // Esta línea sirve para crear y devolver el grupo muscular "Pecho".
        return MuscleGroup::query()->create(['name' => 'Pecho', 'slug' => 'pecho']);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar ejercicios.
    public function test_non_admin_cannot_manage_exercises(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();

        // Esta línea sirve para hacer la petición a /api/v1/admin/exercises como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/exercises', [
            // Esta línea sirve para enviar el nombre y el músculo principal.
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para enviar el equipamiento, el nivel y el tipo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound',
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 403 (prohibido).
        ])->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear un ejercicio.
    public function test_admin_can_create_an_exercise(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();

        // Esta línea sirve para hacer POST a /api/v1/admin/exercises autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/exercises', [
            // Esta línea sirve para asignar 'Press banca' al campo "name".
            'name' => 'Press banca',
            // Esta línea sirve para asignar $muscle->id al campo "primary_muscle_id".
            'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar 'barbell' al campo "equipment".
            'equipment' => 'barbell',
            // Esta línea sirve para asignar 'beginner' al campo "level".
            'level' => 'beginner',
            // Esta línea sirve para asignar 'compound' al campo "type".
            'type' => 'compound',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.is_active" sea verdadero.
        $this->assertTrue($response->json('data.is_active'));
        // Esta línea sirve para exigir que la tabla exercises tenga ese registro.
        $this->assertDatabaseHas('exercises', ['name' => 'Press banca']);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede editar un ejercicio.
    public function test_admin_can_update_an_exercise(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();
        // Esta línea sirve para crear un ejercicio activo.
        $exercise = Exercise::query()->create([
            // Esta línea sirve para asignar el nombre y el músculo principal.
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar el equipamiento, el nivel, el tipo y dejarlo activo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/exercises/{$exercise->id} con los datos enviados.
            ->patchJson("/api/v1/admin/exercises/{$exercise->id}", ['name' => 'Press banca inclinado']);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.name" sea exactamente 'Press banca inclinado'.
        $this->assertSame('Press banca inclinado', $response->json('data.name'));
    }

    // Esta línea sirve para declarar el test que comprueba que borrar un ejercicio lo desactiva en vez de eliminarlo.
    public function test_destroy_deactivates_instead_of_deleting_the_row(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();
        // Esta línea sirve para crear un ejercicio activo.
        $exercise = Exercise::query()->create([
            // Esta línea sirve para asignar el nombre y el músculo principal.
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar el equipamiento, el nivel, el tipo y dejarlo activo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/admin/exercises/{$exercise->id}.
            ->deleteJson("/api/v1/admin/exercises/{$exercise->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_active" sea falso.
        $this->assertFalse($response->json('data.is_active'));
        // Esta línea sirve para exigir que la tabla exercises tenga ese registro.
        $this->assertDatabaseHas('exercises', ['id' => $exercise->id, 'is_active' => false]);
    }

    // Esta línea sirve para declarar el test que comprueba que el listado del admin incluye los ejercicios inactivos.
    public function test_admin_exercises_index_includes_inactive_ones(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();
        // Esta línea sirve para crear un ejercicio inactivo.
        Exercise::query()->create([
            // Esta línea sirve para asignar el nombre y el músculo principal.
            'name' => 'Inactivo', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar el equipamiento, el nivel, el tipo y dejarlo inactivo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => false,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/admin/exercises autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/exercises');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
    }

    // Esta línea sirve para declarar el método auxiliar que crea un ejercicio activo.
    private function makeExercise(): Exercise
    {
        // Esta línea sirve para crear un grupo muscular.
        $muscle = $this->makeMuscleGroup();

        // Esta línea sirve para crear y devolver el ejercicio.
        return Exercise::query()->create([
            // Esta línea sirve para asignar el nombre y el músculo principal.
            'name' => 'Press banca', 'primary_muscle_id' => $muscle->id,
            // Esta línea sirve para asignar el equipamiento, el nivel, el tipo y dejarlo activo.
            'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'compound', 'is_active' => true,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede subir un video.
    public function test_admin_can_upload_a_video_for_an_exercise(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para simular un archivo de video mp4.
        $file = UploadedFile::fake()->create('squat.mp4', 5000, 'video/mp4');

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/exercises/{$exercise->id}/video con los datos enviados.
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.video_url" no sea null.
        $this->assertNotNull($response->json('data.video_url'));
        // Esta línea sirve para exigir que la URL apunte a la carpeta de videos de ejercicios.
        $this->assertStringContainsString('/storage/exercise-videos/', $response->json('data.video_url'));
        // Esta línea sirve para exigir que el archivo se haya guardado en el disco.
        Storage::disk('public')->assertExists('exercise-videos/'.$file->hashName());
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza un archivo que no es video.
    public function test_non_video_file_is_rejected(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para simular un archivo PDF.
        $file = UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf');

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/exercises/{$exercise->id}/video con los datos enviados.
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar el video borra el anterior después de guardar el nuevo.
    public function test_replacing_a_video_deletes_the_old_file_after_the_new_one_is_saved(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');

        // Esta línea sirve para simular el primer video.
        $first = UploadedFile::fake()->create('v1.mp4', 1000, 'video/mp4');
        // Esta línea sirve para subir el primer video.
        $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $first]);
        // Esta línea sirve para calcular la ruta donde quedó el primer video.
        $firstPath = 'exercise-videos/'.$first->hashName();
        // Esta línea sirve para exigir que el primer video exista en el disco.
        Storage::disk('public')->assertExists($firstPath);

        // Esta línea sirve para simular el segundo video.
        $second = UploadedFile::fake()->create('v2.mp4', 1000, 'video/mp4');
        // Esta línea sirve para subir el segundo video.
        $response = $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $second]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que el segundo video exista en el disco.
        Storage::disk('public')->assertExists('exercise-videos/'.$second->hashName());
        // Esta línea sirve para exigir que el primer video ya no exista.
        Storage::disk('public')->assertMissing($firstPath);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede borrar el video y el ejercicio sigue funcionando.
    public function test_admin_can_delete_a_video_and_the_exercise_keeps_working(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');

        // Esta línea sirve para simular un archivo de video.
        $file = UploadedFile::fake()->create('squat.mp4', 1000, 'video/mp4');
        // Esta línea sirve para subir el video.
        $client->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file]);
        // Esta línea sirve para calcular la ruta donde quedó el video.
        $path = 'exercise-videos/'.$file->hashName();

        // Esta línea sirve para hacer DELETE del video.
        $response = $client->deleteJson("/api/v1/admin/exercises/{$exercise->id}/video");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.video_url" sea null.
        $this->assertNull($response->json('data.video_url'));
        // Esta línea sirve para exigir que el archivo ya no exista.
        Storage::disk('public')->assertMissing($path);
        // Esta línea sirve para exigir que la tabla exercises tenga ese registro.
        $this->assertDatabaseHas('exercises', ['id' => $exercise->id, 'is_active' => true, 'video_url' => null]);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede subir videos.
    public function test_non_admin_cannot_upload_exercise_videos(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();
        // Esta línea sirve para simular un archivo de video.
        $file = UploadedFile::fake()->create('squat.mp4', 1000, 'video/mp4');

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/exercises/{$exercise->id}/video con los datos enviados.
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => $file])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }
}
