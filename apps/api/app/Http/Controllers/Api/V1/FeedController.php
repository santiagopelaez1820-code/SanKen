<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Feed\Actions\GetUnifiedFeedAction;
use App\Http\Controllers\Controller;
use App\Models\NewsPromotion;
use App\Models\NewsPromotionRead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function index(Request $request, GetUnifiedFeedAction $action): JsonResponse
    {
        return response()->json($action->execute($request->user()));
    }

    public function markRead(Request $request, string $type, string $id): JsonResponse
    {
        if ($type === 'news') {
            $news = NewsPromotion::query()->published()->findOrFail($id);
            NewsPromotionRead::query()->firstOrCreate(
                ['user_id' => $request->user()->id, 'news_promotion_id' => $news->id],
                ['read_at' => now()],
            );
        } else {
            $request->user()->notifications()->findOrFail($id)->markAsRead();
        }

        return response()->json(status: 204);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();

        $unreadNewsIds = NewsPromotion::query()->published()->pluck('id')
            ->diff(NewsPromotionRead::query()->where('user_id', $user->id)->pluck('news_promotion_id'));

        $now = now();
        foreach ($unreadNewsIds as $newsId) {
            NewsPromotionRead::query()->create(['user_id' => $user->id, 'news_promotion_id' => $newsId, 'read_at' => $now]);
        }

        return response()->json(status: 204);
    }
}
