<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->query('role'), fn ($query, $role) => $query->where('role', $role))
            ->when($request->has('is_banned'), fn ($query) => $query->where('is_banned', $request->boolean('is_banned')))
            ->when($request->query('q'), fn ($query, $q) => $query->where(
                fn ($query) => $query->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%")
            ))
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'data' => AdminUserResource::collection($users->items()),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function ban(Request $request, User $user): JsonResponse
    {
        Gate::authorize('ban', $user);

        $user->update(['is_banned' => ! $user->is_banned]);

        if ($user->is_banned) {
            // Banear tiene que cortar el acceso ya mismo, no solo bloquear
            // el próximo login — hasta ahora is_banned solo se chequeaba en
            // AuthenticateUserAction, así que una sesión ya abierta seguía
            // funcionando con acceso completo hasta que el token expirara.
            $user->tokens()->delete();
        }

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    public function verifyTrainer(User $user): JsonResponse
    {
        abort_unless($user->isTrainer(), 422, 'Solo se puede verificar a un entrenador.');

        $user->update(['trainer_verified_at' => $user->trainer_verified_at ? null : now()]);

        return response()->json(['data' => new AdminUserResource($user)]);
    }
}
