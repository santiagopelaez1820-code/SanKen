<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NewsPromotionResource;
use App\Models\NewsPromotion;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    public function index(): JsonResponse
    {
        $news = NewsPromotion::query()->published()->orderByDesc('published_at')->get();

        return response()->json(['data' => NewsPromotionResource::collection($news)]);
    }
}
