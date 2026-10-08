<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminAuditLogApiTest.
class AdminAuditLogApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede ver la auditoría.
    public function test_non_admin_cannot_access_audit_logs(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/audit-logs como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/audit-logs')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve lo que ya registró Spatie.
    public function test_admin_sees_activity_already_logged_by_spatie(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // La propia acción de banear (User::update de is_banned) ya queda
        // registrada por LogsActivity — no hace falta un seed manual.
        // Esta línea sirve para hacer la petición a /api/v1/admin/users/{$user->id}/ban como admin y exigir que responda 200.
        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/users/{$user->id}/ban")->assertOk();

        // Esta línea sirve para hacer GET a /api/v1/admin/audit-logs autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/audit-logs');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para convertir la lista de registros en una colección.
        $entries = collect($response->json('data'));
        // Esta línea sirve para exigir que haya algún registro sobre el usuario baneado.
        $this->assertTrue($entries->contains(fn ($entry) => $entry['subject_id'] === $user->id));
    }
}
