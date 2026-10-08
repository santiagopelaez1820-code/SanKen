<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Media.

namespace Tests\Feature\Media;

// Esta línea sirve para importar la clase CloudinaryClient.
use App\Infrastructure\Media\CloudinaryClient;
// Esta línea sirve para importar la clase CloudinaryMediaStorage.
use App\Infrastructure\Media\CloudinaryMediaStorage;
// Esta línea sirve para importar la clase CloudinaryUrl.
use App\Infrastructure\Media\CloudinaryUrl;
// Esta línea sirve para importar la clase LocalPublicMediaStorage.
use App\Infrastructure\Media\LocalPublicMediaStorage;
// Esta línea sirve para importar la clase MediaStorage.
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo MuscleGroup.
use App\Models\MuscleGroup;
// Esta línea sirve para importar el modelo Product.
use App\Models\Product;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar UploadedFile para simular archivos subidos.
use Illuminate\Http\UploadedFile;
// Esta línea sirve para importar la fachada Storage.
use Illuminate\Support\Facades\Storage;
// Esta línea sirve para importar la clase FakeCloudinaryClient.
use Tests\Support\FakeCloudinaryClient;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests CloudinaryMediaStorageTest.
class CloudinaryMediaStorageTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el cliente falso de Cloudinary.
    private FakeCloudinaryClient $cloudinary;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();

        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para configurar Cloudinary para este test.
        config([
            // Esta línea sirve para asignar 'cloudinary' al campo "services.cloudinary.storage".
            'services.cloudinary.storage' => 'cloudinary',
            // Esta línea sirve para asignar 'demo-cloud' al campo "services.cloudinary.cloud_name".
            'services.cloudinary.cloud_name' => 'demo-cloud',
            // Esta línea sirve para asignar 'test-key' al campo "services.cloudinary.api_key".
            'services.cloudinary.api_key' => 'test-key',
            // Esta línea sirve para asignar 'test-secret' al campo "services.cloudinary.api_secret".
            'services.cloudinary.api_secret' => 'test-secret',
            // Esta línea sirve para asignar 'sanken' al campo "services.cloudinary.folder".
            'services.cloudinary.folder' => 'sanken',
        ]);
        // Esta línea sirve para crear el cliente falso.
        $this->cloudinary = new FakeCloudinaryClient;
        // Esta línea sirve para registrarlo en el contenedor.
        $this->app->instance(CloudinaryClient::class, $this->cloudinary);
    }

    // Esta línea sirve para declarar el test que comprueba que el almacenamiento es local salvo que Cloudinary esté bien configurado.
    public function test_storage_driver_is_local_unless_cloudinary_is_fully_configured(): void
    {
        // Esta línea sirve para exigir que con la configuración completa se use Cloudinary.
        $this->assertInstanceOf(CloudinaryMediaStorage::class, app(MediaStorage::class));

        // Esta línea sirve para configurar "services.cloudinary.api_secret" con el valor null para este test.
        config(['services.cloudinary.api_secret' => null]);
        // Esta línea sirve para exigir que sin configuración se use el disco local.
        $this->assertInstanceOf(LocalPublicMediaStorage::class, app(MediaStorage::class));

        // Esta línea sirve para configurar "services.cloudinary.api_secret" con el valor 'test-secret', 'services.cloudinary.storage' => 'local' para este test.
        config(['services.cloudinary.api_secret' => 'test-secret', 'services.cloudinary.storage' => 'local']);
        // Esta línea sirve para exigir que con configuración parcial se use el disco local.
        $this->assertInstanceOf(LocalPublicMediaStorage::class, app(MediaStorage::class));
    }

    // Esta línea sirve para declarar el test que comprueba que la foto de perfil va a Cloudinary con un identificador estable.
    public function test_avatar_upload_goes_to_cloudinary_with_a_stable_public_id(): void
    {
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
        // Esta línea sirve para exigir que apunte a Cloudinary.
        $this->assertStringStartsWith('https://res.cloudinary.com/demo-cloud/image/upload/', $url);
        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea $url.
        $this->assertSame($url, $user->fresh()->avatar_url);
        // Esta línea sirve para exigir que se haya subido con el identificador y tipo esperados.
        $this->assertSame([['public_id' => "sanken/users/avatars/user_{$user->id}", 'resource_type' => 'image']], $this->cloudinary->uploads);
        // Nada en el disco local.
        // Esta línea sirve para exigir que no quede nada en el disco local.
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar la foto sobrescribe el mismo archivo y no lo borra.
    public function test_replacing_an_avatar_overwrites_the_same_asset_instead_of_deleting_it(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con los datos enviados.
        $first = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('a.jpg')]);
        // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar autenticado como user con los datos enviados.
        $second = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('b.jpg')]);

        // Misma public_id, URL nueva (versión distinta): ningún cliente ve la vieja cacheada.
        // Esta línea sirve para exigir que las URLs sean distintas.
        $this->assertNotSame($first->json('data.avatar_url'), $second->json('data.avatar_url'));
        // Esta línea sirve para exigir que no se haya borrado nada.
        $this->assertSame([], $this->cloudinary->destroyed);
        // Esta línea sirve para exigir que haya un solo archivo en Cloudinary.
        $this->assertCount(1, $this->cloudinary->assets);
    }

    // Esta línea sirve para declarar el test que comprueba que reemplazar una foto local antigua borra el archivo local.
    public function test_replacing_a_legacy_local_avatar_deletes_the_local_file(): void
    {
        // Esta línea sirve para guardar la foto antigua en el disco.
        Storage::disk('public')->put('avatars/old.jpg', 'x');
        // Esta línea sirve para crear un usuario con esa foto.
        $user = User::factory()->create(['avatar_url' => '/storage/avatars/old.jpg']);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar con los datos enviados.
            ->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('new.jpg')])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que el archivo ya no exista en el disco.
        Storage::disk('public')->assertMissing('avatars/old.jpg');
    }

    // Esta línea sirve para declarar el test que comprueba que borrar la foto destruye el archivo de Cloudinary.
    public function test_deleting_an_avatar_destroys_the_cloudinary_asset(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para subir una foto como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('a.jpg')]);

        // Esta línea sirve para borrar la foto como el usuario.
        $this->actingAs($user, 'sanctum')->deleteJson('/api/v1/auth/me/avatar')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.avatar_url" sea null.
            ->assertJsonPath('data.avatar_url', null);

        // Esta línea sirve para exigir que se haya destruido el archivo esperado.
        $this->assertSame(["sanken/users/avatars/user_{$user->id}"], $this->cloudinary->destroyed);
    }

    // Esta línea sirve para declarar el test que comprueba que un fallo de subida conserva la foto anterior.
    public function test_a_failed_upload_keeps_the_previous_avatar(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para subir una foto como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('a.jpg')]);
        // Esta línea sirve para guardar la URL de la foto actual.
        $before = $user->fresh()->avatar_url;

        // Esta línea sirve para hacer que las subidas fallen.
        $this->cloudinary->failUploads = true;
        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/me/avatar con los datos enviados.
            ->postJson('/api/v1/auth/me/avatar', ['avatar' => UploadedFile::fake()->image('b.jpg')])
            // Esta línea sirve para exigir que la respuesta sea 500.
            ->assertStatus(500);

        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea $before.
        $this->assertSame($before, $user->fresh()->avatar_url);
        // Esta línea sirve para exigir que no se haya destruido nada.
        $this->assertSame([], $this->cloudinary->destroyed);
    }

    // Esta línea sirve para declarar el test que comprueba que las URLs ajenas nunca se borran.
    public function test_foreign_urls_are_never_deleted(): void
    {
        // Esta línea sirve para obtener el almacenamiento.
        $storage = app(MediaStorage::class);

        // Esta línea sirve para intentar borrar una URL de otra cuenta de Cloudinary.
        $storage->delete('https://res.cloudinary.com/otra-cuenta/image/upload/v1/sanken/users/avatars/user_1.jpg');
        // Esta línea sirve para intentar borrar una URL fuera de la carpeta de la app.
        $storage->delete('https://res.cloudinary.com/demo-cloud/image/upload/v1/otra-app/foto.jpg');
        // Esta línea sirve para intentar borrar una URL externa.
        $storage->delete('https://example.com/video.mp4');

        // Esta línea sirve para exigir que no se haya destruido nada.
        $this->assertSame([], $this->cloudinary->destroyed);
    }

    // Esta línea sirve para declarar el test que comprueba que la imagen de producto y el video de ejercicio usan sus carpetas y tipos.
    public function test_product_image_and_exercise_video_use_their_folders_and_resource_types(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();
        // Esta línea sirve para crear un ejercicio.
        $exercise = $this->makeExercise();

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/products/{$product->id}/image con los datos enviados.
            ->postJson("/api/v1/admin/products/{$product->id}/image", ['image' => UploadedFile::fake()->image('p.png')])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/exercises/{$exercise->id}/video con los datos enviados.
            ->postJson("/api/v1/admin/exercises/{$exercise->id}/video", ['video' => UploadedFile::fake()->create('v.mp4', 500, 'video/mp4')])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que las subidas sean exactamente estas.
        $this->assertSame([
            // Esta línea sirve para exigir la imagen del producto en su carpeta.
            ['public_id' => "sanken/store/products/product_{$product->id}", 'resource_type' => 'image'],
            // Esta línea sirve para exigir el video del ejercicio en su carpeta.
            ['public_id' => "sanken/exercises/videos/exercise_{$exercise->id}", 'resource_type' => 'video'],
            // Esta línea sirve para comparar con las subidas registradas.
        ], $this->cloudinary->uploads);
        // Esta línea sirve para exigir que la URL del video apunte a Cloudinary.
        $this->assertStringStartsWith('https://res.cloudinary.com/demo-cloud/video/upload/', $exercise->fresh()->video_url);
    }

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

    // Esta línea sirve para declarar el test que comprueba la lectura de URLs de Cloudinary.
    public function test_cloudinary_url_parsing(): void
    {
        // Esta línea sirve para exigir que una imagen se lea bien.
        $this->assertSame(
            // Esta línea sirve para indicar el resultado esperado.
            ['resource_type' => 'image', 'public_id' => 'sanken/users/avatars/user_12'],
            // Esta línea sirve para leer la URL de una imagen.
            CloudinaryUrl::parse('https://res.cloudinary.com/demo-cloud/image/upload/v1712/sanken/users/avatars/user_12.jpg', 'demo-cloud'),
        );
        // Esta línea sirve para exigir que un video se lea bien.
        $this->assertSame(
            // Esta línea sirve para indicar el resultado esperado.
            ['resource_type' => 'video', 'public_id' => 'sanken/exercises/videos/exercise_3'],
            // Esta línea sirve para leer la URL de un video.
            CloudinaryUrl::parse('https://res.cloudinary.com/demo-cloud/video/upload/sanken/exercises/videos/exercise_3.mov', 'demo-cloud'),
        );
        // Esta línea sirve para exigir que una URL de otra cuenta devuelva null.
        $this->assertNull(CloudinaryUrl::parse('https://res.cloudinary.com/otra/image/upload/v1/a.jpg', 'demo-cloud'));
        // Esta línea sirve para exigir que una ruta local devuelva null.
        $this->assertNull(CloudinaryUrl::parse('/storage/avatars/a.jpg', 'demo-cloud'));
        // Esta línea sirve para exigir que una URL vacía devuelva null.
        $this->assertNull(CloudinaryUrl::parse(null, 'demo-cloud'));
    }
}
