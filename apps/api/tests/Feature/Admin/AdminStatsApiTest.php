<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminStatsApiTest.
class AdminStatsApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede ver las estadísticas.
    public function test_non_admin_cannot_access_stats(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/stats como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/stats')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba la forma de las métricas globales.
    public function test_admin_gets_global_metrics_shape(): void
    {
        // Esta línea sirve para crear un super admin activo ahora.
        $admin = User::factory()->create(['role' => 'super_admin', 'last_active_at' => now()]);
        // Esta línea sirve para crear un entrenador activo ahora.
        User::factory()->create(['role' => 'trainer', 'last_active_at' => now()]);
        // Esta línea sirve para crear un usuario baneado.
        User::factory()->create(['is_banned' => true]);

        // Esta línea sirve para hacer GET a /api/v1/admin/stats autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/stats');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta tenga esta estructura.
        $response->assertJsonStructure(['data' => [
            // Esta línea sirve para exigir las claves de usuarios, nuevos, entrenadores y baneados.
            'total_users', 'new_users_7d', 'trainers_count', 'banned_users_count',
            // Esta línea sirve para exigir las claves de reportes, DAU, WAU, MAU y retención.
            'pending_reports_count', 'dau', 'wau', 'mau', 'retention_pct',
        ]]);
        // Esta línea sirve para exigir que "data.total_users" sea exactamente 3.
        $this->assertSame(3, $response->json('data.total_users'));
        // Esta línea sirve para exigir que "data.trainers_count" sea exactamente 1.
        $this->assertSame(1, $response->json('data.trainers_count'));
        // Esta línea sirve para exigir que "data.banned_users_count" sea exactamente 1.
        $this->assertSame(1, $response->json('data.banned_users_count'));
        // Esta línea sirve para exigir que "data.dau" sea exactamente 2.
        $this->assertSame(2, $response->json('data.dau'));
    }
}
