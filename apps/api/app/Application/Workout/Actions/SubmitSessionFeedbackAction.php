<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar el servicio que calcula la sobrecarga progresiva.
use App\Domain\Routine\Services\ProgressiveOverloadCalculator;
// Esta línea sirve para importar el objeto que resume el rendimiento de un ejercicio.
use App\Domain\Routine\ValueObjects\PerformanceSummary;
// Esta línea sirve para importar el modelo RoutineExercise (ejercicio de una rutina).
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * "¿Pudiste completar el entrenamiento tal como estaba planeado?" — la
 * respuesta dispara la sobrecarga progresiva para cada ejercicio de la
 * sesión, actualizando routine_exercises.suggested_weight_kg/
 * suggested_reps_per_set para la próxima vez que aparezca ese día en la
 * rutina.
 *
 * Si la sesión no vino de un día de rutina (entrenamiento libre) no hay
 * routine_exercises que actualizar: solo se guarda la respuesta.
 */
// Esta línea sirve para declarar la acción que guarda el feedback de la sesión y ajusta la rutina.
class SubmitSessionFeedbackAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el calculador de sobrecarga progresiva.
        private readonly ProgressiveOverloadCalculator $calculator,
    ) {}

    // Esta línea sirve para declarar el método que recibe la sesión y si se completó como estaba planeado.
    public function execute(WorkoutSession $session, bool $completedAsPlanned): WorkoutSession
    {
        // Todo en una transacción: recorre y actualiza suggested_weight_kg/
        // suggested_reps_per_set/consecutive_failures de VARIOS
        // routine_exercises -- sin esto, una falla a mitad del loop dejaría
        // algunos ejercicios con la sugerencia de la próxima sesión ya
        // recalculada y otros con el valor viejo, un estado de sobrecarga
        // progresiva inconsistente y silencioso.
        // Esta línea sirve para hacer todo dentro de una transacción y devolver la sesión.
        return DB::transaction(function () use ($session, $completedAsPlanned) {
            // Esta línea sirve para guardar la respuesta del usuario en la sesión.
            $session->update(['completed_as_planned' => $completedAsPlanned]);

            // Esta línea sirve para revisar si la sesión no vino de un día de rutina.
            if ($session->routine_day_id === null) {
                // Esta línea sirve para devolver la sesión sin recalcular nada.
                return $session->fresh(['exercises.exercise', 'exercises.sets']);
            }

            // Esta línea sirve para consultar los ejercicios del día de rutina.
            $routineExercises = RoutineExercise::query()
                // Esta línea sirve para filtrar por el día de rutina de la sesión.
                ->where('routine_day_id', $session->routine_day_id)
                // Esta línea sirve para cargar los datos del ejercicio.
                ->with('exercise')
                // Esta línea sirve para ejecutar la consulta.
                ->get()
                // Esta línea sirve para indexarlos por el id del ejercicio.
                ->keyBy('exercise_id');

            // Esta línea sirve para recorrer cada ejercicio realizado en la sesión con sus series.
            foreach ($session->exercises()->with('sets')->get() as $workoutExercise) {
                // Esta línea sirve para buscar el ejercicio equivalente en la rutina.
                /** @var RoutineExercise|null $routineExercise */
                $routineExercise = $routineExercises->get($workoutExercise->exercise_id);

                // Ejercicio libre agregado durante la sesión: no forma parte del
                // plan, no hay nada que recalcular.
                // Esta línea sirve para revisar si el ejercicio no estaba en el plan.
                if (! $routineExercise) {
                    // Esta línea sirve para saltar al siguiente ejercicio.
                    continue;
                }

                // Orden real de ejecución (set_number), solo series de trabajo —
                // el índice posicional (0, 1, 2...) es "serie 1, serie 2..." a
                // los efectos de la rampa, no el set_number crudo.
                // Esta línea sirve para obtener las series de trabajo.
                $workingSets = $workoutExercise->sets
                    // Esta línea sirve para excluir las series de calentamiento.
                    ->where('is_warmup', false)
                    // Esta línea sirve para quedarse solo con las completadas.
                    ->where('completed', true)
                    // Esta línea sirve para reindexar la lista.
                    ->values();

                // Esta línea sirve para revisar si no hubo series de trabajo.
                if ($workingSets->isEmpty()) {
                    // Esta línea sirve para saltar al siguiente ejercicio.
                    continue;
                }

                // Esta línea sirve para armar el resumen de rendimiento del ejercicio.
                $performance = new PerformanceSummary(
                    // Esta línea sirve para pasar las series objetivo.
                    targetSets: $routineExercise->target_sets,
                    // Esta línea sirve para pasar las repeticiones hechas en cada serie.
                    actualRepsPerSet: $workingSets->pluck('reps')->all(),
                    // Esta línea sirve para pasar el peso usado en cada serie.
                    actualWeightPerSet: $workingSets->pluck('weight_kg')->map(fn ($w) => (float) $w)->all(),
                    // Esta línea sirve para pasar las repeticiones sugeridas por serie.
                    targetRepsPerSet: $routineExercise->suggested_reps_per_set,
                    // Esta línea sirve para pasar si se completó como estaba planeado.
                    completedAsPlanned: $completedAsPlanned,
                );

                // Esta línea sirve para calcular la sugerencia para la próxima sesión.
                $suggestion = $this->calculator->calculate(
                    // Esta línea sirve para pasar el resumen de rendimiento.
                    $performance,
                    // Esta línea sirve para pasar el equipamiento del ejercicio.
                    $routineExercise->exercise->equipment,
                    // Esta línea sirve para pasar cuántas veces seguidas falló el usuario.
                    $routineExercise->consecutive_failures,
                    // Esta línea sirve para pasar el mínimo de repeticiones del rango objetivo.
                    $this->parseMinReps($routineExercise->target_reps),
                );

                // Esta línea sirve para guardar la sugerencia en el ejercicio de la rutina.
                $routineExercise->update([
                    // Esta línea sirve para guardar el peso sugerido para la próxima vez.
                    'suggested_weight_kg' => $suggestion->suggestedWeightKg,
                    // Esta línea sirve para guardar las repeticiones sugeridas por serie.
                    'suggested_reps_per_set' => $suggestion->suggestedRepsPerSet,
                    // Esta línea sirve para guardar el contador de fallos consecutivos.
                    'consecutive_failures' => $suggestion->consecutiveFailures,
                ]);
            }

            // Esta línea sirve para devolver la sesión recargada con sus ejercicios y series.
            return $session->fresh(['exercises.exercise', 'exercises.sets']);
        });
    }

    // Esta línea sirve para declarar el método privado que obtiene el mínimo de un rango de repeticiones.
    private function parseMinReps(string $targetReps): int
    {
        // Esta línea sirve para tomar el número antes del guion (ej. de "8-12" devuelve 8).
        return (int) explode('-', $targetReps)[0];
    }
}
