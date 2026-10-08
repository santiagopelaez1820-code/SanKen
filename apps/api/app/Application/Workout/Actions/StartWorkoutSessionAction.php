<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar la acción que calcula el bloqueo diario.
use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
// Esta línea sirve para importar el servicio que ajusta la sesión según cómo llega el usuario.
use App\Domain\Workout\Services\SessionReadinessAdjuster;
// Esta línea sirve para importar el objeto que describe el ajuste aplicado a la sesión.
// Esta línea sirve para importar el modelo RoutineDay (día de rutina).
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que inicia una sesión de entrenamiento.
class StartWorkoutSessionAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el servicio que ajusta la sesión según el precheck.
        private readonly SessionReadinessAdjuster $readinessAdjuster,
        // Esta línea sirve para recibir la acción que calcula el bloqueo diario.
        private readonly DetermineDailyLockStatusAction $dailyLock,
    ) {}

    /**
     * @param  array{sleep_quality?: int, energy_level?: int, muscle_soreness?: int}  $precheck
     */
    // Esta línea sirve para declarar el método que recibe al usuario, el día de rutina y el precheck.
    public function execute(User $user, ?RoutineDay $routineDay, array $precheck): WorkoutSession
    {
        // Desbloqueo diario: solo aplica a sesiones de un día de rutina real
        // (una sesión "libre", sin routine_day_id, no es "el próximo día del
        // programa" y sigue permitida). Se recalcula fresco acá -- nunca se
        // confía en ningún dato que mande el cliente sobre si hoy ya
        // entrenó -- así que ni manipular la request ni cambiar la fecha del
        // dispositivo lo saltea: el servidor es la única autoridad.
        // Esta línea sirve para revisar si el día pertenece a una rutina que hoy ya está bloqueada.
        if ($routineDay && $this->dailyLock->execute($routineDay->routine)->locked) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el siguiente entrenamiento se desbloquea a las 00:00.
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
        // Esta línea sirve para revisar si la sesión es de un día de rutina.
        if ($routineDay) {
            // Esta línea sirve para buscar una sesión cancelada hoy para ese mismo día.
            $existing = WorkoutSession::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar por el día de rutina.
                ->where('routine_day_id', $routineDay->id)
                // Esta línea sirve para filtrar por la fecha de hoy.
                ->whereDate('performed_at', now())
                // Esta línea sirve para quedarse solo con sesiones canceladas.
                ->whereNotNull('cancelled_at')
                // Esta línea sirve para tomar la más reciente.
                ->latest('id')
                // Esta línea sirve para obtener la primera.
                ->first();

            // Esta línea sirve para revisar si existe esa sesión cancelada.
            if ($existing) {
                // Esta línea sirve para reactivarla quitando la fecha de cancelación.
                $existing->update(['cancelled_at' => null]);

                // Esta línea sirve para devolver la sesión retomada con sus ejercicios.
                return $existing->load('exercises.exercise', 'routineDay');
            }
        }

        // Esta línea sirve para cargar las respuestas del onboarding si faltan.
        $user->loadMissing('onboardingResponse');
        // Esta línea sirve para calcular el ajuste según el precheck y el nivel del usuario.
        $adjustment = $this->readinessAdjuster->adjustmentFor($precheck, $user->onboardingResponse?->level ?? 'intermediate');

        // Esta línea sirve para crear la sesión nueva del usuario.
        $session = $user->workoutSessions()->create([
            // Esta línea sirve para guardar el día de rutina, si hay.
            'routine_day_id' => $routineDay?->id,
            // Esta línea sirve para guardar la fecha de hoy.
            'performed_at' => now()->toDateString(),
            // Esta línea sirve para guardar la calidad de sueño del precheck.
            'sleep_quality' => $precheck['sleep_quality'] ?? null,
            // Esta línea sirve para guardar el nivel de energía del precheck.
            'energy_level' => $precheck['energy_level'] ?? null,
            // Esta línea sirve para guardar el dolor muscular del precheck.
            'muscle_soreness' => $precheck['muscle_soreness'] ?? null,
            // Esta línea sirve para dejarla como no completada.
            'completed' => false,
            // Esta línea sirve para guardar la nota del ajuste aplicado.
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
        // Esta línea sirve para revisar si la sesión es de un día de rutina.
        if ($routineDay) {
            // Esta línea sirve para recorrer cada ejercicio planeado de ese día.
            foreach ($routineDay->exercises as $routineExercise) {
                // Esta línea sirve para ajustar el ejercicio según cómo llega el usuario hoy.
                $adjusted = $this->readinessAdjuster->adjustExercise(
                    // Esta línea sirve para pasar las series objetivo.
                    $routineExercise->target_sets,
                    // Esta línea sirve para pasar las repeticiones sugeridas por serie.
                    $routineExercise->suggested_reps_per_set,
                    // Esta línea sirve para pasar el peso sugerido.
                    $routineExercise->suggested_weight_kg,
                    // Esta línea sirve para pasar el RPE objetivo.
                    $routineExercise->target_rpe,
                    // Esta línea sirve para pasar el ajuste calculado.
                    $adjustment,
                );

                // Esta línea sirve para copiar el ejercicio a la sesión con los valores ajustados.
                $session->exercises()->create([
                    // Esta línea sirve para guardar qué ejercicio del catálogo es.
                    'exercise_id' => $routineExercise->exercise_id,
                    // Esta línea sirve para guardar su posición.
                    'order' => $routineExercise->order,
                    // Esta línea sirve para indicar que aún no completó sus series.
                    'all_sets_completed' => false,
                    // Esta línea sirve para guardar las series objetivo ajustadas.
                    'target_sets' => $adjusted['targetSets'],
                    // Esta línea sirve para guardar las repeticiones objetivo.
                    'target_reps' => $routineExercise->target_reps,
                    // Esta línea sirve para guardar los segundos de descanso.
                    'rest_seconds' => $routineExercise->rest_seconds,
                    // Esta línea sirve para guardar el RPE ajustado.
                    'target_rpe' => $adjusted['rpe'],
                    // Esta línea sirve para guardar el peso sugerido ajustado.
                    'suggested_weight_kg' => $adjusted['weightKg'],
                    // Esta línea sirve para guardar las repeticiones sugeridas ajustadas.
                    'suggested_reps_per_set' => $adjusted['repsPerSet'],
                ]);
            }
        }

        // Esta línea sirve para devolver la sesión con sus ejercicios y su día de rutina.
        return $session->load('exercises.exercise', 'routineDay');
    }
}
