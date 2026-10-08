<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la edición de una serie.
use App\Http\Requests\Workout\UpdateSetRequest;
// Esta línea sirve para importar el resource que da formato a una serie.
use App\Http\Resources\WorkoutSetResource;
// Esta línea sirve para importar el modelo WorkoutSet (serie registrada).
use App\Models\WorkoutSet;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Entrenamientos" de Swagger.
#[Group('Entrenamientos', weight: 7)]
// Esta línea sirve para declarar el controller de las series registradas.
class WorkoutSetController extends Controller
{
    /** Corregir una serie ya registrada. */
    // Esta línea sirve para declarar el endpoint que corrige una serie.
    public function update(UpdateSetRequest $request, WorkoutSet $workoutSet): JsonResponse
    {
        // Esta línea sirve para verificar que la serie es del usuario.
        Gate::authorize('update', $workoutSet);

        // Esta línea sirve para guardar los cambios validados.
        $workoutSet->update($request->validated());

        // Esta línea sirve para responder con la serie actualizada.
        return response()->json(['data' => new WorkoutSetResource($workoutSet)]);
    }
}
