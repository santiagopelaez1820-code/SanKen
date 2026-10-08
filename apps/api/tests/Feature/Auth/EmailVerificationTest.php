<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase Verified.
use Illuminate\Auth\Events\Verified;
// Esta línea sirve para importar la clase VerifyEmail.
use Illuminate\Auth\Notifications\VerifyEmail;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Event.
use Illuminate\Support\Facades\Event;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la fachada URL.
use Illuminate\Support\Facades\URL;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests EmailVerificationTest.
class EmailVerificationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que arma la URL firmada de verificación.
    private function signedVerifyUrl(User $user, ?string $hashOverride = null): string
    {
        // Esta línea sirve para devolver la URL firmada de la ruta de verificación.
        return URL::signedRoute('api.v1.auth.email.verify', [
            // Esta línea sirve para asignar $user->id al campo "id".
            'id' => $user->id,
            // Esta línea sirve para asignar $hashOverride ?? sha1($user->email) al campo "hash".
            'hash' => $hashOverride ?? sha1($user->email),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que una URL firmada válida marca el correo como verificado.
    public function test_verifying_with_a_valid_signed_url_marks_the_email_verified(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake();
        // Esta línea sirve para crear un usuario sin el correo verificado.
        $user = User::factory()->unverified()->create();

        // Esta línea sirve para hacer GET a la URL firmada.
        $response = $this->getJson($this->signedVerifyUrl($user));

        // Esta línea sirve para exigir 200 y que "data.message" sea 'Correo verificado.'.
        $response->assertOk()->assertJsonPath('data.message', 'Correo verificado.');
        // Esta línea sirve para exigir que el correo quede verificado en la base de datos.
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        // Esta línea sirve para exigir que se haya disparado el evento Verified.
        Event::assertDispatched(Verified::class);
    }

    // Esta línea sirve para declarar el test que comprueba que un hash inválido falla.
    public function test_verifying_with_an_invalid_hash_fails(): void
    {
        // Esta línea sirve para crear un usuario sin el correo verificado.
        $user = User::factory()->unverified()->create();

        // Esta línea sirve para hacer GET a una URL firmada con el hash de otro correo.
        $response = $this->getJson($this->signedVerifyUrl($user, sha1('someone-else@example.com')));

        // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
        $response->assertForbidden();
        // Esta línea sirve para exigir que el correo siga sin verificar.
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    // Esta línea sirve para declarar el test que comprueba que verificar un correo ya verificado no hace nada.
    public function test_verifying_an_already_verified_email_is_idempotent(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a la URL firmada.
        $response = $this->getJson($this->signedVerifyUrl($user));

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que no se haya disparado el evento Verified.
        Event::assertNotDispatched(Verified::class);
    }

    // Esta línea sirve para declarar el test que comprueba que reenviar con el correo verificado no envía notificación.
    public function test_resend_when_already_verified_does_not_send_a_notification(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/email/resend autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/email/resend');

        // Esta línea sirve para exigir 200 y que "data.message" sea 'El correo ya está verificado.'.
        $response->assertOk()->assertJsonPath('data.message', 'El correo ya está verificado.');
        // Esta línea sirve para exigir que no se haya enviado ninguna notificación.
        Notification::assertNothingSent();
    }

    // Esta línea sirve para declarar el test que comprueba que reenviar con el correo sin verificar envía la notificación.
    public function test_resend_when_unverified_sends_the_verification_notification(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario sin el correo verificado.
        $user = User::factory()->unverified()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/email/resend autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/email/resend');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que se le haya enviado la notificación VerifyEmail.
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el reenvío se limita tras tres intentos.
    public function test_resend_is_rate_limited_after_three_attempts(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para crear un usuario sin el correo verificado.
        $user = User::factory()->unverified()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para repetir 3 veces.
        for ($i = 0; $i < 3; $i++) {
            // Esta línea sirve para reenviar el correo y exigir que responda 200.
            $client->postJson('/api/v1/auth/email/resend')->assertOk();
        }

        // Esta línea sirve para hacer el cuarto reenvío y exigir que responda 429 (demasiados intentos).
        $client->postJson('/api/v1/auth/email/resend')->assertStatus(429);
    }
}
