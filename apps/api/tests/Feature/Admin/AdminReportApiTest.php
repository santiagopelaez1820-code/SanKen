<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Report.
use App\Models\Report;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminReportApiTest.
class AdminReportApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un reporte.
    private function makeReport(User $reporter, string $status = 'pending'): Report
    {
        // Esta línea sirve para crear y devolver el reporte.
        return Report::query()->create([
            // Esta línea sirve para asignar $reporter->id al campo "reporter_id".
            'reporter_id' => $reporter->id,
            // Esta línea sirve para asignar 'chat_message' al campo "reportable_type".
            'reportable_type' => 'chat_message',
            // Esta línea sirve para asignar 1 al campo "reportable_id".
            'reportable_id' => 1,
            // Esta línea sirve para asignar 'abuse' al campo "reason".
            'reason' => 'abuse',
            // Esta línea sirve para asignar $status al campo "status".
            'status' => $status,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede ver los reportes.
    public function test_non_admin_cannot_access_reports(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/reports como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/reports')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el listado muestra por defecto solo los pendientes.
    public function test_index_defaults_to_pending_only(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $reporter = User::factory()->create();
        // Esta línea sirve para crear un reporte pendiente.
        $this->makeReport($reporter, 'pending');
        // Esta línea sirve para crear un reporte resuelto.
        $this->makeReport($reporter, 'resolved');

        // Esta línea sirve para hacer GET a /api/v1/admin/reports autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/reports');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
        // Esta línea sirve para exigir que "data.0.status" sea exactamente 'pending'.
        $this->assertSame('pending', $response->json('data.0.status'));
    }

    // Esta línea sirve para declarar el test que comprueba que con status=all se listan todos.
    public function test_index_with_status_all_returns_everything(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $reporter = User::factory()->create();
        // Esta línea sirve para crear un reporte pendiente.
        $this->makeReport($reporter, 'pending');
        // Esta línea sirve para crear un reporte resuelto.
        $this->makeReport($reporter, 'resolved');

        // Esta línea sirve para hacer GET a /api/v1/admin/reports?status=all autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/reports?status=all');

        // Esta línea sirve para exigir que "data" tenga 2 elementos.
        $this->assertCount(2, $response->json('data'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede resolver un reporte.
    public function test_admin_can_resolve_a_report(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $reporter = User::factory()->create();
        // Esta línea sirve para crear un reporte pendiente.
        $report = $this->makeReport($reporter);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH para resolver el reporte con estos datos.
            ->patchJson("/api/v1/admin/reports/{$report->id}/resolve", [
                // Esta línea sirve para asignar 'resolved' al campo "status".
                'status' => 'resolved',
                // Esta línea sirve para asignar 'Advertencia enviada.' al campo "resolution_notes".
                'resolution_notes' => 'Advertencia enviada.',
            ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.status" sea exactamente 'resolved'.
        $this->assertSame('resolved', $response->json('data.status'));
        // Esta línea sirve para exigir que "data.resolved_by.id" sea exactamente $admin->id.
        $this->assertSame($admin->id, $response->json('data.resolved_by.id'));
        // Esta línea sirve para exigir que "data.resolved_at" no sea null.
        $this->assertNotNull($response->json('data.resolved_at'));
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza un estado inválido al resolver.
    public function test_resolve_rejects_an_invalid_status(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $reporter = User::factory()->create();
        // Esta línea sirve para crear un reporte pendiente.
        $report = $this->makeReport($reporter);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/reports/{$report->id}/resolve con los datos enviados.
            ->patchJson("/api/v1/admin/reports/{$report->id}/resolve", ['status' => 'pending'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }
}
