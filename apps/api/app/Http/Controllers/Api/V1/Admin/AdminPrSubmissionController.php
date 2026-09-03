<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewPrSubmissionRequest;
use App\Http\Resources\PrSubmissionResource;
use App\Models\PrSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminPrSubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');

        $submissions = PrSubmission::query()
            ->with(['user', 'exercise', 'reviewer'])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'data' => PrSubmissionResource::collection($submissions->items()),
            'meta' => $this->paginationMeta($submissions),
        ]);
    }

    /**
     * Solo role:super_admin llega acá (ver routes/api.php) — un usuario
     * normal nunca puede aprobarse un PR a sí mismo, la validación vive en
     * el middleware de la ruta, no solo ocultando el botón en frontend.
     */
    public function review(ReviewPrSubmissionRequest $request, PrSubmission $prSubmission): JsonResponse
    {
        if ($prSubmission->status !== 'pending') {
            throw ValidationException::withMessages([
                'submission' => ['Esta postulación ya fue revisada.'],
            ]);
        }

        if ($request->validated('status') === 'approved' && ! $prSubmission->video_url) {
            throw ValidationException::withMessages([
                'submission' => ['No se puede aprobar una postulación sin video de evidencia.'],
            ]);
        }

        $prSubmission->update([
            'status' => $request->validated('status'),
            'rejection_reason' => $request->validated('rejection_reason'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'data' => new PrSubmissionResource($prSubmission->load(['user', 'exercise', 'reviewer'])),
        ]);
    }
}
