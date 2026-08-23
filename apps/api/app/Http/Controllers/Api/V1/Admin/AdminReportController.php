<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResolveReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');

        $reports = Report::query()
            ->with(['reporter', 'resolver', 'reportable'])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'data' => ReportResource::collection($reports->items()),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'total' => $reports->total(),
            ],
        ]);
    }

    public function resolve(ResolveReportRequest $request, Report $report): JsonResponse
    {
        $report->update([
            'status' => $request->validated('status'),
            'resolution_notes' => $request->validated('resolution_notes'),
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return response()->json(['data' => new ReportResource($report->load(['reporter', 'resolver', 'reportable']))]);
    }
}
