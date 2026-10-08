<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar la acción que asigna una rutina personalizada.
use App\Application\Admin\Actions\AssignPersonalRoutineAction;
// Esta línea sirve para importar la acción que devuelve al usuario a su rutina general.
use App\Application\Admin\Actions\RevertToGeneralRoutineAction;
// Esta línea sirve para importar la acción que edita una rutina personalizada.
use App\Application\Admin\Actions\UpdatePersonalRoutineAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de una rutina asignada.
use App\Http\Requests\Admin\AssignRoutineRequest;
// Esta línea sirve para importar el resource que da formato a una rutina.
use App\Http\Resources\RoutineResource;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

/**
 * Rutina personalizada por usuario — no confundir con las "rutinas
 * generales" de AdminRoutineTemplateController. Protegido solo por el
 * middleware role:super_admin del grupo de rutas (mismo criterio que
 * AdminExerciseController: no hay caso de "actuar sobre uno mismo" aquí).
 */
// Esta línea sirve para agrupar este controller en la sección "Admin · Usuarios" de Swagger.
#[Group('Admin · Usuarios', weight: 23)]
// Esta línea sirve para declarar el controller de rutinas personalizadas por usuario.
class AdminUserRoutineController extends Controller
{
    /**
     * Ver la rutina activa de un usuario.
     *
     * `data` es null si no tiene ninguna.
     */
    // Esta línea sirve para declarar el endpoint que muestra la rutina activa de un usuario.
    public function show(User $user): JsonResponse
    {
        // Esta línea sirve para buscar la rutina activa del usuario.
        $routine = $user->routines()->where('is_active', true)
            // Esta línea sirve para cargar sus días, ejercicios y músculo principal.
            ->with('days.exercises.exercise.primaryMuscle')
            // Esta línea sirve para obtener la primera.
            ->first();

        // Esta línea sirve para responder con la rutina, o null si no tiene.
        return response()->json(['data' => $routine ? new RoutineResource($routine) : null]);
    }

    /**
     * Asignar una rutina personalizada a un usuario.
     *
     * Desactiva la rutina activa que tuviera. El motor automático nunca la
     * reemplaza.
     */
    // Esta línea sirve para declarar el endpoint que asigna una rutina personalizada.
    public function store(AssignRoutineRequest $request, User $user): JsonResponse
    {
        // Esta línea sirve para crear la rutina personalizada para el usuario.
        $routine = (new AssignPersonalRoutineAction)->execute($request->user(), $user, $request->validated());

        // Esta línea sirve para responder con la rutina creada y código 201.
        return response()->json(['data' => new RoutineResource($routine)], 201);
    }

    /**
     * Editar una rutina personalizada.
     *
     * Reemplaza por completo su contenido. Solo aplica a rutinas asignadas por
     * un Super Admin.
     */
    // Esta línea sirve para declarar el endpoint que edita una rutina personalizada.
    public function update(AssignRoutineRequest $request, Routine $routine): JsonResponse
    {
        // Esta línea sirve para reemplazar el contenido de la rutina.
        $updated = (new UpdatePersonalRoutineAction)->execute($routine, $request->validated());

        // Esta línea sirve para responder con la rutina actualizada.
        return response()->json(['data' => new RoutineResource($updated)]);
    }

    /**
     * Volver a la rutina general de un usuario.
     *
     * Desactiva su rutina personalizada (queda en el historial) y regenera la
     * rutina general que le corresponde.
     */
    // Esta línea sirve para declarar el endpoint que devuelve al usuario a su rutina general.
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Esta línea sirve para desactivar la rutina personalizada y regenerar la general.
        $routine = (new RevertToGeneralRoutineAction)->execute($user);

        // Esta línea sirve para responder con la rutina general nueva.
        return response()->json(['data' => new RoutineResource($routine)]);
    }
}
