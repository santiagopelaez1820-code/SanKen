<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a la relación con un entrenador.
use App\Http\Resources\MyTrainerResource;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Mi entrenador" de Swagger.
#[Group('Mi entrenador', 'Entrenadores con los que el usuario tiene una relación activa.', weight: 15)]
// Esta línea sirve para declarar el controller de los entrenadores del usuario.
class MyTrainerController extends Controller
{
    /**
     * Listar mis entrenadores.
     *
     * Solo relaciones activas.
     */
    // Esta línea sirve para declarar el endpoint que lista los entrenadores del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las relaciones del usuario como cliente.
        $relationships = $request->user()->clientRelationships()
            // Esta línea sirve para filtrar solo las activas.
            ->where('status', 'active')
            // Esta línea sirve para cargar los datos del entrenador.
            ->with('trainer')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con las relaciones con su formato.
        return response()->json(['data' => MyTrainerResource::collection($relationships)]);
    }
}
