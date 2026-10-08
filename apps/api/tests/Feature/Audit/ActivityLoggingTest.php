<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Audit.

namespace Tests\Feature\Audit;

// Esta línea sirve para importar la clase RecoveryCodeService.
use App\Domain\Auth\Services\RecoveryCodeService;
// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutExercise.
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar el modelo WorkoutSet.
use App\Models\WorkoutSet;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Google2FA.
use PragmaRX\Google2FA\Google2FA;
// Esta línea sirve para importar la clase Activity.
use Spatie\Activitylog\Models\Activity;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ActivityLoggingTest.
class ActivityLoggingTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que crea un usuario con verificación en dos pasos.
    private function makeTwoFactorUser(): User
    {
        // Esta línea sirve para crear un usuario con la contraseña Password!234.
        $user = User::factory()->create(['password' => 'Password!234']);
        // Esta línea sirve para generar un secreto de verificación en dos pasos.
        $secret = (new Google2FA)->generateSecretKey();
        // Esta línea sirve para crear el servicio de códigos de recuperación.
        $recoveryCodes = new RecoveryCodeService;

        // Esta línea sirve para guardar en el usuario los datos de la verificación en dos pasos.
        $user->forceFill([
            // Esta línea sirve para asignar true al campo "two_factor_enabled".
            'two_factor_enabled' => true,
            // Esta línea sirve para asignar $secret al campo "two_factor_secret".
            'two_factor_secret' => $secret,
            // Esta línea sirve para guardar los códigos de recuperación hasheados.
            'two_factor_recovery_codes' => array_map(
                // Esta línea sirve para hashear cada código.
                fn (string $code) => $recoveryCodes->hash($code),
                // Esta línea sirve para generar los códigos de recuperación.
                $recoveryCodes->generate(),
            ),
            // Esta línea sirve para guardar y cerrar los datos.
        ])->save();

        // Esta línea sirve para devolver el usuario recargado.
        return $user->refresh();
    }

    // Esta línea sirve para declarar el test que comprueba que cambiar el estado de un cliente escribe un registro de auditoría.
    public function test_trainer_client_status_change_writes_an_activity_log_entry(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa con el cliente.
        $trainerClient = $this->createActiveClient($trainer);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/clients/{$trainerClient->id} con los datos enviados.
            ->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que la tabla activity_log tenga un registro con estos datos.
        $this->assertDatabaseHas('activity_log', [
            // Esta línea sirve para asignar 'trainer_client' al campo "log_name".
            'log_name' => 'trainer_client',
            // Esta línea sirve para asignar 'updated' al campo "event".
            'event' => 'updated',
            // Esta línea sirve para asignar TrainerClient::class al campo "subject_type".
            'subject_type' => TrainerClient::class,
            // Esta línea sirve para asignar $trainerClient->id al campo "subject_id".
            'subject_id' => $trainerClient->id,
            // Esta línea sirve para asignar User::class al campo "causer_type".
            'causer_type' => User::class,
            // Esta línea sirve para asignar $trainer->id al campo "causer_id".
            'causer_id' => $trainer->id,
        ]);

        // Esta línea sirve para consultar los registros de auditoría.
        $activity = Activity::query()
            // Esta línea sirve para filtrar por subject_id.
            ->where('subject_id', $trainerClient->id)
            // Esta línea sirve para filtrar por event.
            ->where('event', 'updated')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->latest('id')
            // Esta línea sirve para obtener el primero.
            ->first();
        // Esta línea sirve para exigir que el nuevo estado registrado sea "ended".
        $this->assertSame('ended', $activity->properties['attributes']['status']);
        // Esta línea sirve para exigir que el estado anterior registrado sea "active".
        $this->assertSame('active', $activity->properties['old']['status']);
    }

    // Esta línea sirve para declarar el test que comprueba que crear una rutina manual escribe un registro de auditoría.
    public function test_creating_a_manual_routine_writes_an_activity_log_entry(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa con el cliente.
        $trainerClient = $this->createActiveClient($trainer);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para exigir que la tabla activity_log tenga un registro con estos datos.
        $this->assertDatabaseHas('activity_log', [
            // Esta línea sirve para asignar 'routine' al campo "log_name".
            'log_name' => 'routine',
            // Esta línea sirve para asignar 'created' al campo "event".
            'event' => 'created',
            // Esta línea sirve para asignar User::class al campo "causer_type".
            'causer_type' => User::class,
            // Esta línea sirve para asignar $trainer->id al campo "causer_id".
            'causer_id' => $trainer->id,
        ]);

        // Esta línea sirve para buscar el último registro de auditoría de creación de la rutina.
        $activity = Activity::query()->where('log_name', 'routine')->where('event', 'created')->latest('id')->first();
        // Esta línea sirve para exigir que el origen registrado sea "trainer".
        $this->assertSame('trainer', $activity->properties['attributes']['source']);
    }

    // Esta línea sirve para declarar el test que comprueba que editar una rutina manual audita solo los campos principales.
    public function test_updating_a_manual_routine_writes_an_activity_log_entry_for_top_level_fields_only(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una relación activa con el cliente.
        $trainerClient = $this->createActiveClient($trainer);
        // Esta línea sirve para preparar la petición autenticada como trainer.
        $routineId = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients/{$trainerClient->id}/routines con los datos enviados.
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            // Esta línea sirve para obtener el id de la rutina creada.
            ->json('data.id');

        // Esta línea sirve para armar los datos de la rutina.
        $updatedPayload = $this->routinePayload();
        // Esta línea sirve para cambiar la duración a 12 semanas.
        $updatedPayload['duration_weeks'] = 12;

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/routines/{$routineId} con los datos enviados.
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload)
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para consultar los registros de auditoría.
        $activity = Activity::query()
            // Esta línea sirve para filtrar por log_name.
            ->where('log_name', 'routine')
            // Esta línea sirve para filtrar por event.
            ->where('event', 'updated')
            // Esta línea sirve para filtrar por subject_id.
            ->where('subject_id', $routineId)
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->latest('id')
            // Esta línea sirve para obtener el primero.
            ->first();

        // Esta línea sirve para exigir que activity exista (no sea null).
        $this->assertNotNull($activity);
        // Esta línea sirve para exigir que la duración registrada sea 12.
        $this->assertSame(12, $activity->properties['attributes']['duration_weeks']);
    }

    // Esta línea sirve para declarar el test que comprueba que iniciar la activación en dos pasos no escribe auditoría.
    public function test_enabling_two_factor_alone_does_not_write_an_activity_log_row(): void
    {
        // refresh() so the in-memory model is fully hydrated (incl. DB-default columns like
        // role/is_banned/two_factor_enabled), matching a real authenticated request where the
        // user is always loaded fresh from the DB by the auth guard.
        // Esta línea sirve para crear un usuario y recargarlo.
        $user = User::factory()->create()->refresh();

        // Esta línea sirve para hacer la petición a /api/v1/auth/2fa/enable como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/enable')->assertOk();

        // The factory's own "created" row is expected (role/is_banned/two_factor_enabled are
        // always present on creation); what must NOT happen is an "updated" row from touching
        // only the untracked two_factor_secret column.
        // Esta línea sirve para exigir que la tabla activity_log no tenga ese registro.
        $this->assertDatabaseMissing('activity_log', [
            // Esta línea sirve para asignar User::class al campo "subject_type".
            'subject_type' => User::class,
            // Esta línea sirve para asignar $user->id al campo "subject_id".
            'subject_id' => $user->id,
            // Esta línea sirve para asignar 'updated' al campo "event".
            'event' => 'updated',
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que confirmar la verificación en dos pasos audita sin filtrar secretos.
    public function test_confirming_two_factor_writes_an_activity_log_entry_without_leaking_secrets(): void
    {
        // Esta línea sirve para crear un usuario y recargarlo.
        $user = User::factory()->create()->refresh();
        // Esta línea sirve para generar un secreto de verificación en dos pasos.
        $secret = (new Google2FA)->generateSecretKey();
        // Esta línea sirve para guardar el secreto en el usuario.
        $user->forceFill(['two_factor_secret' => $secret])->save();
        // Esta línea sirve para calcular el código vigente.
        $code = (new Google2FA)->getCurrentOtp($secret);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/2fa/confirm con los datos enviados.
            ->postJson('/api/v1/auth/2fa/confirm', ['code' => $code])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para consultar los registros de auditoría.
        $activity = Activity::query()
            // Esta línea sirve para filtrar por subject_type.
            ->where('subject_type', User::class)
            // Esta línea sirve para filtrar por subject_id.
            ->where('subject_id', $user->id)
            // Esta línea sirve para filtrar por event.
            ->where('event', 'updated')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->latest('id')
            // Esta línea sirve para obtener el primero.
            ->first();

        // Esta línea sirve para exigir que activity exista (no sea null).
        $this->assertNotNull($activity);
        // Esta línea sirve para exigir que solo se registre el campo "two_factor_enabled".
        $this->assertSame(['two_factor_enabled'], array_keys($activity->properties['attributes']));
        // Esta línea sirve para exigir que la auditoría no guarde "two_factor_secret".
        $this->assertArrayNotHasKey('two_factor_secret', $activity->properties['attributes']);
        // Esta línea sirve para exigir que la auditoría no guarde "two_factor_recovery_codes".
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $activity->properties['attributes']);
    }

    // Esta línea sirve para declarar el test que comprueba que desactivar la verificación en dos pasos escribe un registro de auditoría.
    public function test_disabling_two_factor_writes_an_activity_log_entry(): void
    {
        // Esta línea sirve para crear un usuario con verificación en dos pasos.
        $user = $this->makeTwoFactorUser();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/auth/2fa/disable con los datos enviados.
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'Password!234'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para consultar los registros de auditoría.
        $activity = Activity::query()
            // Esta línea sirve para filtrar por subject_type.
            ->where('subject_type', User::class)
            // Esta línea sirve para filtrar por subject_id.
            ->where('subject_id', $user->id)
            // Esta línea sirve para filtrar por event.
            ->where('event', 'updated')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->latest('id')
            // Esta línea sirve para obtener el primero.
            ->first();

        // Esta línea sirve para exigir que activity exista (no sea null).
        $this->assertNotNull($activity);
        // Esta línea sirve para exigir que el registro diga que quedó desactivada.
        $this->assertFalse($activity->properties['attributes']['two_factor_enabled']);
        // Esta línea sirve para exigir que la auditoría no guarde "two_factor_secret".
        $this->assertArrayNotHasKey('two_factor_secret', $activity->properties['attributes']);
        // Esta línea sirve para exigir que la auditoría no guarde "two_factor_recovery_codes".
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $activity->properties['attributes']);
    }

    // Esta línea sirve para declarar el test que comprueba que la actividad de entrenamiento no se audita.
    public function test_workout_activity_is_not_audited(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear una sesión de entrenamiento.
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);
        // Esta línea sirve para crear un ejercicio de la sesión.
        $workoutExercise = WorkoutExercise::query()->create([
            // Esta línea sirve para asignar $session->id al campo "workout_session_id".
            'workout_session_id' => $session->id,
            // Esta línea sirve para asignar $exerciseId al campo "exercise_id".
            'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar 1 al campo "order".
            'order' => 1,
        ]);
        // Esta línea sirve para crear una serie.
        WorkoutSet::query()->create([
            // Esta línea sirve para asignar $workoutExercise->id al campo "workout_exercise_id".
            'workout_exercise_id' => $workoutExercise->id,
            // Esta línea sirve para asignar 1 al campo "set_number".
            'set_number' => 1,
            // Esta línea sirve para asignar 60 al campo "weight_kg".
            'weight_kg' => 60,
            // Esta línea sirve para asignar 8 al campo "reps".
            'reps' => 8,
            // Esta línea sirve para asignar false al campo "is_warmup".
            'is_warmup' => false,
            // Esta línea sirve para asignar true al campo "completed".
            'completed' => true,
        ]);

        // Esta línea sirve para exigir que la tabla activity_log no tenga ese registro.
        $this->assertDatabaseMissing('activity_log', ['subject_type' => WorkoutSet::class]);
        // Esta línea sirve para exigir que la tabla activity_log no tenga ese registro.
        $this->assertDatabaseMissing('activity_log', ['subject_type' => WorkoutSession::class]);
    }
}
