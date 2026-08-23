<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Application\Auth\Actions\AuthenticateUserAction;
use App\Application\Auth\Actions\RegisterUserAction;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $user = $action->execute($request->validated());
        $token = $user->createToken($request->userAgent() ?? 'api');

        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'token' => $token->plainTextToken,
            ],
        ], 201);
    }

    public function login(LoginRequest $request, AuthenticateUserAction $action): JsonResponse
    {
        $result = $action->execute(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
            $request->input('device_name') ?? $request->userAgent() ?? 'api',
        );

        if ($result->requiresTwoFactor()) {
            return response()->json([
                'data' => [
                    'requires_two_factor' => true,
                    'challenge_token' => $result->challengeToken,
                ],
            ]);
        }

        return response()->json([
            'data' => [
                'user' => new UserResource($result->token->accessToken->tokenable),
                'token' => $result->token->plainTextToken,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['data' => ['message' => 'Sesión cerrada.']]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }

    public function forgotPassword(Request $request, UserRepositoryInterface $users): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        if ($users->findByEmail($request->string('email')->toString())) {
            Password::sendResetLink($request->only('email'));
        }

        // Respuesta uniforme exista o no la cuenta, para no filtrar qué emails están registrados.
        return response()->json([
            'data' => ['message' => 'Si el correo existe, se envió un enlace de recuperación.'],
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'data' => ['message' => 'Contraseña actualizada correctamente.'],
        ]);
    }
}
