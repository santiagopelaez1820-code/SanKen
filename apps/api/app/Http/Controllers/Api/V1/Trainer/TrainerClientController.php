<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers del entrenador.

namespace App\Http\Controllers\Api\V1\Trainer;

// Esta línea sirve para importar la acción que agrega un cliente al entrenador.
use App\Application\Trainer\Actions\AddClientAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación para agregar un cliente.
use App\Http\Requests\Trainer\AddClientRequest;
// Esta línea sirve para importar la validación del cambio de estado de un cliente.
use App\Http\Requests\Trainer\UpdateClientStatusRequest;
// Esta línea sirve para importar el resource que da formato a una rutina.
use App\Http\Resources\RoutineResource;
// Esta línea sirve para importar el resource que da formato a la relación entrenador-cliente.
use App\Http\Resources\TrainerClientResource;
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
#[Group('Entrenador', 'Panel del entrenador (rol `trainer`): clientes y sus rutinas manuales.', weight: 22)]
// Esta línea sirve para declarar el controller de los clientes del entrenador.
class TrainerClientController extends Controller
{
    /** Listar mis clientes. */
    // Esta línea sirve para declarar el endpoint que lista los clientes del entrenador.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las relaciones del entrenador con sus clientes.
        $clients = $request->user()->trainerClients()
            // Esta línea sirve para cargar los datos de cada cliente.
            ->with('client')
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->latest()
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los clientes.
        return response()->json([
            // Esta línea sirve para incluir los clientes con su formato.
            'data' => TrainerClientResource::collection($clients),
        ]);
    }

    /**
     * Agregar un cliente.
     *
     * Vincula por correo a un usuario ya registrado; la relación queda activa
     * de inmediato (no hay invitación).
     */
    // Esta línea sirve para declarar el endpoint que agrega un cliente.
    public function store(AddClientRequest $request, AddClientAction $action): JsonResponse
    {
        // Esta línea sirve para vincular como cliente al usuario con ese correo.
        $trainerClient = $action->execute($request->user(), $request->validated('email'));

        // Esta línea sirve para responder con la relación creada.
        return response()->json([
            // Esta línea sirve para incluir la relación con los datos del cliente.
            'data' => new TrainerClientResource($trainerClient->load('client')),
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /**
     * Ver un cliente.
     *
     * Incluye su rutina activa en `meta.active_routine`.
     */
    // Esta línea sirve para declarar el endpoint que muestra un cliente.
    public function show(Request $request, TrainerClient $trainerClient): JsonResponse
    {
        // Esta línea sirve para verificar que el cliente es de este entrenador.
        Gate::authorize('view', $trainerClient);

        // Esta línea sirve para cargar los datos del cliente.
        $trainerClient->load('client');

        // Esta línea sirve para consultar las rutinas del cliente.
        $activeRoutine = $trainerClient->client->routines()
            // Esta línea sirve para filtrar solo la activa.
            ->where('is_active', true)
            // Esta línea sirve para cargar días, ejercicios y músculo principal.
            ->with('days.exercises.exercise.primaryMuscle')
            // Esta línea sirve para obtener la primera.
            ->first();

        // Esta línea sirve para responder con el cliente.
        return response()->json([
            // Esta línea sirve para incluir la relación con su formato.
            'data' => new TrainerClientResource($trainerClient),
            // Esta línea sirve para incluir datos extra.
            'meta' => [
                // Esta línea sirve para incluir la rutina activa con su formato, o null si no tiene.
                'active_routine' => $activeRoutine ? new RoutineResource($activeRoutine) : null,
            ],
        ]);
    }

    /**
     * Cambiar el estado de la relación con un cliente.
     *
     * `active`, `paused` o `ended` (registra la fecha de fin).
     */
    // Esta línea sirve para declarar el endpoint que cambia el estado de la relación con un cliente.
    public function update(UpdateClientStatusRequest $request, TrainerClient $trainerClient): JsonResponse
    {
        // Esta línea sirve para verificar que el entrenador puede modificar esta relación.
        Gate::authorize('update', $trainerClient);

        // Esta línea sirve para leer el estado nuevo.
        $status = $request->validated('status');

        // Esta línea sirve para actualizar la relación.
        $trainerClient->update([
            // Esta línea sirve para guardar el estado nuevo.
            'status' => $status,
            // Esta línea sirve para guardar la fecha de fin si se terminó, o dejar la que tenía.
            'ended_at' => $status === 'ended' ? now() : $trainerClient->ended_at,
        ]);

        // Esta línea sirve para responder con la relación actualizada.
        return response()->json([
            // Esta línea sirve para incluir la relación con los datos del cliente.
            'data' => new TrainerClientResource($trainerClient->load('client')),
        ]);
    }
}
