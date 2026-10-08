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

// Esta línea sirve para declarar la clase de tests TwoFactorChallengeTest.
class TwoFactorChallengeTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que el login con verificación en dos pasos devuelve un reto.
    public function test_login_for_two_factor_user_returns_challenge_instead_of_token(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        ['user' => $user] = $this->makeTwoFactorUser();

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.requires_two_factor" sea true.
            ->assertJsonPath('data.requires_two_factor', true)
            // Esta línea sirve para exigir que la respuesta tenga esta estructura.
            ->assertJsonStructure(['data' => ['challenge_token']])
            // Esta línea sirve para exigir que la respuesta no incluya "data.token".
            ->assertJsonMissingPath('data.token');

        // Esta línea sirve para exigir que la tabla personal_access_tokens tenga 0 registros.
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que el login sin verificación en dos pasos no cambia.
    public function test_login_for_non_two_factor_user_is_unchanged(): void
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

    // Esta línea sirve para declarar el test que comprueba que un código TOTP válido devuelve el token.
    public function test_challenge_with_valid_totp_code_returns_token(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        ['user' => $user, 'secret' => $secret] = $this->makeTwoFactorUser();
        // Esta línea sirve para obtener el token del reto.
        $challengeToken = $this->obtainChallengeToken($user);

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/challenge sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar $challengeToken al campo "challenge_token".
            'challenge_token' => $challengeToken,
            // Esta línea sirve para asignar (new Google2FA)->getCurrentOtp($secret) al campo "code".
            'code' => (new Google2FA)->getCurrentOtp($secret),
        ]);

        // Esta línea sirve para exigir 200 y que la respuesta tenga esta estructura.
        $response->assertOk()->assertJsonStructure(['data' => ['user', 'token']]);
    }

    // Esta línea sirve para declarar el test que comprueba que un código de recuperación válido se consume.
    public function test_challenge_with_valid_recovery_code_consumes_it(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        ['user' => $user, 'recoveryCodes' => $recoveryCodes] = $this->makeTwoFactorUser();
        // Esta línea sirve para obtener el token del reto.
        $challengeToken = $this->obtainChallengeToken($user);

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/challenge sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar $challengeToken al campo "challenge_token".
            'challenge_token' => $challengeToken,
            // Esta línea sirve para asignar $recoveryCodes[0] al campo "code".
            'code' => $recoveryCodes[0],
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para recargar user desde la base de datos.
        $user->refresh();
        // Esta línea sirve para exigir que queden 7 códigos de recuperación.
        $this->assertCount(7, $user->two_factor_recovery_codes);
    }

    // Esta línea sirve para declarar el test que comprueba que un código de recuperación ya usado falla.
    public function test_challenge_with_already_used_recovery_code_fails(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        ['user' => $user, 'recoveryCodes' => $recoveryCodes] = $this->makeTwoFactorUser();

        // Esta línea sirve para obtener el token del primer reto.
        $firstToken = $this->obtainChallengeToken($user);
        // Esta línea sirve para resolver el reto con un código de recuperación.
        $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar $firstToken al campo "challenge_token".
            'challenge_token' => $firstToken,
            // Esta línea sirve para asignar $recoveryCodes[0] al campo "code".
            'code' => $recoveryCodes[0],
            // Esta línea sirve para exigir que responda 200.
        ])->assertOk();

        // Esta línea sirve para obtener el token de un segundo reto.
        $secondToken = $this->obtainChallengeToken($user);
        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/challenge sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar $secondToken al campo "challenge_token".
            'challenge_token' => $secondToken,
            // Esta línea sirve para asignar $recoveryCodes[0] al campo "code".
            'code' => $recoveryCodes[0],
        ]);

        // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
        $response->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que un token de reto inválido falla.
    public function test_challenge_with_invalid_challenge_token_fails(): void
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/challenge sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar 'not-a-real-token' al campo "challenge_token".
            'challenge_token' => 'not-a-real-token',
            // Esta línea sirve para asignar '123456' al campo "code".
            'code' => '123456',
        ]);

        // Esta línea sirve para exigir 422 con error de validación en "challenge_token".
        $response->assertUnprocessable()->assertJsonValidationErrors('challenge_token');
    }

    // Esta línea sirve para declarar el test que comprueba que el reto se invalida tras el máximo de intentos.
    public function test_challenge_burns_after_max_attempts(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        ['user' => $user, 'secret' => $secret] = $this->makeTwoFactorUser();
        // Esta línea sirve para obtener el token del reto.
        $challengeToken = $this->obtainChallengeToken($user);

        // Esta línea sirve para repetir 5 veces.
        for ($i = 0; $i < 5; $i++) {
            // Esta línea sirve para enviar un código incorrecto.
            $this->postJson('/api/v1/auth/2fa/challenge', [
                // Esta línea sirve para asignar $challengeToken al campo "challenge_token".
                'challenge_token' => $challengeToken,
                // Esta línea sirve para asignar '000000' al campo "code".
                'code' => '000000',
                // Esta línea sirve para exigir que responda 422.
            ])->assertUnprocessable();
        }

        // Esta línea sirve para hacer POST a /api/v1/auth/2fa/challenge sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            // Esta línea sirve para asignar $challengeToken al campo "challenge_token".
            'challenge_token' => $challengeToken,
            // Esta línea sirve para asignar (new Google2FA)->getCurrentOtp($secret) al campo "code".
            'code' => (new Google2FA)->getCurrentOtp($secret),
        ]);

        // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
        $response->assertUnprocessable();
    }

    // Esta línea sirve para declarar el método auxiliar que crea un usuario con verificación en dos pasos.
    private function makeTwoFactorUser(): array
    {
        // Esta línea sirve para crear un usuario con la contraseña Password!234.
        $user = User::factory()->create(['password' => 'Password!234']);
        // Esta línea sirve para generar un secreto de verificación en dos pasos.
        $secret = (new Google2FA)->generateSecretKey();
        // Esta línea sirve para crear el servicio de códigos de recuperación.
        $recoveryCodeService = new RecoveryCodeService;
        // Esta línea sirve para generar los códigos de recuperación en texto plano.
        $plainRecoveryCodes = $recoveryCodeService->generate();

        // Esta línea sirve para guardar en el usuario los datos de la verificación en dos pasos.
        $user->forceFill([
            // Esta línea sirve para asignar true al campo "two_factor_enabled".
            'two_factor_enabled' => true,
            // Esta línea sirve para asignar $secret al campo "two_factor_secret".
            'two_factor_secret' => $secret,
            // Esta línea sirve para guardar los códigos de recuperación hasheados.
            'two_factor_recovery_codes' => array_map(
                // Esta línea sirve para hashear cada código.
                fn (string $code) => $recoveryCodeService->hash($code),
                // Esta línea sirve para usar los códigos en texto plano.
                $plainRecoveryCodes,
            ),
            // Esta línea sirve para guardar y cerrar los datos.
        ])->save();

        // Esta línea sirve para devolver el usuario, el secreto y los códigos.
        return ['user' => $user->refresh(), 'secret' => $secret, 'recoveryCodes' => $plainRecoveryCodes];
    }

    // Esta línea sirve para declarar el método auxiliar que obtiene un token de reto.
    private function obtainChallengeToken(User $user): string
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
        ]);

        // Esta línea sirve para devolver el token del reto de la respuesta.
        return $response->json('data.challenge_token');
    }
}
