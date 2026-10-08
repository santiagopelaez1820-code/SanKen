<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de la relación entrenador-cliente.
class TrainerClientPolicy
{
    // Esta línea sirve para declarar el permiso para ver la relación.
    public function view(User $user, TrainerClient $trainerClient): bool
    {
        // Esta línea sirve para permitirlo solo al entrenador.
        return $user->is($trainerClient->trainer);
    }

    // Esta línea sirve para declarar el permiso para modificar la relación.
    public function update(User $user, TrainerClient $trainerClient): bool
    {
        // Esta línea sirve para permitirlo solo al entrenador.
        return $user->is($trainerClient->trainer);
    }

    /**
     * A diferencia de view/update (solo entrenador), el chat es simétrico:
     * cualquiera de las dos partes puede abrirlo, pero solo mientras la
     * relación sigue activa — pausada/finalizada conserva el historial de
     * lectura (ver ChatController::messages) pero no permite nuevas
     * conversaciones ni mensajes nuevos.
     */
    // Esta línea sirve para declarar el permiso para usar el chat.
    public function converse(User $user, TrainerClient $trainerClient): bool
    {
        // Esta línea sirve para permitirlo al entrenador o al cliente.
        return ($user->is($trainerClient->trainer) || $user->is($trainerClient->client))
            // Esta línea sirve para exigir que la relación esté activa.
            && $trainerClient->status === 'active';
    }
}
