<?php

namespace App\Policies;

use App\Models\TrainerClient;
use App\Models\User;

class TrainerClientPolicy
{
    public function view(User $user, TrainerClient $trainerClient): bool
    {
        return $user->is($trainerClient->trainer);
    }

    public function update(User $user, TrainerClient $trainerClient): bool
    {
        return $user->is($trainerClient->trainer);
    }

    /**
     * A diferencia de view/update (solo entrenador), el chat es simétrico:
     * cualquiera de las dos partes puede abrirlo, pero solo mientras la
     * relación sigue activa — pausada/finalizada conserva el historial de
     * lectura (ver ChatController::messages) pero no permite nuevas
     * conversaciones ni mensajes nuevos.
     */
    public function converse(User $user, TrainerClient $trainerClient): bool
    {
        return ($user->is($trainerClient->trainer) || $user->is($trainerClient->client))
            && $trainerClient->status === 'active';
    }
}
