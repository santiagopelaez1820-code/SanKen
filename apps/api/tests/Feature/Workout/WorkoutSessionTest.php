<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Workout.

namespace Tests\Feature\Workout;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo OnboardingResponse.
use App\Models\OnboardingResponse;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineDay.
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo RoutineExercise.
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests WorkoutSessionTest.
class WorkoutSessionTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que crea una rutina activa con un día.
    private function makeActiveRoutineWithOneDay(User $user): RoutineDay
    {
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar 'engine' al campo "source".
            'source' => 'engine',
            // Esta línea sirve para asignar 'gain_muscle' al campo "goal".
            'goal' => 'gain_muscle',
            // Esta línea sirve para asignar 'full_body' al campo "split_type".
            'split_type' => 'full_body',
            // Esta línea sirve para asignar 3 al campo "frequency_days".
            'frequency_days' => 3,
            // Esta línea sirve para asignar 6 al campo "duration_weeks".
            'duration_weeks' => 6,
            // Esta línea sirve para asignar true al campo "is_active".
            'is_active' => true,
        ]);

        // Esta línea sirve para crear el día de la rutina.
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para crear el ejercicio del día.
        RoutineExercise::query()->create([
            // Esta línea sirve para asignar $day->id al campo "routine_day_id".
            'routine_day_id' => $day->id,
            // Esta línea sirve para asignar $exerciseId al campo "exercise_id".
            'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar 1 al campo "order".
            'order' => 1,
            // Esta línea sirve para asignar 3 al campo "target_sets".
            'target_sets' => 3,
            // Esta línea sirve para asignar '8-10' al campo "target_reps".
            'target_reps' => '8-10',
            // Esta línea sirve para asignar 90 al campo "rest_seconds".
            'rest_seconds' => 90,
            // Esta línea sirve para asignar 8.0 al campo "target_rpe".
            'target_rpe' => 8.0,
        ]);

        // Esta línea sirve para devolver el día con sus ejercicios.
        return $day->load('exercises');
    }

    // Esta línea sirve para declarar el test que comprueba que iniciar una sesión desde un día de rutina precarga sus ejercicios.
    public function test_starting_a_session_from_a_routine_day_preloads_its_exercises(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);

        // Esta línea sirve para hacer POST a /api/v1/workout-sessions autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', [
            // Esta línea sirve para asignar $day->id al campo "routine_day_id".
            'routine_day_id' => $day->id,
            // Esta línea sirve para asignar 4 al campo "sleep_quality".
            'sleep_quality' => 4,
            // Esta línea sirve para asignar 3 al campo "energy_level".
            'energy_level' => 3,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.routine_day_id" sea $day->id.
            ->assertJsonPath('data.routine_day_id', $day->id)
            // Esta línea sirve para exigir que "data.exercises" tenga 1 elementos.
            ->assertJsonCount(1, 'data.exercises')
            // Esta línea sirve para exigir que "data.exercises.0.exercise.name" sea 'Press banca con barra'.
            ->assertJsonPath('data.exercises.0.exercise.name', 'Press banca con barra');
    }

    // Esta línea sirve para declarar el test que comprueba que se puede iniciar una sesión libre.
    public function test_starting_a_free_session_without_a_routine_day_works(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/workout-sessions autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', []);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.routine_day_id" sea null.
            ->assertJsonPath('data.routine_day_id', null)
            // Esta línea sirve para exigir que "data.exercises" tenga 0 elementos.
            ->assertJsonCount(0, 'data.exercises');
    }

    // Esta línea sirve para declarar el test que comprueba que un precheck malo recorta los ejercicios según el nivel.
    public function test_a_poor_precheck_trims_the_sessions_exercises_according_to_level(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear las respuestas de onboarding de nivel principiante.
        OnboardingResponse::query()->create(['user_id' => $user->id, 'level' => 'beginner']);
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para fijar la sugerencia del ejercicio.
        $day->exercises->first()->update([
            // Esta línea sirve para asignar 100 al campo "suggested_weight_kg".
            'suggested_weight_kg' => 100,
            // Esta línea sirve para asignar [10, 10, 10] al campo "suggested_reps_per_set".
            'suggested_reps_per_set' => [10, 10, 10],
        ]);

        // Esta línea sirve para hacer POST a /api/v1/workout-sessions autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', [
            // Esta línea sirve para asignar $day->id al campo "routine_day_id".
            'routine_day_id' => $day->id,
            // Esta línea sirve para asignar 1 al campo "sleep_quality".
            'sleep_quality' => 1,
            // Esta línea sirve para asignar 1 al campo "energy_level".
            'energy_level' => 1,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.readiness_adjusted" sea true.
            ->assertJsonPath('data.readiness_adjusted', true)
            // Esta línea sirve para exigir que "data.exercises.0.target_sets" sea 2.
            ->assertJsonPath('data.exercises.0.target_sets', 2)
            // Esta línea sirve para exigir que "data.exercises.0.suggested_reps_per_set" sea [10, 10].
            ->assertJsonPath('data.exercises.0.suggested_reps_per_set', [10, 10])
            // Esta línea sirve para exigir que "data.exercises.0.target_rpe" sea '6.5'.
            ->assertJsonPath('data.exercises.0.target_rpe', '6.5');

        // Esta línea sirve para exigir que el peso sugerido haya bajado a 80.
        $this->assertEquals(80.0, (float) $response->json('data.exercises.0.suggested_weight_kg'));
        // Esta línea sirve para obtener la nota del ajuste.
        $note = $response->json('data.readiness_note');
        // Esta línea sirve para exigir que mencione el poco sueño.
        $this->assertStringContainsString('dormiste poco', $note);
        // Esta línea sirve para exigir que mencione la poca energía.
        $this->assertStringContainsString('tenés poca energía', $note);

        // La rutina de base no se toca — la próxima sesión vuelve a partir de los valores completos.
        // Esta línea sirve para exigir que la rutina original conserve su peso sugerido.
        $this->assertEquals(100.0, (float) $day->exercises->first()->fresh()->suggested_weight_kg);
        // Esta línea sirve para exigir que la rutina original conserve sus series.
        $this->assertSame(3, $day->exercises->first()->fresh()->target_sets);
    }

    // Esta línea sirve para declarar el test que comprueba que un buen precheck deja la sesión sin ajustes.
    public function test_a_good_precheck_leaves_the_session_unadjusted(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear las respuestas de onboarding de nivel principiante.
        OnboardingResponse::query()->create(['user_id' => $user->id, 'level' => 'beginner']);
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para fijar un peso sugerido de 100.
        $day->exercises->first()->update(['suggested_weight_kg' => 100]);

        // Esta línea sirve para hacer POST a /api/v1/workout-sessions autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', [
            // Esta línea sirve para asignar $day->id al campo "routine_day_id".
            'routine_day_id' => $day->id,
            // Esta línea sirve para asignar 5 al campo "sleep_quality".
            'sleep_quality' => 5,
            // Esta línea sirve para asignar 5 al campo "energy_level".
            'energy_level' => 5,
            // Esta línea sirve para asignar 1 al campo "muscle_soreness".
            'muscle_soreness' => 1,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.readiness_adjusted" sea false.
            ->assertJsonPath('data.readiness_adjusted', false)
            // Esta línea sirve para exigir que "data.readiness_note" sea null.
            ->assertJsonPath('data.readiness_note', null)
            // Esta línea sirve para exigir que "data.exercises.0.target_sets" sea 3.
            ->assertJsonPath('data.exercises.0.target_sets', 3);

        // Esta línea sirve para exigir que el peso sugerido siga en 100.
        $this->assertEquals(100.0, (float) $response->json('data.exercises.0.suggested_weight_kg'));
    }

    // Esta línea sirve para declarar el test que comprueba que omitir el precheck deja la sesión sin ajustes.
    public function test_skipping_the_precheck_entirely_leaves_the_session_unadjusted(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);

        // Esta línea sirve para hacer POST a /api/v1/workout-sessions autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', [
            // Esta línea sirve para asignar $day->id al campo "routine_day_id".
            'routine_day_id' => $day->id,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.readiness_adjusted" sea false.
            ->assertJsonPath('data.readiness_adjusted', false)
            // Esta línea sirve para exigir que "data.exercises.0.target_sets" sea 3.
            ->assertJsonPath('data.exercises.0.target_sets', 3);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede iniciar una sesión con el día de rutina de otro.
    public function test_user_cannot_start_a_session_from_another_users_routine_day(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día del dueño.
        $day = $this->makeActiveRoutineWithOneDay($owner);

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/workout-sessions con los datos enviados.
            ->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que se pueden registrar series de un ejercicio en orden.
    public function test_user_can_log_sets_for_an_exercise_in_order(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];

        // Esta línea sirve para registrar la primera serie.
        $set1 = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);
        // Esta línea sirve para registrar la segunda serie.
        $set2 = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 95, 'reps' => 10,
        ]);

        // Esta línea sirve para exigir 201 y que "data.set_number" sea 1.
        $set1->assertCreated()->assertJsonPath('data.set_number', 1);
        // Esta línea sirve para exigir 201 y que "data.set_number" sea 2.
        $set2->assertCreated()->assertJsonPath('data.set_number', 2);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede corregir una serie.
    public function test_user_can_correct_a_logged_set(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie.
        $set = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
            // Esta línea sirve para obtener los datos de la serie.
        ])->json('data');

        // Esta línea sirve para corregir las repeticiones a 8.
        $response = $client->patchJson("/api/v1/workout-sets/{$set['id']}", ['reps' => 8]);

        // Esta línea sirve para exigir 200 y que "data.reps" sea 8.
        $response->assertOk()->assertJsonPath('data.reps', 8);
        // Esta línea sirve para exigir que "data.weight_kg" sea igual a 100.0.
        $this->assertEquals(100.0, $response->json('data.weight_kg'));
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede editar la serie de otro usuario.
    public function test_another_users_set_cannot_be_edited(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día del dueño.
        $day = $this->makeActiveRoutineWithOneDay($owner);
        // Esta línea sirve para guardar el cliente HTTP autenticado como owner.
        $ownerClient = $this->actingAs($owner, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del dueño.
        $session = $ownerClient->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie del dueño.
        $set = $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
            // Esta línea sirve para obtener los datos de la serie.
        ])->json('data');

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para intentar editarla como otro usuario.
            ->patchJson("/api/v1/workout-sets/{$set['id']}", ['reps' => 1])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede agregar un ejercicio extra durante la sesión.
    public function test_user_can_add_an_extra_exercise_mid_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para obtener el id de un ejercicio extra.
        $extraExerciseId = Exercise::query()->where('name', 'Curl de bíceps con mancuernas')->value('id');

        // Esta línea sirve para agregar el ejercicio extra a la sesión.
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            // Esta línea sirve para asignar $extraExerciseId al campo "exercise_id".
            'exercise_id' => $extraExerciseId,
        ]);

        // Esta línea sirve para exigir 201 y que "data.order" sea 2.
        $response->assertCreated()->assertJsonPath('data.order', 2);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede marcar un ejercicio como completado.
    public function test_user_can_mark_an_exercise_as_fully_completed(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];

        // Esta línea sirve para marcar el ejercicio como completado.
        $response = $client->patchJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}", [
            // Esta línea sirve para asignar true al campo "all_sets_completed".
            'all_sets_completed' => true,
        ]);

        // Esta línea sirve para exigir 200 y que "data.all_sets_completed" sea true.
        $response->assertOk()->assertJsonPath('data.all_sets_completed', true);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede completar una sesión.
    public function test_user_can_complete_a_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para completar el entrenamiento con estos datos.
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [
            // Esta línea sirve para asignar 52 al campo "duration_minutes".
            'duration_minutes' => 52,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.completed" sea true.
            ->assertJsonPath('data.completed', true)
            // Esta línea sirve para exigir que "data.duration_minutes" sea 52.
            ->assertJsonPath('data.duration_minutes', 52);
    }

    // Esta línea sirve para declarar el test que comprueba que el próximo día rota tras completar una sesión.
    public function test_next_day_rotates_after_completing_a_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear el día A.
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        // Esta línea sirve para crear el día B.
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que el próximo día sea el A.
        $this->assertSame($dayA->id, $active['meta']['next_day_id']);

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete");

        // Esta línea sirve para pedir la rutina activa otra vez.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que el próximo día sea el B.
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);
    }

    // Esta línea sirve para declarar el test que comprueba que una cuarta serie se rechaza y el ejercicio se completa solo a las tres.
    public function test_a_fourth_set_is_rejected_and_the_exercise_auto_completes_at_three(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];

        // Esta línea sirve para exigir que el objetivo sean 3 series.
        $this->assertSame(3, $session['exercises'][0]['target_sets']);

        // Esta línea sirve para recorrer las tres series.
        foreach ([1, 2, 3] as $setNumber) {
            // Esta línea sirve para registrar una serie.
            $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
                // Esta línea sirve para enviar peso y repeticiones.
                'weight_kg' => 100, 'reps' => 10,
            ]);
            // Esta línea sirve para exigir 201 y que "data.set_number" sea $setNumber.
            $response->assertCreated()->assertJsonPath('data.set_number', $setNumber);
        }

        // Esta línea sirve para exigir que la tabla workout_exercises tenga ese registro.
        $this->assertDatabaseHas('workout_exercises', ['id' => $exerciseId, 'all_sets_completed' => true]);

        // Esta línea sirve para intentar registrar la cuarta serie.
        $fourth = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 422.
        $fourth->assertStatus(422);
        // Esta línea sirve para exigir que "errors.sets.0" sea 'Ya completaste las 3 series de este ejercicio.'.
        $fourth->assertJsonPath('errors.sets.0', 'Ya completaste las 3 series de este ejercicio.');
        // Esta línea sirve para exigir que la tabla workout_sets tenga 3 registros.
        $this->assertDatabaseCount('workout_sets', 3);
    }

    // Esta línea sirve para declarar el test que comprueba que saltar un entrenamiento no crea ejercicios ni series y rota el siguiente día.
    public function test_skipping_a_workout_creates_no_exercises_or_sets_and_still_rotates_the_next_day(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear el día A.
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        // Esta línea sirve para crear el día B.
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        // Esta línea sirve para crear el ejercicio del día A.
        $routineExercise = RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $dayA->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
            // Esta línea sirve para asignar 100 al campo "suggested_weight_kg".
            'suggested_weight_kg' => 100,
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para saltar el día A.
        $response = $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayA->id]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.skipped" sea true.
        $response->assertJsonPath('data.skipped', true);
        // Esta línea sirve para exigir que "data.completed" sea false.
        $response->assertJsonPath('data.completed', false);
        // Esta línea sirve para exigir que la sesión no tenga ejercicios.
        $this->assertSame(0, count($response->json('data.exercises')));

        // Esta línea sirve para obtener el id de la sesión saltada.
        $sessionId = $response->json('data.id');
        // Esta línea sirve para exigir que la tabla workout_exercises tenga 0 registros.
        $this->assertDatabaseCount('workout_exercises', 0);
        // Esta línea sirve para exigir que la tabla workout_sets tenga 0 registros.
        $this->assertDatabaseCount('workout_sets', 0);
        // Esta línea sirve para exigir que la sesión tenga fecha de salto.
        $this->assertNotNull(WorkoutSession::query()->find($sessionId)->skipped_at);

        // No debe tocar la progresión: suggested_weight_kg queda intacto.
        // Esta línea sirve para exigir que el peso sugerido no cambie.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que el próximo día sea el B.
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);
    }

    // Esta línea sirve para declarar el test que comprueba que se puede cancelar una sesión en curso sin marcarla completada.
    public function test_user_can_cancel_an_in_progress_session_without_marking_it_completed(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);

        // Esta línea sirve para cancelar el entrenamiento.
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.cancelled" sea true.
            ->assertJsonPath('data.cancelled', true)
            // Esta línea sirve para exigir que "data.completed" sea false.
            ->assertJsonPath('data.completed', false);

        // Las series ya registradas se conservan, no se borran al cancelar.
        // Esta línea sirve para exigir que la tabla workout_sets tenga 1 registros.
        $this->assertDatabaseCount('workout_sets', 1);
        // Esta línea sirve para exigir que tenga fecha de cancelación.
        $this->assertNotNull(WorkoutSession::query()->find($session['id'])->cancelled_at);
    }

    // Esta línea sirve para declarar el test que comprueba que cancelar no afecta la sobrecarga progresiva.
    public function test_cancelling_a_session_does_not_affect_progressive_overload(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para tomar el ejercicio de la rutina.
        $routineExercise = $day->exercises->first();
        // Esta línea sirve para fijar un peso sugerido de 100.
        $routineExercise->update(['suggested_weight_kg' => 100]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $exerciseId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);

        // Esta línea sirve para cancelar el entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Cancelar nunca pasa por SubmitSessionFeedbackAction: la sugerencia
        // de peso queda exactamente igual que antes de la sesión cancelada.
        // Esta línea sirve para exigir que el peso sugerido siga en 100.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
        // Esta línea sirve para exigir que no haya fallas consecutivas.
        $this->assertEquals(0, $routineExercise->fresh()->consecutive_failures);
    }

    // Esta línea sirve para declarar el test que comprueba que una sesión cancelada no se puede completar después.
    public function test_a_cancelled_session_cannot_later_be_completed(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para cancelarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Esta línea sirve para intentar completarlo.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();

        // Esta línea sirve para exigir que siga sin estar completada.
        $this->assertFalse(WorkoutSession::query()->find($session['id'])->completed);
    }

    // Esta línea sirve para declarar el test que comprueba que una sesión completada no se puede cancelar.
    public function test_a_completed_session_cannot_be_cancelled(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día.
        $day = $this->makeActiveRoutineWithOneDay($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Esta línea sirve para intentar cancelarlo.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();

        // Esta línea sirve para exigir que no tenga fecha de cancelación.
        $this->assertNull(WorkoutSession::query()->find($session['id'])->cancelled_at);
    }

    // Esta línea sirve para declarar el test que comprueba que la sesión de otro usuario no se puede cancelar.
    public function test_another_users_session_cannot_be_cancelled(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear una rutina activa con un día del dueño.
        $day = $this->makeActiveRoutineWithOneDay($owner);

        // Esta línea sirve para preparar la petición autenticada como owner.
        $session = $this->actingAs($owner, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/workout-sessions con los datos enviados.
            ->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para intentar cancelar la sesión como otro usuario.
            ->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }
}
