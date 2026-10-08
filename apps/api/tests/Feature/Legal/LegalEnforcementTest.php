<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Legal.

namespace Tests\Feature\Legal;

// Esta línea sirve para importar la clase FirebaseUserDeleter.
use App\Infrastructure\Firebase\FirebaseUserDeleter;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent.
use App\Models\UserConsent;
// Esta línea sirve para importar la clase UserFactory.
use Database\Factories\UserFactory;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar UploadedFile para simular archivos subidos.
use Illuminate\Http\UploadedFile;
// Esta línea sirve para importar la fachada Storage.
use Illuminate\Support\Facades\Storage;
// Esta línea sirve para importar la clase Mockery.
use Mockery;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Bloqueo en el servidor de cuentas con consentimientos pendientes
 * (EnsureLegalConsentsAccepted) y eliminación de la propia cuenta.
 */
// Esta línea sirve para declarar la clase de tests LegalEnforcementTest.
class LegalEnforcementTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para volver a activar la aceptación automática en la factory.
        UserFactory::$acceptLegalConsents = true;
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    // Esta línea sirve para declarar el método auxiliar que crea un usuario sin consentimientos.
    private function userWithoutConsents(array $attributes = []): User
    {
        // Esta línea sirve para desactivar la aceptación automática en la factory.
        UserFactory::$acceptLegalConsents = false;
        // Esta línea sirve para crear el usuario.
        $user = User::factory()->create($attributes);
        // Esta línea sirve para volver a activar la aceptación automática.
        UserFactory::$acceptLegalConsents = true;

        // Esta línea sirve para devolver el usuario.
        return $user;
    }

    // --- Bloqueo -----------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que los usuarios de la factory aceptan los documentos por defecto.
    public function test_factory_users_accept_the_current_documents_by_default(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para exigir que tenga 3 consentimientos.
        $this->assertSame(3, $user->consents()->count());
        // Esta línea sirve para exigir que pueda ver el dashboard.
        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que con consentimientos pendientes se bloquean las rutas normales.
    public function test_user_with_pending_consents_is_blocked_on_regular_routes(): void
    {
        // Esta línea sirve para crear un usuario sin consentimientos.
        $user = $this->userWithoutConsents();

        // Esta línea sirve para pedir el dashboard.
        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden()
            // Esta línea sirve para exigir que "code" sea 'consent_required'.
            ->assertJsonPath('code', 'consent_required')
            // Esta línea sirve para exigir que "pending" tenga 3 elementos.
            ->assertJsonCount(3, 'pending');

        // Esta línea sirve para exigir 403 en el feed.
        $this->actingAs($user)->getJson('/api/v1/feed')->assertForbidden();
        // Esta línea sirve para exigir 403 al activar los rankings.
        $this->actingAs($user)->postJson('/api/v1/rankings/opt-in')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que una versión nueva bloquea hasta que se re-acepte.
    public function test_a_new_document_version_blocks_users_until_they_reaccept(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para configurar "legal.documents.terms.version" con el valor '2.0' para este test.
        config(['legal.documents.terms.version' => '2.0']);

        // Esta línea sirve para pedir el dashboard.
        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden()
            // Esta línea sirve para exigir que "pending.0.type" sea 'terms'.
            ->assertJsonPath('pending.0.type', 'terms');

        // Esta línea sirve para aceptar de nuevo los Términos y exigir 200.
        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();

        // Esta línea sirve para pedir el dashboard y exigir 200.
        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que las rutas para salir del bloqueo siguen disponibles.
    public function test_routes_needed_to_leave_the_blocked_state_stay_available(): void
    {
        // Esta línea sirve para crear un usuario sin consentimientos.
        $user = $this->userWithoutConsents();

        // Esta línea sirve para pedir /auth/me y exigir 200.
        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertOk()
            // Esta línea sirve para exigir que "data.pending_consents" sea ['terms', 'privacy', 'health_data'].
            ->assertJsonPath('data.pending_consents', ['terms', 'privacy', 'health_data']);
        // Esta línea sirve para pedir /legal/consents y exigir 200.
        $this->actingAs($user)->getJson('/api/v1/legal/consents')->assertOk();
        // Esta línea sirve para pedir /legal/documents y exigir 200.
        $this->actingAs($user)->getJson('/api/v1/legal/documents')->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que cerrar sesión sigue disponible aunque esté bloqueado.
    public function test_logout_stays_available_while_blocked(): void
    {
        // Esta línea sirve para crear un usuario sin consentimientos.
        $user = $this->userWithoutConsents();
        // Esta línea sirve para crearle un token de acceso.
        $token = $user->createToken('test')->plainTextToken;

        // Esta línea sirve para cerrar sesión con el token y exigir 200.
        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que los invitados no se ven afectados.
    public function test_guests_are_not_affected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/stats/dashboard sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/stats/dashboard')->assertUnauthorized();
        // Esta línea sirve para hacer GET al ping sin sesión y exigir 200.
        $this->getJson('/api/v1/ping')->assertOk();
    }

    // --- Eliminación de la propia cuenta -----------------------------------

    // Esta línea sirve para declarar el test que comprueba que la cuenta de correo exige contraseña y la palabra de confirmación.
    public function test_email_account_requires_password_and_confirmation_word(): void
    {
        // Esta línea sirve para crear un usuario de correo y contraseña.
        $user = User::factory()->create(['password' => 'Password!234', 'auth_provider' => null]);

        // Esta línea sirve para intentar eliminar la cuenta sin contraseña.
        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])
            // Esta línea sirve para exigir 422 con error en la contraseña.
            ->assertUnprocessable()->assertJsonValidationErrors('password');

        // Esta línea sirve para intentar eliminar la cuenta con contraseña incorrecta.
        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'wrong'])
            // Esta línea sirve para exigir 422 con error en la contraseña.
            ->assertUnprocessable()->assertJsonValidationErrors('password');

        // Esta línea sirve para intentar eliminar la cuenta con una palabra de confirmación incorrecta.
        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'borrar', 'password' => 'Password!234'])
            // Esta línea sirve para exigir 422 con error en la confirmación.
            ->assertUnprocessable()->assertJsonValidationErrors('confirmation');

        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que la cuenta de correo se elimina con sus consentimientos, tokens y archivos.
    public function test_email_account_is_deleted_with_its_consents_tokens_and_files(): void
    {
        // Esta línea sirve para simular el disco público para no escribir archivos reales.
        Storage::fake('public');
        // Esta línea sirve para guardar una foto de prueba en el disco.
        $path = UploadedFile::fake()->image('avatar.jpg')->store('avatars', 'public');
        // Esta línea sirve para crear un usuario de correo y contraseña.
        $user = User::factory()->create([
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
            // Esta línea sirve para asignar null al campo "auth_provider".
            'auth_provider' => null,
            // Esta línea sirve para asignar '/storage/'.$path al campo "avatar_url".
            'avatar_url' => '/storage/'.$path,
        ]);
        // Esta línea sirve para crearle un token de acceso al usuario.
        $user->createToken('test');

        // Esta línea sirve para eliminar la cuenta como el usuario.
        $this->actingAs($user)
            // Esta línea sirve para enviar la palabra de confirmación y la contraseña.
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que la tabla users no tenga ese registro.
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        // Esta línea sirve para exigir que no queden consentimientos del usuario.
        $this->assertSame(0, UserConsent::query()->where('user_id', $user->id)->count());
        // Esta línea sirve para exigir que la tabla personal_access_tokens no tenga ese registro.
        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
        // Esta línea sirve para exigir que el archivo ya no exista en el disco.
        Storage::disk('public')->assertMissing($path);
    }

    // Esta línea sirve para declarar el test que comprueba que la cuenta de Google se elimina solo con confirmación y se borra en Firebase.
    public function test_google_account_is_deleted_with_confirmation_only_and_firebase_user_is_removed(): void
    {
        // Esta línea sirve para crear un usuario de Google.
        $user = User::factory()->create(['auth_provider' => 'google', 'firebase_uid' => 'uid-123']);

        // Esta línea sirve para crear un doble de prueba del borrador de Firebase.
        $firebase = Mockery::mock(FirebaseUserDeleter::class);
        // Esta línea sirve para esperar que se llame una vez con ese uid.
        $firebase->shouldReceive('delete')->once()->with('uid-123')->andReturn(true);
        // Esta línea sirve para registrar el doble en el contenedor.
        $this->app->instance(FirebaseUserDeleter::class, $firebase);

        // Esta línea sirve para eliminar la cuenta con la palabra de confirmación y exigir 200.
        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])->assertOk();

        // Esta línea sirve para exigir que la tabla users no tenga ese registro.
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que con consentimientos pendientes todavía se puede eliminar la cuenta.
    public function test_a_user_with_pending_consents_can_still_delete_the_account(): void
    {
        // Esta línea sirve para crear un usuario sin consentimientos.
        $user = $this->userWithoutConsents(['password' => 'Password!234', 'auth_provider' => null]);

        // Esta línea sirve para eliminar la cuenta como el usuario.
        $this->actingAs($user)
            // Esta línea sirve para enviar la palabra de confirmación y la contraseña.
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que la tabla users no tenga ese registro.
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que un super admin no puede eliminar su propia cuenta.
    public function test_super_admin_cannot_self_delete(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin', 'password' => 'Password!234', 'auth_provider' => null]);

        // Esta línea sirve para intentar eliminar la cuenta como el admin.
        $this->actingAs($admin)
            // Esta línea sirve para enviar la palabra de confirmación y la contraseña.
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que eliminar la cuenta exige sesión.
    public function test_deletion_requires_authentication(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/auth/me sin sesión y exigir que responda 401.
        $this->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el proveedor de login se muestra al dueño.
    public function test_auth_provider_is_exposed_to_the_owner(): void
    {
        // Esta línea sirve para crear un usuario de Google.
        $user = User::factory()->create(['auth_provider' => 'google']);

        // Esta línea sirve para pedir /auth/me y exigir que el proveedor sea "google".
        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertJsonPath('data.auth_provider', 'google');
    }
}
