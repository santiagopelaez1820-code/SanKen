<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * El único ranking hoy es por ejercicio (ver ExerciseRankingController) —
 * este controller solo administra el flag is_public_profile que ambos
 * sistemas (el de antes y el actual) siempre compartieron. El listado
 * general por volumen (Bloque 5, Fase 3) se retiró: no tenía forma de
 * combinar PRs de distintos ejercicios sin inventar una métrica nueva, y
 * el pedido explícitamente exige que Rankings solo use PRs aprobados.
 */
class RankingController extends Controller
{
    public function optIn(Request $request): JsonResponse
    {
        $request->user()->update(['is_public_profile' => true]);

        return response()->json(['data' => new UserResource($request->user())]);
    }

    public function optOut(Request $request): JsonResponse
    {
        $request->user()->update(['is_public_profile' => false]);

        return response()->json(['data' => new UserResource($request->user())]);
    }
}
