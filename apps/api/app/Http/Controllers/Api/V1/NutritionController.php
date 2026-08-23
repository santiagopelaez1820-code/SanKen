<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Nutrition\Actions\FindOrCacheFoodItemAction;
use App\Domain\Nutrition\Services\NutritionTargetCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Nutrition\LogMealRequest;
use App\Http\Requests\Nutrition\SearchFoodsRequest;
use App\Http\Resources\FoodItemResource;
use App\Http\Resources\MealLogResource;
use App\Models\MealLog;
use App\Models\WorkoutSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NutritionController extends Controller
{
    public function targets(Request $request, NutritionTargetCalculator $calculator): JsonResponse
    {
        $user = $request->user()->loadMissing('profile', 'onboardingResponse');
        $profile = $user->profile;
        $onboarding = $user->onboardingResponse;

        if (! $profile?->age || ! $profile->sex || ! $profile->weight_kg || ! $profile->height_cm
            || ! $onboarding?->frequency_days || empty($onboarding->goals)) {
            return response()->json([
                'message' => 'Completá tu perfil (edad, sexo, peso, altura) y onboarding para calcular tus objetivos de nutrición.',
            ], 404);
        }

        $trainedToday = WorkoutSession::query()
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->whereDate('performed_at', now()->toDateString())
            ->exists();

        $targets = $calculator->calculate(
            $profile->age,
            $profile->sex,
            (float) $profile->weight_kg,
            (float) $profile->height_cm,
            $onboarding->frequency_days,
            $onboarding->goals,
            $trainedToday,
        );

        return response()->json(['data' => $targets]);
    }

    public function meals(Request $request): JsonResponse
    {
        $date = $request->query('date', now()->toDateString());

        $logs = MealLog::query()
            ->where('user_id', $request->user()->id)
            ->whereDate('logged_at', $date)
            ->with('foodItem')
            ->orderBy('created_at')
            ->get();

        $summary = $logs->reduce(function (array $totals, MealLog $log) {
            $factor = (float) $log->quantity_grams / 100;
            $totals['calories'] += (float) $log->foodItem->calories_per_100g * $factor;
            $totals['protein_g'] += (float) $log->foodItem->protein_per_100g * $factor;
            $totals['carbs_g'] += (float) $log->foodItem->carbs_per_100g * $factor;
            $totals['fat_g'] += (float) $log->foodItem->fat_per_100g * $factor;

            return $totals;
        }, ['calories' => 0.0, 'protein_g' => 0.0, 'carbs_g' => 0.0, 'fat_g' => 0.0]);

        return response()->json([
            'data' => MealLogResource::collection($logs),
            'meta' => [
                'date' => $date,
                'summary' => array_map(fn (float $v) => round($v, 1), $summary),
            ],
        ]);
    }

    public function logMeal(LogMealRequest $request): JsonResponse
    {
        $meal = MealLog::query()->create([
            'user_id' => $request->user()->id,
            'food_item_id' => $request->validated('food_item_id'),
            'meal_type' => $request->validated('meal_type'),
            'quantity_grams' => $request->validated('quantity_grams'),
            'logged_at' => $request->validated('logged_at') ?? now()->toDateString(),
        ]);

        return response()->json(['data' => new MealLogResource($meal->load('foodItem'))], 201);
    }

    public function destroyMeal(Request $request, MealLog $meal): JsonResponse
    {
        Gate::authorize('delete', $meal);

        $meal->delete();

        return response()->json(status: 204);
    }

    public function searchFoods(SearchFoodsRequest $request, FindOrCacheFoodItemAction $action): JsonResponse
    {
        if ($barcode = $request->validated('barcode')) {
            $item = $action->byBarcode($barcode);

            return response()->json(['data' => $item ? new FoodItemResource($item) : null], $item ? 200 : 404);
        }

        $items = $action->search($request->validated('q'));

        return response()->json(['data' => FoodItemResource::collection($items)]);
    }
}
