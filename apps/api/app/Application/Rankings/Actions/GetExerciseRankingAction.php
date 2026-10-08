<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de rankings.

namespace App\Application\Rankings\Actions;

// Esta línea sirve para importar el servicio que resuelve el país y la ciudad del usuario.
use App\Domain\Rankings\Services\RankingScopeResolver;
// Esta línea sirve para importar el modelo City (ciudad).
use App\Models\City;
// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo PrSubmission (postulación de récord).
use App\Models\PrSubmission;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase Collection para trabajar con listas.
use Illuminate\Support\Collection;

/**
 * Ranking en vivo (sin snapshot ni cron) del mejor 1RM aprobado por
 * ejercicio, filtrado por país/ciudad del perfil del usuario que consulta
 * — nunca por un valor arbitrario en la URL — y por sexo (filtro explícito
 * que el que consulta elige, ver $sex).
 *
 * Fuente de datos: SOLO PrSubmission con status='approved' (postulación
 * con video, revisada por Super Admin — ver PrSubmissionController/
 * AdminPrSubmissionController). PersonalRecord (detección automática en
 * el entrenamiento / registro manual privado) nunca alimenta esto — es
 * intencional, ver la sección "PR y Rankings" del pedido: un usuario ve
 * sus propios PersonalRecord en su historial privado, pero Rankings
 * públicos exigen la revisión con video.
 */
// Esta línea sirve para declarar la acción que arma el ranking de un ejercicio.
class GetExerciseRankingAction
{
    // Esta línea sirve para definir el máximo de posiciones que se devuelven.
    private const LIMIT = 100;

    /**
     * @return array{scope: string, scope_label: ?string, sex: string, exercise_id: int, exercise_name: string, entries: array<int, array<string, mixed>>, viewer: ?array<string, mixed>}
     */
    // Esta línea sirve para declarar el método que recibe ejercicio, ámbito, sexo, usuario y resolvedor.
    public function execute(Exercise $exercise, string $scope, string $sex, User $viewer, RankingScopeResolver $resolver): array
    {
        // Esta línea sirve para obtener el país o la ciudad del usuario según el ámbito (null si es global).
        $scopeValue = $scope === 'global' ? null : $resolver->resolve($viewer->profile)[$scope];

        // Esta línea sirve para revisar si el ámbito no es global y el usuario no tiene esa ubicación.
        if ($scope !== 'global' && $scopeValue === null) {
            // Esta línea sirve para devolver un ranking vacío.
            return [
                // Esta línea sirve para incluir el ámbito pedido.
                'scope' => $scope,
                // Esta línea sirve para dejar vacía la etiqueta del ámbito.
                'scope_label' => null,
                // Esta línea sirve para incluir el sexo pedido.
                'sex' => $sex,
                // Esta línea sirve para incluir el id del ejercicio.
                'exercise_id' => $exercise->id,
                // Esta línea sirve para incluir el nombre del ejercicio.
                'exercise_name' => $exercise->name,
                // Esta línea sirve para dejar vacía la lista de posiciones.
                'entries' => [],
                // Esta línea sirve para dejar vacía la fila del usuario que consulta.
                'viewer' => null,
            ];
        }

        // Esta línea sirve para consultar las postulaciones de récords.
        $submissions = PrSubmission::query()
            // Esta línea sirve para filtrar por el ejercicio.
            ->where('exercise_id', $exercise->id)
            // Esta línea sirve para quedarse solo con las aprobadas.
            ->where('status', 'approved')
            // Esta línea sirve para filtrar solo usuarios con perfil público.
            ->whereHas('user', fn ($q) => $q->where('is_public_profile', true)
                // Esta línea sirve para filtrar además por el sexo pedido.
                ->whereHas('profile', fn ($q2) => $q2->where('sex', $sex)))
            // Esta línea sirve para cargar el usuario con su perfil y ciudad.
            ->with('user.profile.city')
            // Esta línea sirve para ejecutar la consulta.
            ->get()
            // Esta línea sirve para quedarse solo con las que coinciden con el ámbito (país o ciudad).
            ->filter(fn (PrSubmission $submission) => $this->matchesScope($submission, $scope, $scopeValue));

        // Un usuario puede tener varias postulaciones aprobadas para el
        // mismo ejercicio (distintos intentos) — solo cuenta la mejor.
        // Esta línea sirve para agrupar las postulaciones por usuario.
        $bestPerUser = $submissions
            // Esta línea sirve para agrupar por el id del usuario.
            ->groupBy('user_id')
            // Esta línea sirve para quedarse con la mejor postulación (mayor 1RM) de cada usuario.
            ->map(fn (Collection $group) => $group->sortByDesc(fn (PrSubmission $s) => (float) $s->estimated_1rm)->first());

        // Esta línea sirve para ordenar y asignar posiciones a los usuarios.
        $ranked = $this->rankGroup($bestPerUser->values());

        // Esta línea sirve para buscar la fila del usuario que consulta.
        $viewerRow = $ranked->first(fn (array $row) => $row['user_id'] === $viewer->id);

        // Esta línea sirve para devolver el ranking.
        return [
            // Esta línea sirve para incluir el ámbito.
            'scope' => $scope,
            // Esta línea sirve para incluir el nombre del país o ciudad.
            'scope_label' => $this->scopeLabel($scope, $scopeValue),
            // Esta línea sirve para incluir el sexo.
            'sex' => $sex,
            // Esta línea sirve para incluir el id del ejercicio.
            'exercise_id' => $exercise->id,
            // Esta línea sirve para incluir el nombre del ejercicio.
            'exercise_name' => $exercise->name,
            // Esta línea sirve para incluir las primeras posiciones con el formato de salida.
            'entries' => $ranked->take(self::LIMIT)->map(fn (array $row) => $this->toEntry($row, $viewer))->values()->all(),
            // Esta línea sirve para incluir la fila del usuario que consulta, si aparece.
            'viewer' => $viewerRow ? $this->toEntry($viewerRow, $viewer) : null,
        ];
    }

    // Esta línea sirve para declarar el método privado que revisa si una postulación entra en el ámbito.
    private function matchesScope(PrSubmission $submission, string $scope, ?string $scopeValue): bool
    {
        // Esta línea sirve para revisar si el ámbito es global.
        if ($scope === 'global') {
            // Esta línea sirve para aceptar todas las postulaciones.
            return true;
        }

        // Esta línea sirve para obtener el perfil del usuario de la postulación.
        $profile = $submission->user->profile;

        // Esta línea sirve para revisar si el ámbito es por ciudad.
        if ($scope === 'city') {
            // Esta línea sirve para aceptar si el usuario es de la misma ciudad.
            return $profile?->city_id !== null && (string) $profile->city_id === $scopeValue;
        }

        // Esta línea sirve para aceptar si el usuario es del mismo país.
        return $profile?->city?->country_id !== null && (string) $profile->city->country_id === $scopeValue;
    }

    /**
     * Ranking de competición (1,2,2,4): los empates comparten posición.
     *
     * @param  Collection<int, PrSubmission>  $submissions
     * @return Collection<int, array{user_id: int, user_name: string, metric_value: float, rank: int}>
     */
    // Esta línea sirve para declarar el método privado que asigna posiciones con empates.
    private function rankGroup(Collection $submissions): Collection
    {
        // Esta línea sirve para iniciar la posición actual.
        $rank = 0;
        // Esta línea sirve para iniciar el valor anterior para detectar empates.
        $previousValue = null;
        // Esta línea sirve para iniciar el contador de filas recorridas.
        $position = 0;

        // Esta línea sirve para devolver las postulaciones ya rankeadas.
        return $submissions
            // Esta línea sirve para ordenar de mayor a menor 1RM estimado.
            ->sortByDesc(fn (PrSubmission $s) => (float) $s->estimated_1rm)
            // Esta línea sirve para reindexar la lista.
            ->values()
            // Esta línea sirve para transformar cada postulación en una fila del ranking.
            ->map(function (PrSubmission $s) use (&$rank, &$previousValue, &$position) {
                // Esta línea sirve para obtener el 1RM estimado como número.
                $value = (float) $s->estimated_1rm;
                // Esta línea sirve para avanzar el contador de filas.
                $position++;
                // Esta línea sirve para revisar si el valor es distinto al anterior (no hay empate).
                if ($value !== $previousValue) {
                    // Esta línea sirve para asignar la posición según el número de fila.
                    $rank = $position;
                    // Esta línea sirve para guardar este valor como el anterior.
                    $previousValue = $value;
                }

                // Esta línea sirve para devolver la fila del ranking.
                return [
                    // Esta línea sirve para incluir el id del usuario.
                    'user_id' => $s->user_id,
                    // Esta línea sirve para incluir el nombre del usuario.
                    'user_name' => $s->user->name,
                    // Esta línea sirve para incluir el valor de la métrica (1RM).
                    'metric_value' => $value,
                    // Esta línea sirve para incluir la posición.
                    'rank' => $rank,
                ];
            });
    }

    /**
     * @param  array{user_id: int, user_name: string, metric_value: float, rank: int}  $row
     */
    // Esta línea sirve para declarar el método privado que da formato a una fila del ranking.
    private function toEntry(array $row, User $viewer): array
    {
        // Esta línea sirve para devolver la fila con el formato de salida.
        return [
            // Esta línea sirve para incluir la posición.
            'rank' => $row['rank'],
            // Esta línea sirve para incluir el id del usuario.
            'user_id' => $row['user_id'],
            // Esta línea sirve para incluir el nombre del usuario.
            'user_name' => $row['user_name'],
            // Esta línea sirve para incluir el valor de la métrica.
            'metric_value' => $row['metric_value'],
            // Esta línea sirve para indicar si la fila es del usuario que consulta.
            'is_viewer' => $row['user_id'] === $viewer->id,
        ];
    }

    // Esta línea sirve para declarar el método privado que devuelve el nombre del ámbito.
    private function scopeLabel(string $scope, ?string $scopeValue): ?string
    {
        // Esta línea sirve para elegir el nombre según el ámbito.
        return match ($scope) {
            // Esta línea sirve para devolver "Global" si el ámbito es global.
            'global' => 'Global',
            // Esta línea sirve para devolver el nombre de la ciudad si el ámbito es ciudad.
            'city' => City::find($scopeValue)?->name,
            // Esta línea sirve para devolver el nombre del país si el ámbito es país.
            'country' => Country::find($scopeValue)?->name,
            // Esta línea sirve para devolver null en cualquier otro caso.
            default => null,
        };
    }
}
