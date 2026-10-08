<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de gamificación.

namespace App\Application\Gamification\Actions;

// Esta línea sirve para importar el catálogo con las definiciones de los logros.
use App\Domain\Gamification\Services\AchievementCatalog;
// Esta línea sirve para importar el modelo Achievement (logro).
use App\Models\Achievement;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo que registra los logros desbloqueados por cada usuario.
use App\Models\UserAchievement;

// Esta línea sirve para declarar la acción que revisa y desbloquea logros nuevos.
class EvaluateAchievementsAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir la acción que otorga XP.
        private readonly AwardXpAction $awardXpAction,
    ) {}

    /**
     * @return array<int, array{achievement: Achievement, xp_result: array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}}>
     */
    // Esta línea sirve para declarar el método que recibe al usuario, el tipo de logro y el valor actual.
    public function execute(User $user, string $type, int $currentValue): array
    {
        // Esta línea sirve para obtener los ids de los logros que el usuario ya tiene.
        $unlockedIds = UserAchievement::query()->where('user_id', $user->id)->pluck('achievement_id')->all();
        // Esta línea sirve para iniciar la lista de logros desbloqueados en esta ejecución.
        $newlyUnlocked = [];

        // Esta línea sirve para recorrer las definiciones de logros de ese tipo.
        foreach (AchievementCatalog::byType($type) as $definition) {
            // Esta línea sirve para revisar si el valor actual no alcanza el umbral del logro.
            if ($currentValue < $definition['threshold']) {
                // Esta línea sirve para saltar al siguiente logro.
                continue;
            }

            // Esta línea sirve para buscar el logro en la base de datos por su código.
            $achievement = Achievement::query()->where('code', $definition['code'])->first();

            // Esta línea sirve para revisar si el logro no existe o el usuario ya lo tenía.
            if (! $achievement || in_array($achievement->id, $unlockedIds, true)) {
                // Esta línea sirve para saltar al siguiente logro.
                continue;
            }

            // Esta línea sirve para registrar que el usuario desbloqueó el logro.
            UserAchievement::query()->create([
                // Esta línea sirve para guardar el id del usuario.
                'user_id' => $user->id,
                // Esta línea sirve para guardar el id del logro.
                'achievement_id' => $achievement->id,
                // Esta línea sirve para guardar la fecha en que lo logró.
                'achieved_at' => now(),
            ]);

            // Esta línea sirve para agregar el logro a la lista de recién desbloqueados.
            $newlyUnlocked[] = [
                // Esta línea sirve para incluir el logro.
                'achievement' => $achievement,
                // Esta línea sirve para otorgar la XP extra del logro e incluir el resultado.
                'xp_result' => $this->awardXpAction->execute($user, $achievement->xp_bonus),
            ];
        }

        // Esta línea sirve para devolver los logros desbloqueados en esta ejecución.
        return $newlyUnlocked;
    }
}
