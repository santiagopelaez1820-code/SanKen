<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del cambio de rol.
use App\Http\Requests\Admin\ChangeUserRoleRequest;
// Esta línea sirve para importar la validación de la edición de un usuario.
use App\Http\Requests\Admin\UpdateUserRequest;
// Esta línea sirve para importar el resource que da formato a un usuario para el admin.
use App\Http\Resources\AdminUserResource;
// Esta línea sirve para importar el resource que da formato a un récord personal.
use App\Http\Resources\PersonalRecordResource;
// Esta línea sirve para importar el modelo PersonalRecord (récord personal).
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Admin · Usuarios" de Swagger.
#[Group('Admin · Usuarios', 'Gestión de usuarios: búsqueda, detalle, rol, estado, baneo, verificación de entrenadores, consentimientos y rutina personalizada.', weight: 23)]
// Esta línea sirve para declarar el controller de gestión de usuarios.
class AdminUserController extends Controller
{
    /**
     * Listar usuarios.
     *
     * Paginado de a 20, los más recientes primero. Filtros opcionales: `role`,
     * `is_banned`, ubicación (`country_id`, `state_id`, `city_id`) y `q`
     * (nombre o correo).
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista los usuarios.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar los usuarios.
        $users = User::query()
            // Esta línea sirve para cargar su ubicación completa y su rutina activa.
            ->with(['profile.city.state.country', 'routines' => fn ($query) => $query->where('is_active', true)])
            // Esta línea sirve para filtrar por rol si se envió.
            ->when($request->query('role'), fn ($query, $role) => $query->where('role', $role))
            // Esta línea sirve para filtrar por baneados o no si se envió.
            ->when($request->has('is_banned'), fn ($query) => $query->where('is_banned', $request->boolean('is_banned')))
            // Esta línea sirve para filtrar por país si se envió.
            ->when($request->query('country_id'), fn ($query, $countryId) => $query->whereHas(
                // Esta línea sirve para buscar usuarios cuya ciudad pertenece a ese país.
                'profile.city', fn ($query) => $query->where('country_id', $countryId)
            ))
            // Esta línea sirve para filtrar por departamento/estado si se envió.
            ->when($request->query('state_id'), fn ($query, $stateId) => $query->whereHas(
                // Esta línea sirve para buscar usuarios cuya ciudad pertenece a ese estado.
                'profile.city', fn ($query) => $query->where('state_id', $stateId)
            ))
            // Esta línea sirve para filtrar por ciudad si se envió.
            ->when($request->query('city_id'), fn ($query, $cityId) => $query->whereHas(
                // Esta línea sirve para buscar usuarios de esa ciudad.
                'profile', fn ($query) => $query->where('city_id', $cityId)
            ))
            // Esta línea sirve para buscar por texto si se envió.
            ->when($request->query('q'), fn ($query, $q) => $query->where(
                // Esta línea sirve para buscar el texto en el nombre o en el correo.
                fn ($query) => $query->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%")
            ))
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('created_at')
            // Esta línea sirve para paginar de a 20.
            ->paginate(20);

        // Esta línea sirve para responder con los usuarios.
        return response()->json([
            // Esta línea sirve para incluir los usuarios con su formato.
            'data' => AdminUserResource::collection($users->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($users),
        ]);
    }

    /**
     * Ver el detalle de un usuario.
     *
     * Detalle de un usuario: perfil, rol, estado, fecha de registro,
     * resumen de entrenamientos y PRs — sin exponer nada más allá de eso
     * (nunca password/tokens/2FA secrets, ya excluidos por $hidden en User).
     */
    // Esta línea sirve para declarar el endpoint que muestra el detalle de un usuario.
    public function show(User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien consulta puede ver al usuario.
        Gate::authorize('view', $user);

        // Esta línea sirve para cargar la ubicación y la rutina activa del usuario.
        $user->load(['profile.city.state.country', 'routines' => fn ($query) => $query->where('is_active', true)]);

        // Esta línea sirve para contar los entrenamientos completados.
        $trainingsCompleted = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar solo los completados.
            ->where('completed', true)
            // Esta línea sirve para contarlos.
            ->count();

        // Esta línea sirve para consultar los récords personales del usuario.
        $personalRecords = PersonalRecord::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para cargar el ejercicio de cada récord.
            ->with('exercise')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('achieved_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con el detalle.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir los datos del usuario con su formato.
                ...(new AdminUserResource($user))->resolve(),
                // Esta línea sirve para incluir la edad.
                'age' => $user->profile?->age,
                // Esta línea sirve para incluir el sexo.
                'sex' => $user->profile?->sex,
                // Esta línea sirve para incluir la cantidad de entrenamientos completados.
                'trainings_completed' => $trainingsCompleted,
                // Esta línea sirve para incluir los récords personales con su formato.
                'personal_records' => PersonalRecordResource::collection($personalRecords)->resolve(),
            ],
        ]);
    }

    /**
     * Editar el nombre y el correo de un usuario.
     *
     * Edición básica de contacto (nombre/email) — no toca role, ban, ni
     * activación, cada una de esas tiene su propio endpoint más restringido.
     */
    // Esta línea sirve para declarar el endpoint que edita nombre y correo de un usuario.
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede modificar al usuario.
        Gate::authorize('update', $user);

        // Esta línea sirve para actualizar el usuario con los datos validados.
        $user->update($request->validated());

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /**
     * Cambiar el rol de un usuario.
     *
     * Solo a `user` o `trainer`. Un Super Admin no puede cambiar su propio
     * rol.
     */
    // Esta línea sirve para declarar el endpoint que cambia el rol de un usuario.
    public function changeRole(ChangeUserRoleRequest $request, User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede cambiar el rol.
        Gate::authorize('changeRole', $user);

        // Esta línea sirve para guardar el rol nuevo.
        $user->update(['role' => $request->validated('role')]);

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /** Reactivar una cuenta. */
    // Esta línea sirve para declarar el endpoint que reactiva una cuenta.
    public function activate(User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede activar o desactivar cuentas.
        Gate::authorize('manageActivation', $user);

        // Esta línea sirve para quitar la fecha de desactivación.
        $user->update(['deactivated_at' => null]);

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /**
     * Desactivar una cuenta.
     *
     * Revoca de inmediato todas sus sesiones.
     */
    // Esta línea sirve para declarar el endpoint que desactiva una cuenta.
    public function deactivate(User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede activar o desactivar cuentas.
        Gate::authorize('manageActivation', $user);

        // Esta línea sirve para guardar la fecha de desactivación.
        $user->update(['deactivated_at' => now()]);
        // Igual que ban(): cortar el acceso ya mismo, no solo el próximo login.
        // Esta línea sirve para revocar todos los tokens para cortar el acceso de inmediato.
        $user->tokens()->delete();

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /**
     * Eliminar una cuenta.
     *
     * Irreversible. Un Super Admin no puede eliminar su propia cuenta.
     */
    // Esta línea sirve para declarar el endpoint que elimina una cuenta.
    public function destroy(User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien elimina tiene permiso.
        Gate::authorize('delete', $user);

        // Esta línea sirve para revocar todos los tokens del usuario.
        $user->tokens()->delete();
        // Esta línea sirve para borrar al usuario.
        $user->delete();

        // Esta línea sirve para responder sin datos.
        return response()->json(['data' => null]);
    }

    /**
     * Banear o desbanear a un usuario.
     *
     * Alterna `is_banned`. Al banear se revocan de inmediato todas sus
     * sesiones.
     */
    // Esta línea sirve para declarar el endpoint que banea o desbanea a un usuario.
    public function ban(Request $request, User $user): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede banear.
        Gate::authorize('ban', $user);

        // Esta línea sirve para alternar el estado de baneo.
        $user->update(['is_banned' => ! $user->is_banned]);

        // Esta línea sirve para revisar si quedó baneado.
        if ($user->is_banned) {
            // Banear tiene que cortar el acceso ya mismo, no solo bloquear
            // el próximo login — hasta ahora is_banned solo se chequeaba en
            // AuthenticateUserAction, así que una sesión ya abierta seguía
            // funcionando con acceso completo hasta que el token expirara.
            // Esta línea sirve para revocar todos sus tokens para cortar el acceso de inmediato.
            $user->tokens()->delete();
        }

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /**
     * Verificar a un entrenador (o quitarle la verificación).
     *
     * Alterna `trainer_verified_at`. Solo para usuarios con rol `trainer`
     * (si no, 422).
     */
    // Esta línea sirve para declarar el endpoint que verifica o quita la verificación de un entrenador.
    public function verifyTrainer(User $user): JsonResponse
    {
        // Esta línea sirve para cortar con error 422 si el usuario no es entrenador.
        abort_unless($user->isTrainer(), 422, 'Solo se puede verificar a un entrenador.');

        // Esta línea sirve para alternar la fecha de verificación (ponerla o quitarla).
        $user->update(['trainer_verified_at' => $user->trainer_verified_at ? null : now()]);

        // Esta línea sirve para responder con el usuario actualizado.
        return response()->json(['data' => new AdminUserResource($user)]);
    }
}
