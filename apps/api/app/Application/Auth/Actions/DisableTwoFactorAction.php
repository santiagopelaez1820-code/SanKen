<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la fachada Hash para comparar contraseñas cifradas.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que desactiva la verificación en dos pasos.
class DisableTwoFactorAction
{
    // Esta línea sirve para declarar el método que recibe al usuario y su contraseña.
    public function execute(User $user, string $password): void
    {
        // Esta línea sirve para revisar si la contraseña ingresada no coincide con la guardada.
        if (! Hash::check($password, $user->password)) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que la contraseña es incorrecta.
                'password' => ['La contraseña ingresada es incorrecta.'],
            ]);
        }

        // Esta línea sirve para actualizar los datos de 2FA del usuario.
        $user->forceFill([
            // Esta línea sirve para marcar la verificación en dos pasos como desactivada.
            'two_factor_enabled' => false,
            // Esta línea sirve para borrar el secreto TOTP.
            'two_factor_secret' => null,
            // Esta línea sirve para borrar los códigos de recuperación.
            'two_factor_recovery_codes' => null,
            // Esta línea sirve para guardar los cambios del usuario en la base de datos.
        ])->save();
    }
}
