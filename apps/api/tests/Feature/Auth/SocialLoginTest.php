<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

// Esta línea sirve para importar la clase FirebaseTokenClaims.
use App\Infrastructure\Firebase\FirebaseTokenClaims;
// Esta línea sirve para importar la clase FirebaseTokenVerifier.
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Mockery.
use Mockery;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests SocialLoginTest.
class SocialLoginTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    /**
     * No hay credenciales reales de Firebase en este entorno de test —
     * se reemplaza el verificador por un doble que devuelve claims fijos,
     * exactamente como si el ID Token ya hubiera sido verificado. Esto
     * prueba la lógica de vinculación/creación de cuentas, no el SDK de
     * Firebase en sí (eso lo cubre kreait/firebase-php, no nosotros).
     */
    // Esta línea sirve para declarar el método auxiliar que simula la verificación del token de Firebase.
    private function fakeVerifier(FirebaseTokenClaims $claims): void
    {
        // Esta línea sirve para crear un doble de prueba del verificador.
        $mock = Mockery::mock(FirebaseTokenVerifier::class);
        // Esta línea sirve para hacer que devuelva los datos recibidos una sola vez.
        $mock->shouldReceive('verify')->once()->andReturn($claims);
        // Esta línea sirve para registrar el doble en el contenedor.
        $this->app->instance(FirebaseTokenVerifier::class, $mock);
    }

    // Esta línea sirve para declarar el test que comprueba que el primer login con Google crea un usuario nuevo.
    public function test_new_user_is_created_on_first_google_login(): void
    {
        // Esta línea sirve para simular la verificación con los datos de un usuario nuevo.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-1',
            // Esta línea sirve para definir el correo.
            email: 'nuevo@example.com',
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: 'Usuario Nuevo',
            // Esta línea sirve para definir la foto.
            picture: 'https://lh3.googleusercontent.com/a/photo.jpg',
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
            // Esta línea sirve para asignar true al campo "accept_terms".
            'accept_terms' => true,
            // Esta línea sirve para asignar true al campo "accept_privacy".
            'accept_privacy' => true,
            // Esta línea sirve para asignar true al campo "accept_health_data".
            'accept_health_data' => true,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.user.email" sea 'nuevo@example.com'.
            ->assertJsonPath('data.user.email', 'nuevo@example.com')
            // Esta línea sirve para exigir que "data.user.avatar_url" sea 'https://lh3.googleusercontent.com/a/photo.jpg'.
            ->assertJsonPath('data.user.avatar_url', 'https://lh3.googleusercontent.com/a/photo.jpg')
            // Esta línea sirve para exigir que la respuesta tenga esta estructura.
            ->assertJsonStructure(['data' => ['user', 'token']]);

        // Esta línea sirve para buscar al usuario creado por su correo.
        $user = User::query()->where('email', 'nuevo@example.com')->firstOrFail();
        // Esta línea sirve para exigir que "firebase_uid" sea exactamente 'firebase-uid-1'.
        $this->assertSame('firebase-uid-1', $user->firebase_uid);
        // Esta línea sirve para exigir que "auth_provider" sea exactamente 'google'.
        $this->assertSame('google', $user->auth_provider);
        // Esta línea sirve para exigir que "email_verified_at" no sea null.
        $this->assertNotNull($user->email_verified_at);
    }

    // Esta línea sirve para declarar el test que comprueba que el mismo uid de Firebase entra a la misma cuenta.
    public function test_existing_user_with_same_firebase_uid_logs_into_the_same_account(): void
    {
        // Esta línea sirve para crear un usuario con ese uid.
        $user = User::factory()->create(['firebase_uid' => 'firebase-uid-2']);

        // Esta línea sirve para simular la verificación con ese uid.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-2',
            // Esta línea sirve para definir otro correo.
            email: 'otro@example.com', // el email pudo haber cambiado en Google, no debe importar
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: 'Otro Nombre',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
        ]);

        // Esta línea sirve para exigir 200 y que "data.user.id" sea $user->id.
        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
        // Esta línea sirve para exigir que siga habiendo un solo usuario.
        $this->assertSame(1, User::query()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que Google se vincula a una cuenta existente sin duplicarla.
    public function test_google_login_links_to_an_existing_email_password_account_instead_of_duplicating(): void
    {
        // Esta línea sirve para crear un usuario con ese correo y sin uid de Firebase.
        $user = User::factory()->create(['email' => 'kenneth@example.com', 'firebase_uid' => null]);

        // Esta línea sirve para simular la verificación con el mismo correo.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-3',
            // Esta línea sirve para definir el correo.
            email: 'kenneth@example.com',
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: 'Kenneth',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
        ]);

        // Esta línea sirve para exigir 200 y que "data.user.id" sea $user->id.
        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
        // Esta línea sirve para exigir que siga habiendo un solo usuario.
        $this->assertSame(1, User::query()->count());
        // Esta línea sirve para exigir que en la base de datos "firebase_uid" sea 'firebase-uid-3'.
        $this->assertSame('firebase-uid-3', $user->fresh()->firebase_uid);
    }

    // Esta línea sirve para declarar el test que comprueba que un correo sin verificar no se vincula a una cuenta existente.
    public function test_unverified_email_does_not_link_to_an_existing_account(): void
    {
        // Esta línea sirve para crear un usuario existente con ese correo.
        $existing = User::factory()->create(['email' => 'target@example.com', 'firebase_uid' => null]);

        // Esta línea sirve para simular la verificación con ese correo sin verificar.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-4',
            // Esta línea sirve para definir el correo.
            email: 'target@example.com',
            // Esta línea sirve para indicar que el correo no está verificado.
            emailVerified: false,
            // Esta línea sirve para definir el nombre.
            name: 'Impostor',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "id_token".
        $response->assertUnprocessable()->assertJsonValidationErrors('id_token');
        // Esta línea sirve para exigir que siga habiendo un solo usuario.
        $this->assertSame(1, User::query()->count());
        // Esta línea sirve para exigir que en la base de datos "firebase_uid" sea null.
        $this->assertNull($existing->fresh()->firebase_uid);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario baneado no puede entrar con Google.
    public function test_banned_user_cannot_log_in_via_google(): void
    {
        // Esta línea sirve para crear un usuario baneado con ese uid.
        User::factory()->create(['firebase_uid' => 'firebase-uid-5', 'is_banned' => true]);

        // Esta línea sirve para simular la verificación con ese uid.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-5',
            // Esta línea sirve para definir el correo.
            email: 'banned@example.com',
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: 'Banned',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "id_token".
        $response->assertUnprocessable()->assertJsonValidationErrors('id_token');
    }

    // Esta línea sirve para declarar el test que comprueba que con verificación en dos pasos se recibe un reto en vez del token.
    public function test_user_with_two_factor_enabled_gets_a_challenge_instead_of_a_token(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        User::factory()->create(['firebase_uid' => 'firebase-uid-6', 'two_factor_enabled' => true]);

        // Esta línea sirve para simular la verificación con ese uid.
        $this->fakeVerifier(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: 'firebase-uid-6',
            // Esta línea sirve para definir el correo.
            email: '2fa@example.com',
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: '2FA User',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'google' al campo "provider".
            'provider' => 'google',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.requires_two_factor" sea true.
            ->assertJsonPath('data.requires_two_factor', true)
            // Esta línea sirve para exigir que la respuesta tenga esta estructura.
            ->assertJsonStructure(['data' => ['challenge_token']]);
    }

    // Esta línea sirve para declarar el test que comprueba que Facebook se rechaza por ahora.
    public function test_facebook_provider_is_rejected_for_now(): void
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', [
            // Esta línea sirve para asignar 'fake-token' al campo "id_token".
            'id_token' => 'fake-token',
            // Esta línea sirve para asignar 'facebook' al campo "provider".
            'provider' => 'facebook',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "provider".
        $response->assertUnprocessable()->assertJsonValidationErrors('provider');
    }

    // Esta línea sirve para declarar el test que comprueba que el login tradicional sigue funcionando.
    public function test_traditional_login_still_works_after_adding_social_login(): void
    {
        // Esta línea sirve para crear un usuario con una contraseña conocida.
        $user = User::factory()->create(['password' => bcrypt('Password!234')]);

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
        ]);

        // Esta línea sirve para exigir 200 y que "data.user.id" sea $user->id.
        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
    }
}
