<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseCatalogResource;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;

class ExerciseController extends Controller
{
    /**
     * Catálogo completo de ejercicios activos, usado por el editor de
     * rutinas manuales del entrenador para elegir ejercicios. No pagina:
     * el catálogo (decenas-cientos de filas) se filtra/busca en el cliente.
     */
    public function index(): JsonResponse
    {
        $exercises = Exercise::query()
            ->where('is_active', true)
            ->with('primaryMuscle')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => ExerciseCatalogResource::collection($exercises),
        ]);
    }
}
