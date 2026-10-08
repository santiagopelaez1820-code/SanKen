<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Media.

namespace Tests\Feature\Media;

// Esta línea sirve para importar la clase CloudinaryClient.
use App\Infrastructure\Media\CloudinaryClient;
// Esta línea sirve para importar el modelo Product.
use App\Models\Product;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada File.
use Illuminate\Support\Facades\File;
// Esta línea sirve para importar la fachada Http.
use Illuminate\Support\Facades\Http;
// Esta línea sirve para importar la fachada Storage.
use Illuminate\Support\Facades\Storage;
// Esta línea sirve para importar la clase FakeCloudinaryClient.
use Tests\Support\FakeCloudinaryClient;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests CloudinaryMediaCommandTest.
class CloudinaryMediaCommandTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el cliente falso de Cloudinary.
    private FakeCloudinaryClient $cloudinary;

    // Esta línea sirve para guardar la ruta del archivo de registro de la migración.
    private string $mapPath;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();

        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para definir una ruta temporal única para el registro.
        $this->mapPath = sys_get_temp_dir().'/sanken-media-map-'.uniqid().'.json';
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
            // Esta línea sirve para asignar $this->mapPath al campo "services.cloudinary.map_path".
            'services.cloudinary.map_path' => $this->mapPath,
        ]);
        // Esta línea sirve para crear el cliente falso.
        $this->cloudinary = new FakeCloudinaryClient;
        // Esta línea sirve para registrarlo en el contenedor.
        $this->app->instance(CloudinaryClient::class, $this->cloudinary);
    }

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para borrar el archivo de registro.
        File::delete($this->mapPath);
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
    }

    // Esta línea sirve para declarar el test que comprueba que migrar sube los archivos locales y actualiza las filas.
    public function test_migrate_uploads_local_files_and_updates_the_rows(): void
    {
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para guardar un archivo de imagen de producto en el disco.
        Storage::disk('public')->put('product-images/p.png', 'product-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        $user = User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Esta línea sirve para crear un producto con imagen local.
        $product = Product::factory()->create(['image' => '/storage/product-images/p.png']);
        // Esta línea sirve para crear un usuario con foto externa.
        $external = User::factory()->create(['avatar_url' => 'https://example.com/foto.jpg']);

        // Esta línea sirve para ejecutar la migración y exigir que termine bien.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para exigir que la foto del usuario apunte a Cloudinary.
        $this->assertStringStartsWith('https://res.cloudinary.com/demo-cloud/image/upload/', $user->fresh()->avatar_url);
        // Esta línea sirve para exigir que la imagen del producto use su carpeta y nombre estable.
        $this->assertStringContainsString("sanken/store/products/product_{$product->id}", $product->fresh()->image);
        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea 'https://example.com/foto.jpg'.
        $this->assertSame('https://example.com/foto.jpg', $external->fresh()->avatar_url);
        // Migrar nunca borra: los originales siguen hasta el cleanup.
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists('avatars/a.jpg');

        // Esta línea sirve para leer el registro de la migración.
        $map = json_decode(File::get($this->mapPath), true);
        // Esta línea sirve para obtener la entrada de la foto del usuario.
        $entry = $map["users.avatar_url#{$user->id}"];
        // Esta línea sirve para exigir que esté marcada como aplicada.
        $this->assertSame('applied', $entry['status']);
        // Esta línea sirve para exigir que guarde el hash del archivo.
        $this->assertSame(hash('sha256', 'avatar-bytes'), $entry['sha256']);
        // Esta línea sirve para exigir que guarde el identificador en Cloudinary.
        $this->assertSame("sanken/users/avatars/user_{$user->id}", $entry['publicId']);
        // Esta línea sirve para exigir que el secreto no aparezca en el registro.
        $this->assertStringNotContainsString('test-secret', File::get($this->mapPath));
    }

    // Esta línea sirve para declarar el test que comprueba que migrar dos veces no sube de nuevo.
    public function test_running_migrate_twice_does_not_upload_again(): void
    {
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);

        // Esta línea sirve para ejecutar la migración.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();
        // Esta línea sirve para ejecutarla otra vez.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para exigir que solo haya una subida.
        $this->assertCount(1, $this->cloudinary->uploads);
    }

    // Esta línea sirve para declarar el test que comprueba que una ejecución interrumpida se reanuda sin resubir.
    public function test_an_interrupted_run_resumes_without_reuploading_existing_assets(): void
    {
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        $user = User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Simula una corrida que subió el archivo y se cortó antes de
        // registrarlo: el asset existe en Cloudinary, pero no hay mapa.
        // Esta línea sirve para subir el archivo manualmente como si una corrida anterior lo hubiera hecho.
        $this->cloudinary->upload(Storage::disk('public')->path('avatars/a.jpg'), [
            // Esta línea sirve para indicar el identificador y el tipo del archivo.
            'public_id' => "sanken/users/avatars/user_{$user->id}", 'resource_type' => 'image',
        ]);
        // Esta línea sirve para vaciar la lista de subidas.
        $this->cloudinary->uploads = [];

        // Esta línea sirve para ejecutar la migración.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para exigir que no haya subidas nuevas.
        $this->assertSame([], $this->cloudinary->uploads);
        // Esta línea sirve para exigir que la foto del usuario apunte a Cloudinary.
        $this->assertStringStartsWith('https://res.cloudinary.com/', $user->fresh()->avatar_url);
    }

    // Esta línea sirve para declarar el test que comprueba que el modo de prueba no cambia nada.
    public function test_dry_run_changes_nothing(): void
    {
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        $user = User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);

        // Esta línea sirve para ejecutar la migración en modo de prueba.
        $this->artisan('media:cloudinary migrate --dry-run')->assertSuccessful();

        // Esta línea sirve para exigir que no haya subidas.
        $this->assertSame([], $this->cloudinary->uploads);
        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea '/storage/avatars/a.jpg'.
        $this->assertSame('/storage/avatars/a.jpg', $user->fresh()->avatar_url);
        // Esta línea sirve para exigir que no se cree el archivo de registro.
        $this->assertFileDoesNotExist($this->mapPath);
    }

    // Esta línea sirve para declarar el test que comprueba que un fallo se informa y la fila queda intacta.
    public function test_a_failure_is_reported_and_the_row_is_left_untouched(): void
    {
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        $user = User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Esta línea sirve para hacer que las subidas fallen.
        $this->cloudinary->failUploads = true;

        // Esta línea sirve para ejecutar la migración y exigir que falle.
        $this->artisan('media:cloudinary migrate')->assertFailed();

        // Esta línea sirve para exigir que en la base de datos "avatar_url" sea '/storage/avatars/a.jpg'.
        $this->assertSame('/storage/avatars/a.jpg', $user->fresh()->avatar_url);
        // Esta línea sirve para exigir que el registro marque la entrada como fallida.
        $this->assertSame('failed', json_decode(File::get($this->mapPath), true)["users.avatar_url#{$user->id}"]['status']);
    }

    // Esta línea sirve para declarar el test que comprueba que verificar revisa que cada URL de Cloudinary responda.
    public function test_verify_checks_that_every_cloudinary_url_responds(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake(['res.cloudinary.com/*' => Http::sequence()->push('', 200)->push('', 404)]);
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Esta línea sirve para ejecutar la migración.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para ejecutar la verificación y exigir que termine bien.
        $this->artisan('media:cloudinary verify')->assertSuccessful();
        // Esta línea sirve para ejecutar la verificación otra vez y exigir que falle.
        $this->artisan('media:cloudinary verify')->assertFailed();
    }

    // Esta línea sirve para declarar el test que comprueba que la limpieza solo borra con --force los archivos ya migrados.
    public function test_cleanup_only_deletes_with_force_and_only_migrated_unreferenced_files(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake(['res.cloudinary.com/*' => Http::response('', 200)]);
        // Esta línea sirve para guardar un archivo migrable en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para guardar un archivo que no se migra.
        Storage::disk('public')->put('avatars/untouched.jpg', 'otro');
        // Esta línea sirve para crear un usuario con foto local.
        User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Esta línea sirve para ejecutar la migración.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para ejecutar la limpieza sin --force.
        $this->artisan('media:cloudinary cleanup')->assertSuccessful();
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists('avatars/a.jpg');

        // Esta línea sirve para ejecutar la limpieza con --force.
        $this->artisan('media:cloudinary cleanup --force')->assertSuccessful();
        // Esta línea sirve para exigir que el archivo ya no exista en el disco.
        Storage::disk('public')->assertMissing('avatars/a.jpg');
        // Lo que no pasó por la migración no se toca.
        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists('avatars/untouched.jpg');
    }

    // Esta línea sirve para declarar el test que comprueba que la limpieza conserva los archivos si Cloudinary no responde.
    public function test_cleanup_keeps_files_while_cloudinary_does_not_respond(): void
    {
        // Esta línea sirve para simular las respuestas de los servicios HTTP externos.
        Http::fake(['res.cloudinary.com/*' => Http::response('', 503)]);
        // Esta línea sirve para guardar un archivo de foto en el disco.
        Storage::disk('public')->put('avatars/a.jpg', 'avatar-bytes');
        // Esta línea sirve para crear un usuario con foto local.
        User::factory()->create(['avatar_url' => '/storage/avatars/a.jpg']);
        // Esta línea sirve para ejecutar la migración.
        $this->artisan('media:cloudinary migrate')->assertSuccessful();

        // Esta línea sirve para ejecutar la limpieza con --force.
        $this->artisan('media:cloudinary cleanup --force')->assertSuccessful();

        // Esta línea sirve para exigir que el archivo exista en el disco.
        Storage::disk('public')->assertExists('avatars/a.jpg');
    }

    // Esta línea sirve para declarar el test que comprueba que migrar se niega a correr sin credenciales.
    public function test_migrate_refuses_to_run_without_credentials(): void
    {
        // Esta línea sirve para configurar "services.cloudinary.api_secret" con el valor null para este test.
        config(['services.cloudinary.api_secret' => null]);

        // Esta línea sirve para ejecutar la migración y exigir que falle.
        $this->artisan('media:cloudinary migrate')->assertFailed();
    }
}
