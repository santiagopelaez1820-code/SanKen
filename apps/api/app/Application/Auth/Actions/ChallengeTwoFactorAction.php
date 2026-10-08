<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el servicio de códigos de recuperación 2FA.
use App\Domain\Auth\Services\RecoveryCodeService;
// Esta línea sirve para importar el servicio que valida códigos TOTP.
use App\Domain\Auth\Services\TotpService;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la fachada Cache para leer el desafío 2FA.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar el limitador de intentos.
use Illuminate\Support\Facades\RateLimiter;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;
// Esta línea sirve para importar el tipo del token de acceso de Sanctum.
use Laravel\Sanctum\NewAccessToken;

// Esta línea sirve para declarar la acción que completa el login con el código 2FA.
class ChallengeTwoFactorAction
{
    // Esta línea sirve para definir el máximo de intentos permitidos por desafío.
    private const MAX_ATTEMPTS = 5;

    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el repositorio de usuarios.
        private readonly UserRepositoryInterface $users,
        // Esta línea sirve para recibir el servicio TOTP.
        private readonly TotpService $totp,
        // Esta línea sirve para recibir el servicio de códigos de recuperación.
        private readonly RecoveryCodeService $recoveryCodes,
    ) {}

    // Esta línea sirve para declarar el método que recibe el desafío, el código y el dispositivo.
    public function execute(string $challengeToken, string $code, string $deviceName): NewAccessToken
    {
        // Esta línea sirve para armar la clave de caché donde se guardó el desafío.
        $cacheKey = "2fa_challenge:{$challengeToken}";
        // Esta línea sirve para obtener de la caché el id del usuario del desafío.
        $userId = Cache::get($cacheKey);

        // Esta línea sirve para revisar si el desafío no existe o ya expiró.
        if (! $userId) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el desafío no es válido o expiró.
                'challenge_token' => ['El desafío de verificación no es válido o expiró.'],
            ]);
        }

        // Esta línea sirve para armar la clave que cuenta los intentos fallidos de este desafío.
        $attemptsKey = "2fa_challenge_attempts:{$challengeToken}";

        // Esta línea sirve para revisar si ya se superó el máximo de intentos.
        if (RateLimiter::tooManyAttempts($attemptsKey, self::MAX_ATTEMPTS)) {
            // Esta línea sirve para eliminar el desafío para obligar a iniciar sesión de nuevo.
            Cache::forget($cacheKey);
            // Esta línea sirve para reiniciar el contador de intentos.
            RateLimiter::clear($attemptsKey);

            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que se agotaron los intentos.
                'challenge_token' => ['Se agotaron los intentos. Volvé a iniciar sesión.'],
            ]);
        }

        // Esta línea sirve para buscar al usuario del desafío.
        $user = $this->users->findById($userId);

        // Esta línea sirve para revisar si el usuario no existe o el código no es válido.
        if (! $user || ! $this->attemptVerification($user, $code)) {
            // Esta línea sirve para sumar un intento fallido que dura 5 minutos.
            RateLimiter::hit($attemptsKey, 300);

            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el código no es válido.
                'code' => ['El código ingresado no es válido.'],
            ]);
        }

        // Esta línea sirve para eliminar el desafío porque ya se usó.
        Cache::forget($cacheKey);
        // Esta línea sirve para reiniciar el contador de intentos.
        RateLimiter::clear($attemptsKey);

        // Esta línea sirve para crear y devolver el token de acceso del usuario.
        return $user->createToken($deviceName);
    }

    // Esta línea sirve para declarar el método privado que verifica un código TOTP o de recuperación.
    private function attemptVerification(User $user, string $code): bool
    {
        // Esta línea sirve para revisar si el código coincide con el TOTP de la app autenticadora.
        if ($user->two_factor_secret && $this->totp->verify($user->two_factor_secret, $code)) {
            // Esta línea sirve para devolver verdadero porque el código TOTP es correcto.
            return true;
        }

        // Esta línea sirve para probar el código como código de recuperación dentro de una transacción.
        return DB::transaction(function () use ($user, $code) {
            // Esta línea sirve para volver a leer al usuario bloqueando su fila para evitar usos simultáneos.
            /** @var User $locked */
            $locked = User::query()->lockForUpdate()->findOrFail($user->id);

            // Esta línea sirve para verificar el código contra los de recuperación y consumirlo si coincide.
            $result = $this->recoveryCodes->verifyAndConsume($locked->two_factor_recovery_codes ?? [], $code);

            // Esta línea sirve para revisar si el código no coincidió con ninguno.
            if (! $result['matched']) {
                // Esta línea sirve para devolver falso porque el código no es válido.
                return false;
            }

            // Esta línea sirve para guardar los códigos de recuperación que quedan sin usar.
            $locked->forceFill(['two_factor_recovery_codes' => $result['remaining']])->save();

            // Esta línea sirve para devolver verdadero porque el código de recuperación es válido.
            return true;
        });
    }
}
