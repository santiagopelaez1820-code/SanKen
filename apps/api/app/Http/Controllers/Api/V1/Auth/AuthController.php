<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Application\Auth\Actions\AuthenticateUserAction;
use App\Application\Auth\Actions\RegisterUserAction;
use App\Application\Auth\Actions\SocialLoginAction;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Http\Controllers\Concerns\ReplacesPublicFile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SocialLoginRequest;
use App\Http\Requests\UpdateAvatarRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ReplacesPublicFile;

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

    /**
     * Mismo contrato de respuesta que login()/register() (user+token, o
     * requires_two_factor) — así el mobile reutiliza el mismo manejo de
     * respuesta para los tres. El id_token de Firebase se verifica dentro
     * de SocialLoginAction, nunca se confía en nada más del body.
     */
    public function socialLogin(SocialLoginRequest $request, SocialLoginAction $action): JsonResponse
    {
        $result = $action->execute(
            $request->string('id_token')->toString(),
            $request->string('provider')->toString(),
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

    /**
     * El usuario sube su propia foto — nunca un ID ajeno, $request->user()
     * es siempre el dueño del token actual. storePublicFileReplacing()
     * confirma que el nuevo archivo quedó guardado ANTES de borrar el
     * anterior — así un upload fallido a mitad de camino nunca deja al
     * usuario sin avatar.
     */
    public function updateAvatar(UpdateAvatarRequest $request): JsonResponse
    {
        $user = $request->user();

        $avatarUrl = $this->storePublicFileReplacing(
            $request->file('avatar'),
            'avatars',
            $user->avatar_url,
            'No se pudo guardar la foto.',
        );
        $user->update(['avatar_url' => $avatarUrl]);

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    /**
     * Borra el archivo y limpia avatar_url — el usuario sigue existiendo y
     * vuelve a mostrar la inicial de su nombre (lo maneja el mobile).
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $this->deletePublicFileByUrl($user->avatar_url);
        $user->update(['avatar_url' => null]);

        return response()->json(['data' => new UserResource($user->fresh())]);
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
