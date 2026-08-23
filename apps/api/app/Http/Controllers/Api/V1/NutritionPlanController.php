<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Nutrition\Actions\GenerateNutritionPlanAction;
use App\Application\Nutrition\Actions\SubstituteMealItemAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Nutrition\SubstituteMealItemRequest;
use App\Http\Resources\NutritionPlanMealItemResource;
use App\Http\Resources\NutritionPlanResource;
use App\Models\NutritionPlan;
use App\Models\NutritionPlanMealItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use InvalidArgumentException;
use RuntimeException;

class NutritionPlanController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $plan = NutritionPlan::query()
            ->where('user_id', $request->user()->id)
            ->with('meals.items.foodItem')
            ->first();

        if (! $plan) {
            return response()->json([
                'message' => 'Todavía no generaste tu plan alimenticio.',
            ], 404);
        }

        return response()->json(['data' => new NutritionPlanResource($plan)]);
    }

    public function store(Request $request, GenerateNutritionPlanAction $action): JsonResponse
    {
        try {
            $plan = $action->generate($request->user());
        } catch (RuntimeException) {
            return response()->json([
                'message' => 'Completá tu perfil (edad, sexo, peso, altura) y onboarding para generar tu plan.',
            ], 422);
        }

        return response()->json(['data' => new NutritionPlanResource($plan)], 201);
    }

    public function substituteItem(
        SubstituteMealItemRequest $request,
        NutritionPlanMealItem $item,
        SubstituteMealItemAction $action,
    ): JsonResponse {
        Gate::authorize('update', $item);

        try {
            $item = $action->substitute($item, (int) $request->validated('food_item_id'));
        } catch (InvalidArgumentException) {
            return response()->json([
                'message' => 'El alimento elegido no pertenece a la misma categoría que el que estás reemplazando.',
            ], 422);
        }

        return response()->json(['data' => new NutritionPlanMealItemResource($item)]);
    }
}
