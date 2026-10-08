<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el servicio que genera y valida códigos TOTP.
use App\Domain\Auth\Services\TotpService;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la acción que inicia la activación de la verificación en dos pasos.
class EnableTwoFactorAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el servicio TOTP.
        private readonly TotpService $totp,
    ) {}

    /**
     * @return array{secret: string, otpauth_uri: string, qr_svg: string}
     */
    // Esta línea sirve para declarar el método que prepara el 2FA del usuario y devuelve sus datos.
    public function execute(User $user): array
    {
        // Esta línea sirve para generar un secreto TOTP nuevo.
        $secret = $this->totp->generateSecret();

        // Esta línea sirve para guardar el secreto en el usuario (2FA aún no queda activo).
        $user->forceFill(['two_factor_secret' => $secret])->save();

        // Esta línea sirve para devolver los datos que necesita la app autenticadora.
        return [
            // Esta línea sirve para incluir el secreto para ingresarlo a mano.
            'secret' => $secret,
            // Esta línea sirve para incluir la URI otpauth para configurar la app autenticadora.
            'otpauth_uri' => $this->totp->otpauthUri($user->email, $secret),
            // Esta línea sirve para incluir el código QR en formato SVG para escanearlo.
            'qr_svg' => $this->totp->qrCodeSvg($user->email, $secret),
        ];
    }
}
