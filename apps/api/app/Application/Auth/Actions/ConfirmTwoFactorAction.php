<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el servicio de códigos de recuperación 2FA.
use App\Domain\Auth\Services\RecoveryCodeService;
// Esta línea sirve para importar el servicio que valida códigos TOTP.
use App\Domain\Auth\Services\TotpService;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que confirma la activación de 2FA.
class ConfirmTwoFactorAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el servicio TOTP.
        private readonly TotpService $totp,
        // Esta línea sirve para recibir el servicio de códigos de recuperación.
        private readonly RecoveryCodeService $recoveryCodes,
    ) {}

    /**
     * @return string[] códigos de recuperación en texto plano
     */
    // Esta línea sirve para declarar el método que recibe al usuario y el código ingresado.
    public function execute(User $user, string $code): array
    {
        // Esta línea sirve para revisar si no hay secreto 2FA o el código no es válido.
        if (! $user->two_factor_secret || ! $this->totp->verify($user->two_factor_secret, $code)) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el código no es válido.
                'code' => ['El código ingresado no es válido.'],
            ]);
        }

        // Esta línea sirve para generar los códigos de recuperación en texto plano.
        $plainCodes = $this->recoveryCodes->generate();

        // Esta línea sirve para guardar en el usuario los datos de 2FA.
        $user->forceFill([
            // Esta línea sirve para marcar la verificación en dos pasos como activada.
            'two_factor_enabled' => true,
            // Esta línea sirve para guardar los códigos de recuperación cifrados.
            'two_factor_recovery_codes' => array_map(
                // Esta línea sirve para cifrar cada código de recuperación.
                fn (string $plainCode) => $this->recoveryCodes->hash($plainCode),
                // Esta línea sirve para pasar la lista de códigos en texto plano a cifrar.
                $plainCodes,
            ),
            // Esta línea sirve para guardar los cambios del usuario en la base de datos.
        ])->save();

        // Esta línea sirve para devolver los códigos en texto plano para mostrárselos al usuario una vez.
        return $plainCodes;
    }
}
