<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo RoutineTemplate.
use App\Models\RoutineTemplate;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminRoutineTemplateApiTest.
class AdminRoutineTemplateApiTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que obtiene el id de un ejercicio por nombre.
    private function exerciseId(string $name): int
    {
        // Esta línea sirve para buscar el ejercicio por nombre y devolver su id.
        return Exercise::query()->where('name', $name)->value('id');
    }

    // Esta línea sirve para declarar el método auxiliar que arma los datos de una plantilla de prueba.
    private function samplePayload(array $overrides = []): array
    {
        // Esta línea sirve para devolver los datos por defecto mezclados con los recibidos.
        return array_merge([
            // Esta línea sirve para asignar 'Rutina 3 días de prueba' al campo "name".
            'name' => 'Rutina 3 días de prueba',
            // Esta línea sirve para asignar 'male' al campo "sex".
            'sex' => 'male',
            // Esta línea sirve para asignar 3 al campo "frequency_days".
            'frequency_days' => 3,
            // Esta línea sirve para asignar 'intermediate' al campo "level".
            'level' => 'intermediate',
            // Esta línea sirve para asignar 'full_body' al campo "split_type".
            'split_type' => 'full_body',
            // Esta línea sirve para definir los días de la plantilla.
            'days' => [
                [
                    // Esta línea sirve para asignar 1 al campo "day_order".
                    'day_order' => 1,
                    // Esta línea sirve para asignar 'Día 1' al campo "label".
                    'label' => 'Día 1',
                    // Esta línea sirve para definir los ejercicios del día.
                    'exercises' => [
                        [
                            // Esta línea sirve para asignar $this->exerciseId('Press banca con barra') al campo "exercise_id".
                            'exercise_id' => $this->exerciseId('Press banca con barra'),
                            // Esta línea sirve para asignar 1 al campo "order".
                            'order' => 1,
                            // Esta línea sirve para asignar 3 al campo "default_sets".
                            'default_sets' => 3,
                            // Esta línea sirve para asignar '10' al campo "default_reps".
                            'default_reps' => '10',
                            // Esta línea sirve para asignar 90 al campo "rest_seconds".
                            'rest_seconds' => 90,
                        ],
                    ],
                ],
            ],
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar plantillas de rutina.
    public function test_non_admin_cannot_manage_routine_templates(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/routine-templates con los datos enviados.
            ->postJson('/api/v1/admin/routine-templates', $this->samplePayload())
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear una plantilla y empieza inactiva.
    public function test_admin_can_create_a_routine_template_and_it_starts_inactive(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/admin/routine-templates con los datos enviados.
            ->postJson('/api/v1/admin/routine-templates', $this->samplePayload());

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.is_active" sea false.
        $response->assertJsonPath('data.is_active', false);
        // Esta línea sirve para exigir que "data.name" sea 'Rutina 3 días de prueba'.
        $response->assertJsonPath('data.name', 'Rutina 3 días de prueba');
        // Esta línea sirve para exigir que "data.days" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.days');
        // Esta línea sirve para exigir que "data.days.0.exercises" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.days.0.exercises');
        // Esta línea sirve para exigir que la tabla routine_templates tenga ese registro.
        $this->assertDatabaseHas('routine_templates', ['name' => 'Rutina 3 días de prueba', 'is_active' => false]);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede editar una plantilla reemplazando sus días.
    public function test_admin_can_update_a_template_replacing_its_days(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla y guardar sus datos.
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');

        // Esta línea sirve para hacer PATCH a la plantilla con estos datos.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}", [
            // Esta línea sirve para asignar 'Rutina 3 días — editada' al campo "name".
            'name' => 'Rutina 3 días — editada',
            // Esta línea sirve para enviar los días nuevos.
            'days' => [
                [
                    // Esta línea sirve para asignar 1 al campo "day_order".
                    'day_order' => 1,
                    // Esta línea sirve para asignar 'Día 1 editado' al campo "label".
                    'label' => 'Día 1 editado',
                    // Esta línea sirve para enviar los ejercicios del día.
                    'exercises' => [
                        [
                            // Esta línea sirve para asignar $this->exerciseId('Press militar con barra') al campo "exercise_id".
                            'exercise_id' => $this->exerciseId('Press militar con barra'),
                            // Esta línea sirve para asignar 1 al campo "order".
                            'order' => 1,
                            // Esta línea sirve para asignar 4 al campo "default_sets".
                            'default_sets' => 4,
                            // Esta línea sirve para asignar '8' al campo "default_reps".
                            'default_reps' => '8',
                            // Esta línea sirve para asignar 120 al campo "rest_seconds".
                            'rest_seconds' => 120,
                        ],
                    ],
                ],
            ],
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.name" sea 'Rutina 3 días — editada'.
        $response->assertJsonPath('data.name', 'Rutina 3 días — editada');
        // Esta línea sirve para exigir que "data.days.0.label" sea 'Día 1 editado'.
        $response->assertJsonPath('data.days.0.label', 'Día 1 editado');
        // Esta línea sirve para exigir que "data.days.0.exercises.0.default_sets" sea 4.
        $response->assertJsonPath('data.days.0.exercises.0.default_sets', 4);
        // Esta línea sirve para exigir que la tabla routine_template_exercises tenga 1 registros.
        $this->assertDatabaseCount('routine_template_exercises', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que la edición general no puede cambiar si está activa.
    public function test_generic_update_cannot_change_is_active(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla y guardar sus datos.
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');

        // Esta línea sirve para intentar activarla con la edición general.
        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}", ['is_active' => true]);

        // Esta línea sirve para exigir que siga inactiva en la base de datos.
        $this->assertFalse(RoutineTemplate::find($template['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede duplicar una plantilla y la copia queda inactiva.
    public function test_admin_can_duplicate_a_template_and_the_copy_is_inactive(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla y guardar sus datos.
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la plantilla.
        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        // Esta línea sirve para hacer POST para duplicarla.
        $response = $client->postJson("/api/v1/admin/routine-templates/{$template['id']}/duplicate");

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.is_active" sea false.
        $response->assertJsonPath('data.is_active', false);
        // Esta línea sirve para exigir que "data.name" sea 'Rutina 3 días de prueba (copia)'.
        $response->assertJsonPath('data.name', 'Rutina 3 días de prueba (copia)');
        // Esta línea sirve para exigir que "data.days.0.exercises" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.days.0.exercises');
        // Esta línea sirve para exigir que la copia tenga otro id.
        $this->assertNotEquals($template['id'], $response->json('data.id'));
        // El original sigue activo — duplicar no lo toca.
        // Esta línea sirve para exigir que la original siga activa.
        $this->assertTrue(RoutineTemplate::find($template['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que activar una plantilla desactiva a las otras del mismo sexo y frecuencia.
    public function test_activating_a_template_deactivates_siblings_with_the_same_sex_and_frequency(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear la plantilla original.
        $original = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la original.
        $client->patchJson("/api/v1/admin/routine-templates/{$original['id']}/activate");
        // Esta línea sirve para duplicar la original.
        $duplicate = $client->postJson("/api/v1/admin/routine-templates/{$original['id']}/duplicate")->json('data');

        // Esta línea sirve para activar la copia.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$duplicate['id']}/activate");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_active" sea true.
        $response->assertJsonPath('data.is_active', true);
        // Esta línea sirve para exigir que la original quede inactiva.
        $this->assertFalse(RoutineTemplate::find($original['id'])->is_active);
        // Esta línea sirve para comparar exactamente.
        $this->assertSame(
            // Esta línea sirve para esperar una sola.
            1,
            // Esta línea sirve para contar las plantillas activas de hombre con 3 días.
            RoutineTemplate::where('sex', 'male')->where('frequency_days', 3)->where('is_active', true)->count(),
        );
    }

    // Esta línea sirve para declarar el test que comprueba que activar una plantilla no desactiva otra de distinto nivel.
    public function test_activating_a_template_does_not_deactivate_a_sibling_with_a_different_level(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla de nivel intermedio.
        $intermediate = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la de nivel intermedio.
        $client->patchJson("/api/v1/admin/routine-templates/{$intermediate['id']}/activate");
        // Esta línea sirve para crear una plantilla de nivel avanzado.
        $advanced = $client->postJson(
            // Esta línea sirve para indicar la ruta de creación.
            '/api/v1/admin/routine-templates',
            // Esta línea sirve para enviar los datos con nivel avanzado.
            $this->samplePayload(['level' => 'advanced']),
            // Esta línea sirve para guardar los datos de la plantilla creada.
        )->json('data');

        // Esta línea sirve para activar la de nivel avanzado.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$advanced['id']}/activate");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Mismo sexo+frecuencia, nivel distinto: activar uno no debe apagar al otro.
        // Esta línea sirve para exigir que la intermedia siga activa.
        $this->assertTrue(RoutineTemplate::find($intermediate['id'])->is_active);
        // Esta línea sirve para exigir que la avanzada esté activa.
        $this->assertTrue(RoutineTemplate::find($advanced['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede desactivar la única plantilla activa de un sexo y frecuencia.
    public function test_cannot_deactivate_the_only_active_template_for_a_sex_and_frequency(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla.
        $template = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activarla.
        $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        // Esta línea sirve para intentar desactivarla.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$template['id']}/deactivate");

        // Esta línea sirve para exigir que la respuesta sea 422.
        $response->assertStatus(422);
        // Esta línea sirve para exigir que siga activa.
        $this->assertTrue(RoutineTemplate::find($template['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede desactivar la única activa de su nivel aunque haya otra activa de otro nivel.
    public function test_cannot_deactivate_the_only_active_template_for_its_level_even_if_another_level_is_active(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla de nivel intermedio.
        $intermediate = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la de nivel intermedio.
        $client->patchJson("/api/v1/admin/routine-templates/{$intermediate['id']}/activate");
        // Esta línea sirve para crear una plantilla de nivel avanzado.
        $advanced = $client->postJson(
            // Esta línea sirve para indicar la ruta de creación.
            '/api/v1/admin/routine-templates',
            // Esta línea sirve para enviar los datos con nivel avanzado.
            $this->samplePayload(['level' => 'advanced']),
            // Esta línea sirve para guardar los datos de la plantilla creada.
        )->json('data');
        // Esta línea sirve para activar la de nivel avanzado.
        $client->patchJson("/api/v1/admin/routine-templates/{$advanced['id']}/activate");

        // El nivel "advanced" activo para el mismo sexo+frecuencia NO cuenta
        // como reemplazo del "intermediate" — son combos distintos.
        // Esta línea sirve para intentar desactivar la de nivel intermedio.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$intermediate['id']}/deactivate");

        // Esta línea sirve para exigir que la respuesta sea 422.
        $response->assertStatus(422);
        // Esta línea sirve para exigir que la intermedia siga activa.
        $this->assertTrue(RoutineTemplate::find($intermediate['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que se puede desactivar si queda otra activa del mismo sexo y frecuencia.
    public function test_can_deactivate_when_another_template_is_still_active_for_that_sex_and_frequency(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear la primera plantilla.
        $first = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la primera.
        $client->patchJson("/api/v1/admin/routine-templates/{$first['id']}/activate");
        // Esta línea sirve para crear la segunda plantilla.
        $second = $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la segunda (desactiva la primera).
        $client->patchJson("/api/v1/admin/routine-templates/{$second['id']}/activate");
        // Activar $second desactivó a $first — reactivamos $first para que ambos coexistan
        // momentáneamente y probar el guard de "no sos la única activa".
        // Esta línea sirve para volver a marcar la primera como activa directamente en la base de datos.
        RoutineTemplate::find($first['id'])->update(['is_active' => true]);

        // Esta línea sirve para desactivar la primera.
        $response = $client->patchJson("/api/v1/admin/routine-templates/{$first['id']}/deactivate");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la primera quede inactiva.
        $this->assertFalse(RoutineTemplate::find($first['id'])->is_active);
        // Esta línea sirve para exigir que la segunda siga activa.
        $this->assertTrue(RoutineTemplate::find($second['id'])->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que el listado incluye las plantillas inactivas.
    public function test_index_includes_inactive_templates(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para crear una plantilla (queda inactiva).
        $client->postJson('/api/v1/admin/routine-templates', $this->samplePayload());

        // Esta línea sirve para hacer GET al listado de plantillas.
        $response = $client->getJson('/api/v1/admin/routine-templates');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
        // Esta línea sirve para exigir que "data.0.is_active" sea falso.
        $this->assertFalse($response->json('data.0.is_active'));
    }

    // Esta línea sirve para declarar el test que comprueba que activar una plantilla nueva habilita su frecuencia en el onboarding.
    public function test_activating_a_new_template_makes_its_frequency_available_in_onboarding_questions(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $regular = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/onboarding/questions autenticado como regular.
        $before = $this->actingAs($regular, 'sanctum')->getJson('/api/v1/onboarding/questions');
        // Esta línea sirve para exigir que la frecuencia 3 todavía no aparezca.
        $this->assertNotContains(3, $before->json('data.frequency_days'));

        // Esta línea sirve para iniciar sesión como admin para las siguientes peticiones.
        $this->actingAs($admin, 'sanctum');
        // Esta línea sirve para hacer POST a /api/v1/admin/routine-templates sin sesión iniciada.
        $template = $this->postJson('/api/v1/admin/routine-templates', $this->samplePayload())->json('data');
        // Esta línea sirve para activar la plantilla.
        $this->patchJson("/api/v1/admin/routine-templates/{$template['id']}/activate");

        // Esta línea sirve para hacer GET a /api/v1/onboarding/questions autenticado como regular.
        $after = $this->actingAs($regular, 'sanctum')->getJson('/api/v1/onboarding/questions');
        // Esta línea sirve para exigir que ahora sí aparezca la frecuencia 3.
        $this->assertContains(3, $after->json('data.frequency_days'));
    }
}
