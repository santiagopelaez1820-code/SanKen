<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers del entrenador.

namespace App\Http\Controllers\Api\V1\Trainer;

// Esta línea sirve para importar la acción que crea una rutina manual.
use App\Application\Trainer\Actions\CreateManualRoutineAction;
// Esta línea sirve para importar la acción que edita una rutina manual.
use App\Application\Trainer\Actions\UpdateManualRoutineAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la creación de una rutina manual.
use App\Http\Requests\Trainer\StoreManualRoutineRequest;
// Esta línea sirve para importar la validación de la edición de una rutina manual.
use App\Http\Requests\Trainer\UpdateManualRoutineRequest;
// Esta línea sirve para importar el resource que da formato a una rutina.
use App\Http\Resources\RoutineResource;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Entrenador" de Swagger.
#[Group('Entrenador', weight: 22)]
// Esta línea sirve para declarar el controller de las rutinas manuales del entrenador.
class TrainerRoutineController extends Controller
{
    /**
     * Crear una rutina manual para un cliente.
     *
     * El motor automático nunca reemplaza una rutina creada por el
     * entrenador.
     */
    // Esta línea sirve para declarar el endpoint que crea una rutina manual para un cliente.
    public function store(StoreManualRoutineRequest $request, TrainerClient $trainerClient, CreateManualRoutineAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que el cliente es de este entrenador.
        Gate::authorize('view', $trainerClient);

        // Esta línea sirve para crear la rutina con los datos validados.
        $routine = $action->execute($request->user(), $trainerClient, $request->validated());

        // Esta línea sirve para responder con la rutina creada y código 201.
        return response()->json(['data' => new RoutineResource($routine)], 201);
    }

    /**
     * Ver una rutina manual.
     *
     * Solo las rutinas creadas por el entrenador autenticado.
     */
    // Esta línea sirve para declarar el endpoint que muestra una rutina manual.
    public function show(Request $request, Routine $routine): JsonResponse
    {
        // Esta línea sirve para verificar que la rutina la creó este entrenador.
        Gate::authorize('manage', $routine);

        // Esta línea sirve para responder con la rutina.
        return response()->json([
            // Esta línea sirve para incluir la rutina con días, ejercicios y músculo principal.
            'data' => new RoutineResource($routine->load('days.exercises.exercise.primaryMuscle')),
        ]);
    }

    /** Editar una rutina manual. */
    // Esta línea sirve para declarar el endpoint que edita una rutina manual.
    public function update(UpdateManualRoutineRequest $request, Routine $routine, UpdateManualRoutineAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que la rutina la creó este entrenador.
        Gate::authorize('manage', $routine);

        // Esta línea sirve para actualizar la rutina con los datos validados.
        $routine = $action->execute($routine, $request->validated());

        // Esta línea sirve para responder con la rutina actualizada.
        return response()->json(['data' => new RoutineResource($routine)]);
    }
}
