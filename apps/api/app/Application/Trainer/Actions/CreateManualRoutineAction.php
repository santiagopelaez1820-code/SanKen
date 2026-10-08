<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del entrenador.

namespace App\Application\Trainer\Actions;

// Esta línea sirve para importar el trait que crea los días y ejercicios de una rutina.
use App\Application\Routine\Actions\Concerns\SyncsRoutineDays;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Crea una rutina manual (source=trainer) para un cliente. El motor
 * automático nunca sobrescribe estas rutinas (ver EloquentRoutineRepository).
 */
// Esta línea sirve para declarar la acción que crea una rutina manual para un cliente.
class CreateManualRoutineAction
{
    // Esta línea sirve para incluir el trait que crea los días de la rutina.
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe al entrenador, la relación y los datos.
    public function execute(User $trainer, TrainerClient $trainerClient, array $data): Routine
    {
        // Esta línea sirve para revisar si la relación con el cliente no está activa.
        if ($trainerClient->status !== 'active') {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que solo se asignan rutinas a clientes activos.
                'trainer_client' => ['Solo puedes asignar rutinas a clientes con una relación activa.'],
            ]);
        }

        // Esta línea sirve para crear la rutina dentro de una transacción.
        $routine = DB::transaction(function () use ($trainer, $trainerClient, $data) {
            // Esta línea sirve para desactivar la rutina activa que tuviera el cliente.
            $trainerClient->client->routines()->where('is_active', true)->update(['is_active' => false]);

            // Esta línea sirve para crear la rutina con los siguientes datos.
            $routine = Routine::query()->create([
                // Esta línea sirve para guardar el id del cliente dueño de la rutina.
                'user_id' => $trainerClient->client_id,
                // Esta línea sirve para guardar el id del entrenador que la creó.
                'created_by_trainer_id' => $trainer->id,
                // Esta línea sirve para marcar que la rutina la creó un entrenador.
                'source' => 'trainer',
                // Esta línea sirve para guardar el objetivo.
                'goal' => $data['goal'],
                // Esta línea sirve para guardar el tipo de división.
                'split_type' => $data['split_type'],
                // Esta línea sirve para guardar los días por semana.
                'frequency_days' => $data['frequency_days'],
                // Esta línea sirve para guardar la duración en semanas.
                'duration_weeks' => $data['duration_weeks'],
                // Esta línea sirve para dejarla como rutina activa.
                'is_active' => true,
                // Esta línea sirve para guardar la fecha de inicio (hoy).
                'starts_at' => now()->toDateString(),
                // Esta línea sirve para calcular y guardar la fecha de fin.
                'ends_at' => now()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            // Esta línea sirve para crear los días y ejercicios de la rutina.
            $this->syncRoutineDays($routine, $data['days']);

            // Esta línea sirve para devolver la rutina con sus días y ejercicios cargados.
            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        // Esta línea sirve para borrar de la caché la rutina activa del cliente.
        Cache::forget(CacheKeys::activeRoutine($trainerClient->client_id));

        // Esta línea sirve para devolver la rutina creada.
        return $routine;
    }
}
