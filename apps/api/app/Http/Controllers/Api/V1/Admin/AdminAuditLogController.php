<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a cada registro de auditoría.
use App\Http\Resources\AuditLogResource;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar el modelo Activity de Spatie (registro de actividad).
use Spatie\Activitylog\Models\Activity;

// Esta línea sirve para agrupar este controller en la sección "Admin · Auditoría" de Swagger.
#[Group('Admin · Auditoría', 'Registro de cambios hechos sobre los datos de la plataforma.', weight: 34)]
// Esta línea sirve para declarar el controller del registro de auditoría.
class AdminAuditLogController extends Controller
{
    /**
     * Listar el registro de auditoría.
     *
     * Paginado de a 30, los cambios más recientes primero.
     *
     * No hay una tabla `audit_logs` propia — se lee directo de
     * activity_log (Spatie, instalado Sprint 7), que ya registra cambios
     * de User/Routine/TrainerClient. Ver plan de este sprint.
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista el registro de auditoría.
    public function index(): JsonResponse
    {
        // Esta línea sirve para consultar los registros de actividad.
        $activities = Activity::query()
            // Esta línea sirve para cargar quién hizo cada cambio.
            ->with('causer')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->latest()
            // Esta línea sirve para paginar de a 30 registros.
            ->paginate(30);

        // Esta línea sirve para responder con los registros.
        return response()->json([
            // Esta línea sirve para incluir los registros con su formato.
            'data' => AuditLogResource::collection($activities->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($activities),
        ]);
    }
}
