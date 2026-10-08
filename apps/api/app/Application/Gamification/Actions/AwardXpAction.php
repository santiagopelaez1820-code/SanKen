<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de gamificación.

namespace App\Application\Gamification\Actions;

// Esta línea sirve para importar el servicio que calcula niveles a partir de la XP.
use App\Domain\Gamification\Services\XpLevelCalculator;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserXp (experiencia acumulada).
use App\Models\UserXp;

// Esta línea sirve para declarar la acción que suma experiencia (XP) a un usuario.
class AwardXpAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el calculador de niveles.
        private readonly XpLevelCalculator $calculator,
    ) {}

    /**
     * @return array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}
     */
    // Esta línea sirve para declarar el método que recibe al usuario y la XP a sumar.
    public function execute(User $user, int $amount): array
    {
        // Esta línea sirve para obtener el registro de XP del usuario o crearlo en 0.
        $xp = UserXp::query()->firstOrCreate(['user_id' => $user->id], ['total_xp' => 0]);
        // Esta línea sirve para calcular el nivel que tenía antes de sumar.
        $previousLevel = $this->calculator->level($xp->total_xp);

        // Esta línea sirve para sumar la XP en la base de datos.
        $xp->increment('total_xp', $amount);

        // Esta línea sirve para calcular el nivel nuevo.
        $newLevel = $this->calculator->level($xp->total_xp);

        // Esta línea sirve para devolver el resumen de la XP otorgada.
        return [
            // Esta línea sirve para incluir la XP total.
            'total_xp' => $xp->total_xp,
            // Esta línea sirve para incluir la XP que se acaba de sumar.
            'xp_awarded' => $amount,
            // Esta línea sirve para indicar si subió de nivel.
            'leveled_up' => $newLevel > $previousLevel,
            // Esta línea sirve para incluir el nivel anterior.
            'previous_level' => $previousLevel,
            // Esta línea sirve para incluir el nivel nuevo.
            'new_level' => $newLevel,
        ];
    }
}
