<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ReplacesPublicFile;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrSubmissionRequest;
use App\Http\Requests\UploadPrSubmissionVideoRequest;
use App\Http\Resources\PrSubmissionResource;
use App\Models\PrSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Postulación de un PR para Rankings públicos — separado del registro
 * manual privado de PersonalRecord (StatsController::storePersonalRecord),
 * que sigue existiendo sin cambios y nunca pasa por revisión. Acá el
 * usuario postula (peso/reps/ejercicio), sube un video como evidencia, y
 * un Super Admin lo aprueba o rechaza (ver AdminPrSubmissionController) —
 * solo lo aprobado cuenta para Rankings.
 */
class PrSubmissionController extends Controller
{
    use ReplacesPublicFile;

    public function index(Request $request): JsonResponse
    {
        $submissions = PrSubmission::query()
            ->where('user_id', $request->user()->id)
            ->with(['exercise', 'reviewer'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => PrSubmissionResource::collection($submissions),
        ]);
    }

    public function store(StorePrSubmissionRequest $request): JsonResponse
    {
        $weightKg = (float) $request->validated('weight_kg');
        $reps = (int) $request->validated('reps');

        $submission = PrSubmission::query()->create([
            'user_id' => $request->user()->id,
            'exercise_id' => $request->validated('exercise_id'),
            'weight_kg' => $weightKg,
            'reps' => $reps,
            // Misma fórmula de Epley que DetectPersonalRecordAction/
            // RegisterManualPersonalRecordAction — mismo criterio en toda
            // la app para estimar 1RM a partir de peso×reps.
            'estimated_1rm' => round($weightKg * (1 + $reps / 30), 2),
        ]);

        return response()->json([
            'data' => new PrSubmissionResource($submission->load(['exercise', 'reviewer'])),
        ], 201);
    }

    /**
     * Sube (o reemplaza) el video de evidencia — mismo storage/convención
     * que AdminExerciseController::uploadVideo (disco 'public', ruta
     * relativa resuelta por ApiClient.mediaUrl() en cada cliente). Solo
     * mientras está pendiente: una vez revisada, la postulación queda fija
     * para mantener trazabilidad de qué vio exactamente el admin.
     */
    public function uploadVideo(UploadPrSubmissionVideoRequest $request, PrSubmission $prSubmission): JsonResponse
    {
        $this->authorizeOwner($request, $prSubmission);

        if ($prSubmission->status !== 'pending') {
            throw ValidationException::withMessages([
                'submission' => ['Esta postulación ya fue revisada — no se puede cambiar el video.'],
            ]);
        }

        $videoUrl = $this->storePublicFileReplacing(
            $request->file('video'),
            'pr-submission-videos',
            $prSubmission->video_url,
            'No se pudo guardar el video.',
        );
        $prSubmission->update(['video_url' => $videoUrl]);

        return response()->json([
            'data' => new PrSubmissionResource($prSubmission->fresh(['exercise', 'reviewer'])),
        ]);
    }

    private function authorizeOwner(Request $request, PrSubmission $submission): void
    {
        abort_unless($submission->user_id === $request->user()->id, 403);
    }
}
