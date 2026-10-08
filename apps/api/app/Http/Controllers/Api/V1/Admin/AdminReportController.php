<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la resolución de un reporte.
use App\Http\Requests\Admin\ResolveReportRequest;
// Esta línea sirve para importar el resource que da formato a un reporte.
use App\Http\Resources\ReportResource;
// Esta línea sirve para importar el modelo Report (reporte de contenido).
use App\Models\Report;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Admin · Reportes" de Swagger.
#[Group('Admin · Reportes', 'Moderación del contenido reportado por los usuarios.', weight: 28)]
// Esta línea sirve para declarar el controller de moderación de reportes.
class AdminReportController extends Controller
{
    /**
     * Listar reportes de contenido.
     *
     * Paginado de a 20, los más recientes primero. Por defecto solo los
     * pendientes; `status=all` trae todos.
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista los reportes.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para leer el estado pedido (pendientes por defecto).
        $status = $request->query('status', 'pending');

        // Esta línea sirve para consultar los reportes.
        $reports = Report::query()
            // Esta línea sirve para cargar quién reportó, quién resolvió y el contenido reportado.
            ->with(['reporter', 'resolver', 'reportable'])
            // Esta línea sirve para filtrar por estado salvo que se pidan todos.
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('created_at')
            // Esta línea sirve para paginar de a 20.
            ->paginate(20);

        // Esta línea sirve para responder con los reportes.
        return response()->json([
            // Esta línea sirve para incluir los reportes con su formato.
            'data' => ReportResource::collection($reports->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($reports),
        ]);
    }

    /**
     * Resolver un reporte.
     *
     * Lo marca como `resolved` o `dismissed`, con notas opcionales.
     */
    // Esta línea sirve para declarar el endpoint que resuelve un reporte.
    public function resolve(ResolveReportRequest $request, Report $report): JsonResponse
    {
        // Esta línea sirve para actualizar el reporte.
        $report->update([
            // Esta línea sirve para guardar el estado (resuelto o descartado).
            'status' => $request->validated('status'),
            // Esta línea sirve para guardar las notas de la resolución.
            'resolution_notes' => $request->validated('resolution_notes'),
            // Esta línea sirve para guardar quién lo resolvió.
            'resolved_by' => $request->user()->id,
            // Esta línea sirve para guardar la fecha de resolución.
            'resolved_at' => now(),
        ]);

        // Esta línea sirve para responder con el reporte y sus relaciones cargadas.
        return response()->json(['data' => new ReportResource($report->load(['reporter', 'resolver', 'reportable']))]);
    }
}
