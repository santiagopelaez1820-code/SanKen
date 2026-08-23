<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Application\Admin\Actions\CreateRoutineTemplateAction;
use App\Application\Admin\Actions\DuplicateRoutineTemplateAction;
use App\Application\Admin\Actions\UpdateRoutineTemplateAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoutineTemplateRequest;
use App\Http\Resources\AdminRoutineTemplateResource;
use App\Models\RoutineTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminRoutineTemplateController extends Controller
{
    private const EAGER = ['days.exercises.exercise.primaryMuscle'];

    /**
     * Trae TODAS las plantillas (activas e inactivas/borradores) — Super
     * Admin necesita verlas todas para poder reactivar o duplicar. Mismo
     * patrón que AdminExerciseController::index().
     */
    public function index(): JsonResponse
    {
        $templates = RoutineTemplate::query()
            ->with(self::EAGER)
            ->orderBy('sex')
            ->orderBy('frequency_days')
            ->orderByDesc('is_active')
            ->get();

        return response()->json([
            'data' => AdminRoutineTemplateResource::collection($templates),
        ]);
    }

    public function show(RoutineTemplate $routineTemplate): JsonResponse
    {
        return response()->json([
            'data' => new AdminRoutineTemplateResource($routineTemplate->load(self::EAGER)),
        ]);
    }

    public function store(RoutineTemplateRequest $request, CreateRoutineTemplateAction $action): JsonResponse
    {
        $template = $action->execute($request->validated());

        return response()->json(['data' => new AdminRoutineTemplateResource($template)], 201);
    }

    public function update(RoutineTemplateRequest $request, RoutineTemplate $routineTemplate, UpdateRoutineTemplateAction $action): JsonResponse
    {
        $template = $action->execute($routineTemplate, $request->validated());

        return response()->json(['data' => new AdminRoutineTemplateResource($template)]);
    }

    public function duplicate(RoutineTemplate $routineTemplate, DuplicateRoutineTemplateAction $action): JsonResponse
    {
        $copy = $action->execute($routineTemplate);

        return response()->json(['data' => new AdminRoutineTemplateResource($copy)], 201);
    }

    /**
     * Activa esta plantilla y desactiva cualquier otra con el mismo
     * sexo+frecuencia, dentro de una transacción — es el único lugar que
     * garantiza "a lo sumo una plantilla activa por sexo+frecuencia" (la
     * columna ya no tiene un unique constraint que lo haga por sí solo,
     * ver migración 2026_08_18_000003).
     */
    public function activate(RoutineTemplate $routineTemplate): JsonResponse
    {
        DB::transaction(function () use ($routineTemplate) {
            RoutineTemplate::query()
                ->where('sex', $routineTemplate->sex)
                ->where('frequency_days', $routineTemplate->frequency_days)
                ->where('id', '!=', $routineTemplate->id)
                ->update(['is_active' => false]);

            $routineTemplate->update(['is_active' => true]);
        });

        return response()->json(['data' => new AdminRoutineTemplateResource($routineTemplate->fresh(self::EAGER))]);
    }

    /**
     * Bloqueada si es la única plantilla activa para su sexo+frecuencia —
     * si se permitiera, el próximo onboarding de ese segmento fallaría con
     * un 500 en TemplateRoutineGenerator (RuntimeException: "No hay
     * plantilla de rutina para sexo=[...] frecuencia=[...]").
     */
    public function deactivate(RoutineTemplate $routineTemplate): JsonResponse
    {
        $isOnlyActiveOne = RoutineTemplate::query()
            ->where('sex', $routineTemplate->sex)
            ->where('frequency_days', $routineTemplate->frequency_days)
            ->where('is_active', true)
            ->where('id', '!=', $routineTemplate->id)
            ->doesntExist();

        abort_if(
            $isOnlyActiveOne,
            422,
            "No podés desactivar la única plantilla activa para sexo={$routineTemplate->sex} y frecuencia={$routineTemplate->frequency_days} días — activá un reemplazo primero.",
        );

        $routineTemplate->update(['is_active' => false]);

        return response()->json(['data' => new AdminRoutineTemplateResource($routineTemplate->fresh(self::EAGER))]);
    }
}
