<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que registra una medida corporal.
use App\Application\Progress\Actions\RecordBodyMeasurementAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de una medida corporal.
use App\Http\Requests\Progress\StoreBodyMeasurementRequest;
// Esta línea sirve para importar el resource que da formato a una medida corporal.
use App\Http\Resources\BodyMeasurementResource;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Progreso y estadísticas" de Swagger.
#[Group('Progreso y estadísticas', weight: 8)]
// Esta línea sirve para declarar el controller de medidas corporales.
class BodyMeasurementController extends Controller
{
    /**
     * Listar mis medidas corporales.
     *
     * Paginado de a 15, de la más reciente a la más antigua.
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista las medidas del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las medidas del usuario autenticado.
        $measurements = $request->user()->bodyMeasurements()
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->orderByDesc('measured_at')
            // Esta línea sirve para paginar de a 15.
            ->paginate(15);

        // Esta línea sirve para responder con las medidas.
        return response()->json([
            // Esta línea sirve para incluir las medidas con su formato.
            'data' => BodyMeasurementResource::collection($measurements->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($measurements),
        ]);
    }

    /** Registrar medidas corporales. */
    // Esta línea sirve para declarar el endpoint que registra una medida corporal.
    public function store(StoreBodyMeasurementRequest $request, RecordBodyMeasurementAction $action): JsonResponse
    {
        // Esta línea sirve para guardar la medida con los datos validados.
        $measurement = $action->execute($request->user(), $request->validated());

        // Esta línea sirve para responder con la medida creada.
        return response()->json([
            // Esta línea sirve para incluir la medida con su formato.
            'data' => new BodyMeasurementResource($measurement),
            // Esta línea sirve para indicar el código 201 (creado).
        ], 201);
    }
}
