<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar la acción GenerateChallengesAction.
use App\Application\Challenges\Actions\GenerateChallengesAction;
// Esta línea sirve para importar el modelo ChallengeTemplate.
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminChallengeTemplateApiTest.
class AdminChallengeTemplateApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea una plantilla de reto.
    private function makeTemplate(array $overrides = []): ChallengeTemplate
    {
        // Esta línea sirve para crear la plantilla mezclando los datos por defecto con los recibidos.
        return ChallengeTemplate::query()->create(array_merge([
            // Esta línea sirve para asignar el código y el título por defecto.
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal',
            // Esta línea sirve para asignar 'Completa 5 entrenamientos esta semana.' al campo "description".
            'description' => 'Completa 5 entrenamientos esta semana.',
            // Esta línea sirve para asignar el tipo, la métrica y la meta por defecto.
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 5,
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides));
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar plantillas de retos.
    public function test_non_admin_cannot_manage_challenge_templates(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/challenge-templates como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/challenge-templates')->assertForbidden();
        // Esta línea sirve para hacer la petición a /api/v1/admin/challenge-templates como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [])->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve todas las plantillas, incluso las inactivas.
    public function test_admin_can_list_all_templates_including_inactive_ones(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una plantilla activa.
        $this->makeTemplate(['code' => 'a', 'is_active' => true]);
        // Esta línea sirve para crear una plantilla inactiva.
        $this->makeTemplate(['code' => 'b', 'is_active' => false]);

        // Esta línea sirve para hacer GET a /api/v1/admin/challenge-templates autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/challenge-templates');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 2 elementos.
        $response->assertJsonCount(2, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear una plantilla.
    public function test_admin_can_create_a_template(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para hacer POST a /api/v1/admin/challenge-templates autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            // Esta línea sirve para enviar el código, el título y la descripción.
            'code' => 'weekly_new_pr', 'title' => 'Nuevo PR', 'description' => 'Consigue un PR esta semana.',
            // Esta línea sirve para enviar el tipo, la métrica y la meta.
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.code" sea 'weekly_new_pr'.
        $response->assertJsonPath('data.code', 'weekly_new_pr');
        // Esta línea sirve para exigir que "data.is_active" sea true.
        $response->assertJsonPath('data.is_active', true);
        // Esta línea sirve para exigir que la tabla challenge_templates tenga ese registro.
        $this->assertDatabaseHas('challenge_templates', ['code' => 'weekly_new_pr']);
    }

    // Esta línea sirve para declarar el test que comprueba que el código debe ser único.
    public function test_code_must_be_unique(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una plantilla con ese código.
        $this->makeTemplate(['code' => 'weekly_5_sessions']);

        // Esta línea sirve para hacer la petición a /api/v1/admin/challenge-templates como admin con estos datos.
        $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            // Esta línea sirve para enviar un código repetido, un título y una descripción.
            'code' => 'weekly_5_sessions', 'title' => 'Otra', 'description' => 'x',
            // Esta línea sirve para enviar el tipo, la métrica y la meta.
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 422 (datos inválidos).
        ])->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que la métrica debe ser un valor conocido.
    public function test_metric_must_be_a_known_value(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para hacer la petición a /api/v1/admin/challenge-templates como admin con estos datos.
        $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/challenge-templates', [
            // Esta línea sirve para enviar el código, el título y la descripción.
            'code' => 'weekly_made_up', 'title' => 'x', 'description' => 'x',
            // Esta línea sirve para enviar una métrica que no existe.
            'type' => 'weekly', 'metric' => 'made_up_metric', 'target' => 1,
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 422 (datos inválidos).
        ])->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede editar una plantilla.
    public function test_admin_can_update_a_template(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una plantilla.
        $template = $this->makeTemplate();

        // Esta línea sirve para hacer PATCH a /api/v1/admin/challenge-templates/{$template->id} autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/challenge-templates/{$template->id}", [
            // Esta línea sirve para asignar 10 al campo "target".
            'target' => 10,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.target" sea '10.00'.
        $response->assertJsonPath('data.target', '10.00');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede activar y desactivar una plantilla.
    public function test_admin_can_activate_and_deactivate_a_template(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una plantilla activa.
        $template = $this->makeTemplate(['is_active' => true]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');

        // Esta línea sirve para hacer PATCH para desactivarla.
        $client->patchJson("/api/v1/admin/challenge-templates/{$template->id}/deactivate")
            // Esta línea sirve para exigir que "data.is_active" sea false.
            ->assertJsonPath('data.is_active', false);
        // Esta línea sirve para exigir que en la base de datos quede inactiva.
        $this->assertFalse($template->fresh()->is_active);

        // Esta línea sirve para hacer PATCH para activarla.
        $client->patchJson("/api/v1/admin/challenge-templates/{$template->id}/activate")
            // Esta línea sirve para exigir que "data.is_active" sea true.
            ->assertJsonPath('data.is_active', true);
        // Esta línea sirve para exigir que en la base de datos quede activa.
        $this->assertTrue($template->fresh()->is_active);
    }

    // Esta línea sirve para declarar el test que comprueba que desactivar una plantilla no borra los retos ya generados.
    public function test_deactivating_a_template_does_not_delete_challenges_already_generated_from_it(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una plantilla.
        $template = $this->makeTemplate();

        // Esta línea sirve para generar los retos en el momento.
        GenerateChallengesAction::dispatchSync();
        // Esta línea sirve para exigir que la tabla challenges tenga ese registro.
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/challenge-templates/{$template->id}/deactivate.
            ->patchJson("/api/v1/admin/challenge-templates/{$template->id}/deactivate")
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();

        // Esta línea sirve para exigir que la tabla challenges tenga ese registro.
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);
    }
}
