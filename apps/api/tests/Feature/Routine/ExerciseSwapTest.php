<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Routine.

namespace Tests\Feature\Routine;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo PersonalRecord.
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineExercise.
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar la clase RoutineTemplateSeeder.
use Database\Seeders\RoutineTemplateSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Swap A/B — a nivel de plantilla de rutina (RoutineController::swapExercise)
 * y a nivel de sesion en curso (WorkoutSessionController::swapExercise).
 * Ver seccion 17/34 del pedido: no debe romper historial ni sobrecarga
 * progresiva (ProgressiveOverloadCalculator / DetectPersonalRecordAction).
 */
// Esta línea sirve para declarar la clase de tests ExerciseSwapTest.
class ExerciseSwapTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que siembra el catálogo.
    private function seedCatalog(): void
    {
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que crea un usuario listo para generar rutina.
    private function readyUser(string $level = 'intermediate'): User
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $user->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => $level, 'goals' => ['gain_muscle'], 'frequency_days' => 3,
            // Esta línea sirve para marcarlas como completas.
            'completed' => true, 'completed_at' => now(),
        ]);

        // Esta línea sirve para devolver el usuario.
        return $user;
    }

    // Esta línea sirve para declarar el test que comprueba que cambiar un ejercicio lo reemplaza por su alternativa y se puede volver.
    public function test_swapping_a_routine_exercise_replaces_it_with_its_alternative_and_back(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario listo.
        $user = $this->readyUser();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para generar la rutina.
        $routine = $client->postJson('/api/v1/routines/generate')->json('data');
        // No se fija un ejercicio puntual por índice/nombre: RoutineVolumeCalculator
        // recorta cuántos ejercicios trae cada día según nivel/objetivo/tiempo,
        // así que cuál cae en qué posición ya no es estable. Cualquiera con
        // alternativa sirve para probar el round-trip.
        // Esta línea sirve para buscar un ejercicio del día con alternativa.
        $routineExercise = collect($routine['days'][0]['exercises'])->first(fn ($ex) => $ex['alternative'] !== null);
        // Esta línea sirve para exigir que exista.
        $this->assertNotNull($routineExercise, 'fixture assumption: al menos un ejercicio del día con alternativa');
        // Esta línea sirve para guardar el nombre del ejercicio original.
        $original = $routineExercise['exercise']['name'];
        // Esta línea sirve para guardar el nombre de la alternativa.
        $alternative = $routineExercise['alternative']['name'];

        // Esta línea sirve para cambiar el ejercicio por su alternativa.
        $swapped = $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para obtener los datos del ejercicio cambiado.
            ->json('data');
        // Esta línea sirve para exigir que ahora sea la alternativa.
        $this->assertSame($alternative, $swapped['exercise']['name']);
        // Esta línea sirve para exigir que la alternativa sea el original.
        $this->assertSame($original, $swapped['alternative']['name']);

        // Esta línea sirve para cambiarlo otra vez.
        $back = $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para obtener los datos del ejercicio.
            ->json('data');
        // Esta línea sirve para exigir que haya vuelto al original.
        $this->assertSame($original, $back['exercise']['name']);

        // No se creo una rutina nueva.
        // Esta línea sirve para exigir que el usuario siga teniendo una sola rutina.
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que cambiar un ejercicio sin alternativa falla con claridad.
    public function test_swapping_an_exercise_without_an_alternative_fails_clearly(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario listo.
        $user = $this->readyUser();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Se arma el fixture a mano en vez de confiar en qué ejercicio del
        // catálogo generado queda sin alternativa: exercise_alternatives es
        // una relación global (no por plantilla), así que un ejercicio sin
        // pareja EN un bloque puntual puede terminar con una de todos modos
        // por aparecer emparejado en otro bloque/nivel -- y además
        // RoutineVolumeCalculator recorta cuántos ejercicios trae cada día,
        // corriendo el riesgo de dejar ese candidato afuera. Elegir acá
        // mismo un Exercise sin ninguna alternativa vincula la prueba a la
        // regla real (RoutineController::swapExercise) sin depender de cómo
        // esté armado el contenido de las plantillas.
        // Esta línea sirve para crear una rutina del motor.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 1, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear un día de la rutina.
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Día único', 'target_muscle_groups' => []]);
        // Esta línea sirve para buscar un ejercicio sin alternativa.
        $exerciseWithoutAlt = Exercise::query()->whereDoesntHave('alternatives')->firstOrFail();
        // Esta línea sirve para crear el ejercicio del día con ese ejercicio.
        $routineExercise = RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseWithoutAlt->id, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-12', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        // Esta línea sirve para intentar cambiar el ejercicio.
        $client->postJson("/api/v1/routines/{$routine->id}/exercises/{$routineExercise->id}/swap")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'exercise'.
            ->assertJsonValidationErrors('exercise');
    }

    // Esta línea sirve para declarar el test que comprueba que otro usuario no puede cambiar ejercicios de una rutina ajena.
    public function test_another_user_cannot_swap_exercises_on_someone_elses_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear al dueño listo.
        $owner = $this->readyUser();
        // Esta línea sirve para generar la rutina del dueño.
        $routine = $this->actingAs($owner, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');
        // Esta línea sirve para tomar el primer ejercicio del primer día.
        $routineExercise = $routine['days'][0]['exercises'][0];

        // Esta línea sirve para crear a un intruso listo.
        $intruder = $this->readyUser();
        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para intentar cambiar el ejercicio como el intruso.
            ->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que cambiar el ejercicio de la sesión activa no toca las series.
    public function test_swapping_the_active_session_exercise_updates_it_without_touching_workout_sets(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario listo.
        $user = $this->readyUser();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para generar la rutina.
        $client->postJson('/api/v1/routines/generate');

        // Esta línea sirve para obtener el id del primer día.
        $routineDayId = $client->getJson('/api/v1/routines/active')->json('data.days.0.id');
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $routineDayId])->json('data');
        // Esta línea sirve para tomar el primer ejercicio de la sesión.
        $workoutExercise = $session['exercises'][0];

        // Esta línea sirve para cambiar el ejercicio por su alternativa.
        $swapped = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/swap")
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para obtener los datos del ejercicio cambiado.
            ->json('data');
        // Esta línea sirve para exigir que el nombre sea distinto.
        $this->assertNotSame($workoutExercise['exercise']['name'], $swapped['exercise']['name']);

        // Esta línea sirve para registrar una serie en el ejercicio.
        $client->postJson(
            // Esta línea sirve para indicar la ruta de las series.
            "/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets",
            // Esta línea sirve para enviar peso y repeticiones.
            ['weight_kg' => 50, 'reps' => 10],
            // Esta línea sirve para cerrar los datos y exigir 201.
        )->assertCreated();

        // Con una serie ya registrada, el swap queda bloqueado para no
        // corromper retroactivamente el historial de ese slot.
        // Esta línea sirve para intentar cambiarlo otra vez.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/swap")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();

        // Esta línea sirve para exigir que la tabla workout_sets tenga ese registro.
        $this->assertDatabaseHas('workout_sets', ['weight_kg' => 50, 'reps' => 10]);
    }

    // Esta línea sirve para declarar el test que comprueba que cambiar un ejercicio no altera los récords personales.
    public function test_swapping_a_routine_exercise_does_not_alter_existing_personal_records(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario listo.
        $user = $this->readyUser();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para generar la rutina.
        $routine = $client->postJson('/api/v1/routines/generate')->json('data');

        // Esta línea sirve para obtener el id del primer día.
        $routineDayId = $routine['days'][0]['id'];
        // Esta línea sirve para obtener el id del primer ejercicio.
        $exerciseId = $routine['days'][0]['exercises'][0]['exercise']['id'];
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $routineDayId])->json('data');
        // Esta línea sirve para tomar el primer ejercicio de la sesión.
        $workoutExercise = $session['exercises'][0];

        // Esta línea sirve para registrar una serie en el ejercicio.
        $client->postJson(
            // Esta línea sirve para indicar la ruta de las series.
            "/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets",
            // Esta línea sirve para enviar peso y repeticiones.
            ['weight_kg' => 60, 'reps' => 8],
            // Esta línea sirve para cerrar los datos y exigir 201.
        )->assertCreated();

        // Esta línea sirve para guardar el récord personal actual.
        $recordBefore = PersonalRecord::query()->where('user_id', $user->id)->where('exercise_id', $exerciseId)->first();
        // Esta línea sirve para exigir que exista.
        $this->assertNotNull($recordBefore, 'el primer set en un ejercicio nuevo deberia registrar un PR');

        // Swap de un ejercicio DISTINTO en el mismo dia — no debe tocar el PR ya generado.
        // Esta línea sirve para buscar otro ejercicio del día con alternativa.
        $otherRoutineExercise = collect($routine['days'][0]['exercises'])
            // Esta línea sirve para filtrar los distintos al ejercicio ya registrado.
            ->first(fn ($ex) => $ex['exercise']['id'] !== $exerciseId && $ex['alternative'] !== null);
        // Esta línea sirve para revisar si existe.
        if ($otherRoutineExercise) {
            // Esta línea sirve para cambiarlo por su alternativa y exigir 200.
            $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$otherRoutineExercise['id']}/swap")->assertOk();
        }

        // Esta línea sirve para guardar el récord personal después del cambio.
        $recordAfter = PersonalRecord::query()->where('user_id', $user->id)->where('exercise_id', $exerciseId)->first();
        // Esta línea sirve para exigir que "id" sea exactamente $recordBefore->id.
        $this->assertSame($recordBefore->id, $recordAfter->id);
        // Esta línea sirve para exigir que el valor del récord no haya cambiado.
        $this->assertEquals($recordBefore->value, $recordAfter->value);
    }
}
