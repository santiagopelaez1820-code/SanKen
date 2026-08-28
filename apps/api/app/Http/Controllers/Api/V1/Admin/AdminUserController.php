<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChangeUserRoleRequest;
use App\Http\Resources\AdminUserResource;
use App\Http\Resources\PersonalRecordResource;
use App\Models\PersonalRecord;
use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->with(['profile.city.state.country', 'routines' => fn ($query) => $query->where('is_active', true)])
            ->when($request->query('role'), fn ($query, $role) => $query->where('role', $role))
            ->when($request->has('is_banned'), fn ($query) => $query->where('is_banned', $request->boolean('is_banned')))
            ->when($request->query('country_id'), fn ($query, $countryId) => $query->whereHas(
                'profile.city', fn ($query) => $query->where('country_id', $countryId)
            ))
            ->when($request->query('state_id'), fn ($query, $stateId) => $query->whereHas(
                'profile.city', fn ($query) => $query->where('state_id', $stateId)
            ))
            ->when($request->query('city_id'), fn ($query, $cityId) => $query->whereHas(
                'profile', fn ($query) => $query->where('city_id', $cityId)
            ))
            ->when($request->query('q'), fn ($query, $q) => $query->where(
                fn ($query) => $query->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%")
            ))
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'data' => AdminUserResource::collection($users->items()),
            'meta' => $this->paginationMeta($users),
        ]);
    }

    /**
     * Detalle de un usuario: perfil, rol, estado, fecha de registro,
     * resumen de entrenamientos y PRs — sin exponer nada más allá de eso
     * (nunca password/tokens/2FA secrets, ya excluidos por $hidden en User).
     */
    public function show(User $user): JsonResponse
    {
        Gate::authorize('view', $user);

        $user->load(['profile.city.state.country', 'routines' => fn ($query) => $query->where('is_active', true)]);

        $trainingsCompleted = WorkoutSession::query()
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->count();

        $personalRecords = PersonalRecord::query()
            ->where('user_id', $user->id)
            ->with('exercise')
            ->orderByDesc('achieved_at')
            ->get();

        return response()->json([
            'data' => [
                ...(new AdminUserResource($user))->resolve(),
                'age' => $user->profile?->age,
                'sex' => $user->profile?->sex,
                'trainings_completed' => $trainingsCompleted,
                'personal_records' => PersonalRecordResource::collection($personalRecords)->resolve(),
            ],
        ]);
    }

    public function changeRole(ChangeUserRoleRequest $request, User $user): JsonResponse
    {
        Gate::authorize('changeRole', $user);

        $user->update(['role' => $request->validated('role')]);

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    public function activate(User $user): JsonResponse
    {
        Gate::authorize('manageActivation', $user);

        $user->update(['deactivated_at' => null]);

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    public function deactivate(User $user): JsonResponse
    {
        Gate::authorize('manageActivation', $user);

        $user->update(['deactivated_at' => now()]);
        // Igual que ban(): cortar el acceso ya mismo, no solo el próximo login.
        $user->tokens()->delete();

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    public function destroy(User $user): JsonResponse
    {
        Gate::authorize('delete', $user);

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['data' => null]);
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
