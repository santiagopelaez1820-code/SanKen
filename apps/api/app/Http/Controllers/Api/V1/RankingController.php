<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Rankings\Services\RankingScopeResolver;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rankings\RankingScopeRequest;
use App\Http\Resources\RankingEntryResource;
use App\Http\Resources\UserResource;
use App\Models\City;
use App\Models\Country;
use App\Models\Gym;
use App\Models\PersonalRecord;
use App\Models\RankingSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    public function index(RankingScopeRequest $request, RankingScopeResolver $resolver): JsonResponse
    {
        $user = $request->user();
        $scope = $request->validated('scope');

        $bestOneRepMax = PersonalRecord::query()
            ->where('user_id', $user->id)
            ->where('record_type', '1rm')
            ->max('value');

        $scopeValue = $resolver->resolve(
            $user->profile,
            $bestOneRepMax ? (float) $bestOneRepMax : null,
        )[$scope];

        if ($scope !== 'global' && $scopeValue === null) {
            return response()->json(['data' => [
                'scope' => $scope,
                'scope_label' => null,
                'entries' => [],
                'viewer' => null,
            ]]);
        }

        $entries = RankingSnapshot::query()
            ->where('scope_type', $scope)
            ->where('scope_value', $scopeValue)
            ->with('user')
            ->orderBy('rank_position')
            ->limit(100)
            ->get();

        $viewerSnapshot = RankingSnapshot::query()
            ->where('scope_type', $scope)
            ->where('scope_value', $scopeValue)
            ->where('user_id', $user->id)
            ->with('user')
            ->first();

        return response()->json(['data' => [
            'scope' => $scope,
            'scope_label' => $this->scopeLabel($scope, $scopeValue),
            'entries' => RankingEntryResource::collection($entries),
            'viewer' => $viewerSnapshot ? new RankingEntryResource($viewerSnapshot) : null,
        ]]);
    }

    public function optIn(Request $request): JsonResponse
    {
        $request->user()->update(['is_public_profile' => true]);

        return response()->json(['data' => new UserResource($request->user())]);
    }

    public function optOut(Request $request): JsonResponse
    {
        $request->user()->update(['is_public_profile' => false]);

        return response()->json(['data' => new UserResource($request->user())]);
    }

    private function scopeLabel(string $scope, ?string $scopeValue): ?string
    {
        return match ($scope) {
            'global' => 'Global',
            'city' => City::find($scopeValue)?->name,
            'country' => Country::find($scopeValue)?->name,
            'gym' => Gym::find($scopeValue)?->name,
            'sex' => match ($scopeValue) {
                'male' => 'Hombres',
                'female' => 'Mujeres',
                default => null,
            },
            'age_bracket', 'strength_category' => $scopeValue,
            default => null,
        };
    }
}
