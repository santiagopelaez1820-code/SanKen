<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo NewsPromotion.
use App\Models\NewsPromotion;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminNewsApiTest.
class AdminNewsApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar noticias.
    public function test_non_admin_cannot_manage_news(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/news como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/news', [
            // Esta línea sirve para enviar el título y el cuerpo.
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción',
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 403 (prohibido).
        ])->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear un borrador.
    public function test_admin_can_create_a_draft(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para hacer POST a /api/v1/admin/news autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/news', [
            // Esta línea sirve para enviar el título y el cuerpo.
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.published" sea falso.
        $this->assertFalse($response->json('data.published'));
        // Esta línea sirve para exigir que "data.published_at" sea null.
        $this->assertNull($response->json('data.published_at'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear y publicar de inmediato.
    public function test_admin_can_create_and_publish_immediately(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para hacer POST a /api/v1/admin/news autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/news', [
            // Esta línea sirve para enviar el título, el cuerpo y publicarla.
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción', 'published' => true,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.published" sea verdadero.
        $this->assertTrue($response->json('data.published'));
        // Esta línea sirve para exigir que "data.published_at" no sea null.
        $this->assertNotNull($response->json('data.published_at'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede publicar un borrador.
    public function test_admin_can_toggle_publish_on_a_draft(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una noticia sin publicar.
        $news = NewsPromotion::query()->create([
            // Esta línea sirve para asignar el admin, el título, el cuerpo y dejarla sin publicar.
            'admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null,
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/news/{$news->id} con los datos enviados.
            ->patchJson("/api/v1/admin/news/{$news->id}", ['published' => true]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.published" sea verdadero.
        $this->assertTrue($response->json('data.published'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede despublicar.
    public function test_admin_can_unpublish(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una noticia publicada.
        $news = NewsPromotion::query()->create([
            // Esta línea sirve para asignar el admin, el título, el cuerpo y publicarla ahora.
            'admin_id' => $admin->id, 'title' => 'Activa', 'body' => 'x', 'published_at' => now(),
        ]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/news/{$news->id} con los datos enviados.
            ->patchJson("/api/v1/admin/news/{$news->id}", ['published' => false]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.published" sea falso.
        $this->assertFalse($response->json('data.published'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede borrar una noticia.
    public function test_admin_can_delete_news(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear una noticia.
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'x', 'body' => 'x']);

        // Esta línea sirve para hacer la petición a /api/v1/admin/news/{$news->id} como admin y exigir que responda 204.
        $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/news/{$news->id}")->assertNoContent();
        // Esta línea sirve para exigir que la tabla news_promotions no tenga ese registro.
        $this->assertDatabaseMissing('news_promotions', ['id' => $news->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que el listado del admin incluye los borradores.
    public function test_admin_index_includes_drafts(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un borrador.
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x']);

        // Esta línea sirve para hacer GET a /api/v1/admin/news autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/news');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
    }
}
