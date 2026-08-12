<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request): JsonResponse
    {
        $report = Report::query()->create([
            'reporter_id' => $request->user()->id,
            'reportable_type' => $request->validated('reportable_type'),
            'reportable_id' => $request->validated('reportable_id'),
            'reason' => $request->validated('reason'),
            'details' => $request->validated('details'),
        ]);

        return response()->json(['data' => new ReportResource($report->load('reporter'))], 201);
    }
}
