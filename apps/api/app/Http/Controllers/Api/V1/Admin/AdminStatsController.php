<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el servicio que calcula las métricas globales.
use App\Domain\Admin\Services\GlobalMetricsCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar CarbonImmutable para obtener la fecha actual.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Admin · Estadísticas y analítica" de Swagger.
#[Group('Admin · Estadísticas y analítica', 'Métricas globales de la plataforma y analítica de uso.', weight: 33)]
// Esta línea sirve para declarar el controller de métricas globales.
class AdminStatsController extends Controller
{
    /**
     * Ver las métricas globales de la plataforma.
     *
     * Usuarios activos (DAU/WAU/MAU, a partir de la última actividad de cada
     * usuario), retención aproximada y demás totales del panel.
     */
    // Esta línea sirve para declarar el endpoint que devuelve las métricas globales.
    public function index(GlobalMetricsCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para responder con las métricas calculadas a la fecha actual.
        return response()->json(['data' => $calculator->calculate(CarbonImmutable::now())]);
    }
}
