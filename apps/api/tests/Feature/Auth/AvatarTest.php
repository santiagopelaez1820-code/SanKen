<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

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

// Esta línea sirve para declarar la clase de tests AvatarTest.
class AvatarTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que el usuario puede subir su foto de perfil.
    public function test_user_can_upload_an_avatar(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('avatar.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener la URL de la foto.
        $url = $response->json('data.avatar_url');
        // Esta línea sirve para exigir que url exista (no sea null).
        $this->assertNotNull($url);
        // Esta línea sirve para exigir que la URL empiece por /storage/avatars/.
        $this->assertStringStartsWith('/storage/avatars/', $url);

        // Esta línea sirve para calcular la ruta del archivo en el disco.
        $path = str_replace('/storage/', '', $url);
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists($path);

        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea $url.
        $this->assertSame($url, $user->fresh()->avatar_url);
    }

    // Esta línea sirve para declarar el test que comprueba que subir una foto nueva borra la anterior.
    public function test_uploading_a_new_avatar_deletes_the_previous_file(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $first = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('first.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('first.jpg'),
        ]);
        // Esta línea sirve para calcular la ruta de la primera foto.
        $firstPath = str_replace('/storage/', '', $first->json('data.avatar_url'));

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $second = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('second.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('second.jpg'),
        ]);
        // Esta línea sirve para calcular la ruta de la segunda foto.
        $secondPath = str_replace('/storage/', '', $second->json('data.avatar_url'));

        // Esta línea sirve para exigir que el archivo ya no exista en el disco.
        Storage::disk('public')->assertMissing($firstPath);
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists($secondPath);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede borrar su foto.
    public function test_user_can_delete_their_avatar(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $upload = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('avatar.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);
        // Esta línea sirve para calcular la ruta de la foto subida.
        $path = str_replace('/storage/', '', $upload->json('data.avatar_url'));

        // Esta línea sirve para hacer DELETE a /api/v1/auth/me/avatar autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/v1/auth/me/avatar');

        // Esta línea sirve para exigir 200 y que "data.avatar_url" sea null.
        $response->assertOk()->assertJsonPath('data.avatar_url', null);
        // Esta línea sirve para exigir que el archivo ya no exista en el disco.
        Storage::disk('public')->assertMissing($path);
        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea null.
        $this->assertNull($user->fresh()->avatar_url);
    }

    // Esta línea sirve para declarar el test que comprueba que se puede subir una foto GIF.
    public function test_user_can_upload_a_gif_avatar(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('avatar.gif') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('avatar.gif'),
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.avatar_url" no sea null.
        $this->assertNotNull($response->json('data.avatar_url'));
    }

    // Esta línea sirve para declarar el test que comprueba que se rechazan archivos que no son imágenes.
    public function test_avatar_upload_rejects_non_image_files(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->create('document.pdf', 100, 'application/pdf') al campo "avatar".
            'avatar' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "avatar".
        $response->assertUnprocessable()->assertJsonValidationErrors('avatar');
    }

    // Esta línea sirve para declarar el test que comprueba que subir la foto exige estar autenticado.
    public function test_avatar_upload_requires_authentication(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('avatar.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        // Esta línea sirve para exigir que la respuesta sea 401 (no autenticado).
        $response->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede cambiar la foto de otro.
    public function test_user_cannot_change_another_users_avatar(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $attacker = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/auth/me/avatar como attacker con estos datos.
        $this->actingAs($attacker, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            // Esta línea sirve para asignar UploadedFile::fake()->image('avatar.jpg') al campo "avatar".
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        ])->assertOk();

        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea null.
        $this->assertNull($owner->fresh()->avatar_url);
        // Esta línea sirve para exigir que en la base de datos "avatar_url" no sea null.
        $this->assertNotNull($attacker->fresh()->avatar_url);
    }
}
