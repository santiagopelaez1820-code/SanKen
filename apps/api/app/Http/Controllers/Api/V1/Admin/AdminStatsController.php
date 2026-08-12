<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Domain\Admin\Services\GlobalMetricsCalculator;
use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function index(GlobalMetricsCalculator $calculator): JsonResponse
    {
        return response()->json(['data' => $calculator->calculate(CarbonImmutable::now())]);
    }
}
