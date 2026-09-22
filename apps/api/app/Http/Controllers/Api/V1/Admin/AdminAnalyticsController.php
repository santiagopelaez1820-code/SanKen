<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Domain\Admin\Services\UsageAnalyticsCalculator;
use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAnalyticsController extends Controller
{
    /** `period` inválido o ausente cae a 'today' en vez de 422 — mismo criterio laxo que status en AdminReportController::index. */
    public function overview(Request $request, UsageAnalyticsCalculator $calculator): JsonResponse
    {
        $period = $calculator->normalizePeriod($request->query('period'));

        return response()->json(['data' => $calculator->overview(CarbonImmutable::now(), $period)]);
    }

    public function activity(Request $request, UsageAnalyticsCalculator $calculator): JsonResponse
    {
        $period = $calculator->normalizePeriod($request->query('period'));

        return response()->json(['data' => $calculator->activitySeries(CarbonImmutable::now(), $period)]);
    }
}
