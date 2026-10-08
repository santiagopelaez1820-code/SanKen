<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un usuario.
use App\Http\Resources\UserResource;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

/**
 * El único ranking hoy es por ejercicio (ver ExerciseRankingController) —
 * este controller solo administra el flag is_public_profile que ambos
 * sistemas (el de antes y el actual) siempre compartieron. El listado
 * general por volumen (Bloque 5, Fase 3) se retiró: no tenía forma de
 * combinar PRs de distintos ejercicios sin inventar una métrica nueva, y
 * el pedido explícitamente exige que Rankings solo use PRs aprobados.
 */
// Esta línea sirve para agrupar este controller en la sección "Rankings" de Swagger.
#[Group('Rankings', 'Rankings por ejercicio (solo cuentan PRs aprobados) y visibilidad del perfil en ellos.', weight: 11)]
// Esta línea sirve para declarar el controller de la visibilidad del perfil en los rankings.
class RankingController extends Controller
{
    /**
     * Mostrar mi perfil en los rankings.
     *
     * Activa `is_public_profile`.
     */
    // Esta línea sirve para declarar el endpoint que muestra el perfil del usuario en los rankings.
    public function optIn(Request $request): JsonResponse
    {
        // Esta línea sirve para marcar el perfil del usuario como público.
        $request->user()->update(['is_public_profile' => true]);

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new UserResource($request->user())]);
    }

    /**
     * Ocultar mi perfil de los rankings.
     *
     * Desactiva `is_public_profile`.
     */
    // Esta línea sirve para declarar el endpoint que oculta el perfil del usuario de los rankings.
    public function optOut(Request $request): JsonResponse
    {
        // Esta línea sirve para marcar el perfil del usuario como privado.
        $request->user()->update(['is_public_profile' => false]);

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new UserResource($request->user())]);
    }
}
