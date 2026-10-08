<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de retos.

namespace App\Domain\Challenges\Services;

// Esta línea sirve para importar el modelo Challenge (reto).
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeParticipant (participación en un reto).
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar la clase Collection para trabajar con listas.
use Illuminate\Support\Collection;

/**
 * Arma el top 10 + el propio participante (si quedó fuera del top 10) de un
 * reto. Única fuente de verdad tanto para la lectura inicial
 * (GET /challenges/{id}/leaderboard, antes de que el websocket tome la
 * posta) como para el payload que RecalculateChallengeProgressAction manda
 * por Reverb — así ambos caminos siempre muestran exactamente la misma
 * forma de datos.
 */
// Esta línea sirve para declarar el servicio que arma la tabla de posiciones de un reto.
final class ChallengeLeaderboardBuilder
{
    // Esta línea sirve para definir cuántas posiciones se muestran (top 10).
    private const LIMIT = 10;

    /**
     * @return array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>
     */
    // Esta línea sirve para declarar el método que arma la tabla de un reto para un usuario.
    public function build(Challenge $challenge, ?int $viewerUserId = null): array
    {
        // Esta línea sirve para consultar los participantes.
        $participants = ChallengeParticipant::query()
            // Esta línea sirve para filtrar por el reto pedido.
            ->where('challenge_id', $challenge->id)
            // Esta línea sirve para cargar solo el id y nombre del usuario.
            ->with('user:id,name')
            // Esta línea sirve para ordenar de mayor a menor progreso.
            ->orderByDesc('progress_value')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para asignar las posiciones con empates.
        $ranked = $this->rank($participants);

        // Esta línea sirve para tomar las primeras 10 posiciones.
        $entries = $ranked->take(self::LIMIT);

        // Esta línea sirve para buscar la fila del usuario que consulta, si se indicó.
        $viewerEntry = $viewerUserId !== null ? $ranked->firstWhere('user_id', $viewerUserId) : null;
        // Esta línea sirve para revisar si el usuario quedó fuera del top 10.
        if ($viewerEntry !== null && ! $entries->contains('user_id', $viewerUserId)) {
            // Esta línea sirve para agregar su fila al final.
            $entries = $entries->push($viewerEntry);
        }

        // Esta línea sirve para devolver la tabla.
        return $entries
            // Esta línea sirve para marcar cuál fila es del usuario que consulta.
            ->map(fn (array $entry) => [...$entry, 'is_viewer' => $entry['user_id'] === $viewerUserId])
            // Esta línea sirve para reindexar la lista.
            ->values()
            // Esta línea sirve para convertir la colección en arreglo.
            ->all();
    }

    /**
     * Ranking de competición (1,2,2,4): los empates comparten posición.
     * Mismo criterio que RecalculateRankingsAction::rankGroup.
     *
     * @return Collection<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool}>
     */
    // Esta línea sirve para declarar el método privado que asigna posiciones con empates.
    private function rank(Collection $participants): Collection
    {
        // Esta línea sirve para iniciar la posición actual.
        $rank = 0;
        // Esta línea sirve para iniciar el valor anterior para detectar empates.
        $previousValue = null;
        // Esta línea sirve para iniciar el contador de filas.
        $position = 0;

        // Esta línea sirve para transformar cada participante en una fila con posición.
        return $participants->map(function (ChallengeParticipant $participant) use (&$rank, &$previousValue, &$position) {
            // Esta línea sirve para avanzar el contador de filas.
            $position++;
            // Esta línea sirve para obtener el progreso como número.
            $value = (float) $participant->progress_value;
            // Esta línea sirve para revisar si el valor es distinto al anterior (no hay empate).
            if ($value !== $previousValue) {
                // Esta línea sirve para asignar la posición según el número de fila.
                $rank = $position;
                // Esta línea sirve para guardar este valor como el anterior.
                $previousValue = $value;
            }

            // Esta línea sirve para devolver la fila.
            return [
                // Esta línea sirve para incluir la posición.
                'rank' => $rank,
                // Esta línea sirve para incluir el id del usuario.
                'user_id' => $participant->user_id,
                // Esta línea sirve para incluir el nombre del usuario.
                'user_name' => $participant->user->name,
                // Esta línea sirve para incluir el progreso.
                'progress_value' => $value,
                // Esta línea sirve para incluir si completó el reto.
                'completed' => $participant->completed,
            ];
        });
    }
}
