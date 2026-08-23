<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Challenges\Actions\RecalculateChallengeProgressAction;
use App\Domain\Challenges\Services\ChallengeLeaderboardBuilder;
use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\ChallengeParticipant;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChallengeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();
        $userId = $request->user()->id;

        $challenges = Challenge::query()
            ->whereDate('starts_at', '<=', $today)
            ->whereDate('ends_at', '>=', $today)
            ->with(['participants' => fn ($query) => $query->where('user_id', $userId)])
            ->orderBy('ends_at')
            ->get();

        return response()->json(['data' => ChallengeResource::collection($challenges)]);
    }

    public function join(Request $request, Challenge $challenge): JsonResponse
    {
        $today = Carbon::today();
        if ($challenge->starts_at->gt($today) || $challenge->ends_at->lt($today)) {
            throw ValidationException::withMessages(['challenge' => ['Este reto no está activo.']]);
        }

        ChallengeParticipant::query()->firstOrCreate([
            'challenge_id' => $challenge->id,
            'user_id' => $request->user()->id,
        ]);

        // Recalcula de una para que el usuario vea su progreso real (ej.
        // entrenamientos ya hechos esta semana antes de unirse) en vez de
        // arrancar en 0 hasta el próximo WorkoutCompleted.
        RecalculateChallengeProgressAction::dispatchSync($request->user());

        $challenge->load(['participants' => fn ($query) => $query->where('user_id', $request->user()->id)]);

        return response()->json(['data' => new ChallengeResource($challenge)]);
    }

    public function leaderboard(Request $request, Challenge $challenge, ChallengeLeaderboardBuilder $builder): JsonResponse
    {
        return response()->json(['data' => [
            'challenge_id' => $challenge->id,
            'entries' => $builder->build($challenge, $request->user()->id),
        ]]);
    }
}
