<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los listeners.

namespace App\Listeners;

// Esta línea sirve para importar la acción que otorga XP.
use App\Application\Gamification\Actions\AwardXpAction;
// Esta línea sirve para importar la acción que evalúa logros.
use App\Application\Gamification\Actions\EvaluateAchievementsAction;
// Esta línea sirve para importar la clase que arma el resultado de gamificación.
use App\Application\Gamification\Support\GamificationResultBuilder;
// Esta línea sirve para importar el catálogo de logros.
use App\Domain\Gamification\Services\AchievementCatalog;
// Esta línea sirve para importar el evento de récord personal superado.
use App\Events\PRBroken;
// Esta línea sirve para importar el modelo PersonalRecord (récord personal).
use App\Models\PersonalRecord;

// Esta línea sirve para declarar el listener que otorga XP al superar un récord.
class AwardXpForPrBroken
{
    // Esta línea sirve para definir la XP base por superar un récord.
    private const BASE_XP = 30;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir la acción que otorga XP.
        private readonly AwardXpAction $awardXpAction,
        // Esta línea sirve para recibir la acción que evalúa logros.
        private readonly EvaluateAchievementsAction $evaluateAchievementsAction,
    ) {}

    /**
     * @return array{xp_awarded: int, leveled_up: bool, new_level: int, achievements_unlocked: array<int, array{code: string, name: string, description: string, xp_bonus: int}>}
     */
    // Esta línea sirve para declarar el método que atiende el evento.
    public function handle(PRBroken $event): array
    {
        // Esta línea sirve para otorgar la XP base al usuario.
        $base = $this->awardXpAction->execute($event->user, self::BASE_XP);

        // Esta línea sirve para contar los récords personales del usuario.
        $prsCount = PersonalRecord::query()->where('user_id', $event->user->id)->count();

        // Esta línea sirve para evaluar los logros por cantidad de récords.
        $unlocked = $this->evaluateAchievementsAction->execute(
            // Esta línea sirve para pasar el usuario, el tipo de logro y la cantidad.
            $event->user, AchievementCatalog::TYPE_PRS_COUNT, $prsCount,
        );

        // Esta línea sirve para devolver el resultado combinado de XP y logros.
        return GamificationResultBuilder::merge($base, $unlocked);
    }
}
