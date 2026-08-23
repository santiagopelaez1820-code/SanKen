<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use Illuminate\Http\JsonResponse;
use Spatie\Activitylog\Models\Activity;

class AdminAuditLogController extends Controller
{
    /**
     * No hay una tabla `audit_logs` propia — se lee directo de
     * activity_log (Spatie, instalado Sprint 7), que ya registra cambios
     * de User/Routine/TrainerClient. Ver plan de este sprint.
     */
    public function index(): JsonResponse
    {
        $activities = Activity::query()
            ->with('causer')
            ->latest()
            ->paginate(30);

        return response()->json([
            'data' => AuditLogResource::collection($activities->items()),
            'meta' => [
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'total' => $activities->total(),
            ],
        ]);
    }
}
