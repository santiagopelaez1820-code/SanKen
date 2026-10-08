<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un ejercicio del catálogo.
use App\Http\Resources\ExerciseCatalogResource;
// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Ejercicios" de Swagger.
#[Group('Ejercicios', 'Catálogo de ejercicios activos.', weight: 5)]
// Esta línea sirve para declarar el controller del catálogo de ejercicios.
class ExerciseController extends Controller
{
    /**
     * Listar el catálogo de ejercicios.
     *
     * Catálogo completo de ejercicios activos, usado por el editor de
     * rutinas manuales del entrenador para elegir ejercicios. No pagina:
     * el catálogo (decenas-cientos de filas) se filtra/busca en el cliente.
     */
    // Esta línea sirve para declarar el endpoint que lista el catálogo de ejercicios.
    public function index(): JsonResponse
    {
        // Esta línea sirve para consultar los ejercicios.
        $exercises = Exercise::query()
            // Esta línea sirve para filtrar solo los activos.
            ->where('is_active', true)
            // Esta línea sirve para cargar su músculo principal.
            ->with('primaryMuscle')
            // Esta línea sirve para ordenar por nombre.
            ->orderBy('name')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los ejercicios.
        return response()->json([
            // Esta línea sirve para incluir los ejercicios con su formato.
            'data' => ExerciseCatalogResource::collection($exercises),
        ]);
    }
}
