<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsPromotionRequest;
use App\Http\Resources\NewsPromotionResource;
use App\Models\NewsPromotion;
use Illuminate\Http\JsonResponse;

class AdminNewsController extends Controller
{
    /**
     * A diferencia de NewsController::index (público, solo publicadas),
     * acá se listan también los borradores.
     */
    public function index(): JsonResponse
    {
        $news = NewsPromotion::query()->orderByDesc('created_at')->get();

        return response()->json(['data' => NewsPromotionResource::collection($news)]);
    }

    public function store(NewsPromotionRequest $request): JsonResponse
    {
        $news = NewsPromotion::query()->create([
            'admin_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'body' => $request->validated('body'),
            'image_url' => $request->validated('image_url'),
            'published_at' => $request->boolean('published') ? now() : null,
        ]);

        return response()->json(['data' => new NewsPromotionResource($news)], 201);
    }

    public function update(NewsPromotionRequest $request, NewsPromotion $news): JsonResponse
    {
        $news->fill($request->only(['title', 'body', 'image_url']));

        if ($request->has('published')) {
            $news->published_at = $request->boolean('published') ? ($news->published_at ?? now()) : null;
        }

        $news->save();

        return response()->json(['data' => new NewsPromotionResource($news)]);
    }

    public function destroy(NewsPromotion $news): JsonResponse
    {
        $news->delete();

        return response()->json(status: 204);
    }
}
