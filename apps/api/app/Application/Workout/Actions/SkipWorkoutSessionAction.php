<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar la acción que calcula el bloqueo diario.
use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
// Esta línea sirve para importar el modelo RoutineDay (día de rutina).
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Registra que el usuario decidió saltarse el entrenamiento de hoy (seccion 4
 * del pedido). A propósito NO reutiliza StartWorkoutSessionAction: no crea
 * workout_exercises (no hay ejercicios/series/pesos que registrar) y nunca
 * toca routine_exercises/ProgressiveOverloadCalculator — saltar no debe
 * afectar la sobrecarga progresiva de ningún ejercicio.
 */
// Esta línea sirve para declarar la acción que registra que el usuario saltó el entrenamiento de hoy.
class SkipWorkoutSessionAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir la acción que calcula el bloqueo diario.
        private readonly DetermineDailyLockStatusAction $dailyLock,
    ) {}

    // Esta línea sirve para declarar el método que recibe al usuario y el día de rutina a saltar.
    public function execute(User $user, ?RoutineDay $routineDay): WorkoutSession
    {
        // Mismo guardrail que StartWorkoutSessionAction: saltar también
        // "gasta" el turno de hoy (ver DetermineNextRoutineDayAction), así
        // que sin este check un skip repetido sería la forma de saltarse el
        // bloqueo diario avanzando de a un día por request.
        // Esta línea sirve para revisar si el día pertenece a una rutina que hoy ya está bloqueada.
        if ($routineDay && $this->dailyLock->execute($routineDay->routine)->locked) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el siguiente entrenamiento se desbloquea a las 00:00.
                'routine_day_id' => ['Ya completaste (o saltaste) tu entrenamiento de hoy. El siguiente se desbloquea a las 00:00.'],
            ]);
        }

        // Esta línea sirve para crear la sesión saltada del usuario y devolverla.
        return $user->workoutSessions()->create([
            // Esta línea sirve para guardar el día de rutina, si se indicó.
            'routine_day_id' => $routineDay?->id,
            // Esta línea sirve para guardar la fecha de hoy.
            'performed_at' => now()->toDateString(),
            // Esta línea sirve para marcarla como no completada.
            'completed' => false,
            // Esta línea sirve para guardar el momento en que se saltó.
            'skipped_at' => now(),
        ]);
    }
}
