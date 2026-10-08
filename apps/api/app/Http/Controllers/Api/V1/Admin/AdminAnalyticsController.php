<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el servicio que calcula la analítica de uso.
use App\Domain\Admin\Services\UsageAnalyticsCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar CarbonImmutable para obtener la fecha actual.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Admin · Estadísticas y analítica" de Swagger.
#[Group('Admin · Estadísticas y analítica', weight: 33)]
// Esta línea sirve para declarar el controller de analítica de uso.
class AdminAnalyticsController extends Controller
{
    /**
     * Ver el resumen de uso de un período.
     *
     * `period` inválido o ausente cae a 'today' en vez de 422 — mismo criterio laxo que status en AdminReportController::index.
     */
    // Esta línea sirve para documentar en Swagger el parámetro period.
    #[QueryParameter('period', 'Período: `today`, `week` o `month`.', type: 'string', default: 'today')]
    // Esta línea sirve para declarar el endpoint que devuelve el resumen de uso.
    public function overview(Request $request, UsageAnalyticsCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para leer el período pedido y validarlo.
        $period = $calculator->normalizePeriod($request->query('period'));

        // Esta línea sirve para responder con el resumen del período.
        return response()->json(['data' => $calculator->overview(CarbonImmutable::now(), $period)]);
    }

    /**
     * Ver la serie de actividad de un período.
     *
     * Mismo `period` que el resumen.
     */
    // Esta línea sirve para documentar en Swagger el parámetro period.
    #[QueryParameter('period', 'Período: `today`, `week` o `month`.', type: 'string', default: 'today')]
    // Esta línea sirve para declarar el endpoint que devuelve la serie de actividad.
    public function activity(Request $request, UsageAnalyticsCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para leer el período pedido y validarlo.
        $period = $calculator->normalizePeriod($request->query('period'));

        // Esta línea sirve para responder con la serie de actividad del período.
        return response()->json(['data' => $calculator->activitySeries(CarbonImmutable::now(), $period)]);
    }
}
