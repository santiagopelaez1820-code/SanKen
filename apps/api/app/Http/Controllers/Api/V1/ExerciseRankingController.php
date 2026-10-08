<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que arma el ranking de un ejercicio.
use App\Application\Rankings\Actions\GetExerciseRankingAction;
// Esta línea sirve para importar el servicio que resuelve el país y la ciudad del usuario.
use App\Domain\Rankings\Services\RankingScopeResolver;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del ámbito y sexo del ranking.
use App\Http\Requests\Rankings\ExerciseRankingScopeRequest;
// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Rankings" de Swagger.
#[Group('Rankings', weight: 11)]
// Esta línea sirve para declarar el controller del ranking por ejercicio.
class ExerciseRankingController extends Controller
{
    /**
     * Ver el ranking de un ejercicio.
     *
     * Clasificación por sexo en el ámbito pedido (`global`, `country` o
     * `city`, según la ubicación del usuario). `metric_value` es el 1RM
     * estimado de la mejor postulación aprobada de cada usuario; `viewer` es
     * la fila del usuario autenticado (null si no figura).
     *
     * @response array{data: array{
     *     scope: 'global'|'country'|'city',
     *     scope_label: string|null,
     *     sex: 'male'|'female',
     *     exercise_id: int,
     *     exercise_name: string,
     *     entries: list<array{rank: int, user_id: int, user_name: string, metric_value: float, is_viewer: bool}>,
     *     viewer: array{rank: int, user_id: int, user_name: string, metric_value: float, is_viewer: bool}|null,
     * }}
     */
    // Esta línea sirve para declarar el endpoint que devuelve el ranking de un ejercicio.
    public function index(
        // Esta línea sirve para recibir el ámbito y el sexo validados.
        ExerciseRankingScopeRequest $request,
        // Esta línea sirve para recibir el ejercicio de la URL.
        Exercise $exercise,
        // Esta línea sirve para recibir la acción que arma el ranking.
        GetExerciseRankingAction $action,
        // Esta línea sirve para recibir el resolvedor de ubicación.
        RankingScopeResolver $resolver,
        // Esta línea sirve para indicar que el método devuelve una respuesta JSON.
    ): JsonResponse {
        // Esta línea sirve para armar el ranking.
        $data = $action->execute(
            // Esta línea sirve para pasar el ejercicio.
            $exercise,
            // Esta línea sirve para pasar el ámbito pedido.
            $request->validated('scope'),
            // Esta línea sirve para pasar el sexo pedido.
            $request->validated('sex'),
            // Esta línea sirve para pasar el usuario que consulta.
            $request->user(),
            // Esta línea sirve para pasar el resolvedor de ubicación.
            $resolver,
        );

        // Esta línea sirve para responder con el ranking.
        return response()->json(['data' => $data]);
    }
}
