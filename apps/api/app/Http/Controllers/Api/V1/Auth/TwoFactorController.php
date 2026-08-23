<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Application\Auth\Actions\ChallengeTwoFactorAction;
use App\Application\Auth\Actions\ConfirmTwoFactorAction;
use App\Application\Auth\Actions\DisableTwoFactorAction;
use App\Application\Auth\Actions\EnableTwoFactorAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChallengeTwoFactorRequest;
use App\Http\Requests\Auth\ConfirmTwoFactorRequest;
use App\Http\Requests\Auth\DisableTwoFactorRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function enable(Request $request, EnableTwoFactorAction $action): JsonResponse
    {
        return response()->json(['data' => $action->execute($request->user())]);
    }

    public function confirm(ConfirmTwoFactorRequest $request, ConfirmTwoFactorAction $action): JsonResponse
    {
        $recoveryCodes = $action->execute($request->user(), $request->string('code')->toString());

        return response()->json(['data' => ['recovery_codes' => $recoveryCodes]]);
    }

    public function disable(DisableTwoFactorRequest $request, DisableTwoFactorAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->string('password')->toString());

        return response()->json(['data' => ['message' => '2FA desactivado.']]);
    }

    public function challenge(ChallengeTwoFactorRequest $request, ChallengeTwoFactorAction $action): JsonResponse
    {
        $token = $action->execute(
            $request->string('challenge_token')->toString(),
            $request->string('code')->toString(),
            $request->input('device_name') ?? $request->userAgent() ?? 'api',
        );

        return response()->json([
            'data' => [
                'user' => new UserResource($token->accessToken->tokenable),
                'token' => $token->plainTextToken,
            ],
        ]);
    }
}
