<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar la acción que registra los consentimientos legales.
use App\Application\Legal\Actions\RecordUserConsentsAction;
// Esta línea sirve para importar el catálogo de consentimientos legales vigentes.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent para usar sus constantes de origen.
use App\Models\UserConsent;
// Esta línea sirve para importar el evento Registered que dispara el correo de verificación.
use Illuminate\Auth\Events\Registered;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Hash para cifrar la contraseña.
use Illuminate\Support\Facades\Hash;

// Esta línea sirve para declarar la acción que registra un usuario nuevo.
class RegisterUserAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el repositorio de usuarios.
        private readonly UserRepositoryInterface $users,
        // Esta línea sirve para recibir el catálogo de consentimientos legales.
        private readonly LegalConsentCatalog $legal,
        // Esta línea sirve para recibir la acción que registra consentimientos.
        private readonly RecordUserConsentsAction $recordConsents,
    ) {}

    /**
     * Los consentimientos ya llegan validados como aceptados (RegisterRequest
     * los exige a todos) — se registran en la misma transacción que la
     * cuenta: nunca existe un usuario sin su aceptación registrada.
     *
     * @param  array{name: string, email: string, password: string, phone?: string|null}  $data
     */
    // Esta línea sirve para declarar el método que recibe los datos del registro y devuelve el usuario.
    public function execute(array $data): User
    {
        // Esta línea sirve para crear el usuario y sus consentimientos dentro de una transacción.
        $user = DB::transaction(function () use ($data) {
            // Esta línea sirve para crear el usuario con los siguientes datos.
            $user = $this->users->create([
                // Esta línea sirve para guardar el nombre.
                'name' => $data['name'],
                // Esta línea sirve para guardar el correo.
                'email' => $data['email'],
                // Esta línea sirve para guardar el teléfono, o null si no se envió.
                'phone' => $data['phone'] ?? null,
                // Esta línea sirve para guardar la contraseña cifrada.
                'password' => Hash::make($data['password']),
                // Esta línea sirve para asignar el rol de usuario normal.
                'role' => 'user',
                // Esta línea sirve para dejar el perfil como no público en los rankings.
                'is_public_profile' => false,
                // Esta línea sirve para marcar la cuenta como no baneada.
                'is_banned' => false,
                // Esta línea sirve para dejar la verificación en dos pasos desactivada.
                'two_factor_enabled' => false,
            ]);

            // Esta línea sirve para registrar la aceptación de todos los consentimientos legales vigentes.
            $this->recordConsents->execute($user, $this->legal->consentTypes(), UserConsent::SOURCE_REGISTRATION);

            // Esta línea sirve para devolver el usuario creado desde la transacción.
            return $user;
        });

        // Esta línea sirve para disparar el evento de registro (envía el correo de verificación).
        event(new Registered($user));

        // Esta línea sirve para devolver el usuario registrado.
        return $user;
    }
}
