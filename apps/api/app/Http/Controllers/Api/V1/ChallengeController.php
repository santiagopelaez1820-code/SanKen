<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que recalcula el progreso en los retos.
use App\Application\Challenges\Actions\RecalculateChallengeProgressAction;
// Esta línea sirve para importar el servicio que arma la tabla de posiciones.
use App\Domain\Challenges\Services\ChallengeLeaderboardBuilder;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un reto.
use App\Http\Resources\ChallengeResource;
// Esta línea sirve para importar el modelo Challenge (reto).
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeParticipant (participación en un reto).
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar Carbon para manejar fechas.
use Carbon\Carbon;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Retos" de Swagger.
#[Group('Retos', 'Retos activos del período, inscripción y tabla de posiciones.', weight: 12)]
// Esta línea sirve para declarar el controller de retos.
class ChallengeController extends Controller
{
    /**
     * Listar los retos activos.
     *
     * Retos vigentes hoy, con la participación del usuario si ya se unió.
     */
    // Esta línea sirve para declarar el endpoint que lista los retos activos.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para guardar la fecha de hoy.
        $today = Carbon::today();
        // Esta línea sirve para obtener el id del usuario autenticado.
        $userId = $request->user()->id;

        // Esta línea sirve para consultar los retos.
        $challenges = Challenge::query()
            // Esta línea sirve para filtrar los que ya empezaron.
            ->whereDate('starts_at', '<=', $today)
            // Esta línea sirve para filtrar los que todavía no terminaron.
            ->whereDate('ends_at', '>=', $today)
            // Esta línea sirve para cargar solo la participación del usuario.
            ->with(['participants' => fn ($query) => $query->where('user_id', $userId)])
            // Esta línea sirve para ordenar por fecha de fin.
            ->orderBy('ends_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los retos con su formato.
        return response()->json(['data' => ChallengeResource::collection($challenges)]);
    }

    /**
     * Unirse a un reto.
     *
     * Solo retos activos. El progreso se calcula al instante con los
     * entrenamientos ya hechos en el período.
     */
    // Esta línea sirve para declarar el endpoint que une al usuario a un reto.
    public function join(Request $request, Challenge $challenge): JsonResponse
    {
        // Esta línea sirve para guardar la fecha de hoy.
        $today = Carbon::today();
        // Esta línea sirve para revisar si el reto todavía no empezó o ya terminó.
        if ($challenge->starts_at->gt($today) || $challenge->ends_at->lt($today)) {
            // Esta línea sirve para lanzar un error de validación indicando que el reto no está activo.
            throw ValidationException::withMessages(['challenge' => ['Este reto no está activo.']]);
        }

        // Esta línea sirve para registrar la participación si todavía no existía.
        ChallengeParticipant::query()->firstOrCreate([
            // Esta línea sirve para indicar el id del reto.
            'challenge_id' => $challenge->id,
            // Esta línea sirve para indicar el id del usuario.
            'user_id' => $request->user()->id,
        ]);

        // Recalcula de una para que el usuario vea su progreso real (ej.
        // entrenamientos ya hechos esta semana antes de unirse) en vez de
        // arrancar en 0 hasta el próximo WorkoutCompleted.
        // Esta línea sirve para recalcular en el momento el progreso del usuario.
        RecalculateChallengeProgressAction::dispatchSync($request->user());

        // Esta línea sirve para cargar la participación del usuario en el reto.
        $challenge->load(['participants' => fn ($query) => $query->where('user_id', $request->user()->id)]);

        // Esta línea sirve para responder con el reto con su formato.
        return response()->json(['data' => new ChallengeResource($challenge)]);
    }

    /** Ver la tabla de posiciones de un reto. */
    // Esta línea sirve para declarar el endpoint que muestra la tabla de posiciones de un reto.
    public function leaderboard(Request $request, Challenge $challenge, ChallengeLeaderboardBuilder $builder): JsonResponse
    {
        // Esta línea sirve para responder con la tabla.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el id del reto.
            'challenge_id' => $challenge->id,
            // Esta línea sirve para incluir las posiciones (marcando la del usuario).
            'entries' => $builder->build($challenge, $request->user()->id),
        ]]);
    }
}
