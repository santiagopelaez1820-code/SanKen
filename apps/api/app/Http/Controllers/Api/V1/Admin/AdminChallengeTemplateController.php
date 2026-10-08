<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de una plantilla de reto.
use App\Http\Requests\Admin\ChallengeTemplateRequest;
// Esta línea sirve para importar el resource que da formato a una plantilla de reto.
use App\Http\Resources\AdminChallengeTemplateResource;
// Esta línea sirve para importar el modelo ChallengeTemplate (plantilla de reto).
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Admin · Plantillas de retos" de Swagger.
#[Group('Admin · Plantillas de retos', 'Plantillas a partir de las cuales se generan los retos semanales y mensuales.', weight: 26)]
// Esta línea sirve para declarar el controller de plantillas de retos.
class AdminChallengeTemplateController extends Controller
{
    /**
     * Listar todas las plantillas de retos.
     *
     * Trae TODAS las plantillas (activas e inactivas) — Super Admin
     * necesita verlas todas para poder reactivar una vieja. Mismo patrón
     * que AdminExerciseController::index()/AdminRoutineTemplateController::index().
     */
    // Esta línea sirve para declarar el endpoint que lista todas las plantillas.
    public function index(): JsonResponse
    {
        // Esta línea sirve para consultar las plantillas.
        $templates = ChallengeTemplate::query()
            // Esta línea sirve para ordenar primero las activas.
            ->orderByDesc('is_active')
            // Esta línea sirve para ordenar luego por título.
            ->orderBy('title')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con las plantillas.
        return response()->json([
            // Esta línea sirve para incluir las plantillas con su formato.
            'data' => AdminChallengeTemplateResource::collection($templates),
        ]);
    }

    /** Crear una plantilla de retos. */
    // Esta línea sirve para declarar el endpoint que crea una plantilla.
    public function store(ChallengeTemplateRequest $request): JsonResponse
    {
        // Esta línea sirve para crear la plantilla con los datos validados.
        $template = ChallengeTemplate::query()->create($request->validated());

        // Esta línea sirve para responder con la plantilla creada y código 201.
        return response()->json(['data' => new AdminChallengeTemplateResource($template)], 201);
    }

    /** Editar una plantilla de retos. */
    // Esta línea sirve para declarar el endpoint que edita una plantilla.
    public function update(ChallengeTemplateRequest $request, ChallengeTemplate $challengeTemplate): JsonResponse
    {
        // Esta línea sirve para actualizar la plantilla con los datos validados.
        $challengeTemplate->update($request->validated());

        // Esta línea sirve para responder con la plantilla actualizada.
        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }

    /**
     * Activar una plantilla de retos.
     *
     * Desactivar una plantilla NUNCA borra los Challenge ya generados a
     * partir de ella (challenges.code queda igual, sin FK a esta tabla) —
     * solo evita que GenerateChallengesAction cree instancias nuevas la
     * próxima semana/mes.
     */
    // Esta línea sirve para declarar el endpoint que activa una plantilla.
    public function activate(ChallengeTemplate $challengeTemplate): JsonResponse
    {
        // Esta línea sirve para marcar la plantilla como activa.
        $challengeTemplate->update(['is_active' => true]);

        // Esta línea sirve para responder con la plantilla actualizada.
        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }

    /**
     * Desactivar una plantilla de retos.
     *
     * Los retos ya generados con ella se conservan; solo deja de generar
     * retos nuevos.
     */
    // Esta línea sirve para declarar el endpoint que desactiva una plantilla.
    public function deactivate(ChallengeTemplate $challengeTemplate): JsonResponse
    {
        // Esta línea sirve para marcar la plantilla como inactiva.
        $challengeTemplate->update(['is_active' => false]);

        // Esta línea sirve para responder con la plantilla actualizada.
        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }
}
