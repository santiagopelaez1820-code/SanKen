<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Gamification\Services\XpLevelCalculator;
use App\Http\Controllers\Controller;
use App\Http\Resources\AchievementResource;
use App\Models\Achievement;
use App\Models\UserXp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function index(Request $request, XpLevelCalculator $calculator): JsonResponse
    {
        $user = $request->user();
        $xp = UserXp::query()->firstOrCreate(['user_id' => $user->id], ['total_xp' => 0]);
        $progress = $calculator->progress($xp->total_xp);

        $unlocked = $user->achievements()->orderBy('achievements.id')->get();
        $locked = Achievement::query()
            ->whereNotIn('id', $unlocked->pluck('id')->all() ?: [0])
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => [
                'total_xp' => $xp->total_xp,
                ...$progress,
                'unlocked_achievements' => AchievementResource::collection($unlocked),
                'locked_achievements' => AchievementResource::collection($locked),
            ],
        ]);
    }
}
