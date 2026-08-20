<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChallengeTemplateRequest;
use App\Http\Resources\AdminChallengeTemplateResource;
use App\Models\ChallengeTemplate;
use Illuminate\Http\JsonResponse;

class AdminChallengeTemplateController extends Controller
{
    /**
     * Trae TODAS las plantillas (activas e inactivas) — Super Admin
     * necesita verlas todas para poder reactivar una vieja. Mismo patrón
     * que AdminExerciseController::index()/AdminRoutineTemplateController::index().
     */
    public function index(): JsonResponse
    {
        $templates = ChallengeTemplate::query()
            ->orderByDesc('is_active')
            ->orderBy('title')
            ->get();

        return response()->json([
            'data' => AdminChallengeTemplateResource::collection($templates),
        ]);
    }

    public function store(ChallengeTemplateRequest $request): JsonResponse
    {
        $template = ChallengeTemplate::query()->create($request->validated());

        return response()->json(['data' => new AdminChallengeTemplateResource($template)], 201);
    }

    public function update(ChallengeTemplateRequest $request, ChallengeTemplate $challengeTemplate): JsonResponse
    {
        $challengeTemplate->update($request->validated());

        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }

    /**
     * Desactivar una plantilla NUNCA borra los Challenge ya generados a
     * partir de ella (challenges.code queda igual, sin FK a esta tabla) —
     * solo evita que GenerateChallengesAction cree instancias nuevas la
     * próxima semana/mes.
     */
    public function activate(ChallengeTemplate $challengeTemplate): JsonResponse
    {
        $challengeTemplate->update(['is_active' => true]);

        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }

    public function deactivate(ChallengeTemplate $challengeTemplate): JsonResponse
    {
        $challengeTemplate->update(['is_active' => false]);

        return response()->json(['data' => new AdminChallengeTemplateResource($challengeTemplate)]);
    }
}
