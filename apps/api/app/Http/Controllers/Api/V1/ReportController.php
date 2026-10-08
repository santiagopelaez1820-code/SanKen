<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la creación de un reporte.
use App\Http\Requests\StoreReportRequest;
// Esta línea sirve para importar el resource que da formato a un reporte.
use App\Http\Resources\ReportResource;
// Esta línea sirve para importar el modelo Report (reporte de contenido).
use App\Models\Report;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Reportes" de Swagger.
#[Group('Reportes', 'Denuncia de contenido inapropiado para que lo revise un Super Admin.', weight: 20)]
// Esta línea sirve para declarar el controller de reportes de contenido.
class ReportController extends Controller
{
    /**
     * Reportar contenido.
     *
     * Por ahora solo se pueden reportar mensajes de chat
     * (`reportable_type: chat_message`).
     */
    // Esta línea sirve para declarar el endpoint que crea un reporte.
    public function store(StoreReportRequest $request): JsonResponse
    {
        // Esta línea sirve para crear el reporte.
        $report = Report::query()->create([
            // Esta línea sirve para guardar quién hace el reporte.
            'reporter_id' => $request->user()->id,
            // Esta línea sirve para guardar el tipo de contenido reportado.
            'reportable_type' => $request->validated('reportable_type'),
            // Esta línea sirve para guardar el id del contenido reportado.
            'reportable_id' => $request->validated('reportable_id'),
            // Esta línea sirve para guardar el motivo.
            'reason' => $request->validated('reason'),
            // Esta línea sirve para guardar los detalles opcionales.
            'details' => $request->validated('details'),
        ]);

        // Esta línea sirve para responder con el reporte creado y código 201.
        return response()->json(['data' => new ReportResource($report->load('reporter'))], 201);
    }
}
