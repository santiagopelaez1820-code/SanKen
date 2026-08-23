<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Push\StoreExpoTokenRequest;
use App\Http\Requests\Push\StoreWebSubscriptionRequest;
use App\Models\PushDeviceToken;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushController extends Controller
{
    public function storeExpoToken(StoreExpoTokenRequest $request): JsonResponse
    {
        // updateOrCreate por token (no por user_id): reinstalar la app en el
        // mismo device suele generar el mismo token: evita duplicados.
        PushDeviceToken::query()->updateOrCreate(
            ['token' => $request->validated('token')],
            ['user_id' => $request->user()->id, 'platform' => 'expo'],
        );

        return response()->json(['data' => ['message' => 'Token registrado.']], 201);
    }

    public function destroyExpoToken(Request $request): JsonResponse
    {
        $request->validate(['token' => ['required', 'string']]);

        PushDeviceToken::query()
            ->where('user_id', $request->user()->id)
            ->where('token', $request->input('token'))
            ->delete();

        return response()->json(status: 204);
    }

    public function storeWebSubscription(StoreWebSubscriptionRequest $request): JsonResponse
    {
        PushSubscription::query()->updateOrCreate(
            ['endpoint' => $request->validated('endpoint')],
            [
                'user_id' => $request->user()->id,
                'public_key' => $request->validated('keys.p256dh'),
                'auth_token' => $request->validated('keys.auth'),
            ],
        );

        return response()->json(['data' => ['message' => 'Suscripción registrada.']], 201);
    }

    public function destroyWebSubscription(Request $request): JsonResponse
    {
        $request->validate(['endpoint' => ['required', 'string']]);

        PushSubscription::query()
            ->where('user_id', $request->user()->id)
            ->where('endpoint', $request->input('endpoint'))
            ->delete();

        return response()->json(status: 204);
    }
}
