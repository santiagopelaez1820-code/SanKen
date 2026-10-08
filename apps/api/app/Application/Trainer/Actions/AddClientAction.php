<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del entrenador.

namespace App\Application\Trainer\Actions;

// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Vincula un usuario existente como cliente de un entrenador. No hay flujo
 * de invitación en este sprint: la relación queda activa de inmediato.
 */
// Esta línea sirve para declarar la acción que vincula un cliente a un entrenador.
class AddClientAction
{
    // Esta línea sirve para declarar el método que recibe al entrenador y el correo del cliente.
    public function execute(User $trainer, string $email): TrainerClient
    {
        // Esta línea sirve para buscar al usuario con ese correo.
        $client = User::query()->where('email', $email)->first();

        // Esta línea sirve para revisar si no existe o no es un usuario normal.
        if (! $client || $client->role !== 'user') {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que no existe un usuario con ese correo.
                'email' => ['No existe un usuario con ese correo.'],
            ]);
        }

        // Esta línea sirve para consultar si ya hay una relación vigente con ese cliente.
        $alreadyLinked = TrainerClient::query()
            // Esta línea sirve para filtrar por el entrenador.
            ->where('trainer_id', $trainer->id)
            // Esta línea sirve para filtrar por el cliente.
            ->where('client_id', $client->id)
            // Esta línea sirve para filtrar solo relaciones pendientes, activas o pausadas.
            ->whereIn('status', ['pending', 'active', 'paused'])
            // Esta línea sirve para devolver verdadero si existe alguna.
            ->exists();

        // Esta línea sirve para revisar si ya están vinculados.
        if ($alreadyLinked) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que ya existe una relación activa.
                'email' => ['Ya tienes una relación activa con este cliente.'],
            ]);
        }

        // Esta línea sirve para crear la relación entrenador-cliente y devolverla.
        return TrainerClient::query()->create([
            // Esta línea sirve para guardar el id del entrenador.
            'trainer_id' => $trainer->id,
            // Esta línea sirve para guardar el id del cliente.
            'client_id' => $client->id,
            // Esta línea sirve para dejar la relación activa de inmediato.
            'status' => 'active',
            // Esta línea sirve para guardar la fecha de inicio.
            'started_at' => now(),
        ]);
    }
}
