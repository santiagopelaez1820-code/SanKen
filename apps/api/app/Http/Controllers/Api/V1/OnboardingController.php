<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Onboarding\Actions\CompleteOnboardingAction;
use App\Application\Onboarding\Actions\SubmitOnboardingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Onboarding\OnboardingRequest;
use App\Http\Resources\OnboardingResource;
use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function questions(): JsonResponse
    {
        return response()->json([
            'data' => [
                'levels' => config('onboarding.levels'),
                'goals' => config('onboarding.goals'),
                'frequency_days' => config('onboarding.frequency_days'),
                'session_minutes' => config('onboarding.session_minutes'),
                'places' => config('onboarding.places'),
                'equipment' => config('onboarding.equipment'),
                'countries' => Country::query()
                    ->with(['cities' => fn ($q) => $q->orderBy('name')])
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (Country $country) => [
                        'id' => $country->id,
                        'name' => $country->name,
                        'cities' => $country->cities->map(fn ($city) => [
                            'id' => $city->id,
                            'name' => $city->name,
                        ]),
                    ]),
            ],
        ]);
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new OnboardingResource($request->user()->loadMissing('profile', 'onboardingResponse')),
        ]);
    }

    public function store(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->validated());

        return response()->json([
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
        ], 201);
    }

    public function update(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->validated());

        return response()->json([
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
        ]);
    }

    public function complete(Request $request, CompleteOnboardingAction $action): JsonResponse
    {
        $user = $action->execute($request->user());

        return response()->json([
            'data' => new OnboardingResource($user),
        ]);
    }
}
