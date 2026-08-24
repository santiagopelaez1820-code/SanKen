<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Application\Auth\Actions\AuthenticateUserAction;
use App\Application\Auth\Actions\RegisterUserAction;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\UpdateAvatarRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
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

    /**
     * El usuario sube su propia foto — nunca un ID ajeno, $request->user()
     * es siempre el dueño del token actual. Reemplazo seguro: sube y
     * confirma que el nuevo archivo quedó guardado ANTES de borrar el
     * anterior — así un upload fallido a mitad de camino nunca deja al
     * usuario sin avatar (mismo patrón que AdminExerciseController::uploadVideo).
     */
    public function updateAvatar(UpdateAvatarRequest $request): JsonResponse
    {
        $user = $request->user();
        $previousPath = $this->publicPathFromUrl($user->avatar_url);

        $path = $request->file('avatar')->store('avatars', 'public');

        abort_unless(Storage::disk('public')->exists($path), 500, 'No se pudo guardar la foto.');

        // Ruta relativa, no Storage::disk('public')->url(): ver el mismo
        // comentario en AdminExerciseController::uploadVideo — cada cliente
        // resuelve esto contra su propio baseUrl vía ApiClient::mediaUrl().
        $user->update(['avatar_url' => '/storage/'.$path]);

        if ($previousPath && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    /**
     * Borra el archivo y limpia avatar_url — el usuario sigue existiendo y
     * vuelve a mostrar la inicial de su nombre (lo maneja el mobile).
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();
        $previousPath = $this->publicPathFromUrl($user->avatar_url);

        $user->update(['avatar_url' => null]);

        if ($previousPath && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    /**
     * avatar_url guarda la ruta relativa ("/storage/avatars/x.jpg"), así que
     * para volver a encontrar el archivo en disco alcanza con recortar el
     * marcador. Si viniera de algo que esta app no subió (sin '/storage/'),
     * devuelve null a propósito: nunca se intenta borrar un archivo ajeno.
     */
    private function publicPathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $marker = '/storage/';
        $position = strpos($url, $marker);

        return $position === false ? null : substr($url, $position + strlen($marker));
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
