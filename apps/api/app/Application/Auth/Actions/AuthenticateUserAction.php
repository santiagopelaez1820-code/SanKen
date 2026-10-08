<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el objeto que representa el resultado del login.
use App\Application\Auth\DTOs\AuthenticationResult;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar la fachada Cache para guardar el desafío 2FA.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada Hash para comparar contraseñas cifradas.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que valida las credenciales de un usuario.
class AuthenticateUserAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el repositorio de usuarios.
        private readonly UserRepositoryInterface $users,
    ) {}

    // Esta línea sirve para declarar el método que recibe correo, contraseña y nombre del dispositivo.
    public function execute(string $email, string $password, string $deviceName): AuthenticationResult
    {
        // Esta línea sirve para buscar al usuario por su correo.
        $user = $this->users->findByEmail($email);

        // Esta línea sirve para revisar si el usuario no existe o la contraseña no coincide.
        if (! $user || ! Hash::check($password, $user->password)) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar el mensaje de credenciales incorrectas en el campo email.
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Esta línea sirve para revisar si la cuenta está baneada.
        if ($user->is_banned) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que la cuenta fue suspendida.
                'email' => ['Esta cuenta ha sido suspendida.'],
            ]);
        }

        // Esta línea sirve para revisar si la cuenta está desactivada.
        if ($user->deactivated_at) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que la cuenta está desactivada.
                'email' => ['Esta cuenta está desactivada.'],
            ]);
        }

        // Esta línea sirve para revisar si el usuario tiene activada la verificación en dos pasos (2FA).
        if ($user->two_factor_enabled) {
            // Esta línea sirve para generar un token aleatorio para el desafío 2FA.
            $challengeToken = bin2hex(random_bytes(32));
            // Esta línea sirve para guardar en caché por 5 minutos a qué usuario pertenece el desafío.
            Cache::put("2fa_challenge:{$challengeToken}", $user->id, now()->addMinutes(5));

            // Esta línea sirve para devolver un resultado que pide el código 2FA en lugar del token.
            return AuthenticationResult::challenge($challengeToken);
        }

        // Esta línea sirve para crear el token de acceso de Sanctum y devolverlo como resultado.
        return AuthenticationResult::token($user->createToken($deviceName));
    }
}
