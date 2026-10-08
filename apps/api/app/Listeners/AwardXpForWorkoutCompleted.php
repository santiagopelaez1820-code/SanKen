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
// Esta línea sirve para importar el evento de entrenamiento completado.
use App\Events\WorkoutCompleted;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;

// Esta línea sirve para declarar el listener que otorga XP al completar un entrenamiento.
class AwardXpForWorkoutCompleted
{
    // Esta línea sirve para definir la XP base por completar un entrenamiento.
    private const BASE_XP = 20;

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
    public function handle(WorkoutCompleted $event): array
    {
        // Esta línea sirve para otorgar la XP base al usuario.
        $base = $this->awardXpAction->execute($event->user, self::BASE_XP);

        // Esta línea sirve para consultar las sesiones del usuario.
        $sessionsCount = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $event->user->id)
            // Esta línea sirve para filtrar solo las completadas.
            ->where('completed', true)
            // Esta línea sirve para contarlas.
            ->count();

        // Esta línea sirve para evaluar los logros por cantidad de sesiones.
        $unlocked = $this->evaluateAchievementsAction->execute(
            // Esta línea sirve para pasar el usuario, el tipo de logro y la cantidad.
            $event->user, AchievementCatalog::TYPE_SESSIONS_COUNT, $sessionsCount,
        );

        // Esta línea sirve para devolver el resultado combinado de XP y logros.
        return GamificationResultBuilder::merge($base, $unlocked);
    }
}
