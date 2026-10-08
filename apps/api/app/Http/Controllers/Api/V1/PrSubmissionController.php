<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la postulación de un PR.
use App\Http\Requests\StorePrSubmissionRequest;
// Esta línea sirve para importar la validación de la subida del video de un PR.
use App\Http\Requests\UploadPrSubmissionVideoRequest;
// Esta línea sirve para importar el resource que da formato a una postulación de PR.
use App\Http\Resources\PrSubmissionResource;
// Esta línea sirve para importar la clase que define la carpeta y el nombre de cada archivo subido.
use App\Infrastructure\Media\MediaSlot;
// Esta línea sirve para importar el servicio que guarda archivos (Cloudinary o disco local).
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el modelo PrSubmission (postulación de PR).
use App\Models\PrSubmission;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Postulación de un PR para Rankings públicos — separado del registro
 * manual privado de PersonalRecord (StatsController::storePersonalRecord),
 * que sigue existiendo sin cambios y nunca pasa por revisión. Acá el
 * usuario postula (peso/reps/ejercicio), sube un video como evidencia, y
 * un Super Admin lo aprueba o rechaza (ver AdminPrSubmissionController) —
 * solo lo aprobado cuenta para Rankings.
 */
// Esta línea sirve para agrupar este controller en la sección "Postulaciones de PR" de Swagger.
#[Group('Postulaciones de PR', 'Postular un récord personal con video de evidencia; solo los aprobados por un Super Admin cuentan para los rankings.', weight: 9)]
// Esta línea sirve para declarar el controller de las postulaciones de PR.
class PrSubmissionController extends Controller
{
    /** Listar mis postulaciones de PR. */
    // Esta línea sirve para declarar el endpoint que lista las postulaciones del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las postulaciones.
        $submissions = PrSubmission::query()
            // Esta línea sirve para filtrar solo las del usuario autenticado.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para cargar el ejercicio y el admin que la revisó.
            ->with(['exercise', 'reviewer'])
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->orderByDesc('created_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con las postulaciones.
        return response()->json([
            // Esta línea sirve para incluir las postulaciones con su formato.
            'data' => PrSubmissionResource::collection($submissions),
        ]);
    }

    /**
     * Postular un PR.
     *
     * Queda en estado `pending` con el 1RM estimado (fórmula de Epley). El
     * video se sube aparte con `POST /pr-submissions/{prSubmission}/video`.
     */
    // Esta línea sirve para declarar el endpoint que crea una postulación de PR.
    public function store(StorePrSubmissionRequest $request): JsonResponse
    {
        // Esta línea sirve para leer el peso levantado como número decimal.
        $weightKg = (float) $request->validated('weight_kg');
        // Esta línea sirve para leer las repeticiones como número entero.
        $reps = (int) $request->validated('reps');

        // Esta línea sirve para crear la postulación.
        $submission = PrSubmission::query()->create([
            // Esta línea sirve para guardar el id del usuario.
            'user_id' => $request->user()->id,
            // Esta línea sirve para guardar el ejercicio.
            'exercise_id' => $request->validated('exercise_id'),
            // Esta línea sirve para guardar el peso.
            'weight_kg' => $weightKg,
            // Esta línea sirve para guardar las repeticiones.
            'reps' => $reps,
            // Fórmula de Epley (misma que StatsController::progress) para
            // comparar en Rankings levantamientos con distintas reps.
            // Esta línea sirve para guardar el 1RM estimado con la fórmula de Epley, redondeado a 2 decimales.
            'estimated_1rm' => round($weightKg * (1 + $reps / 30), 2),
        ]);

        // Esta línea sirve para responder con la postulación creada.
        return response()->json([
            // Esta línea sirve para incluir la postulación con su ejercicio y revisor.
            'data' => new PrSubmissionResource($submission->load(['exercise', 'reviewer'])),
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /**
     * Subir el video de evidencia de un PR.
     *
     * Sube (o reemplaza) el video de evidencia — mismo MediaStorage que
     * AdminExerciseController::uploadVideo (Cloudinary o disco 'public',
     * resuelto por ApiClient.mediaUrl() en cada cliente). Solo
     * mientras está pendiente: una vez revisada, la postulación queda fija
     * para mantener trazabilidad de qué vio exactamente el admin.
     */
    // Esta línea sirve para declarar el endpoint que sube el video de evidencia de un PR.
    public function uploadVideo(UploadPrSubmissionVideoRequest $request, PrSubmission $prSubmission, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para verificar que la postulación es del usuario.
        $this->authorizeOwner($request, $prSubmission);

        // Esta línea sirve para revisar si la postulación ya fue revisada.
        if ($prSubmission->status !== 'pending') {
            // Esta línea sirve para lanzar un error de validación (422).
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que ya no se puede cambiar el video.
                'submission' => ['Esta postulación ya fue revisada — no se puede cambiar el video.'],
            ]);
        }

        // Esta línea sirve para guardar el video y obtener su URL.
        $videoUrl = $media->store(
            // Esta línea sirve para pasar el archivo de video enviado.
            $request->file('video'),
            // Esta línea sirve para pasar la carpeta y el nombre del video de esta postulación.
            MediaSlot::prSubmissionVideo($prSubmission->id),
            // Esta línea sirve para pasar la URL del video anterior para borrarlo.
            $prSubmission->video_url,
            // Esta línea sirve para pasar el mensaje de error por si falla la subida.
            'No se pudo guardar el video.',
        );
        // Esta línea sirve para guardar la URL del video en la postulación.
        $prSubmission->update(['video_url' => $videoUrl]);

        // Esta línea sirve para responder con la postulación actualizada.
        return response()->json([
            // Esta línea sirve para incluir la postulación recargada con su ejercicio y revisor.
            'data' => new PrSubmissionResource($prSubmission->fresh(['exercise', 'reviewer'])),
        ]);
    }

    // Esta línea sirve para declarar el método privado que verifica que la postulación sea del usuario.
    private function authorizeOwner(Request $request, PrSubmission $submission): void
    {
        // Esta línea sirve para responder 403 si la postulación no es del usuario.
        abort_unless($submission->user_id === $request->user()->id, 403);
    }
}
