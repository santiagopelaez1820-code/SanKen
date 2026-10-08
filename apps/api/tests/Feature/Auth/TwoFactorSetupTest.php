<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Auth.

namespace Tests\Feature\Auth;

// Esta línea sirve para importar la clase RecoveryCodeService.
use App\Domain\Auth\Services\RecoveryCodeService;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Google2FA.
use PragmaRX\Google2FA\Google2FA;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests TwoFactorSetupTest.
class TwoFactorSetupTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que iniciar la activación devuelve secreto y QR sin activarla.
    public function test_enabling_two_factor_returns_secret_and_qr_without_activating(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/enable autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/enable');

        // Esta línea sirve para exigir 200 y que la respuesta tenga esta estructura.
        $response->assertOk()->assertJsonStructure(['data' => ['secret', 'otpauth_uri', 'qr_svg']]);
        // Esta línea sirve para exigir que el QR sea un SVG.
        $this->assertStringContainsString('<svg', $response->json('data.qr_svg'));

        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que "two_factor_secret" no sea null.
        $this->assertNotNull($user->two_factor_secret);
        // Esta línea sirve para exigir que "two_factor_enabled" sea falso.
        $this->assertFalse($user->two_factor_enabled);
    }

    // Esta línea sirve para declarar el test que comprueba que confirmar con un código válido activa y devuelve códigos de recuperación.
    public function test_confirming_two_factor_with_valid_code_activates_and_returns_recovery_codes(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para generar un secreto de verificación en dos pasos.
        $secret = (new Google2FA)->generateSecretKey();
        // Esta línea sirve para guardar el secreto en el usuario.
        $user->forceFill(['two_factor_secret' => $secret])->save();

        // Esta línea sirve para calcular el código vigente.
        $code = (new Google2FA)->getCurrentOtp($secret);

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/confirm autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/confirm', ['code' => $code]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener los códigos de recuperación de la respuesta.
        $recoveryCodes = $response->json('data.recovery_codes');
        // Esta línea sirve para exigir que sean 8.
        $this->assertCount(8, $recoveryCodes);

        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que "two_factor_enabled" sea verdadero.
        $this->assertTrue($user->two_factor_enabled);
        // Esta línea sirve para exigir que el usuario tenga 8 códigos guardados.
        $this->assertCount(8, $user->two_factor_recovery_codes);
        // Esta línea sirve para exigir que los códigos guardados estén hasheados (distintos de los entregados).
        $this->assertNotEquals($recoveryCodes[0], $user->two_factor_recovery_codes[0]);
    }

    // Esta línea sirve para declarar el test que comprueba que confirmar con un código inválido falla.
    public function test_confirming_two_factor_with_invalid_code_fails(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar un secreto en el usuario.
        $user->forceFill(['two_factor_secret' => (new Google2FA)->generateSecretKey()])->save();

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/confirm autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/confirm', ['code' => '000000']);

        // Esta línea sirve para exigir 422 con error de validación en "code".
        $response->assertUnprocessable()->assertJsonValidationErrors('code');

        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que "two_factor_enabled" sea falso.
        $this->assertFalse($user->two_factor_enabled);
    }

    // Esta línea sirve para declarar el test que comprueba que desactivar con la contraseña correcta limpia las columnas.
    public function test_disabling_two_factor_with_correct_password_clears_columns(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        $user = $this->makeTwoFactorUser();

        // Esta línea sirve para preparar la petición autenticada como user.
        $response = $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/2fa/disable con los datos enviados.
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'Password!234']);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();

        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que "two_factor_enabled" sea falso.
        $this->assertFalse($user->two_factor_enabled);
        // Esta línea sirve para exigir que "two_factor_secret" sea null.
        $this->assertNull($user->two_factor_secret);
        // Esta línea sirve para exigir que "two_factor_recovery_codes" sea null.
        $this->assertNull($user->two_factor_recovery_codes);
    }

    // Esta línea sirve para declarar el test que comprueba que desactivar con contraseña incorrecta falla.
    public function test_disabling_two_factor_with_incorrect_password_fails(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        $user = $this->makeTwoFactorUser();

        // Esta línea sirve para preparar la petición autenticada como user.
        $response = $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/2fa/disable con los datos enviados.
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'wrong-password']);

        // Esta línea sirve para exigir 422 con error de validación en "password".
        $response->assertUnprocessable()->assertJsonValidationErrors('password');

        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que "two_factor_enabled" sea verdadero.
        $this->assertTrue($user->two_factor_enabled);
    }

    // Esta línea sirve para declarar el test que comprueba que las rutas de configuración exigen sesión.
    public function test_two_factor_setup_routes_require_authentication(): void
    {
        // Esta línea sirve para hacer POST a /2fa/enable sin sesión y exigir 401.
        $this->postJson('/api/v1/auth/2fa/enable')->assertUnauthorized();
        // Esta línea sirve para hacer POST a /2fa/confirm sin sesión y exigir 401.
        $this->postJson('/api/v1/auth/2fa/confirm', ['code' => '123456'])->assertUnauthorized();
        // Esta línea sirve para hacer POST a /2fa/disable sin sesión y exigir 401.
        $this->postJson('/api/v1/auth/2fa/disable', ['password' => 'x'])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el método auxiliar que crea un usuario con verificación en dos pasos.
    private function makeTwoFactorUser(): User
    {
        // Esta línea sirve para crear un usuario con la contraseña Password!234.
        $user = User::factory()->create(['password' => 'Password!234']);
        // Esta línea sirve para generar un secreto de verificación en dos pasos.
        $secret = (new Google2FA)->generateSecretKey();
        // Esta línea sirve para crear el servicio de códigos de recuperación.
        $recoveryCodes = new RecoveryCodeService;

        // Esta línea sirve para guardar en el usuario los datos de la verificación en dos pasos.
        $user->forceFill([
            // Esta línea sirve para asignar true al campo "two_factor_enabled".
            'two_factor_enabled' => true,
            // Esta línea sirve para asignar $secret al campo "two_factor_secret".
            'two_factor_secret' => $secret,
            // Esta línea sirve para guardar los códigos de recuperación hasheados.
            'two_factor_recovery_codes' => array_map(
                // Esta línea sirve para hashear cada código.
                fn (string $code) => $recoveryCodes->hash($code),
                // Esta línea sirve para generar los códigos de recuperación.
                $recoveryCodes->generate(),
            ),
            // Esta línea sirve para guardar y cerrar los datos.
        ])->save();

        // Esta línea sirve para devolver el usuario recargado.
        return $user->refresh();
    }
}
