<?php

namespace Tests\Feature\Admin;

use App\Models\NewsPromotion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminNewsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_manage_news(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/news', [
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción',
        ])->assertForbidden();
    }

    public function test_admin_can_create_a_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/news', [
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción',
        ]);

        $response->assertCreated();
        $this->assertFalse($response->json('data.published'));
        $this->assertNull($response->json('data.published_at'));
    }

    public function test_admin_can_create_and_publish_immediately(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/news', [
            'title' => 'Nueva funcionalidad', 'body' => 'Descripción', 'published' => true,
        ]);

        $response->assertCreated();
        $this->assertTrue($response->json('data.published'));
        $this->assertNotNull($response->json('data.published_at'));
    }

    public function test_admin_can_toggle_publish_on_a_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $news = NewsPromotion::query()->create([
            'admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/news/{$news->id}", ['published' => true]);

        $response->assertOk();
        $this->assertTrue($response->json('data.published'));
    }

    public function test_admin_can_unpublish(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $news = NewsPromotion::query()->create([
            'admin_id' => $admin->id, 'title' => 'Activa', 'body' => 'x', 'published_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/news/{$news->id}", ['published' => false]);

        $response->assertOk();
        $this->assertFalse($response->json('data.published'));
    }

    public function test_admin_can_delete_news(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $news = NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'x', 'body' => 'x']);

        $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/news/{$news->id}")->assertNoContent();
        $this->assertDatabaseMissing('news_promotions', ['id' => $news->id]);
    }

    public function test_admin_index_includes_drafts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x']);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/news');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_public_news_index_only_shows_published(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Borrador', 'body' => 'x', 'published_at' => null]);
        NewsPromotion::query()->create(['admin_id' => $admin->id, 'title' => 'Publicada', 'body' => 'x', 'published_at' => now()]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/news');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Publicada', $response->json('data.0.title'));
    }
}
