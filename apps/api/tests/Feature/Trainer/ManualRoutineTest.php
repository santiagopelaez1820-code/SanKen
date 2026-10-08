<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Trainer.

namespace Tests\Feature\Trainer;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
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

// Esta línea sirve para declarar la clase de tests ManualRoutineTest.
class ManualRoutineTest extends TestCase
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
        // test_engine_never_overwrites_a_manually_assigned_routine llama a
        // /routines/generate — sin esto, TemplateRoutineGenerator (motor
        // activo) tira excepcion antes de llegar a la logica que el test
        // realmente quiere probar (que no pisa la rutina del entrenador).
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método auxiliar que arma los datos de una rutina manual.
    private function routinePayload(): array
    {
        // Esta línea sirve para obtener los ids de los dos primeros ejercicios.
        $exerciseIds = Exercise::query()->orderBy('id')->limit(2)->pluck('id');

        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para asignar 'strength' al campo "goal".
            'goal' => 'strength',
            // Esta línea sirve para asignar 'upper_lower' al campo "split_type".
            'split_type' => 'upper_lower',
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
            // Esta línea sirve para asignar 8 al campo "duration_weeks".
            'duration_weeks' => 8,
            // Esta línea sirve para definir los días.
            'days' => [
                [
                    // Esta línea sirve para asignar 1 al campo "day_order".
                    'day_order' => 1,
                    // Esta línea sirve para asignar 'Upper A' al campo "label".
                    'label' => 'Upper A',
                    // Esta línea sirve para asignar ['chest', 'back'] al campo "target_muscle_groups".
                    'target_muscle_groups' => ['chest', 'back'],
                    // Esta línea sirve para definir los ejercicios del día.
                    'exercises' => [
                        [
                            // Esta línea sirve para asignar $exerciseIds[0] al campo "exercise_id".
                            'exercise_id' => $exerciseIds[0],
                            // Esta línea sirve para asignar 1 al campo "order".
                            'order' => 1,
                            // Esta línea sirve para asignar 4 al campo "target_sets".
                            'target_sets' => 4,
                            // Esta línea sirve para asignar '3-6' al campo "target_reps".
                            'target_reps' => '3-6',
                            // Esta línea sirve para asignar 180 al campo "rest_seconds".
                            'rest_seconds' => 180,
                            // Esta línea sirve para asignar 8.5 al campo "target_rpe".
                            'target_rpe' => 8.5,
                        ],
                        [
                            // Esta línea sirve para asignar $exerciseIds[1] al campo "exercise_id".
                            'exercise_id' => $exerciseIds[1],
                            // Esta línea sirve para asignar 2 al campo "order".
                            'order' => 2,
                            // Esta línea sirve para asignar 3 al campo "target_sets".
                            'target_sets' => 3,
                            // Esta línea sirve para asignar '6-8' al campo "target_reps".
                            'target_reps' => '6-8',
                            // Esta línea sirve para asignar 120 al campo "rest_seconds".
                            'rest_seconds' => 120,
                        ],
                    ],
                ],
            ],
        ];
    }

    // Esta línea sirve para declarar el método auxiliar que crea una relación activa entrenador-cliente.
    private function createActiveClient(User $trainer): TrainerClient
    {
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para crear y devolver la relación.
        return TrainerClient::query()->create([
            // Esta línea sirve para asignar $trainer->id al campo "trainer_id".
            'trainer_id' => $trainer->id,
            // Esta línea sirve para asignar $client->id al campo "client_id".
            'client_id' => $client->id,
            // Esta línea sirve para asignar 'active' al campo "status".
            'status' => 'active',
            // Esta línea sirve para asignar now() al campo "started_at".
            'started_at' => now(),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede crear una rutina manual para un cliente activo.
    public function test_trainer_can_create_a_manual_routine_for_an_active_client(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $response = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload());

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.source" sea 'trainer'.
            ->assertJsonPath('data.source', 'trainer')
            // Esta línea sirve para exigir que "data.is_active" sea true.
            ->assertJsonPath('data.is_active', true)
            // Esta línea sirve para exigir que "data.days" tenga 1 elementos.
            ->assertJsonCount(1, 'data.days')
            // Esta línea sirve para exigir que "data.days.0.exercises" tenga 2 elementos.
            ->assertJsonCount(2, 'data.days.0.exercises');

        // Esta línea sirve para exigir que la tabla routines tenga un registro con estos datos.
        $this->assertDatabaseHas('routines', [
            // Esta línea sirve para asignar $trainerClient->client_id al campo "user_id".
            'user_id' => $trainerClient->client_id,
            // Esta línea sirve para asignar $trainer->id al campo "created_by_trainer_id".
            'created_by_trainer_id' => $trainer->id,
            // Esta línea sirve para asignar 'trainer' al campo "source".
            'source' => 'trainer',
            // Esta línea sirve para asignar true al campo "is_active".
            'is_active' => true,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que crear una rutina manual desactiva la anterior del cliente.
    public function test_creating_a_manual_routine_deactivates_the_clients_previous_active_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);

        // Esta línea sirve para crear la rutina activa previa del cliente.
        $previous = Routine::query()->create([
            // Esta línea sirve para asignar $trainerClient->client_id al campo "user_id".
            'user_id' => $trainerClient->client_id,
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

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['id' => $previous->id, 'is_active' => false]);
        // Esta línea sirve para exigir que el cliente tenga una sola rutina activa.
        $this->assertSame(1, Routine::query()->where('user_id', $trainerClient->client_id)->where('is_active', true)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede asignar rutina sin relación activa.
    public function test_trainer_cannot_assign_a_routine_to_a_client_without_an_active_relationship(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para pausar la relación.
        $trainerClient->update(['status' => 'paused']);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'trainer_client'.
            ->assertJsonValidationErrors('trainer_client');
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede asignar rutina al cliente de otro entrenador.
    public function test_trainer_cannot_assign_a_routine_to_another_trainers_client(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa del otro entrenador.
        $trainerClient = $this->createActiveClient($otherTrainer);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede editar su rutina manual.
    public function test_trainer_can_update_their_own_manual_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para preparar la petición autenticada como trainer.
        $routineId = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para obtener el id de la rutina creada.
            ->json('data.id');

        // Esta línea sirve para armar los datos editados.
        $updatedPayload = $this->routinePayload();
        // Esta línea sirve para cambiar la duración a 12 semanas.
        $updatedPayload['duration_weeks'] = 12;
        // Esta línea sirve para cambiar el nombre del primer día.
        $updatedPayload['days'][0]['label'] = 'Upper A (revisada)';

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $response = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/routines/{$routineId} con los datos enviados.
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.duration_weeks" sea 12.
            ->assertJsonPath('data.duration_weeks', 12)
            // Esta línea sirve para exigir que "data.days.0.label" sea 'Upper A (revisada)'.
            ->assertJsonPath('data.days.0.label', 'Upper A (revisada)');
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede editar una rutina creada por otro entrenador.
    public function test_trainer_cannot_update_a_routine_created_by_another_trainer(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa del otro entrenador.
        $trainerClient = $this->createActiveClient($otherTrainer);
        // Esta línea sirve para preparar la petición autenticada como otherTrainer.
        $routineId = $this->actingAs($otherTrainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para obtener el id de la rutina creada.
            ->json('data.id');

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/routines/{$routineId} con los datos enviados.
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede editar una rutina generada por el motor.
    public function test_trainer_cannot_update_an_engine_generated_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para crear una rutina del motor.
        $engineRoutine = Routine::query()->create([
            // Esta línea sirve para asignar $client->id al campo "user_id".
            'user_id' => $client->id,
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

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/routines/{$engineRoutine->id} con los datos enviados.
            ->patchJson("/api/v1/trainer/routines/{$engineRoutine->id}", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el motor nunca reemplaza una rutina asignada manualmente.
    public function test_engine_never_overwrites_a_manually_assigned_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para obtener al cliente.
        $client = $trainerClient->client;
        // Esta línea sirve para crear el perfil del cliente.
        $client->profile()->create(['age' => 30, 'sex' => 'male', 'height_cm' => 180, 'weight_kg' => 80]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $client->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            // Esta línea sirve para asignar la duración, el lugar y el equipamiento.
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell', 'dumbbells'],
            // Esta línea sirve para asignar las lesiones y marcarlo como completo.
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para intentar generar la rutina del motor como el cliente.
        $this->actingAs($client, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que el cliente siga teniendo una sola rutina.
        $this->assertSame(1, Routine::query()->where('user_id', $client->id)->count());
        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $client->id, 'source' => 'trainer', 'is_active' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que asignar una rutina manual invalida la caché de la rutina activa.
    public function test_assigning_a_manual_routine_busts_the_clients_active_routine_cache(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para obtener al cliente.
        $client = $trainerClient->client;

        // Esta línea sirve para crear una rutina del motor para el cliente.
        Routine::query()->create([
            // Esta línea sirve para asignar $client->id al campo "user_id".
            'user_id' => $client->id,
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
        // Esta línea sirve para pedir la rutina activa y exigir que sea del motor.
        $this->actingAs($client, 'sanctum')->getJson('/api/v1/routines/active')->assertOk()->assertJsonPath('data.source', 'engine');

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para preparar la petición autenticada como client.
        $this->actingAs($client, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/routines/active.
            ->getJson('/api/v1/routines/active')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.source" sea 'trainer'.
            ->assertJsonPath('data.source', 'trainer');
    }

    // Esta línea sirve para declarar el test que comprueba que editar una rutina manual invalida la caché de la rutina activa.
    public function test_updating_a_manual_routine_busts_the_clients_active_routine_cache(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para obtener al cliente.
        $client = $trainerClient->client;
        // Esta línea sirve para preparar la petición autenticada como trainer.
        $routineId = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para obtener el id de la rutina creada.
            ->json('data.id');

        // Esta línea sirve para preparar la petición autenticada como client.
        $this->actingAs($client, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/routines/active.
            ->getJson('/api/v1/routines/active')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.days.0.label" sea 'Upper A'.
            ->assertJsonPath('data.days.0.label', 'Upper A');

        // Esta línea sirve para armar los datos editados.
        $updatedPayload = $this->routinePayload();
        // Esta línea sirve para cambiar el nombre del primer día.
        $updatedPayload['days'][0]['label'] = 'Upper A (revisada)';
        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/routines/{$routineId} con los datos enviados.
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload)
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para preparar la petición autenticada como client.
        $this->actingAs($client, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/routines/active.
            ->getJson('/api/v1/routines/active')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.days.0.label" sea 'Upper A (revisada)'.
            ->assertJsonPath('data.days.0.label', 'Upper A (revisada)');
    }
}
