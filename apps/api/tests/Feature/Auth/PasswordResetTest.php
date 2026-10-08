<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ResetPasswordNotification.
use App\Notifications\ResetPasswordNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la fachada Password.
use Illuminate\Support\Facades\Password;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests PasswordResetTest.
class PasswordResetTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que se envía el enlace de recuperación a un correo existente.
    public function test_forgot_password_sends_reset_link_for_an_existing_email(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/forgot-password sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email]);

        // Esta línea sirve para exigir 200 y que el mensaje sea el genérico.
        $response->assertOk()->assertJsonPath(
            // Esta línea sirve para indicar la ruta del mensaje.
            'data.message',
            // Esta línea sirve para indicar el texto esperado.
            'Si el correo existe, se envió un enlace de recuperación.',
        );

        // Esta línea sirve para exigir que se le haya enviado la notificación ResetPasswordNotification.
        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el correo enlaza al frontend con el token y el correo.
    public function test_the_reset_email_links_to_the_frontend_with_the_token_and_email(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para configurar "app.frontend_url" con el valor 'http://localhost:5173' para este test.
        config(['app.frontend_url' => 'http://localhost:5173']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir el enlace de recuperación y exigir que responda 200.
        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();

        // Esta línea sirve para exigir que la notificación enviada cumpla esta condición.
        Notification::assertSentTo($user, ResetPasswordNotification::class, function (ResetPasswordNotification $notification) use ($user) {
            // Esta línea sirve para armar el correo de la notificación.
            $mail = $notification->toMail($user);

            // Esta línea sirve para exigir que el enlace empiece por la página de restablecer del frontend.
            return str_starts_with($mail->actionUrl, 'http://localhost:5173/reset-password?')
                // Esta línea sirve para exigir que el enlace incluya el correo.
                && str_contains($mail->actionUrl, 'email='.urlencode($user->email));
        });
    }

    // Esta línea sirve para declarar el test que comprueba que un correo desconocido recibe la misma respuesta genérica.
    public function test_forgot_password_returns_the_same_generic_response_for_an_unknown_email(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para hacer POST a /api/v1/auth/forgot-password sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/forgot-password', ['email' => 'nobody@example.com']);

        // Esta línea sirve para exigir 200 y que el mensaje sea el genérico.
        $response->assertOk()->assertJsonPath(
            // Esta línea sirve para indicar la ruta del mensaje.
            'data.message',
            // Esta línea sirve para indicar el texto esperado.
            'Si el correo existe, se envió un enlace de recuperación.',
        );

        // Esta línea sirve para exigir que no se haya enviado ninguna notificación.
        Notification::assertNothingSent();
    }

    // Esta línea sirve para declarar el test que comprueba que un token válido cambia la contraseña.
    public function test_reset_password_with_a_valid_token_updates_the_password(): void
    {
        // Esta línea sirve para crear un usuario con la contraseña OldPassword!234.
        $user = User::factory()->create(['password' => 'OldPassword!234']);
        // Esta línea sirve para crear un token de recuperación para el usuario.
        $token = Password::broker()->createToken($user);

        // Esta línea sirve para hacer POST a /api/v1/auth/reset-password sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/reset-password', [
            // Esta línea sirve para asignar $token al campo "token".
            'token' => $token,
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password".
            'password' => 'NewPassword!234',
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password_confirmation".
            'password_confirmation' => 'NewPassword!234',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();

        // Esta línea sirve para intentar iniciar sesión con la contraseña nueva.
        $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password".
            'password' => 'NewPassword!234',
            // Esta línea sirve para exigir que responda 200.
        ])->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que un token inválido falla.
    public function test_reset_password_with_an_invalid_token_fails(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/reset-password sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/reset-password', [
            // Esta línea sirve para asignar 'not-a-real-token' al campo "token".
            'token' => 'not-a-real-token',
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password".
            'password' => 'NewPassword!234',
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password_confirmation".
            'password_confirmation' => 'NewPassword!234',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "email".
        $response->assertUnprocessable()->assertJsonValidationErrors('email');
        // Esta app no tiene archivos de idioma — sin este mapeo a mano el
        // mensaje sale en inglés (__($status) de Laravel), el único lugar
        // que rompería el resto de la app, que está toda en español.
        // Esta línea sirve para exigir que "errors.email.0" sea 'Este enlace de recuperación no es válido o ya expiró.'.
        $response->assertJsonPath('errors.email.0', 'Este enlace de recuperación no es válido o ya expiró.');
    }

    // Esta línea sirve para declarar el test que comprueba que un token no se puede reutilizar.
    public function test_a_reset_token_cannot_be_reused_after_a_successful_reset(): void
    {
        // Esta línea sirve para crear un usuario con la contraseña OldPassword!234.
        $user = User::factory()->create(['password' => 'OldPassword!234']);
        // Esta línea sirve para crear un token de recuperación para el usuario.
        $token = Password::broker()->createToken($user);

        // Esta línea sirve para restablecer la contraseña por primera vez.
        $this->postJson('/api/v1/auth/reset-password', [
            // Esta línea sirve para asignar $token al campo "token".
            'token' => $token,
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password".
            'password' => 'NewPassword!234',
            // Esta línea sirve para asignar 'NewPassword!234' al campo "password_confirmation".
            'password_confirmation' => 'NewPassword!234',
            // Esta línea sirve para exigir que responda 200.
        ])->assertOk();

        // Esta línea sirve para intentar restablecerla otra vez con el mismo token.
        $this->postJson('/api/v1/auth/reset-password', [
            // Esta línea sirve para asignar $token al campo "token".
            'token' => $token,
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'AnotherPassword!234' al campo "password".
            'password' => 'AnotherPassword!234',
            // Esta línea sirve para asignar 'AnotherPassword!234' al campo "password_confirmation".
            'password_confirmation' => 'AnotherPassword!234',
            // Esta línea sirve para exigir 422 y comprobar el mensaje de error.
        ])->assertUnprocessable()->assertJsonPath(
            // Esta línea sirve para indicar la ruta del mensaje.
            'errors.email.0',
            // Esta línea sirve para indicar el texto esperado.
            'Este enlace de recuperación no es válido o ya expiró.',
        );
    }
}
