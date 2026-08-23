<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, UserRepositoryInterface $users, int $id, string $hash): JsonResponse
    {
        if (! $request->hasValidSignature()) {
            return response()->json(['message' => 'El enlace de verificación no es válido o expiró.'], 403);
        }

        $user = $users->findById($id);

        if (! $user || ! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'El enlace de verificación no es válido.'], 403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        $frontendUrl = config('app.frontend_url');

        if ($frontendUrl) {
            return response()->json([
                'data' => ['message' => 'Correo verificado.', 'redirect' => "{$frontendUrl}/email-verified"],
            ]);
        }

        return response()->json(['data' => ['message' => 'Correo verificado.']]);
    }

    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['data' => ['message' => 'El correo ya está verificado.']]);
        }

        $key = 'verify-email:'.$user->id;

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json(['message' => 'Demasiados intentos, espera antes de reintentar.'], 429);
        }

        RateLimiter::hit($key, 300);
        $user->sendEmailVerificationNotification();

        return response()->json(['data' => ['message' => 'Correo de verificación reenviado.']]);
    }
}
