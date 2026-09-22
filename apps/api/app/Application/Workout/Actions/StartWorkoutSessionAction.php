<?php

namespace App\Application\Workout\Actions;

use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
use App\Domain\Workout\Services\SessionReadinessAdjuster;
use App\Domain\Workout\ValueObjects\SessionAdjustment;
use App\Models\RoutineDay;
use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Validation\ValidationException;

class StartWorkoutSessionAction
{
    public function __construct(
        private readonly SessionReadinessAdjuster $readinessAdjuster,
        private readonly DetermineDailyLockStatusAction $dailyLock,
    ) {}

    /**
     * @param  array{sleep_quality?: int, energy_level?: int, muscle_soreness?: int}  $precheck
     */
    public function execute(User $user, ?RoutineDay $routineDay, array $precheck): WorkoutSession
    {
        // Desbloqueo diario: solo aplica a sesiones de un día de rutina real
        // (una sesión "libre", sin routine_day_id, no es "el próximo día del
        // programa" y sigue permitida). Se recalcula fresco acá -- nunca se
        // confía en ningún dato que mande el cliente sobre si hoy ya
        // entrenó -- así que ni manipular la request ni cambiar la fecha del
        // dispositivo lo saltea: el servidor es la única autoridad.
        if ($routineDay && $this->dailyLock->execute($routineDay->routine)->locked) {
            throw ValidationException::withMessages([
                'routine_day_id' => ['Ya completaste (o saltaste) tu entrenamiento de hoy. El siguiente se desbloquea a las 00:00.'],
            ]);
        }

        // Si el usuario canceló el entrenamiento de este mismo día de rutina
        // HOY, retomamos esa misma sesión en vez de crear una nueva:
        // workout_exercises/workout_sets ya registrados nunca se tocan al
        // cancelar (ver CancelWorkoutSessionAction), así que reactivarla
        // (limpiar cancelled_at) alcanza para seguir exactamente donde quedó
        // (mismo ejercicio, mismas series). El precheck de esta llamada se
        // ignora a propósito en ese caso: ya se aplicó sobre una sesión que
        // puede tener series cargadas.
        //
        // A propósito NO se extiende a "cualquier sesión con completed=false"
        // -- una sesión puede seguir en completed=false después de recibir
        // feedback (completed y completed_as_planned son independientes,
        // ver SubmitSessionFeedbackAction) sin haber sido abandonada, así
        // que ese criterio reabriría sesiones que en realidad ya terminaron
        // su ciclo. cancelled_at es la única señal inequívoca de "el usuario
        // salió sin terminar y quiere volver".
        if ($routineDay) {
            $existing = WorkoutSession::query()
                ->where('user_id', $user->id)
                ->where('routine_day_id', $routineDay->id)
                ->whereDate('performed_at', now())
                ->whereNotNull('cancelled_at')
                ->latest('id')
                ->first();

            if ($existing) {
                $existing->update(['cancelled_at' => null]);

                return $existing->load('exercises.exercise', 'routineDay');
            }
        }

        $user->loadMissing('onboardingResponse');
        $adjustment = $this->readinessAdjuster->adjustmentFor($precheck, $user->onboardingResponse?->level ?? 'intermediate');

        $session = $user->workoutSessions()->create([
            'routine_day_id' => $routineDay?->id,
            'performed_at' => now()->toDateString(),
            'sleep_quality' => $precheck['sleep_quality'] ?? null,
            'energy_level' => $precheck['energy_level'] ?? null,
            'muscle_soreness' => $precheck['muscle_soreness'] ?? null,
            'completed' => false,
            'readiness_note' => $adjustment->note,
        ]);

        // Precarga los ejercicios planeados para que el usuario no tenga que
        // volver a armarlos manualmente; puede agregar más sobre la marcha.
        //
        // Copia (snapshot) target_sets/target_reps/suggested_weight_kg del
        // routine_exercise al iniciar — antes la pantalla de entrenamiento
        // dependía de una consulta aparte a /routines/active cruzada por
        // índice de array, lo que rompía tanto el peso recomendado (llegaba
        // desactualizado) como la posibilidad de recargar la página a mitad
        // de sesión. Con esto la sesión es autosuficiente.
        //
        // El recorte de SessionReadinessAdjuster se aplica acá, sobre la
        // copia — routine_exercise (la plantilla de la rutina) nunca se
        // modifica, así que la próxima sesión vuelve a partir de los valores
        // completos.
        if ($routineDay) {
            foreach ($routineDay->exercises as $routineExercise) {
                $adjusted = $this->readinessAdjuster->adjustExercise(
                    $routineExercise->target_sets,
                    $routineExercise->suggested_reps_per_set,
                    $routineExercise->suggested_weight_kg,
                    $routineExercise->target_rpe,
                    $adjustment,
                );

                $session->exercises()->create([
                    'exercise_id' => $routineExercise->exercise_id,
                    'order' => $routineExercise->order,
                    'all_sets_completed' => false,
                    'target_sets' => $adjusted['targetSets'],
                    'target_reps' => $routineExercise->target_reps,
                    'rest_seconds' => $routineExercise->rest_seconds,
                    'target_rpe' => $adjusted['rpe'],
                    'suggested_weight_kg' => $adjusted['weightKg'],
                    'suggested_reps_per_set' => $adjusted['repsPerSet'],
                ]);
            }
        }

        return $session->load('exercises.exercise', 'routineDay');
    }
}
