<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de retos.

namespace App\Application\Challenges\Actions;

// Esta línea sirve para importar el servicio que arma la tabla de posiciones de un reto.
use App\Domain\Challenges\Services\ChallengeLeaderboardBuilder;
// Esta línea sirve para importar el servicio que calcula el progreso en un reto.
use App\Domain\Challenges\Services\ChallengeProgressCalculator;
// Esta línea sirve para importar el evento que avisa en tiempo real que cambió el progreso.
use App\Events\ChallengeProgressUpdated;
// Esta línea sirve para importar el modelo ChallengeParticipant (participación en un reto).
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar Carbon para manejar fechas.
use Carbon\Carbon;
// Esta línea sirve para importar la interfaz que permite ejecutar esta acción en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar el trait que permite despachar la acción.
use Illuminate\Foundation\Bus\Dispatchable;
// Esta línea sirve para importar el trait para interactuar con la cola.
use Illuminate\Queue\InteractsWithQueue;
// Esta línea sirve para importar el trait que serializa modelos al encolar.
use Illuminate\Queue\SerializesModels;

/**
 * Recalcula el progreso de un usuario en cada reto activo al que está
 * unido, y transmite el leaderboard actualizado por Reverb para cada reto
 * que cambió. Se dispara síncronamente (dispatchSync) desde
 * UpdateChallengeProgressOnWorkoutCompleted, en el mismo request que
 * completa la sesión — por eso ChallengeProgressCalculator lee directo de
 * workout_sessions/workout_sets en vez de la tabla user_stats_daily (que se
 * recalcula en cola, sin garantía de orden respecto a este evento).
 */
// Esta línea sirve para declarar la acción que recalcula el progreso de un usuario en sus retos.
class RecalculateChallengeProgressAction implements ShouldQueue
{
    // Esta línea sirve para incluir los traits para poder despacharla y encolarla.
    use Dispatchable, InteractsWithQueue, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe al usuario.
    public function __construct(
        // Esta línea sirve para guardar el usuario cuyo progreso se va a recalcular.
        public readonly User $user,
    ) {}

    // Esta línea sirve para declarar el método que hace el recálculo con sus servicios.
    public function handle(ChallengeProgressCalculator $calculator, ChallengeLeaderboardBuilder $leaderboardBuilder): void
    {
        // Esta línea sirve para guardar la fecha de hoy.
        $today = Carbon::today();

        // Esta línea sirve para consultar las participaciones del usuario.
        $participations = ChallengeParticipant::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $this->user->id)
            // Esta línea sirve para quedarse solo con retos que están vigentes hoy.
            ->whereHas('challenge', function ($query) use ($today) {
                // Esta línea sirve para exigir que el reto ya haya empezado y todavía no haya terminado.
                $query->whereDate('starts_at', '<=', $today)->whereDate('ends_at', '>=', $today);
            })
            // Esta línea sirve para cargar el reto de cada participación.
            ->with('challenge')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para recorrer cada participación.
        foreach ($participations as $participant) {
            // Esta línea sirve para obtener el reto de la participación.
            $challenge = $participant->challenge;
            // Esta línea sirve para obtener el criterio del reto (métrica y meta).
            $criteria = $challenge->criteria;

            // Esta línea sirve para calcular el valor alcanzado por el usuario en el reto.
            $value = $calculator->calculate(
                // Esta línea sirve para pasar el id del usuario.
                $this->user->id,
                // Esta línea sirve para pasar la métrica a medir.
                $criteria['metric'],
                // Esta línea sirve para pasar la fecha de inicio del reto.
                $challenge->starts_at,
                // Esta línea sirve para pasar la fecha de fin del reto.
                $challenge->ends_at,
            );

            // Esta línea sirve para actualizar la participación.
            $participant->update([
                // Esta línea sirve para guardar el valor alcanzado.
                'progress_value' => $value,
                // Esta línea sirve para marcar como completado si alcanzó la meta.
                'completed' => $value >= $criteria['target'],
            ]);

            // Esta línea sirve para avisar en tiempo real la nueva tabla de posiciones del reto.
            ChallengeProgressUpdated::dispatch($challenge, $leaderboardBuilder->build($challenge));
        }
    }
}
