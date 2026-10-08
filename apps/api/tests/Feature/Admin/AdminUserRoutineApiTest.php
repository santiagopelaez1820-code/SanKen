<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo PersonalRecord.
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutExercise.
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
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

// Esta línea sirve para declarar la clase de tests AdminUserRoutineApiTest.
class AdminUserRoutineApiTest extends TestCase
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
        // Necesario para /routines/generate (usado al probar que el motor
        // no pisa una rutina personalizada, y al revertir a la general).
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método auxiliar que arma los datos de una rutina personalizada.
    private function routinePayload(string $label = 'Full A'): array
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
                    // Esta línea sirve para asignar $label al campo "label".
                    'label' => $label,
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

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar rutinas personalizadas.
    public function test_non_admin_cannot_manage_personal_routines(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que asignar una rutina personalizada desactiva la anterior.
    public function test_admin_can_assign_a_personal_routine_and_it_deactivates_the_users_previous_active_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear la rutina activa previa del usuario.
        $previous = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload());

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.source" sea 'admin'.
            ->assertJsonPath('data.source', 'admin')
            // Esta línea sirve para exigir que "data.is_active" sea true.
            ->assertJsonPath('data.is_active', true)
            // Esta línea sirve para exigir que "data.days" tenga 1 elementos.
            ->assertJsonCount(1, 'data.days');

        // Esta línea sirve para exigir que la tabla routines tenga un registro con estos datos.
        $this->assertDatabaseHas('routines', [
            // Esta línea sirve para buscar la rutina del usuario, creada por el admin, de origen admin y activa.
            'user_id' => $target->id, 'created_by_admin_id' => $admin->id, 'source' => 'admin', 'is_active' => true,
        ]);
        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['id' => $previous->id, 'is_active' => false]);
    }

    // Esta línea sirve para declarar el test que comprueba que asignar una rutina no afecta a otros usuarios.
    public function test_assigning_a_personal_routine_does_not_affect_other_users(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $otherUser = User::factory()->create();
        // Esta línea sirve para crear la rutina activa de otro usuario.
        $otherRoutine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $otherUser->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['id' => $otherRoutine->id, 'is_active' => true, 'source' => 'engine']);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve la rutina activa actual de un usuario.
    public function test_admin_can_view_a_users_current_active_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para hacer GET a /api/v1/admin/users/{$target->id}/routine autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$target->id}/routine");

        // Esta línea sirve para exigir 200 y que el origen sea "admin".
        $response->assertOk()->assertJsonPath('data.source', 'admin');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede editar una rutina personalizada reemplazando sus días.
    public function test_admin_can_update_a_personal_routine_replacing_its_days(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para iniciar sesión como admin para las siguientes peticiones.
        $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine sin sesión iniciada.
        $routineId = $this->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())->json('data.id');

        // Esta línea sirve para armar los datos editados.
        $updated = $this->routinePayload('Full A (editada)');
        // Esta línea sirve para hacer PATCH a /api/v1/admin/routines/{$routineId} autenticado como admin con los datos enviados.
        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/routines/{$routineId}", $updated);

        // Esta línea sirve para exigir 200 y que el primer día tenga el nombre nuevo.
        $response->assertOk()->assertJsonPath('data.days.0.label', 'Full A (editada)');
    }

    // Esta línea sirve para declarar el test que comprueba que esta acción no puede editar una rutina no personalizada.
    public function test_cannot_update_a_non_personalized_routine_through_this_action(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear una rutina del motor.
        $engineRoutine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/routines/{$engineRoutine->id} con los datos enviados.
            ->patchJson("/api/v1/admin/routines/{$engineRoutine->id}", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede volver a la rutina general.
    public function test_admin_can_revert_a_personal_routine_to_the_general_template(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $target->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            // Esta línea sirve para asignar la duración, el lugar y el equipamiento.
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            // Esta línea sirve para asignar las lesiones y marcarlo como completo.
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para hacer DELETE a /api/v1/admin/users/{$target->id}/routine autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/users/{$target->id}/routine");

        // Esta línea sirve para exigir 200 y que el origen vuelva a ser "engine".
        $response->assertOk()->assertJsonPath('data.source', 'engine');
        // Esta línea sirve para exigir que el usuario tenga una sola rutina activa.
        $this->assertSame(1, Routine::query()->where('user_id', $target->id)->where('is_active', true)->count());
        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => false]);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede revertir si no tiene rutina personalizada.
    public function test_cannot_revert_when_the_user_has_no_active_personal_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear una rutina del motor.
        Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/admin/users/{$target->id}/routine.
            ->deleteJson("/api/v1/admin/users/{$target->id}/routine")
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede revertir si el usuario no completó el onboarding.
    public function test_cannot_revert_when_the_target_user_never_completed_onboarding(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/admin/users/{$target->id}/routine.
            ->deleteJson("/api/v1/admin/users/{$target->id}/routine")
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que el motor nunca reemplaza una rutina asignada por el admin.
    public function test_engine_never_overwrites_an_admin_assigned_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $target->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            // Esta línea sirve para asignar la duración, el lugar y el equipamiento.
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            // Esta línea sirve para asignar las lesiones y marcarlo como completo.
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para pedir como el usuario que se regenere su rutina.
        $this->actingAs($target, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que el usuario siga teniendo una sola rutina.
        $this->assertSame(1, Routine::query()->where('user_id', $target->id)->count());
        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que asignar, editar y revertir nunca toca el historial de entrenamientos.
    public function test_assigning_editing_and_reverting_a_personal_routine_never_touches_completed_workout_history(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $target->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            // Esta línea sirve para asignar la duración, el lugar y el equipamiento.
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            // Esta línea sirve para asignar las lesiones y marcarlo como completo.
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        // Esta línea sirve para obtener el primer ejercicio.
        $exercise = Exercise::query()->orderBy('id')->first();

        // Esta línea sirve para crear una sesión completada.
        $session = WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, sin día de rutina, con la fecha de hoy.
            'user_id' => $target->id, 'routine_day_id' => null, 'performed_at' => now()->toDateString(),
            // Esta línea sirve para asignar la duración y marcarla completada.
            'duration_minutes' => 45, 'completed' => true,
        ]);
        // Esta línea sirve para crear un ejercicio dentro de la sesión.
        $workoutExercise = WorkoutExercise::query()->create([
            // Esta línea sirve para asignar la sesión, el ejercicio, el orden y las series completadas.
            'workout_session_id' => $session->id, 'exercise_id' => $exercise->id, 'order' => 1, 'all_sets_completed' => true,
        ]);
        // Esta línea sirve para crear una serie del ejercicio.
        $set = $workoutExercise->sets()->create([
            // Esta línea sirve para asignar el número, el peso, las repeticiones, el RPE y marcarla completada.
            'set_number' => 1, 'weight_kg' => 100, 'reps' => 5, 'rpe' => 8, 'completed' => true,
        ]);
        // Esta línea sirve para crear un récord personal a partir de esa serie.
        $pr = PersonalRecord::query()->create([
            // Esta línea sirve para asignar el usuario, el ejercicio y el tipo de récord.
            'user_id' => $target->id, 'exercise_id' => $exercise->id, 'record_type' => '1rm',
            // Esta línea sirve para asignar el valor, la fecha y la serie.
            'value' => 100, 'achieved_at' => now()->toDateString(), 'workout_set_id' => $set->id,
        ]);

        // Esta línea sirve para iniciar sesión como admin para las siguientes peticiones.
        $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine sin sesión iniciada.
        $routineId = $this->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())->json('data.id');
        // Esta línea sirve para editar la rutina y exigir que responda 200.
        $this->patchJson("/api/v1/admin/routines/{$routineId}", $this->routinePayload('Editada'))->assertOk();
        // Esta línea sirve para revertir a la rutina general y exigir que responda 200.
        $this->deleteJson("/api/v1/admin/users/{$target->id}/routine")->assertOk();

        // Esta línea sirve para exigir que la tabla workout_sessions tenga ese registro.
        $this->assertDatabaseHas('workout_sessions', ['id' => $session->id, 'completed' => true]);
        // Esta línea sirve para exigir que la tabla workout_exercises tenga ese registro.
        $this->assertDatabaseHas('workout_exercises', ['id' => $workoutExercise->id, 'exercise_id' => $exercise->id]);
        // Esta línea sirve para exigir que la tabla workout_sets tenga ese registro.
        $this->assertDatabaseHas('workout_sets', ['id' => $set->id, 'weight_kg' => 100, 'reps' => 5]);
        // Esta línea sirve para exigir que la tabla personal_records tenga ese registro.
        $this->assertDatabaseHas('personal_records', ['id' => $pr->id, 'value' => 100]);
    }

    // Esta línea sirve para declarar el test que comprueba que el detalle del usuario muestra el resumen de su rutina actual.
    public function test_admin_user_detail_exposes_current_routine_summary(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/users/{$target->id}/routine con los datos enviados.
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para hacer GET a /api/v1/admin/users/{$target->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$target->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.current_routine.source" sea 'admin'.
            ->assertJsonPath('data.current_routine.source', 'admin')
            // Esta línea sirve para exigir que "data.current_routine.label" sea 'Personalizada'.
            ->assertJsonPath('data.current_routine.label', 'Personalizada');
    }
}
