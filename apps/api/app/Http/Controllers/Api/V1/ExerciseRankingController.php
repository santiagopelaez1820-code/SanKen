<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Rankings\Actions\GetExerciseRankingAction;
use App\Domain\Rankings\Services\RankingScopeResolver;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rankings\ExerciseRankingScopeRequest;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;

class ExerciseRankingController extends Controller
{
    public function index(
        ExerciseRankingScopeRequest $request,
        Exercise $exercise,
        GetExerciseRankingAction $action,
        RankingScopeResolver $resolver,
    ): JsonResponse {
        $data = $action->execute(
            $exercise,
            $request->validated('scope'),
            $request->validated('sex'),
            $request->user(),
            $resolver,
        );

        return response()->json(['data' => $data]);
    }
}
