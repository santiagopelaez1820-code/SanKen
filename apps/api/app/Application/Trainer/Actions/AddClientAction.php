<?php

namespace App\Application\Trainer\Actions;

use App\Models\TrainerClient;
use App\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * Vincula un usuario existente como cliente de un entrenador. No hay flujo
 * de invitación en este sprint: la relación queda activa de inmediato.
 */
class AddClientAction
{
    public function execute(User $trainer, string $email): TrainerClient
    {
        $client = User::query()->where('email', $email)->first();

        if (! $client || $client->role !== 'user') {
            throw ValidationException::withMessages([
                'email' => ['No existe un usuario con ese correo.'],
            ]);
        }

        $alreadyLinked = TrainerClient::query()
            ->where('trainer_id', $trainer->id)
            ->where('client_id', $client->id)
            ->whereIn('status', ['pending', 'active', 'paused'])
            ->exists();

        if ($alreadyLinked) {
            throw ValidationException::withMessages([
                'email' => ['Ya tienes una relación activa con este cliente.'],
            ]);
        }

        return TrainerClient::query()->create([
            'trainer_id' => $trainer->id,
            'client_id' => $client->id,
            'status' => 'active',
            'started_at' => now(),
        ]);
    }
}
