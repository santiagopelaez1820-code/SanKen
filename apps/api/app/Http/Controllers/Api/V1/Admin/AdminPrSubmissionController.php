<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la revisión de una postulación.
use App\Http\Requests\Admin\ReviewPrSubmissionRequest;
// Esta línea sirve para importar el resource que da formato a una postulación de PR.
use App\Http\Resources\PrSubmissionResource;
// Esta línea sirve para importar el modelo PrSubmission (postulación de récord).
use App\Models\PrSubmission;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Admin · Postulaciones de PR" de Swagger.
#[Group('Admin · Postulaciones de PR', 'Revisión de las postulaciones de PR con video: solo las aprobadas cuentan para los rankings.', weight: 29)]
// Esta línea sirve para declarar el controller de revisión de postulaciones de PR.
class AdminPrSubmissionController extends Controller
{
    /**
     * Listar postulaciones de PR.
     *
     * Paginado de a 20, las más recientes primero. Por defecto solo las
     * pendientes; `status=all` trae todas.
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista las postulaciones.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para leer el estado pedido (pendientes por defecto).
        $status = $request->query('status', 'pending');

        // Esta línea sirve para consultar las postulaciones.
        $submissions = PrSubmission::query()
            // Esta línea sirve para cargar el usuario, el ejercicio y quién la revisó.
            ->with(['user', 'exercise', 'reviewer'])
            // Esta línea sirve para filtrar por estado salvo que se pidan todas.
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->orderByDesc('created_at')
            // Esta línea sirve para paginar de a 20.
            ->paginate(20);

        // Esta línea sirve para responder con las postulaciones.
        return response()->json([
            // Esta línea sirve para incluir las postulaciones con su formato.
            'data' => PrSubmissionResource::collection($submissions->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($submissions),
        ]);
    }

    /**
     * Aprobar o rechazar una postulación de PR.
     *
     * Solo postulaciones pendientes; aprobar exige que tenga video y rechazar
     * exige `rejection_reason`.
     *
     * Solo role:super_admin llega acá (ver routes/api.php) — un usuario
     * normal nunca puede aprobarse un PR a sí mismo, la validación vive en
     * el middleware de la ruta, no solo ocultando el botón en frontend.
     */
    // Esta línea sirve para declarar el endpoint que aprueba o rechaza una postulación.
    public function review(ReviewPrSubmissionRequest $request, PrSubmission $prSubmission): JsonResponse
    {
        // Esta línea sirve para revisar si la postulación ya fue revisada.
        if ($prSubmission->status !== 'pending') {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que ya fue revisada.
                'submission' => ['Esta postulación ya fue revisada.'],
            ]);
        }

        // Esta línea sirve para revisar si se quiere aprobar sin video de evidencia.
        if ($request->validated('status') === 'approved' && ! $prSubmission->video_url) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que no se puede aprobar sin video.
                'submission' => ['No se puede aprobar una postulación sin video de evidencia.'],
            ]);
        }

        // Esta línea sirve para actualizar la postulación.
        $prSubmission->update([
            // Esta línea sirve para guardar el estado (aprobada o rechazada).
            'status' => $request->validated('status'),
            // Esta línea sirve para guardar el motivo del rechazo, si hay.
            'rejection_reason' => $request->validated('rejection_reason'),
            // Esta línea sirve para guardar quién la revisó.
            'reviewed_by' => $request->user()->id,
            // Esta línea sirve para guardar la fecha de revisión.
            'reviewed_at' => now(),
        ]);

        // Esta línea sirve para responder con la postulación revisada.
        return response()->json([
            // Esta línea sirve para incluir la postulación con su usuario, ejercicio y revisor.
            'data' => new PrSubmissionResource($prSubmission->load(['user', 'exercise', 'reviewer'])),
        ]);
    }
}
