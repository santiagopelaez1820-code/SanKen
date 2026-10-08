<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase VerifyEmail.
use Illuminate\Auth\Notifications\VerifyEmail;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AuthenticationTest.
class AuthenticationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario puede registrarse.
    public function test_user_can_register(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para hacer POST a /api/v1/auth/register sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/register', [
            // Esta línea sirve para asignar 'Santiago Pelaez' al campo "name".
            'name' => 'Santiago Pelaez',
            // Esta línea sirve para asignar 'santiago@example.com' al campo "email".
            'email' => 'santiago@example.com',
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
            // Esta línea sirve para asignar 'Password!234' al campo "password_confirmation".
            'password_confirmation' => 'Password!234',
            // Esta línea sirve para asignar true al campo "accept_terms".
            'accept_terms' => true,
            // Esta línea sirve para asignar true al campo "accept_privacy".
            'accept_privacy' => true,
            // Esta línea sirve para asignar true al campo "accept_health_data".
            'accept_health_data' => true,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.user.email" sea 'santiago@example.com'.
            ->assertJsonPath('data.user.email', 'santiago@example.com')
            // Esta línea sirve para exigir que "data.user.role" sea 'user'.
            ->assertJsonPath('data.user.role', 'user')
            // Esta línea sirve para exigir que "data.user.is_public_profile" sea false.
            ->assertJsonPath('data.user.is_public_profile', false)
            // Esta línea sirve para exigir que la respuesta tenga esta estructura.
            ->assertJsonStructure(['data' => ['user', 'token']]);

        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['email' => 'santiago@example.com']);

        // Esta línea sirve para buscar al usuario registrado por su correo.
        $user = User::query()->where('email', 'santiago@example.com')->firstOrFail();
        // Esta línea sirve para exigir que se le haya enviado la notificación VerifyEmail.
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el registro exige la confirmación de la contraseña.
    public function test_registration_requires_matching_password_confirmation(): void
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/register sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/register', [
            // Esta línea sirve para asignar 'Santiago Pelaez' al campo "name".
            'name' => 'Santiago Pelaez',
            // Esta línea sirve para asignar 'santiago@example.com' al campo "email".
            'email' => 'santiago@example.com',
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
            // Esta línea sirve para asignar 'not-matching' al campo "password_confirmation".
            'password_confirmation' => 'not-matching',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "password".
        $response->assertUnprocessable()->assertJsonValidationErrors('password');
    }

    // Esta línea sirve para declarar el test que comprueba que se puede iniciar sesión con credenciales correctas.
    public function test_user_can_login_with_correct_credentials(): void
    {
        // Esta línea sirve para crear un usuario con la contraseña Password!234.
        $user = User::factory()->create(['password' => 'Password!234']);

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
        ]);

        // Esta línea sirve para exigir 200 y que la respuesta tenga esta estructura.
        $response->assertOk()->assertJsonStructure(['data' => ['user', 'token']]);
    }

    // Esta línea sirve para declarar el test que comprueba que el login falla con contraseña incorrecta.
    public function test_login_fails_with_incorrect_password(): void
    {
        // Esta línea sirve para crear un usuario con la contraseña Password!234.
        $user = User::factory()->create(['password' => 'Password!234']);

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'wrong-password' al campo "password".
            'password' => 'wrong-password',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "email".
        $response->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario baneado no puede iniciar sesión.
    public function test_banned_user_cannot_login(): void
    {
        // Esta línea sirve para crear un usuario baneado.
        $user = User::factory()->create(['password' => 'Password!234', 'is_banned' => true]);

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
        $response->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario autenticado puede ver su perfil.
    public function test_authenticated_user_can_fetch_their_profile(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/auth/me autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/auth/me');

        // Esta línea sirve para exigir 200 y que "data.email" sea $user->email.
        $response->assertOk()->assertJsonPath('data.email', $user->email);
    }

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede ver el perfil.
    public function test_guest_cannot_fetch_profile(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/auth/me sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede cerrar sesión.
    public function test_user_can_logout(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un token de acceso.
        $token = $user->createToken('test');

        // Esta línea sirve para enviar la petición con el token en el encabezado Authorization.
        $response = $this->withHeader('Authorization', 'Bearer '.$token->plainTextToken)
            // Esta línea sirve para hacer POST a /api/v1/auth/logout.
            ->postJson('/api/v1/auth/logout');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la tabla personal_access_tokens tenga 0 registros.
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
